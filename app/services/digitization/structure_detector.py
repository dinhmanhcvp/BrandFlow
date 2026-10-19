"""
Nhận diện cấu trúc sheet Excel "trình bày cho người đọc" — deterministic, không LLM.

Mỗi sheet có thể chứa nhiều vùng dữ liệu ("đảo"), mỗi vùng được phân loại:
 • table      — bảng có header (1–2 tầng), dòng dữ liệu, dòng tổng, dòng nhóm
 • key_value  — dạng form "Nhãn: | Giá trị"
 • note       — đoạn văn tự do (đưa sang VectorDB, không phải bảng số)
"""

import hashlib
import json
import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

from app.services.digitization.normalizers_vi import (
  is_period_label, normalize_header, parse_number,
)
from app.services.digitization.workbook_reader import SheetGrid, is_number, to_excel_col

_SUBTOTAL_RE = re.compile(r"^(tong cong|tong|total|grand total|sub ?total|cong|sum|thanh tien tong)\b")
_CODE_RE = re.compile(r"^\d+(\.\d+)*\.?$")
MAX_HEADER_SCAN = 6


@dataclass
class DetectedTable:
  sheet: str
  kind: str                                   # table | key_value | note
  top: int
  left: int
  bottom: int
  right: int                                  # 0-based, bao gồm
  columns: List[str] = field(default_factory=list)
  column_letters: List[str] = field(default_factory=list)
  rows: List[List[Any]] = field(default_factory=list)
  row_numbers: List[int] = field(default_factory=list)   # số dòng Excel (1-based) — lineage
  row_kinds: List[str] = field(default_factory=list)     # data | subtotal | group
  header_rows: int = 0
  context: List[str] = field(default_factory=list)       # tiêu đề/ghi chú phía trên header
  key_values: List[Tuple[str, Any, int]] = field(default_factory=list)
  text: str = ""
  period_columns: List[str] = field(default_factory=list)
  formulas: Dict[str, str] = field(default_factory=dict)  # cột → một công thức mẫu
  # Ô của dòng nhóm là tổng các dòng con → không nạp vào bảng chuẩn (tránh cộng trùng)
  aggregate_cells: Dict[int, List[int]] = field(default_factory=dict)  # row_idx → [col_idx]
  duplicate_of: Optional[str] = None

  @property
  def cell_range(self) -> str:
    return f"{to_excel_col(self.left)}{self.top + 1}:{to_excel_col(self.right)}{self.bottom + 1}"

  @property
  def data_row_count(self) -> int:
    return sum(1 for k in self.row_kinds if k == "data")

  @property
  def loadable_row_count(self) -> int:
    """Dòng dữ liệu + dòng nhóm còn giá trị riêng (không phải tổng của dòng con)."""
    return self.data_row_count + sum(
      1 for i, k in enumerate(self.row_kinds)
      if k == "group" and any(is_number(v) for j, v in enumerate(self.rows[i])
                              if j not in self.aggregate_cells.get(i, []) and j > 0)
    )

  def fingerprint(self) -> str:
    """Theo nội dung dòng dữ liệu (không theo vị trí) — cùng bảng copy sang sheet khác vẫn bị phát hiện."""
    data_rows = [r for r, k in zip(self.rows, self.row_kinds) if k != "subtotal"]
    payload = json.dumps(
      [self.kind, [normalize_header(c) for c in self.columns], data_rows, self.key_values, self.text],
      default=str, ensure_ascii=False,
    )
    return hashlib.sha1(payload.encode("utf-8")).hexdigest()


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _is_texty(value: Any) -> bool:
  return isinstance(value, str) and parse_number(value) is None


def _row_values(grid: SheetGrid, r: int, c0: int, c1: int) -> List[Any]:
  return [grid.value(r, c) for c in range(c0, c1 + 1)]


def _non_empty(values: List[Any]) -> List[Any]:
  return [v for v in values if v is not None]


def _split_runs(flags: List[bool], offset: int) -> List[Tuple[int, int]]:
  """[T,T,F,T] → [(0,1),(3,3)] (+offset): các đoạn liên tiếp có dữ liệu."""
  runs, start = [], None
  for i, flag in enumerate(flags):
    if flag and start is None:
      start = i
    elif not flag and start is not None:
      runs.append((start + offset, i - 1 + offset))
      start = None
  if start is not None:
    runs.append((start + offset, len(flags) - 1 + offset))
  return runs


def _find_regions(grid: SheetGrid) -> List[Tuple[int, int, int, int]]:
  """Tách sheet thành các vùng chữ nhật cách nhau bởi dòng trống rồi cột trống."""
  regions = []
  row_flags = [any(v is not None for v in row) for row in grid.cells]
  for r0, r1 in _split_runs(row_flags, 0):
    n_cols = max(len(grid.cells[r]) for r in range(r0, r1 + 1))
    col_flags = [any(grid.value(r, c) is not None for r in range(r0, r1 + 1)) for c in range(n_cols)]
    for c0, c1 in _split_runs(col_flags, 0):
      # Thu gọn dòng trống trên/dưới trong phạm vi cột của vùng
      rows = [r for r in range(r0, r1 + 1) if any(v is not None for v in _row_values(grid, r, c0, c1))]
      if rows:
        regions.append((rows[0], c0, rows[-1], c1))
  regions.sort(key=lambda t: (t[0], t[1]))
  return regions


def _looks_like_data_row(values: List[Any]) -> bool:
  filled = _non_empty(values)
  if not filled:
    return False
  numbers = sum(1 for v in filled if is_number(v) or parse_number(v) is not None)
  return numbers >= 1 and sum(1 for v in filled if _is_texty(v)) / len(filled) < 0.6


def _merge_continuations(grid: SheetGrid, regions):
  """Bảng dài có 1 dòng trống ở giữa bị tách đôi → ghép lại nếu phần dưới bắt đầu bằng dòng dữ liệu."""
  merged: List[List[int]] = []
  for top, left, bottom, right in regions:
    prev = next((m for m in reversed(merged) if m[1] == left or abs(m[1] - left) <= 1), None)
    if (
      prev is not None
      and 0 < top - prev[2] <= 2
      and abs(prev[3] - right) <= 1
      and _looks_like_data_row(_row_values(grid, top, left, right))
      and (right - left) >= 2
    ):
      prev[2], prev[1], prev[3] = bottom, min(prev[1], left), max(prev[3], right)
    else:
      merged.append([top, left, bottom, right])
  return [tuple(m) for m in merged]


def _find_header(grid: SheetGrid, top: int, left: int, bottom: int, right: int) -> Optional[int]:
  scan_rows = range(top, min(bottom, top + 30) + 1)
  max_filled = max((len(_non_empty(_row_values(grid, r, left, right))) for r in scan_rows), default=0)
  for r in range(top, min(bottom, top + MAX_HEADER_SCAN - 1) + 1):
    filled = _non_empty(_row_values(grid, r, left, right))
    if len(filled) < 2:
      continue
    texty = sum(1 for v in filled if _is_texty(v))
    if texty / len(filled) >= 0.6 and len(filled) >= 0.5 * max_filled and r < bottom:
      return r
  return None


def _has_sub_header(grid: SheetGrid, header_r: int, left: int, right: int, bottom: int) -> bool:
  sub_r = header_r + 1
  if sub_r >= bottom:
    return False
  sub = _row_values(grid, sub_r, left, right)
  filled = _non_empty(sub)
  if len(filled) < 2 or not all(_is_texty(v) or v == "%" for v in filled):
    return False
  header = _row_values(grid, header_r, left, right)
  has_h_merge = any(
    (m := grid.merge_of(header_r, c)) and m[3] > m[1] for c in range(left, right + 1)
  )
  fills_gaps = any(h is None and s is not None and not grid.merge_of(header_r, left + i)
                   for i, (h, s) in enumerate(zip(header, sub)))
  return has_h_merge or fills_gaps


def _context_key_values(values: List[Any], row_number: int) -> List[Tuple[str, Any, int]]:
  """'Trình cho:' | 'Chủ tịch HĐQT' → ('Trình cho', 'Chủ tịch HĐQT')."""
  pairs = []
  filled = [v for v in values if v is not None]
  for i, v in enumerate(filled[:-1]):
    if isinstance(v, str) and v.endswith(":"):
      pairs.append((v.rstrip(": ").strip(), filled[i + 1], row_number))
  return pairs


def _code_str(value: Any) -> Optional[str]:
  if is_number(value):
    return str(int(value)) if float(value).is_integer() else repr(float(value))
  if isinstance(value, str) and _CODE_RE.match(value.strip()):
    return value.strip().rstrip(".")
  return None


def _classify_rows(rows: List[List[Any]]) -> List[str]:
  kinds = ["data"] * len(rows)
  seen_subtotal = False
  for i, row in enumerate(rows):
    texts = [normalize_header(v) for v in row if _is_texty(v)]
    if any(_SUBTOTAL_RE.match(t) for t in texts):
      kinds[i], seen_subtotal = "subtotal", True
    elif seen_subtotal and not texts:
      kinds[i] = "subtotal"  # dòng tính thêm sau dòng Tổng (VAT, dự phòng...) không có nhãn

  # Dòng sau dòng Tổng CUỐI CÙNG là chú thích/chỉ số phụ (vd. "COST MKT/OTS"), không phải dữ liệu
  last_total = max((i for i, k in enumerate(kinds) if k == "subtotal"), default=None)
  if last_total is not None and last_total < len(kinds) - 1 and any(k == "data" for k in kinds[:last_total]):
    for i in range(last_total + 1, len(kinds)):
      if kinds[i] == "data":
        kinds[i] = "footer"

  # Mã phân cấp 1 / 1.1 / 1.2 → dòng cha là "group" (đã cộng con, tránh cộng trùng)
  if rows:
    codes = [_code_str(r[0]) if r else None for r in rows]
    if sum(1 for c in codes if c) >= 0.6 * len(rows) and any(c and "." in c for c in codes):
      for i, code in enumerate(codes):
        if code and kinds[i] == "data" and any(c and c.startswith(code + ".") for c in codes[i + 1:]):
          kinds[i] = "group"
  return kinds


def _aggregate_cells(rows: List[List[Any]], kinds: List[str]) -> Dict[int, List[int]]:
  """Dòng nhóm '1': cột nào có giá trị = tổng các dòng con '1.x' thì ô đó là ô tổng → đánh dấu."""
  codes = [_code_str(r[0]) if r else None for r in rows]
  result: Dict[int, List[int]] = {}
  for i, kind in enumerate(kinds):
    if kind != "group" or not codes[i]:
      continue
    children = [j for j, c in enumerate(codes) if c and c.startswith(codes[i] + ".")]
    direct = [j for j in children if codes[j].count(".") == codes[i].count(".") + 1]
    cols = []
    for c in range(1, len(rows[i])):
      group_value = parse_number(rows[i][c])
      child_values = [v for v in (parse_number(rows[j][c]) for j in direct) if v is not None]
      # Chỉ coi là ô tổng khi thật sự khớp tổng dòng con; lệch → giá trị độc lập, giữ lại
      if group_value is not None and child_values and          abs(sum(child_values) - group_value) <= max(1.0, 0.005 * abs(group_value)):
        cols.append(c)
    if cols:
      result[i] = cols
  return result


def _dedupe_names(names: List[str]) -> List[str]:
  seen: Dict[str, int] = {}
  out = []
  for name in names:
    key = name.lower()
    if key in seen:
      seen[key] += 1
      name = f"{name}_{seen[key]}"
    else:
      seen[key] = 1
    out.append(name)
  return out


# ─── Phân tích một vùng ──────────────────────────────────────────────────────

def _analyze_region(grid: SheetGrid, top: int, left: int, bottom: int, right: int) -> Optional[DetectedTable]:
  all_values = [_row_values(grid, r, left, right) for r in range(top, bottom + 1)]
  filled = [v for row in all_values for v in row if v is not None]
  if not filled:
    return None
  width = right - left + 1
  base = dict(sheet=grid.name, top=top, left=left, bottom=bottom, right=right)

  # Đoạn văn: 1 cột chữ dài, hoặc ít ô toàn chữ
  texts = [v for v in filled if isinstance(v, str)]
  if (width == 1 or len(filled) <= 2) and texts and all(_is_texty(v) for v in filled):
    if width == 1 and all(":" in v for v in texts) and len(texts) >= 2:
      pairs = []
      for i, row in enumerate(all_values):
        if row[0]:
          k, _, v = row[0].partition(":")
          pairs.append((k.strip(), v.strip() or None, top + i + 1))
      return DetectedTable(kind="key_value", key_values=pairs, **base)
    return DetectedTable(kind="note", text="\n".join(texts), **base)

  # Form key-value: 2 cột, cột đầu là nhãn
  if width == 2 and len(all_values) >= 2:
    labels = [row[0] for row in all_values if row[0] is not None]
    if labels and all(_is_texty(v) for v in labels) and _find_header(grid, top, left, bottom, right) in (None, top) \
       and sum(1 for row in all_values if row[1] is not None) >= 0.5 * len(all_values) \
       and any(isinstance(v, str) and v.endswith(":") for v in labels):
      pairs = [(str(row[0]).rstrip(": ").strip(), row[1], top + i + 1)
               for i, row in enumerate(all_values) if row[0] is not None]
      return DetectedTable(kind="key_value", key_values=pairs, **base)

  header_r = _find_header(grid, top, left, bottom, right)
  table = DetectedTable(kind="table", **base)

  if header_r is None:
    data_start = top
    names = [f"col_{to_excel_col(c)}" for c in range(left, right + 1)]
  else:
    for r in range(top, header_r):
      vals = _row_values(grid, r, left, right)
      table.context.append(" | ".join(str(v) for v in vals if v is not None))
      table.key_values.extend(_context_key_values(vals, r + 1))
    two_rows = _has_sub_header(grid, header_r, left, right, bottom)
    table.header_rows = 2 if two_rows else 1
    data_start = header_r + table.header_rows
    names = []
    for c in range(left, right + 1):
      top_name = grid.filled_value(header_r, c)
      # Ô merge dọc (B2:B3) có giá trị ở dòng trên, dòng dưới rỗng → chỉ dùng tên dòng trên
      sub_name = grid.value(header_r + 1, c) if two_rows else None
      parts = [str(p) for p in (top_name, sub_name) if p is not None]
      if len(parts) == 2 and parts[0] == parts[1]:
        parts = parts[:1]
      names.append(".".join(parts) if parts else f"col_{to_excel_col(c)}")

  # Dòng dữ liệu (fill-down chỉ cho ô merge dọc trong cùng cột, tránh nhân bản số liệu)
  rows, row_numbers = [], []
  for r in range(data_start, bottom + 1):
    row = []
    for c in range(left, right + 1):
      v = grid.value(r, c)
      m = grid.merge_of(r, c)
      if v is None and m and m[1] == c and m[0] < r and m[0] >= data_start:
        v = grid.value(m[0], m[1])
      row.append(v)
    if any(v is not None for v in row):
      rows.append(row)
      row_numbers.append(r + 1)

  # Bỏ cột không tên và không dữ liệu
  keep = [i for i, name in enumerate(names)
          if not name.startswith("col_") or any(row[i] is not None for row in rows)]
  table.columns = _dedupe_names([names[i] for i in keep])
  table.column_letters = [to_excel_col(left + i) for i in keep]
  table.rows = [[row[i] for i in keep] for row in rows]
  table.row_numbers = row_numbers
  table.row_kinds = _classify_rows(table.rows)
  table.aggregate_cells = _aggregate_cells(table.rows, table.row_kinds)
  if header_r is None:
    # Bảng không header (dashboard/form): vẫn lấy được cặp "Nhãn:" → giá trị
    for row, rn in zip(table.rows, table.row_numbers):
      table.key_values.extend(_context_key_values(row, rn))
  table.period_columns = [n for n in table.columns if is_period_label(n.split(".")[-1])]

  for i, name in enumerate(table.columns):
    col = left + keep[i]
    formula = next((grid.formulas.get((rn - 1, col)) for rn in row_numbers if (rn - 1, col) in grid.formulas), None)
    if formula:
      table.formulas[name] = formula

  if not table.rows:
    if table.key_values:
      return DetectedTable(kind="key_value", key_values=table.key_values, **base)
    return DetectedTable(kind="note", text="\n".join(str(v) for v in filled), **base)
  if len(table.columns) == 1:
    # Một cột rời rạc (ô ghi chú số liệu cạnh đoạn văn) — không phải bảng truy vấn được
    return DetectedTable(kind="note", text="\n".join(str(v) for v in table.context + [
      str(r[0]) for r in table.rows if r[0] is not None]), **base)
  return table


def detect_tables(grid: SheetGrid) -> List[DetectedTable]:
  regions = _merge_continuations(grid, _find_regions(grid))
  tables: List[DetectedTable] = []
  pending_titles: List[DetectedTable] = []
  for top, left, bottom, right in regions:
    t = _analyze_region(grid, top, left, bottom, right)
    if t is None:
      continue
    # Tiêu đề 1 ô đứng riêng (vd. "Doanh số") → ngữ cảnh cho bảng ngay bên dưới
    if t.kind == "note" and len(t.text) <= 80 and "\n" not in t.text:
      pending_titles.append(t)
      continue
    if pending_titles and t.kind == "table":
      t.context = [p.text for p in pending_titles] + t.context
      pending_titles = []
    tables.append(t)
  tables.extend(pending_titles)
  return tables


def detect_workbook(sheets: List[SheetGrid]) -> Tuple[List[DetectedTable], List[str]]:
  """Trả về (các vùng, các sheet trống). Vùng trùng nội dung với sheet trước bị đánh dấu duplicate_of."""
  results: List[DetectedTable] = []
  empty_sheets: List[str] = []
  seen: Dict[str, str] = {}
  for grid in sheets:
    tables = detect_tables(grid)
    if not tables:
      empty_sheets.append(grid.name)
      continue
    for t in tables:
      fp = t.fingerprint()
      if fp in seen:
        t.duplicate_of = seen[fp]
      else:
        seen[fp] = f"{t.sheet}!{t.cell_range}"
      results.append(t)
  return results, empty_sheets
