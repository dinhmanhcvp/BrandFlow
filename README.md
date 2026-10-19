# BrandFlow 2.0 - B2B Deterministic Marketing Strategy Engine

BrandFlow là hệ thống Multi-Agent AI chuyên dụng để thiết kế, phản biện, và lập kế hoạch Marketing B2B bài bản dựa trên quy trình 10 bước chuẩn B2B.

## 🧠 Kiến trúc Mạng Đa tác vụ (Multi-Agent DAG)

Để ngăn chặn tuyệt đối hiện tượng AI bị "ảo giác toán học" và vi phạm nguyên tắc "Chiến lược đi trước, Chiến thuật đi sau" (Strategy First), **pipeline lập kế hoạch ở backend** (`app/agents/planner/agents_core.py`) gồm các giai đoạn nối tiếp (Sequential/Deterministic Pipeline) đan xen giữa LLM và Code logic thuần:

1. **Phase 1 (Goal Setting)**: Trí tuệ CMO thiết lập Sứ mệnh cốt lõi và các lằn ranh đỏ (Red lines) doanh nghiệp tuyệt đối không được vi phạm.
2. **Phase 2 (Situation Audit)**: CMO chia tệp khách hàng theo Needs-based Audience (Pain-points & Động lực), chọn và gán trọng số cho bộ Critical Success Factors (CSFs).
3. **Python Math Engine (Toán học độc lập)**: Code Python thuần (`math_engine.py`) tiến hành nhân chia tính toán tổng điểm Cạnh tranh (Weighted SWOT Score) và Khoảng trống doanh thu (Gap Analysis). *Cắt đứt sự ảo giác của AI trong việc cộng trừ tiền tệ*.
4. **Phase 3 (Strategy Formulation)**: CMO dùng số liệu Gap Analysis chọn chiến lược vĩ mô Ansoff (Thâm nhập thị trường, Đa dạng hóa...).
5. **Phase 4 (Tactical & Budgeting)**: CMO bung bảng khối lượng công việc, gắn tag MoSCoW. Ngay lập tức, Python Interceptor thực hiện chức năng "Kiểm toán viên" chém bỏ hoặc cắt giảm (ép giá) nhóm công việc `COULD_HAVE` nếu vượt ngân sách gốc.
6. **Phase 5 (Cross-functional Review)**: Giám đốc Tài chính AI (CFO) thiết lập phương án dự phòng (Downside Risk) cho các nhánh rủi ro. Khách hàng ảo (Persona) soát lỗi "Ngáo giá trị" của bảng chiến thuật. 

> Lưu ý: đây là các giai đoạn của *pipeline agent* ở backend. Giao diện người dùng (`/onboarding` → `/workspace`) có 7 bước: **Thu thập dữ liệu (Onboarding)** → Tranh luận chiến lược → Chiến thuật → Triển khai → Sáng tạo nội dung → Triển khai Agent → Báo cáo.

## 🗄️ Kho Dữ liệu (Data Foundry)

Số hóa hàng trăm file Excel/CSV lộn xộn của SME vào kho DuckDB riêng cho từng doanh nghiệp; agent **truy vấn** số liệu thay vì đọc file. Trang `/data-hub`, API `/api/v1/data/*`. Chi tiết: `ProjectDocs/DATA_DIGITIZATION_PROPOSAL.md`.

## 🚀 Khởi động Fullstack bằng 1-Click

Để rút ngắn thời gian khởi động môi trường Test:
1. Đảm bảo cấu hình file `.env` dựa trên file mẫu `.env.example`:
   - API key: `GEMINI_API_KEY` (hoặc `GOOGLE_API_KEY`) và `GROQ_API_KEY`
   - `JWT_SECRET_KEY` (bắt buộc khi deploy)
   - `BRANDFLOW_FRONTEND_URLS="http://localhost:3000"` (bỏ trống thì chỉ cho phép localhost:3000 và domain Vercel production)
2. Chạy file **`start_fullstack.bat`** (Windows) từ thư mục gốc. 
   - Tab 1: Boot thuật toán Backend (FastAPI - Port 8000).
   - Tab 2: Boot giao diện Frontend (Next.js - Port 3000).

## 🧰 Tech Stack
* **Backend**: Python 3.11, FastAPI, SQLAlchemy (SQLite dev / PostgreSQL prod), LangChain.
* **LLM**: Google Gemini (mặc định `gemini-2.5-flash` cho phần lớn agent, embedding `gemini-embedding-001`) + Groq (Llama 3.x cho intake/review cần tốc độ).
* **Dữ liệu**: ChromaDB (luật chơi, Brand Guidelines, ghi chú văn bản); DuckDB per-tenant (Kho Dữ liệu số hóa từ Excel/CSV).
* **Frontend**: Next.js 16, React 19, TailwindCSS 4, Lucide Icons; triển khai Vercel. Backend triển khai Render/Railway.
* **Cấu trúc backend**: `main.py` chỉ tạo app + middleware + đăng ký router; nghiệp vụ trong `app/api/*_routes.py`, quota/plan registry trong `app/core/quota.py` (lưu DB, an toàn khi chạy nhiều worker).
