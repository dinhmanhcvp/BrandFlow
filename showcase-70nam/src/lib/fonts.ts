/**
 * Nạp phông từ Google Fonts kèm bộ ký tự tiếng Việt, chờ nạp xong mới render.
 * (Gói @remotion/google-fonts cài trong máy thiếu Space Grotesk nên nạp trực tiếp.)
 */
import { continueRender, delayRender } from 'remotion';

const CSS_URL =
  'https://fonts.googleapis.com/css2?' +
  'family=Inter:wght@400;500;600;700' +
  '&family=Space+Grotesk:wght@500;600;700' +
  '&family=Dancing+Script:wght@600;700' +
  '&subset=latin,vietnamese&display=block';

const PROBES = [
  '400 40px "Inter"',
  '500 40px "Inter"',
  '600 40px "Inter"',
  '700 40px "Inter"',
  '500 40px "Space Grotesk"',
  '600 40px "Space Grotesk"',
  '700 40px "Space Grotesk"',
  '700 40px "Dancing Script"',
];

let started = false;

export const ensureFonts = () => {
  if (started || typeof document === 'undefined') return;
  started = true;
  const handle = delayRender('Nạp phông chữ');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = CSS_URL;
  const done = () => continueRender(handle);
  link.onload = () => {
    Promise.all(PROBES.map((p) => document.fonts.load(p, 'Thương hiệu Ắ ữ đ BrandFlow 0123')))
      .then(() => document.fonts.ready)
      .then(done, done);
  };
  link.onerror = done;
  document.head.appendChild(link);
};
