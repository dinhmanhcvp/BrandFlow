import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Sfx } from "./Sfx";

export const Typewriter: React.FC<{
  text: string;
  at: number;
  cps?: number;
  endAtBeat?: number;
  style?: React.CSSProperties;
  sfx?: boolean;
}> = ({ text, at, cps = 15, endAtBeat, style, sfx = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const times = useMemo(() => {
    let actualCps = cps;
    if (endAtBeat) {
      // Calculate required cps to finish exactly at endAtBeat
      const durationSeconds = (endAtBeat - at) / fps;
      if (durationSeconds > 0) {
        actualCps = text.length / durationSeconds;
      }
    }

    const per = fps / actualCps;
    const tArr: number[] = [];
    let t = at + 2;
    for (const ch of text) {
      tArr.push(t);
      t += per + (/[ ,.!?]/.test(ch) ? 1 : 0);
    }
    return tArr;
  }, [text, at, cps, endAtBeat, fps]);

  const shown = times.filter((x) => frame >= x).length;
  const typing = shown < text.length;
  const caretOn =
    (typing || frame < (times[times.length - 1] ?? at) + 10) &&
    Math.floor(frame / 8) % 2 === 0;

  return (
    <span style={{ whiteSpace: "pre-wrap", ...style }}>
      {text.slice(0, shown)}
      <span
        style={{
          display: "inline-block",
          width: 2,
          height: "1em",
          marginLeft: 2,
          verticalAlign: "text-bottom",
          background: "var(--accent, #06B6D4)",
          opacity: caretOn ? 1 : 0,
        }}
      />
      {sfx &&
        times.map(
          (x, i) =>
            text[i] !== " " && (
              <Sfx
                key={i}
                at={Math.floor(x)}
                name={`type${(i % 4) + 1}`}
                volume={0.6 + ((i * 7) % 4) * 0.1}
              />
            )
        )}
    </span>
  );
};
