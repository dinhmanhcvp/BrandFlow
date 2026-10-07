import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

export const Flare: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - startFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(progress, [0, 1], [0, 3]);
  const opacity = interpolate(progress, [0, 1], [0.9, 0]);

  if (frame < startFrame || frame > startFrame + 6) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "200px",
        height: "200px",
        marginLeft: "-100px",
        marginTop: "-100px",
        borderRadius: "50%",
        background: "radial-gradient(circle, #FFF 0%, rgba(6,182,212,0.5) 50%, transparent 100%)",
        mixBlendMode: "screen",
        transform: `scale(${scale})`,
        opacity,
        zIndex: 9999,
        pointerEvents: "none"
      }}
    />
  );
};
