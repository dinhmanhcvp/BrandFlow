const fs = require('fs');

const ELECTRIC_BLUE = '#3B82F6';
const NEON_CYAN = '#06B6D4';

const leftLines = [
  { d: 'M 15 35 C 30 35, 35 20, 50 20' },
  { d: 'M 8 45 C 25 45, 30 40, 45 40' },
  { d: 'M 8 55 C 25 55, 30 60, 45 60' },
  { d: 'M 15 65 C 30 65, 35 80, 50 80' }
];

const networkLines = [
  { x1: 50, y1: 20, x2: 80, y2: 50 },
  { x1: 50, y1: 20, x2: 65, y2: 50 },
  { x1: 50, y1: 20, x2: 45, y2: 40 },
  { x1: 50, y1: 80, x2: 80, y2: 50 },
  { x1: 50, y1: 80, x2: 65, y2: 50 },
  { x1: 50, y1: 80, x2: 45, y2: 60 },
  { x1: 80, y1: 50, x2: 65, y2: 50 },
  { x1: 80, y1: 50, x2: 45, y2: 40 },
  { x1: 80, y1: 50, x2: 45, y2: 60 },
  { x1: 45, y1: 40, x2: 65, y2: 50 },
  { x1: 45, y1: 40, x2: 45, y2: 60 },
  { x1: 45, y1: 60, x2: 65, y2: 50 },
];

const nodes = [
  { cx: 50, cy: 20, r: 3.5 },
  { cx: 50, cy: 80, r: 3.5 },
  { cx: 80, cy: 50, r: 4 },
  { cx: 65, cy: 50, r: 3 },
  { cx: 45, cy: 40, r: 3 },
  { cx: 45, cy: 60, r: 3 },
  { cx: 15, cy: 35, r: 3 },
  { cx: 8, cy: 45, r: 2.5 },
  { cx: 8, cy: 55, r: 2.5 },
  { cx: 15, cy: 65, r: 3 }
];

let svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="${ELECTRIC_BLUE}" stopOpacity="0.9" />
      <stop offset="100%" stopColor="${NEON_CYAN}" stopOpacity="0.9" />
    </linearGradient>
  </defs>`;

for (let l of leftLines) {
  svg += `\n  <path d="${l.d}" stroke="url(#lineGrad)" stroke-width="1.8" fill="none" stroke-linecap="round" filter="url(#glow)" />`;
}

for (let l of networkLines) {
  svg += `\n  <line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${NEON_CYAN}" stroke-opacity="0.6" stroke-width="1.2" filter="url(#glow)" />`;
}

for (let n of nodes) {
  svg += `\n  <circle cx="${n.cx}" cy="${n.cy}" r="${n.r}" fill="${NEON_CYAN}" filter="url(#glow)" />`;
}

svg += `\n</svg>`;

fs.writeFileSync('../video/public/ref/logos/brandflow_icon.svg', svg);
console.log('Saved brandflow_icon.svg');
