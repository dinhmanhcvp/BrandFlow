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


def test_clean_competitor_pages_keeps_only_facebook_links():
  pages = tl.clean_competitor_pages([
    {"name": "Phúc Long", "url": "https://m.facebook.com/PhucLongCoffeeandTea/?ref=x"},
    {"name": "Katinat", "url": "facebook.com/katinat.vn"},
    {"name": "Lừa đảo", "url": "https://evil.com/facebook.com/x"},
    {"name": "Page id", "url": "https://www.facebook.com/profile.php?id=123"},
    {"name": "", "url": "https://facebook.com/noname"},
    {"name": "Chỉ tên"},
    "rác",
  ])
  assert pages == [
    {"name": "Phúc Long", "url": "https://www.facebook.com/PhucLongCoffeeandTea"},
    {"name": "Katinat", "url": "https://www.facebook.com/katinat.vn"},
    {"name": "Lừa đảo", "url": ""},
    {"name": "Page id", "url": "https://www.facebook.com/profile.php?id=123"},
    {"name": "Chỉ tên", "url": ""},
  ]
  assert tl.clean_competitor_pages(None) == []


def test_entered_competitors_come_first_without_duplicates():
  from app.agents.planner.agents_core import _product_and_competitors
  dna = {"brand_name": "X", "competitor_pages": [{"name": "Katinat", "url": ""}],
         "competitor_landscape": [{"name": "Phúc Long"}, {"name": "Katinat"}]}
  assert _product_and_competitors(dna, None)[1] == ["Katinat", "Phúc Long"]


def test_facebook_posts_parsed_ranked_and_skips_errors(monkeypatch):
  import io, json as _json
  monkeypatch.setenv("APIFY_TOKEN", "t")
  posts = [
    {"text": "Ra mắt trà sữa ít đường", "url": "u1", "pageName": "Katinat", "time": "2026-11-18T10:00:00Z", "likes": 100, "comments": 10, "shares": 1},
    {"text": "Minigame tặng voucher", "url": "u2", "pageName": "Katinat", "time": "2026-11-17T10:00:00Z", "likes": 50, "comments": 80, "shares": 20},
    {"error": "Page not available", "url": "https://facebook.com/x"},
  ]
  seen = {}
  def fake_urlopen(req, timeout):
    seen["auth"], seen["body"] = req.headers.get("Authorization"), _json.loads(req.data)
    return io.BytesIO(_json.dumps(posts).encode())
  monkeypatch.setattr(tl.urllib.request, "urlopen", fake_urlopen)

  out = tl._facebook_posts(["https://www.facebook.com/katinat.vn"])
  assert [p["url"] for p in out] == ["u2", "u1"]  # 50+160+60 > 100+20+3
  assert seen["auth"] == "Bearer t" and seen["body"]["resultsLimit"] == 5  # token ở header, không lộ trên URL


def test_facebook_skipped_without_token(monkeypatch):
  monkeypatch.delenv("APIFY_TOKEN", raising=False)
  assert tl._facebook_posts(["https://www.facebook.com/katinat.vn"]) == []


def test_listen_reuses_facebook_for_6h_and_filters_it(monkeypatch):
  monkeypatch.setattr(tl, "_store", {})
  monkeypatch.setattr(tl, "_google_news", lambda q, days=7: [])
  monkeypatch.setattr(tl, "_google_trends_vn", lambda: [])
  monkeypatch.setattr(tl, "_youtube", lambda q: [])
  calls = []
  post = {"kind": "facebook", "title": "Bài khuyến mãi", "source": "Katinat", "url": "u1", "date": "2026-11-18",
          "likes": 1, "comments": 0, "shares": 0, "engagement": 1}
  scandal = {**post, "title": "Phốt", "url": "u2"}
  monkeypatch.setattr(tl, "_facebook_posts", lambda urls: calls.append(urls) or [post, scandal])
  monkeypatch.setattr(tl, "_marketable", lambda items, p, c: [i for i in items if i["title"] != "Phốt"])
  pages = [{"name": "Katinat", "url": "https://www.facebook.com/katinat.vn"}]

  first = tl.listen("F&B", "trà sữa", pages=pages)
  assert [p["url"] for p in first["facebook"]] == ["u1"]
  assert "Fanpage đối thủ" in tl.to_prompt(first)
  tl.listen("F&B", "trà sữa", pages=pages, force=True)  # tin tức quét lại, Facebook còn mới → không gọi Apify
  assert len(calls) == 1
  tl.listen("F&B", "trà sữa", pages=pages + [{"name": "Phúc Long", "url": "https://www.facebook.com/phuclong"}], force=True)
  assert len(calls) == 2  # đổi danh sách Page → quét lại
