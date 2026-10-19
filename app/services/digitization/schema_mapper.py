"""
Ánh xạ bảng → Canonical Data Model, sinh MAPPING RECIPE (JSON khai báo, không phải code).

Thứ tự ưu tiên (rẻ → đắt):
 1. Recipe đã lưu cho cùng header_signature (file cùng template) → 0 lần gọi LLM.
 2. Heuristic từ điển đồng nghĩa tiếng Việt → đủ tự tin (≥ 0.8) thì dùng luôn.
 3. LLM (model Flash) — chỉ nhận header + 5 mẫu + profile cột, không bao giờ nhận toàn bộ dữ liệu.
 4. LLM lỗi / hết quota → circuit breaker, quay về heuristic; cột mơ hồ thành câu hỏi cho người dùng.
"""

import hashlib
import json
import os
import re
import time
import uuid
from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional, Tuple

from pydantic import BaseModel, Field

from app.services.digitization.canonical import CUSTOM_ENTITY, ENTITIES, entity_catalog_for_llm
from app.services.digitization.llm_json import invoke_json
from app.services.digitization.normalizers_vi import normalize_header
from app.services.digitization.profiler import ColumnProfile

AUTO_ACCEPT_CONFIDENCE = 0.8
_ID_HEADERS = {"tt", "stt", "no", "so tt", "ma", "id", "#", "nr"}
QUESTION_THRESHOLD = 0.75
MAX_QUESTIONS_PER_TABLE = 3


@dataclass
class MappingRecipe:
  header_signature: str
  entity: str
  column_map: Dict[str, str] = field(default_factory=dict)          # cột nguồn → cột chuẩn
  column_confidence: Dict[str, float] = field(default_factory=dict)
  confidence: float = 0.0
  source: str = "heuristic"                                          # heuristic | llm | human
  questions: List[Dict[str, Any]] = field(default_factory=list)
  confirmed: bool = False
  recipe_id: str = field(default_factory=lambda: f"rcp_{uuid.uuid4().hex[:12]}")

  def to_dict(self) -> Dict[str, Any]:
    return asdict(self)

  @classmethod
  def from_dict(cls, data: Dict[str, Any]) -> "MappingRecipe":
    known = {k: data[k] for k in cls.__dataclass_fields__ if k in data}
    return cls(**known)


def header_signature(columns: List[str]) -> str:
  """Cùng bộ header (bỏ dấu, chữ thường) → cùng template → dùng lại recipe."""
  normalized = "|".join(normalize_header(c) for c in columns)
  return hashlib.sha1(normalized.encode("utf-8")).hexdigest()


# ─── Heuristic ───────────────────────────────────────────────────────────────

def _synonym_score(header: str, synonym: str) -> float:
  if not header or not synonym:
    return 0.0
  if header == synonym:
    return 1.0
  if len(synonym) <= 3:
    # Viết tắt ngắn (sl, ns, ck, kh...) chỉ khớp khi là một từ riêng
    return 0.75 if synonym in header.split() else 0.0
  if header.startswith(synonym + " ") or header.endswith(" " + synonym):
    return 0.85
  if re.search(rf"(^|\s){re.escape(synonym)}($|\s)", header):
    return 0.75
  return 0.0


def _column_score(source: str, canonical_name: str, synonyms: tuple, col_type: str,
                  profile: Optional[ColumnProfile]) -> float:
  # Header 2 tầng "ATTENTION.%" → thử cả tên đầy đủ lẫn phần cuối
  headers = {normalize_header(source), normalize_header(source.split(".")[-1])}
  candidates = synonyms + (canonical_name.replace("_", " "),)
  score = max(_synonym_score(h, s) for h in headers for s in candidates)
  if score == 0 or profile is None:
    return score
  ptype = profile.inferred_type
  if col_type == "number" and ptype not in ("number", "range", "empty"):
    return 0.0
  if col_type == "date" and ptype not in ("date", "empty"):
    return 0.0
  if canonical_name.endswith("_ratio") and profile.max is not None and profile.max > 1.5:
    return 0.0  # header có '%' nhưng giá trị là tiền → không phải tỷ lệ
  if col_type == "text" and ptype == "number" and (profile.unit_guess in ("VND", "ratio")):
    return score * 0.4
  return score


def heuristic_map(columns: List[str], profiles: List[ColumnProfile]) -> MappingRecipe:
  signature = header_signature(columns)
  best: Optional[Tuple[float, MappingRecipe]] = None

  for entity in ENTITIES.values():
    scored = []
    for i, src in enumerate(columns):
      for canon, col in entity.columns.items():
        s = _column_score(src, canon, col.synonyms, col.type, profiles[i] if i < len(profiles) else None)
        if s >= 0.6:
          scored.append((s, src, canon))
    scored.sort(key=lambda t: -t[0])
    used_src, used_canon, mapping, conf = set(), set(), {}, {}
    for s, src, canon in scored:
      if src in used_src or canon in used_canon:
        continue
      used_src.add(src)
      used_canon.add(canon)
      mapping[src], conf[src] = canon, round(s, 3)

    if len(mapping) < entity.min_matches or not (set(mapping.values()) & set(entity.key_columns)):
      continue
    coverage = min(1.0, len(mapping) / min(4, max(1, len(columns))))
    confidence = round(sum(conf.values()) / len(conf) * (0.6 + 0.4 * coverage), 3)
    total = sum(conf.values()) + (0.5 if set(mapping.values()) & set(entity.key_columns) else 0)
    if best is None or total > best[0]:
      best = (total, MappingRecipe(signature, entity.name, mapping, conf, confidence, "heuristic"))

  if best is None:
    return MappingRecipe(signature, CUSTOM_ENTITY, {}, {}, 0.0, "heuristic")
  return best[1]


def build_questions(recipe: MappingRecipe, columns: List[str], profiles: List[ColumnProfile]) -> List[Dict[str, Any]]:
  """Câu hỏi trắc nghiệm 1 chạm cho cột mơ hồ: 'Cột X có phải là Y không?'."""
  if recipe.entity == CUSTOM_ENTITY:
    return []
  entity = ENTITIES[recipe.entity]
  by_name = {p.name: p for p in profiles}
  questions = []
  for src in columns:
    profile = by_name.get(src)
    mapped = recipe.column_map.get(src)
    conf = recipe.column_confidence.get(src, 0.0)
    unmapped_number = (mapped is None and profile and profile.inferred_type == "number"
                       and not src.startswith("col_") and normalize_header(src) not in _ID_HEADERS)
    if (mapped and conf < QUESTION_THRESHOLD) or unmapped_number:
      options = [c for c, col in entity.columns.items()
                 if c not in recipe.column_map.values() or c == mapped]
      if profile and profile.inferred_type == "number":
        options = [c for c in options if entity.columns[c].type == "number"]
      questions.append({
        "column": src,
        "suggestion": mapped,
        "options": options[:6],
        "samples": (profile.samples if profile else [])[:3],
        "question": (f"Cột '{src}' có phải là '{entity.columns[mapped].description}' không?"
                     if mapped else f"Cột số '{src}' tương ứng với trường nào?"),
      })
    if len(questions) >= MAX_QUESTIONS_PER_TABLE:
      break
  return questions


# ─── LLM ─────────────────────────────────────────────────────────────────────

class _LLMColumn(BaseModel):
  source: str = Field(description="Tên cột nguồn, giữ nguyên như đầu vào")
  target: Optional[str] = Field(None, description="Tên cột chuẩn, hoặc null nếu không khớp")
  confidence: float = Field(description="0..1")


class _LLMMapping(BaseModel):
  entity: str = Field(description="Tên thực thể chuẩn, hoặc 'custom' nếu không khớp thực thể nào")
  columns: List[_LLMColumn]


class _CircuitBreaker:
  def __init__(self, max_failures: int = 3, cooldown_s: int = 300):
    self.failures, self.opened_at = 0, 0.0
    self.max_failures, self.cooldown_s = max_failures, cooldown_s

  def allow(self) -> bool:
    if self.failures < self.max_failures:
      return True
    if time.time() - self.opened_at > self.cooldown_s:
      self.failures = 0
      return True
    return False

  def record(self, ok: bool) -> None:
    if ok:
      self.failures = 0
    else:
      self.failures += 1
      if self.failures >= self.max_failures:
        self.opened_at = time.time()


_breaker = _CircuitBreaker()

_MAPPING_PROMPT = """Bạn là kỹ sư dữ liệu. Ánh xạ một bảng Excel của doanh nghiệp vừa và nhỏ Việt Nam
về mô hình dữ liệu chuẩn. Bạn CHỈ thấy header, vài giá trị mẫu và thống kê cột — không cần tính toán gì.

Quy tắc:
- Chọn đúng 1 thực thể trong danh sách, hoặc "custom" nếu không khớp.
- Mỗi cột nguồn map tới tối đa 1 cột chuẩn của thực thể đó; mỗi cột chuẩn dùng tối đa 1 lần.
- Không chắc thì để target = null và confidence thấp. Không bịa cột không có trong danh sách.

MÔ HÌNH CHUẨN:
{catalog}

BẢNG CẦN ÁNH XẠ:
{table}"""


def _llm_available() -> bool:
  if os.getenv("BRANDFLOW_DISABLE_LLM_MAPPING", "").lower() in ("1", "true", "yes"):
    return False
  return bool(os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")) and _breaker.allow()


def llm_map(columns: List[str], profiles: List[ColumnProfile], context: Dict[str, Any]) -> Optional[MappingRecipe]:
  if not _llm_available():
    return None
  try:
    if "GOOGLE_API_KEY" not in os.environ and "GEMINI_API_KEY" in os.environ:
      os.environ["GOOGLE_API_KEY"] = os.environ["GEMINI_API_KEY"]
    from langchain_google_genai import ChatGoogleGenerativeAI

    llm = ChatGoogleGenerativeAI(
      model=os.getenv("DIGITIZATION_LLM_MODEL", "gemini-2.5-flash"),
      temperature=0.0, max_retries=1, timeout=30.0,
    )
    table_payload = {
      **context,
      "columns": [p.to_dict() for p in profiles],
    }
    prompt = _MAPPING_PROMPT.format(
      catalog=json.dumps(entity_catalog_for_llm(), ensure_ascii=False),
      table=json.dumps(table_payload, ensure_ascii=False, default=str),
    )
    result = invoke_json(llm, prompt, _LLMMapping)
    _breaker.record(True)
  except Exception as e:
    _breaker.record(False)
    print(f"  ⚠️ [Mapping/LLM] Lỗi, dùng heuristic: {e}")
    return None

  # Không tin LLM mù quáng: chỉ giữ thực thể/cột có thật
  signature = header_signature(columns)
  if result.entity not in ENTITIES:
    return MappingRecipe(signature, CUSTOM_ENTITY, {}, {}, 0.0, "llm")
  entity = ENTITIES[result.entity]
  mapping, conf, used = {}, {}, set()
  for item in result.columns:
    if item.source in columns and item.target in entity.columns and item.target not in used:
      mapping[item.source], conf[item.source] = item.target, round(max(0.0, min(1.0, item.confidence)), 3)
      used.add(item.target)
  if not mapping:
    return MappingRecipe(signature, CUSTOM_ENTITY, {}, {}, 0.0, "llm")
  confidence = round(sum(conf.values()) / len(conf), 3)
  return MappingRecipe(signature, entity.name, mapping, conf, confidence, "llm")


# ─── Điểm vào ────────────────────────────────────────────────────────────────

def map_table(columns: List[str], profiles: List[ColumnProfile], context: Dict[str, Any]) -> MappingRecipe:
  recipe = heuristic_map(columns, profiles)
  if recipe.confidence < AUTO_ACCEPT_CONFIDENCE:
    llm_recipe = llm_map(columns, profiles, context)
    if llm_recipe is not None and (llm_recipe.entity != CUSTOM_ENTITY or recipe.entity == CUSTOM_ENTITY):
      recipe = llm_recipe
  recipe.questions = build_questions(recipe, columns, profiles)
  return recipe
