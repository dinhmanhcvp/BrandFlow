"""
Pipeline số hóa một file bảng tính cho một tenant:
  dedupe → đọc workbook → nhận diện cấu trúc → profile → recipe (cache/heuristic/LLM)
  → raw table → bảng chuẩn → Logic Firewall → catalog.
"""

import os
import uuid
from typing import Any, Dict, List

from app.services.digitization import warehouse as wh
from app.services.digitization.firewall import check_table_integrity
from app.services.digitization.profiler import profile_table
from app.services.digitization.schema_mapper import build_questions, header_signature, map_table
from app.services.digitization.structure_detector import detect_workbook
from app.services.digitization.workbook_reader import read_workbook


def digitize_file(tenant_id: str, path: str, filename: str, file_hash: str) -> Dict[str, Any]:
  with wh.connect(tenant_id) as con:
    existing = wh.find_file_by_hash(con, file_hash)
    if existing:
      return {"status": "duplicate", "filename": filename, "duplicate_of": existing, "tables": [],
              "notes_text": ""}

    sheets = read_workbook(path)
    detected, empty_sheets = detect_workbook(sheets)
    file_id = f"f_{uuid.uuid4().hex[:12]}"
    report_tables: List[Dict[str, Any]] = []
    notes: List[str] = []
    skipped_duplicates: List[str] = []
    total_rows = 0
    llm_calls = 0

    con.execute("BEGIN TRANSACTION")
    try:
      for t in detected:
        location = f"{t.sheet}!{t.cell_range}"
        if t.duplicate_of:
          skipped_duplicates.append(f"{location} (trùng {t.duplicate_of})")
          continue
        if t.kind == "note":
          notes.append(f"[{t.sheet}] {t.text}")
          wh.insert_note(con, file_id, filename, t.sheet, t.cell_range, t.text)
          continue
        if t.kind == "key_value":
          wh.insert_org_profile(con, t.key_values, filename, t.sheet)
          continue

        profiles = profile_table(t.columns, t.rows, t.row_kinds)
        signature = header_signature(t.columns)
        recipe = wh.get_recipe_by_signature(con, signature)
        recipe_source = "cache"
        if recipe is None:
          recipe = map_table(t.columns, profiles, {
            "file": filename, "sheet": t.sheet, "context": t.context[:3], "range": t.cell_range,
          })
          recipe_source = recipe.source
          llm_calls += 1 if recipe.source == "llm" else 0
          wh.save_recipe(con, recipe)
        elif not recipe.confirmed:
          # Recipe cũ chưa xác nhận: câu hỏi vẫn còn hiệu lực cho bảng mới cùng template
          recipe.questions = build_questions(recipe, t.columns, profiles)

        table_name = wh.next_table_name(con, t.sheet)
        raw_names = wh.create_raw_table(con, t, profiles, table_name)
        issues = check_table_integrity(t, profiles)
        wh.register_table(con, table_name, file_id, filename, t, profiles, raw_names, recipe, issues)
        loaded = wh.load_canonical(con, table_name, recipe)
        if t.key_values:
          wh.insert_org_profile(con, t.key_values, filename, t.sheet)

        total_rows += t.data_row_count
        report_tables.append({
          "table_name": table_name, "sheet": t.sheet, "range": t.cell_range,
          "columns": t.columns, "rows": len(t.rows), "data_rows": t.data_row_count,
          "entity": recipe.entity, "canonical_rows": loaded, "recipe_id": recipe.recipe_id,
          "recipe_source": recipe_source, "confidence": recipe.confidence,
          "questions": recipe.questions if not recipe.confirmed else [], "issues": issues,
        })

      wh.record_file(con, file_id, filename, file_hash, len(sheets), len(report_tables), total_rows, empty_sheets)
      con.execute("COMMIT")
    except Exception:
      con.execute("ROLLBACK")
      raise

  return {
    "status": "digitized", "file_id": file_id, "filename": filename,
    "sheets": len(sheets), "empty_sheets": empty_sheets, "duplicate_regions": skipped_duplicates,
    "tables": report_tables, "data_rows": total_rows, "llm_calls": llm_calls,
    "notes_text": "\n\n".join(notes),
  }


def summarize_report(report: Dict[str, Any]) -> str:
  """Tóm tắt ngắn một file đã số hóa — đưa cho AI thay vì text bảng thô."""
  if report.get("status") == "duplicate":
    dup = report.get("duplicate_of", {})
    return f"[{report['filename']}] Trùng nội dung với '{dup.get('filename')}' đã số hóa trước đó."
  lines = [f"[{report['filename']}] {report['sheets']} sheet, {len(report['tables'])} bảng, "
           f"{report['data_rows']:,} dòng dữ liệu đã số hóa."]
  for t in report["tables"]:
    entity = t["entity"] if t["entity"] != "custom" else "bảng riêng (chưa khớp mô hình chuẩn)"
    lines.append(f"  • {t['sheet']} {t['range']}: {t['data_rows']} dòng → {entity}"
                 f" (tin cậy {t['confidence']:.0%}); cột: {', '.join(t['columns'][:8])}")
    for issue in t["issues"][:2]:
      lines.append(f"    ⚠ {issue['message']}")
  if report.get("empty_sheets"):
    lines.append(f"  Sheet trống: {', '.join(report['empty_sheets'])}")
  return "\n".join(lines)


def remap_recipe(tenant_id: str, recipe_id: str, entity: str, column_map: Dict[str, str]) -> Dict[str, Any]:
  """
  Human-in-the-loop 1 chạm: người dùng xác nhận/sửa recipe → áp lại cho MỌI bảng cùng template.
  """
  from app.services.digitization.canonical import CUSTOM_ENTITY, ENTITIES

  if entity != CUSTOM_ENTITY and entity not in ENTITIES:
    raise ValueError(f"Thực thể '{entity}' không tồn tại")
  with wh.connect(tenant_id) as con:
    recipe = wh.get_recipe(con, recipe_id)
    if recipe is None:
      raise KeyError(recipe_id)
    if entity in ENTITIES:
      invalid = [c for c in column_map.values() if c not in ENTITIES[entity].columns]
      if invalid:
        raise ValueError(f"Cột chuẩn không hợp lệ: {invalid}")
    recipe.entity = entity
    recipe.column_map = dict(column_map)
    recipe.column_confidence = {k: 1.0 for k in column_map}
    recipe.confidence, recipe.source, recipe.confirmed, recipe.questions = 1.0, "human", True, []

    con.execute("BEGIN TRANSACTION")
    try:
      wh.save_recipe(con, recipe)
      tables = [r[0] for r in con.execute(
        "SELECT table_name FROM _tables WHERE header_signature = ?", [recipe.header_signature]).fetchall()]
      con.execute("UPDATE _tables SET entity = ?, recipe_id = ? WHERE header_signature = ?",
                  [entity, recipe.recipe_id, recipe.header_signature])
      loaded = {t: wh.load_canonical(con, t, recipe) for t in tables}
      con.execute("COMMIT")
    except Exception:
      con.execute("ROLLBACK")
      raise
  return {"recipe": recipe.to_dict(), "reloaded_tables": loaded}


def is_tabular_file(filename: str) -> bool:
  from app.services.digitization.workbook_reader import TABULAR_EXTENSIONS
  return os.path.splitext(filename)[-1].lstrip(".").lower() in TABULAR_EXTENSIONS
