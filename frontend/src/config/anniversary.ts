/**
 * CẤU HÌNH CỜ TÍNH NĂNG (FEATURE FLAG) CHO TRANG CHỦ LỄ KỶ NIỆM 70 NĂM
 * 
 * - Mặc định SHOWCASE_DEFAULT = false (hoặc true khi sự kiện đang diễn ra).
 * - Có thể bật linh hoạt qua URL param: ?trungbay=1 hoặc ?showcase=1.
 * - Khi kết thúc sự kiện: chỉ cần đặt SHOWCASE_DEFAULT = false,
 *   toàn bộ trang chủ BrandFlow tự động trở về giao diện gốc 100%.
 */

export const ANNIVERSARY_CONFIG = {
  // Cờ cấu hình toàn hệ thống
  SHOWCASE_DEFAULT: false,

  // Tham số URL để kích hoạt
  URL_PARAM_KEYS: ['trungbay', 'showcase'],

  // Thời gian vòng lặp trình chiếu tự động (mili-giây) - 50 giây
  LOOP_DURATION_MS: 50000,

  // Thời gian không chạm để tự động quay lại vòng lặp (mili-giây) - 60 giây
  IDLE_TIMEOUT_MS: 60000,

  // Cho phép hiện tên đối tác Ameka và Kite Lab (false = ẩn danh "công ty dịch vụ truyền thông tiếp thị")
  ALLOW_NAMING_PARTNERS: false
};
