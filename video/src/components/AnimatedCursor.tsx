import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ease } from "../motion/easings";
import { useFxMany } from "./FxStage";

export type Point = { x: number; y: number };
export type Move = { at: number; to: Point | string; frames?: number };

const bez = (a: Point, c1: Point, c2: Point, b: Point, t: number): Point => {
 const u = 1 - t;
 return {
  x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
  y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
 };
};

export const AnimatedCursor: React.FC<{ start: Point; moves: Move[] }> = ({
 start,
 moves,
}) => {
 const frame = useCurrentFrame();
 
 // Extract all string targets
 const targetIds = moves.map((m) => (typeof m.to === "string" ? m.to : null));
 const ctx = useFxMany(targetIds);

 const dests: Point[] = moves.map((m, i) => {
  if (typeof m.to === "string") {
   const rect = ctx[i];
   if (!rect) return start; // Fallback if not found yet (should not happen after measure)
   return { x: rect.cx - rect.w * 0.1, y: rect.cy + rect.h * 0.1 };
  }
  return m.to;
 });

 let pos = start;
 let prev = start;

 moves.forEach((m, i) => {
  const b = dests[i];
  const dist = Math.hypot(b.x - prev.x, b.y - prev.y);
  const dur = m.frames ?? Math.min(36, Math.max(12, Math.round((dist / 1200) * 30)));
  const nx = -(b.y - prev.y) / (dist || 1);
  const ny = (b.x - prev.x) / (dist || 1);
  const bend = dist * 0.2 * (i % 2 === 0 ? 1 : -1);
  const c1 = {
   x: prev.x + (b.x - prev.x) * 0.3 + nx * bend,
   y: prev.y + (b.y - prev.y) * 0.3 + ny * bend,
  };
  const c2 = {
   x: prev.x + (b.x - prev.x) * 0.7 + nx * bend,
   y: prev.y + (b.y - prev.y) * 0.7 + ny * bend,
  };

  if (frame >= m.at + dur) {
   pos = b;
  } else if (frame >= m.at) {
   const t = interpolate(frame, [m.at, m.at + dur], [0, 1], {
    easing: ease.inOut,
   });
   pos = bez(prev, c1, c2, b, t);
  }
  prev = b;
 });

 return (
  <svg
   width={28}
   height={28}
   viewBox="0 0 24 24"
   style={{
    position: "absolute",
    left: 0,
    top: 0,
    pointerEvents: "none",
    zIndex: 9999,
    transform: `translate3d(${pos.x}px, ${pos.y}px, 100px)`,
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,.4))",
    willChange: "transform",
   }}
  >
   <path
    d="M3 2l7 18 2.5-7.5L20 10z"
    fill="#fff"
    stroke="#000"
    strokeWidth="1.2"
    strokeLinejoin="round"
   />
  </svg>
 );
};
