import React, { useMemo } from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { ease } from "./easings";
import { depth } from "../tokens";

export type CameraPreset = "flat" | "soft" | "hero" | "push" | "pull" | "focus";

export const CameraRig: React.FC<{
 children: React.ReactNode;
 preset: CameraPreset;
 startFrame?: number;
 scale?: number;
 x?: number;
 y?: number;
}> = ({ children, preset, startFrame = 0, scale = 1, x = 0, y = 0 }) => {
 const frame = useCurrentFrame();

 const transform = useMemo(() => {
  // Default base styles based on static tilt
  let baseRotateX = depth.tilt.soft.rotateX;
  let baseRotateY = depth.tilt.soft.rotateY;
  let baseRotateZ = depth.tilt.soft.rotateZ;
  let baseScale = scale;

  if (preset === "flat" || preset === "focus") {
   baseRotateX = depth.tilt.flat.rotateX;
   baseRotateY = depth.tilt.flat.rotateY;
   baseRotateZ = depth.tilt.flat.rotateZ;
  } else if (preset === "hero") {
   baseRotateX = depth.tilt.hero.rotateX;
   baseRotateY = depth.tilt.hero.rotateY;
   baseRotateZ = depth.tilt.hero.rotateZ;
  }

  // Dynamic presets
  if (preset === "push") {
   baseScale = interpolate(frame - startFrame, [0, 24], [1, 1.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.inOut,
   });
   baseRotateX = interpolate(frame - startFrame, [0, 24], [depth.tilt.soft.rotateX, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.inOut });
   baseRotateY = interpolate(frame - startFrame, [0, 24], [depth.tilt.soft.rotateY, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.inOut });
  }

  if (preset === "pull") {
   baseScale = interpolate(frame - startFrame, [0, 18], [1.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.out,
   });
  }

  if (preset === "focus") {
   baseScale = 1.5; // Focus scales up
  }

  // Float effect
  const floatY = Math.sin(frame / 40) * 6;
  const floatRotY = Math.sin(frame / 60) * 0.6;

  return `
   perspective(${depth.perspective})
   translate3d(${x}px, ${y + floatY}px, 0)
   scale(${baseScale})
   rotateX(${baseRotateX}deg)
   rotateY(${baseRotateY + floatRotY}deg)
   rotateZ(${baseRotateZ}deg)
  `;
 }, [frame, preset, startFrame, scale, x, y]);

 return (
  <div
   style={{
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transformStyle: "preserve-3d",
    transform,
    willChange: "transform",
   }}
  >
   {children}
  </div>
 );
};
