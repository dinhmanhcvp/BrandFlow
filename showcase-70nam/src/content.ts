/**
 * NỘI DUNG TRÌNH CHIẾU — mọi chữ trên slide nằm ở đây, KHÔNG viết cứng trong component.
 *
 * Cách điền nội dung thật: điền vào trường `value` (chuỗi rỗng = chưa có).
 *  - `max`   : giới hạn ký tự khuyến nghị (bố cục đã thử với chuỗi dài bằng `max`).
 *  - `short` / `long` : chuỗi MẪU để thử bố cục, luôn đặt trong ngoặc vuông "[Mẫu: …]".
 *
 * previewMode:
 *  - 'empty' : trường chưa có `value` hiện khung giữ chỗ có thiết kế.
 *  - 'short' : trường chưa có `value` hiện mẫu ngắn.
 *  - 'long'  : trường chưa có `value` hiện mẫu dài (bằng giới hạn ký tự).
 * Có thể ghi đè khi render: --props='{"previewMode":"long"}'
 */

export type PreviewMode = 'empty' | 'short' | 'long';

export const previewMode: PreviewMode = 'empty';

/** Hiện câu khẩu hiệu tiếng Anh gốc dưới khẩu hiệu tiếng Việt. Mặc định tắt. */
export const showEnglishTagline = false;

// ───────────────────────── Kiểu dữ liệu ─────────────────────────

export type TextField = {
  /** Nhãn vai trò, hiện trong khung giữ chỗ. */
  label: string;
  /** Giới hạn ký tự khuyến nghị. */
  max: number;
  /** Nội dung thật. Chuỗi rỗng = chưa có. */
  value: string;
  short: string;
  long: string;
};

export type ImageField = {
  label: string;
  /** Tỉ lệ rộng / cao của khung. */
  ratio: number;
  /** Đường dẫn trong thư mục public/, null = chưa có ảnh. */
  src: string | null;
};

export type MetricField = {
  /** Số thật, null = chưa có. */
  value: number | null;
  /** Số mẫu cho chế độ short / long. */
  sample: number;
  prefix: string;
  suffix: string;
  name: TextField;
  source: TextField;
};

const tf = (label: string, max: number, short: string, long: string, value = ''): TextField => ({
  label,
  max,
  value,
  short,
  long,
});

/** Tạo chuỗi mẫu dài đúng `max` ký tự, luôn trong ngoặc vuông. */
const longSample = (what: string, max: number) => {
  const head = `[Mẫu: ${what} `;
  const filler = 'dài để thử bố cục khi nội dung chạm giới hạn ký tự cho phép của trường này ';
  let s = head;
  while (s.length < max - 1) s += filler;
  return s.slice(0, max - 1).trimEnd() + ']';
};

const sample = (label: string, max: number, shortWhat: string, value = '') =>
  tf(label, max, `[Mẫu: ${shortWhat}]`, longSample(shortWhat, max), value);

// ───────────────────────── Thông tin chung ─────────────────────────

export const brand = {
  name: 'BrandFlow',
  /** Khẩu hiệu tiếng Việt (đã dùng trong bộ slide BK70). */
  tagline: tf('Khẩu hiệu', 48, '', '', 'Thương hiệu của bạn – Trong tầm kiểm soát'),
  /** Câu gốc tiếng Anh, chỉ hiện khi showEnglishTagline = true. */
  taglineEn: 'Your brand. In control.',
  website: 'brand-flow-hust.vercel.app',
  websiteUrl: 'https://brand-flow-hust.vercel.app/',
};

export const event = {
  /** Đường dẫn biểu trưng lễ kỷ niệm (public/). null = hiện khung giữ chỗ nét đứt. */
  logoSrc: 'assets/official/logo-ky-niem-70-nam.svg' as string | null,
  /** Tỉ lệ rộng / cao của biểu trưng (đã cắt lề trắng). */
  logoRatio: 976 / 830,
  name: tf('Tên sự kiện', 80, '', '', 'Kỷ niệm 70 năm thành lập Đại học Bách khoa Hà Nội'),
  years: '1956 – 2026',
};

// ───────────────────────── Slide 1 · Mở đầu ─────────────────────────

export const s01 = {
  section: 'Mở đầu',
  journeyLine: sample('Dòng phụ về hành trình', 90, 'một câu ngắn về hành trình dự án'),
  welcome: tf('Dòng chào mừng', 90, '', '', 'Chào mừng Kỷ niệm 70 năm thành lập Đại học Bách khoa Hà Nội'),
};

// ───────────────────────── Slide 2 · Bản sắc thương hiệu ─────────────────────────

export const s02 = {
  section: 'Bản sắc thương hiệu',
  kicker: 'Sứ mệnh',
  mission: sample('Câu sứ mệnh', 110, 'một câu sứ mệnh của BrandFlow'),
  principlesTitle: 'Ba nguyên tắc',
  principles: [
    { title: sample('Tên nguyên tắc', 32, 'tên nguyên tắc 1'), body: sample('Mô tả ngắn', 90, 'mô tả nguyên tắc 1') },
    { title: sample('Tên nguyên tắc', 32, 'tên nguyên tắc 2'), body: sample('Mô tả ngắn', 90, 'mô tả nguyên tắc 2') },
    { title: sample('Tên nguyên tắc', 32, 'tên nguyên tắc 3'), body: sample('Mô tả ngắn', 90, 'mô tả nguyên tắc 3') },
  ],
};

// ───────────────────────── Slide 3 · Biểu trưng (dữ liệu thật) ─────────────────────────

export const s03 = {
  section: 'Biểu trưng',
  title: 'Biểu trưng BrandFlow',
  lead: 'Biểu tượng dòng chảy hội tụ vào mạng lưới nút, đi cùng chữ ký BrandFlow.',
  clearLabel: 'Vùng an toàn = ½ chiều cao biểu tượng',
  /** ĐỀ XUẤT — hệ thống chưa quy định kích thước nhỏ nhất. */
  minSizeLabel: 'Kích thước nhỏ nhất (đề xuất)',
  minSizeValue: '32 px chiều cao biểu tượng trên màn hình',
  misuseTitle: 'Không sử dụng',
  misuse: ['Kéo giãn', 'Đổi màu', 'Xoay nghiêng'],
  pairingTitle: 'Đặt cạnh biểu trưng sự kiện',
};

// ───────────────────────── Slide 4 · Màu sắc (dữ liệu thật) ─────────────────────────

export const s04 = {
  section: 'Màu sắc',
  title: 'Bảng màu giao diện sáng',
  lead: 'Lấy trực tiếp từ token của hệ thống.',
  ratioTitle: 'Tỉ lệ sử dụng (đề xuất)',
  /** Tỉ lệ sử dụng là ĐỀ XUẤT, hệ thống chưa quy định. Tổng = 100. */
  swatches: [
    { name: 'Nền', token: '--background', hex: '#F8FAFC', share: 60 },
    { name: 'Chữ chính', token: '--foreground', hex: '#0F172A', share: 20 },
    { name: 'Chữ phụ', token: '--text-muted', hex: '#64748B', share: 8 },
    { name: 'Xanh dương', token: 'gradient-ai (đầu)', hex: '#2563EB', share: 7 },
    { name: 'Xanh ngọc', token: 'NEON_CYAN', hex: '#06B6D4', share: 5 },
  ],
  extra: [
    { name: 'Bề mặt', token: '--surface', hex: '#FFFFFF' },
    { name: 'Đường viền', token: '--border', hex: '#E2E8F0' },
  ],
};

// ───────────────────────── Slide 5 · Kiểu chữ (dữ liệu thật) ─────────────────────────

export const s05 = {
  section: 'Kiểu chữ',
  title: 'Kiểu chữ',
  families: [
    { role: 'Tiêu đề', name: 'Space Grotesk', weights: 'Đậm vừa 500 · Nửa đậm 600 · Đậm 700', kind: 'heading' as const },
    { role: 'Nội dung', name: 'Inter', weights: 'Thường 400 · Vừa 500 · Nửa đậm 600 · Đậm 700', kind: 'body' as const },
    { role: 'Chữ ký thương hiệu', name: 'Dancing Script', weights: 'Chỉ dùng cho chữ ký BrandFlow', kind: 'wordmark' as const },
  ],
  specimen: 'Thương hiệu của bạn',
  levels: [
    { name: 'Tiêu đề lớn', spec: '112 / 700', sample: 'Hành trình' },
    { name: 'Tiêu đề 1', spec: '84 / 700', sample: 'Bản sắc thương hiệu' },
    { name: 'Tiêu đề 2', spec: '60 / 600', sample: 'Kế hoạch tiếp theo' },
    { name: 'Nội dung', spec: '38 / 400', sample: 'Tiếng Việt hiển thị đầy đủ dấu: ắ ằ ẳ ẵ ặ ơ ư đ.' },
    { name: 'Chú thích', spec: '28 / 500', sample: 'Nguồn dữ liệu và thời điểm cập nhật' },
  ],
};

// ───────────────────────── Slide 6 & 7 · Hành trình ─────────────────────────

export type Phase = { time: TextField; name: TextField; desc: TextField };

const phase = (n: number): Phase => ({
  time: sample('Thời gian', 20, `mốc ${n}`),
  name: sample('Tên giai đoạn', 40, `tên giai đoạn ${n}`),
  desc: sample('Mô tả ngắn', 100, `mô tả giai đoạn ${n}`),
});

export const s06 = {
  section: 'Hành trình · Phần 1',
  title: 'Những chặng đã đi qua',
  phases: [phase(1), phase(2), phase(3), phase(4)],
};

export const s07 = {
  section: 'Hành trình · Phần 2',
  title: 'Chặng tiếp theo',
  plannedLabel: 'Kế hoạch',
  /** Đánh dấu `planned: true` cho giai đoạn chưa xảy ra (vẽ nét đứt). */
  phases: [
    { ...phase(5), planned: false },
    { ...phase(6), planned: true },
    { ...phase(7), planned: true },
  ],
};

// ───────────────────────── Slide 8 · Thành tích ─────────────────────────

export type Award = { year: TextField; name: TextField; organizer: TextField; result: TextField };

const award = (n: number): Award => ({
  // Năm dùng chuỗi mẫu "[Năm]" để không giống số thật
  year: tf('Năm', 6, '[Năm]', '[Năm]'),
  name: sample('Tên giải thưởng', 70, `tên giải thưởng ${n}`),
  organizer: sample('Đơn vị tổ chức', 60, `đơn vị tổ chức ${n}`),
  result: sample('Kết quả', 24, `kết quả ${n}`),
});

export const s08 = {
  section: 'Thành tích',
  title: 'Thành tích',
  columns: { year: 'Năm', name: 'Tên giải', organizer: 'Đơn vị tổ chức', result: 'Kết quả' },
  /** Tối đa 6 hàng mỗi slide. Hơn 6 hàng sẽ tự tách sang slide 8b. */
  rowsPerSlide: 6,
  awards: [1, 2, 3, 4, 5, 6].map((n) => award(n)),
};

// ───────────────────────── Slide 9 · Sản phẩm ─────────────────────────

export const s09 = {
  section: 'Sản phẩm',
  title: 'Sản phẩm',
  main: { label: 'Trang chủ BrandFlow', ratio: 2576 / 1449, src: 'assets/screens/home.png' } as ImageField,
  url: 'brand-flow-hust.vercel.app',
  heading: sample('Tên tính năng chính', 50, 'tên tính năng chính'),
  desc: sample('Mô tả ngắn', 140, 'mô tả ngắn về sản phẩm'),
  secondary: [
    { label: 'Ảnh sẽ bổ sung', ratio: 16 / 10, src: null } as ImageField,
    { label: 'Ảnh sẽ bổ sung', ratio: 16 / 10, src: null } as ImageField,
  ],
  secondaryCaptions: [sample('Chú thích ảnh', 40, 'chú thích ảnh 1'), sample('Chú thích ảnh', 40, 'chú thích ảnh 2')],
};

// ───────────────────────── Slide 10 · Kết quả bước đầu ─────────────────────────

const metric = (n: number, smp: number, suffix = ''): MetricField => ({
  value: null,
  sample: smp,
  prefix: '',
  suffix,
  name: sample('Tên chỉ số', 48, `tên chỉ số ${n}`),
  source: sample('Nguồn và thời điểm', 60, `nguồn, tháng/năm`),
});

export const s10 = {
  section: 'Kết quả bước đầu',
  title: 'Kết quả bước đầu',
  /** Tối đa 4 chỉ số. */
  metrics: [metric(1, 120), metric(2, 4500), metric(3, 36, '%'), metric(4, 12)],
};

// ───────────────────────── Slide 11 · Ghi nhận ─────────────────────────

export const s11 = {
  section: 'Ghi nhận',
  title: 'Ghi nhận',
  teamTitle: 'Nhóm thực hiện',
  team: [1, 2, 3, 4, 5].map((n) => ({
    name: sample('Họ và tên', 32, `họ tên thành viên ${n}`),
    role: sample('Vai trò', 36, `vai trò ${n}`),
  })),
  advisorTitle: 'Giảng viên hướng dẫn',
  advisors: [1, 2].map((n) => ({
    name: sample('Họ tên, học hàm học vị', 44, `giảng viên ${n}`),
    unit: sample('Đơn vị', 50, `đơn vị công tác ${n}`),
  })),
  partnerTitle: 'Đơn vị đồng hành',
  partners: [1, 2, 3].map((n) => ({ label: `Biểu trưng đơn vị ${n}`, ratio: 2, src: null }) as ImageField),
  thanks: sample('Lời cảm ơn', 120, 'lời cảm ơn'),
};

// ───────────────────────── Slide 12 · Kết ─────────────────────────

export const s12 = {
  section: 'Kết',
  qrLabel: 'Quét mã để trải nghiệm',
  closing: sample('Lời kết', 80, 'một câu kết ngắn'),
};
