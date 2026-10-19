"""Hồi quy cho các hạng mục nợ kỹ thuật SPECS mục 10: quota lưu DB, CORS, 2FA, gộp trang planning."""

import importlib.util
import sys
import types

import pytest

if "langchain_chroma" not in sys.modules and importlib.util.find_spec("langchain_chroma") is None:
  # máy dev không build được ChromaDB (test_api.py có thể đã stub sẵn)
  _stub = types.ModuleType("langchain_chroma")
  _stub.Chroma = object
  sys.modules.setdefault("langchain_chroma", _stub)

pytest.importorskip("fastapi")
pytest.importorskip("jwt")

from fastapi import FastAPI, HTTPException  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402

from app.core import totp  # noqa: E402
from app.core.database import Base, get_db  # noqa: E402
from app.core.persistent_store import PersistentStore  # noqa: E402


@pytest.fixture
def session_factory(tmp_path):
  import app.models.models  # noqa: F401 — đăng ký bảng

  engine = create_engine(f"sqlite:///{tmp_path / 'test.db'}", connect_args={"check_same_thread": False})
  Base.metadata.create_all(bind=engine)
  return sessionmaker(bind=engine, autoflush=False, autocommit=False)


# ─── 10.1 Quota / usage / plan registry lưu DB ───────────────────────────────

def test_persistent_store_survives_restart_and_is_shared(session_factory):
  writer = PersistentStore("quota_daily_usage", session_factory=session_factory)
  writer.update("2026-10-19::u1::FREE", lambda s: s.update(files_today=s["files_today"] + 2),
                default=lambda: {"files_today": 0, "urls_today": 0})
  # "Worker" khác / sau khi restart: instance mới, cùng DB → thấy cùng số liệu
  reader = PersistentStore("quota_daily_usage", session_factory=session_factory)
  assert reader.get("2026-10-19::u1::FREE") == {"files_today": 2, "urls_today": 0}
  assert PersistentStore("other_namespace", session_factory=session_factory).get("2026-10-19::u1::FREE") is None

  reader["k"] = {"a": 1}
  assert "k" in writer and writer["k"] == {"a": 1}
  writer.clear()
  assert reader.get("k") is None


def test_failed_update_is_rolled_back(session_factory):
  store = PersistentStore("quota_daily_usage", session_factory=session_factory)
  store["u"] = {"files_today": 5}

  def over_quota(state):
    state["files_today"] += 10
    raise HTTPException(status_code=429, detail="quota")

  with pytest.raises(HTTPException):
    store.update("u", over_quota)
  assert store["u"] == {"files_today": 5}  # không cộng khi bị từ chối


def test_week1_quota_enforced_through_db(session_factory, monkeypatch):
  from app.core import quota
  from app.schemas.schemas import OrchestrationMockRequest

  monkeypatch.setattr(quota, "WEEK1_DAILY_USAGE", PersistentStore("quota_daily_usage", session_factory=session_factory))
  request = OrchestrationMockRequest(goal="Tăng doanh thu quý 4", industry="F&B", budget=50_000_000,
                                     user_id="u1", files_count=2, urls_count=1)
  for _ in range(3):  # FREE: tối đa 6 file/ngày, 2 file/lần
    quota._enforce_week1_quota(request, "FREE", "trace")
  with pytest.raises(HTTPException) as exc:
    quota._enforce_week1_quota(request, "FREE", "trace")
  assert exc.value.status_code == 429
  key = quota._build_usage_key("u1", "FREE")
  assert quota.WEEK1_DAILY_USAGE.get(key)["files_today"] == 6


# ─── 10.2 CORS ───────────────────────────────────────────────────────────────

def test_cors_defaults_are_not_wildcard():
  from main import resolve_cors_settings

  default = resolve_cors_settings(None)
  assert "*" not in default["allow_origins"]
  assert "https://brand-flow-hust.vercel.app" in default["allow_origins"]
  assert default["allow_credentials"] is True

  explicit = resolve_cors_settings("https://a.com, https://b.com/")
  assert explicit["allow_origins"] == ["https://a.com", "https://b.com"]

  wildcard = resolve_cors_settings("*")
  assert wildcard["allow_origins"] == ["*"] and wildcard["allow_credentials"] is False


def test_cors_preflight_allows_known_origin_only():
  import main

  client = TestClient(main.app)
  headers = {"Access-Control-Request-Method": "GET"}
  ok = client.options("/health", headers={**headers, "Origin": "https://brand-flow-hust.vercel.app"})
  preview = client.options("/health", headers={**headers, "Origin": "https://brand-flow-hust-git-dev-abc.vercel.app"})
  evil = client.options("/health", headers={**headers, "Origin": "https://evil.example.com"})
  assert ok.headers.get("access-control-allow-origin") == "https://brand-flow-hust.vercel.app"
  assert preview.headers.get("access-control-allow-origin") == "https://brand-flow-hust-git-dev-abc.vercel.app"
  assert "access-control-allow-origin" not in evil.headers


# ─── 10.8 Xác thực 2 lớp ─────────────────────────────────────────────────────

def test_totp_matches_rfc6238_vector():
  secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"  # "12345678901234567890"
  assert totp.code_at_step(secret, 59 // 30) == "287082"   # RFC 6238 T=59 (8 số: 94287082)
  assert totp.verify(secret, "287082", now=59) == 1
  assert totp.verify(secret, "287082", now=59, last_used_step=1) is None  # chống dùng lại
  assert totp.verify(secret, "000000", now=59) is None
  assert totp.provisioning_uri(secret, "a@b.com").startswith("otpauth://totp/BrandFlow%3Aa%40b.com?secret=")


@pytest.fixture
def auth_client(session_factory, monkeypatch):
  from app.api import auth_routes

  monkeypatch.setattr(auth_routes, "_2FA_FAILURES", PersistentStore("2fa_failures", session_factory=session_factory))
  monkeypatch.setattr(auth_routes, "_2FA_LAST_STEP", PersistentStore("2fa_last_step", session_factory=session_factory))
  app = FastAPI()
  app.include_router(auth_routes.router, prefix="/api/v1")

  def _db():
    db = session_factory()
    try:
      yield db
    finally:
      db.close()

  app.dependency_overrides[get_db] = _db
  return TestClient(app)


def _register(client, email="owner@example.com", password="Correct-Horse-9"):
  res = client.post("/api/v1/auth/register", json={"email": email, "password": password})
  assert res.status_code == 200, res.text
  return res.json()


def test_register_never_grants_admin_by_email(auth_client):
  assert _register(auth_client, email="admin@brandflow.ai")["is_admin"] is False
  login = auth_client.post("/api/v1/auth/login", json={"email": "admin@brandflow.ai", "password": "Correct-Horse-9"})
  assert login.json()["is_admin"] is False


def test_two_factor_full_flow(auth_client, monkeypatch):
  token = _register(auth_client)["access_token"]
  auth = {"Authorization": f"Bearer {token}"}
  clock = {"now": 1_800_000_000.0}
  monkeypatch.setattr(totp.time, "time", lambda: clock["now"])
  from app.api import auth_routes
  monkeypatch.setattr(auth_routes.time, "time", lambda: clock["now"])

  assert auth_client.get("/api/v1/auth/2fa/status", headers=auth).json() == {"enabled": False, "pending_setup": False}
  secret = auth_client.post("/api/v1/auth/2fa/setup", headers=auth).json()["secret"]
  bad = auth_client.post("/api/v1/auth/2fa/enable", json={"code": "123456"}, headers=auth)
  assert bad.status_code == 401 and bad.json()["detail"]["error"] == "2FA_INVALID"
  code = totp.code_at_step(secret, totp.current_step(clock["now"]))
  assert auth_client.post("/api/v1/auth/2fa/enable", json={"code": code}, headers=auth).json() == {"enabled": True}

  creds = {"email": "owner@example.com", "password": "Correct-Horse-9"}
  missing = auth_client.post("/api/v1/auth/login", json=creds)
  assert missing.status_code == 401 and missing.json()["detail"]["error"] == "2FA_REQUIRED"
  replay = auth_client.post("/api/v1/auth/login", json={**creds, "otp_code": code})
  assert replay.status_code == 401  # mã đã dùng để bật 2FA không dùng lại được

  clock["now"] += 30
  fresh = totp.code_at_step(secret, totp.current_step(clock["now"]))
  ok = auth_client.post("/api/v1/auth/login", json={**creds, "otp_code": fresh})
  assert ok.status_code == 200 and ok.json()["access_token"]

  clock["now"] += 30
  off = auth_client.post("/api/v1/auth/2fa/disable", json={"code": totp.code_at_step(secret, totp.current_step(clock["now"]))}, headers=auth)
  assert off.json() == {"enabled": False}
  assert auth_client.post("/api/v1/auth/login", json=creds).status_code == 200


def test_two_factor_lockout_after_repeated_failures(auth_client, monkeypatch):
  token = _register(auth_client)["access_token"]
  auth = {"Authorization": f"Bearer {token}"}
  secret = auth_client.post("/api/v1/auth/2fa/setup", headers=auth).json()["secret"]
  auth_client.post("/api/v1/auth/2fa/enable", json={"code": totp.code_at_step(secret, totp.current_step())}, headers=auth)

  creds = {"email": "owner@example.com", "password": "Correct-Horse-9", "otp_code": "000000"}
  statuses = [auth_client.post("/api/v1/auth/login", json=creds).status_code for _ in range(6)]
  assert statuses[:5] == [401] * 5 and statuses[5] == 429
  right = totp.code_at_step(secret, totp.current_step() + 1)
  locked = auth_client.post("/api/v1/auth/login", json={**creds, "otp_code": right})
  assert locked.status_code == 429  # khóa cả khi đã nhập đúng


# ─── 10.4 Gộp trang planning trùng ───────────────────────────────────────────

def test_visible_planning_forms_use_canonical_pages():
  from app.agents.planner.industry_models import PLANNING_FORM_MODEL_MAP

  keys = set(PLANNING_FORM_MODEL_MAP)
  assert {"b4-contingency", "c3-issues", "c2-history"} <= keys
  assert not keys & {"b3-action", "b5-contingency", "b7-gantt", "c2-matrix"}


# ─── 10.7 Celery chạy pipeline thật ──────────────────────────────────────────

def test_plan_job_runs_real_pipeline_with_registered_intent(session_factory, monkeypatch):
  from app.core import ai_pipeline, quota
  from app.workflows import async_plan

  registry = PersistentStore("plan_registry", session_factory=session_factory)
  monkeypatch.setattr(quota, "WEEK1_PLAN_REGISTRY", registry)
  registry["hash-1"] = {"plan_intent": {"goal": "Tăng doanh thu 20%", "industry": "F&B", "budget": 80_000_000,
                                        "target_audience": "Dân văn phòng", "constraints": "", "user_id": "u-9"}}
  calls = {}

  def fake_pipeline(**kwargs):
    calls.update(kwargs)
    return {"final_plan": {"ok": True}, "agent_logs": [{"agent": "CMO"}], "actual_total_cost": 75_000_000}

  monkeypatch.setattr(ai_pipeline, "run_pipeline", fake_pipeline)
  monkeypatch.setattr("app.services.digitization.data_brief.brief_for_agents",
                      lambda tenant: {"text": "Doanh thu 2,1 tỷ"} if tenant == "u-9" else {})
  progress = []
  result = async_plan.run_plan_job({"plan_hash": "hash-1", "answers": {"constraints": "Không chạy TikTok"}},
                                   lambda p, m: progress.append(p))

  assert result["final_plan"] == {"ok": True} and result["internal_data_used"] is True
  assert calls["budget"] == 80_000_000 and calls["constraints"] == "Không chạy TikTok"
  assert calls["brand_dna"] == {"internal_data": {"text": "Doanh thu 2,1 tỷ"}}
  assert progress[0] == 10 and progress[-1] == 100

  with pytest.raises(ValueError):
    async_plan.run_plan_job({"plan_hash": "missing"})
