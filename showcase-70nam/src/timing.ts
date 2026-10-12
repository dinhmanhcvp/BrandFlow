/**
 * THỜI GIAN — mọi giá trị viết bằng GIÂY, đổi sang frame bằng sec().
 */
import { Easing } from 'remotion';

export const FPS = 30;

/** Đổi giây → frame. */
export const sec = (seconds: number) => Math.round(seconds * FPS);

/** Easing duy nhất của toàn bộ trình chiếu. */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

export const motion = {
  /** Chữ vào: mờ dần + dịch lên 16px. */
  enterDuration: 0.7,
  enterShift: 16,
  /** Độ lệch giữa các khối. */
  stagger: 0.12,
  /** Trễ trước khối đầu tiên của mỗi slide (sau khi chuyển cảnh xong). */
  firstDelay: 0.3,
  /** Chuyển slide: mờ dần, một kiểu duy nhất. */
  transition: 0.4,
  /** Số đếm tăng (slide 10), chạy một lần. */
  countUp: 1.2,
  /** Chuyển động nổi bật của mỗi slide. */
  highlight: 1.2,
};

/** Thời lượng từng slide (giây), mỗi slide 8–12 giây. Khoá theo id slide. */
export const slideSeconds: Record<string, number> = {
  s01: 9,
  s02: 10,
  s03: 11,
  s04: 10,
  s05: 10,
  s06: 10,
  s07: 10,
  s08: 10,
  s08b: 10,
  s09: 11,
  s10: 10,
  s11: 10,
  s12: 10,
};

/** Chu kỳ chuyển động hạt nền (giây). Video luôn được làm tròn lên bội số để vòng lặp liền mạch. */
export const particleCycle = 20;
