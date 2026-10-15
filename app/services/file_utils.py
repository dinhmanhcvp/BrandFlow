"""Tiện ích file thuần Python (không phụ thuộc LangChain) cho luồng upload."""

import hashlib
import unicodedata


def normalize_filename(name: str) -> str:
  """Chuẩn hóa Unicode NFC — file đi qua macOS/Zalo hay bị NFD ('THÁNG' viết 2 kiểu khác byte)."""
  return unicodedata.normalize("NFC", name or "").strip()


def compute_file_hash(content: bytes) -> str:
  """Dấu vân tay nội dung để phát hiện file trùng dù khác tên."""
  return hashlib.sha256(content).hexdigest()
