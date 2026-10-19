"""
Job số hóa nền cho upload lớn (hàng trăm file): API chỉ lưu file vào vùng staging rồi trả job_id ngay,
worker (Celery nếu có Redis, không thì thread nền của API) số hóa từng file và ghi tiến độ.

Trạng thái job là file JSON nằm cạnh kho DuckDB (cùng volume) → API và Celery worker ở process khác
vẫn đọc/ghi chung được. Đường dẫn job gắn tenant, nên tenant khác không đọc được job_id của nhau.
"""

import json
import os
import re
import shutil
import threading
import time
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.services.digitization import warehouse as wh

QUEUED, RUNNING, DONE, FAILED = "queued", "running", "done", "failed"
_JOB_ID_RE = re.compile(r"^job_[0-9a-f]{16}$")
_write_lock = threading.Lock()


def _tenant_dir(tenant_id: str) -> str:
  safe = os.path.splitext(os.path.basename(wh.tenant_db_path(tenant_id)))[0]
  return os.path.join(wh.warehouse_dir(), "_jobs", safe)


def _job_path(tenant_id: str, job_id: str) -> str:
  if not _JOB_ID_RE.match(job_id or ""):
    raise KeyError(job_id)
  return os.path.join(_tenant_dir(tenant_id), f"{job_id}.json")


def staging_dir(tenant_id: str, job_id: str) -> str:
  return os.path.join(_tenant_dir(tenant_id), f"{job_id}_files")


def _write(tenant_id: str, job: Dict[str, Any]) -> None:
  path = _job_path(tenant_id, job["job_id"])
  job["updated_at"] = datetime.now().isoformat(timespec="seconds")
  tmp = f"{path}.{uuid.uuid4().hex[:6]}.tmp"
  with open(tmp, "w", encoding="utf-8") as f:
    json.dump(job, f, ensure_ascii=False, default=str)
  # Windows: os.replace lỗi nếu đúng lúc đó API đang đọc file → thử lại vài lần
  for attempt in range(5):
    try:
      with _write_lock:
        os.replace(tmp, path)
      return
    except PermissionError:
      time.sleep(0.05 * (attempt + 1))
  os.replace(tmp, path)


def get_job(tenant_id: str, job_id: str) -> Optional[Dict[str, Any]]:
  try:
    path = _job_path(tenant_id, job_id)
  except KeyError:
    return None
  for attempt in range(5):
    try:
      with open(path, encoding="utf-8") as f:
        return json.load(f)
    except FileNotFoundError:
      return None
    except (PermissionError, json.JSONDecodeError):
      time.sleep(0.05 * (attempt + 1))
  return None


def create_job(tenant_id: str, staged: List[Dict[str, str]], prechecked: List[Dict[str, Any]],
               job_id: Optional[str] = None) -> Dict[str, Any]:
  """
  staged: [{"filename", "path", "file_hash"}] — file đã lưu trong staging_dir, chờ số hóa.
  prechecked: kết quả đã biết ngay khi nhận (sai định dạng, quá dung lượng, trùng trong lượt) — tính là đã xong.
  """
  job_id = job_id or new_job_id()
  os.makedirs(_tenant_dir(tenant_id), exist_ok=True)
  job = {
    "job_id": job_id, "status": QUEUED, "runner": None,
    "total": len(staged) + len(prechecked), "processed": len(prechecked),
    "digitized": 0, "duplicates": sum(1 for r in prechecked if r.get("status") == "duplicate"),
    "errors": sum(1 for r in prechecked if r.get("status") == "error"),
    "skipped": sum(1 for r in prechecked if r.get("status") == "skipped"),
    "current_file": None, "pending": staged, "results": list(prechecked),
    "readiness": None, "brief": None, "error": None,
    "created_at": datetime.now().isoformat(timespec="seconds"),
  }
  _write(tenant_id, job)
  return job


def new_job_id() -> str:
  return f"job_{uuid.uuid4().hex[:16]}"


def run_job(tenant_id: str, job_id: str) -> Dict[str, Any]:
  """Số hóa lần lượt các file của job, ghi tiến độ sau MỖI file. Lỗi một file không dừng cả job."""
  from app.services.digitization.data_brief import build_data_brief
  from app.services.digitization.pipeline import digitize_file, summarize_report

  job = get_job(tenant_id, job_id)
  if job is None:
    raise KeyError(job_id)
  if job["status"] in (DONE, FAILED):
    return job
  job["status"] = RUNNING
  _write(tenant_id, job)
  try:
    while job["pending"]:
      item = job["pending"][0]
      job["current_file"] = item["filename"]
      _write(tenant_id, job)  # UI thấy file đang xử lý (file lớn có thể mất vài chục giây)
      try:
        report = digitize_file(tenant_id, item["path"], item["filename"], item["file_hash"])
        report["summary"] = summarize_report(report)
      except Exception as e:  # file hỏng/không đọc được → ghi lỗi, đi tiếp
        report = {"filename": item["filename"], "status": "error", "error": str(e)}
      finally:
        if os.path.exists(item["path"]):
          os.remove(item["path"])
      key = {"digitized": "digitized", "duplicate": "duplicates", "error": "errors"}.get(report.get("status"))
      if key:
        job[key] += 1
      job["results"].append(report)
      job["pending"].pop(0)
      job["processed"] += 1
      _write(tenant_id, job)

    brief = build_data_brief(tenant_id)
    job.update(status=DONE, current_file=None, readiness=brief["readiness"], brief=brief["text"])
  except Exception as e:
    job.update(status=FAILED, current_file=None, error=str(e))
  finally:
    _write(tenant_id, job)
    shutil.rmtree(staging_dir(tenant_id, job_id), ignore_errors=True)
  return job


def public_view(job: Dict[str, Any]) -> Dict[str, Any]:
  """Trạng thái trả cho client: không lộ đường dẫn staging trên server."""
  out = {k: v for k, v in job.items() if k != "pending"}
  out["remaining"] = len(job.get("pending", []))
  out["progress"] = round(job["processed"] / job["total"], 3) if job.get("total") else 1.0
  return out


# ─── Điều phối: Celery nếu có Redis, không thì chạy nền trong process API ────

def _celery_task():
  """Task Celery nếu cấu hình được và broker (Redis) đang sống; None → dùng fallback."""
  mode = os.getenv("BRANDFLOW_DATA_JOBS", "auto").lower()
  if mode == "thread":
    return None
  try:
    from app.core.celery_worker import celery, digitize_upload_job

    with celery.connection_for_write() as conn:
      conn.ensure_connection(max_retries=1, timeout=2)
    return digitize_upload_job
  except Exception as e:
    if mode == "celery":
      raise RuntimeError(f"Không kết nối được Celery/Redis: {e}") from e
    return None


def dispatch(tenant_id: str, job_id: str, background_tasks=None) -> str:
  """Đưa job vào hàng đợi; trả về runner đã dùng ('celery' | 'background' | 'thread')."""
  task = _celery_task()
  if task is not None:
    runner = "celery"
  elif background_tasks is not None:
    runner = "background"
  else:
    runner = "thread"
  job = get_job(tenant_id, job_id)
  job["runner"] = runner
  _write(tenant_id, job)

  if runner == "celery":
    task.delay(tenant_id, job_id)
  elif runner == "background":
    background_tasks.add_task(run_job, tenant_id, job_id)
  else:
    threading.Thread(target=run_job, args=(tenant_id, job_id), daemon=True, name=f"digitize-{job_id}").start()
  return runner
