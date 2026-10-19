"""
Logic Firewall — "trạm kiểm lâm" Python + Pydantic giữa dữ liệu và agent.

 1. check_table_integrity: đối soát dữ liệu Excel ngay khi số hóa
    (tổng con = dòng Tổng gốc, dòng nhóm = tổng dòng con, số âm, tỷ lệ ngoài [0, 1]).
 2. BudgetProposal: mọi đề xuất ngân sách phải qua ràng buộc toán học trước khi tới agent/Brand DNA.
 3. MetricResult: con số trả cho agent luôn kèm nguồn gốc (lineage).
"""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, ValidationError, model_validator

from app.services.digitization.normalizers_vi import normalize_header, parse_number
from app.services.digitization.profiler import ColumnProfile
from app.services.digitization.structure_detector import DetectedTable, _code_str

TOLERANCE_RATIO = 0.005


def _close(a: float, b: float) -> bool:
  return abs(a - b) <= max(1.0, TOLERANCE_RATIO * max(abs(a), abs(b)))


_ID_HEADERS = {"tt", "stt", "no", "so tt", "ma", "id", "#", "nr"}


def _is_id_column(table: DetectedTable, ci: int) -> bool:
  """Cột số thứ tự / mã phân cấp / cột không tên — không phải số liệu để cộng."""
  name = table.columns[ci]
  if name.startswith("col_") or normalize_header(name) in _ID_HEADERS:
    return True
  values = [r[ci] for r, k in zip(table.rows, table.row_kinds) if k != "subtotal" and r[ci] is not None]
  return ci == 0 and bool(values) and all(_code_str(v) for v in values)


def check_table_integrity(table: DetectedTable, profiles: List[ColumnProfile]) -> List[Dict[str, Any]]:
  issues: List[Dict[str, Any]] = []
  for ci, profile in enumerate(profiles):
    col = table.columns[ci]
    if profile.inferred_type != "number" or profile.unit_guess in ("ratio", "percent") or _is_id_column(table, ci):
      continue

    # Dòng Tổng: so với tổng các dòng dữ liệu kể từ dòng Tổng trước đó
    running: List[float] = []
    checked_since_reset = False
    for ri, (row, kind, rn) in enumerate(zip(table.rows, table.row_kinds, table.row_numbers)):
      value = parse_number(row[ci])
      if kind == "group" and ci in table.aggregate_cells.get(ri, []):
        continue  # ô tổng của nhóm — dòng con đã được cộng
      if kind in ("data", "group"):
        if value is not None:
          running.append(value)
        checked_since_reset = False
      elif kind == "subtotal" and value is not None and running and not checked_since_reset:
        expected = sum(running)
        if not _close(expected, value):
          issues.append({
            "type": "subtotal_mismatch", "severity": "warning", "column": col, "row": rn,
            "found": value, "expected": round(expected, 2),
            "message": f"Dòng tổng ở dòng {rn} cột '{col}' = {value:,.0f} nhưng cộng các dòng trên = {expected:,.0f}",
          })
        running, checked_since_reset = [], True

    # Dòng nhóm (1 → 1.1, 1.2): giá trị nhóm phải bằng tổng dòng con nếu dòng con có số
    codes = [_code_str(r[0]) if r else None for r in table.rows]
    for gi, kind in enumerate(table.row_kinds):
      group_value = parse_number(table.rows[gi][ci]) if kind == "group" else None
      if group_value is None or not codes[gi]:
        continue
      children = [parse_number(table.rows[j][ci]) for j, c in enumerate(codes)
                  if c and c.startswith(codes[gi] + ".") and c.count(".") == codes[gi].count(".") + 1]
      children = [v for v in children if v is not None]
      if children and not _close(sum(children), group_value):
        issues.append({
          "type": "group_mismatch", "severity": "info", "column": col, "row": table.row_numbers[gi],
          "found": group_value, "expected": round(sum(children), 2),
          "message": f"Nhóm '{codes[gi]}' cột '{col}' = {group_value:,.0f}, tổng mục con = {sum(children):,.0f}",
        })

    if profile.unit_guess == "VND" and profile.min is not None and profile.min < 0:
      issues.append({"type": "negative_amount", "severity": "info", "column": col,
                     "message": f"Cột tiền '{col}' có giá trị âm (min = {profile.min:,.0f})"})
  return issues


# ─── Pydantic firewall cho agent ─────────────────────────────────────────────

class BudgetLine(BaseModel):
  item: str = Field(min_length=1)
  cost: float = Field(ge=0)


class BudgetProposal(BaseModel):
  """Đề xuất ngân sách hợp lệ về toán học. Agent nào trả ra ngân sách cũng phải qua model này."""
  total_budget: float = Field(gt=0)
  items: List[BudgetLine] = Field(min_length=1)
  expected_cac: float = Field(gt=0, description="Chi phí thu hút 1 khách dự kiến (VND)")
  breakeven_point: float = Field(gt=0, description="Số khách/đơn cần để hòa vốn")
  cut_loss_condition: str = Field(min_length=5, description="Điều kiện dừng lỗ, đo được")

  @model_validator(mode="after")
  def _within_budget(self) -> "BudgetProposal":
    spent = sum(i.cost for i in self.items)
    if spent > self.total_budget * (1 + 1e-9):
      raise ValueError(f"Tổng hạng mục {spent:,.0f} vượt ngân sách {self.total_budget:,.0f}")
    return self


def validate_budget_proposal(payload: Dict[str, Any]) -> Dict[str, Any]:
  """Trả về {'ok': bool, 'errors': [...], 'proposal': {...}} — lỗi có cấu trúc để agent tự sửa."""
  try:
    proposal = BudgetProposal.model_validate(payload)
    return {"ok": True, "errors": [], "proposal": proposal.model_dump()}
  except ValidationError as e:
    return {"ok": False, "errors": [
      {"field": ".".join(str(p) for p in err["loc"]) or "proposal", "message": err["msg"]} for err in e.errors()
    ], "proposal": None}


class Lineage(BaseModel):
  file: Optional[str] = None
  sheet: Optional[str] = None
  table: str
  rows: Optional[int] = None


class MetricResult(BaseModel):
  name: str
  rows: List[Dict[str, Any]]
  unit: Optional[str] = None
  sql: str
  lineage: List[Lineage] = Field(default_factory=list)
  computed_at: datetime = Field(default_factory=datetime.now)
