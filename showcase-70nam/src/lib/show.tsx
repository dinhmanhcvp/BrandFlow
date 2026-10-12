import React, { createContext, useContext } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import type { MetricField, PreviewMode, TextField } from '../content';
import { EASE, motion, sec } from '../timing';

// ───────── Ngữ cảnh trình chiếu ─────────

export type ShowCtx = {
  mode: PreviewMode;
  showEnglishTagline: boolean;
  /** Frame bắt đầu của slide hiện tại trên dòng thời gian tổng (cho nền hạt). */
  slideStart: number;
  totalFrames: number;
  index: number;
  count: number;
  section: string;
};

export const ShowContext = createContext<ShowCtx>({
  mode: 'empty',
  showEnglishTagline: false,
  slideStart: 0,
  totalFrames: 1,
  index: 0,
  count: 12,
  section: '',
});

export const useShow = () => useContext(ShowContext);

// ───────── Giải nội dung theo chế độ ─────────

export type Resolved = { text: string; placeholder: boolean; label: string; max: number };

export const resolveText = (f: TextField, mode: PreviewMode): Resolved => {
  if (f.value.trim()) return { text: f.value, placeholder: false, label: f.label, max: f.max };
  if (mode === 'empty') return { text: f.label, placeholder: true, label: f.label, max: f.max };
  return { text: mode === 'short' ? f.short : f.long, placeholder: false, label: f.label, max: f.max };
};

export const useText = (f: TextField) => resolveText(f, useShow().mode);

export const resolveMetric = (m: MetricField, mode: PreviewMode): number | null => {
  if (m.value !== null) return m.value;
  return mode === 'empty' ? null : m.sample;
};

/** Trường đang hiện chuỗi mẫu (chưa có nội dung thật) ở chế độ short/long. */
export const isSample = (f: TextField, mode: PreviewMode) => !f.value.trim() && mode !== 'empty';

// ───────── Chuyển động ─────────

/** Tiến trình 0→1 theo easing duy nhất, luôn clamp. */
export const useProgress = (startSec: number, durationSec: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [sec(startSec), sec(startSec + durationSec)], [0, 1], {
    easing: EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

/** Thời điểm bắt đầu của khối thứ i trong slide. */
export const at = (i: number) => motion.firstDelay + i * motion.stagger;

/** Khối vào bằng mờ dần + dịch lên 16px. */
export const Reveal: React.FC<{
  i: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ i, children, style }) => {
  const p = useProgress(at(i), motion.enterDuration);
  return (
    <div style={{ ...style, opacity: p, transform: `translateY(${(1 - p) * motion.enterShift}px)` }}>
      {children}
    </div>
  );
};
