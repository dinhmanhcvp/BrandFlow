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
        {cols}, _source_table VARCHAR, _source_row INTEGER, _file VARCHAR
      )""")


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
  columns = [{"name": n, "original": o} for n, o in zip(raw_names, table.columns)]
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


def load_canonical(con, raw_table: str, recipe: MappingRecipe) -> int:
  """Nạp lại (idempotent) các dòng 'data' của raw_table vào bảng chuẩn theo recipe."""
  clear_canonical_rows(con, raw_table)
  if recipe.entity not in ENTITIES or not recipe.column_map:
    return 0
  meta = table_meta(con, raw_table)
  if not meta:
    return 0
  original_to_raw = {c["original"]: c["name"] for c in meta["columns"]}
  entity = ENTITIES[recipe.entity]
  pairs = [(original_to_raw[src], canon) for src, canon in recipe.column_map.items()
           if src in original_to_raw and canon in entity.columns]
  if not pairs:
    return 0

  select = ", ".join(f'"{raw}"' for raw, _ in pairs)
  fetched = con.execute(
    f'SELECT "_row", "_kind", {select} FROM "{raw_table}" WHERE "_kind" IN (\'data\', \'group\') ORDER BY "_row"'
  ).fetchall()
  aggregates = meta.get("aggregates") or {}
  number_canons = {c for _, c in pairs if entity.columns[c].type == "number"}

  # Dòng nhóm: bỏ ô là tổng dòng con; chỉ giữ dòng nhóm nếu còn số liệu riêng (vd. ngân sách cấp nhóm)
  rows = []
  for r in fetched:
    values = list(r[2:])
    if r[1] == "group":
      masked = set(aggregates.get(str(r[0]), []))
      values = [None if raw in masked else v for (raw, _), v in zip(pairs, values)]
      if not any(v is not None for (_, canon), v in zip(pairs, values) if canon in number_canons):
        continue
    rows.append((r[0], *values))

  data: Dict[str, Any] = {}
  for j, (_, canon) in enumerate(pairs, start=1):
    ctype = entity.columns[canon].type
    converted = [_convert(r[j], ctype, canon) for r in rows]
    if ctype == "number":
      data[canon] = pd.array(converted, dtype="Float64")
    else:
      data[canon] = pd.array(converted, dtype="string")
  data["_source_table"] = pd.array([raw_table] * len(rows), dtype="string")
  data["_source_row"] = pd.array([r[0] for r in rows], dtype="Int64")
  data["_file"] = pd.array([meta["filename"]] * len(rows), dtype="string")
  df = pd.DataFrame(data)

  target_cols = [canon for _, canon in pairs] + ["_source_table", "_source_row", "_file"]
  col_sql = ", ".join(f'"{c}"' for c in target_cols)
  con.register("_incoming", df)
  try:
    con.execute(f"INSERT INTO {entity.name} ({col_sql}) SELECT {col_sql} FROM _incoming")
  finally:
    con.unregister("_incoming")
  return len(rows)


def insert_org_profile(con, pairs: List[Tuple[str, Any, int]], filename: str, sheet: str) -> None:
  for key, value, row in pairs:
    con.execute(f"INSERT INTO {ORG_PROFILE_TABLE} VALUES (?, ?, ?, ?, ?)",
                [str(key), _to_text(value), filename, sheet, row])


def insert_note(con, file_id: str, filename: str, sheet: str, cell_range: str, text: str) -> None:
  con.execute("INSERT INTO _notes VALUES (?, ?, ?, ?, ?)", [file_id, filename, sheet, cell_range, text])
