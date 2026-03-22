import sys
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from schemas import PresetRequest, InterviewRequest
from memory_rag import inject_industry_presets, generate_guideline_from_qa, analyze_and_extract_dna
from document_processor import DocumentIngestor
import os
import uuid

app = FastAPI(
    title="BrandFlow APIs",
    description="APIs for BrandFlow Memory and RAG Strategy Engine.",
    version="1.0.0"
)

# Thêm CORS Middleware để cho phép Frontend (Vite/NextJS) gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong thực tế nên để ["http://localhost:3000", "http://localhost:3001"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/v1/onboarding/presets")
async def onboarding_presets(request: PresetRequest):
    """
    Nạp bộ quy chuẩn ngành có sẵn (F&B, Spa_Beauty, B2B_Tech) vào hệ thống (ChromaDB).
    """
    try:
        result = inject_industry_presets(request.industry)
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/api/v1/onboarding/interview")
async def onboarding_interview(request: InterviewRequest):
    """
    Sinh ra quy tắc marketing (Brand Guidelines) từ kết quả phỏng vấn và lưu vào hệ thống (ChromaDB).
    """
    try:
        result = generate_guideline_from_qa(request.answers)
        if result.get("status") == "error":
             raise HTTPException(status_code=400, detail=result.get("message"))
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/api/v1/onboarding/upload")
async def onboarding_upload(file: UploadFile = File(...)):
    """
    Nhận file (PDF, DOCX, TXT, IMG), xử lý qua DocumentIngestor (OCR, Chunking, ChromaDB).
    Sau đó trích xuất Brand DNA thông qua LLM & trả về cấu trúc dạng JSON trực quan.
    """
    try:
        # Bước 1: Lưu file tạm thời để DocumentIngestor có thể đọc được bằng đường dẫn
        temp_dir = "./temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        
        # Tạo tên file duy nhất để tránh xung đột
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        temp_file_path = os.path.join(temp_dir, unique_filename)
        
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        print(f"📥 [API] Đã lưu file tạm tại: {temp_file_path}")

        # Bước 2: Khởi tạo Pipeline Xử lý mạnh mẽ (OCR + Semantic Chunking)
        ingestor = DocumentIngestor()
        
        # Gọi ingest_file để lấy toàn bộ text thô (chạy OCR nếu cần)
        raw_text = ingestor.ingest_file(temp_file_path)
        
        # Bước 3: Đưa qua Pipeline Cleansing & Chunking -> Lưu thẳng vào ChromaDB
        # Chúng ta dùng "brand_guidelines" làm category mặc định cho tài liệu hãng tải lên
        ingestor.process_and_store(temp_file_path, category="brand_guidelines")

        # Bước 4: Gọi LLM extract JSON (USPs, Target Audience, Tone, Rules) từ text đã nhận diện
        # Truyền raw_text (hoặc cleaned_text) để trích xuất DNA
        cleaned_text = ingestor.clean_text(raw_text)
        analyzed_result = analyze_and_extract_dna(cleaned_text)
        
        # Bước 5: Dọn dẹp file tạm
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            
        if analyzed_result.get("status") == "error":
            raise HTTPException(status_code=400, detail=analyzed_result.get("message"))
            
        return analyzed_result
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý file: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
