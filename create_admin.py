"""
Tạo / cập nhật tài khoản admin.

Không còn mật khẩu viết cứng trong code. Thông tin lấy từ biến môi trường hoặc nhập khi chạy:
  BRANDFLOW_ADMIN_EMAIL=admin@ten-mien.com BRANDFLOW_ADMIN_PASSWORD=... python create_admin.py
"""
import getpass
import os

import bcrypt

from app.core.database import SessionLocal, init_db
from app.models.models import User


def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def create_admin() -> None:
    init_db()
    admin_email = (os.environ.get("BRANDFLOW_ADMIN_EMAIL") or input("Email admin: ")).strip().lower()
    password = os.environ.get("BRANDFLOW_ADMIN_PASSWORD") or getpass.getpass("Mật khẩu admin: ")
    if len(password) < 12:
        raise SystemExit("Mật khẩu admin phải có ít nhất 12 ký tự.")

    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == admin_email).first()
        if user:
            user.password_hash = get_password_hash(password)
            user.is_admin = True
            print(f"Đã cập nhật mật khẩu và quyền admin cho {admin_email}.")
        else:
            db.add(User(email=admin_email, password_hash=get_password_hash(password),
                        display_name="Admin BrandFlow", is_admin=True, tier="PRO"))
            print(f"Đã tạo tài khoản admin {admin_email}.")
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    create_admin()
