import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { ease } from "./easings";
import { spring as springConf } from "./springs";
import { spring } from "remotion";
import { FPS } from "./beat";

export const TextIn: React.FC<{
 children: React.ReactNode;
 startFrame: number;
}> = ({ children, startFrame }) => {
 const frame = useCurrentFrame();
 const progress = interpolate(frame - startFrame, [0, 9], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: ease.out,
 });

 const translateY = interpolate(progress, [0, 1], [24, 0]);
 const blur = interpolate(progress, [0, 1], [8, 0]);

 return (
  <div
   style={{
    opacity: progress,
    transform: `translateY(${translateY}px)`,
    filter: `blur(${blur}px)`,
   }}
  >
   {children}
  </div>
 );
};

export const TextPop: React.FC<{
 children: React.ReactNode;
 startFrame: number;
}> = ({ children, startFrame }) => {
 const frame = useCurrentFrame();
 
 const scale = spring({
  frame: frame - startFrame,
  fps: FPS,
  config: springConf.popText,
  from: 0.8,
  to: 1.0,
 });

 const opacity = interpolate(frame - startFrame, [0, 4], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
 });

 return (
  <div
   style={{
    opacity,
    transform: `scale(${scale})`,
    display: "inline-block",
   }}
  >
   {children}
  </div>
 );
};

export const Typewriter: React.FC<{
 text: string;
 startFrame: number;
}> = ({ text, startFrame }) => {
 const frame = useCurrentFrame();
 const framesPerChar = 2; // 15 chars/sec @ 30fps
 
 const visibleChars = Math.max(0, Math.floor((frame - startFrame) / framesPerChar));
 const displayedText = text.substring(0, visibleChars);
 
 const showCursor = Math.floor(frame / 8) % 2 === 0;

 return (
  <span>
   {displayedText}
   <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
  </span>
 );
};
