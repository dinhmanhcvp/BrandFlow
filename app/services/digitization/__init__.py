"""
BrandFlow Data Foundry — số hóa Excel/CSV của SME thành kho dữ liệu truy vấn được.

Nguyên tắc: "Toán học làm chủ, AI làm thuê".
 • Code (openpyxl/pandas/DuckDB) đọc, làm sạch, tính toán TOÀN BỘ dữ liệu.
 • LLM chỉ nhìn header + vài dòng mẫu đã làm sạch + thống kê cột để ánh xạ ngữ nghĩa.

Luồng: workbook_reader → structure_detector → profiler → schema_mapper (recipe)
     → warehouse (raw + canonical, DuckDB per-tenant) → query_tools / data_brief.
"""
