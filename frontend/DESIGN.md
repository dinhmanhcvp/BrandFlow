# TÀI LIỆU THIẾT KẾ: TRANG CHỦ LỄ KỶ NIỆM 70 NĂM ĐẠI HỌC BÁCH KHOA HÀ NỘI
## Ý tưởng chủ đạo: "Từ bảy mươi năm đến một không gian liên ngành"

---

## 1. TỔNG QUAN VÀ TRIẾT LÝ THIẾT KẾ
- **Bối cảnh**: Chào mừng Lễ kỷ niệm 70 năm thành lập Trường Đại học Bách khoa Hà Nội (1956 – 2026) và Lễ khánh thành Không gian Đổi mới sáng tạo liên ngành.
- **Vai trò kép**: Trang chủ vừa đóng vai trò là màn hình trưng bày tự động tại không gian sự kiện, vừa là cổng vào trực tiếp của sản phẩm BrandFlow đang hoạt động thật.
- **Phong cách thị giác (Visual DNA)**: Bản vẽ kỹ thuật (Engineering Blueprint) trên nền giấy ngà.
  - Sử dụng mạng lưới ô vuông nhạt (faint grid), vạch chia thước kẻ milimet ở các cạnh lề, đường kích thước mảnh 1.5px, dấu định vị tọa độ và mã tham chiếu kỹ thuật.
  - Gợi lên hình ảnh người kỹ sư Bách khoa chân thực, trang trọng, tối giản, tinh tế mà không cần dùng đến hình minh họa trừu tượng hay avatar robot.
  - Tuyệt đối không dùng: neon, kính mờ (glassmorphism), gradient mesh sặc sỡ, hạt sáng chuyển động hỗn loạn, đổ bóng đậm hay thẻ bo góc tròn lớn.

---

## 2. HỆ THỐNG TOKEN THIẾT KẾ (LIGHT THEME - BẢN VẼ KỸ THUẬT)
Toàn bộ màu sắc và bề mặt được kế thừa từ hệ thống token của BrandFlow kết hợp nhận diện trang trọng của Trường Đại học Bách khoa Hà Nội:

| Token | Mã màu | Vai trò & Tỉ lệ sử dụng | Độ tương phản (trên nền) |
| :--- | :--- | :--- | :--- |
| **Nền giấy ngà (Ivory Paper)** | `#FBF9F4` | Nền chính của toàn trang (60%) | — |
| **Bề mặt bản vẽ (Drawing Surface)** | `#FAF7F2` | Bề mặt các khung chi tiết, thẻ kỹ thuật | — |
| **Chữ than đá (Deep Charcoal Ink)** | `#1C1917` (Stone 900) | Tiêu đề, số liệu chính (20%) | **14.8 : 1** (Vượt chuẩn AAA) |
| **Chữ xám chì (Technical Muted)** | `#78716C` (Stone 500) | Phụ đề, chú thích kỹ thuật, nguồn dữ liệu (10%) | **4.9 : 1** (Đạt chuẩn AA) |
| **Đỏ Bách khoa (HUST Crimson)** | `#990012` | Màu nhấn nhận diện chính của trường (7%) | **6.8 : 1** (Đạt chuẩn AA) |
| **Xanh kỹ thuật (Blueprint Cyan)** | `#0E7490` (Cyan 700) | Điểm hội tụ BrandFlow, nút liên kết (3%) | **5.4 : 1** (Đạt chuẩn AA) |
| **Lưới kỹ thuật (Faint Grid)** | `rgba(120, 113, 108, 0.05)` | Lưới ô vuông 24px nét mảnh | — |
| **Đường kích thước (Dimension Line)** | `#D6D3D1` / `#CBD5E1` | Đường kẻ 1.5px, vạch chia thước | — |
| **Bo góc (Corner Radius)** | `rounded-xs` (2px) / `rounded-sm` (4px) | Tối đa 4px, giữ góc cạnh kỹ thuật chính xác | — |

---

## 3. HỆ THỐNG LƯỚI & KHUNG HÌNH (16:9 VÀ 9:16)
Trang được tối ưu cho cả hai tỷ lệ màn hình trưng bày và thiết bị cá nhân:
- **Màn hình ngang 16:9 (Desktop / TV ngang / Máy chiếu)**:
  - Chiều rộng tối đa: `max-w-7xl` (1280px) căn giữa.
  - Lưới linh hoạt 12 cột, khoảng cách cột 24px - 32px.
- **Màn hình dọc 9:16 (Màn hình cảm ứng đứng 1080 × 1920 px)**:
  - Vùng an toàn (Safe Area Margin):
    - Lề hai bên: **72 px** (độ rộng hữu dụng: 936 px).
    - Lề trên: **110 px** (tránh thanh định vị và khung viền TV).
    - Lề dưới: **140 px** (tránh che khuất chân đế và tầm mắt đứng).
- **Quy chuẩn cỡ chữ cho khoảng cách xem 2 – 3 mét**:
  - Chữ nhỏ nhất: $\ge 28\text{px}$ ở độ phân giải 1080p (nhãn chân trang, nguồn số liệu).
  - Nội dung thông thường: $\ge 36\text{px}$.
  - Tiêu đề mục: $48\text{px} - 64\text{px}$.
  - Con số tâm điểm "70": $160\text{px} - 200\text{px}$.

---

## 4. QUY TẮC ĐỒNG THƯƠNG HIỆU & BIỂU TRƯNG
Dải đầu trang sắp xếp 4 biểu trưng đứng cạnh nhau theo thứ tự ưu tiên:
1. **Biểu trưng Đại học Bách khoa Hà Nội**: Huy hiệu sao vàng compa bánh răng và dòng chữ chính thức. Đặt ở vị trí trang trọng đầu tiên.
2. **Biểu trưng Kỷ niệm 70 năm**: Số 70 cách điệu với mũi tên, vi mạch bán dẫn và bánh răng cơ khí (`logo-ky-niem-70-nam.svg`).
3. **Biểu trưng Không gian Đổi mới sáng tạo liên ngành**: Khung giữ chỗ nét đứt đúng kích thước kèm nhãn `[CẦN ĐIỀN]`.
4. **Biểu trưng BrandFlow**: Mạng lưới nút và chữ ký thương hiệu.

*Khoảng cách và vùng an toàn*: Mỗi logo được ngăn cách bởi đường kẻ dọc mảnh 1.5px (`bg-stone-300`), vùng an toàn tối thiểu bằng $\frac{1}{2}$ chiều cao của logo.

---

## 5. HỌA TIẾT DUY NHẤT & CHUYỂN ĐỘNG (MOTION DESIGN)
- **Họa tiết duy nhất**: Mạng lưới nút và sợi nối mảnh lấy từ biểu trưng BrandFlow.
- **Khoang 70 năm, 70 nút**:
  - 70 nút tương ứng với 70 năm lịch sử (1956 đến 2026).
  - Nút cuối cùng (2026) là điểm hội tụ BrandFlow.
  - Khi nút thứ 70 được kết nối, toàn bộ mạng lưới sáng lên một nhịp rồi dịu lại nhẹ nhàng (chỉ một lần mỗi vòng).
  - Mạng lưới chiếm dưới 25% diện tích khoang, không đè lên chữ.
- **Đường cong Easing duy nhất**: `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Nguyên tắc chuyển động**:
  - Chỉ sử dụng các thuộc tính hiệu năng cao: `transform` và `opacity`.
  - Không có hiệu ứng nảy (spring), không giật quá đà.
  - Tôn trọng `prefers-reduced-motion`: khi người dùng bật giảm chuyển động, trang tự động vô hiệu hóa vòng lặp cuộn tự động và giữ các trạng thái tĩnh sắc nét.

---

## 6. CẤU TRÚC 9 KHOANG NỘI DUNG

1. **Dải đầu trang**: Cụm 4 biểu trưng đồng thương hiệu, công tắc tạm dừng vòng lặp, nút vào ứng dụng.
2. **Khoang mở đầu**: Con số 70 cỡ lớn là điểm nhìn chính, dòng chào mừng hai sự kiện, một câu giới thiệu BrandFlow, tem kiểm duyệt bản vẽ kỹ thuật.
3. **Khoang "bảy mươi năm, bảy mươi nút"**: Mạng lưới SVG 70 nút (1956 - 2026), tương tác nhấp xem chi tiết từng mốc năm, đường nối nét đứt mảnh.
4. **Khoang liên ngành**: 4 nhánh ngành chính (CNTT & KHMT, HTTT & KHDL, QTKD & Tiếp thị số, Thiết kế & TT Thị giác) với các sợi nối hội tụ về điểm BrandFlow.
5. **Khoang kết quả**: 4 con số lớn kiểm chứng thực tế:
   - 112 doanh nghiệp dùng thử (Nhật ký hệ thống BrandFlow, 10/2026).
   - 54 doanh nghiệp trải nghiệm tròn 1 tháng (Nhật ký hệ thống BrandFlow, 10/2026).
   - 5 doanh nghiệp rời đi (Khảo sát người dùng BrandFlow, 10/2026).
   - 2 công ty đề nghị đưa vào phòng tiếp thị 30 nhân sự (Biên bản hợp tác, 10/2026).
6. **Khoang thước đo**: Hai thước đo kỹ thuật đặt cạnh nhau:
   - Thước dài: "2 đến 4 tuần" (Cách làm truyền thống: thuê công ty dịch vụ hoặc phân tích thủ công).
   - Thước ngắn: "khoảng 8 phút" (BrandFlow: đa trợ lý trí tuệ nhân tạo làm việc song song).
7. **Khoang hành động**: Ba nút lớn liên kết vào tính năng thực tế:
   - "Xem các trợ lý tranh luận" $\to$ `/workspace?stage=1`
   - "Thử với doanh nghiệp của bạn" (chọn mẫu Bếp Nhà Mộc) $\to$ `/onboarding`
   - "Xem bản kế hoạch mẫu" $\to$ `/workspace?stage=2`
   - Nút nhỏ "Đăng nhập tài khoản" $\to$ `/login`
8. **Khoang ghi nhận**: Nhóm sinh viên thực hiện, giảng viên hướng dẫn, đơn vị đồng hành, lời cảm ơn tri ân nhà trường và Thầy Cô.
9. **Chân trang**: Mã QR quét truy cập trực tiếp bằng điện thoại, địa chỉ website `brand-flow-hust.vercel.app`, nhãn `[Dữ liệu minh họa]`.

---

## 7. HƯỚNG DẪN CẤU HÌNH & BẬT/TẮT HAI CHẾ ĐỘ

### 7.1. Chuyển đổi giữa Chế độ Lễ kỷ niệm và Chế độ Thường
Tất cả được quản lý qua tệp [`frontend/src/config/anniversary.ts`](file:///c:/Users/Admin/Desktop/AI/Brandflow/frontend/src/config/anniversary.ts):

```typescript
export const ANNIVERSARY_CONFIG = {
  // Đặt true khi sự kiện đang diễn ra; đặt false khi sự kiện kết thúc
  SHOWCASE_DEFAULT: false,

  // Kích hoạt tức thì qua URL query param:
  // http://localhost:3000/?trungbay=1 hoặc http://localhost:3000/?showcase=1
  URL_PARAM_KEYS: ['trungbay', 'showcase'],

  // Thời gian chạy lặp tự động (50 giây)
  LOOP_DURATION_MS: 50000,

  // Thời gian không chạm để tự động quay lại vòng lặp (60 giây)
  IDLE_TIMEOUT_MS: 60000,

  // Bật true để hiện tên đối tác Ameka và Kite Lab (false = ẩn danh)
  ALLOW_NAMING_PARTNERS: false
};
```

- **Khi `SHOWCASE_DEFAULT: false`**: Trang chủ là giao diện mặc định ban đầu, có thêm dải banner chúc mừng nhỏ ở trên cùng (có thể đóng).
- **Khi truy cập `?trungbay=1` hoặc `SHOWCASE_DEFAULT: true`**: Kích hoạt toàn bộ 9 khoang Lễ kỷ niệm bản vẽ kỹ thuật.

### 7.2. Hướng dẫn thay đổi nội dung văn bản
Toàn bộ chuỗi văn bản nằm tại [`frontend/src/content/lekyniem.ts`](file:///c:/Users/Admin/Desktop/AI/Brandflow/frontend/src/content/lekyniem.ts). **Tuyệt đối không sửa trực tiếp trong component**.

### 7.3. Lệnh kiểm tra quy tắc nội dung và từ ngữ
- Kiểm tra các từ vi phạm tiếng Anh và từ khoa trương:
  ```bash
  npm run check:lang
  ```
- Rà soát các vị trí đang điền `[CẦN ĐIỀN]`:
  ```bash
  npm run check:content
  ```
