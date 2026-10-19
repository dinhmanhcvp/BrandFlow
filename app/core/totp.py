"""
TOTP (RFC 6238) cho xác thực 2 lớp — chỉ dùng thư viện chuẩn, tương thích Google Authenticator / Authy.
"""

import base64
import hashlib
import hmac
import secrets
import struct
import time
from typing import Optional
from urllib.parse import quote

DIGITS = 6
PERIOD = 30
WINDOW = 1  # chấp nhận lệch ±1 bước (±30 giây) do đồng hồ điện thoại


def generate_secret() -> str:
  """Secret base32 160-bit (độ dài khuyến nghị của RFC 4226)."""
  return base64.b32encode(secrets.token_bytes(20)).decode("ascii").rstrip("=")


def _decode(secret: str) -> bytes:
  s = secret.strip().replace(" ", "").upper()
  return base64.b32decode(s + "=" * (-len(s) % 8))


def code_at_step(secret: str, step: int) -> str:
  digest = hmac.new(_decode(secret), struct.pack(">Q", step), hashlib.sha1).digest()
  offset = digest[-1] & 0x0F
  value = struct.unpack(">I", digest[offset:offset + 4])[0] & 0x7FFFFFFF
  return str(value % (10 ** DIGITS)).zfill(DIGITS)


def current_step(now: Optional[float] = None) -> int:
  return int((time.time() if now is None else now) // PERIOD)


def verify(secret: str, code: str, now: Optional[float] = None, last_used_step: Optional[int] = None) -> Optional[int]:
  """
  Trả về time-step khớp (để chặn dùng lại mã) hoặc None nếu sai.
  Mã đã dùng ở step <= last_used_step bị từ chối (chống replay).
  """
  code = (code or "").strip().replace(" ", "")
  if not secret or len(code) != DIGITS or not code.isdigit():
    return None
  step = current_step(now)
  for candidate in range(step - WINDOW, step + WINDOW + 1):
    if last_used_step is not None and candidate <= last_used_step:
      continue
    if hmac.compare_digest(code_at_step(secret, candidate), code):
      return candidate
  return None


def provisioning_uri(secret: str, account: str, issuer: str = "BrandFlow") -> str:
  """otpauth:// URI để app authenticator quét QR."""
  label = quote(f"{issuer}:{account}")
  return (f"otpauth://totp/{label}?secret={secret}&issuer={quote(issuer)}"
          f"&algorithm=SHA1&digits={DIGITS}&period={PERIOD}")
