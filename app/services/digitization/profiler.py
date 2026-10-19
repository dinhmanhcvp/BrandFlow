"""
Profiling cột — deterministic. Đây là thứ LLM được xem thay cho hàng nghìn dòng dữ liệu.
"""

import re
from collections import Counter
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional

from app.services.digitization.normalizers_vi import (
  normalize_header, parse_date, parse_number, parse_range,
)
from app.services.digitization.workbook_reader import is_date, is_number

SAMPLE_VALUES = 5


@dataclass
class ColumnProfile:
  name: str
  inferred_type: str               # number | date | range | text | empty
  non_null: int = 0
  unique: int = 0
  samples: List[str] = field(default_factory=list)
  min: Optional[float] = None
  max: Optional[float] = None
  sum: Optional[float] = None
  unit_guess: Optional[str] = None  # VND | ratio | percent | count | None
  parse_rate: float = 0.0           # % giá trị đọc được theo kiểu đã suy ra

  def to_dict(self) -> Dict[str, Any]:
    return {k: v for k, v in asdict(self).items() if v not in (None, [], "")}


def _has(header: str, *keywords: str) -> bool:
  return any(re.search(rf"(^|\s){re.escape(k)}($|\s)", header) for k in keywords)


def _guess_unit(name: str, values: List[float]) -> Optional[str]:
  header = normalize_header(name)
  if not values:
    return None
  if "%" in header or _has(header, "ty le", "ti le", "ty trong", "ti trong", "rate", "ratio"):
    return "ratio" if max(abs(v) for v in values) <= 1.5 else "percent"
  if _has(header, "so luong", "sl", "qty", "quantity", "volume", "so don", "count"):
    return "count"
  if _has(header, "tien", "thanh tien", "doanh thu", "doanh so", "gia", "chi phi", "budget", "ngan sach",
          "income", "revenue", "cost", "vnd", "dong"):
    return "VND"
  if max(abs(v) for v in values) >= 100_000:
    return "VND"
  return None


_IDENTIFIER_HEADERS = ("sdt", "so dien thoai", "dien thoai", "phone", "mobile", "ma", "code", "id", "mst",
                       "ma so thue", "cmnd", "cccd", "zip", "barcode", "ma vach", "so tk", "tai khoan")


def _is_identifier_column(name: str, filled: List[Any]) -> bool:
  """SĐT, mã KH, mã vạch... nhìn như số nhưng phải giữ dạng chữ (số 0 đầu, không cộng trừ)."""
  header = normalize_header(name.split(".")[-1])
  if _has(header, *_IDENTIFIER_HEADERS):
    return True
  strings = [v for v in filled if isinstance(v, str)]
  phone_like = sum(1 for v in strings if re.fullmatch(r"(\+?84|0)\d{8,10}", v.replace(" ", "")))
  return bool(strings) and phone_like >= 0.8 * len(filled)


def profile_column(name: str, values: List[Any]) -> ColumnProfile:
  filled = [v for v in values if v is not None]
  profile = ColumnProfile(name=name, inferred_type="empty", non_null=len(filled))
  if not filled:
    return profile
  if _is_identifier_column(name, filled):
    as_text = [str(int(v)) if isinstance(v, float) and v.is_integer() else str(v) for v in filled]
    profile.inferred_type, profile.parse_rate = "text", 1.0
    profile.unique = len(set(as_text))
    profile.samples = [s[:60] for s, _ in Counter(as_text).most_common(SAMPLE_VALUES)]
    return profile
  as_text = [str(v) for v in filled]
  profile.unique = len(set(as_text))
  profile.samples = [s[:60] for s, _ in Counter(as_text).most_common(SAMPLE_VALUES)]

  numbers = [n for n in (parse_number(v) for v in filled) if n is not None]
  dates = [d for d in (v if is_date(v) else parse_date(v) for v in filled) if d is not None]
  ranges = [r for r in (parse_range(v) for v in filled if not is_number(v)) if r is not None]
  n = len(filled)

  if len(dates) / n >= 0.8:
    profile.inferred_type, profile.parse_rate = "date", len(dates) / n
    profile.samples = [d.isoformat() for d in sorted(dates)[:2]] + [max(dates).isoformat()]
  elif len(numbers) / n >= 0.8:
    profile.inferred_type, profile.parse_rate = "number", len(numbers) / n
    profile.min, profile.max, profile.sum = min(numbers), max(numbers), sum(numbers)
    profile.unit_guess = _guess_unit(name, numbers)
  elif (len(ranges) + len(numbers)) / n >= 0.8 and ranges:
    profile.inferred_type, profile.parse_rate = "range", (len(ranges) + len(numbers)) / n
    lows = [r[0] for r in ranges] + numbers
    highs = [r[1] for r in ranges] + numbers
    profile.min, profile.max = min(lows), max(highs)
  else:
    profile.inferred_type, profile.parse_rate = "text", 1.0
  return profile


def profile_table(columns: List[str], rows: List[List[Any]], row_kinds: Optional[List[str]] = None) -> List[ColumnProfile]:
  """Profile trên các dòng dữ liệu (bỏ dòng tổng/nhóm để min/max/sum không bị lệch)."""
  data_rows = [r for i, r in enumerate(rows) if not row_kinds or row_kinds[i] == "data"]
  return [profile_column(name, [r[i] for r in data_rows]) for i, name in enumerate(columns)]
