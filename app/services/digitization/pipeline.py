"""
Pipeline số hóa một file bảng tính cho một tenant:
  dedupe → đọc workbook → nhận diện cấu trúc → profile → recipe (cache/heuristic/LLM)
  → raw table → bảng chuẩn → Logic Firewall → catalog.
"""

import os
import uuid
from typing import Any, Dict, List, Optional

from app.services.digitization import warehouse as wh
from app.services.digitization.firewall import check_table_integrity
from app.services.digitization.profiler import profile_table
from app.services.digitization.schema_mapper import (
  UNPIVOT_ENTITIES, build_matrix_questions, build_questions, default_value_column, header_signature,
  is_matrix_table, map_table, propose_matrix_recipe,
)
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
          if is_matrix_table(t.period_columns, profiles):
            # Ma trận số theo tháng/quý = KẾ HOẠCH/CHỈ TIÊU: đề xuất unpivot vào budget_plan/kpi_target,
            # không bao giờ vào sales_line, và luôn hỏi trước khi nạp
            recipe = propose_matrix_recipe(t.columns, profiles, t.period_columns, [filename, t.sheet, *t.context])
          else:
            recipe = map_table(t.columns, profiles, {
              "file": filename, "sheet": t.sheet, "context": t.context[:3], "range": t.cell_range,
            })
            if len(t.period_columns) >= 2:
              # Cột kỳ nhưng chứa chữ (timeline/Gantt) → không unpivot được, vẫn hỏi trước khi nạp
              recipe.confidence = min(recipe.confidence, 0.7)
              recipe.questions = build_questions(recipe, t.columns, profiles)
          recipe_source = recipe.source
          llm_calls += 1 if recipe.source == "llm" else 0
          wh.save_recipe(con, recipe)
        elif not recipe.confirmed:
          # Recipe cũ chưa xác nhận: câu hỏi vẫn còn hiệu lực cho bảng mới cùng template
          recipe.questions = (build_matrix_questions(recipe, t.columns, profiles) if recipe.unpivot
                              else build_questions(recipe, t.columns, profiles))

        table_name = wh.next_table_name(con, t.sheet)
        raw_names = wh.create_raw_table(con, t, profiles, table_name)
        issues = check_table_integrity(t, profiles)
        wh.register_table(con, table_name, file_id, filename, t, profiles, raw_names, recipe, issues)
        loaded = wh.load_canonical(con, table_name, recipe) if recipe.auto_loadable else 0
        if t.key_values:
          wh.insert_org_profile(con, t.key_values, filename, t.sheet)

        total_rows += t.data_row_count
        report_tables.append({
          "table_name": table_name, "sheet": t.sheet, "range": t.cell_range,
          "columns": t.columns, "rows": len(t.rows), "data_rows": t.data_row_count,
          "entity": recipe.entity, "canonical_rows": loaded, "recipe_id": recipe.recipe_id,
          "needs_confirmation": not recipe.auto_loadable and bool(recipe.questions),
          "recipe_source": recipe_source, "confidence": recipe.confidence,
          "questions": recipe.questions if not recipe.confirmed else [], "issues": issues,
          "unpivot_periods": list(recipe.unpivot),
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


def remap_recipe(tenant_id: str, recipe_id: str, entity: str, column_map: Dict[str, str],
                 value_column: Optional[str] = None) -> Dict[str, Any]:
  """
  Human-in-the-loop 1 chạm: người dùng xác nhận/sửa recipe → áp lại cho MỌI bảng cùng template.
  Recipe ma trận theo kỳ: value_column = cột số chuẩn nhận giá trị các ô kỳ (mặc định giữ đề xuất).
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
    if recipe.unpivot:
      recipe.unpivot = _confirm_unpivot(recipe, entity, column_map, value_column)
    recipe.entity = entity
    recipe.column_map = dict(column_map)
    recipe.column_confidence = {k: 1.0 for k in column_map}
    recipe.confidence, recipe.source, recipe.confirmed, recipe.questions = 1.0, "human", True, []
    recipe.suggested_entity, recipe.suggested_map = None, {}

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


def _confirm_unpivot(recipe, entity: str, column_map: Dict[str, str], value_column: Optional[str]) -> Dict[str, str]:
  """Kiểm tra xác nhận cho bảng ma trận theo kỳ; trả về unpivot mới (rỗng nếu người dùng chọn 'bảng riêng')."""
  from app.services.digitization.canonical import CUSTOM_ENTITY, ENTITIES

  if entity == CUSTOM_ENTITY:
    return {}
  if entity not in UNPIVOT_ENTITIES:
    # Số theo tháng trong ma trận là kế hoạch/chỉ tiêu — nạp vào sales_line sẽ trộn kế hoạch với doanh thu thực
    raise ValueError(f"Bảng ma trận theo kỳ chỉ nạp được vào {', '.join(UNPIVOT_ENTITIES)} (hoặc giữ là bảng riêng)")
  overlap = [c for c in column_map if c in recipe.unpivot]
  if overlap:
    raise ValueError(f"Cột kỳ {overlap} được unpivot thành (period, value), không ánh xạ trực tiếp")
  number_cols = {c for c, col in ENTITIES[entity].columns.items() if col.type == "number"}
  if value_column is not None:
    if value_column not in number_cols:
      raise ValueError(f"Cột giá trị '{value_column}' không phải cột số của {entity}")
    return {src: value_column for src in recipe.unpivot}
  if entity == recipe.entity:
    return dict(recipe.unpivot)
  return {src: default_value_column(entity, src) for src in recipe.unpivot}


def is_tabular_file(filename: str) -> bool:
  from app.services.digitization.workbook_reader import TABULAR_EXTENSIONS
  return os.path.splitext(filename)[-1].lstrip(".").lower() in TABULAR_EXTENSIONS
