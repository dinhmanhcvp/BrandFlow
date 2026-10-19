"""Data Foundry — số hóa Excel/CSV của SME (không gọi LLM; LLM bị tắt qua env)."""

import datetime as dt
import hashlib
import os
import random

import pytest

openpyxl = pytest.importorskip("openpyxl")
pytest.importorskip("duckdb")

from app.services.digitization import query_tools as qt  # noqa: E402
from app.services.digitization import warehouse as wh  # noqa: E402
from app.services.digitization.data_brief import build_data_brief  # noqa: E402
from app.services.digitization.firewall import validate_budget_proposal  # noqa: E402
from app.services.digitization.normalizers_vi import (  # noqa: E402
  normalize_phone, parse_date, parse_number, parse_period, parse_range,
)
from app.services.digitization.pipeline import digitize_file, remap_recipe  # noqa: E402
from app.services.digitization.structure_detector import detect_workbook  # noqa: E402
from app.services.digitization.workbook_reader import read_workbook  # noqa: E402

BAO_NGOC = os.path.join("docs", "MKT PLAN BAO NGOC IMC PLAN 5 THÁNG.N5.xlsx")


@pytest.fixture(autouse=True)
def _isolated_warehouse(tmp_path, monkeypatch):
  monkeypatch.setenv("BRANDFLOW_WAREHOUSE_DIR", str(tmp_path / "wh"))
  monkeypatch.setenv("BRANDFLOW_DISABLE_LLM_MAPPING", "1")


def _hash(path) -> str:
  with open(path, "rb") as f:
    return hashlib.sha256(f.read()).hexdigest()


def _sales_workbook(path, month: int, n: int, seed: int = 1) -> float:
  """File bán hàng kiểu SME: tiêu đề merge, 1 dòng trống, header viết tắt, dòng Tổng cộng."""
  rnd = random.Random(seed)
  wb = openpyxl.Workbook()
  ws = wb.active
  ws.title = "Bán hàng"
  ws["A1"] = f"BÁO CÁO BÁN HÀNG THÁNG {month}/2026"
  ws.merge_cells("A1:I1")
  ws.append([])
  ws.append(["Ngày", "Mã HĐ", "Khách", "SĐT", "Tên SP", "SL", "Đơn giá", "T.Tiền", "Kênh"])
  total = 0
  for i in range(n):
    qty, price = rnd.randint(1, 5), rnd.choice([45000, 120000, 350000])
    ws.append([dt.date(2026, month, rnd.randint(1, 28)).strftime("%d/%m/%Y"), f"HD{month}{i:05d}",
               f"Khách {rnd.randint(1, 50)}", f"09{rnd.randint(10000000, 99999999)}",
               rnd.choice(["Bánh mì", "Cà phê", "Combo"]), qty, price, qty * price,
               rnd.choice(["Shopee", "TikTok", "Tại quán"])])
    total += qty * price
  ws.append(["Tổng cộng", None, None, None, None, None, None, total, None])
  wb.save(path)
  return total


# ─── Chuẩn hóa ───────────────────────────────────────────────────────────────

@pytest.mark.parametrize("raw, expected", [
  ("1.200.000", 1_200_000), ("1,200,000", 1_200_000), ("1,5", 1.5), ("1.5", 1.5),
  ("1,2 tỷ", 1.2e9), ("500tr", 5e8), ("3 triệu", 3e6), ("(1.000)", -1000), ("12,5%", 0.125),
  ("1.234.567,89", 1234567.89), ("250.000 đ", 250_000), (37676000000, 37676000000), ("abc", None), (None, None),
])
def test_parse_number(raw, expected):
  assert parse_number(raw) == pytest.approx(expected) if expected is not None else parse_number(raw) is None


def test_parse_range_date_period_phone():
  assert parse_range("10 - 25 tỷ") == (1e10, 2.5e10)
  assert parse_range("15 - 35") == (15, 35)
  assert parse_range("1.200.000") is None
  assert parse_date("12/03/2025") == dt.date(2025, 3, 12)
  assert parse_date("2025-03-12") == dt.date(2025, 3, 12)
  assert parse_period("Q4.2021") == "2021-Q4"
  assert parse_period("tháng 9/2025") == "2025-09"
  assert parse_period("Tháng 10") == "M10"
  assert normalize_phone("+84 912 345 678") == "0912345678"
  assert normalize_phone(912345678.0) == "0912345678"


# ─── Nhận diện cấu trúc ──────────────────────────────────────────────────────

def test_detects_title_multirow_header_subtotal_groups_and_empty_sheets(tmp_path):
  wb = openpyxl.Workbook()
  ws = wb.active
  ws.title = "KPI"
  ws["B1"] = "Kế hoạch truyền thông Q4"
  ws["B3"], ws["C3"], ws["D3"], ws["E3"] = "NO", "KÊNH", "BUDGET", "ATTENTION"
  ws.merge_cells("E3:F3")
  ws.merge_cells("B3:B4")
  ws["E4"], ws["F4"] = "%", "Số lượng"
  rows = [("1", "VISIBILITY", 925_000_000, None, 54_000_000),
          ("1.1", "Điểm bán A", None, 0.8, 27_000_000),
          ("1.2", "Điểm bán B", None, 0.8, 27_000_000),
          ("2", "PROMOTION", 500_000_000, None, None),
          ("Total", None, 1_425_000_000, None, None)]
  for i, row in enumerate(rows, start=5):
    for j, v in enumerate(row):
      ws.cell(row=i, column=2 + j, value=v)
  wb.create_sheet("Trống")
  path = tmp_path / "kpi.xlsx"
  wb.save(path)

  tables, empty = detect_workbook(read_workbook(str(path)))
  assert empty == ["Trống"]
  table = next(t for t in tables if t.kind == "table")
  assert table.columns == ["NO", "KÊNH", "BUDGET", "ATTENTION.%", "ATTENTION.Số lượng"]
  assert table.context == ["Kế hoạch truyền thông Q4"]
  assert table.row_kinds == ["group", "data", "data", "data", "subtotal"]
  # Ô 'Số lượng' của nhóm 1 = 27tr + 27tr → ô tổng; ô BUDGET của nhóm là giá trị riêng
  assert table.aggregate_cells == {0: [4]}


# ─── Pipeline end-to-end ─────────────────────────────────────────────────────

def test_sales_files_are_digitized_exactly_and_recipe_is_reused(tmp_path):
  totals, reports = [], []
  for month in (7, 8, 9):
    path = tmp_path / f"ban_hang_T{month}.xlsx"
    totals.append(_sales_workbook(path, month, 1500, seed=month))
    reports.append(digitize_file("shop", str(path), path.name, _hash(path)))

  assert [r["tables"][0]["entity"] for r in reports] == ["sales_line"] * 3
  assert [r["tables"][0]["recipe_source"] for r in reports] == ["heuristic", "cache", "cache"]
  assert sum(r["llm_calls"] for r in reports) == 0
  assert all(r["tables"][0]["canonical_rows"] == 1500 for r in reports)
  assert reports[0]["tables"][0]["issues"] == []  # dòng 'Tổng cộng' khớp tổng các dòng

  revenue = qt.get_metric("shop", "revenue")
  assert revenue.rows[0]["value"] == pytest.approx(sum(totals))
  assert {l.file for l in revenue.lineage} == {f"ban_hang_T{m}.xlsx" for m in (7, 8, 9)}
  by_month = qt.get_metric("shop", "revenue", group_by=["month"]).rows
  assert {r["month"]: r["value"] for r in by_month}["2026-08"] == pytest.approx(totals[1])

  phones = qt.query_sql("shop", "SELECT customer_phone FROM sales_line LIMIT 5")["rows"]
  assert all(p["customer_phone"].startswith("09") and len(p["customer_phone"]) == 10 for p in phones)

  lineage = qt.trace_lineage("shop", revenue.lineage[0].table, 4)
  assert lineage["sheet"] == "Bán hàng" and lineage["excel_row"] == 4


def test_duplicate_file_and_tenant_isolation(tmp_path):
  path = tmp_path / "ban_hang.xlsx"
  _sales_workbook(path, 9, 50)
  assert digitize_file("tenant_a", str(path), "a.xlsx", _hash(path))["status"] == "digitized"
  assert digitize_file("tenant_a", str(path), "a_copy.xlsx", _hash(path))["status"] == "duplicate"
  assert qt.get_metric("tenant_a", "revenue").rows[0]["value"] > 0
  assert qt.get_metric("tenant_b", "revenue").rows[0]["value"] is None
  assert qt.list_tables("tenant_b")["files"] == 0


def test_hitl_confirm_remaps_all_tables_with_same_template(tmp_path):
  wb = openpyxl.Workbook()
  ws = wb.active
  ws.append(["Hạng mục", "ABC", "Ghi chú"])
  ws.append(["Facebook Ads", 12_000_000, "tháng 9"])
  ws.append(["TikTok Ads", 8_000_000, "tháng 9"])
  path = tmp_path / "chi_phi.xlsx"
  wb.save(path)
  report = digitize_file("t", str(path), path.name, _hash(path))
  table = report["tables"][0]
  assert table["entity"] == "custom"  # 'ABC' tối nghĩa → không đoán bừa

  remap_recipe("t", table["recipe_id"], "marketing_spend", {"Hạng mục": "channel", "ABC": "amount"})
  assert qt.get_metric("t", "marketing_spend").rows[0]["value"] == pytest.approx(20_000_000)
  assert qt.pending_questions("t") == []


@pytest.mark.skipif(not os.path.exists(BAO_NGOC), reason="thiếu file mẫu Bảo Ngọc")
def test_bao_ngoc_messy_workbook():
  report = digitize_file("baongoc", BAO_NGOC, "baongoc.xlsx", _hash(BAO_NGOC))
  assert set(report["empty_sheets"]) == {"Trade MKT", "Brand Mkt", "PR Plan", "Product Plan", "COMBINE PLAN"}
  assert any("BUDGET!B2:H11" in d for d in report["duplicate_regions"])  # bản copy của 'PA Q4.2021'

  by_sheet = {(t["sheet"], t["range"]): t for t in report["tables"]}
  pa = by_sheet[("PA Q4.2021", "B3:H12")]
  assert pa["entity"] == "budget_plan" and pa["issues"] == []
  total = qt.query_sql("baongoc", f"SELECT SUM(planned_amount) s FROM budget_plan "
                                  f"WHERE _source_table = '{pa['table_name']}'")["rows"][0]["s"]
  assert total == pytest.approx(6_551_207_818.75, rel=1e-9)  # = dòng 'Total' trong Excel

  # KPI: ngân sách nằm ở dòng nhóm (1, 2, 3...) → vẫn được nạp; tổng = dòng Total 7.034.368.817
  kpi = by_sheet[("KPI& CRT%", "B2:P25")]
  kpi_total = qt.query_sql("baongoc", f"SELECT SUM(planned_amount) s FROM budget_plan "
                                      f"WHERE _source_table = '{kpi['table_name']}'")["rows"][0]["s"]
  assert kpi_total == pytest.approx(7_034_368_817.25, rel=1e-6)

  brief = build_data_brief("baongoc")
  assert "budget_plan" in brief["text"] and brief["readiness"]["score"] > 0


# ─── Rào chắn ────────────────────────────────────────────────────────────────

@pytest.mark.parametrize("sql", [
  "DROP TABLE sales_line", "SELECT * FROM read_csv('secret.csv')", "SELECT 1; SELECT 2",
  "SELECT 1 -- comment", "ATTACH 'other.duckdb'", "COPY sales_line TO 'out.csv'",
  "SELECT * FROM sales_line WHERE 1=1 UNION SELECT * FROM glob('*')",
])
def test_query_sql_blocks_unsafe_statements(sql):
  with pytest.raises(qt.QueryError):
    qt.query_sql("t", sql)


def test_query_sql_caps_rows(tmp_path):
  path = tmp_path / "s.xlsx"
  _sales_workbook(path, 9, 300)
  digitize_file("t", str(path), path.name, _hash(path))
  result = qt.query_sql("t", "SELECT * FROM sales_line", max_rows=10_000)
  assert result["row_count"] == qt.MAX_ROWS and result["truncated"] is True


def test_budget_firewall():
  ok = validate_budget_proposal({
    "total_budget": 100_000_000, "items": [{"item": "Ads", "cost": 60_000_000}, {"item": "KOL", "cost": 40_000_000}],
    "expected_cac": 150_000, "breakeven_point": 700, "cut_loss_condition": "CAC > 250k sau 2 tuần thì dừng",
  })
  assert ok["ok"]
  over = validate_budget_proposal({
    "total_budget": 100_000_000, "items": [{"item": "Ads", "cost": 120_000_000}],
    "expected_cac": 150_000, "breakeven_point": 700, "cut_loss_condition": "CAC > 250k thì dừng",
  })
  assert not over["ok"] and "vượt ngân sách" in over["errors"][0]["message"]
  missing = validate_budget_proposal({"total_budget": 1, "items": [{"item": "x", "cost": 1}]})
  assert {e["field"] for e in missing["errors"]} >= {"expected_cac", "breakeven_point", "cut_loss_condition"}


# ─── API ─────────────────────────────────────────────────────────────────────

def test_data_api_requires_auth_and_scopes_by_jwt_user(tmp_path):
  pytest.importorskip("fastapi")
  pytest.importorskip("jwt")
  from fastapi import FastAPI
  from fastapi.testclient import TestClient

  from app.api.auth_routes import get_current_user
  from app.api.data_routes import router

  app = FastAPI()
  app.include_router(router)
  client = TestClient(app)
  assert client.get("/api/v1/data/tables").status_code == 401

  app.dependency_overrides[get_current_user] = lambda: "api_user"
  path = tmp_path / "ban_hang.xlsx"
  total = _sales_workbook(path, 9, 200)
  with open(path, "rb") as f:
    content = f.read()
  resp = client.post("/api/v1/data/upload", files=[
    ("files", ("ban_hang.xlsx", content, "application/octet-stream")),
    ("files", ("ban_hang_copy.xlsx", content, "application/octet-stream")),
    ("files", ("ghi_chu.txt", b"hello", "text/plain")),
  ])
  body = resp.json()
  assert resp.status_code == 200
  assert (body["digitized"], body["duplicates"]) == (1, 1)
  assert body["readiness"]["score"] > 0

  metric = client.post("/api/v1/data/metric", json={"name": "revenue"}).json()
  assert metric["rows"][0]["value"] == pytest.approx(total)
  assert client.post("/api/v1/data/query", json={"sql": "DELETE FROM sales_line"}).status_code == 400
  assert client.get("/api/v1/data/tables/sales_line").json()["rows"] == 200

  app.dependency_overrides[get_current_user] = lambda: "someone_else"
  assert client.get("/api/v1/data/tables").json()["files"] == 0


# ─── Business Analyst Agent (#0) với LLM giả ────────────────────────────────

class _Msg:
  def __init__(self, content):
    self.content = content


class _FakeLLM:
  """Lần 1 trả SQL lỗi, lần 2 trả metric (bọc trong ```json), lần 3 diễn giải."""

  def __init__(self):
    self.plans, self.prompts = [], []

  def invoke(self, prompt):
    self.prompts.append(prompt)
    if "JSON Schema" not in prompt:
      return _Msg("Kênh dẫn đầu là ... (theo dữ liệu)")
    if not self.plans:
      self.plans.append("sql")
      return _Msg('{"sql": "SELECT * FROM bang_khong_ton_tai"}')
    self.plans.append("metric")
    return _Msg('```json\n{"metric": {"name": "revenue", "group_by": ["channel"]}}\n```')


def test_data_analyst_agent_queries_instead_of_reading(tmp_path):
  from app.agents.analytics.data_analyst_agent import DataAnalystAgent

  path = tmp_path / "s.xlsx"
  _sales_workbook(path, 9, 400)
  digitize_file("t", str(path), path.name, _hash(path))
  llm = _FakeLLM()
  result = DataAnalystAgent(llm=llm).answer("t", "Kênh nào bán tốt nhất?")

  assert result["status"] == "ok"
  assert llm.plans == ["sql", "metric"]
  assert "LẦN TRƯỚC LỖI" in llm.prompts[1]
  assert {r["channel"] for r in result["data"]} == {"Shopee", "TikTok", "Tại quán"}
  assert result["lineage"][0]["file"] == "s.xlsx"
  # Prompt lập kế hoạch chỉ chứa brief + schema, không chứa dữ liệu dòng (vd. mã hóa đơn)
  assert "HD9" not in llm.prompts[0]


def test_data_analyst_agent_without_data_or_llm():
  from app.agents.analytics.data_analyst_agent import DataAnalystAgent

  assert DataAnalystAgent(llm=_FakeLLM()).answer("empty", "Doanh thu?")["status"] == "no_data"


def test_data_analyst_agent_reports_llm_failure_instead_of_crashing(tmp_path):
  from app.agents.analytics.data_analyst_agent import DataAnalystAgent

  class _BrokenLLM:
    def invoke(self, prompt):
      raise RuntimeError("API key not valid")

  path = tmp_path / "s.xlsx"
  _sales_workbook(path, 9, 20)
  digitize_file("t", str(path), path.name, _hash(path))
  result = DataAnalystAgent(llm=_BrokenLLM()).answer("t", "Doanh thu?")
  assert result["status"] == "llm_error" and "API key not valid" in result["answer"]
