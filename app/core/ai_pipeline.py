"""
Import các thành phần AI (LangChain/Gemini/Groq) theo kiểu tùy chọn.

Thiếu thư viện AI thì backend vẫn khởi động được (CRUD form, auth, Data Foundry...),
các endpoint AI kiểm tra AI_PIPELINE_AVAILABLE hoặc tên tương ứng là None.
"""

AI_PIPELINE_AVAILABLE = False
try:
  from app.services.memory_rag import inject_industry_presets, generate_guideline_from_qa, extract_unified_dna  # noqa: F401
  from app.agents.intake.intake_agent import analyze_raw_input, check_required_info, extract_document_summary  # noqa: F401
  from app.workflows.workflow_graph import (  # noqa: F401
    build_error_envelope,
    run_plan_wizard_contract,
    run_pipeline,
    run_refinement_pipeline,
    run_week1_orchestration_contract,
  )
  from app.services.document_processor import DocumentIngestor  # noqa: F401
  from design_agent import generate_brand_identity  # noqa: F401
  AI_PIPELINE_AVAILABLE = True
except ImportError as _import_err:
  print(f"[WARN] AI pipeline modules unavailable: {_import_err}")
  print("[WARN] Form CRUD and DB features will still work normally.")
  inject_industry_presets = generate_guideline_from_qa = extract_unified_dna = None
  analyze_raw_input = check_required_info = extract_document_summary = None
  run_plan_wizard_contract = run_pipeline = run_refinement_pipeline = run_week1_orchestration_contract = None
  generate_brand_identity = None

  def build_error_envelope(trace_id, code, message, status_code, node_name, retryable=False, details=None):  # type: ignore
    """Bản sao khi không import được workflow_graph — cùng cấu trúc envelope."""
    return {
      "status": "error",
      "trace_id": trace_id,
      "error": {"code": code, "message": message, "http_status": status_code, "node": node_name,
                "retryable": retryable, "details": details or {}},
    }

  # Fallback: DocumentIngestor không phụ thuộc LangChain chain, thử import riêng
  try:
    from app.services.document_processor import DocumentIngestor  # noqa: F401
  except ImportError:
    DocumentIngestor = None  # type: ignore
