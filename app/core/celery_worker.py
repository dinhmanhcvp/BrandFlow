import os
from celery import Celery

# Hệ thống lấy địa chỉ Redis từ file docker-compose.yml hoặc .env (nếu chạy local)
broker_url = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")

# Khởi tạo Công nhân (Celery Worker)
celery = Celery(
  "brandflow_workers",
  broker=broker_url,
  backend=result_backend
)

# Cấu hình để Celery biết nó có thể nhận những loại kết quả serialize JSON (bảo mật)
celery.conf.update(
  task_serializer='json',
  accept_content=['json'], 
  result_serializer='json',
  timezone='Asia/Ho_Chi_Minh',
  enable_utc=True,
)

# =========================================================
# ĐÂY LÀ NƠI CHỨA CÁC "NÚT THẮT CỔ CHAI" CỦA AI.
# Những Request mất 3 giây, 10 giây hay 1 phút của Langchain
# sẽ được bứng từ main.py vứt vào đây.
# =========================================================

@celery.task(name="digitize_upload_job")
def digitize_upload_job(tenant_id: str, job_id: str):
  """
  Data Foundry: số hóa một lượt upload lớn. tenant_id do API lấy từ JWT trước khi xếp hàng.
  Tiến độ ghi vào file job cạnh kho DuckDB (GET /api/v1/data/jobs/{job_id}), không qua result backend.
  """
  from app.services.digitization.jobs import run_job

  return run_job(tenant_id, job_id)["status"]


@celery.task(name="execute_heavy_ai_plan", bind=True)
def execute_heavy_ai_plan(self, payload: dict):
  """
  Chạy pipeline lập kế hoạch thật (CMO → Interceptor → CFO/Persona) ngoài web server.
  Logic nằm ở app/workflows/async_plan.run_plan_job; task này chỉ báo tiến độ cho /api/v1/tasks/{id}/status.
  """
  from app.workflows.async_plan import run_plan_job

  def report(progress: int, message: str) -> None:
    try:
      self.update_state(state="PROGRESS", meta={"progress": progress, "message": message})
    except Exception:
      pass  # chạy trực tiếp (không có broker) thì bỏ qua báo tiến độ

  try:
    return run_plan_job(payload, report)
  except Exception as exc:
    print(f"[Worker Error] {exc}")
    raise
