"""
Data Brief + Insight + Data Readiness Score.

 • compute_insights: hàng nghìn dòng → vài chỉ số deterministic (SQL), mỗi chỉ số kèm lineage.
 • build_data_brief: ~1–2k token mô tả kho dữ liệu, chèn vào system prompt của agent.
   Brief chỉ là NGỮ CẢNH KHỞI ĐẦU — cần số mới nhất thì agent gọi get_metric/query_sql.
 • readiness_score: điểm 0–100 cho màn hình "Khám sức khỏe dữ liệu".
"""

import json
from datetime import date, datetime
from typing import Any, Dict, List

from app.services.digitization import warehouse as wh
from app.services.digitization.canonical import ENTITIES

KEY_ENTITIES = ("sales_line", "product", "customer", "marketing_spend", "budget_plan")


def _fmt_vnd(value: Any) -> str:
  if value is None:
    return "—"
  v = float(value)
  if abs(v) >= 1e9:
    return f"{v / 1e9:,.2f} tỷ"
  if abs(v) >= 1e6:
    return f"{v / 1e6:,.1f} triệu"
  return f"{v:,.0f}"


def _count(con, table: str) -> int:
  return con.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]


def compute_insights(con) -> List[Dict[str, Any]]:
  insights: List[Dict[str, Any]] = []

  if _count(con, "sales_line"):
    total, first, last, n_sources = con.execute(
      "SELECT SUM(revenue), MIN(date), MAX(date), COUNT(DISTINCT _source_table) FROM sales_line").fetchone()
    insights.append({"key": "revenue_total", "value": total, "unit": "VND",
                     "text": f"Tổng doanh thu {_fmt_vnd(total)}"
                             + (f" từ {first} đến {last}" if first else "") + f" ({n_sources} bảng nguồn)",
                     "lineage": "sales_line"})

    products = con.execute(
      "SELECT product_name, SUM(revenue) AS r FROM sales_line WHERE product_name IS NOT NULL "
      "GROUP BY 1 ORDER BY r DESC NULLS LAST").fetchall()
    if products and total:
      cumulative, pareto_n = 0.0, 0
      for _, r in products:
        cumulative += r or 0
        pareto_n += 1
        if cumulative >= 0.8 * total:
          break
      top = ", ".join(f"{p} ({_fmt_vnd(r)})" for p, r in products[:5])
      insights.append({"key": "top_products", "value": [p for p, _ in products[:5]],
                       "text": f"Top sản phẩm: {top}. {pareto_n}/{len(products)} sản phẩm tạo 80% doanh thu",
                       "lineage": "sales_line"})

    months = con.execute(
      "SELECT strftime(date, '%Y-%m') m, SUM(revenue) FROM sales_line WHERE date IS NOT NULL "
      "GROUP BY 1 ORDER BY 1 DESC LIMIT 6").fetchall()
    if len(months) >= 2 and months[1][1]:
      growth = (months[0][1] - months[1][1]) / months[1][1]
      insights.append({"key": "revenue_mom", "value": growth, "unit": "ratio",
                       "text": f"Doanh thu {months[0][0]}: {_fmt_vnd(months[0][1])} ({growth:+.1%} so với {months[1][0]})",
                       "lineage": "sales_line"})

    channels = con.execute(
      "SELECT channel, SUM(revenue) r FROM sales_line WHERE channel IS NOT NULL GROUP BY 1 ORDER BY r DESC LIMIT 3"
    ).fetchall()
    if channels and total:
      text = ", ".join(f"{c} {(r or 0) / total:.0%}" for c, r in channels)
      insights.append({"key": "revenue_by_channel", "value": dict(channels), "text": f"Tỷ trọng kênh: {text}",
                       "lineage": "sales_line"})

    repeat = con.execute(
      "SELECT COUNT(*) FILTER (WHERE n > 1), COUNT(*) FROM ("
      "  SELECT COALESCE(customer_phone, customer_name) k, COUNT(DISTINCT COALESCE(order_id, CAST(date AS VARCHAR))) n"
      "  FROM sales_line WHERE COALESCE(customer_phone, customer_name) IS NOT NULL GROUP BY 1)").fetchone()
    if repeat[1]:
      insights.append({"key": "repeat_rate", "value": repeat[0] / repeat[1], "unit": "ratio",
                       "text": f"Tỷ lệ khách mua lại: {repeat[0] / repeat[1]:.0%} ({repeat[1]:,} khách)",
                       "lineage": "sales_line"})

  if _count(con, "budget_plan"):
    # Các bảng ngân sách thường là các phiên bản khác nhau → báo theo từng bảng, KHÔNG cộng dồn
    rows = con.execute(
      "SELECT b._source_table, ANY_VALUE(m.sheet), ANY_VALUE(b._file), SUM(b.planned_amount), COUNT(DISTINCT b._source_row) "
      "FROM budget_plan b LEFT JOIN _tables m ON m.table_name = b._source_table "
      "WHERE b.planned_amount IS NOT NULL GROUP BY 1 ORDER BY 4 DESC LIMIT 5").fetchall()
    if rows:
      text = "; ".join(f"{sheet} ({src}): {_fmt_vnd(total)} / {n} hạng mục" for src, sheet, _, total, n in rows)
      insights.append({"key": "budget_tables", "value": [{"table": r[0], "total": r[3]} for r in rows],
                       "text": f"Ngân sách kế hoạch theo bảng: {text}", "lineage": "budget_plan"})

  if _count(con, "marketing_spend"):
    total, = con.execute("SELECT SUM(amount) FROM marketing_spend").fetchone()
    insights.append({"key": "marketing_spend_total", "value": total, "unit": "VND",
                     "text": f"Chi phí marketing thực tế: {_fmt_vnd(total)}", "lineage": "marketing_spend"})
    if _count(con, "sales_line"):
      worst = con.execute(
        "WITH s AS (SELECT strftime(date, '%Y-%m') m, SUM(amount) spend FROM marketing_spend "
        "  WHERE date IS NOT NULL GROUP BY 1), r AS (SELECT strftime(date, '%Y-%m') m, SUM(revenue) rev "
        "  FROM sales_line WHERE date IS NOT NULL GROUP BY 1) "
        "SELECT s.m, spend, rev, spend / NULLIF(rev, 0) ratio FROM s LEFT JOIN r USING (m) "
        "ORDER BY ratio DESC NULLS FIRST LIMIT 1").fetchone()
      if worst:
        insights.append({"key": "worst_spend_month", "value": worst[0],
                         "text": f"Tháng chi quảng cáo kém hiệu quả nhất: {worst[0]} — chi {_fmt_vnd(worst[1])}, "
                                 f"doanh thu {_fmt_vnd(worst[2])}", "lineage": "marketing_spend, sales_line"})

  if _count(con, "store_outlet"):
    n, outlets = con.execute("SELECT COUNT(*), SUM(outlet_count) FROM store_outlet").fetchone()
    insights.append({"key": "outlets", "value": outlets,
                     "text": f"Hệ thống phân phối: {n} dòng hệ thống/điểm bán"
                             + (f", tổng {outlets:,.0f} điểm" if outlets else ""), "lineage": "store_outlet"})
  return insights


def readiness_score(con) -> Dict[str, Any]:
  present = [e for e in KEY_ENTITIES if _count(con, e)]
  coverage = len(present) / len(KEY_ENTITIES)
  tables = con.execute("SELECT entity, issues_json FROM _tables").fetchall()
  recipes = con.execute("SELECT confidence, confirmed, recipe_json FROM _recipes WHERE entity <> 'custom'").fetchall()
  mapped_ratio = (sum(1 for e, _ in tables if e and e != "custom") / len(tables)) if tables else 0.0
  confidence = (sum(1.0 if c else conf for conf, c, _ in recipes) / len(recipes)) if recipes else 0.0
  n_issues = sum(len(json.loads(i or "[]")) for _, i in tables)
  cleanliness = 1.0 - min(1.0, n_issues / max(1, len(tables)) / 2)
  questions = sum(len(json.loads(r).get("questions", [])) for _, c, r in recipes if not c)

  freshness = 0.0
  last = con.execute("SELECT MAX(date) FROM sales_line").fetchone()[0]
  if last:
    age = (date.today() - last).days
    freshness = 1.0 if age <= 31 else 0.5 if age <= 180 else 0.2

  score = round(100 * (0.35 * coverage + 0.2 * mapped_ratio + 0.2 * confidence + 0.15 * cleanliness
                       + 0.1 * freshness))
  return {
    "score": score,
    "coverage": {"present": present, "missing": [e for e in KEY_ENTITIES if e not in present]},
    "mapped_table_ratio": round(mapped_ratio, 3), "mapping_confidence": round(confidence, 3),
    "integrity_issues": n_issues, "pending_questions": questions,
    "last_sales_date": str(last) if last else None,
  }


def build_data_brief(tenant_id: str) -> Dict[str, Any]:
  with wh.connect(tenant_id, read_only=True) as con:
    files, rows = con.execute("SELECT COUNT(*), COALESCE(SUM(row_count), 0) FROM _files").fetchone()
    if not files:
      return {"text": "", "insights": [], "readiness": None, "files": 0}
    insights = compute_insights(con)
    readiness = readiness_score(con)
    entity_rows = [(e.name, e.description, _count(con, e.name)) for e in ENTITIES.values()]
    custom = con.execute("SELECT COUNT(*), COALESCE(SUM(data_row_count), 0) FROM _tables "
                         "WHERE entity = 'custom' OR entity IS NULL").fetchone()
    kv = con.execute("SELECT DISTINCT key, value FROM org_profile WHERE value IS NOT NULL LIMIT 8").fetchall()

  lines = [f"KHO DỮ LIỆU NỘI BỘ (cập nhật {datetime.now():%Y-%m-%d %H:%M}): {files} file, {int(rows):,} dòng dữ liệu đã số hóa.",
           "Bảng chuẩn có dữ liệu:"]
  for name, desc, n in entity_rows:
    if n:
      lines.append(f"  - {name}: {n:,} dòng — {desc}")
  if custom[0]:
    lines.append(f"  - {custom[0]} bảng riêng chưa khớp mô hình chuẩn ({int(custom[1]):,} dòng) — xem list_tables")
  missing = readiness["coverage"]["missing"]
  if missing:
    lines.append(f"Chưa có dữ liệu: {', '.join(missing)} → các phân tích liên quan phải dùng giả định.")
  if kv:
    lines.append("Thông tin dạng form: " + "; ".join(f"{k}: {v}" for k, v in kv if v))
  if insights:
    lines.append("Chỉ số đã kiểm chứng (tính bằng SQL, không do AI ước lượng):")
    lines.extend(f"  • {i['text']}" for i in insights)
  lines.append(f"Data Readiness Score: {readiness['score']}/100"
               + (f", {readiness['pending_questions']} câu hỏi ánh xạ chờ xác nhận" if readiness["pending_questions"] else ""))
  lines.append("Cần số liệu chi tiết/mới nhất → gọi get_metric hoặc query_sql; không tự suy đoán số.")
  return {"text": "\n".join(lines), "insights": insights, "readiness": readiness, "files": files}


def brief_for_agents(tenant_id: str) -> Dict[str, Any]:
  """
  Gói ngữ cảnh dữ liệu nội bộ cho các agent của luồng cũ (Brand DNA, CMO/CFO).
  Không bao giờ ném lỗi: chưa có dữ liệu / lỗi kho → trả {} để luồng cũ chạy như trước.
  """
  if not tenant_id:
    return {}
  try:
    brief = build_data_brief(tenant_id)
  except Exception as e:
    print(f"⚠️ [Data Brief] Không đọc được kho của tenant: {e}")
    return {}
  if not brief.get("files"):
    return {}
  return {
    "text": brief["text"],
    "insights": [{"key": i["key"], "text": i["text"]} for i in brief["insights"]],
    "readiness_score": (brief.get("readiness") or {}).get("score"),
  }
