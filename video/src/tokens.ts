export const colors = {
 bg: {
  base: "#0B132B",
  gradient: {
   color1: "rgba(30, 58, 138, 0.35)", // #1E3A8A (Quầng sáng)
   color2: "rgba(88, 28, 135, 0.25)", // #581C87 (Quầng sáng tím)
  }
 },
 text: {
  primary: "#FFFFFF",
  secondary: "#9CA3AF"
 },
 accent: "#22D3EE",
 accentGradient: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
 warning: "#F59E0B",
 danger: "#EF4444",
 success: "#10B981"
};

export const frame = {
 borderRadius: {
  hero: "24px",
  popup: "16px"
 },
 border: "1px solid rgba(255,255,255,0.08)",
 shadows: {
  multi: "0 2px 4px rgba(0,0,0,0.30), 0 12px 24px rgba(0,0,0,0.30), 0 40px 80px rgba(0,0,0,0.45)",
  glow: "0 0 60px rgba(6, 182, 212, 0.30)"
 }
};

export const depth = {
 perspective: "1600px",
 tilt: {
  flat: { rotateX: 0, rotateY: 0, rotateZ: 0 },
  soft: { rotateX: 3, rotateY: -5, rotateZ: 0 },
  hero: { rotateX: 8, rotateY: -18, rotateZ: 1 }
 },
 zLayer: {
  background: 0,
  mainFrame: 0,
  popup: 60,
  tooltipCursor: 100
 }
};

export const type = {
 fonts: {
  main: "Inter, sans-serif"
 },
 scale: {
  display: { fontSize: "140px", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.05 },
  h1: { fontSize: "96px", fontWeight: 650, letterSpacing: "-0.03em", lineHeight: 1.2 },
  h2: { fontSize: "64px", fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.2 },
  body: { fontSize: "36px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.2 },
  caption: { fontSize: "28px", fontWeight: 500, letterSpacing: "-0.01em", lineHeight: 1.2 }
 }
};
