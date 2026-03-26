# 🚀 BrandFlow — AI Marketing Strategy Engine

> **BrandFlow** là hệ thống Multi-Agent AI sử dụng kiến trúc **Deterministic Arbitration** để tự động lập chiến lược marketing, kiểm soát ngân sách bằng Python thuần, và thu thập phản biện từ AI khách hàng ảo — tất cả trong **1 pipeline tuyến tính duy nhất**, không vòng lặp.

---

## ✨ Tính Năng Nổi Bật

| Tính năng | Mô tả |
|---|---|
| 🧠 **3 AI Agents + 1 Python Interceptor** | CMO lập kế hoạch → Python cắt ngân sách → CFO bình luận + Persona phản biện |
| 🎯 **Deterministic Arbitration** | Pipeline tuyến tính 1 lượt, không vòng lặp — tránh tốn API và treo hệ thống |
| 📚 **Long-Term Memory (RAG)** | Lưu quy chuẩn ngành & tài liệu brand vào ChromaDB |
| 🧬 **Document Ingestion** | Upload nhiều PDF/DOCX + dán URL → OCR → Semantic Chunking → VectorDB |
| 📊 **Dashboard Trực Quan** | Giao diện React hiển thị Action Plan, KPI ngành, MoSCoW Budget Chart |
| 🕵️ **Mock Mode** | Từ khóa bí mật kích hoạt dữ liệu giả lập an toàn cho buổi Live Demo |

---

## 🏗️ Kiến Trúc Hệ Thống

### Kiến Trúc Cốt Lõi: Deterministic Arbitration

**Triết lý:** Tách bạch AI Sáng tạo và Python Logic. Tuyệt đối không dùng vòng lặp cho Agent tự sửa lỗi nhau.

```
[User Input]
     │
     ▼
┌──────────────────────────────────────────────────────────┐
│  INTAKE AGENT (Gemini Flash)                             │
│  Bóc tách ngôn ngữ tự nhiên → JSON có cấu trúc          │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  AGENT 1: MASTER PLANNER — CMO (Gemini Flash)            │
│  Lập Master Plan, cố tình vượt ngân sách 10-20%         │
│  bằng hạng mục COULD_HAVE (mồi nhử cho CFO)             │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│  PYTHON INTERCEPTOR (Không dùng AI)                      │
│  Tính tổng cost → Cắt bỏ COULD_HAVE → Trả final_plan   │
└──────────┬───────────────────────────────┬───────────────┘
           │                               │
           ▼                               ▼
┌────────────────────────┐  ┌────────────────────────────┐
│ AGENT 2: CFO           │  │ AGENT 3: PERSONA VALIDATOR │
│ (Groq — Llama 3 8B)   │  │ (Groq — Mixtral 8x7B)     │
│ 1 câu mắng/duyệt      │  │ Nhập vai KH mục tiêu      │
│ Tốc độ: ~800 từ/giây  │  │ 1-2 câu khen/chê đời thường│
└────────────┬───────────┘  └──────────────┬─────────────┘
             │                              │
             └──────────┬───────────────────┘
                        ▼
               [📋 Kết quả cuối cùng]
           final_plan (JSON) + agent_logs (Text)
```

### Cấu Trúc Thư Mục

```
BrandFlow/
├── 🐍 Backend (FastAPI)
│   ├── main.py               # API endpoints + Mock Mode interceptor
│   ├── agents_core.py        # 4 modules: MasterPlanner, Interceptor, CFO, Persona
│   ├── workflow_graph.py     # Pipeline tuyến tính (ThreadPoolExecutor)
│   ├── intake_agent.py       # Intake Agent (Gemini Flash JSON mode)
│   ├── mock_manager.py       # Parse mock data từ file Markdown
│   ├── memory_rag.py         # ChromaDB + Ollama RAG memory
│   ├── document_processor.py # OCR + Semantic Chunking pipeline
│   ├── schemas.py            # Pydantic request schemas
│   ├── .env                  # API Keys (GEMINI + GROQ) — Gitignored
│   └── requirements.txt
│
└── 🖥️ Frontend (React + Vite)
    └── frontend/
        └── src/
            ├── App.jsx                # State management + API orchestration
            └── components/
                ├── Sidebar.jsx        # Navigation tương tác
                ├── Header.jsx         # Breadcrumb động
                ├── DashboardOverview  # Tổng quan chiến dịch
                ├── ScreenUpload.jsx   # Upload nhiều file + URL
                ├── ScreenSimulation   # Hiệu ứng AI Board
                └── ScreenDashboard    # Kết quả Plan + MoSCoW chart
```

---

## 🤖 Lựa Chọn API & Model

### Agent 1: Intake Agent & MasterPlanner — `gemini-1.5-flash`
- **API:** Google Gemini (Google AI Studio)
- `response_mime_type="application/json"` → Ép JSON chuẩn 100%, không crash
- Context window 1 triệu token, hành văn Marketing tiếng Việt xuất sắc

### Agent 2: CFO — `llama3-8b-8192`
- **API:** Groq (chip LPU)
- Tốc độ ~800 từ/giây → CFO "chửi" gần như real-time (Zero Latency)
- Tư duy logic Llama 3 hợp giọng cộc lốc, đi thẳng vấn đề

### Agent 3: Persona Validator — `mixtral-8x7b-32768`
- **API:** Groq (chip LPU)
- Mixture-of-Experts → Persona Adherence cực đỉnh
- Biến hóa văn phong: Gen Z xì-teen ↔ dân văn phòng khắt khe

---

## 🛠️ Yêu Cầu Hệ Thống

- **Python** 3.10+
- **Node.js** 18+ & npm
- **[Ollama](https://ollama.com/)** (cho RAG embeddings): `ollama pull nomic-embed-text`
- **API Keys** (cấu hình trong file `.env`):
  - `GEMINI_API_KEY` — [Google AI Studio](https://aistudio.google.com/)
  - `GROQ_API_KEY` — [Groq Console](https://console.groq.com/keys)

---

## ⚙️ Cài Đặt & Chạy

### 1. Backend (Python / FastAPI)

```bash
cd BrandFlow

python -m venv venv
.\venv\Scripts\activate  # Windows

pip install -r requirements.txt

# Cấu hình API Keys
# Tạo file .env với nội dung:
# GEMINI_API_KEY=your_key_here
# GROQ_API_KEY=your_key_here

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

API Docs: **http://localhost:8000/docs**

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Mở trình duyệt: **http://localhost:5173**

### 3. Chạy Pipeline trực tiếp (CLI)

```bash
python workflow_graph.py
```

---

## 📡 API Endpoints

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/v1/planning/intake` | Intake Agent → Pipeline (MasterPlanner → Interceptor → CFO & Persona) |
| `POST` | `/api/v1/onboarding/upload` | Upload nhiều file PDF/DOCX → ChromaDB |
| `POST` | `/api/v1/onboarding/upload-url` | Dán URL website → Thu thập text → ChromaDB |
| `POST` | `/api/v1/onboarding/presets` | Nạp bộ quy chuẩn ngành (F&B, Spa, B2B) |
| `POST` | `/api/v1/onboarding/test-upload` | Test đọc file (không lưu DB) |
| `POST` | `/api/v1/onboarding/test-url` | Test đọc URL (không lưu DB) |
| `GET`  | `/api/v1/onboarding/stats` | Thống kê số chunks trong ChromaDB |

---

## 🖥️ Tech Stack

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) — REST API framework
- [Google Gemini](https://ai.google.dev/) — LLM cho Intake & MasterPlanner
- [Groq](https://groq.com/) — LPU inference cho CFO & Persona
- [ChromaDB](https://www.trychroma.com/) — Vector database cho RAG
- [Ollama](https://ollama.com/) — Local embeddings (`nomic-embed-text`)

**Frontend**
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) — Biểu đồ ngân sách & KPI
- [Lucide React](https://lucide.dev/) — Icons

---

## 📝 Ghi Chú Kiến Trúc

- **Deterministic Arbitration:** Không dùng vòng lặp (while/loop) giữa các Agent. Pipeline luôn chạy đúng 1 lượt.
- **Python Interceptor:** Cắt ngân sách bằng code Python thuần — nhanh, chính xác 100%, không tốn API token.
- **Song song hoá:** CFO & Persona chạy đồng thời bằng `ThreadPoolExecutor` — tiết kiệm thời gian.
- **Mock Mode:** Từ khóa bí mật trong input tự động kích hoạt dữ liệu giả lập cho buổi Demo an toàn.
- **ChromaDB persist:** Dữ liệu RAG lưu tại `./chroma_db/`, không mất khi restart.

---

## 📄 License

MIT License — Dự án cá nhân, vui lòng ghi nguồn khi sử dụng lại.
