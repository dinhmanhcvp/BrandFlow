import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { beat } from "./motion/beat";
import { SceneShell } from "./components/SceneShell";
import { AnimatedCursor } from "./components/AnimatedCursor";
import { ClickFx } from "./components/ClickFx";
import { Typewriter } from "./components/Typewriter";
import { ReplaceText } from "./components/ReplaceText";
import { TextReveal } from "./components/TextReveal";
import { KeywordLine } from "./components/KeywordLine";
import { PopCard, Highlight, ScanReveal, FocusMask } from "./components/Fx";
import { colors, type } from "./tokens";
import { Flare } from "./motion/fx";

const DemoUI = () => (
  <div style={{ width: "100%", height: "100%", padding: 80, display: "flex", flexDirection: "column", gap: 40, color: "white", fontFamily: type.fonts.main }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div data-fx="logo" style={{ fontSize: 32, fontWeight: "bold" }}>BrandFlow</div>
      <div data-fx="btn-1" style={{ padding: "16px 32px", background: colors.accent, borderRadius: 8, cursor: "pointer" }}>Start Now</div>
    </div>

    <div style={{ fontSize: 64, fontWeight: "bold", marginTop: 100 }}>
      <TextReveal preset="stagger" text="Design your brand" at={beat(1)} />
    </div>

    <div style={{ fontSize: 36, color: colors.text.secondary }}>
      <Typewriter at={beat(3)} text="Automate all your marketing effortlessly." />
    </div>

    <div style={{ marginTop: 80, display: "flex", gap: 20 }}>
      <div data-fx="card-1" style={{ width: 300, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: 16 }} />
      <div data-fx="card-2" style={{ width: 300, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: 16 }} />
      <div data-fx="card-3" style={{ width: 300, height: 400, background: "rgba(255,255,255,0.05)", borderRadius: 16 }} />
    </div>
  </div>
);

export const ComponentLab: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <SceneShell
        tilt="soft"
        shots={[
          { at: beat(10), type: 'push', target: 'card-2' },
          { at: beat(14), type: 'focus', target: 'card-2' },
          { at: beat(18), type: 'pull' },
        ]}
        screen={<DemoUI />}
      >
        <Sequence from={0}>
          <AnimatedCursor 
            start={{ x: 800, y: 800 }} 
            moves={[
              { at: beat(4), to: "btn-1" },
              { at: beat(12), to: "card-2" }
            ]} 
          />
          <ClickFx at={beat(5) + 3} targetId="btn-1" />
          <Highlight at={beat(5)} target="logo" />
          <FocusMask at={beat(14)} target="card-2" hold={beat(4)} />
          <ScanReveal at={beat(15)} target="card-2" />
        </Sequence>
      </SceneShell>

      {/* Frame counter */}
      <div style={{ position: "absolute", bottom: 20, left: 20, color: "white", fontSize: 24, zIndex: 9999 }}>
        Frame: {frame} | Beat: {(frame / 15).toFixed(1)}
      </div>
    </AbsoluteFill>
  );
};
