import React from "react";
import { useCurrentFrame, AbsoluteFill, Sequence } from "remotion";
import { CameraRig } from "./motion/CameraRig";
import { DeviceFrame } from "./motion/DeviceFrame";
import { TextIn, TextPop, Typewriter } from "./motion/text";
import { Cursor } from "./motion/Cursor";
import { Flare } from "./motion/fx";
import { beat } from "./motion/beat";
import { colors, type } from "./tokens";

export const MotionLab: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg.base }}>
      {/* Background gradients */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: "800px",
          height: "800px",
          background: `radial-gradient(circle, ${colors.bg.gradient.color1} 0%, transparent 70%)`,
          filter: "blur(120px)",
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "20%",
          width: "800px",
          height: "800px",
          background: `radial-gradient(circle, ${colors.bg.gradient.color2} 0%, transparent 70%)`,
          filter: "blur(120px)",
          opacity: 0.25,
        }}
      />
      
      {/* Noise overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          pointerEvents: "none"
        }}
      />

      <Sequence from={0} durationInFrames={beat(16)}>
        <CameraRig preset={frame < beat(8) ? "hero" : "soft"}>
          <DeviceFrame type="hero" className="w-[800px] h-[600px] flex flex-col items-center justify-center relative bg-slate-900/50 backdrop-blur-md">
            
            <Sequence from={beat(1)}>
               <div style={{ ...type.scale.h2, color: colors.text.primary, fontFamily: type.fonts.main }}>
                  <TextIn startFrame={beat(1)}>
                    Hello <span style={{ background: colors.accentGradient, WebkitBackgroundClip: "text", color: "transparent" }}>Remotion</span>
                  </TextIn>
               </div>
            </Sequence>

            <Sequence from={beat(3)}>
               <div style={{ ...type.scale.body, color: colors.text.secondary, marginTop: 20 }}>
                 <Typewriter startFrame={beat(3)} text="Building the motion system..." />
               </div>
            </Sequence>

            <Sequence from={beat(5)}>
               <div style={{ marginTop: 40 }}>
                 <TextPop startFrame={beat(5)}>
                   <div style={{ padding: "16px 32px", background: colors.accent, borderRadius: 8, color: "white", fontWeight: "bold" }}>
                     Click Me
                   </div>
                 </TextPop>
               </div>
            </Sequence>

            <Sequence from={0}>
              <Cursor x={400} y={400} isClicking={frame > beat(7) && frame < beat(7) + 5} />
            </Sequence>

            <Sequence from={beat(7)}>
              <Flare startFrame={beat(7)} />
            </Sequence>

          </DeviceFrame>
        </CameraRig>
      </Sequence>
      
      {/* Beat counter HUD */}
      <div style={{ position: "absolute", bottom: 40, left: 40, color: "white", fontFamily: "monospace", fontSize: 24, zIndex: 9999 }}>
        Frame: {frame} | Beat: {(frame / 15).toFixed(1)}
      </div>
    </AbsoluteFill>
  );
};
