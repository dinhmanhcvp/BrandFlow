"""
Route lập kế hoạch: contract tuần 1, wizard, execute (no-plan-no-run), intake → pipeline CMO/CFO, refine, micro-execute, lịch sử.
(Tách từ main.py.)
"""

import asyncio
import json
from typing import Dict, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel

from app.schemas.schemas import (
    RawInputRequest,
    RefineRequest,
    MicroExecuteRequest,
    OrchestrationMockRequest,
    PlanWizardRequest,
    ExecutionRequest,
)
from app.core.ai_pipeline import (
    analyze_raw_input,
    build_error_envelope,
    check_required_info,
    run_pipeline,
    run_plan_wizard_contract,
    run_refinement_pipeline,
    run_week1_orchestration_contract,
)
from app.core.mock_manager import parse_mock_md
from app.api.auth_routes import get_optional_user
from app.services.digitization.data_brief import brief_for_agents
from app.core.quota import (
    WEEK1_QUOTA_POLICY,
    _normalize_tier,
    _resolve_trace_id,
    _record_model_usage,
    _get_model_usage_summary,
    _enforce_week1_quota,
    _resolve_registered_plan_or_raise,
    _enforce_plan_ownership,
    _store_plan_intent,
    _apply_clarification_answers,
    _assert_no_sub_agent_user_questions,
)

router = APIRouter(tags=["Planning"])


@router.get("/api/v1/planning/history", tags=["Planning"])
async def get_planning_history(limit: int = 20):
    """List all final plan output files (for planning history UI)."""
    from app.core.final_output_writer import list_final_outputs
    return {"status": "ok", "runs": list_final_outputs(limit=limit)}



@router.get("/api/v1/planning/contracts/week1")
def get_planning_contract_week1():
    """Công bố contract tuần 1 để frontend/backend/test dùng chung."""
    return {
        "status": "success",
        "contract_version": "week1-v1",
        "trace_header": "X-Trace-Id",
        "tier_default": "FREE",
        "quota_policy": WEEK1_QUOTA_POLICY,
        "error_convention": {
            "413": [
                "QUOTA_FILE_SIZE_EXCEEDED",
                "QUOTA_FILES_PER_REQUEST_EXCEEDED",
            ],
            "429": [
                "QUOTA_FILES_PER_DAY_EXCEEDED",
                "QUOTA_URLS_PER_DAY_EXCEEDED",
            ],
            "500": [
                "ORCH_RUNTIME_ERROR",
                "OUTPUT_ARTIFACT_JSON_INVALID",
                "OUTPUT_ARTIFACT_JSON_MISSING_FIELDS",
                "OUTPUT_PLAN_INVALID",
                "OUTPUT_ARTIFACT_TXT_INVALID",
                "OUTPUT_ARTIFACT_JSON_SERIALIZATION_FAILED",
            ],
            "502": [
                "PROVIDER_ROUTER_INVALID",
                "PROVIDER_MODEL_MISSING",
            ],
        },
        "orchestration_nodes": [
            "plan_wizard",
            "plan_compiler",
            "intake_context",
            "clarification_guard",
            "gateway_router",
            "finalize_output",
        ],
        "stage_a_endpoints": {
            "wizard_submit": "POST /api/v1/planning/wizard/submit",
            "wizard_validate": "POST /api/v1/planning/wizard/validate",
            "execute": "POST /api/v1/planning/execute",
        },
        "stage_c_endpoints": {
            "usage_telemetry": "GET /api/v1/planning/telemetry/usage?user_id=...&tier=...",
        },
        "stage_d_contract": {
            "output_artifacts": {
                "required": ["json", "txt"],
                "json_string_included": True,
                "validator": "output_reliability_v1",
            },
            "error_scope": ["graph", "runtime", "provider"],
        },
        "legacy_endpoints": {
            "POST /api/v1/planning/orchestration/mock-run": {
                "status": "disabled",
                "http_status": 410,
                "replaced_by": "POST /api/v1/planning/execute",
            }
        },
        "plan_policy": {
            "no_plan_no_run": True,
            "required_execute_field": "plan_hash",
            "clarification_guard": {
                "max_rounds": 1,
                "dedupe_key": "question_signature",
                "sub_agent_user_question_allowed": False,
            },
            "tier_model_router": {
                "FREE": "local-first",
                "PLUS": "cloud-standard",
                "PRO": "cloud-premium",
                "fallback": "deterministic_by_route",
            },
        },
    }


@router.get("/api/v1/planning/telemetry/usage")
def get_planning_telemetry_usage(user_id: str = "anonymous", tier: str = "FREE"):
    """Truy xuất usage telemetry + cost tracking theo user/tier trong ngày hiện tại."""
    normalized_tier = _normalize_tier(tier)
    safe_user_id = (user_id or "anonymous").strip() or "anonymous"
    summary = _get_model_usage_summary(user_id=safe_user_id, tier=normalized_tier)

    return {
        "status": "success",
        "data": summary,
    }


@router.post("/api/v1/planning/wizard/submit")
async def planning_wizard_submit(
    request: PlanWizardRequest,
    http_request: Request,
    response: Response,
):
    """Giai đoạn A: nhận wizard answers và compile thành plan_intent + plan_hash."""
    trace_id = _resolve_trace_id(http_request)
    response.headers["X-Trace-Id"] = trace_id
    tier = _normalize_tier(request.tier)

    wizard_payload = request.model_dump()
    wizard_payload["tier"] = tier
    result = run_plan_wizard_contract(
        request_payload=wizard_payload,
        trace_id=trace_id,
        tier=tier,
    )

    if result.get("status") == "error":
        error_list = result.get("errors", [])
        error_payload = error_list[0] if error_list else build_error_envelope(
            trace_id=trace_id,
            code="PLAN_COMPILER_INTERNAL_ERROR",
            message="Không xác định được lỗi plan compiler.",
            status_code=500,
            node_name="api_plan_wizard",
            retryable=False,
            details={},
        )
        status_code = error_payload.get("error", {}).get("http_status", 500)
        raise HTTPException(status_code=status_code, detail=error_payload)

    compiled = result.get("result", {})
    plan_hash = compiled.get("plan_hash", "")
    plan_intent = compiled.get("plan_intent", {})

    validated_plan_intent = plan_intent
    if plan_hash:
        validated_plan_intent = _store_plan_intent(plan_hash, plan_intent, trace_id)

    return {
        "status": "success",
        "trace_id": trace_id,
        "contract_version": result.get("contract_version"),
        "plan_hash": plan_hash,
        "plan_intent": validated_plan_intent,
        "node_outputs": result.get("node_outputs", []),
        "message": "Plan intent đã được compile. Dùng plan_hash cho bước execute.",
    }


@router.post("/api/v1/planning/wizard/validate")
async def planning_wizard_validate(
    request: ExecutionRequest,
    http_request: Request,
    response: Response,
):
    """Kiểm tra plan_hash có hợp lệ cho user/tier hiện tại không."""
    trace_id = _resolve_trace_id(http_request)
    response.headers["X-Trace-Id"] = trace_id
    tier = _normalize_tier(request.tier)

    plan_entry = _resolve_registered_plan_or_raise(request.plan_hash, trace_id=trace_id)
    plan_intent = plan_entry.get("plan_intent", {})

    intent_user = (plan_intent.get("user_id") or "anonymous").strip() or "anonymous"
    request_user = (request.user_id or "anonymous").strip() or "anonymous"
    intent_tier = _normalize_tier(str(plan_intent.get("tier", "FREE")))

    is_valid = intent_user == request_user and intent_tier == tier
    return {
        "status": "success",
        "trace_id": trace_id,
        "plan_hash": request.plan_hash,
        "is_valid": is_valid,
        "checks": {
            "user_match": intent_user == request_user,
            "tier_match": intent_tier == tier,
            "no_plan_no_run": True,
        },
        "plan_intent": plan_intent,
    }


@router.post("/api/v1/planning/execute")
async def planning_execute(
    request: ExecutionRequest,
    http_request: Request,
    response: Response,
):
    """Giai đoạn B: execute với no-plan-no-run + clarification guard + anti-loop policy."""
    trace_id = _resolve_trace_id(http_request)
    response.headers["X-Trace-Id"] = trace_id
    tier = _normalize_tier(request.tier)

    plan_entry = _resolve_registered_plan_or_raise(request.plan_hash, trace_id=trace_id)
    plan_intent = dict(plan_entry.get("plan_intent", {}))
    plan_intent = _apply_clarification_answers(plan_intent, request.clarification_answers)
    _enforce_plan_ownership(plan_intent, user_id=request.user_id, tier=tier, trace_id=trace_id)

    quota_request = OrchestrationMockRequest(
        goal=plan_intent.get("goal", ""),
        industry=plan_intent.get("industry", "General"),
        budget=int(plan_intent.get("budget", 0) or 0),
        target_audience=plan_intent.get("target_audience", ""),
        constraints=plan_intent.get("constraints", ""),
        tier=tier,
        user_id=request.user_id,
        files_count=request.files_count,
        file_size_mb=request.file_size_mb,
        urls_count=request.urls_count,
        mock_mode=request.mock_mode,
    )
    _enforce_week1_quota(request=quota_request, tier=tier, trace_id=trace_id)

    orchestration_input = {
        "goal": plan_intent.get("goal", ""),
        "industry": plan_intent.get("industry", "General"),
        "budget": int(plan_intent.get("budget", 0) or 0),
        "target_audience": plan_intent.get("target_audience", ""),
        "constraints": plan_intent.get("constraints", ""),
        "route_decision": plan_intent.get("route_decision", "balanced"),
        "route_reason_code": plan_intent.get("route_reason_code", "USER_ROUTE_PREFERENCE"),
        "clarification_count": int(plan_intent.get("clarification_count", 0) or 0),
        "question_signatures": list(plan_intent.get("question_signatures", []) or []),
        "sub_agent_user_question_allowed": bool(plan_intent.get("sub_agent_user_question_allowed", False)),
    }

    result = run_week1_orchestration_contract(
        request_payload=orchestration_input,
        trace_id=trace_id,
        tier=tier,
        mock_mode=request.mock_mode,
    )

    if result.get("status") == "error":
        error_list = result.get("errors", [])
        error_payload = error_list[0] if error_list else build_error_envelope(
            trace_id=trace_id,
            code="ORCH_INTERNAL_ERROR",
            message="Không xác định được lỗi orchestration.",
            status_code=500,
            node_name="api_planning_execute",
            retryable=False,
            details={},
        )
        status_code = error_payload.get("error", {}).get("http_status", 500)
        raise HTTPException(status_code=status_code, detail=error_payload)

    if result.get("status") == "clarification_needed":
        clarification_result = result.get("result", {})
        plan_intent["clarification_count"] = int(clarification_result.get("clarification_count", 0) or 0)
        plan_intent["question_signatures"] = list(clarification_result.get("question_signatures", []) or [])

        validated_plan_intent = _store_plan_intent(request.plan_hash, plan_intent, trace_id)
        return {
            **result,
            "plan_hash": request.plan_hash,
            "plan_intent": validated_plan_intent,
        }

    result_payload = result.get("result", {})
    _assert_no_sub_agent_user_questions(result_payload.get("agent_logs", []), trace_id=trace_id)

    usage_telemetry_summary = _record_model_usage(
        user_id=(request.user_id or "anonymous").strip() or "anonymous",
        tier=tier,
        trace_id=trace_id,
        result_payload=result_payload,
    )

    clarification_state = result_payload.get("clarification", {})
    plan_intent["clarification_count"] = int(clarification_state.get("count", plan_intent.get("clarification_count", 0)) or 0)
    plan_intent["question_signatures"] = list(clarification_state.get("question_signatures", plan_intent.get("question_signatures", [])) or [])
    plan_intent["route_reason_code"] = result_payload.get("route_reason_code", plan_intent.get("route_reason_code", "USER_ROUTE_PREFERENCE"))

    validated_plan_intent = _store_plan_intent(request.plan_hash, plan_intent, trace_id)

    return {
        **result,
        "plan_hash": request.plan_hash,
        "plan_intent": validated_plan_intent,
        "usage_telemetry_summary": usage_telemetry_summary,
    }


@router.post("/api/v1/planning/orchestration/mock-run")
async def planning_orchestration_mock_run(
    request: OrchestrationMockRequest,
    http_request: Request,
    response: Response,
):
    """
    Endpoint legacy đã bị khóa để cưỡng chế no-plan-no-run toàn hệ thống.
    """
    trace_id = _resolve_trace_id(http_request)
    response.headers["X-Trace-Id"] = trace_id
    detail = build_error_envelope(
        trace_id=trace_id,
        code="LEGACY_ENDPOINT_DISABLED",
        message="Endpoint mock-run cũ đã bị khóa. Dùng submit -> validate -> execute.",
        status_code=410,
        node_name="api_orchestration_boundary",
        retryable=False,
        details={
            "disabled_endpoint": "POST /api/v1/planning/orchestration/mock-run",
            "required_flow": [
                "POST /api/v1/planning/wizard/submit",
                "POST /api/v1/planning/wizard/validate",
                "POST /api/v1/planning/execute",
            ],
            "policy": "no-plan-no-run",
            "ignored_request_fields": sorted(list(request.model_dump().keys())),
        },
    )
    raise HTTPException(status_code=410, detail=detail)

@router.post("/api/v1/planning/intake")
async def process_intake(request: RawInputRequest, user_id: Optional[str] = Depends(get_optional_user)):
    """
    Intake Agent: Bóc tách ngôn ngữ tự nhiên, kiểm tra ràng buộc ngân sách/ngành hàng.
    Nếu đủ thì chạy Multi-Agent AI (Planner -> CFO -> Persona).
    Tenant lấy từ JWT; nếu tenant có kho dữ liệu nội bộ, số liệu đã kiểm chứng được đưa cho các agent.
    """
    try:
        raw_text = request.raw_text
        tenant_id = user_id
        internal_data = brief_for_agents(tenant_id)
        
        comp_form = request.comprehensive_form or {}
        if comp_form:
            form_context = f"\n[DỮ LIỆU TỪ BỘ CÂU HỎI TRẮC NGHIỆM CHI TIẾT ĐỂ LẬP CHIẾN LƯỢC QUAN TRỌNG]\n{json.dumps(comp_form, ensure_ascii=False)}\n[HẾT DỮ LIỆU CÂU HỎI]"
            raw_text += form_context
            
        brand_dna = request.brand_dna or {}
        if brand_dna:
            dna_context = f"\n[BRAND DNA & DESIGN DNA TỪ BỘ NHỚ]\n{json.dumps(brand_dna, ensure_ascii=False)}\n[HẾT BRAND DNA]"
            raw_text += dna_context

        if internal_data:
            raw_text += f"\n[KHO DỮ LIỆU NỘI BỘ — SỐ LIỆU ĐÃ KIỂM CHỨNG BẰNG SQL]\n{internal_data['text']}\n[HẾT KHO DỮ LIỆU]"
            brand_dna = {**brand_dna, "internal_data": internal_data}

        # --- SECRET MOCK MODE INTERCEPTOR ---
        secret_keywords = ["hương viên trà quán", "mã demo 1", "bếp nhà mộc", "bepnhamoc"]
        if any(keyword in raw_text.lower() for keyword in secret_keywords):
            print("[MOCK MODE] Kich hoat du lieu gia lap...")
            await asyncio.sleep(5)  # Trễ 5s giả lập AI thinking để hiện Loading Spinner trên UI
            
            if "bếp nhà mộc" in raw_text.lower() or "bepnhamoc" in raw_text.lower():
                mock_file = "mock_data/bep_nha_moc_strategy.md"
            else:
                mock_file = "mock_data/huong_vien_tra.md"
                
            mock_result = parse_mock_md(mock_file)
            
            plan = mock_result["final_plan"]
            
            if isinstance(plan, str):
                try:
                    plan = json.loads(plan)
                except json.JSONDecodeError:
                    plan = {}
            
            # Tính lại cost thực tế theo plan mock
            actual_cost = 0
            for phase in plan.get("activity_and_financial_breakdown", []):
                for act in phase.get("activities", []):
                    actual_cost += int(act.get("cost_vnd", 0))
                    
            print("[MOCK MODE] Bat dau goi MasterPlanner...")
            
            campaign_name = plan.get("executive_summary", {}).get("campaign_name", "Chiến dịch (Mock)")
            full_mock_logs = [
                {"agent": "CMO", "role": "Giám đốc Marketing", "message": f"Chào các vị lãnh đạo và khách hàng! Giám đốc Marketing xin phép trình bày tóm tắt kế hoạch '{campaign_name}'.\n\nChiến dịch sẽ đi qua 3 giai đoạn: Khơi Hương (Teasing), Tỏa Trà (Traffic), và Lưu Phai (Loyalty). Trọng tâm lớn nhất nằm ở tháng 6, chúng ta sẽ mạnh tay book 3 Mega-TikToker tới thưởng trà và làm video review. Mức đầu tư cho riêng hạng mục KOL này là 30 triệu đồng. Tổng ngân sách tôi xin duyệt là {actual_cost + 5000000:,} VND. Mọi người có ý kiến gì không?"},
                {"agent": "SYSTEM", "role": "Hệ thống Kiểm toán", "message": f"Cảnh báo tự động: Hệ thống ghi nhận ngân sách Marketing đề xuất đã cao hơn so với hạn mức hiện tại. Cần các sếp và đại diện khách hàng vào phiên tòa phản biện để điều chỉnh lại cấu trúc vốn."}
            ]
            full_mock_logs.extend(mock_result["agent_logs"])

            return {
                "status": "success",
                "is_approved": True,
                "iteration_count": 2,
                "actual_total_cost": actual_cost,
                "plan": plan,
                "agent_logs": full_mock_logs
            }
        # ------------------------------------

        # 1. Bóc tách
        parsed_data = analyze_raw_input(raw_text)
        
        # Override bằng business_intent nếu có
        business_intent = request.business_intent or {}
        if business_intent:
            parsed_data["scenario_type"] = "idea_driven" if business_intent.get("mode") == "idea_first" else "budget_driven"
            if business_intent.get("budget"):
                parsed_data["budget"] = business_intent.get("budget")
            if business_intent.get("idea"):
                parsed_data["idea_description"] = business_intent.get("idea")
            if business_intent.get("businessGoal"):
                parsed_data["goal"] = business_intent.get("businessGoal")
                
        # Override budget nếu Frontend gửi lên giá trị cố định (legacy fallback)
        elif request.budget and request.budget >= 1000000:
            parsed_data["budget"] = request.budget
        
        # 2. Kiểm tra
        check_result = check_required_info(parsed_data)
        
        # 3. Trả về câu hỏi nếu thiếu thông tin
        if check_result.get("status") == "clarification_needed":
            return check_result
            
        # 4. Đủ thông tin -> Gọi Pipeline tuyến tính (v7)
        print("[PIPELINE] Bat dau goi Pipeline Deterministic...")
        
        account_profile = "STANDARD"
        if tenant_id:
            from app.core.database import SessionLocal
            from app.models.models import User
            try:
                db = SessionLocal()
                user = db.query(User).filter(User.id == tenant_id).first()
                if user:
                    account_profile = user.account_profile
            except Exception as e:
                print(f"Lỗi khi query User account_profile: {e}")
            finally:
                db.close()
                
        result = run_pipeline(
            goal=parsed_data.get("goal", request.raw_text),
            industry=parsed_data.get("industry", "General"),
            budget=int(parsed_data.get("budget") or 0),
            csfs=parsed_data.get("csfs", []),
            resources=parsed_data.get("resources", ""),
            brand_dna=brand_dna or None,
            scenario_type=parsed_data.get("scenario_type", "budget_driven"),
            target_profit=parsed_data.get("target_profit"),
            idea_description=parsed_data.get("idea_description"),
            account_profile=account_profile
        )
        
        return {
            "status": "success",
            "is_approved": True,
            "iteration_count": 1,
            "actual_total_cost": result.get("actual_total_cost", 0),
            "plan": result["final_plan"],
            "agent_logs": result["agent_logs"],
            "internal_data_used": bool(internal_data),
        }
    except TimeoutError as e:
        print(f"🔴 [INTAKE] Timeout pipeline: {e}")
        raise HTTPException(status_code=504, detail={
            "status": "error",
            "message": "Yeu cau AI qua thoi gian cho phep. Vui long thu lai.",
            "debug_info": str(e)
        })
    except Exception as e:
        print(f"🔴 [INTAKE] Lỗi hệ thống nghiêm trọng: {e}")
        # Trả về payload JSON chuẩn để Frontend xử lý được (tắt loading, hiện thông báo lỗi)
        raise HTTPException(status_code=500, detail={
            "status": "error",
            "message": "Hệ thống AI đang quá tải hoặc gặp sự cố, vui lòng thử lại sau giây lát.",
            "debug_info": str(e)
        })

class AnalyzeGapsRequest(BaseModel):
    document_text: str

@router.post("/api/v1/planning/analyze-gaps")
async def process_analyze_gaps(request: AnalyzeGapsRequest):
    """
    Bước 1: Phân tích văn bản, tìm khoảng trống (Gaps) và sinh câu hỏi cho User.
    """
    try:
        from app.services.ai_form_generator import analyze_gaps
        result = analyze_gaps(request.document_text)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class GenerateFormsRequest(BaseModel):
    document_text: str
    gap_answers: Dict[str, str]
    project_id: str
    user_id: str

@router.post("/api/v1/planning/generate-forms")
async def process_generate_forms(request: GenerateFormsRequest):
    """
    Bước 2 & 3: Lấy văn bản tổng + Câu trả lời User -> Generate toàn bộ 23 Form data -> Lưu DB.
    """
    try:
        from app.services.ai_form_generator import generate_all_forms, save_forms_to_db
        # 生成 Data
        forms_data = generate_all_forms(request.document_text, request.gap_answers)
        
        # Lưu Database
        saved_count = save_forms_to_db(request.project_id, request.user_id, forms_data)
        
        return {
            "status": "success", 
            "message": f"Đã sinh và lưu {saved_count} form vào database.",
            "data": forms_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/v1/planning/refine")
async def process_refine(request: RefineRequest):
    """
    Endpoint mới: Nhận phản hồi từ user và plan cũ, chạy lại refinement pipeline.
    """
    try:
        print(f"\n[REFINE API] Receive feedback: {request.feedback}")
        tenant_id = request.tenant_id
        
        # --- SECRET MOCK MODE INTERCEPTOR ---
        plan_str = json.dumps(request.previous_plan, ensure_ascii=False)
        if "bếp nhà mộc" in plan_str.lower() or "bepnhamoc" in plan_str.lower().replace(" ", ""):
            print("[MOCK MODE] Kich hoat Refine Mock cho Bep Nha Moc...")
            import asyncio
            await asyncio.sleep(4)
            mock_file = "mock_data/bep_nha_moc_strategy.md"
            from app.workflows.engine_adapters import parse_mock_md
            mock_result = parse_mock_md(mock_file)
            plan = mock_result["final_plan"]
            
            if isinstance(plan, str):
                try:
                    plan = json.loads(plan)
                except json.JSONDecodeError:
                    plan = {}
                    
            actual_cost = 0
            for phase in plan.get("activity_and_financial_breakdown", []):
                for act in phase.get("activities", []):
                    actual_cost += int(act.get("cost_vnd", 0))
                    
            agent_logs = [
                {"agent": "SYSTEM", "role": "User Feedback", "message": f"Yêu cầu điều chỉnh: {request.feedback}"},
                {"agent": "CMO", "role": "Giám đốc Marketing", "message": f"Đã tiếp nhận yêu cầu điều chỉnh. Tuy nhiên trong phiên bản Demo, hệ thống sẽ giữ nguyên cấu trúc ngân sách tối ưu nhất cho Bếp Nhà Mộc để đảm bảo tính an toàn tài chính."}
            ]
            agent_logs.extend(mock_result["agent_logs"])
            
            return {
                "status": "success",
                "is_approved": True,
                "actual_total_cost": actual_cost,
                "plan": plan,
                "agent_logs": agent_logs
            }
        # ------------------------------------
        
        result = run_refinement_pipeline(
            previous_plan=request.previous_plan,
            feedback=request.feedback,
            budget=request.budget
        )
        
        return {
            "status": "success",
            "is_approved": True,
            "actual_total_cost": result.get("actual_total_cost", 0),
            "plan": result["final_plan"],
            "agent_logs": result["agent_logs"]
        }
    except TimeoutError as e:
        print(f"🔴 [REFINE API] Timeout pipeline: {e}")
        raise HTTPException(status_code=504, detail={
            "status": "error",
            "message": "Yeu cau AI qua thoi gian cho phep. Vui long thu lai.",
            "debug_info": str(e)
        })
    except Exception as e:
        print(f"🔴 [REFINE API] Lỗi xử lý feedback: {e}")
        raise HTTPException(status_code=500, detail={
            "status": "error",
            "message": "AI gặp sự cố khi đang phân tích lại kế hoạch. Vui lòng thử lại.",
            "debug_info": str(e)
        })

@router.post("/api/v1/planning/micro-execute")
async def process_micro_execute(request: MicroExecuteRequest):
    """
    Giai đoạn 4: Sản xuất Content Đơn lẻ (Micro-execution).
    """
    try:
        if "bếp nhà mộc" in request.brand_dna.lower() or "bepnhamoc" in request.brand_dna.lower().replace(" ", ""):
            return {
              "status": "success",
              "content_strategy": {
                "content_pillars": [
                  {
                    "pillar_name": "Câu chuyện Nguyên Liệu (Origin Story)",
                    "percentage": 30,
                    "description": "Kể chuyện về nguồn gốc thực phẩm: Nước mắm nhỉ truyền thống, rau sạch chuẩn VietGAP, gạo Séng Cù dẻo thơm."
                  },
                  {
                    "pillar_name": "Ký Ức Gia Đình (Emotional Connection)",
                    "percentage": 40,
                    "description": "Khơi gợi cảm xúc qua những câu chuyện về tình thân, mâm cơm mẹ nấu, những ngày thơ bé ở quê."
                  },
                  {
                    "pillar_name": "Không Gian & Trải Nghiệm (Atmosphere)",
                    "percentage": 30,
                    "description": "Giới thiệu góc check-in, âm nhạc mộc mạc, sự tận tâm của đội ngũ phục vụ."
                  }
                ],
                "tone_and_manner": "Tâm tình, thủ thỉ, chân thành, dùng từ ngữ mang đậm chất văn học và hoài niệm."
              },
              "content_calendar": [
                {
                  "date": "15/07/2026",
                  "platform": "Facebook Fanpage",
                  "format": "Photo Story",
                  "pillar": "Ký Ức Gia Đình",
                  "title": "Bao lâu rồi bạn chưa về ăn cơm nhà?",
                  "status": "APPROVED"
                },
                {
                  "date": "18/07/2026",
                  "platform": "TikTok",
                  "format": "Short Video (ASMR)",
                  "pillar": "Câu chuyện Nguyên Liệu",
                  "title": "Âm thanh của nồi cá kho tộ ngày mưa",
                  "status": "DRAFT"
                },
                {
                  "date": "22/07/2026",
                  "platform": "Instagram",
                  "format": "Carousel (Album)",
                  "pillar": "Không Gian & Trải Nghiệm",
                  "title": "3 góc tĩnh lặng tại Bếp Nhà Mộc để bạn trốn deadline",
                  "status": "READY_TO_PUBLISH"
                }
              ],
              "sample_outputs": {
                "facebook_post_1": {
                  "headline": "CÓ NHỮNG NGÀY CHỈ THÈM MỘT BÁT CANH CUA RAU ĐAY...",
                  "body": "Thành phố dạo này hay đổ mưa chiều. Những lúc kẹt xe giữa dòng người hối hả, bạn có chợt thấy sống mũi cay cay khi nhớ về mùi khói bếp thân thuộc?\n\nỞ Bếp Nhà Mộc, chúng tôi không có những món sơn hào hải vị xa hoa. Chúng tôi chỉ có:\n✨ Nồi cá lóc kho tộ keo sệt, đậm đà vị mắm nhỉ.\n✨ Bát canh cua đồng nấu rau đay mồng tơi ngọt thanh, mát ruột.\n✨ Niêu cơm gạo lứt dẻo bùi, ủ ấm trong lớp lá chuối.\n\nHôm nay, gác lại những bộn bề, mời bạn ghé Bếp, ngồi xuống chiếc ghế gỗ sờn, nghe một bản nhạc Trịnh và thưởng thức mâm cơm 'như mẹ nấu'.\n\nBạn có muốn đặt cho mình một bàn nhỏ góc cửa sổ tối nay không?",
                  "call_to_action": "👉 Nhắn tin ngay cho Bếp để giữ chỗ: m.me/bepnhamoc\n📍 Địa chỉ: 123 Đường Mộc Miên, Quận 1, TP.HCM\n☎️ Hotline: 090 123 4567",
                  "hashtags": "#BepNhaMoc #ComNha #ThoiThanhXuan #ChuaLanh #AmThucViet",
                  "image_prompt": "A warm, rustic photo of a bowl of Vietnamese crab soup (canh cua rau đay) and a clay pot of caramelized fish. Dark wooden table, moody lighting, nostalgic feel."
                },
                "tiktok_script_1": {
                  "title": "Review Bếp Nhà Mộc - Điểm đến chữa lành",
                  "duration": "45 seconds",
                  "audio": "Nhạc không lời nhẹ nhàng (Guitar acoustic) + Giọng voice-over trầm ấm",
                  "scenes": [
                    {
                      "time": "0s - 5s",
                      "visual": "Góc quay POV mở cánh cửa gỗ bước vào quán. Ánh sáng vàng ấm, không gian ngập tràn cây xanh và đồ gốm.",
                      "voiceover": "Nếu Sài Gòn làm bạn mệt quá, thì đây là nơi mình thường đến để trốn."
                    },
                    {
                      "time": "5s - 15s",
                      "visual": "Cận cảnh nhân viên rót trà thảo mộc khói nghi ngút. Cảnh lửa cháy li ti dưới niêu cá kho tộ (ASMR xèo xèo).",
                      "voiceover": "Không ồn ào, không xô bồ. Ở Bếp Nhà Mộc, mọi thứ cứ chậm lại. Chỉ có tiếng xèo xèo của nồi cá kho tộ..."
                    },
                    {
                      "time": "15s - 25s",
                      "visual": "Quay cận mâm cơm 3 món chuẩn Việt Nam: Cơm niêu, thịt luộc cà pháo, canh chua tôm.",
                      "voiceover": "...và hương vị y hệt mâm cơm chiều mẹ hay nấu. Miếng cà pháo giòn rụm, bát canh chua thanh mát."
                    },
                    {
                      "time": "25s - 35s",
                      "visual": "Quay cảnh một bạn nữ đang ngồi ăn một mình cạnh cửa sổ, nhìn ra đường mưa. Mỉm cười thư giãn.",
                      "voiceover": "Đôi khi, hạnh phúc lớn lao nhất lại đến từ một bữa ăn no bụng và ngon miệng. Ăn một miếng, thấy lòng nhẹ bẫng."
                    },
                    {
                      "time": "35s - 45s",
                      "visual": "Logo Bếp Nhà Mộc hiện lên cùng dòng chữ 'Thơm Khói Bếp - Ấm Tình Nhà' + Địa chỉ.",
                      "voiceover": "Ghé Bếp Nhà Mộc cuối tuần này nhé. Tag người bạn muốn đi cùng vào đây nào!"
                    }
                  ]
                },
                "pr_article": {
                  "headline": "Bếp Nhà Mộc: Hành Trình Mang 'Chánh Niệm' Vào Bữa Cơm Gia Đình Việt",
                  "excerpt": "Giữa kỷ nguyên fast-food và nhịp sống số hóa, sự xuất hiện của mô hình 'Mindful Dining' đậm chất truyền thống tại Bếp Nhà Mộc đang tạo nên một làn sóng chữa lành đầy thi vị cho giới trẻ thành thị.",
                  "content_outline": [
                    "1. Nghịch lý của người trẻ: Đủ đầy vật chất nhưng 'đói' những bữa cơm nhà.",
                    "2. Bếp Nhà Mộc ra đời: Không chỉ là bán đồ ăn, mà là bán 'vé trở về tuổi thơ'.",
                    "3. Kiến trúc mộc mạc và nguyên liệu thuận tự nhiên.",
                    "4. Lời kết: Bếp Nhà Mộc - Điểm đến của những tâm hồn cần tái tạo năng lượng."
                  ]
                }
              }
            }
        
        raise NotImplementedError("agents_core is not implemented yet")
    except Exception as e:
        raise HTTPException(status_code=500, detail={"status": "error", "message": "Lỗi AI sinh nội dung.", "debug_info": str(e)})
