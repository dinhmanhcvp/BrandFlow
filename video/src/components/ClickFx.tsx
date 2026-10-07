import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { spring as springConf } from "../motion/springs";
import { useFx } from "./FxStage";
import { Sfx } from "./Sfx";
import { colors } from "../tokens";

export const REACT_DELAY = 4;

export const useClickPress = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hover before click
  const isHovering = frame >= at - 4 && frame < at;
  const hoverScale = isHovering ? 1.02 : 1;
  const hoverBrightness = isHovering ? 1.06 : 1;

  // Press down
  let scale = 1;
  if (frame >= at) {
    if (frame < at + 3) {
      scale = interpolate(frame, [at, at + 3], [1, 0.95]);
    } else {
      scale = interpolate(
        spring({
          frame: frame - (at + 3),
          fps,
          config: springConf.snappy,
        }),
        [0, 1],
        [0.95, 1]
      );
    }
  }

  return {
    transform: `scale(${isHovering ? hoverScale : scale}) translateY(${isHovering ? "-2px" : "0px"})`,
    filter: `brightness(${hoverBrightness})`,
    transition: "none",
  };
};

export const ClickFx: React.FC<{
  at: number;
  targetId?: string;
  point?: { x: number; y: number };
}> = ({ at, targetId, point }) => {
  const frame = useCurrentFrame();
  
  // Safe measurement
  let cx = point?.x || 0;
  let cy = point?.y || 0;
  
  if (targetId) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const rect = useFx(targetId);
    if (rect) {
      cx = rect.cx;
      cy = rect.cy;
    }
  }

  if (frame < at || frame > at + 14) return null;

  const rippleRadius = interpolate(frame, [at, at + 14], [0, 48], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [at, at + 14], [0.4, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: cx - 48,
          top: cy - 48,
          width: 96,
          height: 96,
          borderRadius: "50%",
          backgroundColor: colors.accent,
          opacity,
          transform: `scale(${rippleRadius / 48})`,
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />
      <Sfx at={at} name="click" volume={0.8} />
    </>
  );
};
