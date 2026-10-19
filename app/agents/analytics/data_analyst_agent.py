"""
Business Analyst Agent (#0) — trả lời câu hỏi kinh doanh bằng dữ liệu nội bộ đã số hóa.

"Toán học làm chủ, AI làm thuê":
 1. LLM đọc Data Brief + schema (không đọc dữ liệu) → chọn chỉ số định nghĩa sẵn hoặc viết 1 câu SELECT.
 2. DuckDB tính (read-only, có rào chắn) → kết quả nhỏ gọn kèm lineage.
 3. LLM diễn giải, CHỈ được dùng con số có trong kết quả.
"""

import json
import os
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.services.digitization import query_tools as qt
from app.services.digitization.canonical import ENTITIES
from app.services.digitization.data_brief import build_data_brief
from app.services.digitization.llm_json import invoke_json

MAX_ROWS_TO_LLM = 50


class _Filter(BaseModel):
  column: str
  value: str


class _MetricCall(BaseModel):
  name: str = Field(description="Tên chỉ số trong danh sách METRICS")
  group_by: List[str] = Field(default_factory=list, description="Cột nhóm, hoặc month/quarter/year")
  date_from: Optional[str] = Field(None, description="YYYY-MM-DD")
  date_to: Optional[str] = Field(None, description="YYYY-MM-DD")
  filters: List[_Filter] = Field(default_factory=list)


class _QueryPlan(BaseModel):
  metric: Optional[_MetricCall] = Field(None, description="Dùng khi câu hỏi khớp một chỉ số định nghĩa sẵn")
  sql: Optional[str] = Field(None, description="Một câu SELECT DuckDB khi không có chỉ số phù hợp")


_PLAN_PROMPT = """Bạn là Business Analyst của doanh nghiệp. Trả lời câu hỏi bằng cách TRUY VẤN kho dữ liệu, không đoán.
Ưu tiên dùng 'metric' nếu khớp; nếu không thì viết đúng MỘT câu SELECT (DuckDB SQL), có LIMIT.
Bảng budget_plan gồm nhiều phiên bản kế hoạch: khi tổng hợp, nhóm theo _source_table thay vì cộng dồn tất cả.

{brief}

CHỈ SỐ ĐỊNH NGHĨA SẴN:
{metrics}

SCHEMA:
{schema}
{error}
CÂU HỎI: {question}"""

_ANSWER_PROMPT = """Trả lời câu hỏi của chủ doanh nghiệp bằng tiếng Việt, ngắn gọn (tối đa 6 câu), đi thẳng vào kết luận.
CHỈ dùng con số có trong KẾT QUẢ bên dưới; không tự tính thêm con số mới, không bịa. Ghi rõ nguồn (file/sheet).
Nếu kết quả rỗng hoặc không đủ để trả lời, nói rõ là thiếu dữ liệu gì.

CÂU HỎI: {question}
KẾT QUẢ (đã tính bằng SQL): {result}
NGUỒN: {lineage}"""


def _schema_for_llm(tenant_id: str) -> str:
  catalog = qt.list_tables(tenant_id)
  parts = []
  for t in catalog["canonical_tables"]:
    cols = ", ".join(f"{c} ({col.type})" for c, col in ENTITIES[t["table"]].columns.items())
    parts.append(f"{t['table']} [{t['rows']} dòng]: {cols}, _source_table, _source_row, _file")
  if catalog["org_profile_rows"]:
    parts.append("org_profile: key, value, _file, _sheet")
  for t in [r for r in catalog["raw_tables"] if r["entity"] in (None, "custom")][:20]:
    parts.append(f'{t["table"]} [{t["rows"]} dòng, {t["file"]} / {t["sheet"]}] — cột gốc: '
                 + ", ".join(t["columns"][:12]) + " (tên cột SQL: xem describe_table)")
  return "\n".join(parts)


def _llm():
  if "GOOGLE_API_KEY" not in os.environ and "GEMINI_API_KEY" in os.environ:
    os.environ["GOOGLE_API_KEY"] = os.environ["GEMINI_API_KEY"]
  if not os.getenv("GOOGLE_API_KEY"):
    return None
  from langchain_google_genai import ChatGoogleGenerativeAI
  return ChatGoogleGenerativeAI(model=os.getenv("DATA_ANALYST_LLM_MODEL", "gemini-2.5-flash"),
                                temperature=0.0, max_retries=1, timeout=45.0)


class DataAnalystAgent:
  def __init__(self, llm=None):
    self.llm = llm if llm is not None else _llm()

  def _execute(self, tenant_id: str, plan: _QueryPlan) -> Dict[str, Any]:
    if plan.metric is not None:
      m = plan.metric
      result = qt.get_metric(tenant_id, m.name, m.group_by, m.date_from, m.date_to,
                             {f.column: f.value for f in m.filters})
      return {"rows": result.rows, "sql": result.sql,
              "lineage": [l.model_dump() for l in result.lineage]}
    if plan.sql:
      result = qt.query_sql(tenant_id, plan.sql)
      return {"rows": result["rows"], "sql": result["sql"], "truncated": result["truncated"], "lineage": []}
    raise qt.QueryError("Kế hoạch truy vấn rỗng")

  def answer(self, tenant_id: str, question: str) -> Dict[str, Any]:
    brief = build_data_brief(tenant_id)
    if not brief["files"]:
      return {"status": "no_data", "answer": "Chưa có dữ liệu nội bộ nào được số hóa. Hãy tải file Excel/CSV lên trước."}
    if self.llm is None:
      return {"status": "llm_unavailable", "answer": "Chưa cấu hình LLM (GOOGLE_API_KEY/GEMINI_API_KEY).",
              "brief": brief["text"]}

    metrics = json.dumps({k: v["description"] for k, v in qt.METRICS.items()}, ensure_ascii=False)
    schema = _schema_for_llm(tenant_id)
    error_note, executed, plan = "", None, None
    for _ in range(2):  # 1 lần thử lại, đưa lỗi SQL cho LLM tự sửa
      try:
        plan = invoke_json(self.llm, _PLAN_PROMPT.format(brief=brief["text"], metrics=metrics, schema=schema,
                                                         error=error_note, question=question), _QueryPlan)
      except ValueError as e:  # JSON hỏng / sai schema (pydantic.ValidationError là ValueError)
        error_note = f"\nLẦN TRƯỚC TRẢ VỀ JSON KHÔNG HỢP LỆ: {str(e)[:300]}\n"
        continue
      except Exception as e:  # lỗi gọi LLM (key sai, hết quota, timeout) — không để thành lỗi 500
        return {"status": "llm_error", "answer": f"Không gọi được LLM: {str(e)[:200]}", "brief": brief["text"]}
      try:
        executed = self._execute(tenant_id, plan)
        break
      except qt.QueryError as e:
        error_note = f"\nLẦN TRƯỚC LỖI: {e}. Hãy sửa lại.\n"
    if executed is None:
      return {"status": "query_failed", "answer": f"Không truy vấn được dữ liệu: {error_note.strip()}",
              "plan": plan.model_dump() if plan else None}

    rows = executed["rows"][:MAX_ROWS_TO_LLM]
    try:
      narration = self.llm.invoke(_ANSWER_PROMPT.format(
        question=question,
        result=json.dumps(rows, ensure_ascii=False, default=str),
        lineage=json.dumps(executed.get("lineage") or "bảng truy vấn trực tiếp", ensure_ascii=False, default=str),
      ))
      answer = getattr(narration, "content", str(narration))
    except Exception as e:
      # Số liệu đã tính xong — vẫn trả về dữ liệu dù không diễn giải được
      answer = f"(Không diễn giải được do lỗi LLM: {str(e)[:120]}) Xem bảng dữ liệu kèm theo."
    return {
      "status": "ok",
      "answer": answer,
      "data": rows, "sql": executed["sql"], "lineage": executed.get("lineage", []),
      "plan": plan.model_dump(),
    }
