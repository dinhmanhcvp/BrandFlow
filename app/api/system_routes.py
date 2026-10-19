"""
Route hệ thống: trang chủ API, health, system-info, Industry Advisor, task Celery, Brand Identity, compliance.
(Tách từ main.py.)
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

from app.schemas.schemas import (
    DesignGenerateRequest,
)
from app.api.auth_routes import get_optional_user
from app.core.quota import WEEK1_PLAN_REGISTRY
from app.core.ai_pipeline import (
    AI_PIPELINE_AVAILABLE,
    generate_brand_identity,
)

router = APIRouter(tags=["System"])


# ── Industry Model Advisor imports ──
try:
    from app.agents.planner.industry_models import (
        get_recommended_models,
        get_visible_planning_forms,
        detect_company_size,
        normalize_industry,
    )
    _INDUSTRY_MODELS_AVAILABLE = True
except ImportError as _industry_err:
    print(f"[WARN] Industry models unavailable: {_industry_err}")
    _INDUSTRY_MODELS_AVAILABLE = False


class IndustryAdvisorRequest(BaseModel):
    industry: str = "F&B"
    brand_dna: Optional[dict] = None
    wizard_answers: Optional[dict] = None


@router.post("/api/v1/industry-advisor")
async def industry_advisor(req: IndustryAdvisorRequest):
    """
    API cho Model Advisor Panel.
    Tự detect ngành + quy mô → trả về model recommendations + visible forms.
    """
    if not _INDUSTRY_MODELS_AVAILABLE:
        raise HTTPException(status_code=503, detail="Industry model engine not available")
    
    normalized = normalize_industry(req.industry)
    company_size = detect_company_size(req.brand_dna, req.wizard_answers)
    models = get_recommended_models(normalized, company_size)
    visible_forms = get_visible_planning_forms(normalized, company_size)
    
    return {
        "status": "ok",
        "industry": normalized,
        "company_size": company_size,
        "models": models,
        "visible_forms": visible_forms,
    }


# ── Health Check (Required for Railway/Docker) ──────────────────
@router.get("/health", tags=["System"])
async def health_check():
    """Health check endpoint for load balancers and container orchestrators."""
    return {"status": "healthy", "service": "brandflow-api", "version": "1.0.0"}

@router.get("/api/v1/system-info", tags=["System"])
async def system_info():
    """System info for frontend status display."""
    cache_stats = {}
    try:
        from app.core.cache_layer import SmartCache
        cache_stats = SmartCache.instance().get_stats()
    except Exception:
        cache_stats = {"status": "unavailable"}
    
    return {
        "status": "ok",
        "ai_pipeline": AI_PIPELINE_AVAILABLE,
        "database": "connected",
        "version": "2.0.0",
        "cache": cache_stats,
    }


@router.get("/", response_class=HTMLResponse)
async def home():
    html_content = """
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>BrandFlow PDF Tester</title>
        <style>
            body { font-family: Inter, Arial, sans-serif; margin: 40px; background-color: #f4f4f9; }
            .container { max-width: 900px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            h2 { color: #333; text-align: center; }
            input[type="file"] { margin: 15px 0; font-size: 16px; }
            button { background: #4CAF50; color: white; padding: 12px 20px; font-size: 16px; border: none; border-radius: 5px; cursor: pointer; width: 100%; transition: 0.3s; }
            button:hover { background: #45a049; }
            pre { background: #282c34; color: #abb2bf; padding: 15px; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; max-height: 500px; overflow-y: auto; font-size: 15px; line-height: 1.5; }
            .loader { display: none; margin-top: 15px; color: #ff5722; font-weight: bold; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>🚀 Trình Kiểm Tra Đọc PDF</h2>
            <p style="text-align: center; color: #666;">Tải lên các file PDF của bạn để xem code đọc chữ được đến đâu.</p>
            <form id="uploadForm">
                <input type="file" id="fileInput" name="files" multiple accept=".pdf,.txt,.docx" required />
                <br />
                <div style="display: flex; gap: 10px;">
                    <button type="submit" style="flex: 1;">🔍 Chỉ đọc thử Text</button>
                    <button type="button" id="btnStore" style="flex: 1; background: #ff9800;">💾 Lưu vào Bộ não (ChromaDB)</button>
                </div>
            </form>

            <div style="margin-top: 20px; padding: 10px; background: #e3f2fd; border-radius: 5px; border: 1px solid #90caf9; font-size: 14px;">
                <b>📊 Trạng thái Database:</b> <span id="dbStats">Đang tải...</span>
            </div>


            <hr style="margin: 30px 0; border: 0; border-top: 1px solid #ddd;" />
            <h3 style="text-align: center; color: #333;">🔗 Hoặc Lấy Dữ Liệu Từ Website</h3>
            <form id="urlForm">
                <input type="url" id="urlInput" placeholder="Nhập link web (vd: https://vnexpress.net)" style="width: 100%; padding: 12px; font-size: 16px; margin: 10px 0; box-sizing: border-box; border-radius: 5px; border: 1px solid #ccc;" required />
                <button type="submit" style="background: #2196F3;">Tải dữ liệu Web</button>
            </form>

            <div class="loader" id="loader">⏳ Đang xử lý dữ liệu...</div>
            <h3 style="margin-top: 30px;">Kết quả:</h3>
            <pre id="result">Chưa có thông tin</pre>
        </div>
        <script>
            async function refreshStats() {
                try {
                    const response = await fetch('/api/v1/onboarding/stats');
                    const data = await response.json();
                    document.getElementById('dbStats').textContent = `${data.count} mảnh trí nhớ (Chunks)`;
                } catch (e) {
                    document.getElementById('dbStats').textContent = 'Lỗi';
                }
            }
            refreshStats();

            // Xử lý nốt Store
            document.getElementById('btnStore').addEventListener('click', async () => {
                const fileInput = document.getElementById('fileInput');
                if (fileInput.files.length === 0) return alert('Chọn file trước!');
                
                const formData = new FormData();
                for (let file of fileInput.files) formData.append('files', file);

                document.getElementById('loader').style.display = 'block';
                document.getElementById('result').textContent = 'Đang băm nhỏ và lưu vào ChromaDB dùng Ollama...';
                
                try {
                    const response = await fetch('/api/v1/onboarding/upload', { method: 'POST', body: formData });
                    const data = await response.json();
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    refreshStats();
                } catch (error) {
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = 'Lỗi: ' + error.message;
                }
            });

            document.getElementById('uploadForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const fileInput = document.getElementById('fileInput');
                if (fileInput.files.length === 0) return;
                
                const formData = new FormData();
                for (let file of fileInput.files) {
                    formData.append('files', file);
                }

                
                document.getElementById('loader').style.display = 'block';
                document.getElementById('result').textContent = 'Đang chờ máy chủ xử lý...';
                
                try {
                    const response = await fetch('/api/v1/onboarding/test-upload', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    document.getElementById('loader').style.display = 'none';
                    if(data.data) {
                        document.getElementById('result').textContent = JSON.stringify(data.data, null, 2);
                    } else {
                        document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    }
                } catch (error) {
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = 'Lỗi kết nối: ' + error.message;
                }
            });

            document.getElementById('urlForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const urlInput = document.getElementById('urlInput').value.trim();
                if (!urlInput) return;
                
                document.getElementById('loader').style.display = 'block';
                document.getElementById('result').textContent = 'Đang tải trang web và thu thập dữ liệu...';
                
                try {
                    const response = await fetch('/api/v1/onboarding/test-url', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({urls: [urlInput]})
                    });
                    const data = await response.json();
                    document.getElementById('loader').style.display = 'none';
                    if(data.data) {
                        document.getElementById('result').textContent = JSON.stringify(data.data, null, 2);
                    } else {
                        document.getElementById('result').textContent = JSON.stringify(data, null, 2);
                    }
                } catch (error) {
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('result').textContent = 'Lỗi kết nối: ' + error.message;
                }
            });
        </script>
    </body>
    </html>
    """
    return html_content


# =====================================================================
# HỆ THỐNG ASYNC POLLING (CHỊU TẢI 10K CCU VỚI CELERY + REDIS)
# =====================================================================
class AsyncPlanRequest(BaseModel):
    plan_hash: str
    answers: dict = {}

@router.post("/api/v1/tasks/dispatch-plan")
def dispatch_async_task(request: AsyncPlanRequest, user_id: Optional[str] = Depends(get_optional_user)):
    """
    Thay vì đợi AI chạy 30s-1m có thể đứt request,
    nhảy luôn vào hàng đợi Redis và nhả ID ra cho Frontend ngay tức thì.
    Worker chạy pipeline thật với plan intent đã đăng ký (no-plan-no-run).
    """
    entry = WEEK1_PLAN_REGISTRY.get((request.plan_hash or "").strip())
    if not entry:
        raise HTTPException(status_code=400, detail="Không tìm thấy plan_hash. Hãy submit wizard trước.")
    owner = (entry.get("plan_intent", {}).get("user_id") or "anonymous").strip() or "anonymous"
    if owner != "anonymous" and owner != user_id:
        raise HTTPException(status_code=403, detail="plan_hash không thuộc tài khoản hiện tại.")
    try:
        from app.core.celery_worker import execute_heavy_ai_plan
        task = execute_heavy_ai_plan.delay({"plan_hash": request.plan_hash, "answers": request.answers})
        return {"status": "success", "task_id": task.id, "message": "Đã xếp hàng vào Background Queue."}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Hàng đợi nền chưa sẵn sàng (Redis/Celery): {e}")

@router.get("/api/v1/tasks/{task_id}/status")
def get_task_status(task_id: str):
    """
    Frontend dùng ID để hỏi thăm (Polling) 3 giây / lần.
    """
    try:
        from app.core.celery_worker import celery
        task = celery.AsyncResult(task_id)
        if task.state == 'PENDING':
            return {"task_status": "pending", "progress": 0, "message": "Task đang chờ Worker bốc để xử lý."}
        elif task.state == 'PROGRESS':
            return {"task_status": "in_progress", "progress": task.info.get('progress', 0), "message": task.info.get('message', '')}
        elif task.state == 'SUCCESS':
            return {"task_status": "completed", "result": task.result}
        elif task.state == 'FAILURE':
            return {"task_status": "failed", "error": str(task.info)}
        return {"task_status": task.state, "info": str(task.info)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/api/v1/design/generate")
async def design_generate(request: DesignGenerateRequest):
    """
    Sinh bộ tài sản nhận diện thương hiệu (Brand Identity):
    Logo, Banner, Fanpage concept — dựa trên Brand DNA trong ChromaDB.
    """
    try:
        print(f"\\n🎨 [DESIGN API] Nhận yêu cầu sinh Brand Identity: {request.brand_name}")

        result = generate_brand_identity(
            brand_name=request.brand_name,
            goal=request.goal,
            industry=request.industry,
            target_audience=request.target_audience,
            brand_dna_context=request.brand_dna_context,
        )

        return {
            "status": "success",
            "logo_url": result["logo_url"],
            "banner_url": result["banner_url"],
            "fanpage_concept": result["fanpage_concept"],
            "design_language": result["design_language"],
            "prompts": result.get("prompts", {}),
        }
    except Exception as e:
        print(f"🔴 [DESIGN API] Lỗi sinh Brand Identity: {e}")
        raise HTTPException(status_code=500, detail={
            "status": "error",
            "message": "AI gặp sự cố khi sinh tài sản thương hiệu. Vui lòng thử lại.",
            "debug_info": str(e)
        })

@router.get("/api/v1/compliance/health")
def compliance_health_check():
    """SOC 2 Compliance integration endpoint for Vanta/Drata."""
    from datetime import datetime, timezone
    return {
        "status": "healthy",
        "compliance_mode": "SOC2_TYPE_I",
        # 2FA (TOTP) có sẵn cho người dùng tự bật — chưa bắt buộc toàn hệ thống
        "mfa_available": True,
        "mfa_enforced": False,
        "data_encryption_at_rest": True,
        "ssl_required": True,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
