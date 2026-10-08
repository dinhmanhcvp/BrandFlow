import { interpolate, useCurrentFrame, Easing, AbsoluteFill } from "remotion";
import { ease } from "./easings";
import { spring as springConf } from "./springs";
import { spring } from "remotion";
import { FPS } from "./beat";

export interface Point {
 x: number;
 y: number;
}

export const useCursorPath = (
 from: Point,
 to: Point,
 startFrame: number,
 durationFrames: number
) => {
 const frame = useCurrentFrame();

 // Cubic bezier logic roughly simulated with sine/cosine or basic interpolation
 // For true curved paths in Remotion, we interpolate along a curve
 const progress = interpolate(
  frame,
  [startFrame, startFrame + durationFrames],
  [0, 1],
  {
   extrapolateLeft: "clamp",
   extrapolateRight: "clamp",
   easing: ease.inOut,
  }
 );

 // Simple curve: offset perpendicular to the line
 const dx = to.x - from.x;
 const dy = to.y - from.y;
 const dist = Math.sqrt(dx * dx + dy * dy);
 
 // Perpendicular vector
 const nx = -dy / dist;
 const ny = dx / dist;

 // Maximum offset at 50% progress, 20% of length
 const maxOffset = dist * 0.2;
 const offsetAmount = Math.sin(progress * Math.PI) * maxOffset;

 const currentX = from.x + dx * progress + nx * offsetAmount;
 const currentY = from.y + dy * progress + ny * offsetAmount;

 return { x: currentX, y: currentY, progress };
};

export const Cursor: React.FC<{
 x: number;
 y: number;
 isClicking: boolean;
}> = ({ x, y, isClicking }) => {
 const frame = useCurrentFrame();
 const clickScale = spring({
  frame: isClicking ? frame : 0,
  fps: FPS,
  config: springConf.snappy,
  durationInFrames: 5,
 });

 const scale = isClicking ? interpolate(clickScale, [0, 1], [1, 0.9]) : 1;

 return (
  <div
   style={{
    position: "absolute",
    left: x,
    top: y,
    transform: `translateZ(100px) scale(${scale})`,
    pointerEvents: "none",
    zIndex: 9999,
    willChange: "transform"
   }}
  >
   <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
     filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
    }}
   >
    <path
     d="M8.25 24.5L3.5 3.5L24.5 14L15.75 16.3333L8.25 24.5Z"
     fill="black"
     stroke="white"
     strokeWidth="2"
     strokeLinejoin="round"
    />
   </svg>
  </div>
 );
};
