"""
Chuẩn hóa dữ liệu kiểu Việt Nam — deterministic, không dùng LLM.

 • Số: "1.200.000", "1,2 tỷ", "500tr", "(1.000)", "12,5%", 37676000000
 • Dải: "10 - 25 tỷ", "15 - 35"
 • Ngày / kỳ: "12/03/2025", "2025-03-12", "tháng 9/2025", "T9", "Q4.2021"
 • Text: Unicode NFC, bỏ dấu để so khớp, số điện thoại
"""

import re
import unicodedata
from datetime import date, datetime
from typing import Any, Optional, Tuple

# ─── Text ────────────────────────────────────────────────────────────────────

def normalize_text(value: Any) -> Optional[str]:
  """NFC + gộp khoảng trắng. Chuỗi rỗng → None."""
  if value is None:
    return None
  text = unicodedata.normalize("NFC", str(value))
  text = re.sub(r"\s+", " ", text).strip()
  return text or None


def strip_accents(value: Any) -> str:
  """'Doanh Thu Thuần' → 'doanh thu thuan' (dùng để so khớp, không dùng để lưu)."""
  text = normalize_text(value) or ""
  text = text.replace("đ", "d").replace("Đ", "D")
  text = unicodedata.normalize("NFD", text)
  text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
  return text.lower()


def normalize_header(value: Any) -> str:
  """Header để so khớp: bỏ dấu, chữ thường, chỉ giữ chữ/số/%/khoảng trắng."""
  text = strip_accents(value)
  text = re.sub(r"[^a-z0-9%]+", " ", text)
  return re.sub(r"\s+", " ", text).strip()


def slugify(value: Any, fallback: str = "col") -> str:
  """Tên cột/bảng an toàn cho SQL: [a-z0-9_], không bắt đầu bằng số."""
  text = normalize_header(value).replace("%", " pct ")
  text = re.sub(r"[^a-z0-9]+", "_", text).strip("_")
  if not text:
    text = fallback
  if text[0].isdigit():
    text = f"{fallback}_{text}"
  return text[:60]


# ─── Số ──────────────────────────────────────────────────────────────────────

_UNIT_MULTIPLIERS = [
  (r"(ty|ti|ty dong|billion|bn)", 1e9),
  (r"(trieu|tr|million|mn)", 1e6),
  (r"(nghin|ngan|k|thousand)", 1e3),
]
_CURRENCY = r"(vnd|vnđ|dong|đ|d|₫|usd|\$)"


def _parse_plain_number(text: str) -> Optional[float]:
  """Phân tích chuỗi chỉ gồm chữ số và dấu . , (đã bỏ đơn vị)."""
  text = text.strip()
  if not text or not re.fullmatch(r"[0-9.,]+", text) or not re.search(r"\d", text):
    return None
  has_dot, has_comma = "." in text, "," in text
  if has_dot and has_comma:
    # Dấu xuất hiện sau cùng là dấu thập phân: 1.234.567,89 hoặc 1,234,567.89
    if text.rfind(",") > text.rfind("."):
      text = text.replace(".", "").replace(",", ".")
    else:
      text = text.replace(",", "")
  elif has_dot:
    # 1.200.000 (nhóm nghìn kiểu VN) vs 1.5 (thập phân)
    if re.fullmatch(r"\d{1,3}(\.\d{3})+", text):
      text = text.replace(".", "")
  elif has_comma:
    # 1,200,000 (nhóm nghìn) vs 1,5 (thập phân kiểu VN)
    if re.fullmatch(r"\d{1,3}(,\d{3})+", text):
      text = text.replace(",", "")
    else:
      text = text.replace(",", ".")
  try:
    return float(text)
  except ValueError:
    return None


def parse_number(value: Any) -> Optional[float]:
  """
  Trả về float hoặc None nếu không phải số.
  '12,5%' → 0.125 · '1,2 tỷ' → 1.2e9 · '(1.000)' → -1000 · '500tr' → 5e8
  """
  if value is None or isinstance(value, bool):
    return None
  if isinstance(value, (int, float)):
    if value != value:  # NaN
      return None
    return float(value)
  if isinstance(value, (datetime, date)):
    return None

  text = strip_accents(value)
  if not text:
    return None
  negative = False
  if re.fullmatch(r"\(.*\)", text):
    negative, text = True, text[1:-1]
  text = text.strip()
  if text.startswith("-"):
    negative, text = (not negative), text[1:]
  elif text.startswith("+"):
    text = text[1:]

  percent = text.endswith("%")
  if percent:
    text = text[:-1]

  multiplier = 1.0
  text = re.sub(rf"\s*{_CURRENCY}\s*$", "", text).strip()
  for pattern, mult in _UNIT_MULTIPLIERS:
    match = re.fullmatch(rf"(.+?)\s*{pattern}\.?", text)
    if match:
      text, multiplier = match.group(1).strip(), mult
      break
  text = re.sub(rf"^{_CURRENCY}\s*", "", text).replace(" ", "")

  number = _parse_plain_number(text)
  if number is None:
    return None
  number *= multiplier
  if percent:
    number /= 100.0
  return -number if negative else number


def parse_range(value: Any) -> Optional[Tuple[float, float]]:
  """'10 - 25 tỷ' → (1e10, 2.5e10) · '15 - 35' → (15, 35) · không phải dải → None."""
  if value is None or isinstance(value, (int, float, bool, datetime, date)):
    return None
  text = strip_accents(value)
  match = re.fullmatch(r"(.+?)\s*(?:-|–|—|den|toi|~)\s*(.+)", text)
  if not match:
    return None
  left, right = match.group(1), match.group(2)
  high = parse_number(right)
  if high is None:
    return None
  # Đơn vị viết một lần ở cuối: "10 - 25 tỷ" → áp cho cả hai đầu
  low = parse_number(left)
  unit_match = re.search(r"[a-z₫%$]+\.?$", right)
  if unit_match and not re.search(r"[a-z₫%$]", left):
    low = parse_number(f"{left} {unit_match.group(0)}")
  if low is None:
    return None
  return (min(low, high), max(low, high))


def parse_number_or_range_mid(value: Any) -> Optional[float]:
  """Số, hoặc trung điểm nếu là dải (dùng khi nạp vào cột số chuẩn)."""
  number = parse_number(value)
  if number is not None:
    return number
  rng = parse_range(value)
  if rng:
    return (rng[0] + rng[1]) / 2
  return None


# ─── Ngày / kỳ ───────────────────────────────────────────────────────────────

def parse_date(value: Any) -> Optional[date]:
  """datetime/date, 'dd/mm/yyyy', 'dd-mm-yyyy', 'yyyy-mm-dd', 'mm/yyyy' → date."""
  if value is None or isinstance(value, bool):
    return None
  if isinstance(value, datetime):
    return value.date()
  if isinstance(value, date):
    return value
  if isinstance(value, (int, float)):
    return None  # Serial Excel đã được openpyxl chuyển thành datetime
  text = strip_accents(value)
  try:
    match = re.fullmatch(r"(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[ t].*)?", text)
    if match:
      return date(int(match.group(1)), int(match.group(2)), int(match.group(3)))
    match = re.fullmatch(r"(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})(?: .*)?", text)
    if match:
      year = int(match.group(3))
      year += 2000 if year < 100 else 0
      return date(year, int(match.group(2)), int(match.group(1)))
    match = re.fullmatch(r"(?:thang|t)?\s*(\d{1,2})[-/.](\d{4})", text)
    if match:
      return date(int(match.group(2)), int(match.group(1)), 1)
  except ValueError:
    return None
  return None


_MONTH_EN = {m: i for i, m in enumerate(
  ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"], start=1)}


def parse_period(value: Any) -> Optional[str]:
  """
  Kỳ báo cáo chuẩn hóa: 'YYYY-MM', 'YYYY-Qn', 'YYYY', hoặc 'Mn'/'Qn' khi thiếu năm.
  'Q4.2021' → '2021-Q4' · 'tháng 9/2025' → '2025-09' · 'T9' → 'M09' · 2025-09-01 → '2025-09'
  """
  if value is None or isinstance(value, bool):
    return None
  as_date = parse_date(value)
  if as_date:
    return f"{as_date.year:04d}-{as_date.month:02d}"
  if isinstance(value, (int, float)):
    return str(int(value)) if 1990 <= value <= 2100 and float(value).is_integer() else None
  text = strip_accents(value)
  match = re.fullmatch(r"(?:quy|q)\s*([1-4])\s*[./\- ]?\s*(\d{4})?", text)
  if match:
    return f"{match.group(2)}-Q{match.group(1)}" if match.group(2) else f"Q{match.group(1)}"
  match = re.fullmatch(r"(\d{4})\s*[./\- ]?\s*(?:quy|q)\s*([1-4])", text)
  if match:
    return f"{match.group(1)}-Q{match.group(2)}"
  match = re.fullmatch(r"(?:thang|th|t|m)\s*\.?\s*(\d{1,2})(?:\s*[./\- ]\s*(\d{4}))?", text)
  if match and 1 <= int(match.group(1)) <= 12:
    month = int(match.group(1))
    return f"{match.group(2)}-{month:02d}" if match.group(2) else f"M{month:02d}"
  match = re.fullmatch(r"([a-z]{3})[a-z]*\.?\s*(\d{4})?", text)
  if match and match.group(1) in _MONTH_EN:
    month = _MONTH_EN[match.group(1)]
    return f"{match.group(2)}-{month:02d}" if match.group(2) else f"M{month:02d}"
  match = re.fullmatch(r"(?:nam\s*)?(\d{4})", text)
  if match and 1990 <= int(match.group(1)) <= 2100:
    return match.group(1)
  return None


def is_period_label(value: Any) -> bool:
  """Header có phải nhãn kỳ (tháng/quý) không — dùng để nhận diện bảng ma trận theo tháng."""
  if value is None or isinstance(value, (int, float)):
    return False
  return parse_period(value) is not None


# ─── Liên hệ ─────────────────────────────────────────────────────────────────

def normalize_phone(value: Any) -> Optional[str]:
  """'+84 912 345 678' / '0912.345.678' → '0912345678'. Không hợp lệ → None."""
  if value is None:
    return None
  if isinstance(value, float) and value.is_integer():
    value = str(int(value))
  digits = re.sub(r"\D", "", str(value))
  if digits.startswith("84") and len(digits) in (11, 12):
    digits = "0" + digits[2:]
  elif len(digits) == 9 and digits[0] in "35789":
    digits = "0" + digits  # Excel làm mất số 0 đầu
  if len(digits) == 10 and digits.startswith("0"):
    return digits
  return None
