"""
Quota theo tier, telemetry chi phí model và plan registry (no-plan-no-run).

Trước đây lưu bằng dict in-memory → mất khi restart, sai khi chạy nhiều worker.
Nay lưu trong bảng kv_store (app/core/persistent_store.py) dùng chung DATABASE_URL.
(Tách từ main.py.)
"""

import uuid
from datetime import date
from typing import Dict

from fastapi import HTTPException, Request

from app.core.ai_pipeline import build_error_envelope
from app.core.persistent_store import PersistentStore
from app.schemas.schemas import OrchestrationMockRequest, PlanIntent

WEEK1_QUOTA_POLICY = {
    "FREE": {
        "max_files_per_request": 2,
        "max_files_per_day": 6,
        "max_file_size_mb": 10,
        "max_urls_per_day": 3,
    },
    "PLUS": {
        "max_files_per_request": 5,
        "max_files_per_day": 30,
        "max_file_size_mb": 25,
        "max_urls_per_day": 15,
    },
    "PRO": {
        "max_files_per_request": 15,
        "max_files_per_day": 120,
        "max_file_size_mb": 100,
        "max_urls_per_day": 80,
    },
}

# Bộ đếm theo ngày (key có ngày) và plan registry — lưu DB, không còn in-memory
WEEK1_DAILY_USAGE = PersistentStore("quota_daily_usage")
WEEK1_PLAN_REGISTRY = PersistentStore("plan_registry")
WEEK1_MODEL_USAGE = PersistentStore("model_usage")
DAILY_RETENTION_DAYS = 14


def purge_expired_usage() -> None:
    """Gọi lúc startup: xóa bộ đếm theo ngày đã cũ."""
    WEEK1_DAILY_USAGE.purge_older_than(DAILY_RETENTION_DAYS)
    WEEK1_MODEL_USAGE.purge_older_than(DAILY_RETENTION_DAYS)


def _normalize_tier(raw_tier: str) -> str:
    tier = (raw_tier or "FREE").strip().upper()
    if tier not in WEEK1_QUOTA_POLICY:
        return "FREE"
    return tier


def _resolve_trace_id(http_request: Request) -> str:
    incoming = (http_request.headers.get("X-Trace-Id") or "").strip()
    if incoming:
        return incoming
    return str(uuid.uuid4())


def _build_usage_key(user_id: str, tier: str) -> str:
    return f"{date.today().isoformat()}::{user_id}::{tier}"


def _default_model_usage_bucket() -> dict:
    return {
        "runs_today": 0,
        "total_tokens_est": 0,
        "total_estimated_cost_usd": 0.0,
        "route_counts": {},
        "provider_breakdown": {
            "local": {
                "runs": 0,
                "tokens": 0,
                "estimated_cost_usd": 0.0,
            },
            "cloud": {
                "runs": 0,
                "tokens": 0,
                "estimated_cost_usd": 0.0,
            },
            "unknown": {
                "runs": 0,
                "tokens": 0,
                "estimated_cost_usd": 0.0,
            },
        },
        "last_trace_id": None,
        "last_route_decision": "unknown",
        "last_route_reason_code": "UNKNOWN_REASON",
        "last_primary_model": {
            "provider": "unknown",
            "model": "unknown",
        },
    }


def _record_model_usage(
    *,
    user_id: str,
    tier: str,
    trace_id: str,
    result_payload: dict,
) -> dict:
    usage_key = _build_usage_key(user_id, tier)

    usage_telemetry = dict(result_payload.get("usage_telemetry", {}) or {})
    model_router = dict(result_payload.get("model_router", {}) or {})
    primary_model = dict(model_router.get("primary", {}) or {})

    total_tokens = int(usage_telemetry.get("total_tokens_est", 0) or 0)
    estimated_cost_usd = float(usage_telemetry.get("estimated_cost_usd", 0.0) or 0.0)
    route_decision = str(result_payload.get("route_decision", "unknown") or "unknown")
    route_reason_code = str(result_payload.get("route_reason_code", "UNKNOWN_REASON") or "UNKNOWN_REASON")

    provider = str(primary_model.get("provider", "unknown") or "unknown").lower()

    def _apply(usage_bucket: dict) -> None:
        bucket_provider = provider if provider in usage_bucket["provider_breakdown"] else "unknown"
        usage_bucket["runs_today"] += 1
        usage_bucket["total_tokens_est"] += total_tokens
        usage_bucket["total_estimated_cost_usd"] = round(
            float(usage_bucket["total_estimated_cost_usd"]) + estimated_cost_usd,
            8,
        )

        usage_bucket["route_counts"][route_decision] = int(usage_bucket["route_counts"].get(route_decision, 0)) + 1

        provider_bucket = usage_bucket["provider_breakdown"][bucket_provider]
        provider_bucket["runs"] += 1
        provider_bucket["tokens"] += total_tokens
        provider_bucket["estimated_cost_usd"] = round(float(provider_bucket["estimated_cost_usd"]) + estimated_cost_usd, 8)

        usage_bucket["last_trace_id"] = trace_id
        usage_bucket["last_route_decision"] = route_decision
        usage_bucket["last_route_reason_code"] = route_reason_code
        usage_bucket["last_primary_model"] = {
            "provider": primary_model.get("provider", "unknown"),
            "model": primary_model.get("model", "unknown"),
        }

    usage_bucket = WEEK1_MODEL_USAGE.update(usage_key, _apply, default=_default_model_usage_bucket)

    return {
        "usage_date": date.today().isoformat(),
        "user_id": user_id,
        "tier": tier,
        "runs_today": usage_bucket["runs_today"],
        "total_tokens_est": usage_bucket["total_tokens_est"],
        "total_estimated_cost_usd": usage_bucket["total_estimated_cost_usd"],
        "route_counts": dict(usage_bucket["route_counts"]),
        "provider_breakdown": usage_bucket["provider_breakdown"],
        "last_trace_id": usage_bucket["last_trace_id"],
        "last_route_decision": usage_bucket["last_route_decision"],
        "last_route_reason_code": usage_bucket["last_route_reason_code"],
        "last_primary_model": usage_bucket["last_primary_model"],
    }


def _get_model_usage_summary(user_id: str, tier: str) -> dict:
    usage_key = _build_usage_key(user_id, tier)
    usage_bucket = WEEK1_MODEL_USAGE.get(usage_key)
    if usage_bucket is None:
        usage_bucket = _default_model_usage_bucket()

    return {
        "usage_date": date.today().isoformat(),
        "user_id": user_id,
        "tier": tier,
        "runs_today": usage_bucket["runs_today"],
        "total_tokens_est": usage_bucket["total_tokens_est"],
        "total_estimated_cost_usd": usage_bucket["total_estimated_cost_usd"],
        "route_counts": dict(usage_bucket["route_counts"]),
        "provider_breakdown": usage_bucket["provider_breakdown"],
        "last_trace_id": usage_bucket["last_trace_id"],
        "last_route_decision": usage_bucket["last_route_decision"],
        "last_route_reason_code": usage_bucket["last_route_reason_code"],
        "last_primary_model": usage_bucket["last_primary_model"],
    }


def _raise_quota_error(
    trace_id: str,
    tier: str,
    status_code: int,
    code: str,
    message: str,
    limit: dict,
    usage: dict,
    retryable: bool,
) -> None:
    detail = build_error_envelope(
        trace_id=trace_id,
        code=code,
        message=message,
        status_code=status_code,
        node_name="api_quota_guard",
        retryable=retryable,
        details={
            "tier": tier,
            "limit": limit,
            "usage": usage,
        },
    )
    raise HTTPException(status_code=status_code, detail=detail)


def _enforce_week1_quota(request: OrchestrationMockRequest, tier: str, trace_id: str) -> None:
    policy = WEEK1_QUOTA_POLICY[tier]

    if request.file_size_mb > policy["max_file_size_mb"]:
        _raise_quota_error(
            trace_id=trace_id,
            tier=tier,
            status_code=413,
            code="QUOTA_FILE_SIZE_EXCEEDED",
            message="Dung lượng file vượt giới hạn tier.",
            limit={"max_file_size_mb": policy["max_file_size_mb"]},
            usage={"file_size_mb": request.file_size_mb},
            retryable=False,
        )

    if request.files_count > policy["max_files_per_request"]:
        _raise_quota_error(
            trace_id=trace_id,
            tier=tier,
            status_code=413,
            code="QUOTA_FILES_PER_REQUEST_EXCEEDED",
            message="Số lượng file trong request vượt giới hạn tier.",
            limit={"max_files_per_request": policy["max_files_per_request"]},
            usage={"files_count": request.files_count},
            retryable=False,
        )

    usage_key = _build_usage_key(request.user_id, tier)

    # Kiểm tra + cộng dồn trong CÙNG một transaction: nhiều worker cùng lúc không vượt quota.
    # Lỗi quota ném ra trong _apply → transaction rollback, không cộng gì.
    def _apply(current_usage: dict) -> None:
        projected_files_today = current_usage["files_today"] + request.files_count
        if projected_files_today > policy["max_files_per_day"]:
            _raise_quota_error(
                trace_id=trace_id,
                tier=tier,
                status_code=429,
                code="QUOTA_FILES_PER_DAY_EXCEEDED",
                message="Số lượng file/ngày đã vượt quota tier.",
                limit={"max_files_per_day": policy["max_files_per_day"]},
                usage={"files_today": projected_files_today},
                retryable=True,
            )

        projected_urls_today = current_usage["urls_today"] + request.urls_count
        if projected_urls_today > policy["max_urls_per_day"]:
            _raise_quota_error(
                trace_id=trace_id,
                tier=tier,
                status_code=429,
                code="QUOTA_URLS_PER_DAY_EXCEEDED",
                message="Số lượng URL/ngày đã vượt quota tier.",
                limit={"max_urls_per_day": policy["max_urls_per_day"]},
                usage={"urls_today": projected_urls_today},
                retryable=True,
            )

        current_usage["files_today"] = projected_files_today
        current_usage["urls_today"] = projected_urls_today

    WEEK1_DAILY_USAGE.update(usage_key, _apply, default=lambda: {"files_today": 0, "urls_today": 0})


def _resolve_registered_plan_or_raise(plan_hash: str, trace_id: str) -> dict:
    resolved_hash = (plan_hash or "").strip()
    if not resolved_hash:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="PLAN_REQUIRED",
            message="Thiếu plan_hash. Chính sách no-plan-no-run đang bật.",
            status_code=400,
            node_name="api_plan_guard",
            retryable=False,
            details={"required_field": "plan_hash"},
        )
        raise HTTPException(status_code=400, detail=detail)

    plan_entry = WEEK1_PLAN_REGISTRY.get(resolved_hash)
    if not plan_entry:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="PLAN_HASH_NOT_FOUND",
            message="Không tìm thấy plan_hash hợp lệ. Vui lòng submit wizard trước.",
            status_code=400,
            node_name="api_plan_guard",
            retryable=False,
            details={"plan_hash": resolved_hash},
        )
        raise HTTPException(status_code=400, detail=detail)

    return plan_entry


def _enforce_plan_ownership(plan_intent: dict, user_id: str, tier: str, trace_id: str) -> None:
    intent_user = (plan_intent.get("user_id") or "anonymous").strip() or "anonymous"
    request_user = (user_id or "anonymous").strip() or "anonymous"
    if intent_user != request_user:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="PLAN_FORBIDDEN",
            message="plan_hash không thuộc user hiện tại.",
            status_code=403,
            node_name="api_plan_guard",
            retryable=False,
            details={
                "plan_user_id": intent_user,
                "request_user_id": request_user,
            },
        )
        raise HTTPException(status_code=403, detail=detail)

    intent_tier = _normalize_tier(str(plan_intent.get("tier", "FREE")))
    if intent_tier != tier:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="PLAN_TIER_MISMATCH",
            message="Tier hiện tại không khớp tier đã compile trong plan_intent.",
            status_code=403,
            node_name="api_plan_guard",
            retryable=False,
            details={
                "plan_tier": intent_tier,
                "request_tier": tier,
            },
        )
        raise HTTPException(status_code=403, detail=detail)


def _store_plan_intent(plan_hash: str, plan_intent: dict, trace_id: str) -> dict:
    safe_hash = (plan_hash or "").strip()
    sanitized_intent = dict(plan_intent or {})
    sanitized_intent.pop("plan_hash", None)

    validated_plan_intent = PlanIntent(plan_hash=safe_hash, **sanitized_intent).model_dump()
    WEEK1_PLAN_REGISTRY[safe_hash] = {
        "plan_intent": validated_plan_intent,
        "trace_id": trace_id,
    }
    return validated_plan_intent


def _apply_clarification_answers(plan_intent: dict, clarification_answers: Dict[str, str]) -> dict:
    if not clarification_answers:
        return plan_intent

    updated_intent = dict(plan_intent)
    for key in ("target_audience", "constraints"):
        value = clarification_answers.get(key)
        if value is None:
            continue
        normalized = str(value).strip()
        if normalized:
            updated_intent[key] = normalized

    return updated_intent


def _assert_no_sub_agent_user_questions(agent_logs: list[dict], trace_id: str) -> None:
    violations = []
    for log in agent_logs or []:
        if not bool(log.get("ask_user", False)):
            continue

        agent_name = str(log.get("agent", "")).strip().upper()
        if agent_name in {"SYSTEM", "MAIN", "ORCHESTRATOR"}:
            continue

        violations.append(
            {
                "agent": log.get("agent", "UNKNOWN"),
                "message": log.get("message", ""),
            }
        )

    if violations:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="SUB_AGENT_ASK_USER_BLOCKED",
            message="Sub-agent không được phép hỏi user trong multi-step run.",
            status_code=400,
            node_name="api_execute_policy_guard",
            retryable=False,
            details={
                "violations": violations,
                "policy": "sub_agent_user_question_allowed=false",
            },
        )
        raise HTTPException(status_code=400, detail=detail)
