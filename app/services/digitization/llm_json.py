"""
Gọi LLM lấy JSON rồi kiểm bằng Pydantic.

Không dùng with_structured_output: langchain-google-genai 1.x (bản dự án đang ghim) chuyển schema
qua pydantic.v1 và lỗi với model Pydantic v2 lồng nhau. Yêu cầu JSON + model_validate chạy được
với mọi provider/phiên bản, và lỗi parse được trả về rõ ràng thay vì exception khó hiểu.
"""

import json
import re
from typing import Type, TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


def _extract_json(text: str) -> str:
  fenced = re.search(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
  if fenced:
    return fenced.group(1).strip()
  start = min((i for i in (text.find("{"), text.find("[")) if i >= 0), default=-1)
  return text[start:].strip() if start >= 0 else text.strip()


def invoke_json(llm, prompt: str, model: Type[T]) -> T:
  schema = json.dumps(model.model_json_schema(), ensure_ascii=False)
  message = (f"{prompt}\n\nChỉ trả về MỘT object JSON hợp lệ theo JSON Schema sau, không kèm giải thích:\n{schema}")
  response = llm.invoke(message)
  content = getattr(response, "content", response)
  if isinstance(content, list):  # một số model trả về danh sách phần nội dung
    content = "".join(p.get("text", "") if isinstance(p, dict) else str(p) for p in content)
  return model.model_validate_json(_extract_json(str(content)))
