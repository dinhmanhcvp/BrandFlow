import React from "react";
// import { Audio, staticFile } from "remotion";

export const SFX: React.FC<{
 type: "click" | "pop" | "whoosh" | "type" | "boom" | "ding";
 startFrame: number;
}> = ({ type, startFrame }) => {
 // In a real project, we would use:
 // <Audio src={staticFile(`sfx/${type}.mp3`)} volume={...} />
 // For now, we mock it.
 return null;
};
