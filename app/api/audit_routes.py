"""
Route audit truy cập (visitor analytics) cho admin. (Tách từ main.py.)
"""

import os
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request

from app.core.ai_pipeline import (
    build_error_envelope,
)
from app.core.access_audit import VisitorAuditStore
from app.api.auth_routes import get_admin_user
from app.core.quota import (
    _resolve_trace_id,
)

router = APIRouter(tags=["Audit"])

VISITOR_AUDIT_STORE = VisitorAuditStore()
AUDIT_ADMIN_TOKEN = os.environ.get("BRANDFLOW_AUDIT_ADMIN_TOKEN", "").strip()


def _require_audit_admin_token(request: Request) -> None:
    expected = (AUDIT_ADMIN_TOKEN or "").strip()
    trace_id = _resolve_trace_id(request)

    if not expected:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="AUDIT_TOKEN_NOT_CONFIGURED",
            message="Audit admin token chưa được cấu hình trên server.",
            status_code=503,
            node_name="api_audit_auth",
            retryable=False,
            details={"required_header": "X-Audit-Admin-Token"},
        )
        raise HTTPException(status_code=503, detail=detail)

    provided = (request.headers.get("X-Audit-Admin-Token") or "").strip()
    if provided != expected:
        detail = build_error_envelope(
            trace_id=trace_id,
            code="AUDIT_FORBIDDEN",
            message="Bạn không có quyền truy cập audit API.",
            status_code=403,
            node_name="api_audit_auth",
            retryable=False,
            details={"required_header": "X-Audit-Admin-Token"},
        )
        raise HTTPException(status_code=403, detail=detail)


@router.get("/api/v1/audit/visitors/summary")
def get_audit_visitors_summary(_ = Depends(_require_audit_admin_token)):
    """Thống kê tổng quan người đã vào app."""
    try:
        from app.core.database import SessionLocal
        from app.models.models import User
        
        db = SessionLocal()
        try:
            active_accounts = db.query(User).filter(User.is_active == True).count()
        finally:
            db.close()
            
        summary = VISITOR_AUDIT_STORE.get_summary()
        summary["active_accounts"] = active_accounts
        
        return {
            "status": "success",
            "data": summary,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy thống kê audit: {str(e)}")


@router.get("/api/v1/audit/visitors")
def list_audit_visitors(limit: int = 100, _ = Depends(_require_audit_admin_token)):
    """Danh sách visitor đã truy cập (ưu tiên lượt gần nhất)."""
    try:
        return {
            "status": "success",
            "data": VISITOR_AUDIT_STORE.list_visitors(limit=limit),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy danh sách visitor: {str(e)}")


@router.get("/api/v1/audit/visits")
def list_audit_visits(limit: int = 200, visitor_key: Optional[str] = None, _ = Depends(_require_audit_admin_token)):
    """Lịch sử truy cập theo event để làm minh chứng."""
    try:
        return {
            "status": "success",
            "data": VISITOR_AUDIT_STORE.list_visit_events(limit=limit, visitor_key=visitor_key),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy lịch sử truy cập: {str(e)}")

@router.get("/api/v1/audit/funnel-stats")
def get_audit_funnel_stats(_: str = Depends(get_admin_user)):
    """Thống kê các tính năng được dùng nhiều nhất (phễu)."""
    try:
        return {
            "status": "success",
            "data": VISITOR_AUDIT_STORE.get_funnel_stats(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy thống kê phễu: {str(e)}")


# ── Enhanced Analytics Endpoints (Investor Dashboard) ──────────────

@router.get("/api/v1/audit/daily-growth")
def get_daily_growth(days: int = 30, _: str = Depends(get_admin_user)):
    """Daily new users, active users, and visits for growth chart."""
    try:
        return {"status": "success", "data": VISITOR_AUDIT_STORE.get_daily_growth(days=days)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/v1/audit/hourly-heatmap")
def get_hourly_heatmap(_: str = Depends(get_admin_user)):
    """Activity distribution by hour of day."""
    try:
        return {"status": "success", "data": VISITOR_AUDIT_STORE.get_hourly_heatmap()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/v1/audit/feature-categories")
def get_feature_categories(_: str = Depends(get_admin_user)):
    """API usage grouped by business feature categories."""
    try:
        return {"status": "success", "data": VISITOR_AUDIT_STORE.get_feature_categories()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/v1/audit/engagement-stats")
def get_engagement_stats(_: str = Depends(get_admin_user)):
    """User engagement: power users, returning rate, peak hour, etc."""
    try:
        return {"status": "success", "data": VISITOR_AUDIT_STORE.get_engagement_stats()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/api/v1/audit/growth-metrics")
def get_growth_metrics(_: str = Depends(get_admin_user)):
    """Week-over-week growth metrics for investor reporting."""
    try:
        return {"status": "success", "data": VISITOR_AUDIT_STORE.get_growth_metrics()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
