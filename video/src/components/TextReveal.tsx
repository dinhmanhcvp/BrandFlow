import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { FPS } from "../motion/beat";
import { ease } from "../motion/easings";
import { spring as springConf } from "../motion/springs";
import { Sfx } from "./Sfx";

export const TextReveal: React.FC<{
  text: string;
  at: number;
  preset?: "in" | "stagger" | "pop";
  out?: number;
}> = ({ text, at, preset = "in", out }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");

  if (out && frame >= out) {
    const progressOut = interpolate(frame, [out, out + 6], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease.in,
    });
    return (
      <span style={{ opacity: 1 - progressOut, transform: `translateY(${-12 * progressOut}px)`, display: "inline-block" }}>
        {text}
      </span>
    );
  }

  if (preset === "in") {
    const progress = interpolate(frame, [at, at + 9], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: ease.out,
    });
    return (
      <span style={{ opacity: progress, transform: `translateY(${24 * (1 - progress)}px)`, display: "inline-block", filter: `blur(${8 * (1 - progress)}px)` }}>
        {text}
      </span>
    );
  }

  const wordDelay = Math.min(3, Math.floor(15 / words.length));

  return (
    <span>
      {words.map((word, i) => {
        const wAt = at + i * wordDelay;
        
        if (preset === "pop") {
          const wScale = spring({ frame: frame - wAt, fps: FPS, config: springConf.popText, from: 0.8, to: 1.0 });
          const wOp = interpolate(frame, [wAt, wAt + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          
          return (
            <span key={i} style={{ display: "inline-block", marginRight: "0.25em", opacity: wOp, transform: `scale(${wScale})` }}>
              {word}
              {wOp > 0 && <Sfx at={wAt} name="pop" volume={0.4} />}
            </span>
          );
        }

        // Stagger
        const progress = interpolate(frame, [wAt, wAt + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.out });
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.25em", opacity: progress, transform: `translateY(${24 * (1 - progress)}px)`, filter: `blur(${8 * (1 - progress)}px)` }}>
            {word}
          </span>
        );
      })}
    </span>
  );
};

export const StampText: React.FC<{ at: number; text: string; color?: string }> = ({ at, text, color = '#EF4444' }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  
  const scale = interpolate(frame, [at, at + 4], [1.6, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease.in
  });
  
  // Shake for 6 frames after stamp
  let shakeX = 0;
  let shakeY = 0;
  if (frame >= at + 4 && frame < at + 10) {
    const i = frame - (at + 4);
    shakeX = [4, -4, 3, -3, 2, -1][i] || 0;
    shakeY = [-3, 3, -2, 2, -1, 1][i] || 0;
  }
  
  return (
    <div style={{
      display: 'inline-block',
      color,
      fontWeight: 900,
      transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)`,
      textTransform: 'uppercase',
      textShadow: `0 0 12px ${color}80`
    }}>
      {text}
    </div>
  );
};
