"""
Data Foundry API — số hóa Excel/CSV và truy vấn kho dữ liệu nội bộ.
Mọi endpoint yêu cầu đăng nhập; tenant = user_id trong JWT (không bao giờ nhận từ client).
"""

import os
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel, Field

from app.api.auth_routes import get_current_user
from app.services.digitization import jobs
from app.services.digitization import query_tools as qt
from app.services.digitization.data_brief import build_data_brief
from app.services.digitization.firewall import validate_budget_proposal
from app.services.digitization.pipeline import is_tabular_file, remap_recipe
from app.services.file_utils import compute_file_hash, normalize_filename

router = APIRouter(prefix="/api/v1/data", tags=["Data Foundry"])

MAX_FILES_PER_UPLOAD = 300
MAX_FILE_BYTES = 50 * 1024 * 1024


class QueryRequest(BaseModel):
  sql: str
  max_rows: int = qt.MAX_ROWS


class MetricRequest(BaseModel):
  name: str
  group_by: List[str] = Field(default_factory=list)
  date_from: Optional[str] = None
  date_to: Optional[str] = None
  filters: Dict[str, Any] = Field(default_factory=dict)
  limit: int = 50


class ConfirmRecipeRequest(BaseModel):
  entity: str
  column_map: Dict[str, str]
  # Bảng ma trận theo kỳ: cột số chuẩn nhận giá trị các ô tháng/quý (None = giữ đề xuất)
  value_column: Optional[str] = None


class AskRequest(BaseModel):
  question: str = Field(min_length=3, max_length=1000)


def _bad_request(e: Exception):
  raise HTTPException(status_code=400, detail=str(e))


@router.post("/upload")
async def upload_tabular_files(background_tasks: BackgroundTasks, files: List[UploadFile] = File(...),
                               user_id: str = Depends(get_current_user)):
  """
  Smart Data Dropzone: nhận hàng loạt Excel/CSV (kể cả cả thư mục). Chỉ lưu file rồi trả job_id ngay;
  số hóa chạy nền (Celery nếu có Redis, không thì trong process API) — theo dõi ở GET /jobs/{job_id}.
  """
  if not files:
    raise HTTPException(status_code=400, detail="Không có file nào được tải lên.")
  if len(files) > MAX_FILES_PER_UPLOAD:
    raise HTTPException(status_code=400, detail=f"Tối đa {MAX_FILES_PER_UPLOAD} file mỗi lần.")

  job_id = jobs.new_job_id()
  stage = jobs.staging_dir(user_id, job_id)
  os.makedirs(stage, exist_ok=True)
  staged, prechecked, seen = [], [], set()
  for i, file in enumerate(files):
    name = normalize_filename(os.path.basename(file.filename or "upload"))
    if not is_tabular_file(name):
      prechecked.append({"filename": name, "status": "skipped", "error": "Chỉ nhận .xlsx/.xlsm/.xls/.csv"})
      continue
    content = await file.read()
    if len(content) > MAX_FILE_BYTES:
      prechecked.append({"filename": name, "status": "error", "error": "File vượt quá 50MB"})
      continue
    file_hash = compute_file_hash(content)
    if file_hash in seen:
      prechecked.append({"filename": name, "status": "duplicate", "error": "Trùng nội dung với file khác trong lượt này"})
      continue
    seen.add(file_hash)
    path = os.path.join(stage, f"{i:04d}_{name}")
    with open(path, "wb") as buf:
      buf.write(content)
    staged.append({"filename": name, "path": path, "file_hash": file_hash})

  job = jobs.create_job(user_id, staged, prechecked, job_id=job_id)
  try:
    jobs.dispatch(user_id, job_id, background_tasks)
  except RuntimeError as e:
    raise HTTPException(status_code=503, detail=str(e))
  return jobs.public_view(jobs.get_job(user_id, job_id) or job)


@router.get("/jobs/{job_id}")
def get_job_status(job_id: str, user_id: str = Depends(get_current_user)):
  """Tiến độ số hóa: processed/total, kết quả từng file, lỗi; khi xong có readiness + brief."""
  job = jobs.get_job(user_id, job_id)
  if job is None:
    raise HTTPException(status_code=404, detail="Không tìm thấy job")
  return jobs.public_view(job)


@router.get("/files")
def get_files(user_id: str = Depends(get_current_user)):
  return qt.list_files(user_id)


@router.get("/tables")
def get_tables(user_id: str = Depends(get_current_user)):
  return qt.list_tables(user_id)


@router.get("/tables/{name}")
def get_table(name: str, user_id: str = Depends(get_current_user)):
  try:
    return qt.describe_table(user_id, name)
  except qt.QueryError as e:
    raise HTTPException(status_code=404, detail=str(e))


@router.post("/query")
def run_query(req: QueryRequest, user_id: str = Depends(get_current_user)):
  try:
    return qt.query_sql(user_id, req.sql, req.max_rows)
  except qt.QueryError as e:
    _bad_request(e)


@router.get("/metrics")
def get_metric_catalog(_: str = Depends(get_current_user)):
  return {name: {"table": m["table"], "unit": m["unit"], "description": m["description"]}
          for name, m in qt.METRICS.items()}


@router.post("/metric")
def run_metric(req: MetricRequest, user_id: str = Depends(get_current_user)):
  try:
    return qt.get_metric(user_id, req.name, req.group_by, req.date_from, req.date_to, req.filters, req.limit)
  except qt.QueryError as e:
    _bad_request(e)


@router.get("/brief")
def get_brief(user_id: str = Depends(get_current_user)):
  return build_data_brief(user_id)


@router.get("/questions")
def get_questions(user_id: str = Depends(get_current_user)):
  return qt.pending_questions(user_id)


@router.post("/recipes/{recipe_id}/confirm")
def confirm_recipe(recipe_id: str, req: ConfirmRecipeRequest, user_id: str = Depends(get_current_user)):
  """HITL 1 chạm: xác nhận/sửa ánh xạ → áp lại cho mọi bảng cùng template."""
  try:
    return remap_recipe(user_id, recipe_id, req.entity, req.column_map, req.value_column)
  except KeyError:
    raise HTTPException(status_code=404, detail="Không tìm thấy recipe")
  except ValueError as e:
    _bad_request(e)


@router.get("/lineage")
def get_lineage(table: str, row: int, column: Optional[str] = None, user_id: str = Depends(get_current_user)):
  try:
    return qt.trace_lineage(user_id, table, row, column)
  except qt.QueryError as e:
    raise HTTPException(status_code=404, detail=str(e))


@router.post("/ask")
def ask(req: AskRequest, user_id: str = Depends(get_current_user)):
  from app.agents.analytics.data_analyst_agent import DataAnalystAgent

  try:
    return DataAnalystAgent().answer(user_id, req.question)
  except qt.QueryError as e:
    _bad_request(e)


@router.post("/validate-budget")
def validate_budget(payload: Dict[str, Any], _: str = Depends(get_current_user)):
  """Logic Firewall: kiểm tra đề xuất ngân sách (tổng hạng mục ≤ ngân sách, CAC, hòa vốn, cắt lỗ)."""
  return validate_budget_proposal(payload)
