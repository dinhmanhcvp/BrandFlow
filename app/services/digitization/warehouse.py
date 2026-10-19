"""
Kho dữ liệu per-tenant trên DuckDB (một file .duckdb mỗi tenant — DuckDB không có Row-Level Security,
nên cách ly bằng file; bản Postgres + RLS là việc của giai đoạn sau).

Các lớp:
 • _files / _tables / _recipes / _notes — danh mục (catalog) + lineage
 • raw_*         — bảng đã làm sạch cấu trúc, giữ nguyên ngữ nghĩa cột gốc (truy vấn được kể cả khi chưa map)
 • <entity>      — bảng chuẩn (sales_line, budget_plan...) nạp theo recipe, mỗi dòng mang _source_table/_source_row
 • org_profile   — cặp khóa–giá trị dạng form
"""

import json
import os
import re
import threading
from contextlib import contextmanager
from datetime import date, datetime
from typing import Any, Dict, Iterator, List, Optional, Tuple

import duckdb
import pandas as pd

from app.services.digitization.canonical import ENTITIES, ORG_PROFILE_TABLE
from app.services.digitization.normalizers_vi import (
  normalize_phone, parse_date, parse_number, parse_number_or_range_mid, parse_period, slugify,
)
from app.services.digitization.profiler import ColumnProfile
from app.services.digitization.schema_mapper import MappingRecipe
from app.services.digitization.structure_detector import DetectedTable

_SQL_TYPES = {"text": "VARCHAR", "number": "DOUBLE", "date": "DATE", "period": "VARCHAR"}
_locks: Dict[str, threading.RLock] = {}
_locks_guard = threading.Lock()


def warehouse_dir() -> str:
  return os.getenv("BRANDFLOW_WAREHOUSE_DIR", "./data_warehouse")


def tenant_db_path(tenant_id: str) -> str:
  if not tenant_id:
    raise ValueError("tenant_id bắt buộc")
  safe = re.sub(r"[^A-Za-z0-9_-]", "_", tenant_id)[:80]
  return os.path.join(warehouse_dir(), f"{safe}.duckdb")


def _lock_for(tenant_id: str) -> threading.RLock:
  with _locks_guard:
    return _locks.setdefault(tenant_id, threading.RLock())


@contextmanager
def connect(tenant_id: str, read_only: bool = False) -> Iterator[duckdb.DuckDBPyConnection]:
  """
  Một tenant ↔ một file. Khóa theo tenant vì DuckDB chỉ cho một writer.
  Kết nối read-only tắt truy cập file ngoài (read_csv, ATTACH...) để SQL do agent sinh ra không thoát khỏi kho.
  """
  path = tenant_db_path(tenant_id)
  os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
  with _lock_for(tenant_id):
    if read_only and not os.path.exists(path):
      with duckdb.connect(path) as init_con:
        init_schema(init_con)
    con = duckdb.connect(path, read_only=read_only,
                         config={"enable_external_access": False} if read_only else {})
    try:
      if not read_only:
        init_schema(con)
      yield con
    finally:
      con.close()


def init_schema(con: duckdb.DuckDBPyConnection) -> None:
  con.execute("""
    CREATE TABLE IF NOT EXISTS _files (
      file_id VARCHAR PRIMARY KEY, filename VARCHAR, file_hash VARCHAR UNIQUE, uploaded_at TIMESTAMP,
      sheet_count INTEGER, table_count INTEGER, row_count BIGINT, empty_sheets VARCHAR, status VARCHAR
    )""")
  con.execute("""
    CREATE TABLE IF NOT EXISTS _tables (
      table_name VARCHAR PRIMARY KEY, file_id VARCHAR, filename VARCHAR, sheet VARCHAR, cell_range VARCHAR,
      header_signature VARCHAR, recipe_id VARCHAR, entity VARCHAR, row_count INTEGER, data_row_count INTEGER,
      columns_json VARCHAR, profile_json VARCHAR, context_json VARCHAR, formulas_json VARCHAR,
      period_columns_json VARCHAR, issues_json VARCHAR, aggregates_json VARCHAR, created_at TIMESTAMP
    )""")
  con.execute("""
    CREATE TABLE IF NOT EXISTS _recipes (
      recipe_id VARCHAR PRIMARY KEY, header_signature VARCHAR UNIQUE, entity VARCHAR, recipe_json VARCHAR,
      confidence DOUBLE, source VARCHAR, confirmed BOOLEAN, created_at TIMESTAMP, updated_at TIMESTAMP
    )""")
  con.execute("""
    CREATE TABLE IF NOT EXISTS _notes (
      file_id VARCHAR, filename VARCHAR, sheet VARCHAR, cell_range VARCHAR, text VARCHAR
    )""")
  con.execute(f"""
    CREATE TABLE IF NOT EXISTS {ORG_PROFILE_TABLE} (
      key VARCHAR, value VARCHAR, _file VARCHAR, _sheet VARCHAR, _source_row INTEGER
    )""")
  for entity in ENTITIES.values():
    cols = ", ".join(f'"{name}" {_SQL_TYPES[col.type]}' for name, col in entity.columns.items())
    con.execute(f"""
      CREATE TABLE IF NOT EXISTS {entity.name} (
        {cols}, _source_table VARCHAR, _source_row INTEGER, _file VARCHAR, _source_column VARCHAR
      )""")
    # Kho tạo trước khi có unpivot: thêm cột lineage tới ô (header cột Excel gốc của giá trị)
    con.execute(f"ALTER TABLE {entity.name} ADD COLUMN IF NOT EXISTS _source_column VARCHAR")


# ─── Files ───────────────────────────────────────────────────────────────────

def find_file_by_hash(con, file_hash: str) -> Optional[Dict[str, Any]]:
  row = con.execute("SELECT file_id, filename, uploaded_at FROM _files WHERE file_hash = ?", [file_hash]).fetchone()
  return {"file_id": row[0], "filename": row[1], "uploaded_at": str(row[2])} if row else None


def record_file(con, file_id: str, filename: str, file_hash: str, sheet_count: int, table_count: int,
                row_count: int, empty_sheets: List[str]) -> None:
  con.execute(
    "INSERT INTO _files VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'digitized')",
    [file_id, filename, file_hash, datetime.now(), sheet_count, table_count, row_count,
     json.dumps(empty_sheets, ensure_ascii=False)],
  )


# ─── Recipes ─────────────────────────────────────────────────────────────────

def get_recipe_by_signature(con, signature: str) -> Optional[MappingRecipe]:
  row = con.execute("SELECT recipe_json FROM _recipes WHERE header_signature = ?", [signature]).fetchone()
  return MappingRecipe.from_dict(json.loads(row[0])) if row else None


def get_recipe(con, recipe_id: str) -> Optional[MappingRecipe]:
  row = con.execute("SELECT recipe_json FROM _recipes WHERE recipe_id = ?", [recipe_id]).fetchone()
  return MappingRecipe.from_dict(json.loads(row[0])) if row else None


def save_recipe(con, recipe: MappingRecipe) -> None:
  now = datetime.now()
  payload = json.dumps(recipe.to_dict(), ensure_ascii=False)
  con.execute("DELETE FROM _recipes WHERE recipe_id = ? OR header_signature = ?",
              [recipe.recipe_id, recipe.header_signature])
  con.execute(
    "INSERT INTO _recipes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [recipe.recipe_id, recipe.header_signature, recipe.entity, payload, recipe.confidence, recipe.source,
     recipe.confirmed, now, now],
  )


# ─── Raw tables ──────────────────────────────────────────────────────────────

def next_table_name(con, sheet: str) -> str:
  n = con.execute("SELECT COUNT(*) FROM _tables").fetchone()[0] + 1
  base = f"raw_{n:04d}_{slugify(sheet, 'sheet')[:24]}"
  name, i = base, 1
  existing = {r[0] for r in con.execute("SELECT table_name FROM _tables").fetchall()}
  while name in existing:
    i += 1
    name = f"{base}_{i}"
  return name


def raw_column_names(columns: List[str]) -> List[str]:
  names, seen = [], set()
  for c in columns:
    base = slugify(c)
    name, i = base, 1
    while name in seen or name.startswith("_"):
      i += 1
      name = f"{base}_{i}"
    seen.add(name)
    names.append(name)
  return names


def _to_text(value: Any) -> Optional[str]:
  if value is None:
    return None
  if isinstance(value, float) and value.is_integer():
    return str(int(value))
  if isinstance(value, (datetime, date)):
    return value.isoformat()
  return str(value)


def create_raw_table(con, table: DetectedTable, profiles: List[ColumnProfile], table_name: str) -> List[str]:
  """Tạo raw_* có kiểu theo profile. Giá trị không parse được của cột số được giữ ở cột <tên>__raw."""
  names = raw_column_names(table.columns)
  data: Dict[str, Any] = {"_row": pd.array(table.row_numbers, dtype="Int64"),
                          "_kind": pd.array(table.row_kinds, dtype="string")}
  ddl = ['"_row" INTEGER', '"_kind" VARCHAR']
  for i, (name, profile) in enumerate(zip(names, profiles)):
    values = [row[i] for row in table.rows]
    if profile.inferred_type == "number":
      parsed = [parse_number(v) for v in values]
      data[name] = pd.array(parsed, dtype="Float64")
      ddl.append(f'"{name}" DOUBLE')
      leftovers = [_to_text(v) if p is None and v is not None else None for v, p in zip(values, parsed)]
      if any(leftovers):
        data[f"{name}__raw"] = pd.array(leftovers, dtype="string")
        ddl.append(f'"{name}__raw" VARCHAR')
    elif profile.inferred_type == "date":
      parsed = [v.isoformat() if isinstance(v, date) else None
                for v in (parse_date(x) for x in values)]
      data[name] = pd.array(parsed, dtype="string")
      ddl.append(f'"{name}" DATE')
    else:
      data[name] = pd.array([_to_text(v) for v in values], dtype="string")
      ddl.append(f'"{name}" VARCHAR')

  df = pd.DataFrame(data)
  con.execute(f'CREATE TABLE "{table_name}" ({", ".join(ddl)})')
  con.register("_incoming", df)
  try:
    con.execute(f'INSERT INTO "{table_name}" SELECT * FROM _incoming')
  finally:
    con.unregister("_incoming")
  return names


def register_table(con, table_name: str, file_id: str, filename: str, table: DetectedTable,
                   profiles: List[ColumnProfile], raw_names: List[str], recipe: Optional[MappingRecipe],
                   issues: List[Dict[str, Any]]) -> None:
  letters = table.column_letters or [None] * len(raw_names)
  columns = [{"name": n, "original": o, "letter": l} for n, o, l in zip(raw_names, table.columns, letters)]
  # {số dòng Excel: [tên cột raw]} — ô của dòng nhóm là tổng dòng con
  aggregates = {str(table.row_numbers[i]): [raw_names[c] for c in cols]
                for i, cols in table.aggregate_cells.items()}
  con.execute(
    "INSERT INTO _tables VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [table_name, file_id, filename, table.sheet, table.cell_range,
     recipe.header_signature if recipe else None, recipe.recipe_id if recipe else None,
     recipe.entity if recipe else None, len(table.rows), table.data_row_count,
     json.dumps(columns, ensure_ascii=False),
     json.dumps([p.to_dict() for p in profiles], ensure_ascii=False, default=str),
     json.dumps(table.context, ensure_ascii=False), json.dumps(table.formulas, ensure_ascii=False),
     json.dumps(table.period_columns, ensure_ascii=False), json.dumps(issues, ensure_ascii=False, default=str),
     json.dumps(aggregates), datetime.now()],
  )


def table_meta(con, table_name: str) -> Optional[Dict[str, Any]]:
  row = con.execute(
    "SELECT table_name, file_id, filename, sheet, cell_range, header_signature, recipe_id, entity, row_count, "
    "data_row_count, columns_json, profile_json, context_json, formulas_json, issues_json, aggregates_json "
    "FROM _tables "
    "WHERE table_name = ?", [table_name]).fetchone()
  if not row:
    return None
  keys = ["table_name", "file_id", "filename", "sheet", "cell_range", "header_signature", "recipe_id", "entity",
          "row_count", "data_row_count", "columns", "profiles", "context", "formulas", "issues", "aggregates"]
  meta = dict(zip(keys, row))
  for k in ("columns", "profiles", "context", "formulas", "issues", "aggregates"):
    meta[k] = json.loads(meta[k]) if meta[k] else []
  return meta


# ─── Canonical load ──────────────────────────────────────────────────────────

def _convert(value: Any, target_type: str, canonical_name: str = "") -> Any:
  if value is None:
    return None
  if "phone" in canonical_name:
    return normalize_phone(value) or _to_text(value)
  if target_type == "number":
    return parse_number_or_range_mid(value)
  if target_type == "date":
    d = parse_date(value)
    return d.isoformat() if d else None
  if target_type == "period":
    return parse_period(value)
  return _to_text(value)


def clear_canonical_rows(con, raw_table: str) -> None:
  for entity in ENTITIES:
    con.execute(f"DELETE FROM {entity} WHERE _source_table = ?", [raw_table])


def _mask_group_rows(fetched: List[tuple], raws: List[str], number_raws: set,
                     aggregates: Dict[str, List[str]]) -> List[tuple]:
  """
  Dòng nhóm: bỏ ô là tổng dòng con; chỉ giữ dòng nhóm nếu còn số liệu riêng (vd. ngân sách cấp nhóm).
  fetched = (_row, _kind, *giá trị theo raws) → trả về (_row, *giá trị).
  """
  rows = []
  for r in fetched:
    values = list(r[2:])
    if r[1] == "group":
      masked = set(aggregates.get(str(r[0]), []))
      values = [None if raw in masked else v for raw, v in zip(raws, values)]
      if not any(v is not None for raw, v in zip(raws, values) if raw in number_raws):
        continue
    rows.append((r[0], *values))
  return rows


def _insert_canonical(con, entity_name: str, columns: List[str], types: List[str], rows: List[tuple]) -> int:
  """rows = (giá trị đã chuyển kiểu theo columns..., _source_table, _source_row, _file, _source_column)."""
  data: Dict[str, Any] = {}
  for j, (canon, ctype) in enumerate(zip(columns, types)):
    data[canon] = pd.array([r[j] for r in rows], dtype="Float64" if ctype == "number" else "string")
  n = len(columns)
  data["_source_table"] = pd.array([r[n] for r in rows], dtype="string")
  data["_source_row"] = pd.array([r[n + 1] for r in rows], dtype="Int64")
  data["_file"] = pd.array([r[n + 2] for r in rows], dtype="string")
  data["_source_column"] = pd.array([r[n + 3] for r in rows], dtype="string")
  df = pd.DataFrame(data)

  target_cols = list(columns) + ["_source_table", "_source_row", "_file", "_source_column"]
  col_sql = ", ".join(f'"{c}"' for c in target_cols)
  con.register("_incoming", df)
  try:
    con.execute(f"INSERT INTO {entity_name} ({col_sql}) SELECT {col_sql} FROM _incoming")
  finally:
    con.unregister("_incoming")
  return len(rows)


def _fetch_rows(con, raw_table: str, raws: List[str]) -> List[tuple]:
  select = ", ".join(f'"{raw}"' for raw in raws)
  return con.execute(
    f'SELECT "_row", "_kind", {select} FROM "{raw_table}" WHERE "_kind" IN (\'data\', \'group\') ORDER BY "_row"'
  ).fetchall()


_YEAR_RE = re.compile(r"(?<!\d)(19\d{2}|20\d{2})(?!\d)")


def unpivot_periods(period_columns: List[str], context_texts: List[str]) -> Dict[str, Optional[str]]:
  """
  Header cột kỳ → kỳ chuẩn. 'Tháng 10' chỉ cho 'M10'; nếu tiêu đề/tên file nêu đúng MỘT năm thì gắn năm
  ('2026-10'), và tháng nhỏ hơn tháng trước (T12 → T1) thì sang năm sau.
  """
  years = {m for text in context_texts for m in _YEAR_RE.findall(str(text or ""))}
  year = int(years.pop()) if len(years) == 1 else None
  out: Dict[str, Optional[str]] = {}
  prev = {"M": 0, "Q": 0}
  bump = 0
  for src in period_columns:
    label = parse_period(src.split(".")[-1]) or parse_period(src)
    if label and year and re.fullmatch(r"[MQ]\d{1,2}", label):
      kind, n = label[0], int(label[1:])
      if n < prev[kind]:
        bump += 1
      prev[kind] = n
      label = f"{year + bump}-{n:02d}" if kind == "M" else f"{year + bump}-Q{n}"
    out[src] = label
  return out


def load_canonical(con, raw_table: str, recipe: MappingRecipe) -> int:
  """Nạp lại (idempotent) các dòng 'data' của raw_table vào bảng chuẩn theo recipe."""
  clear_canonical_rows(con, raw_table)
  if recipe.entity not in ENTITIES or not (recipe.column_map or recipe.unpivot):
    return 0
  meta = table_meta(con, raw_table)
  if not meta:
    return 0
  if recipe.unpivot:
    return _load_unpivoted(con, raw_table, recipe, meta)
  original_to_raw = {c["original"]: c["name"] for c in meta["columns"]}
  entity = ENTITIES[recipe.entity]
  pairs = [(original_to_raw[src], canon) for src, canon in recipe.column_map.items()
           if src in original_to_raw and canon in entity.columns]
  if not pairs:
    return 0

  raws = [raw for raw, _ in pairs]
  number_raws = {raw for raw, c in pairs if entity.columns[c].type == "number"}
  rows = _mask_group_rows(_fetch_rows(con, raw_table, raws), raws, number_raws, meta.get("aggregates") or {})
  types = [entity.columns[c].type for _, c in pairs]
  converted = [
    (*(_convert(v, t, c) for v, t, (_, c) in zip(r[1:], types, pairs)), raw_table, r[0], meta["filename"], None)
    for r in rows
  ]
  return _insert_canonical(con, entity.name, [c for _, c in pairs], types, converted)


def _load_unpivoted(con, raw_table: str, recipe: MappingRecipe, meta: Dict[str, Any]) -> int:
  """
  Ma trận theo kỳ → dạng dài: mỗi (dòng Excel × kỳ) thành một dòng chuẩn. Lineage tới tận ô:
  _source_row = dòng Excel, _source_column = header cột kỳ gốc.
  """
  entity = ENTITIES[recipe.entity]
  original_to_raw = {c["original"]: c["name"] for c in meta["columns"]}
  periods = unpivot_periods(list(recipe.unpivot), [meta["filename"], meta["sheet"], *meta.get("context", [])])
  value_cols = [(src, original_to_raw[src], periods[src], canon) for src, canon in recipe.unpivot.items()
                if src in original_to_raw and periods.get(src) and canon in entity.columns
                and entity.columns[canon].type == "number"]
  if not value_cols:
    return 0
  value_targets = sorted({canon for *_, canon in value_cols})
  # Cột định danh không được ghi đè kỳ (lấy từ header) hay cột giá trị (lấy từ các ô kỳ)
  id_pairs = [(original_to_raw[src], canon) for src, canon in recipe.column_map.items()
              if src in original_to_raw and src not in recipe.unpivot and canon in entity.columns
              and canon != "period" and canon not in value_targets]

  raws = [raw for raw, _ in id_pairs] + [raw for _, raw, _, _ in value_cols]
  number_raws = {raw for _, raw, _, _ in value_cols}
  rows = _mask_group_rows(_fetch_rows(con, raw_table, raws), raws, number_raws, meta.get("aggregates") or {})

  id_types = [entity.columns[c].type for _, c in id_pairs]
  columns = [c for _, c in id_pairs] + ["period"] + value_targets
  types = id_types + ["period"] + ["number"] * len(value_targets)
  ordered_periods = list(dict.fromkeys(p for _, _, p, _ in value_cols))
  n_id = len(id_pairs)

  out = []
  for r in rows:
    excel_row, values = r[0], r[1:]
    ids = [_convert(v, t, c) for v, t, (_, c) in zip(values[:n_id], id_types, id_pairs)]
    cells = values[n_id:]
    for period in ordered_periods:
      picked: Dict[str, Any] = {}
      sources = []
      for (src, _, p, canon), v in zip(value_cols, cells):
        num = _convert(v, "number") if p == period else None
        if num is not None:
          picked[canon] = num
          sources.append(src)
      if not picked:
        continue  # ô trống = không có kế hoạch kỳ đó, không tạo dòng 0
      out.append((*ids, period, *(picked.get(t) for t in value_targets),
                  raw_table, excel_row, meta["filename"], ", ".join(sources)))
  return _insert_canonical(con, entity.name, columns, types, out)


def insert_org_profile(con, pairs: List[Tuple[str, Any, int]], filename: str, sheet: str) -> None:
  for key, value, row in pairs:
    con.execute(f"INSERT INTO {ORG_PROFILE_TABLE} VALUES (?, ?, ?, ?, ?)",
                [str(key), _to_text(value), filename, sheet, row])


def insert_note(con, file_id: str, filename: str, sheet: str, cell_range: str, text: str) -> None:
  con.execute("INSERT INTO _notes VALUES (?, ?, ?, ?, ?)", [file_id, filename, sheet, cell_range, text])
