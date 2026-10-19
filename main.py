"""
BrandFlow API — điểm vào FastAPI.

File này chỉ tạo app, gắn middleware/CORS, khởi tạo DB lúc startup và đăng ký router.
Nghiệp vụ nằm trong app/api/*_routes.py; quota/plan registry ở app/core/quota.py.
"""

import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from dotenv import load_dotenv
load_dotenv()

import os
if "GOOGLE_API_KEY" not in os.environ and "GEMINI_API_KEY" in os.environ:
    os.environ["GOOGLE_API_KEY"] = os.environ["GEMINI_API_KEY"]


from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api import audit_routes
from app.api.account_routes import router as account_router
from app.api.agent_builder_routes import router as agent_builder_router
from app.api.agile_routes import router as agile_router
from app.api.analytics_routes import router as analytics_router
from app.api.auth_routes import router as auth_router
from app.api.content_lab import router as content_lab_router
from app.api.data_routes import router as data_router
from app.api.design_routes import router as design_router
from app.api.form_routes import router as form_router
from app.api.onboarding_ingest_routes import router as onboarding_ingest_router
from app.api.onboarding_routes import router as onboarding_router
from app.api.planning_routes import router as planning_router
from app.api.research_routes import router as research_router
from app.api.system_routes import router as system_router
from app.core.database import init_db as init_form_db
from app.core.quota import purge_expired_usage

limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
app = FastAPI(
    title="BrandFlow APIs",
    description="APIs for BrandFlow Memory and RAG Strategy Engine.",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# ── CORS ───────────────────────────────────────────────────────────
# Mặc định KHÔNG mở '*' nữa: chỉ cho phép dev local + domain production đã biết (và preview của Vercel).
# Ghi đè bằng BRANDFLOW_FRONTEND_URLS="https://a.com,https://b.com". Muốn mở toàn bộ (không khuyến nghị)
# phải đặt tường minh BRANDFLOW_FRONTEND_URLS="*".
DEFAULT_FRONTEND_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://brand-flow-hust.vercel.app",
]
DEFAULT_FRONTEND_ORIGIN_REGEX = r"https://brand-flow-hust(-[a-z0-9-]+)?\.vercel\.app"


def resolve_cors_settings(raw_origins: str | None) -> dict:
    raw = (raw_origins or "").strip()
    if raw == "*":
        # Trình duyệt không chấp nhận '*' kèm credentials → tắt credentials khi mở toàn bộ
        return {"allow_origins": ["*"], "allow_origin_regex": None, "allow_credentials": False}
    if raw:
        origins = [o.strip().rstrip("/") for o in raw.split(",") if o.strip()]
        return {"allow_origins": origins, "allow_origin_regex": None, "allow_credentials": True}
    return {"allow_origins": DEFAULT_FRONTEND_ORIGINS, "allow_origin_regex": DEFAULT_FRONTEND_ORIGIN_REGEX,
            "allow_credentials": True}


_cors = resolve_cors_settings(os.environ.get("BRANDFLOW_FRONTEND_URLS"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors["allow_origins"],
    allow_origin_regex=_cors["allow_origin_regex"],
    allow_credentials=_cors["allow_credentials"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def app_startup() -> None:
    """Initialize databases on startup."""
    # Configure Loguru
    logger.remove()
    logger.add(sys.stdout, colorize=True, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>")
    logger.add("logs/brandflow.log", rotation="50 MB", retention="10 days", level="INFO")

    audit_routes.VISITOR_AUDIT_STORE.init_db()
    # Tạo bảng Users/Projects/FormData/kv_store nếu chưa có
    init_form_db()
    purge_expired_usage()
    logger.info("✅ [DB] Form database initialized.")


# ── Routers ────────────────────────────────────────────────────────
# Thứ tự giữ như trước khi tách main.py: route đăng ký trước thắng khi trùng path.
app.include_router(system_router)
app.include_router(auth_router, prefix="/api/v1")
app.include_router(research_router)
app.include_router(agent_builder_router, prefix="/api/v1/agents")
app.include_router(form_router)
app.include_router(onboarding_router)
app.include_router(data_router)
app.include_router(design_router)
app.include_router(content_lab_router, prefix="/api/content-lab", tags=["Content Lab"])
app.include_router(analytics_router)
app.include_router(agile_router, prefix="/api/agile", tags=["Agile Campaign"])
app.include_router(planning_router)
app.include_router(account_router)
app.include_router(audit_routes.router)
app.include_router(onboarding_ingest_router)


@app.middleware("http")
async def visitor_audit_middleware(request: Request, call_next):
    """Persist access history for evidence of who entered the app."""
    trace_id = (request.headers.get("X-Trace-Id") or "").strip() or None
    tier_hint = (request.headers.get("X-Tier") or "").strip() or None
    client_host = request.client.host if request.client else None
    store = audit_routes.VISITOR_AUDIT_STORE

    try:
        response = await call_next(request)
    except Exception:
        try:
            store.record_visit(
                headers=dict(request.headers),
                client_host=client_host,
                method=request.method,
                path=request.url.path,
                status_code=500,
                trace_id=trace_id,
                tier_hint=tier_hint,
            )
        except Exception as audit_error:
            print(f"[AUDIT] Failed to record error visit: {audit_error}")
        raise

    try:
        store.record_visit(
            headers=dict(request.headers),
            client_host=client_host,
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            trace_id=trace_id,
            tier_hint=tier_hint,
        )
    except Exception as audit_error:
        print(f"[AUDIT] Failed to record visit: {audit_error}")

    return response


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        reload_excludes=["./temp_uploads/*", "./chroma_db/*"]
    )
