"""
Công cụ cho agent truy cập kho dữ liệu — agent TRUY VẤN chứ không ĐỌC dữ liệu.

 • list_tables / describe_table — đọc catalog
 • get_metric   — chỉ số định nghĩa sẵn (ưu tiên dùng; định nghĩa do người viết, không do LLM)
 • query_sql    — SQL tự do nhưng: chỉ SELECT, kết nối read-only, chặn truy cập file ngoài, timeout, LIMIT
 • trace_lineage — con số này đến từ file/sheet/dòng nào
"""

import json
import re
import threading
from typing import Any, Dict, List, Optional

from app.services.digitization import warehouse as wh
from app.services.digitization.canonical import ENTITIES, ORG_PROFILE_TABLE
from app.services.digitization.firewall import Lineage, MetricResult
from app.services.digitization.schema_mapper import AUTO_ACCEPT_CONFIDENCE

MAX_ROWS = 200
QUERY_TIMEOUT_S = 10.0

_FORBIDDEN = re.compile(
  r"\b(attach|detach|copy|export|import|install|load|pragma|create|insert|update|delete|drop|alter|set|reset|"
  r"call|checkpoint|vacuum|use|begin|commit|rollback|grant|truncate|replace|"
  r"read_\w+|glob|\w*_scan|sniff_csv|query_table|query|getenv|duckdb_\w+|current_setting)\b",
  re.IGNORECASE,
)


class QueryError(ValueError):
  pass


def validate_sql(sql: str) -> str:
  text = (sql or "").strip().rstrip(";").strip()
  if not text:
    raise QueryError("SQL rỗng")
  if ";" in text:
    raise QueryError("Chỉ cho phép một câu lệnh")
  if "--" in text or "/*" in text:
    raise QueryError("Không cho phép comment trong SQL")
  if not re.match(r"^(select|with)\b", text, re.IGNORECASE):
    raise QueryError("Chỉ cho phép câu lệnh SELECT / WITH")
  found = _FORBIDDEN.search(re.sub(r"'[^']*'", "''", text))  # bỏ qua nội dung chuỗi literal
  if found:
    raise QueryError(f"Từ khóa/hàm không được phép: {found.group(0)}")
  return text


def _run_with_timeout(con, sql: str, params: Optional[List[Any]], timeout_s: float):
  timer = threading.Timer(timeout_s, con.interrupt)
  timer.start()
  try:
    cur = con.execute(sql, params or [])
    columns = [d[0] for d in cur.description] if cur.description else []
    return columns, cur.fetchall()
  except Exception as e:
    if "interrupt" in str(e).lower():
      raise QueryError(f"Truy vấn vượt quá {timeout_s:.0f}s") from e
    raise QueryError(f"Lỗi SQL: {e}") from e
  finally:
    timer.cancel()


def _jsonable(value: Any) -> Any:
  if isinstance(value, float) and value != value:
    return None
  if isinstance(value, (int, float, str, bool)) or value is None:
    return value
  return str(value)


def query_sql(tenant_id: str, sql: str, max_rows: int = MAX_ROWS) -> Dict[str, Any]:
  text = validate_sql(sql)
  max_rows = max(1, min(int(max_rows), MAX_ROWS))
  wrapped = f"SELECT * FROM ({text}) AS q LIMIT {max_rows + 1}"
  with wh.connect(tenant_id, read_only=True) as con:
    columns, rows = _run_with_timeout(con, wrapped, None, QUERY_TIMEOUT_S)
  truncated = len(rows) > max_rows
  rows = rows[:max_rows]
  return {
    "sql": text, "columns": columns, "row_count": len(rows), "truncated": truncated,
    "rows": [dict(zip(columns, map(_jsonable, r))) for r in rows],
  }


# ─── Catalog ─────────────────────────────────────────────────────────────────

def list_tables(tenant_id: str) -> Dict[str, Any]:
  with wh.connect(tenant_id, read_only=True) as con:
    canonical = []
    for entity in ENTITIES.values():
      count = con.execute(f"SELECT COUNT(*) FROM {entity.name}").fetchone()[0]
      if count:
        sources = con.execute(f"SELECT COUNT(DISTINCT _source_table) FROM {entity.name}").fetchone()[0]
        canonical.append({"table": entity.name, "description": entity.description, "rows": count,
                          "source_tables": sources})
    kv = con.execute(f"SELECT COUNT(*) FROM {ORG_PROFILE_TABLE}").fetchone()[0]
    raw = [
      {"table": r[0], "file": r[1], "sheet": r[2], "range": r[3], "entity": r[4], "rows": r[5],
       "columns": [c["original"] for c in json.loads(r[6])]}
      for r in con.execute(
        "SELECT table_name, filename, sheet, cell_range, entity, data_row_count, columns_json "
        "FROM _tables ORDER BY created_at, table_name").fetchall()
    ]
    files = con.execute("SELECT COUNT(*), COALESCE(SUM(row_count), 0) FROM _files").fetchone()
  return {"files": files[0], "data_rows": int(files[1]), "canonical_tables": canonical,
          "org_profile_rows": kv, "raw_tables": raw}


def describe_table(tenant_id: str, name: str, sample_rows: int = 5) -> Dict[str, Any]:
  with wh.connect(tenant_id, read_only=True) as con:
    if name in ENTITIES:
      entity = ENTITIES[name]
      count = con.execute(f"SELECT COUNT(*) FROM {name}").fetchone()[0]
      cols, rows = _run_with_timeout(con, f"SELECT * FROM {name} LIMIT {int(sample_rows)}", None, QUERY_TIMEOUT_S)
      return {
        "table": name, "kind": "canonical", "description": entity.description, "rows": count,
        "columns": [{"name": c, "type": col.type, "description": col.description}
                    for c, col in entity.columns.items()]
                   + [{"name": "_source_table", "type": "text", "description": "Bảng raw nguồn (lineage)"},
                      {"name": "_source_row", "type": "number", "description": "Số dòng Excel nguồn"},
                      {"name": "_file", "type": "text", "description": "Tên file nguồn"},
                      {"name": "_source_column", "type": "text",
                       "description": "Header cột Excel nguồn của giá trị (bảng ma trận theo kỳ đã unpivot)"}],
        "sample": [dict(zip(cols, map(_jsonable, r))) for r in rows],
      }
    meta = wh.table_meta(con, name)
    if meta is None:
      raise QueryError(f"Không có bảng '{name}'")
    cols, rows = _run_with_timeout(con, f'SELECT * FROM "{name}" LIMIT {int(sample_rows)}', None, QUERY_TIMEOUT_S)
    profiles = {p["name"]: p for p in meta["profiles"]}
    return {
      "table": name, "kind": "raw", "file": meta["filename"], "sheet": meta["sheet"], "range": meta["cell_range"],
      "entity": meta["entity"], "rows": meta["row_count"], "context": meta["context"],
      "formulas": meta["formulas"], "issues": meta["issues"],
      "columns": [{"name": c["name"], "original": c["original"],
                   "type": profiles.get(c["original"], {}).get("inferred_type"),
                   "unit": profiles.get(c["original"], {}).get("unit_guess")} for c in meta["columns"]]
                 + [{"name": "_row", "original": "(số dòng Excel)"},
                    {"name": "_kind", "original": "(data | subtotal | group | footer)"}],
      "sample": [dict(zip(cols, map(_jsonable, r))) for r in rows],
    }


# ─── Metrics (semantic layer) ────────────────────────────────────────────────

METRICS: Dict[str, Dict[str, str]] = {
  "revenue": {"table": "sales_line", "expr": "SUM(revenue)", "unit": "VND", "description": "Tổng doanh thu"},
  "orders": {"table": "sales_line", "expr": "COUNT(DISTINCT order_id)", "unit": "đơn", "description": "Số đơn"},
  "quantity": {"table": "sales_line", "expr": "SUM(quantity)", "unit": "sản phẩm", "description": "Số lượng bán"},
  "avg_order_value": {"table": "sales_line", "expr": "SUM(revenue) / NULLIF(COUNT(DISTINCT order_id), 0)",
                      "unit": "VND", "description": "Giá trị đơn trung bình"},
  "customers": {"table": "sales_line", "expr": "COUNT(DISTINCT COALESCE(customer_phone, customer_name))",
                "unit": "khách", "description": "Số khách mua"},
  "planned_budget": {"table": "budget_plan", "expr": "SUM(planned_amount)", "unit": "VND",
                     "description": "Ngân sách kế hoạch (cộng theo từng bảng nguồn — các phiên bản kế hoạch khác nhau không nên cộng chung)"},
  "marketing_spend": {"table": "marketing_spend", "expr": "SUM(amount)", "unit": "VND",
                      "description": "Chi phí marketing thực tế"},
  "outlets": {"table": "store_outlet", "expr": "SUM(outlet_count)", "unit": "điểm bán",
              "description": "Số điểm bán"},
}
_TIME_GRAINS = {"month": "strftime(date, '%Y-%m')", "year": "strftime(date, '%Y')",
                "quarter": "strftime(date, '%Y') || '-Q' || CAST(quarter(date) AS VARCHAR)"}


def get_metric(tenant_id: str, name: str, group_by: Optional[List[str]] = None,
               date_from: Optional[str] = None, date_to: Optional[str] = None,
               filters: Optional[Dict[str, Any]] = None, limit: int = 50) -> MetricResult:
  if name not in METRICS:
    raise QueryError(f"Chỉ số '{name}' chưa định nghĩa. Có: {', '.join(METRICS)}")
  metric = METRICS[name]
  entity = ENTITIES[metric["table"]]
  allowed = set(entity.columns) | {"_source_table", "_file"}
  has_date = "date" in entity.columns

  select_parts, group_parts = [], []
  for g in group_by or []:
    if g in _TIME_GRAINS and has_date:
      select_parts.append(f"{_TIME_GRAINS[g]} AS {g}")
      group_parts.append(g)
    elif g in allowed:
      select_parts.append(f'"{g}"')
      group_parts.append(f'"{g}"')
    else:
      raise QueryError(f"Không thể nhóm theo '{g}'")

  conditions, params = [], []
  if date_from and has_date:
    conditions.append(("date", ">= CAST(? AS DATE)"))
    params.append(date_from)
  if date_to and has_date:
    conditions.append(("date", "<= CAST(? AS DATE)"))
    params.append(date_to)
  for col, value in (filters or {}).items():
    if col not in allowed:
      raise QueryError(f"Không thể lọc theo '{col}'")
    conditions.append((col, "= ?"))
    params.append(value)

  def where_sql(prefix: str = "") -> str:
    return ("WHERE " + " AND ".join(f'{prefix}"{c}" {op}' for c, op in conditions)) if conditions else ""

  select_sql = ", ".join(select_parts + [f"{metric['expr']} AS value"])
  sql = f"SELECT {select_sql} FROM {entity.name} {where_sql()}"
  if group_parts:
    sql += f" GROUP BY {', '.join(group_parts)} ORDER BY value DESC NULLS LAST LIMIT {max(1, min(int(limit), MAX_ROWS))}"
  lineage_sql = (f"SELECT t._source_table, ANY_VALUE(t._file), ANY_VALUE(m.sheet), COUNT(*) FROM {entity.name} t "
                 f"LEFT JOIN _tables m ON m.table_name = t._source_table "
                 f"{where_sql('t.')} GROUP BY 1 ORDER BY 4 DESC")

  with wh.connect(tenant_id, read_only=True) as con:
    cols, rows = _run_with_timeout(con, sql, params, QUERY_TIMEOUT_S)
    _, lineage_rows = _run_with_timeout(con, lineage_sql, params, QUERY_TIMEOUT_S)
  return MetricResult(
    name=name, unit=metric["unit"], sql=sql,
    rows=[dict(zip(cols, map(_jsonable, r))) for r in rows],
    lineage=[Lineage(table=r[0], file=r[1], sheet=r[2], rows=r[3]) for r in lineage_rows],
  )


def trace_lineage(tenant_id: str, source_table: str, source_row: int,
                  source_column: Optional[str] = None) -> Dict[str, Any]:
  with wh.connect(tenant_id, read_only=True) as con:
    meta = wh.table_meta(con, source_table)
    if meta is None:
      raise QueryError(f"Không có bảng nguồn '{source_table}'")
    cols, rows = _run_with_timeout(con, f'SELECT * FROM "{source_table}" WHERE "_row" = ?', [int(source_row)],
                                   QUERY_TIMEOUT_S)
  names = {c["name"]: c["original"] for c in meta["columns"]}
  out = {
    "file": meta["filename"], "sheet": meta["sheet"], "range": meta["cell_range"], "excel_row": int(source_row),
    "values": {names.get(c, c): _jsonable(v) for c, v in zip(cols, rows[0])} if rows else {},
  }
  if source_column:
    # _source_column của dòng unpivot → địa chỉ ô Excel (vd. 'D12')
    letters = {c["original"]: c.get("letter") for c in meta["columns"]}
    out["cells"] = [f"{letters[c]}{int(source_row)}" for c in (s.strip() for s in source_column.split(","))
                    if letters.get(c)]
  return out


def list_files(tenant_id: str) -> List[Dict[str, Any]]:
  with wh.connect(tenant_id, read_only=True) as con:
    rows = con.execute(
      "SELECT file_id, filename, uploaded_at, sheet_count, table_count, row_count, empty_sheets, status "
      "FROM _files ORDER BY uploaded_at DESC").fetchall()
  return [{"file_id": r[0], "filename": r[1], "uploaded_at": str(r[2]), "sheets": r[3], "tables": r[4],
           "data_rows": r[5], "empty_sheets": json.loads(r[6] or "[]"), "status": r[7]} for r in rows]


def pending_questions(tenant_id: str) -> List[Dict[str, Any]]:
  """Câu hỏi ánh xạ chưa xác nhận, gom theo recipe (trả lời 1 lần → áp cho mọi file cùng template)."""
  with wh.connect(tenant_id, read_only=True) as con:
    recipes = con.execute(
      "SELECT recipe_id, header_signature, entity, recipe_json, updated_at FROM _recipes WHERE NOT confirmed "
      "ORDER BY updated_at DESC").fetchall()
    out = []
    for recipe_id, signature, entity, payload, _ in recipes:
      recipe = json.loads(payload)
      if not recipe.get("questions"):
        continue
      tables = con.execute(
        "SELECT table_name, filename, sheet FROM _tables WHERE header_signature = ?", [signature]).fetchall()
      suggested = entity == "custom" and recipe.get("suggested_entity")
      out.append({
        "recipe_id": recipe_id,
        "entity": recipe["suggested_entity"] if suggested else entity,
        "column_map": recipe.get("suggested_map", {}) if suggested else recipe.get("column_map", {}),
        "loaded": entity != "custom" and recipe.get("confidence", 0) >= AUTO_ACCEPT_CONFIDENCE,
        "confidence": recipe.get("confidence"), "questions": recipe["questions"],
        "applies_to": [{"table": t, "file": f, "sheet": s} for t, f, s in tables],
      })
  # Bảng chưa nạp (đang chờ người dùng) lên trước, rồi bảng áp dụng cho nhiều file nhất;
  # sort ổn định nên cùng hạng thì recipe mới nhất (vừa upload) đứng trước
  out.sort(key=lambda r: (r["loaded"], -len(r["applies_to"])))
  return out
