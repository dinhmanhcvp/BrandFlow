# BrandFlow — Đặc tả hệ thống (Specs)

> Phiên bản mô tả: trạng thái code tại 2026-10-19 (nhánh `main`, gồm cả thay đổi chưa commit về Data Foundry / Data Hub).
> Tài liệu liên quan: `README.md`, `ProjectDocs/CODEMAP.md`, `ProjectDocs/DATA_DIGITIZATION_PROPOSAL.md`, `docs/DEPLOYMENT_GUIDE.md`.

---

## 1. Tổng quan

**BrandFlow** là nền tảng Multi-Agent AI giúp doanh nghiệp (ưu tiên SME Việt Nam, B2B và F&B) **lập, phản biện, thực thi kế hoạch marketing**: từ phỏng vấn/nhập tài liệu → Brand DNA → tranh luận chiến lược giữa các "trợ lý AI" → phân bổ ngân sách → sinh nội dung/thiết kế → báo cáo.

Nguyên tắc thiết kế cốt lõi: **"Toán học làm chủ, AI làm thuê"** — LLM chỉ suy luận/diễn giải; mọi phép tính tiền, tỷ trọng, điểm số, SQL trên dữ liệu thật đều do code deterministic (Python / DuckDB) thực hiện, rồi kiểm tra chéo ("Interceptor", "Logic Firewall").

| Hạng mục | Nội dung |
|---|---|
| Backend | Python 3.11, FastAPI, SQLAlchemy 2 (SQLite dev / PostgreSQL prod), Alembic, DuckDB, ChromaDB, LangChain, Groq/Gemini/OpenAI |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind 4, Zustand, Framer Motion, Recharts, @xyflow/react |
| Triển khai | Frontend: Vercel · Backend: Render (`Procfile`: `uvicorn main:app`) · Docker/Gunicorn (4–8 worker) · CI: GitHub Actions (flake8 + pytest) |
| Ngôn ngữ UI | Song ngữ Vi/En (`frontend/src/i18n/translations.ts`, `LanguageContext`) |
| Theme | Light/Dark (`next-themes`) |

---

## 2. Kiến trúc

```
Next.js (Vercel)  ──HTTPS/JWT──▶  FastAPI (main.py + app/api/*)
  /onboarding, /workspace,            │
  /planning/*, /data-hub, ...         ├─ app/agents/*        (Trợ lý AI: planner, intake, research, design, content, analytics, custom)
  /api/agent (mascot, Node route)     ├─ app/workflows/*     (pipeline xác định + workflow-engine JSON)
                                      ├─ app/services/*      (RAG, document, math engine, digitization, form CRUD)
                                      ├─ app/core/*          (DB, audit, cache, trace, celery, final output)
                                      ├─ SQL DB (users/projects/forms/…)   ChromaDB (RAG)   DuckDB per-tenant (Data Foundry)
                                      └─ LLM: Groq llama-3.3-70b (mặc định) · Gemini 2.0 Flash · OpenAI (ảnh/DALL·E)
```

### 2.1 Pipeline chiến lược (`app/workflows/workflow_graph.py`, v7 — tuyến tính, không vòng lặp)

1. **Intake context** → **Gateway router** (chọn route theo tier: fast-track / balanced / deep-analysis) → **Clarification guard** (hỏi bổ sung nếu thiếu dữ liệu).
2. **CMO Phase 1 – Goal Setting**: sứ mệnh, mục tiêu, red lines.
3. **CMO Phase 2 – Situation Audit**: phân khúc theo nhu cầu, CSF; có `fetch_market_context`.
4. **Math Engine** (`math_engine.py`, `engine_adapters.py`): Weighted SWOT score, Gap Analysis, quy đổi % → VND, xuất Excel.
5. **CMO Phase 3 – Strategy Formulation**: chọn hướng Ansoff theo gap.
6. **CMO Phase 4 – Tactical Allocator** + **Python Interceptor**: gắn MoSCoW, cắt/ép giá nhóm `COULD_HAVE` nếu vượt ngân sách.
7. **Review song song** (timeout `BRANDFLOW_PARALLEL_AGENT_TIMEOUT_SECONDS`, mặc định 75s): CFO (Downside Risk), Customer/Persona (có vòng chấm điểm rule+self, ngưỡng `BRANDFLOW_CUSTOMER_THRESHOLD`), COO (khả thi), Sales Director.
8. **Finalize output** → `final_plan` + `agent_logs`; ghi file qua `final_output_writer` (`BRANDFLOW_FINAL_DIR`).
9. **Refine** (`run_refinement_pipeline`): chỉnh kế hoạch theo feedback.

Ngoài ra có `app/workflows/workflow_engine.py` + `cmo_workflow.json` (engine node: VariableNode, FunctionNode…) và `app/engine/{executor,nodes}.py`; mọi response orchestration mang `ORCHESTRATION_CONTRACT_VERSION = "week1-v1"` và error envelope chuẩn (`code`, `node_name`, `error_scope`, `retryable`).

### 2.2 Data Foundry (số hóa Excel/CSV, `app/services/digitization/`)

`workbook_reader` → `structure_detector` (nhiều bảng/sheet, note, key-value, bảng trùng) → `profiler` → `schema_mapper` (recipe: cache theo `header_signature` → heuristic → LLM; có câu hỏi xác nhận) → `warehouse` (DuckDB per-tenant, `BRANDFLOW_WAREHOUSE_DIR`, mặc định `./data_warehouse`) → `canonical` (thực thể chuẩn + `custom`, `org_profile`) → `firewall` (đối soát toàn vẹn + `BudgetProposal`) → `query_tools` (metric định nghĩa sẵn, SELECT read-only có rào chắn) → `data_brief` (tóm tắt cho agent). Điểm vào: `pipeline.digitize_file`; dedupe theo hash file; nạp trong một transaction.
`normalizers_vi.py` chuẩn hóa dữ liệu tiếng Việt (tiền tệ, ngày…).
**Business Analyst Agent #0** (`data_analyst_agent.py`): LLM chỉ đọc Data Brief + schema → chọn metric hoặc viết 1 câu SELECT → DuckDB chạy → LLM diễn giải, chỉ được dùng số có trong kết quả (tối đa 50 dòng đưa vào LLM), kèm lineage.

---

## 3. Mô hình dữ liệu (SQL — `app/models/models.py`)

| Bảng | Mục đích | Trường chính |
|---|---|---|
| `users` | Tài khoản | `email` (unique), `password_hash` (bcrypt), `tier` FREE/PLUS/PRO, `is_admin`, `is_active`, `account_profile`, `is_2fa_enabled`, `privacy_mode` |
| `projects` | Kế hoạch marketing của user | owner → `users` (cascade) |
| `project_members` | Thành viên dự án | liên kết user–project |
| `form_data` | Dữ liệu từng form trong 23+ form | `project_id`, `form_key` (vd `a1-mission`), `data` JSON, `version` (optimistic lock); unique (project, form_key) |
| `business_metrics` | Chỉ số kinh doanh / project (1–1) | TAM/SAM/SOM, CAGR, CAC, LTV, LTV/CAC, ROI, market share, retention, proxy NPS, `ai_telemetry_data` |
| `custom_agents` | Agent do user tự tạo | `name`, `role`, `system_prompt`, `capabilities` JSON |
| `brand_dna` | Brand DNA của user | `brand_name`, `dna_data`, `intake_analysis`, `source` (wizard/file_upload/url) |

Kho khác: **ChromaDB** (`chroma_db/`, RAG tài liệu & guideline), **SQLite audit** (`audit/visitor_audit.db`, nhật ký truy cập), **DuckDB per-tenant** (Data Foundry), thư mục `cache/` (cache ảnh thiết kế), `outputs/` (Excel từ MathEngine). Migration: Alembic (`alembic/versions`, hiện 2 revision).

---

## 4. Xác thực & phân quyền

- JWT (PyJWT, `JWT_SECRET_KEY`), mật khẩu bcrypt. Endpoint dưới `/api/v1/auth`: `register` (hỗ trợ `invite_code` / `BETA_INVITE_CODE`), `login`, `social` (Google/Facebook), `DELETE /users/me`, `GET /users/me/export`, nhóm `admin/*` (list user, upgrade tier, tạo user — yêu cầu `is_admin`).
- Dependency: `get_current_user`, `get_optional_user`, `get_admin_user`. Dữ liệu cách ly theo user (tenant = user trong JWT); Data Foundry và form CRUD đều lọc theo `user_id`.
- GDPR/riêng tư: `GET /api/v1/users/me/export`, `DELETE /api/v1/users/me/purge`, `privacy_mode` (masking dữ liệu gửi AI), tài liệu SOC 2 ở `docs/soc2_policies/`.
- Bảo mật HTTP: header `nosniff`, `X-Frame-Options: DENY`, HSTS; CORS theo `BRANDFLOW_FRONTEND_URLS` (mặc định `*` nếu không đặt — nên đặt ở production); rate limit `slowapi` mặc định 200 req/phút/IP; audit token riêng `BRANDFLOW_AUDIT_ADMIN_TOKEN` cho endpoint `/api/v1/audit/*`.

### 4.1 Gói (tier) — `GET /api/v1/users/me/tier`

| | FREE | PLUS | PRO |
|---|---|---|---|
| Agent | intake, phase1, phase2 | + phase3, phase4 | + phase3, phase4 |
| Review board | ✗ | CFO + Customer | cả 4 reviewer + deep-analysis |
| Content Lab | ✗ | ✓ | ✓ |
| Design Studio | ✗ | ✗ | ✓ |
| Số project | 1 | 5 | không giới hạn |
| Route | fast-track | balanced | deep-analysis |

Quota upload (`WEEK1_QUOTA_POLICY`, đếm in-memory — chưa bền vững): FREE 2 file/request, 6 file/ngày, 10MB, 3 URL/ngày · PLUS 5/30/25MB/15 · PRO 15/120/100MB/80.

---

## 5. API Backend

Cơ sở: `https://<render-host>`; tài liệu OpenAPI tại `/docs`. `GET /health`, `GET /api/v1/system-info` (trạng thái pipeline AI, DB, cache).

| Nhóm | Prefix | Endpoint chính |
|---|---|---|
| Auth | `/api/v1/auth` | register, login, social, users/me (delete/export), admin/* |
| Form CRUD | `/api/v1/forms` | users, projects (CRUD), `projects/{id}/forms` (+`/{form_key}` PUT/GET/DELETE, `/bulk`), `brand-dna` (POST/GET) |
| Onboarding | `/api/v1/onboarding` | `interview`, `upload` (PDF/DOCX/Excel/CSV; Excel/CSV của user đăng nhập đi qua Data Foundry), `test-upload`, `upload-url`, `test-url`, `extract-summary`, `stats` |
| Planning | `/api/v1/planning` | `contracts/week1`, `telemetry/usage`, `wizard/submit`, `wizard/validate`, `execute`, `orchestration/mock-run`, `intake`, `analyze-gaps`, `generate-forms` (AI sinh 23 form), `refine`, `micro-execute`, `history` |
| Industry advisor | `/api/v1/industry-advisor` | gợi ý mô hình marketing & form hiển thị theo ngành + quy mô |
| Research | `/api/v1/research` | `market`, `extract-dna` |
| Design | `/api/v1/design` | `generate-prompts`, `generate-assets`, `revise-assets`, `generate-case-study`, `revise-block`, `generate-slides`, `export-pptx`; ngoài ra `POST /api/v1/design/generate` |
| Content Lab | `/api/content-lab` | `ingest`, `analyze`, `generate`, `batch-generate`, `repurpose`, `competitor-analyze`, `chat`, `trends` |
| Analytics | `/api/v1/analytics`, `/api/agile` | `media-buyer/analyze`, `crm/generate-strategy`, `agile/evaluate` |
| Agent Builder | `/api/v1/agents` | tạo/list agent tùy biến, `/{id}/chat` |
| Data Foundry | `/api/v1/data` | `upload`, `files`, `tables`, `tables/{name}`, `query`, `metrics`, `metric`, `brief`, `questions`, `recipes/{id}/confirm`, `lineage`, `ask`, `validate-budget` |
| Tác vụ nền | `/api/v1/tasks` | `dispatch-plan`, `{task_id}/status` (Celery + Redis; `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`) |
| Audit / Admin | `/api/v1/audit/*` | visitors, visits, funnel-stats, daily-growth, hourly-heatmap, feature-categories, engagement-stats, growth-metrics |
| Compliance | `/api/v1/compliance/health` | |

Quan sát: `loguru` (file `logs/brandflow.log`, xoay 50MB/10 ngày), `trace_logger` (`BRANDFLOW_TRACE_DIR`), `SmartCache`, middleware ghi audit mọi request (có `X-Trace-Id`, `X-Tier`).

---

## 6. Các Trợ lý AI (agents)

| Agent | Vị trí | Vai trò |
|---|---|---|
| Intake / Upload Analyzer / Input Validator | `agents/intake` | Phân tích tài liệu, kiểm tra đủ dữ liệu, sinh câu hỏi bổ sung |
| CMO (Phase 1–4) | `agents/planner/agents_core.py` | Mục tiêu, audit thị trường, chiến lược, chiến thuật & ngân sách |
| Python Interceptor | cùng file | Kiểm toán ngân sách bằng code |
| CFO / Customer(Persona) / COO / Sales Director | cùng file | Review chéo, có điểm rule-based |
| Industry models | `agents/planner/industry_models.py` | Ma trận mô hình marketing theo ngành & quy mô |
| Market / Autonomous Research | `agents/research` | Nghiên cứu thị trường, trích Brand DNA |
| Design / Slide Generator / Image client | `agents/design`, `design_agent/` | Prompt, tài sản thương hiệu (DALL·E), deck JSON → PPTX, DNA extractor |
| Content Lab | `agents/content_lab` | Sinh/tái sử dụng nội dung, phân tích đối thủ, xu hướng |
| Media Buyer / CRM / Agile / **Data Analyst #0** | `agents/analytics` | Tối ưu quảng cáo, chiến lược CRM, pivot chiến dịch, hỏi–đáp dữ liệu nội bộ |
| Custom agent factory | `agents/custom` | Agent do user định nghĩa (web_search, data_analysis, niche_knowledge…) |

Lựa chọn LLM: `_get_strategy_llm` / `_get_review_llm` — Gemini 2.0 Flash khi có khóa, fallback Groq `llama-3.3-70b-versatile` (circuit breaker); timeout Groq `BRANDFLOW_GROQ_TIMEOUT_SECONDS` (60s). Mascot chat (`frontend/src/app/api/agent/route.ts`) dùng Groq `llama-3.1-8b-instant`/OpenAI.

---

## 7. Frontend — màn hình & chức năng

| Khu vực | Route | Mô tả |
|---|---|---|
| Landing | `/`, `/hub`, `/showcase`, `/onepager` | Giới thiệu, pricing, metrics, lead magnet, Anniversary banner |
| Auth | `/login` | Email/mật khẩu + Google/Facebook/LinkedIn OAuth |
| Onboarding / Workspace Phase 1 | `/onboarding` | Nguồn dữ liệu (upload file/URL, wizard phỏng vấn theo ngành), dashboard, chọn mục tiêu & tính năng |
| Workspace Engine | `/workspace` | 6 giai đoạn: Debate (Boardroom) → Tactics → Execution → Creative → Agent Deploy → Report; `PipelineProgress` 5 bước |
| Lập kế hoạch B2B | `/planning/*` | **Phần A** chiến lược (a0–a9), **Phần B** vận hành (b0–b6), **Phần C** tổng hợp (c0–c4), **Phần D** báo cáo (`d0-report`); tổng cộng ~23 form. Auto-save debounce qua `useAutoSaveForm` → `/api/v1/forms`; Mascot chatbot giải thích form |
| Nội dung | `/daily-content`, `/content-lab` | Bài viết/caption hằng ngày; Content Lab nâng cao |
| Thiết kế | `/design-studio` | Logo, bộ nhận diện, deck builder (`SlideEditor`), xuất PPTX |
| Dữ liệu | `/data-hub` (mới) | Số hóa Excel → dữ liệu sẵn sàng cho AI; xem bảng, hỏi-đáp |
| Phân tích | `/dashboard`, `/agile-optimizer`, `/sandbox` | Dashboard theo dõi, tối ưu chiến dịch, RL sandbox |
| Agent | `/agents`, `/agent-builder`, `/niche-knowledge` | Xây agent riêng, kho tri thức ngách |
| Hệ thống | `/assets`, `/settings`, `/resources` | Tài liệu, cấu hình, tài nguyên |
| Admin | `/admin/*` | Command center, analytics & GTM, pitch deck, booth materials, video demo, benchmark |
| Demo | `/demo-video*`, `/wallpaper` | Trang trình diễn/quay video (không thuộc luồng sản phẩm) |

State: Zustand (`useFormStore`), Context (`LanguageContext`). Sidebar điều hướng nhóm core / advanced / system / admin (admin chỉ hiện với `is_admin`). Kiểm thử E2E Playwright: `auth`, `navigation`, `workspace`.

---

## 8. Cấu hình môi trường

Backend: `GROQ_API_KEY`, `GEMINI_API_KEY`/`GOOGLE_API_KEY`, `OPENAI_API_KEY`, `LLAMA_CLOUD_API_KEY`, `DATABASE_URL`, `JWT_SECRET_KEY`, `GOOGLE_CLIENT_ID`, `FACEBOOK_APP_ID`, `BETA_INVITE_CODE`, `BRANDFLOW_FRONTEND_URLS`, `BRANDFLOW_AUDIT_ADMIN_TOKEN`, `BRANDFLOW_AUDIT_DB_PATH`, `BRANDFLOW_WAREHOUSE_DIR`, `BRANDFLOW_FINAL_DIR`, `BRANDFLOW_TRACE_DIR`, `BRANDFLOW_GROQ_TIMEOUT_SECONDS`, `BRANDFLOW_PARALLEL_AGENT_TIMEOUT_SECONDS`, `BRANDFLOW_CUSTOMER_THRESHOLD`, `BRANDFLOW_MAX_CUSTOMER_ROUNDS`, `BRANDFLOW_SCORE_WEIGHT_RULE/SELF`, `BRANDFLOW_LOCAL_MODEL`, `BRANDFLOW_DISABLE_LLM_MAPPING`, `DIGITIZATION_LLM_MODEL`, `DATA_ANALYST_LLM_MODEL`, `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`, `DESIGN_CACHE_DIR`.
Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_FACEBOOK_APP_ID`, `NEXT_PUBLIC_LINKEDIN_CLIENT_ID`.

---

## 9. Kiểm thử & CI

- `pytest` (`tests/`): API, digitization, workflow graph, memory/RAG, quality gate, marketing output, injection/exfiltration, trace logger, customer schema.
- CI (`.github/workflows/ci.yml`): Python 3.11, flake8 (lỗi cú pháp chặn build), pytest với `JWT_SECRET_KEY` và SQLite giả lập.
- Frontend: ESLint, Playwright E2E, script `check:lang`, `check:content`.

---

## 10. Hạn chế & nợ kỹ thuật đã biết (từ code)

1. Quota/usage tuần 1 (`WEEK1_DAILY_USAGE`, `WEEK1_PLAN_REGISTRY`, `WEEK1_MODEL_USAGE`) lưu in-memory → mất khi restart, không đúng khi chạy nhiều worker.
2. CORS mặc định `*` khi thiếu `BRANDFLOW_FRONTEND_URLS`.
3. `main.py` rất lớn (~2300 dòng) chứa nhiều route nghiệp vụ; nên tách router.
4. Trùng lặp route/trang planning (vd `b3-action` vs `b3-budget`, `b5-contingency` vs `b4-contingency`, `b7-gantt` vs `b6-gantt`, `c2-matrix` vs `c2-history`) và nhiều thư mục demo/mock.
5. Repo chứa file nhị phân/dữ liệu lớn và artefact (`brandflow.db`, `chroma_db`, `*.pyc`, log, PDF/XLSX) — nên dọn khỏi git.
6. `Dockerfile`/`README` còn ghi Python 3.9+/LLaMA; thực tế chạy 3.11 với Gemini + Groq. `README` mô tả "5 giai đoạn" trong khi workspace UI có 6 giai đoạn.
7. Celery worker hiện là mô phỏng (`execute_heavy_ai_plan` chưa gọi pipeline thật).
8. Tài khoản 2FA có cột trong DB nhưng chưa thấy luồng xác thực tương ứng trong route auth.
9. Data Foundry mới (chưa commit): cần test hồi quy với `tests/test_digitization.py` trước khi release.

> Mục 10 là quan sát từ đọc code, chưa kiểm chứng bằng chạy hệ thống.

### 10.1 Trạng thái xử lý (2026-10-19)

| # | Kết quả | Ở đâu |
|---|---|---|
| 1 | ✅ Quota/usage/plan registry lưu bảng `kv_store` (DB), cập nhật nguyên tử; dọn bộ đếm cũ lúc startup | `app/core/persistent_store.py`, `app/core/quota.py`, migration `7a1c2d3e4f50` |
| 2 | ✅ CORS không còn mặc định `*`: localhost:3000 + domain Vercel production (+ preview); `*` chỉ khi đặt tường minh và khi đó tắt credentials | `main.py` `resolve_cors_settings` |
| 3 | ✅ `main.py` còn ~170 dòng; route tách sang `app/api/{system,account,audit,planning,onboarding_ingest}_routes.py`. Đã đối chiếu: 97/97 endpoint vẫn do đúng handler cũ xử lý | `main.py`, `app/api/` |
| 4 | ✅ Gỡ `b3-action`, `b5-contingency`, `b7-gantt`, `c2-matrix` (trang demo trống), redirect 308 về trang chính. Sửa luôn lỗi sidebar B2B ẩn B.4/C.2/C.3 khi có Industry Advisor | `frontend/next.config.ts`, `industry_models.py` |
| 5 | ✅ Bỏ theo dõi git (giữ file local): `*.pyc`, `brandflow.db`, `audit/visitor_audit.db` (4.599 lượt truy cập thật), `chroma_db`, log, `outputs/`, `video/build/`, báo cáo Playwright… Lịch sử git cũ vẫn còn các file này | `.gitignore` |
| 6 | ✅ README: Python 3.11, Gemini + Groq, 7 bước UI; Dockerfile/docker-compose dùng `WEB_CONCURRENCY` (mặc định 1, vì DuckDB 1 writer/file); thêm `.env.example` | `README.md`, `Dockerfile`, `docker-compose.yml` |
| 7 | ✅ `execute_heavy_ai_plan` gọi pipeline thật qua `run_plan_job` (đọc plan intent từ DB, kèm số liệu Kho Dữ liệu); dispatch kiểm tra plan tồn tại + chủ sở hữu, trả 503 khi chưa có Redis | `app/workflows/async_plan.py`, `app/core/celery_worker.py` |
| 8 | ✅ 2FA TOTP (RFC 6238): `/api/v1/auth/2fa/{status,setup,enable,disable}`, đăng nhập email/social đòi `otp_code` khi bật, chống dùng lại mã, khóa 15 phút sau 5 lần sai; UI ở Settings + bước nhập mã ở Login | `app/core/totp.py`, `auth_routes.py`, `TwoFactorCard.tsx` |
| 9 | ✅ `tests/test_digitization.py` + `tests/test_tech_debt.py` chạy cùng toàn bộ suite: 185 đạt (1 lỗi môi trường: máy dev thiếu ChromaDB) | `tests/` |

Phát hiện thêm khi xử lý (đã sửa): đăng ký/đăng nhập bằng email `admin@brandflow.ai` tự thành admin (email không xác minh) → đã bỏ, admin tạo bằng `create_admin.py` (đọc từ biến môi trường, không còn mật khẩu viết cứng); endpoint compliance từng báo `mfa_enforced: true` → nay `mfa_available: true, mfa_enforced: false`.

Còn mở: token đăng nhập giả `mock_google_token`/`mock_facebook_token` vẫn được backend chấp nhận ở production; tài khoản admin/demo viết cứng ở `frontend/src/app/login/page.tsx`; sách PDF bản quyền trong `docs/` và `frontend/public/docs/`; secret 2FA lưu dạng rõ trong DB.
