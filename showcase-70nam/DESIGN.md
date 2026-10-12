# CẨM NANG THIẾT KẾ: BRANDFLOW SHOWCASE 70 NĂM ĐH BÁCH KHOA HÀ NỘI

Ấn phẩm trình chiếu dọc 9:16 (1080 × 1920 px) dạng cẩm nang nhận diện thương hiệu kèm hành trình dự án phục vụ Lễ kỷ niệm 70 năm thành lập Đại học Bách khoa Hà Nội (1956 – 2026).

---

## 1. HỆ THỐNG TOKEN THIẾT KẾ (LIGHT THEME)
Toàn bộ màu sắc và bề mặt được trích xuất từ giao diện sáng của hệ thống BrandFlow (`globals.css` và `BrandFlowLogo.tsx`):

| Tên Token | Vai trò | Mã Màu | Tỉ lệ sử dụng |
| :--- | :--- | :--- | :--- |
| `--background` | Màu nền chính | `#F8FAFC` (Slate 50) | 60% |
| `--foreground` | Chữ chính, tiêu đề | `#0F172A` (Slate 900) | 20% |
| `--text-muted` | Chữ phụ, chú thích | `#64748B` (Slate 500) | 8% |
| `gradient-ai (đầu)` | Màu nhấn thương hiệu | `#2563EB` (Blue 600) | 7% |
| `NEON_CYAN` | Màu nhấn công nghệ (Icon/Graphic) | `#06B6D4` (Cyan 500) | 5% |
| `cyanText (suy ra)` | Chữ nhấn tương phản cao | `#0E7490` (Cyan 700) | Điểm xuyết |
| `--surface` | Bề mặt thẻ, bảng | `#FFFFFF` | Nền thẻ |
| `--border` | Đường kẻ, viền mảnh | `#E2E8F0` (Slate 200) | Viền 1.5px |
| `surfaceMuted (suy ra)` | Nền khung giữ chỗ | `#F1F5F9` (Slate 100) | Giữ chỗ |
| `borderStrong (suy ra)` | Viền nét đứt giữ chỗ | `#CBD5E1` (Slate 300) | Giữ chỗ |

---

## 2. HỆ THỐNG LƯỚI & VÙNG AN TOÀN (1080 × 1920 PX)
- **Tỉ lệ khung hình**: Dọc 9:16 (1080 × 1920 px), 30 fps. Hỗ trợ kết xuất `--scale=2` (2160 × 3840 px).
- **Vùng an toàn (Safe Margin)**:
  - Lề hai bên: **72 px** (chiều rộng nội dung hữu dụng: **936 px**).
  - Lề trên: **110 px** (Header chứa logo từ y = 110 px đến y = 222 px).
  - Lề dưới: **140 px** (Footer chứa số trang và nhãn phần từ y = 1736 px).
- **Lưới 6 cột**:
  - Gutter giữa các cột: **24 px**.
  - Chiều rộng mỗi cột: **136 px**.

---

## 3. QUY TẮC CỠ CHỮ & ĐỘ TƯƠNG PHẢN
Theo quy chuẩn trình chiếu trang trọng trước lãnh đạo và đại biểu:
- **Cỡ chữ nhỏ nhất**: **28 px** (nhãn chân trang, chú thích nguồn, nhãn kỹ thuật). Tuyệt đối **không có chữ nào dưới 28 px**.
- **Nội dung thông thường**: Tối thiểu **36 px** – **38 px** (line-height 1.35 – 1.4).
- **Tiêu đề phân cấp**:
  - Tiêu đề mục (H2): **60 px** (font Space Grotesk, 700).
  - Tiêu đề lớn (H1): **78 px** – **84 px**.
  - Số liệu thống kê: **84 px** (font Space Grotesk Tabular, 700).
- **Độ tương phản**:
  - Chữ chính `#0F172A` trên nền `#F8FAFC`: **15.6 : 1** (Vượt chuẩn AAA).
  - Chữ phụ `#64748B` trên nền `#F8FAFC`: **4.7 : 1** (Đạt chuẩn AA).
  - Chữ nhấn `#0E7490` trên nền `#F8FAFC`: **5.2 : 1** (Đạt chuẩn AA).
  - Chữ `#EF4444` trên nền trắng: **4.6 : 1** (Đạt chuẩn AA).

---

## 4. QUY TẮC BIỂU TRƯNG & CO-BRANDING
1. **Biểu trưng kỷ niệm 70 năm ĐHBK Hà Nội**:
   - Sử dụng tệp vector chính thức: `assets/official/logo-ky-niem-70-nam.svg`.
   - Đặt tại góc trên bên phải ở mọi slide (từ Slide 2 đến 11). Chiều cao tối thiểu 72 px.
   - Vùng an toàn quanh logo tối thiểu bằng ½ chiều cao logo.
2. **Slide 1 & Slide 12 (Đồng thương hiệu trang trọng)**:
   - Hai logo đặt cạnh nhau, ngăn cách bằng đường kẻ dọc mảnh cao 74 px màu `#CBD5E1`.
   - Logo sự kiện đứng trước (bên trái), logo BrandFlow đứng sau (bên phải).
3. **Quy tắc cấm kỵ**:
   - Không bóp méo, co giãn lệch tỉ lệ.
   - Không tự ý thay đổi màu sắc nhận diện.
   - Không xoay nghiêng hoặc áp dụng hiệu ứng đổ bóng nặng.

---

## 5. QUY TẮC CHUYỂN ĐỘNG (MOTION DESIGN)
- **Đường cong Easing duy nhất**: `Easing.bezier(0.22, 1, 0.36, 1)` với thuộc tính `extrapolate: 'clamp'`.
- **Chữ và khối vào**:
  - Hiệu ứng: Mờ dần (Opacity $0 \to 1$) kết hợp dịch chuyển lên trên đúng **16 px**.
  - Thời lượng: **0.7 giây**.
  - Độ lệch pha giữa các khối liên tiếp (`stagger`): **0.12 giây**.
- **Chuyển slide**:
  - Mờ dần chéo (`crossfade`) **0.4 giây**, hoàn toàn êm ái, không giật lắc.
- **Họa tiết nền**:
  - Nền hạt trôi nổi và lưới kết nối BrandFlow chuyển động liên tục, nhẹ nhàng (biên độ 25–40 px), tạo cảm giác sống động nhưng không lấn át nội dung.

---

## 6. HƯỚNG DẪN THAY THẾ NỘI DUNG THẬT
Mọi văn bản đều nằm tập trung trong tệp `src/content.ts`, **không viết cứng trong component**:
1. Mở [`src/content.ts`](file:///c:/Users/Admin/Desktop/AI/Brandflow/showcase-70nam/src/content.ts).
2. Điền chuỗi nội dung thật vào thuộc tính `value` của trường tương ứng:
   ```typescript
   export const s02 = {
     mission: sample('Câu sứ mệnh', 110, '', 'BrandFlow là phòng marketing AI...'),
     // Hoặc cập nhật trực tiếp:
     // mission: tf('Câu sứ mệnh', 110, '', '', 'Nội dung sứ mệnh chính thức ở đây'),
   };
   ```
3. Mỗi trường đều có mô tả `max` (giới hạn ký tự khuyến nghị) để đảm bảo không bị tràn chữ.
4. Chạy lệnh kiểm tra:
   ```bash
   npm run check:content
   ```
   Hệ thống sẽ liệt kê chi tiết các trường đã điền và các trường còn dùng khung giữ chỗ.
