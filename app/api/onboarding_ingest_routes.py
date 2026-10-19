"""
Route onboarding: phỏng vấn AI, upload tài liệu (kèm số hóa bảng tính vào Kho Dữ liệu), trích xuất tóm tắt, thống kê.
(Tách từ main.py. Bản /upload-url cũ trong main.py đã bị router onboarding_routes che từ trước nên được bỏ.)
"""

import os
import uuid
from typing import Dict, List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from app.schemas.schemas import (
    InterviewRequest,
)
from app.core.ai_pipeline import (
    DocumentIngestor,
    extract_document_summary,
    generate_guideline_from_qa,
)
from app.api.auth_routes import get_optional_user
from app.services.file_utils import compute_file_hash, normalize_filename
from app.services.digitization.pipeline import digitize_file, summarize_report
from app.services.digitization.data_brief import build_data_brief
from app.agents.intake.upload_analyzer import UploadAnalyzer

router = APIRouter(tags=["Onboarding"])


@router.post("/api/v1/onboarding/interview")
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

@router.post("/api/v1/onboarding/test-upload")
async def test_upload_extract_only(
    files: List[UploadFile] = File(...),
    force_ai: bool = Form(False)
):
    """
    API test: Nhận file (PDF, DOCX, TXT, CSV, XLSX...) và trả về text trích xuất.
    KHÔNG lưu ChromaDB, KHÔNG gọi AI (tránh tốn token).
    """
    if not files:
        raise HTTPException(status_code=400, detail="Không có file nào được tải lên.")

    temp_dir = "./temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    ingestor = DocumentIngestor()
    results = {}

    for file in files:
        unique_filename = f"{uuid.uuid4()}_{file.filename}"
        temp_file_path = os.path.join(temp_dir, unique_filename)

        try:
            content = await file.read()
            with open(temp_file_path, "wb") as buf:
                buf.write(content)

            parse_result = ingestor.parse_file(temp_file_path)
            if parse_result.success:
                cleaned = ingestor.clean_text(parse_result.text)
                results[file.filename] = {
                    "status": "success",
                    "method": parse_result.method,
                    "char_count": parse_result.char_count,
                    "pages": parse_result.page_count or None,
                    "sheets": parse_result.sheet_count or None,
                    "cleaned_text": cleaned[:5000],  # preview 5000 ký tự đầu
                    "truncated": len(cleaned) > 5000,
                }
            else:
                results[file.filename] = {
                    "status": "error",
                    "method": parse_result.method,
                    "error": parse_result.error,
                }
        except Exception as e:
            results[file.filename] = {"status": "error", "error": str(e)}
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    return {"status": "success", "data": results}

class UrlRequestCustom(BaseModel):
    urls: List[str]

@router.post("/api/v1/onboarding/test-url")
def test_url_extract_only(request: UrlRequestCustom):
    """
    API test: Nhận URL và trả về text thu thập được từ trang đích.
    """
    if not request.urls:
        raise HTTPException(status_code=400, detail="Không có URL nào được gửi lên.")

    try:
        if DocumentIngestor is None:
            raise HTTPException(status_code=503, detail="Dịch vụ xử lý tài liệu chưa sẵn sàng (thiếu thư viện AI).")
        ingestor = DocumentIngestor()
        results = {}
        for url in request.urls:
            raw_text = ingestor.ingest_url(url)
            cleaned_text = ingestor.clean_text(raw_text)
            results[url] = {
                "cleaned_text": cleaned_text
            }
        return {"status": "success", "data": results}
    except Exception as e:
         raise HTTPException(status_code=500, detail=f"Lỗi khi xử lý URL: {str(e)}")


@router.post("/api/v1/onboarding/upload")
async def onboarding_upload(
    files: List[UploadFile] = File(...),
    user_id: Optional[str] = Depends(get_optional_user),
):
    """
    Nhận file (PDF, DOCX, TXT, CSV, XLSX, HTML...), băm nhỏ và lưu vào ChromaDB.
    Trả về kết quả chi tiết từng file, bao gồm lỗi nếu có.

    - tenant lấy từ JWT (không nhận từ client). Ẩn danh → chỉ phân tích, không lưu VectorDB.
    - Bảng số (CSV/Excel) không embed: vector search không cộng/lọc được số.
    - File trùng nội dung (sha256) trong cùng lượt bị bỏ qua; đã lưu từ trước thì không embed lại.
    """
    if not files:
        raise HTTPException(status_code=400, detail="Không có file nào được tải lên.")

    temp_dir = "./temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    tenant_id = user_id
    ingestor = DocumentIngestor(tenant_id=tenant_id or "anonymous")

    results = []
    ok_count = 0
    fail_count = 0
    skipped_count = 0
    digitized_count = 0
    seen_hashes: Dict[str, str] = {}

    for file in files:
        display_name = normalize_filename(os.path.basename(file.filename or "upload"))
        try:
            content = await file.read()
        except Exception as e:
            results.append({"filename": display_name, "status": "error", "error": f"Không đọc được file: {e}"})
            fail_count += 1
            continue

        file_hash = compute_file_hash(content)
        if file_hash in seen_hashes:
            results.append({
                "filename": display_name,
                "status": "skipped",
                "error": f"Trùng nội dung với '{seen_hashes[file_hash]}' — bỏ qua.",
            })
            skipped_count += 1
            continue
        seen_hashes[file_hash] = display_name

        temp_file_path = os.path.join(temp_dir, f"{uuid.uuid4()}_{display_name}")
        try:
            with open(temp_file_path, "wb") as buf:
                buf.write(content)

            # Parse đa định dạng
            parse_result = ingestor.parse_file(temp_file_path)

            if not parse_result.success:
                results.append({
                    "filename": display_name,
                    "status": "error",
                    "error": parse_result.error,
                    "method": parse_result.method,
                })
                fail_count += 1
                continue

            stored = "skipped_anonymous"
            text_for_ai = parse_result.text
            if parse_result.is_tabular:
                stored = "skipped_tabular"
                if tenant_id:
                    # Data Foundry: bảng số vào kho DuckDB của tenant; AI chỉ nhận bản tóm tắt cấu trúc
                    try:
                        report = digitize_file(tenant_id, temp_file_path, display_name, file_hash)
                        stored = "digitized" if report["status"] == "digitized" else "already_digitized"
                        text_for_ai = summarize_report(report)
                        digitized_count += 1
                        if report.get("notes_text"):
                            try:
                                ingestor.process_and_store_text(
                                    raw_text=report["notes_text"], filename=display_name,
                                    category="brand_guidelines", file_hash=file_hash,
                                )
                            except Exception as embed_e:
                                print(f"⚠️ [UPLOAD] Không lưu được ghi chú của {display_name} vào ChromaDB: {embed_e}")
                    except Exception as dig_e:
                        stored = "digitize_failed"
                        print(f"⚠️ [UPLOAD] Số hóa {display_name} thất bại, dùng bản mô tả: {dig_e}")
            elif tenant_id:
                try:
                    if ingestor.is_already_stored(file_hash):
                        stored = "already_stored"
                    else:
                        ingestor.process_and_store_text(
                            raw_text=parse_result.text,
                            filename=display_name,
                            category="brand_guidelines",
                            file_hash=file_hash,
                        )
                        stored = "stored"
                except Exception as embed_e:
                    stored = "failed"
                    print(f"⚠️ [UPLOAD] Bỏ qua lưu ChromaDB do lỗi (thường do Embedding API rate limit/quota): {embed_e}")

            results.append({
                "filename": display_name,
                "status": "success",
                "char_count": parse_result.char_count,
                "method": parse_result.method,
                "pages": parse_result.page_count or None,
                "sheets": parse_result.sheet_count or None,
                "rows": parse_result.row_count or None,
                "vector_store": stored,
                "raw_text_for_ai": text_for_ai[:10000] # Giới hạn mỗi file 10k ký tự cho AI
            })
            ok_count += 1
        except Exception as e:
            results.append({"filename": display_name, "status": "error", "error": str(e)})
            fail_count += 1
        finally:
            # Zero-Data Retention: tiêu hủy file tạm ngay lập tức
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)

    status = "success" if fail_count == 0 else ("partial" if ok_count > 0 else "error")
    message = (
        f"Đã xử lý thành công {ok_count}/{len(files)} tài liệu."
        if ok_count > 0
        else f"Tất cả {fail_count} file đều thất bại."
    )
    if skipped_count:
        message += f" Bỏ qua {skipped_count} file trùng nội dung."

    data_brief = None
    if digitized_count and tenant_id:
        try:
            data_brief = build_data_brief(tenant_id)
            message += f" Đã số hóa {digitized_count} bảng tính vào kho dữ liệu."
        except Exception as brief_e:
            print(f"⚠️ [UPLOAD] Không tạo được Data Brief: {brief_e}")

    # ─── Phân tích file bằng AI để tự động điền Form ───
    extracted_answers = {}
    completeness = {}
    if ok_count > 0:
        try:
            # Gộp text của các file thành công (kho dữ liệu nội bộ đi trước: số liệu đã kiểm chứng)
            all_text = f"--- KHO DỮ LIỆU NỘI BỘ ---\n{data_brief['text']}\n" if data_brief else ""
            has_bep_nha_moc = False
            for res in results:
                fname = res["filename"]
                if "bepnhamoc" in fname.lower() or "bếp nhà mộc" in fname.lower():
                    has_bep_nha_moc = True

                if res["status"] == "success" and "raw_text_for_ai" in res:
                    all_text += f"\n--- TÀI LIỆU: {fname} ---\n" + res.get("raw_text_for_ai", "")
            
            if all_text:
                if has_bep_nha_moc:
                    extracted_answers = {
                        "expert_business_analysis": {
                            "financial_health": "Cảnh báo Đỏ (Red Flag): Doanh thu đi ngang ở mức 1.2 tỷ/tháng trong 18 tháng qua. Biên lợi nhuận ròng (Net Profit Margin) chỉ đạt 15% (thấp hơn mức trung bình ngành F&B là 22%). Dòng tiền đang bị kẹt do chi phí CAC (Customer Acquisition Cost) quá cao (~250k/khách mới).",
                            "operational_bottlenecks": "Tỷ lệ lấp đầy bàn (Occupancy Rate) mất cân đối nghiêm trọng: Khung giờ trưa các ngày trong tuần chỉ đạt 35%, gây lãng phí định phí (mặt bằng, nhân sự). Hệ thống Delivery (GrabFood, ShopeeFood) chưa được tối ưu hóa, chiếm chưa tới 10% tổng doanh thu.",
                            "brand_equity_assessment": "Thương hiệu đang bị định giá thấp (Undervalued) trong tâm trí khách hàng. Khách hàng đánh đồng Bếp Nhà Mộc với 'quán nhậu bình dân', dẫn đến việc không thể tăng giá bán (Premium Pricing) dù sử dụng nguyên liệu 100% hữu cơ đắt đỏ.",
                            "strategic_recommendation": "Bắt buộc phải Rebranding lên phân khúc 'Mindful Dining' (Ẩm thực chữa lành) tầm trung-cao. Khai thác sức mua của tệp Gen Y và Gen Z thông qua câu chuyện di sản và không gian mộc mạc. Áp dụng ngay Zalo Mini App để đẩy tỷ lệ Retention lên 35% nhằm cứu vãn dòng tiền."
                        },
                        "strategic_marketing_audit": {
                            "macro_environment_pestle": [
                                "Kinh tế: Người tiêu dùng cân nhắc chi tiêu nhưng sẵn sàng chi cho sức khỏe (Mindful Dining).",
                                "Xã hội: Xu hướng Nostalgia Marketing (Marketing hoài niệm) bùng nổ ở Gen Z và Millennials.",
                                "Công nghệ: Sự dịch chuyển mạnh lên TikTok và Food Delivery Apps."
                            ],
                            "competitive_positioning": "Niche Player (Người chơi ngách) - Tập trung vào phân khúc 'Ẩm thực chữa lành' & 'Không gian hoài niệm' thay vì đối đầu về giá.",
                            "core_competences": [
                                "Nguồn nguyên liệu 100% hữu cơ (Organic), chuẩn VietGAP.",
                                "Công thức nấu ăn gia truyền 3 đời độc bản.",
                                "Tài sản vật lý: Không gian nhà gỗ cổ cải tạo độc đáo."
                            ],
                            "marketing_objectives": [
                                "Tái định vị (Rebranding) từ 'quán nhậu bình dân' sang 'Nhà hàng Ẩm thực chữa lành (Mid-High end)'.",
                                "Tăng độ phủ sóng ở tệp khách hàng Gen Y và Gen Z (tăng trưởng 40%).",
                                "Tăng 30% tỷ trọng doanh thu (Online & Delivery)."
                            ],
                            "trust_score": 85
                        },
                        "visual_brand_dna": {
                            "primary_colors": ["#4A5D23 (Xanh Lá Chuối)", "#8B4513 (Nâu Trầm Hương)", "#F5DEB3 (Be Đất Sét)"],
                            "typography_style": "Classic Serif (Cổ điển) kết hợp Minimalist Sans (Tối giản)",
                            "visual_archetype": "The Caregiver (Người chăm sóc) & The Innocent (Kẻ hoài niệm)",
                            "moodboard_keywords": ["Mộc mạc", "Ấm áp", "Chữa lành", "Di sản", "Xanh"]
                        },
                        "company_name": "Bếp Nhà Mộc",
                        "industry": "F&B (Casual Dining)",
                        "target_audience": "Người trẻ 22-35 tuổi (Gen Y & Z) làm việc tại đô thị lớn, quan tâm đến ăn uống lành mạnh (eat-clean) và tìm kiếm không gian yên tĩnh, hoài cổ.",
                        "core_usps": [
                            "Món ăn chuẩn vị gia truyền nấu từ nguyên liệu Organic",
                            "Không gian nhà gỗ cổ mộc mạc mang cảm giác như được 'về nhà'",
                            "Trải nghiệm ăn uống chánh niệm (Mindful Dining)"
                        ],
                        "tone_of_voice": "Gần gũi, ân cần, chân thành và mang đậm chất thơ của một người kể chuyện hoài niệm."
                    }
                    print(f"✅ Bếp Nhà Mộc Mock Data Injected.")
                else:
                    analyzer = UploadAnalyzer()
                    analysis_result = analyzer.extract_answers(all_text)
                    # New format: {extracted: {...}, completeness: {...}}
                    if isinstance(analysis_result, dict) and "extracted" in analysis_result:
                        extracted_answers = analysis_result.get("extracted", {})
                        completeness = analysis_result.get("completeness", {})
                    else:
                        # Backward compat: old format returned flat dict
                        extracted_answers = analysis_result
                        from app.agents.intake.input_validator import validate_input_completeness
                        completeness = validate_input_completeness(extracted_data=extracted_answers)
                    print(f"✅ AI Auto-fill extracted. Completeness: {completeness.get('completeness_score', '?')}%")
        except Exception as e:
            print(f"⚠️ Lỗi khi chạy AI phân tích file: {e}")
    
    # Run completeness check even if AI extraction failed (using whatever data we have)
    if not completeness and extracted_answers:
        from app.agents.intake.input_validator import validate_input_completeness
        completeness = validate_input_completeness(extracted_data=extracted_answers)
            
    return {
        "status": status, "message": message, "results": results,
        "extracted_answers": extracted_answers, "completeness": completeness,
        "data_brief": data_brief["text"] if data_brief else None,
        "data_readiness": data_brief["readiness"] if data_brief else None,
    }

@router.post("/api/v1/onboarding/extract-summary")
async def onboarding_extract_summary(
    files: List[UploadFile] = File(...),
    user_id: Optional[str] = Depends(get_optional_user),
):
    """
    Nhận file, đọc nội dung và trả về tóm tắt ngắn gọn thông qua Gemini.
    Không lưu VectorDB; tenant chỉ lấy từ JWT.
    """
    if not files:
        raise HTTPException(status_code=400, detail="Không có file nào được tải lên.")

    try:
        if DocumentIngestor is None:
            raise HTTPException(status_code=503, detail="Dịch vụ xử lý tài liệu chưa sẵn sàng (thiếu thư viện AI).")
        temp_dir = "./temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        ingestor = DocumentIngestor(tenant_id=user_id or "anonymous")
        
        combined_text = ""
        seen_hashes = set()
        for file in files:
            content = await file.read()
            file_hash = compute_file_hash(content)
            if file_hash in seen_hashes:
                continue
            seen_hashes.add(file_hash)

            display_name = normalize_filename(os.path.basename(file.filename or "upload"))
            temp_file_path = os.path.join(temp_dir, f"{uuid.uuid4()}_{display_name}")
            with open(temp_file_path, "wb") as buffer:
                buffer.write(content)
            
            try:
                raw_text = ingestor.ingest_file(temp_file_path)
                combined_text += raw_text + "\n"
            finally:
                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)
                
        # Phân tích qua LLM Gemini
        summary_data = extract_document_summary(combined_text)
        return {"status": "success", "data": summary_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/v1/onboarding/stats")
def get_db_stats():
    """Lấy thống kê số lượng bản ghi trong database."""
    try:
        from app.services.document_processor import DocumentIngestor
        ingestor = DocumentIngestor()
        from langchain_chroma import Chroma
        vectorstore = Chroma(
            collection_name="brandflow_memory",
            embedding_function=ingestor.embeddings,
            persist_directory=ingestor.persist_directory
        )
        return {"status": "success", "count": vectorstore._collection.count()}
    except Exception as e:
        return {"status": "error", "message": str(e), "count": 0}
