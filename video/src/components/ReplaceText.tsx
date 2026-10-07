import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { ease } from "../motion/easings";
import { Typewriter } from "./Typewriter";
import { Sfx } from "./Sfx";

export const ReplaceText: React.FC<{
  before: string;
  after: string;
  selectWord: string;
  at: number;
}> = ({ before, after, selectWord, at }) => {
  const frame = useCurrentFrame();

  const parts = before.split(selectWord);
  if (parts.length !== 2) {
    throw new Error("selectWord must appear exactly once in before text");
  }

  const highlightStart = at;
  const highlightEnd = at + 8;
  const deleteAt = highlightEnd + 4;

  const highlightProgress = interpolate(frame, [highlightStart, highlightEnd], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease.out,
  });

  if (frame >= deleteAt) {
    return (
      <span>
        {parts[0]}
        <Typewriter text={after} at={deleteAt} />
        {parts[1]}
        <Sfx at={deleteAt} name="tick" volume={0.5} />
      </span>
    );
  }

  return (
    <span>
      {parts[0]}
      <span style={{ position: "relative", display: "inline-block" }}>
        {selectWord}
        {frame >= highlightStart && (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${highlightProgress}%`,
              backgroundColor: "rgba(6, 182, 212, 0.35)",
              pointerEvents: "none",
            }}
          />
        )}
      </span>
      {parts[1]}
    </span>
  );
};
