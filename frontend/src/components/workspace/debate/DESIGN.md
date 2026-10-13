# BrandFlow Boardroom Debate — Design System & Architecture Specification

## 1. Triết Lý Thiết Kế: "Phòng Họp & Tờ Kế Hoạch Ở Giữa" (Boardroom Metaphor)

Giao diện **Tranh luận Đa tác nhân** (Multi-Agent Debate) được xây dựng dựa trên ẩn dụ một phòng họp chiến lược cấp cao (Boardroom):
- **Tờ kế hoạch ở giữa là tâm điểm**: Mọi đề xuất của các Trợ lý AI đều được sửa trực tiếp lên tờ kế hoạch này. Mục đang thảo luận được khoanh viền nổi bật, giá trị cũ bị gạch ngang nhẹ (`line-through decoration-red-500/80`), giá trị mới hiển thị cạnh bên màu xanh lục (`text-emerald-500 font-bold`). Người xem thấy trực quan rằng: **"Lời nói tạo ra hệ quả số liệu"**.
- **Không dùng Avatar hoạt hình/robot**: Tránh hoàn toàn các avatar robot hoặc hình vẽ hoạt hình thiếu nghiêm túc. Thay vào đó, mỗi vai trò được đại diện bằng một **ký hiệu hình học tối giản (Geometric Shape)** kèm mã màu định danh từ thiết kế gốc.
- **Thước đo đồng thuận (Consensus Meter)**: Một thanh đo tiến độ thanh lịch phản ánh mức độ gần hay xa của sự đồng thuận giữa 5 Trợ lý (tăng dần từ 25% lên 100% khi thông qua kế hoạch).
- **Công cụ tính toán tài chính độc lập (Financial Verification Engine)**: Một phân hệ thẩm định chi phí độc lập, thực hiện tính toán số liệu dòng tiền, điểm hòa vốn và đóng con dấu sắc nét **"ĐÃ KIỂM TOÁN TÀI CHÍNH"** màu đỏ/vàng khi số liệu khớp với định mức.
- **Nhật ký quyết định (Decision Records Archive)**: Các nghị quyết được chốt sau mỗi vòng tranh luận sẽ tự động trượt vào ngăn lưu trữ lịch sử với nhãn *"✓ Đã lưu vào hồ sơ doanh nghiệp"*.
- **So sánh Trước vs. Sau (Before vs. After)**: Màn hình tổng kết hiển thị song song phương án ban đầu và phương án tối ưu sau khi được Hội đồng thông qua.

---

## 2. Chuẩn Hóa Danh Xưng & Vai Trò (Strict Vietnamese Terminology)

Hệ thống tuân thủ nghiêm ngặt danh xưng tiếng Việt chuyên nghiệp, loại bỏ hoàn toàn các thuật ngữ ngoại lai như CMO, CFO, COO, CEO hay "Protocol":

| Vai Trò Trợ Lý | Tiêu Đề Phụ Trách | Ký Hiệu Hình Học | Màu Nhấn Token | Trách Nhiệm Chiến Lược |
| :--- | :--- | :--- | :--- | :--- |
| **Trợ lý chiến lược** | Phân tích & Tăng trưởng thị trường | **Hình thoi (Diamond)** | `#2563EB` (Xanh dương) | Đề xuất mục tiêu mở rộng thị phần, phân bổ kênh và chiến dịch ra mắt |
| **Trợ lý tài chính** | Kiểm soát dòng tiền & Biên lợi nhuận | **Lục giác (Hexagon)** | `#D97706` (Hổ phách) | Rà soát biên lợi nhuận ròng, áp đặt trần ngân sách bảo toàn vốn lưu động |
| **Trợ lý vận hành** | Năng lực cung ứng & Hiệu suất bếp | **Bát giác (Octagon)** | `#7C3AED` (Tím đậm) | Đánh giá công suất phục vụ, thời gian ra món (TAT), cảnh báo nghẽn |
| **Trợ lý góc nhìn khách hàng** | Chân dung khách hàng & Trải nghiệm | **Bán nguyệt (Semicircle)** | `#0D9488` (Xanh mòng két) | Phân tích hành vi đặt cơm, thói quen đặt nhóm và tối ưu tỷ lệ quay lại |
| **Người quyết định** | Hội đồng quản trị & Chủ doanh nghiệp | **Ngôi sao 4 cánh (Star)** | `#E11D48` (Hồng ngọc) | Cân đối các luồng ý kiến, ký duyệt nghị quyết triển khai cuối cùng |
| **Công cụ tính toán tài chính** | Thẩm định số liệu & Đối soát | Ký hiệu Máy tính | `#059669` (Ngọc bích) | Kiểm tra toán học độc lập, cấp dấu "ĐÃ KIỂM TOÁN TÀI CHÍNH" |

---

## 3. Chuyển Động & Nhịp Điệu (Motion & Timing Tokens)

- **Đường cong chuyển động duy nhất**: `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Nhịp thở người nói (Speaker Breathing Rhythm)**: Trợ lý đang phát biểu sáng rõ và có nhịp thở phóng to nhẹ (`scale: [1, 1.025, 1]`) với chu kỳ 2.4s. Các trợ lý khác dịu xuống (`opacity: 0.55`).
- **Mô phỏng AI suy nghĩ (Simulated AI Thinking Delay)**:
  - Khi bắt đầu một lượt phát biểu, hệ thống kích hoạt trạng thái suy nghĩ kéo dài **1.200ms**.
  - Hiển thị thông điệp ngữ cảnh chuyên biệt: ví dụ *"Trợ lý tài chính đang rà soát biên lợi nhuận ròng 8.4% & chiết khấu App 25%..."*.
  - Biểu tượng xoay vòng mượt mà và huy hiệu đang phân tích dữ liệu.
- **Tốc độ gõ chữ (Typewriter Effect)**: ~30 - 35 ký tự / giây sau khi giai đoạn suy nghĩ kết thúc.
- **Độ trễ kiểm toán tài chính**: Công cụ tính toán hoạt động trong **2.200ms** trước khi chốt trạng thái *"Đã khớp"* hoặc *"Chưa khớp"*.
- **Thời gian giữ mỗi lượt**: ~6.8s - 7.0s đảm bảo người xem đọc trọn vẹn thông tin và thấy được tác động số liệu.
- **Hỗ trợ `prefers-reduced-motion`**: Giảm toàn bộ chuyển động về tức thì (`duration: 0`) khi người dùng cài đặt trợ năng.

---

## 4. Chế Độ Trưng Bày Triển Lãm (`?trungbay=1`)

Dành riêng cho màn hình TV cảm ứng tại triển lãm Kỷ niệm 70 năm Đại học Bách khoa Hà Nội (HUST):
- **Kích hoạt tự động**: Thêm `?trungbay=1` hoặc `?showcase=1` vào URL.
- **Chạy hoàn toàn ngoại tuyến**: Tự động sử dụng dữ liệu kịch bản mẫu từ `showcaseScenarios.ts`, không phụ thuộc vào kết nối API mạng bên ngoài.
- **Chữ to rõ ràng**: Cỡ chữ tối thiểu $\ge 28\text{px}$ cho phụ đề, $\ge 36\text{px}$ cho nội dung phát biểu khi hiển thị trên màn hình đứng tỉ lệ 9:16.
- **Vùng đệm an toàn (Safe Area Margins)**: Lề 72px hai bên, 110px lề trên, 140px lề dưới để không bị che khuất bởi khung viền TV vật lý.
- **Thanh điều khiển cảm ứng nhanh**:
  - Chuyển đổi linh hoạt giữa 3 ngành: F&B (**Bếp Nhà Mộc**), Làm đẹp (**Seoul Glow Clinic**), Giáo dục (**EdTech Master Hub**).
  - Tạm dừng / Tiếp tục (`Play / Pause`).
  - Xem lại phiên tranh luận (`Replay`).
- **Khôi phục tự động sau 60 giây không chạm (60s Idle Auto-Reset)**: Nếu không có tương tác cảm ứng trong 60 giây, hệ thống sẽ tự động quay trở lại kịch bản F&B Bếp Nhà Mộc và chạy vòng lặp từ đầu.

---

## 5. Hướng Dẫn Thêm Kịch Bản Ngành Mới (Adding New Scenarios)

Để bổ sung thêm một ngành kinh doanh mới vào hệ thống:
1. Mở file [showcaseScenarios.ts](file:///c:/Users/Admin/Desktop/AI/Brandflow/frontend/src/components/workspace/debate/showcaseScenarios.ts).
2. Định nghĩa một đối tượng `IndustryScenario` mới theo cấu trúc chuẩn trong [debateTypes.ts](file:///c:/Users/Admin/Desktop/AI/Brandflow/frontend/src/components/workspace/debate/debateTypes.ts):
   ```typescript
   export const MY_NEW_SCENARIO: IndustryScenario = {
     id: 'my_industry_key',
     name: 'Tên ngành tiếng Việt',
     businessName: 'Tên Doanh Nghiệp',
     industryLabel: 'Mô hình kinh doanh',
     tagline: 'Chiến dịch trọng tâm',
     initialPlan: { budget, channels, timeline, operations, pricing },
     finalPlan: { budget, channels, timeline, operations, pricing, highlights },
     turns: [
       // Tối thiểu 5 - 6 turns với targetField, oldValue, newValue, financialCheck
     ]
   };
   ```
3. Đăng ký kịch bản vào đối tượng `SHOWCASE_SCENARIOS` và danh sách nút chọn ngành trên giao diện.
