"""
Chạy pipeline lập kế hoạch thật cho job nền (Celery task `execute_heavy_ai_plan`).

Plan intent lấy từ plan registry trong DB (app/core/quota.py) — web server đăng ký qua
/api/v1/planning/wizard/submit, worker ở tiến trình/máy khác vẫn đọc được.
"""

from typing import Any, Callable, Dict, Optional

ProgressFn = Callable[[int, str], None]


def _noop(_progress: int, _message: str) -> None:
  pass


def run_plan_job(payload: Dict[str, Any], report: Optional[ProgressFn] = None) -> Dict[str, Any]:
  from app.core.ai_pipeline import run_pipeline
  from app.core.quota import WEEK1_PLAN_REGISTRY, _apply_clarification_answers
  from app.services.digitization.data_brief import brief_for_agents

  report = report or _noop
  plan_hash = (payload.get("plan_hash") or "").strip()
  entry = WEEK1_PLAN_REGISTRY.get(plan_hash) if plan_hash else None
  if not entry:
    raise ValueError(f"Không tìm thấy plan_hash '{plan_hash}'. Hãy submit wizard trước (no-plan-no-run).")
  if run_pipeline is None:
    raise RuntimeError("AI pipeline chưa sẵn sàng trên worker (thiếu thư viện LangChain/LLM).")

  intent = _apply_clarification_answers(dict(entry.get("plan_intent", {})), payload.get("answers") or {})
  report(10, "Đã nạp plan intent")

  user_id = (intent.get("user_id") or "").strip()
  internal_data = brief_for_agents(user_id) if user_id and user_id != "anonymous" else {}
  if internal_data:
    report(20, "Đã nạp số liệu nội bộ từ Kho Dữ liệu")

  report(30, "Các trợ lý AI đang lập và phản biện kế hoạch")
  result = run_pipeline(
    goal=intent.get("goal", ""),
    industry=intent.get("industry", "General"),
    budget=int(intent.get("budget", 0) or 0),
    target_audience=intent.get("target_audience") or "Tệp khách hàng chung",
    constraints=intent.get("constraints") or "Không có",
    brand_dna={"internal_data": internal_data} if internal_data else None,
  )
  report(100, "Hoàn tất")
  return {
    "status": "success",
    "plan_hash": plan_hash,
    "final_plan": result.get("final_plan"),
    "agent_logs": result.get("agent_logs", []),
    "actual_total_cost": result.get("actual_total_cost", 0),
    "internal_data_used": bool(internal_data),
  }
