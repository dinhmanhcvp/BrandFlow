# Đề xuất: BrandFlow Data Foundry — Số hóa dữ liệu SME cho Agentic AI

> Ngày: 2026-10-15 · Trạng thái: P0 đã triển khai (commit `6aaecae`); P1 đã triển khai (`app/services/digitization/`); P2–P4 là đề xuất

## 1. Bài toán

SME Việt Nam có hàng trăm file Excel, mỗi file hàng nghìn dòng: doanh số, khách hàng, điểm bán, ngân sách, kế hoạch… Dữ liệu này **có tồn tại nhưng chưa "số hóa"** theo nghĩa máy hiểu được:

- Không có schema chung: cùng là "doanh thu" nhưng mỗi file đặt tên cột khác, đơn vị khác (đồng / triệu / tỷ).
- Excel "trình bày cho người đọc": tiêu đề không nằm ở dòng 1, header 2–3 tầng, merge cell, dòng tổng xen giữa, ghi chú, sheet trống, sheet trùng lặp.
- Không có quan hệ: khách hàng ở file A không nối được với đơn hàng ở file B.
- Không có lịch sử phiên bản: `plan_v2_final_FINAL.xlsx`.

**Mục tiêu:** biến đống file đó thành một **kho dữ liệu có cấu trúc + danh mục ngữ nghĩa**, để các agent của BrandFlow *truy vấn* dữ liệu thay vì *đọc* dữ liệu.

## 2. Hiện trạng trong code (tại sao cách hiện tại không scale)

Luồng hiện tại cho Excel: `POST /api/v1/onboarding/upload` → `DocumentIngestor._parse_excel` → text → chunk 1000 ký tự → ChromaDB, và cắt 10.000 ký tự đưa cho LLM.

| Vị trí | Vấn đề | Hệ quả |
|---|---|---|
| [document_processor.py](../app/services/document_processor.py) `_parse_excel` | `df.head(500).to_string()` | File 5.000 dòng **mất 90% dữ liệu** một cách im lặng |
| `_parse_excel` | `xl.parse(sheet)` mặc định header = dòng 1 | Sheet có tiêu đề/merge cell → cột `Unnamed: 0..n`, header sai |
| `process_and_store_text` | Bảng số → text → `RecursiveCharacterTextSplitter(1000)` → embedding | Một dòng bị cắt đôi giữa 2 chunk; vector search **không thể cộng, lọc, group by** |
| [main.py](../main.py) `onboarding_upload` | `raw_text_for_ai[:10000]` mỗi file | 100 file × 10k ký tự vẫn vượt context, và mỗi file chỉ thấy phần đầu |
| [memory_rag.py](../app/services/memory_rag.py) `_smart_truncate_document` | >50k ký tự → tóm tắt tối đa 10 chunk | Tóm tắt bảng số = LLM tự "làm tròn"/bịa số → trái với triết lý "Python Math Engine" của chính BrandFlow |
| `onboarding_upload` | "Zero-Data Retention": xóa file ngay sau khi parse | Không thể re-process, không có lineage, không truy ngược nguồn số liệu |
| [data_analyzer.py](../app/services/data_analyzer.py) | Chỉ thống kê mean/max/min trên 1 CSV | Đúng hướng (pandas tính, LLM diễn giải) nhưng chưa được nối vào pipeline |
| `onboarding_upload` | `tenant_id` nhận từ Form client gửi lên | Rủi ro bảo mật: client tự chọn tenant → đọc/ghi kho của tenant khác. Phải lấy từ JWT |

> P0 (commit `6aaecae`) đã sửa: `head(500)`, embed bảng số, `tenant_id` từ client, file trùng, và route `/upload` trùng trong `onboarding_routes.py` từng che bản ở `main.py`. Giới hạn 10.000 ký tự/file và cột `Unnamed` vẫn còn — thuộc P1.

**Bằng chứng từ dữ liệu thật** — `docs/MKT PLAN BAO NGOC IMC PLAN 5 THÁNG.N5.xlsx`:

- 21 sheet, trong đó **5 sheet rỗng** (Trade MKT, Brand Mkt, PR Plan, Product Plan, COMBINE PLAN), `Sheet1` là bản nháp trùng `MASTER PLAN`.
- **303 merge cell**, ví dụ `CL tích hợp` có 74 merge / 52 ô có dữ liệu; `5W1H PLAN` có 70 merge.
- **505 ô công thức** — logic tính ngân sách nằm trong công thức, không nằm trong giá trị.
- Header nhiều tầng: `KPI& CRT%` dòng 2 = `ATTENTION`, dòng 3 = `% | Số lượng`.
- Dạng form key–value: `MASTER PLAN` có `Trình cho: | Chủ tịch HĐQT`, `Campaign: | Q4.2021`.
- Số tiền dạng float `37676000000`, phần trăm `0.075`, dải `"10 - 25 tỷ"`, `"15 - 35"` người (file 70 DN).
- Cùng một file xuất hiện **2 lần** trong `docs/` với tên khác nhau chỉ ở chuẩn hóa Unicode (NFC vs NFD) — chuyện rất phổ biến khi file đi qua macOS/Zalo.

→ Kết luận: **vấn đề không phải "AI chưa đủ thông minh", mà là đưa sai dạng dữ liệu cho AI.** Bảng số phải được đưa vào database, LLM chỉ cần hiểu *cấu trúc* và *ý nghĩa*.

## 3. Nguyên tắc thiết kế: "Toán học làm chủ, AI làm thuê"

Không bao giờ nhồi Excel thô vào LLM. Đây là điều kiện sống còn để đạt **mục tiêu** chi phí mỗi lượt truy vấn (COGS) < 10.000 VNĐ và biên lợi nhuận gộp > 90% (mục tiêu kinh doanh — phải đo trên golden set, xem §7).

| Tiêu chí | LLM / thủ công truyền thống | Agentic ETL của BrandFlow |
|---|---|---|
| Đầu vào | Bắt SME nhập lại theo mẫu, hoặc nhồi file thô vào LLM | Kéo thả nguyên thư mục hàng trăm file Excel lộn xộn, gộp ô, viết tắt |
| Đọc hiểu | Đọc hàng vạn dòng → tràn context, tốn API | Code làm sạch trước; LLM chỉ đọc header + vài dòng mẫu + thống kê cột |
| Tính toán | LLM tự suy luận số → "ảo giác toán học" | Python (Pandas/Polars) + SQL trên DuckDB, kiểm duyệt bằng Pydantic |
| Thời gian & chi phí | 3–5 ngày làm thủ công hoặc phí API lớn | Truy vấn trên DB phân tích; LLM chỉ được gọi theo số *template*, không theo số dòng |

1. **LLM đọc cấu trúc, code đọc dữ liệu.** LLM chỉ làm ngữ nghĩa ("phiên dịch" tên cột, sinh truy vấn); lọc, gom nhóm, cộng trừ, kiểm ngân sách đều chạy deterministic. LLM chỉ nhìn header + 5–20 dòng mẫu **đã làm sạch** + thống kê cột. 1 triệu dòng hay 100 dòng thì chi phí LLM như nhau.
   - *Lưu ý:* "header + 5 dòng đầu" chỉ đúng **sau** Structure Detection. Với file thô như Bảo Ngọc, 5 dòng đầu là tiêu đề trang trí và cột `Unnamed`; 5 dòng cũng không đủ để đoán đơn vị đ/tr/tỷ — vì vậy luôn gửi kèm profile cột.
2. **Một lần hiểu, áp dụng nhiều lần (Recipe).** SME thường dùng lại một template Excel mỗi tháng. 120 file báo cáo bán hàng hằng tháng = 1 lần map schema + 119 lần áp dụng deterministic.
3. **Không mất dữ liệu im lặng.** Mọi dòng bị loại phải có lý do và được ghi lại.
4. **Mọi con số có nguồn gốc (lineage).** Agent trả lời "Doanh thu Q3 = 12,4 tỷ" phải chỉ ra được file → sheet → vùng ô.
5. **Human-in-the-loop ở chỗ rẻ nhất.** Chủ DN xác nhận *mapping* (vài phút), không phải sửa *dữ liệu* (vài ngày).
6. **Mở rộng đúng triết lý hiện có**: BrandFlow đã có `math_engine.py` để "cắt đứt ảo giác toán học". Data Foundry là bước tiếp theo: cắt đứt ảo giác *dữ liệu*.

## 4. Kiến trúc đề xuất

```
 Upload hàng loạt (zip/folder/Google Drive)  ─┐
 Connector (Google Sheets, KiotViet, Sapo,    ├─► [1] INGEST & FINGERPRINT
  MISA, Haravan, Pancake...)                  ─┘        │  hash nội dung, NFC tên file, phát hiện bản trùng/phiên bản
                                                        ▼
                                              [2] STRUCTURE DETECTION  (deterministic, không LLM)
                                                 unmerge+fill, tìm "đảo dữ liệu", header nhiều tầng,
                                                 dòng tổng, khối key-value, sheet rỗng; giữ công thức
                                                        ▼
                                              [3] PROFILING  (deterministic)
                                                 kiểu dữ liệu, % null, unique, min/max, mẫu giá trị,
                                                 đoán đơn vị (đ/tr/tỷ/%), định dạng ngày VN
                                                        ▼
                                              [4] SEMANTIC MAPPING  (LLM — chỉ trên header + mẫu + profile)
                                                 phân loại bảng → map cột vào Canonical Data Model
                                                 → sinh MAPPING RECIPE (JSON) + điểm tin cậy
                                                        ▼
                                              [5] HUMAN REVIEW  ("Hộp thư dữ liệu")
                                                 chỉ hiện mapping có độ tin cậy thấp; xác nhận 1 lần/template
                                                        ▼
                                              [6] TRANSFORM & LOAD  (deterministic, áp recipe cho toàn bộ dòng)
                                                 chuẩn hóa số/ngày/đơn vị VN, unpivot tháng, entity resolution
                                                        ▼
                    ┌───────────────────────────────────┴────────────────────────────┐
             [7a] WAREHOUSE per-tenant                                     [7b] DATA CATALOG
             raw → staging → canonical tables                              mô tả bảng/cột, đơn vị, lineage,
             (DuckDB/Parquet cho MVP, Postgres prod)                       metric definitions, Data Brief
                    └───────────────────────────────────┬────────────────────────────┘
                                                        ▼
                                              [8] AGENT DATA TOOLS
                                                 list_tables · describe_table · query_sql (read-only)
                                                 get_metric · trace_lineage · search_docs (chỉ cho văn bản)
                                                        ▼
                                  CMO / CFO / CRM / Media Buyer / Agile agents (đã có)
```

**Đối chiếu với mô hình "Agentic ETL 3 tầng":**

| Tầng | Bước trong sơ đồ | Vai trò |
|---|---|---|
| **Tầng 1 — Schema Discovery & Un-messing** | [1]–[5] | Python/openpyxl gỡ merge, bỏ dòng trống/tiêu đề trang trí; LLM ánh xạ cột tùy tiện ("Khách", "SĐT", "Đơn tháng 1", "T.Tiền", "Doanh thu thuần") về bộ khung chuẩn (`customer_name`, `phone`, `revenue`…) |
| **Tầng 2 — In-memory OLAP (DuckDB/Parquet)** | [6]–[8] | Nạp dữ liệu chuẩn hóa; agent truy vấn bằng metric/SQL; nén thành JSON chỉ số đã kiểm chứng qua Logic Firewall |
| **Tầng 3 — Hợp nhất tri thức (Brand DNA)** | sau [8] | Insight có lineage + dữ liệu cào từ website/fanpage (scraper hiện có) → Brand DNA cho CMO/CFO/Persona |

### 4.1. Structure Detection — trái tim của bài toán "Excel bẩn"

Thuật toán deterministic, chạy bằng `openpyxl` (không qua pandas để không mất merge cell và công thức):

1. **Unmerge & fill**: merge cell ngang trong vùng header → nhân giá trị sang các cột (`ATTENTION` → `ATTENTION.%`, `ATTENTION.Số lượng`). Merge dọc ở cột nhãn → fill-down.
2. **Tìm "đảo dữ liệu" (table islands)**: coi sheet là lưới, tìm các vùng chữ nhật liên thông có mật độ ô ≥ ngưỡng, tách nhau bởi ≥ 2 dòng/cột trống. Một sheet có thể có nhiều bảng (`BUDGET` mở đầu bằng bảng "Doanh số" 8 dòng nhưng sheet dài 62 dòng — phần dưới là các bảng khác).
3. **Xác định header**: dòng đầu đảo mà phần lớn là text trong khi các dòng dưới phần lớn là số/ngày; gộp 1–3 dòng header liên tiếp.
4. **Phân loại vùng**:
   - `TABLE` — bảng giao dịch/danh sách (70 DN, khảo sát, phân loại điểm bán).
   - `KEY_VALUE` — dạng form "Nhãn: | Giá trị" (đầu `MASTER PLAN`).
   - `MATRIX` — tháng/kênh trải ngang thành cột (kế hoạch ngân sách, Gantt) → sẽ *unpivot*.
   - `HIERARCHY` — cột STT kiểu `1, 1.1, 1.2, 2` (KPI& CRT%) → giữ quan hệ cha–con, tránh cộng trùng dòng tổng.
   - `NOTE` — đoạn văn tự do → đưa sang vector store như hiện tại.
5. **Phát hiện dòng tổng**: chứa "Tổng/Total/Cộng" hoặc bằng tổng các dòng trên (kiểm tra bằng số) → gắn cờ `is_subtotal`, không load như dòng dữ liệu.
6. **Giữ công thức**: đọc 2 lần (`data_only=True/False`) để lưu cả giá trị lẫn công thức → agent biết "BUDGET = INCOME × %BUDGET" là quy tắc kinh doanh, có thể dùng lại khi lập kế hoạch.
7. **Bỏ qua** sheet rỗng và sheet trùng (so khớp fingerprint vùng dữ liệu).

### 4.2. Canonical Data Model (CDM) cho SME

Không cố mô hình hóa mọi thứ — chọn ~10 thực thể phục vụ trực tiếp các agent marketing/kinh doanh của BrandFlow:

| Thực thể | Cột chuẩn chính | Agent dùng |
|---|---|---|
| `customer` | customer_id, name, phone, email, province, segment, first_purchase_at | CRM, Persona |
| `product` | sku, name, category, unit_price, unit_cost | CMO (4P), CFO |
| `sales_line` | date, order_id, customer_id, sku, qty, revenue, discount, channel, store_id | Math Engine, CFO, Gap Analysis |
| `store_outlet` | store_id, name, type (GT/MT), region, tier | Trade MKT |
| `marketing_spend` | date, channel, campaign, amount, impressions, clicks, leads | Media Buyer, Agile |
| `budget_plan` | period, category, line_item, planned_amount, actual_amount | Phase 4 Budgeting, CFO |
| `kpi_target` | period, metric, target, actual, unit | Agile Optimizer |
| `expense` | date, category, amount, vendor | CFO |
| `survey_response` | respondent, question, answer, submitted_at | Research |
| `org_profile` (key-value) | các cặp thuộc tính DN | Intake, Brand DNA |

Cột không map được → giữ nguyên trong cột `extra JSONB`, **không vứt**. Bảng không khớp thực thể nào → tạo "custom table" vẫn truy vấn được, chỉ không có metric chuẩn.

### 4.3. Mapping Recipe — cách xử lý "hàng trăm file"

LLM (model Flash rẻ nhất hiện hành — không ghi cứng phiên bản; code hiện dùng `gemini-2.5-flash`) nhận một gói nhỏ (~2–4k token) cho mỗi bảng:

```json
{
  "sheet": "BUDGET", "region": "B3:I12", "header_rows": 1,
  "columns": [
    {"name": "Ngành", "type": "text", "unique": 8, "samples": ["Bánh tươi truyền thống", "Bánh Waffles Kis"]},
    {"name": "INCOME", "type": "number", "min": 1.1e10, "max": 3.8e10, "unit_guess": "VND"},
    {"name": "% BUDGET", "type": "number", "min": 0.06, "max": 0.1, "unit_guess": "ratio"}
  ]
}
```

và trả về recipe:

```json
{
  "recipe_id": "rcp_budget_by_category_v1",
  "header_signature": "sha1(TT|Ngành|Target|INCOME|% BUDGET|BUDGET|Ghi chú)",
  "target_entity": "budget_plan",
  "column_map": {
    "Ngành": "category", "Target": "target_revenue", "INCOME": "planned_revenue",
    "% BUDGET": {"to": "budget_ratio", "transform": "ratio"},
    "BUDGET": {"to": "planned_amount", "unit": "VND"}
  },
  "row_rules": {"drop_if": "is_subtotal", "hierarchy_col": "TT"},
  "confidence": 0.86
}
```

- Recipe được lưu theo `header_signature`. File tháng sau cùng template → khớp signature → áp dụng ngay, **0 lần gọi LLM**.
- Recipe là JSON khai báo, **không phải code LLM sinh ra** → an toàn, kiểm thử được, người dùng sửa được trên UI.

**Ước lượng chi phí** cho 1 SME: 300 file × ~4 bảng = 1.200 bảng; giả sử ~40 template khác nhau → ~40–100 lần gọi LLM × 4k token ≈ **0,2–0,4 triệu token** (vài nghìn đồng với Gemini Flash). So với nhồi 1,5 triệu dòng vào context: không khả thi.

### 4.4. Chuẩn hóa dữ liệu tiếng Việt (deterministic, thư viện riêng `normalizers_vi`)

- Số: `1.200.000`, `1,2 tỷ`, `500tr`, `37676000000`, `(1.000)` → số âm.
- Dải: `"10 - 25 tỷ"`, `"15 - 35"` → `min`, `max`, `mid`.
- Ngày: `dd/mm/yyyy`, serial Excel, `"tháng 9"`, `"Q4.2021"` → `date`/`period`.
- Unicode NFC cho tên file, tên cột, giá trị; bỏ dấu để so khớp mờ.
- SĐT VN (`+84`, `0`, đầu số cũ 11 số → mới 10 số), email, tỉnh/thành (kể cả tên sau sáp nhập).
- **Entity resolution**: "Cty TNHH Bánh Bảo Ngọc" ≈ "Bảo Ngọc Bakery" ≈ "BAO NGOC" → khóa chung. Fuzzy match trước; chỉ những cặp mơ hồ mới hỏi LLM; cặp vẫn mơ hồ → đưa lên Hộp thư để người dùng chọn.

### 4.5. Kiểm soát chất lượng & Data Readiness Score

Mỗi bảng canonical có bộ luật kiểm tra (không âm, ngày hợp lệ, tổng con = dòng tổng gốc, khóa ngoại tồn tại…). Kết quả gộp thành **Data Readiness Score** cho từng DN:

- Độ phủ (thực thể nào đã có dữ liệu), độ sạch (% dòng pass), độ liên kết (% sales_line nối được customer/product), độ mới (dữ liệu gần nhất).
- Hiển thị ngay sau onboarding: *"Bạn có 2,1 triệu dòng dữ liệu, 78% đã chuẩn hóa. Thiếu dữ liệu chi phí marketing → Media Buyer agent đang chạy ở chế độ giả định."*

Đây đồng thời là **hook bán hàng**: SME thấy giá trị ngay trước khi dùng tính năng lập kế hoạch.

### 4.6. Agent truy cập dữ liệu như thế nào

Thay `raw_text_for_ai[:10000]` bằng 2 thứ:

**(a) Data Brief** (~1–2k token, sinh tự động từ catalog, inject vào system prompt mọi agent):

```
Kho dữ liệu của Bảo Ngọc (cập nhật 2026-10-14):
- sales_line: 1.284.512 dòng, 01/2022 → 09/2026, 8 ngành hàng, 15.000 điểm bán
- budget_plan: Q4.2021, 8 hạng mục, tổng 6,3 tỷ
- store_outlet: 15.000 điểm (GT 72%, MT 28%), 63 tỉnh
- Chưa có: marketing_spend, customer (chỉ có cấp điểm bán)
Metric sẵn có: revenue, gross_margin, budget_ratio, revenue_by_channel...
```

**(b) Bộ tool cho agent** (LangGraph tool-calling, đặt trong `app/agents/tools/data_tools.py`):

| Tool | Mô tả | Rào chắn |
|---|---|---|
| `list_tables()` / `describe_table(name)` | Đọc catalog | — |
| `get_metric(name, filters, group_by, period)` | Metric đã định nghĩa sẵn (semantic layer) — **ưu tiên dùng** | Định nghĩa do người, không do LLM |
| `query_sql(sql)` | Text-to-SQL cho câu hỏi ngoài metric | Read-only, chỉ schema tenant, timeout, LIMIT bắt buộc, kết quả > 200 dòng thì trả tóm tắt |
| `trace_lineage(value_ref)` | File/sheet/ô gốc của một con số | — |
| `search_docs(query)` | Vector search — **chỉ cho văn bản** (DOCX/PDF, cột ghi chú) | Như hiện tại |

Ví dụ: CMO agent hỏi *"Kênh nào tăng trưởng doanh thu nhanh nhất 6 tháng qua?"* → gọi `get_metric("revenue", group_by=["channel","month"], period="last_6m")` → DuckDB trả 30 dòng → `math_engine` tính tăng trưởng → LLM diễn giải. Không có con số nào do LLM tự "đọc" ra.

Với Business Analyst Agent (#0) và CFO Agent (#2, chạy trên Groq để phản hồi nhanh), `query_sql` cho phép câu hỏi tự do kiểu `SELECT product_name, SUM(revenue) FROM sales_line GROUP BY 1 ORDER BY 2 DESC LIMIT 5`, nhưng **không để model tự do**: chỉ đọc, chỉ schema của tenant, timeout, `LIMIT` bắt buộc; câu hỏi lặp lại nhiều lần thì nâng thành metric định nghĩa sẵn.

### 4.7. Logic Firewall — nén dữ liệu thành chỉ số đã kiểm chứng

Hàng trăm nghìn dòng được nén thành một **JSON chỉ số deterministic** nhỏ gọn (top 5 sản phẩm tạo 80% doanh thu, tỷ lệ khách quay lại, tháng quảng cáo lỗ nặng nhất…). Mọi JSON trước khi tới agent hoặc Brand DNA phải qua "trạm kiểm lâm" Python + Pydantic, mở rộng `math_engine.py` hiện có:

- Ràng buộc toàn vẹn: `sum(item_cost) <= total_budget`, tổng con = dòng tổng gốc, tỷ lệ trong [0, 1].
- Trường bắt buộc cho mỗi đề xuất ngân sách: `expected_cac`, `breakeven_point`, `cut_loss_condition`.
- Vi phạm → trả lỗi có cấu trúc cho agent để sửa, không âm thầm "làm tròn".

### 4.8. Tầng 3 — Brand DNA từ dữ liệu nội tại

- Insight đã qua Logic Firewall được Business Analyst Agent (#0) hợp nhất với dữ liệu cào từ website/fanpage của DN và đối thủ (`scraper.py`), lưu vào Brand DNA (ChromaDB hiện có; Knowledge Graph như LightRAG là tùy chọn ở P3+).
- **Lưu insight, không lưu bảng số**, và mỗi insight mang lineage + thời điểm tính. Bản tóm tắt trong Brand DNA chỉ là *ngữ cảnh khởi đầu*; khi cần số mới nhất, agent gọi lại `get_metric` thay vì tin bản tóm tắt cũ.
- Nhờ đó CMO/CFO/Persona Validator hiểu DN từ gốc (sản phẩm nào biên cao nhất, mặt hàng nào tồn kho) thay vì chỉ nội dung bề nổi trên mạng xã hội.

### 4.9. Trải nghiệm người dùng — triết lý "Hộp kính" (Glass Box)

SME ngại ERP bắt nhập lại theo mẫu. Nguyên tắc: không bắt viết prompt, không bắt sửa bảng, luôn cho thấy hệ thống đang làm gì.

- **Smart Data Dropzone:** kéo thả cả thư mục (`<input webkitdirectory>` + drag-drop folder) hoặc file zip. Upload theo lô, tiếp tục được nếu rớt mạng.
- **Data Health Check:** màn hình tiến độ theo thời gian thực từ job Celery: *"Đã nhận diện 42 file Bán hàng, 18 file Chi phí Marketing, 12 file Tồn kho. Đã chuẩn hóa 145.000 dòng. 3 file cần bạn xác nhận."* (con số minh họa). Gắn với Data Readiness Score (§4.5).
- **Human-in-the-loop 1 chạm:** cột mơ hồ không làm dừng pipeline. Hệ thống hỏi một câu trắc nghiệm: *"Cột 'ABC' trong `Tháng_3.xlsx` có phải là 'Chiết khấu đại lý' không?"* → bấm "Đúng" → cập nhật Mapping Recipe → áp dụng cho mọi file cùng template.

### 4.10. Hạ tầng chịu tải & bảo mật đa khách hàng

- **Bất đồng bộ:** quét file + gọi LLM chạy trong Celery + Redis (`app/core/celery_worker.py` đã có), web server chỉ nhận file và trả `job_id`.
- **Circuit breaker:** LLM lỗi/quá hạn mức → tự chuyển sang model dự phòng (Groq ↔ Gemini, hoặc Ollama cục bộ). Vì LLM chỉ dùng cho mapping, khi tất cả model đều hỏng pipeline vẫn chạy được với recipe đã có và đẩy bảng mới vào hàng chờ HITL.
- **Cách ly tenant:**
  - Postgres (prod): schema hoặc bảng có `tenant_id` + **Row-Level Security**; session DB đặt `app.tenant_id` từ JWT.
  - DuckDB (MVP): mỗi tenant một file `.duckdb`/thư mục Parquet riêng — DuckDB không có RLS.
  - Điều kiện tiên quyết cho cả hai: tenant chỉ lấy từ JWT (đã làm ở P0).

## 5. Tích hợp vào codebase hiện tại

```
app/
  services/digitization/            # MỚI
    workbook_reader.py              # openpyxl: giá trị + công thức + merge
    structure_detector.py           # islands, header, KV, matrix, subtotal
    profiler.py                     # thống kê cột, đoán kiểu/đơn vị
    normalizers_vi.py               # số, ngày, dải, SĐT, tỉnh, NFC
    schema_mapper.py                # LLM → MappingRecipe (Pydantic, structured output)
    transformer.py                  # áp recipe, unpivot, entity resolution
    warehouse.py                    # DuckDB/Postgres per-tenant, raw/staging/canonical
    catalog.py                      # mô tả bảng/cột, metric, lineage, Data Brief
    quality.py                      # luật kiểm tra + Data Readiness Score
  agents/data_steward/              # MỚI — agent điều phối pipeline, hỏi người khi mơ hồ
  agents/tools/data_tools.py        # MỚI — tool cho các agent hiện có
  api/data_routes.py                # MỚI — /api/v1/data/*
  models/models.py                  # THÊM: DataSource, DataFile, SheetRegion,
                                    #       MappingRecipe, CanonicalTable, DataQualityIssue
  core/celery_worker.py             # DÙNG LẠI: job xử lý nền cho hàng trăm file
frontend/src/app/data-hub/          # MỚI — upload hàng loạt, tiến độ, Hộp thư mapping, Readiness Score
```

Thay đổi ở code cũ:

- `DocumentIngestor.parse_file`: XLSX/XLS/CSV → chuyển sang `digitization` pipeline; chỉ phần `NOTE` mới đi vào ChromaDB. Bỏ `head(500)`.
- `onboarding_upload`: trả về `job_id` (Celery) thay vì xử lý đồng bộ; `extract_document_summary` nhận **Data Brief + văn bản**, không nhận text bảng.
- `tenant_id`: lấy từ JWT (`auth_routes`), không lấy từ Form.
- Chính sách lưu trữ: thay "xóa ngay" bằng "lưu file gốc mã hóa trong N ngày (cấu hình được) để re-process và lineage; dữ liệu canonical lưu đến khi DN yêu cầu xóa" — cập nhật `purge_user_data` và tài liệu SOC2 tương ứng.
- `BusinessMetric` (CAC, LTV, retention…): tính từ dữ liệu thật trong warehouse thay vì nhập tay/giả lập.
- Nhánh mock "Bếp Nhà Mộc" trong `onboarding_upload` → chuyển thành bộ dữ liệu demo đi qua đúng pipeline mới (demo thuyết phục hơn vì là pipeline thật).

**Công nghệ:** `openpyxl` (đã có), `duckdb` (nhúng, không cần server, xử lý vài triệu dòng trên laptop), `polars` hoặc `pandas` (đã có), `rapidfuzz` (entity resolution), `xlrd`/`pyxlsb` cho `.xls`/`.xlsb`. Prod: Postgres (đã có `psycopg2`, `alembic`) với schema riêng mỗi tenant, hoặc DuckDB + Parquet trên object storage.

## 6. Lộ trình

| Giai đoạn | Thời lượng | Phạm vi | Tiêu chí xong |
|---|---|---|---|
| **P0 — Sửa rò rỉ** ✅ | xong | Bỏ `head(500)`; không embed bảng số; `tenant_id` từ JWT; NFC tên file + dedupe hash; gỡ route `/upload` trùng | Không còn mất dữ liệu im lặng |
| **P1 — MVP Data Foundry** ✅ | xong | workbook_reader + structure_detector + profiler + normalizers_vi; DuckDB per-tenant; LLM mapping vào 4 thực thể (`sales_line`, `product`, `budget_plan`, `org_profile`); Data Brief; tool `describe_table` + `query_sql` cho 1 agent (CFO/Math Engine); Logic Firewall (Pydantic) cho JSON chỉ số | Upload file Bảo Ngọc → hỏi "tổng ngân sách theo ngành" ra đúng số, có lineage |
| **P2 — Recipe & HITL** | 2 tuần | Lưu recipe theo header signature; Smart Data Dropzone (kéo thả thư mục); Data Health Check; HITL 1 chạm; Data Readiness Score; xử lý nền bằng Celery cho 300+ file; circuit breaker LLM | 100 file cùng template xử lý với ≤ 1 lần gọi LLM |
| **P3 — Semantic layer & agent** | 2 tuần | Định nghĩa metric; `get_metric` cho mọi agent; entity resolution khách hàng/sản phẩm; tính `BusinessMetric` từ dữ liệu thật; insight có lineage vào Brand DNA (tùy chọn LightRAG); Postgres + RLS cho prod | CMO/CRM/Media Buyer trả lời bằng số liệu thật |
| **P4 — Connector liên tục** | liên tục | Google Sheets/Drive, KiotViet, Sapo, Haravan, MISA, Pancake, Meta/TikTok Ads | Dữ liệu tự cập nhật — số hóa không còn là việc "một lần" |

P4 quan trọng về chiến lược: nếu chỉ số hóa một lần, 3 tháng sau DN lại quay về Excel. Connector biến BrandFlow thành **nơi dữ liệu sống**, tạo lock-in và mở đường cho agent tự hành (theo dõi KPI, cảnh báo, tự đề xuất điều chỉnh ngân sách).

### 6.1. P1 đã làm gì (2026-10-15)

| Thành phần | File | Ghi chú |
|---|---|---|
| Đọc workbook (giá trị + công thức + merge) | `app/services/digitization/workbook_reader.py` | xlsx/xlsm qua openpyxl; xls/csv qua pandas (không có thông tin merge) |
| Nhận diện cấu trúc | `structure_detector.py` | vùng bảng, header 1–2 tầng, dòng Tổng/nhóm/chú thích, form key-value, ghi chú, bảng trùng giữa các sheet |
| Profile + chuẩn hóa VN | `profiler.py`, `normalizers_vi.py` | số/tỷ/triệu/%, dải "10 - 25 tỷ", ngày/kỳ, SĐT giữ số 0 đầu |
| CDM + ánh xạ | `canonical.py`, `schema_mapper.py`, `llm_json.py` | 7 thực thể; recipe cache → heuristic → LLM (circuit breaker); câu hỏi HITL cho cột mơ hồ |
| Kho per-tenant | `warehouse.py` | 1 file DuckDB/tenant; raw_* + bảng chuẩn + `_files/_tables/_recipes/_notes`; lineage tới dòng Excel |
| Logic Firewall | `firewall.py` | đối soát dòng Tổng/nhóm; `BudgetProposal` (tổng ≤ ngân sách, CAC, hòa vốn, cắt lỗ) |
| Tool cho agent | `query_tools.py` | `list_tables`, `describe_table`, `get_metric`, `query_sql` (read-only, chặn file ngoài, timeout, LIMIT), `trace_lineage` |
| Data Brief + Readiness | `data_brief.py` | insight tính bằng SQL; điểm 0–100 |
| Business Analyst Agent #0 | `app/agents/analytics/data_analyst_agent.py` | LLM chọn metric/SQL → DuckDB tính → LLM diễn giải; tự sửa SQL lỗi 1 lần |
| API | `app/api/data_routes.py` | `/api/v1/data/{upload,files,tables,query,metric,metrics,brief,questions,recipes/{id}/confirm,lineage,ask,validate-budget}` |
| Nối onboarding | `main.py` `/api/v1/onboarding/upload` | Excel/CSV của user đăng nhập → số hóa; AI nhận Data Brief + tóm tắt thay vì text bảng |

Kết quả đo được (máy dev, chưa có LLM thật — ánh xạ chạy bằng heuristic):
- File Bảo Ngọc (21 sheet): ~1,3 giây; 5 sheet trống và bảng copy `BUDGET!B2:H11` được bỏ qua; tổng ngân sách `PA Q4.2021` = 6.551.207.818,75 và `KPI& CRT%` = 7.034.368.817,25 — khớp dòng Total trong Excel.
- 3 file bán hàng × 3.000 dòng: ~1 giây/file; file 2 và 3 dùng lại recipe (0 lần gọi LLM); tổng doanh thu khớp tuyệt đối.
- Chưa làm (P2+): UI Dropzone/Health Check/HITL, Celery cho upload lớn, entity resolution, connector, Postgres + RLS.

## 7. Đánh giá & rủi ro

**Bộ đo (golden set)** — mở rộng `data/MKT-Bench-2026_Golden_Set.json`:
- 30–50 file Excel SME thật (ẩn danh) + đáp án: vùng bảng đúng, mapping đúng, 20 câu hỏi số liệu có đáp án.
- Chỉ số: độ chính xác phát hiện bảng, độ chính xác mapping cột, % câu hỏi trả lời đúng số, số lần gọi LLM / 100 file.

**Rủi ro:**

| Rủi ro | Giảm thiểu |
|---|---|
| Mapping sai → agent kết luận sai với vẻ tự tin | Confidence threshold + HITL; lineage hiển thị cạnh mọi con số; dòng tổng gốc dùng để đối soát |
| Text-to-SQL sinh truy vấn sai | Ưu tiên `get_metric`; SQL read-only có kiểm tra; với câu hỏi quan trọng, chạy 2 cách và so khớp |
| Dữ liệu nhạy cảm (SĐT, email khách hàng) | Mã hóa cột PII, che khi đưa vào prompt (agent chỉ thấy aggregate), schema riêng per tenant, audit log đã có |
| Excel quá đặc thù (dashboard, biểu đồ) | Không ép: phân loại `NOTE`/`UNSTRUCTURED`, đưa vector store, báo cho người dùng |
| SME không có thời gian review | Chỉ hỏi khi confidence thấp; câu hỏi dạng chọn 1 trong 3, không bắt sửa bảng |
| Con số marketing chưa đo ("5 giây", "uptime 99.9%", "COGS < 10.000 VNĐ", "triệu dòng trong mili-giây") bị nhà đầu tư/khách hàng chất vấn | Đo trên golden set trước khi đưa vào pitch; đến lúc đó ghi rõ là **mục tiêu** |
