from datetime import datetime, timedelta, timezone

from app.services import trend_listener as tl

NOW = datetime.now(timezone.utc)


def _item(title, url, source="vnexpress", days_ago=0):
  return {"title": title, "source": source, "url": url, "date": (NOW - timedelta(days=days_ago)).isoformat()}


def test_rank_prefers_fresh_hot_and_fitting_news():
  brand, ctx = tl._words("trà sữa Phúc Long"), tl._words("giảm đường Gen Z")
  raw = [
    ("product", _item("Trà sữa giảm đường lên ngôi", "a", "vnexpress", 0)),
    ("product", _item("Trà sữa giảm đường lên ngôi", "a2", "kenh14", 0)),  # cùng tin, báo khác → nóng hơn
    ("product", _item("Trà sữa giảm đường hút Gen Z", "b", "zing", 6)),
    ("industry", _item("Giá vàng hôm nay", "c")),  # không khớp → bỏ
    ("competitor", _item("Phúc Long mở 20 cửa hàng", "d")),  # đối thủ luôn giữ
  ]
  ranked = tl._rank(raw, brand, ctx, NOW)
  assert [s["url"] for s in ranked][0] in {"a", "b"}
  assert {s["url"] for s in ranked} == {"a", "b", "d"}
  assert next(s for s in ranked if s["url"] == "a")["outlets"] == 2


def test_listen_marks_new_signals_and_survives_outage(monkeypatch):
  store, news = {}, [[_item("trà sữa matcha", "a"), _item("trà sữa khoai môn", "b")]]
  monkeypatch.setattr(tl, "_store", store)
  monkeypatch.setattr(tl, "_marketable", lambda items, p, c: items)
  monkeypatch.setattr(tl, "_google_news", lambda q, days=7: news[0] if q.startswith("\"") else [])
  monkeypatch.setattr(tl, "_google_trends_vn", lambda: ["trà sữa giảm đường", "bóng đá"])

  first = tl.listen("F&B", "trà sữa")
  assert not any(s["is_new"] for s in first["signals"])  # lần đầu: chưa có mốc so sánh
  assert first["google_trends"] == ["trà sữa giảm đường"]
  assert tl.listen("F&B", "trà sữa") is first  # < 1h → dùng cache

  news[0] = [_item("trà sữa khoai môn", "b2"), _item("trà sữa phô mai", "c")]
  second = tl.listen("F&B", "trà sữa", force=True)
  assert {s["url"]: s["is_new"] for s in second["signals"]} == {"b2": False, "c": True}  # cùng tin, khác URL → vẫn không MỚI
  assert "[MỚI]" in tl.to_prompt(second)

  news[0] = []
  monkeypatch.setattr(tl, "_google_trends_vn", lambda: [])
  assert tl.listen("F&B", "trà sữa", force=True) is second  # mạng lỗi → giữ snapshot cũ


def test_product_and_competitors_from_brand_dna():
  from app.agents.planner.agents_core import _product_and_competitors
  dna = {"brand_name": "Bếp Nhà Mộc", "competitor_landscape": [{"name": "Cơm Tấm Cali"}, {"positioning": "x"}]}
  assert _product_and_competitors(dna, None) == ("Bếp Nhà Mộc", ["Cơm Tấm Cali"])
  assert _product_and_competitors(None, "App học tiếng Anh") == ("App học tiếng Anh", [])


def test_youtube_signals_filtered_and_in_prompt(monkeypatch):
  monkeypatch.setattr(tl, "_store", {})
  monkeypatch.setattr(tl, "_marketable", lambda items, p, c: items)
  monkeypatch.setattr(tl, "_google_news", lambda q, days=7: [])
  monkeypatch.setattr(tl, "_google_trends_vn", lambda: [])
  vid = lambda kind, title, views: {"kind": kind, "title": title, "source": "kênh", "url": title, "date": NOW.isoformat(), "views": views}
  monkeypatch.setattr(tl, "_youtube", lambda q: [
    vid("youtube", "Review trà sữa ít đường", 5000),
    vid("youtube_trending", "Highlight bóng đá", 9_000_000),  # thịnh hành nhưng không liên quan → bỏ
    vid("youtube_trending", "Trà sữa trend mới", 800_000),
  ])
  snap = tl.listen("F&B", "trà sữa")
  assert [v["title"] for v in snap["social"]] == ["Trà sữa trend mới", "Review trà sữa ít đường"]
  assert "[THỊNH HÀNH VN]" in tl.to_prompt(snap)


def test_youtube_skipped_without_key(monkeypatch):
  monkeypatch.delenv("YOUTUBE_API_KEY", raising=False)
  assert tl._youtube("trà sữa") == []


def test_marketable_keeps_only_ai_approved_and_fails_safe(monkeypatch):
  from app.agents.planner import agents_core
  items = [{"kind": "product", "title": "Trà sữa ít đường hút Gen Z"},
           {"kind": "social_trend", "title": "Bắt tạm giam chủ tài khoản TikTok"},
           {"kind": "social_trend", "title": "Trào lưu 'một ngày trăm họ'"}]

  class FakeLLM:
    def __init__(self, keep): self._keep = keep
    def with_structured_output(self, schema): return self
    def invoke(self, prompt):
      if self._keep is None:
        raise RuntimeError("quota")
      return type("R", (), {"keep": self._keep})()

  monkeypatch.setattr(agents_core, "_get_review_llm", lambda temperature=0: FakeLLM([0, 2]))
  assert [i["title"] for i in tl._marketable(items, "trà sữa", "")] == [items[0]["title"], items[2]["title"]]

  monkeypatch.setattr(agents_core, "_get_review_llm", lambda temperature=0: FakeLLM(None))
  assert tl._marketable(items, "trà sữa", "") == [items[0]]  # AI lỗi → bỏ trend MXH chung
