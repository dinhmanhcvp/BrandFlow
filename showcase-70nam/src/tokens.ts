/**
 * TOKEN THIẾT KẾ — lấy từ giao diện sáng của BrandFlow.
 * Nguồn: frontend/src/app/globals.css (:root) và frontend/src/components/brand/BrandFlowLogo.tsx
 * Mọi sắc độ "suy ra" đều ghi chú rõ, không tự tạo bảng màu mới.
 */
export const color = {
  // --- Token gốc (globals.css :root) ---
  background: '#f8fafc', // --background
  surface: '#ffffff', // --surface
  foreground: '#0f172a', // --foreground
  muted: '#64748b', // --text-muted
  border: '#e2e8f0', // --border

  // --- Màu nhấn gốc ---
  blue: '#2563eb', // gradient-ai-bg (globals.css)
  blueLogo: '#3b82f6', // ELECTRIC_BLUE (BrandFlowLogo.tsx)
  cyan: '#06b6d4', // NEON_CYAN (BrandFlowLogo.tsx) — chỉ dùng cho hình, KHÔNG dùng cho chữ (tương phản 2.4:1)

  // --- Sắc độ suy ra (ghi chú) ---
  /** Suy ra: cyan-700 cùng dải Tailwind với #06b6d4, dùng cho CHỮ nhấn (tương phản 5.2:1 trên nền). */
  cyanText: '#0e7490',
  /** Suy ra: slate-100, nền khung giữ chỗ. */
  surfaceMuted: '#f1f5f9',
  /** Suy ra: slate-300, viền nét đứt khung giữ chỗ. */
  borderStrong: '#cbd5e1',
} as const;

export const font = {
  heading: "'Space Grotesk', 'Inter', sans-serif", // globals.css h1–h6
  body: "'Inter', sans-serif", // globals.css body
  wordmark: "'Dancing Script', cursive", // SystemIntro.tsx
} as const;

/** Cỡ chữ ở khung rộng 1080px. Nhỏ nhất 28px, nội dung tối thiểu 36px. */
export const type = {
  display: { fontSize: 112, lineHeight: 1.04, fontWeight: 700, letterSpacing: '-0.025em' },
  h1: { fontSize: 84, lineHeight: 1.08, fontWeight: 700, letterSpacing: '-0.02em' },
  h2: { fontSize: 60, lineHeight: 1.12, fontWeight: 600, letterSpacing: '-0.015em' },
  h3: { fontSize: 44, lineHeight: 1.2, fontWeight: 600, letterSpacing: '-0.01em' },
  body: { fontSize: 38, lineHeight: 1.4, fontWeight: 400, letterSpacing: '0' },
  bodySmall: { fontSize: 36, lineHeight: 1.4, fontWeight: 400, letterSpacing: '0' },
  label: { fontSize: 28, lineHeight: 1.3, fontWeight: 600, letterSpacing: '0.08em' },
  caption: { fontSize: 28, lineHeight: 1.35, fontWeight: 500, letterSpacing: '0' },
} as const;

/** Khung 1080×1920, vùng an toàn và lưới 6 cột. */
export const layout = {
  width: 1080,
  height: 1920,
  marginX: 72,
  top: 110,
  bottom: 140,
  columns: 6,
  gutter: 24,
  get contentWidth() {
    return this.width - this.marginX * 2; // 936
  },
  get column() {
    return (this.contentWidth - this.gutter * (this.columns - 1)) / this.columns; // 136
  },
  /** Chiều rộng của n cột (kèm gutter giữa chúng). */
  span(n: number) {
    return this.column * n + this.gutter * (n - 1);
  },
  headerHeight: 112,
  /** Vùng nội dung bắt đầu sau header + khoảng thở. */
  contentTop: 110 + 112 + 96,
  footerTop: 1920 - 140 - 44,
} as const;

export const radius = { sm: 8, md: 12, lg: 16 } as const; // rounded-lg / rounded-xl / rounded-2xl trong hệ thống
export const stroke = { hair: 1.5, line: 2 } as const;
