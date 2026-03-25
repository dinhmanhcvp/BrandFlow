"""
=============================================================================
BrandFlow Strategy Engine - agents_core.py (v6 — Non-Convergence Fix)
=============================================================================
Hệ thống Multi-Agent stateless chạy 100% Local bằng Ollama.

Thay đổi v6 (Ép hội tụ):
  - MasterPlanner nhận thêm `previous_plan`, `actual_total_cost` và bị cấm 
    viết mới hoàn toàn nếu đang sửa lỗi dôi ngân sách.
  - CFO KHÔNG CÒN phải làm toán. Output schema của CFO được tối giản lại, 
    chỉ còn `target_cuts` và `feedback_to_planner`.
=============================================================================
"""

import json
from typing import List, Literal

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama
from langchain_core.exceptions import OutputParserException
from pydantic import BaseModel, Field
from tenacity import retry, stop_after_attempt, wait_fixed

# =============================================================================
# 1. PYDANTIC SCHEMAS — v6: Tối giản CFO, ép MasterPlanner chặt hơn
# =============================================================================

class ActionItem(BaseModel):
    name: str = Field(description="Tên hoạt động marketing")
    description: str = Field(description="Mô tả cách thực hiện (ngắn gọn 2-3 câu)")
    cost: int = Field(description="Chi phí dự kiến (VND), số nguyên thuần túy")
    priority: Literal["MUST_HAVE", "SHOULD_HAVE", "COULD_HAVE"] = Field(
        description="Mức độ ưu tiên để CFO biết đường cắt giảm"
    )
    expected_kpi: str = Field(description="Kết quả đo lường (VD: Tiếp cận 10,000 người, Bán 50 đơn)")


class CampaignPhase(BaseModel):
    phase_name: str = Field(description="Tên giai đoạn (VD: Giai đoạn 1: Hâm nóng / Teasing)")
    duration: str = Field(description="Thời gian triển khai dự kiến")
    objective: str = Field(description="Mục tiêu chính của giai đoạn này")
    activities: List[ActionItem] = Field(min_length=1, description="Danh sách các hành động trong giai đoạn này (Bắt buộc ít nhất 1)")
    phase_subtotal_cost: int = Field(description="Tổng chi phí của riêng giai đoạn này (VND)")


class MasterPlanOutput(BaseModel):
    campaign_name: str = Field(description="Tên chiến dịch")
    executive_summary: str = Field(description="Tóm tắt định hướng chiến lược (3-4 câu)")
    target_audience: str = Field(description="Phân tích khách hàng mục tiêu")
    phases: List[CampaignPhase] = Field(min_length=1, description="Danh sách các giai đoạn triển khai (Bắt buộc ít nhất 1)")
    total_estimated_cost: int = Field(description="Tổng chi phí toàn bộ chiến dịch (bằng tổng các phase_subtotal_cost)")


class CFODecision(BaseModel):
    """(v6) Lược bỏ is_approved và total_cost_calculated vì Python tự tính."""
    target_cuts: List[str] = Field(
        default=[],
        description="Danh sách TÊN CỤ THỂ các hoạt động (thuộc phase nào) cần cắt giảm hoặc giảm chi phí"
    )
    feedback_to_planner: str = Field(
        description="Phản hồi chi tiết: yêu cầu cắt giảm hạng mục nào, thuộc Phase nào, để giảm bao nhiêu tiền."
    )


# =============================================================================
# 2. OUTPUT PARSERS
# =============================================================================

planner_parser = JsonOutputParser(pydantic_object=MasterPlanOutput)
cfo_parser = JsonOutputParser(pydantic_object=CFODecision)


# =============================================================================
# 3. SYSTEM PROMPTS — v6: Edit-Only & Python Math integration
# =============================================================================

JSON_ENFORCEMENT = (
    "CHỈ TRẢ VỀ CHUỖI JSON HỢP LỆ. KHÔNG CÓ BẤT KỲ VĂN BẢN NÀO BÊN NGOÀI. "
    "QUAN TRỌNG: Tất cả các con số (tiền tệ, cost, budget) PHẢI là SỐ NGUYÊN (Integer) THUẦN TÚY. "
    "Ví dụ: 15000000 chứ KHÔNG PHẢI 15.000.000 hay 15,000,000."
)

# ---- Master Planner Prompt ----
planner_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """Bạn là Giám đốc Marketing (CMO) dày dặn kinh nghiệm.
Nhiệm vụ: Lập (hoặc ĐiỀU CHỈNH) Bản Kế hoạch Chiến lược (Master Plan) chi tiết.

BẢNG GIÁ THAM CHIẾU THỊ TRƯỜNG (để ước lượng chi phí thực tế):
- Bài PR báo chí: 5000000 - 15000000 VND/bài.
- Booking KOL/Influencer (Micro): 3000000 - 10000000 VND/người.
- Chạy Ads (Facebook/TikTok): Tối thiểu 10000000 - 20000000 VND/tháng để có hiệu quả.
- Sản xuất Video ngắn (Reels/TikTok): 2000000 - 5000000 VND/video.
- Tổ chức Event mini: 5000000 - 15000000 VND/sự kiện.

LƯU Ý CỰC KỲ QUAN TRỌNG: Dưới đây là quy chuẩn công ty và các bài học rút ra từ sai lầm trong quá khứ:
{company_guidelines}
BẠN BẮT BUỘC PHẢI TUÂN THỦ CÁC QUY TẮC NÀY KHI LẬP KẾ HOẠCH.

QUY TẮC BẮT BUỘC:
1. BẮT BUỘC chia chiến dịch thành các Giai đoạn logic (Teasing -> Launching -> Sustaining).
2. Mỗi hoạt động PHẢI có mức độ ưu tiên: MUST_HAVE, SHOULD_HAVE, HOẶC COULD_HAVE.
3. KHI SỬA KẾ HOẠCH DO BỊ TỪ CHỐI (vượt ngân sách): BẠN CHỈ ĐƯỢC PHÉP CHỈNH SỬA bản nháp cũ (giảm tiền, xóa hạng mục COULD_HAVE) DỰA THEO YÊU CẦU CỦA CFO. TUYỆT ĐỐI KHÔNG SÁNG TÁC THÊM HẠNG MỤC MỚI.
4. Tổng `total_estimated_cost` PHẢI KHỚP với tổng chi phí các activities của các phần. Nếu có thể, không được vượt budget.

VÍ DỤ ĐẦU RA JSON BẮT BUỘC (Bạn phải tuân thủ đúng cấu trúc này):
{{
  "campaign_name": "Tên chiến dịch",
  "executive_summary": "Tóm tắt ngắn gọn",
  "target_audience": "Khách hàng mục tiêu",
  "total_estimated_cost": 15000000,
  "phases": [
    {{
      "phase_name": "Giai đoạn 1: Teasing",
      "duration": "Tuần 1",
      "objective": "Thu hút sự chú ý",
      "phase_subtotal_cost": 15000000,
      "activities": [
        {{
          "name": "Chạy Facebook Ads",
          "description": "Chạy video teaser",
          "cost": 15000000,
          "priority": "MUST_HAVE",
          "expected_kpi": "100k reach"
        }}
      ]
    }}
  ]
}}

""" + JSON_ENFORCEMENT + """

{format_instructions}"""
    ),
    (
        "human",
        """Mục tiêu chiến dịch: {goal}
Ngân sách tối đa: {budget} VND
TỔNG CHI PHÍ THỰC TẾ CỦA BẢN NHÁP TRƯỚC ĐÓ: {actual_total_cost} VND (Vượt ngân sách: {over_budget} VND).

Feedback YÊU CẦU CẮT GIẢM từ CFO: {feedback}

BẢN NHÁP TRƯỚC ĐÓ CỦA BẠN (previous_plan):
{previous_plan}

NẾU previous_plan là "Không có", hãy tạo bản Master Plan mới hoàn toàn. 
NẾU CÓ previous_plan, HÃY CẮT GIẢM/SỬA TRÊN ĐÓ ĐỂ KHÔNG BỊ VƯỢT NGÂN SÁCH.
"""
    ),
])

# ---- CFO Agent Prompt ----
cfo_prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """Bạn là CFO (Giám đốc Tài chính) của công ty.
Nhiệm vụ: Chỉ định CẮT GIẢM ngân sách cho Master Plan khi bị dôi chi phí. (Bạn không cần làm toán, hệ thống Python đã tính số liệu sẵn cho bạn).

NGUYÊN TẮC CẮT GIẢM THÔNG MINH:
- BƯỚC 1: Chỉ định cắt bỏ các hạng mục có priority = "COULD_HAVE" trước (Ghi rõ ở Phase nào).
- BƯỚC 2: Nếu chưa đủ, chỉ định giảm QUY MÔ chi phí các hạng mục "SHOULD_HAVE".
- BƯỚC 3: TUYỆT ĐỐI KHÔNG yêu cầu cắt bỏ các hạng mục "MUST_HAVE".

CÁCH VIẾT feedback_to_planner:
- Ghi rõ: Cần cắt/giảm hạng mục nào, thuộc Phase nào.
- Ví dụ: "Yêu cầu xóa 'Sản xuất Video' (COULD_HAVE) ở Phase 1. Giảm ngân sách 'Booking KOL' ở Phase 2 xuống còn 8,000,000 VND."

""" + JSON_ENFORCEMENT + """

{format_instructions}"""
    ),
    (
        "human",
        """Ngân sách được duyệt: {budget} VND
Tổng chi phí thực tế (do hệ thống máy tính tự cộng): {actual_total_cost} VND
Vượt ngân sách     : {over_budget} VND

Kế hoạch tổng thể (Master Plan):
{master_plan}

Đang bị vượt ngân sách, hãy chỉ định cắt giảm các hoạt động ngay lập tức."""
    ),
])


# =============================================================================
# 4. LLM INITIALIZATION
# =============================================================================

def get_llm(temperature: float = 0.5) -> ChatOllama:
    return ChatOllama(
        model="llama3.2",
        temperature=temperature,
        format="json",
    )


# =============================================================================
# 5. LCEL CHAINS
# =============================================================================

def build_planner_chain():
    # Giảm temperature xuống 0.2 để Planner tập trung tuân lệnh thay vì sáng tạo lung tung khi đang bị ép giảm ngân sách
    llm = get_llm(temperature=0.2) 
    prompt_with_format = planner_prompt.partial(
        format_instructions=planner_parser.get_format_instructions()
    )
    return prompt_with_format | llm | planner_parser


def build_cfo_chain():
    llm = get_llm(temperature=0.0)
    prompt_with_format = cfo_prompt.partial(
        format_instructions=cfo_parser.get_format_instructions()
    )
    return prompt_with_format | llm | cfo_parser


# =============================================================================
# 6. FAULT-TOLERANT EXECUTION
# =============================================================================

@retry(stop=stop_after_attempt(3), wait=wait_fixed(2))
def safe_invoke_chain(chain, inputs: dict, validator=None):
    try:
        result = chain.invoke(inputs)
        if validator:
            validator(result)
        return result
    except OutputParserException as e:
        print(f"\n   ⚠️ [Retry] Ollama xuất JSON lỗi, đang tự động thử lại... ({e.__class__.__name__})")
        raise e
    except Exception as e:
        print(f"\n   🔴 [Lỗi Invoke/Validation] {e}. Đang thử lại...")
        raise e

if __name__ == "__main__":
    print("File agents_core.py v6 — Non-Convergence Fixed")
