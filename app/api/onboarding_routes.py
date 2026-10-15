import os
from fastapi import APIRouter
from typing import List
from app.services.document_processor import DocumentIngestor
from app.agents.intake.intake_agent import extract_document_summary
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/onboarding", tags=["Onboarding"])

# Upload file: xem POST /api/v1/onboarding/upload trong main.py (bản ở đây từng che mất bản đó).

class UploadUrlRequest(BaseModel):
  urls: List[str]
  tenant_id: str = "default"

@router.post("/upload-url")
async def upload_url(request: UploadUrlRequest):
  """
  Nhận danh sách URLs từ giao diện Onboarding (Screen 1), parse text bằng DocumentIngestor,
  sau đó phân tích tương tự upload_files.
  """
  try:
    ingestor = DocumentIngestor(tenant_id=request.tenant_id)
    results = []
    raw_text_chunks = []
    
    for url in request.urls:
      try:
        text = ingestor.ingest_url(url)
        if text and text.strip():
          raw_text_chunks.append(f"--- NGUỒN URL: {url} ---\n{text}")
          results.append({"url": url, "status": "success", "raw_text_for_ai": text})
        else:
          results.append({"url": url, "status": "error", "error": "Không thể trích xuất nội dung từ URL này."})
      except Exception as url_e:
        results.append({"url": url, "status": "error", "error": str(url_e)})
        
    combined_text = "\n\n".join(raw_text_chunks)
    analysis_result = {}
    if combined_text.strip():
      analysis_result = extract_document_summary(combined_text)
    
    return {
      "status": "success",
      "extracted_answers": analysis_result,
      "results": results,
      "completeness": {"completeness_score": 80}
    }
  except Exception as e:
    print(f"[Upload URL Error]: {e}")
    return {"status": "error", "message": str(e)}
