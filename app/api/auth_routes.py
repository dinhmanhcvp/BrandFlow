import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt # PyJWT

from app.models.models import User
from app.core.database import get_db
from app.core import totp
from app.core.persistent_store import PersistentStore

import requests
import time
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# JWT Config
# ⚠️ SECURITY: JWT_SECRET_KEY MUST be set via environment variable in production.
#  Fallback is ONLY for local development. Deploy without it = catastrophic vulnerability.
_DEFAULT_DEV_SECRET = "SUPER_SECRET_KEY_BRANDFLOW_2026"
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", _DEFAULT_DEV_SECRET)
if SECRET_KEY == _DEFAULT_DEV_SECRET:
  import warnings
  warnings.warn(
    "⚠️ [SECURITY] JWT_SECRET_KEY not set! Using insecure default. "
    "SET JWT_SECRET_KEY env var before deploying to production.",
    stacklevel=2,
  )
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days

# Social Auth Config
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID")
FACEBOOK_APP_ID = os.environ.get("FACEBOOK_APP_ID", "YOUR_FACEBOOK_APP_ID")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme)) -> str:
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Không tìm thấy token xác thực",
      headers={"WWW-Authenticate": "Bearer"},
    )
  # Guest token bypass — limited access, no JWT decode needed.
  # NOTE: Guest users are isolated by their token string as user_id.
  # All data queries filter by user_id, so guests can only see their own data.
  if token.startswith("guest_"):
    # Sanitize: only allow alphanumeric + underscore, max 64 chars
    import re
    if not re.match(r'^guest_[a-zA-Z0-9_]{1,58}$', token):
      raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid guest token format",
      )
    return token
  try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    user_id: str = payload.get("sub")
    if user_id is None:
      raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token không hợp lệ",
        headers={"WWW-Authenticate": "Bearer"},
      )
    return user_id
  except jwt.ExpiredSignatureError:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Token đã hết hạn",
      headers={"WWW-Authenticate": "Bearer"},
    )
  except jwt.PyJWTError:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Không thể xác thực token",
      headers={"WWW-Authenticate": "Bearer"},
    )

def get_optional_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[str]:
  """
  Như get_current_user nhưng cho phép ẩn danh: không có token, token hết hạn hoặc token
  demo không phải JWT (vd. 'mock_admin_token') → None. Dùng cho luồng onboarding/planning cũ
  để không làm gãy trải nghiệm; dữ liệu chỉ được lưu theo tenant khi token hợp lệ.
  """
  if not token:
    return None
  try:
    return get_current_user(token)
  except HTTPException:
    return None

def get_admin_user(user_id: str = Depends(get_current_user), db: Session = Depends(get_db)) -> str:
  """Xác minh user hiện tại có phải là Admin hay không."""
  user = db.query(User).filter(User.id == user_id).first()
  if not user or not user.is_admin:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail="Bạn không có quyền quản trị viên",
    )
  return user_id

router = APIRouter(prefix="/auth", tags=["Authentication"])

class Token(BaseModel):
  access_token: str
  token_type: str
  user_id: str
  email: str
  is_admin: bool = False

class UserCreate(BaseModel):
  email: EmailStr
  password: str
  display_name: Optional[str] = "BrandFlow User"
  invite_code: Optional[str] = None

class UserLogin(BaseModel):
  email: EmailStr
  password: str
  otp_code: Optional[str] = None  # bắt buộc khi tài khoản bật 2FA

class SocialLoginRequest(BaseModel):
  token: str
  provider: str # 'google' | 'facebook'
  otp_code: Optional[str] = None

class OtpCode(BaseModel):
  code: str


# ── Xác thực 2 lớp (TOTP) ─────────────────────────────────────────
_2FA_FAILURES = PersistentStore("2fa_failures")
_2FA_LAST_STEP = PersistentStore("2fa_last_step")
MAX_2FA_FAILURES = 5
LOCKOUT_SECONDS = 15 * 60


def _check_otp(user: User, code: Optional[str]) -> None:
  """
  Kiểm tra mã TOTP của user. Sai quá 5 lần → khóa 15 phút; mã đã dùng không dùng lại được.
  Ném HTTPException 401 với detail.error = 2FA_REQUIRED | 2FA_INVALID | 2FA_LOCKED.
  """
  now = time.time()
  failures = _2FA_FAILURES.get(user.id, {"count": 0, "locked_until": 0})
  if failures.get("locked_until", 0) > now:
    raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail={
      "error": "2FA_LOCKED", "message": "Nhập sai mã quá nhiều lần. Thử lại sau 15 phút.",
    })
  if not code:
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
      "error": "2FA_REQUIRED", "message": "Nhập mã 6 số từ ứng dụng xác thực.",
    })
  step = totp.verify(user.two_factor_secret or "", code, now=now, last_used_step=_2FA_LAST_STEP.get(user.id))
  if step is None:
    def _fail(state):
      state["count"] = state.get("count", 0) + 1
      if state["count"] >= MAX_2FA_FAILURES:
        state["count"], state["locked_until"] = 0, now + LOCKOUT_SECONDS
    _2FA_FAILURES.update(user.id, _fail, default=lambda: {"count": 0, "locked_until": 0})
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
      "error": "2FA_INVALID", "message": "Mã xác thực không đúng hoặc đã hết hạn.",
    })
  _2FA_LAST_STEP[user.id] = step
  _2FA_FAILURES[user.id] = {"count": 0, "locked_until": 0}


def _require_second_factor(user: User, code: Optional[str]) -> None:
  if user.is_2fa_enabled:
    _check_otp(user, code)

def verify_password(plain_password: str, hashed_password: str):
  if not hashed_password: return False
  return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str):
  salt = bcrypt.gensalt()
  return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta):
  to_encode = data.copy()
  expire = datetime.now(timezone.utc) + expires_delta
  to_encode.update({"exp": expire})
  return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register", response_model=Token)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
  db_user = db.query(User).filter(User.email == user.email).first()
  if db_user:
    raise HTTPException(status_code=400, detail="Email này đã được đăng ký.")
  
  hashed_password = get_password_hash(user.password)
  
  # Không tự cấp quyền admin theo email: email không được xác minh nên ai cũng đăng ký được.
  # Tạo admin bằng `python create_admin.py` (đọc thông tin từ biến môi trường).
  is_admin = False
  
  # Xác định Tier cho người dùng
  tier = "FREE"
  if user.invite_code == os.environ.get("BETA_INVITE_CODE", "ENTERPRISE_BETA_2026"):
    tier = "PRO"
  elif is_admin:
    tier = "PRO"
  
  new_user = User(
    email=user.email,
    password_hash=hashed_password,
    display_name=user.display_name,
    is_admin=is_admin,
    tier=tier
  )
  db.add(new_user)
  db.commit()
  db.refresh(new_user)
  
  access_token = create_access_token(
    data={"sub": new_user.id},
    expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  )
  return {
    "access_token": access_token, 
    "token_type": "bearer",
    "user_id": new_user.id,
    "email": new_user.email,
    "is_admin": new_user.is_admin
  }

@router.post("/login", response_model=Token)
def login_user(user: UserLogin, db: Session = Depends(get_db)):
  db_user = db.query(User).filter(User.email == user.email).first()
  if not db_user or not verify_password(user.password, db_user.password_hash):
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sai email hoặc mật khẩu")
  _require_second_factor(db_user, user.otp_code)
  
  access_token = create_access_token(
    data={"sub": db_user.id},
    expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  )
  
  return {
    "access_token": access_token, 
    "token_type": "bearer",
    "user_id": db_user.id,
    "email": db_user.email,
    "is_admin": db_user.is_admin
  }

@router.post("/social", response_model=Token)
def social_login(request: SocialLoginRequest, db: Session = Depends(get_db)):
  email = None
  name = "BrandFlow User"

  if request.provider == 'google':
    if request.token == "mock_google_token":
      email = "mock_google_user@brandflow.ai"
      name = "Mock Google User"
    else:
      try:
        # Xác thực Access Token của Google (phù hợp với useGoogleLogin React hook)
        gg_url = f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={request.token}"
        response = requests.get(gg_url)
        if response.status_code != 200:
          raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google access token")
        
        gg_data = response.json()
        email = gg_data.get('email')
        name = gg_data.get('name', "Google User")
      except HTTPException:
        raise
      except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Error connecting to Google")

  elif request.provider == 'facebook':
    if request.token == "mock_facebook_token":
      email = "mock_facebook_user@brandflow.ai"
      name = "Mock Facebook User"
    else:
      # Xác thực Access token của Facebook qua Graph API
      app_id = FACEBOOK_APP_ID
      fb_url = f"https://graph.facebook.com/me?fields=id,name,email&access_token={request.token}"
      response = requests.get(fb_url)
      if response.status_code != 200:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Facebook token")
      
      fb_data = response.json()
      if 'email' not in fb_data:
        # Facebook không trả về email (do user không cấp quyền hoặc đăng ký bằng SĐT)
        email = f"{fb_data['id']}@facebook.mock.com"
      else:
        email = fb_data['email']
        
      name = fb_data.get('name', "Facebook User")

  else:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported provider")

  if not email:
    raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Could not retrieve email from provider")

  # Kiểm tra xem user đã tồn tại chưa
  db_user = db.query(User).filter(User.email == email).first()
  
  if not db_user:
    # Tự động tạo tài khoản mới nếu chưa tồn tại
    # Tạo password ngẫu nhiên vì user đăng nhập bằng Social
    random_password = get_password_hash(email + SECRET_KEY)
    db_user = User(
      email=email,
      password_hash=random_password,
      display_name=name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
  _require_second_factor(db_user, request.otp_code)

  # Cấp phát Token
  access_token = create_access_token(
    data={"sub": db_user.id},
    expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  )
  
  return {
    "access_token": access_token, 
    "token_type": "bearer",
    "user_id": db_user.id,
    "email": db_user.email,
    "is_admin": db_user.is_admin
  }

# ═══════════════════════════════════════════════════════════════════
# XÁC THỰC 2 LỚP (TOTP) — bật/tắt cho tài khoản hiện tại
# ═══════════════════════════════════════════════════════════════════

def _load_user(db: Session, user_id: str) -> User:
  user = db.query(User).filter(User.id == user_id).first()
  if not user:
    raise HTTPException(status_code=404, detail="Tài khoản không tồn tại (tài khoản khách không dùng được 2FA)")
  return user


@router.get("/2fa/status")
def two_factor_status(db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user)):
  user = _load_user(db, current_user_id)
  return {"enabled": bool(user.is_2fa_enabled), "pending_setup": bool(user.two_factor_secret and not user.is_2fa_enabled)}


@router.post("/2fa/setup")
def two_factor_setup(db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user)):
  """Tạo secret mới (chưa bật). Người dùng quét QR rồi gọi /2fa/enable với mã 6 số để bật."""
  user = _load_user(db, current_user_id)
  if user.is_2fa_enabled:
    raise HTTPException(status_code=400, detail="2FA đã bật. Tắt trước khi thiết lập lại.")
  user.two_factor_secret = totp.generate_secret()
  db.commit()
  return {
    "secret": user.two_factor_secret,
    "otpauth_uri": totp.provisioning_uri(user.two_factor_secret, user.email or user.id),
  }


@router.post("/2fa/enable")
def two_factor_enable(body: OtpCode, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user)):
  user = _load_user(db, current_user_id)
  if user.is_2fa_enabled:
    return {"enabled": True}
  if not user.two_factor_secret:
    raise HTTPException(status_code=400, detail="Chưa thiết lập 2FA. Gọi /2fa/setup trước.")
  _check_otp(user, body.code)
  user.is_2fa_enabled = True
  db.commit()
  return {"enabled": True}


@router.post("/2fa/disable")
def two_factor_disable(body: OtpCode, db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user)):
  """Tắt 2FA — vẫn phải nhập mã hiện tại để kẻ chiếm phiên đăng nhập không tắt được."""
  user = _load_user(db, current_user_id)
  if not user.is_2fa_enabled:
    return {"enabled": False}
  _check_otp(user, body.code)
  user.is_2fa_enabled = False
  user.two_factor_secret = None
  db.commit()
  return {"enabled": False}


# ═══════════════════════════════════════════════════════════════════
# GDPR & COMPLIANCE APIs (Right to be Forgotten & Data Portability)
# ═══════════════════════════════════════════════════════════════════

@router.delete("/users/me")
def delete_current_user(db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user)):
  """GDPR Compliance: Right to be Forgotten. Xóa toàn bộ dữ liệu User."""
  user = db.query(User).filter(User.id == current_user_id).first()
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  
  db.delete(user) # Cascade sẽ xóa Projects, Forms, Metrics, Members
  db.commit()
  return {"status": "success", "message": "All user data has been permanently deleted."}

@router.get("/users/me/export")
def export_user_data(db: Session = Depends(get_db), current_user_id: str = Depends(get_current_user)):
  """GDPR Compliance: Data Portability. Xuất toàn bộ dữ liệu User ra JSON."""
  user = db.query(User).filter(User.id == current_user_id).first()
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
    
  export_data = {
    "user_profile": {
      "email": user.email,
      "display_name": user.display_name,
      "tier": user.tier,
      "created_at": user.created_at.isoformat(),
      "is_2fa_enabled": user.is_2fa_enabled,
      "privacy_mode": getattr(user, "privacy_mode", False)
    },
    "projects": []
  }
  
  for project in user.projects:
    proj_data = {
      "id": project.id,
      "name": project.name,
      "industry": project.industry,
      "created_at": project.created_at.isoformat(),
      "forms": [
        {
          "form_key": f.form_key,
          "data": f.data,
          "updated_at": f.updated_at.isoformat()
        } for f in project.form_entries
      ],
      "metrics": []
    }
    if hasattr(project, 'metrics') and project.metrics:
      for m in project.metrics:
        proj_data["metrics"].append({
          "tam": m.tam,
          "cac": m.cac,
          "ltv": m.ltv,
          "ai_telemetry": m.ai_telemetry_data
        })
    export_data["projects"].append(proj_data)
    
  return export_data


# ═══════════════════════════════════════════════════════════════════
# ADMIN APIs (Quản lý User & Beta Testing)
# ═══════════════════════════════════════════════════════════════════

@router.get("/admin/users")
def get_all_users(db: Session = Depends(get_db), admin_id: str = Depends(get_admin_user)):
  """Admin lấy danh sách tất cả users trên hệ thống."""
  users = db.query(User).all()
  return {
    "status": "success", 
    "data": [
      {
        "id": u.id, 
        "email": u.email, 
        "display_name": u.display_name,
        "tier": u.tier, 
        "is_admin": u.is_admin,
        "created_at": u.created_at.isoformat()
      } for u in users
    ]
  }

class UpgradeTierRequest(BaseModel):
  tier: str

@router.post("/admin/users/{user_id}/upgrade")
def upgrade_user_tier(user_id: str, req: UpgradeTierRequest, db: Session = Depends(get_db), admin_id: str = Depends(get_admin_user)):
  """Admin nâng cấp tier cho khách hàng doanh nghiệp."""
  user = db.query(User).filter(User.id == user_id).first()
  if not user:
    raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")
  
  allowed_tiers = ["FREE", "PLUS", "PRO"]
  if req.tier not in allowed_tiers:
    raise HTTPException(status_code=400, detail=f"Tier không hợp lệ. Phải là một trong: {allowed_tiers}")
    
  user.tier = req.tier
  db.commit()
  return {"status": "success", "message": f"Tài khoản {user.email} đã được nâng cấp lên hạng {req.tier}."}

class AdminCreateUserRequest(BaseModel):
  email: EmailStr
  password: str
  display_name: str
  tier: str = "PRO"

@router.post("/admin/users/create")
def admin_create_user(req: AdminCreateUserRequest, db: Session = Depends(get_db), admin_id: str = Depends(get_admin_user)):
  """Admin chủ động tạo tài khoản (Concierge Onboarding) cho doanh nghiệp."""
  db_user = db.query(User).filter(User.email == req.email).first()
  if db_user:
    raise HTTPException(status_code=400, detail="Email này đã tồn tại trong hệ thống.")
  
  hashed_password = get_password_hash(req.password)
  new_user = User(
    email=req.email,
    password_hash=hashed_password,
    display_name=req.display_name,
    tier=req.tier
  )
  db.add(new_user)
  db.commit()
  db.refresh(new_user)
  
  return {
    "status": "success",
    "message": f"Đã tạo thành công tài khoản {req.email} với hạng {req.tier}.",
    "data": {
      "id": new_user.id,
      "email": new_user.email,
      "tier": new_user.tier
    }
  }

