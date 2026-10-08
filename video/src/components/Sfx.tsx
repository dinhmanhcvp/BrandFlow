import React from "react";
import { Audio, Sequence, staticFile } from "remotion";

export const Sfx: React.FC<{
 at: number;
 name: string;
 volume?: number;
 lead?: number; // anticipation offset
}> = ({ at, name, volume = 1, lead = 0 }) => {
 const from = Math.max(0, at - lead);
 
 return (
  <Sequence from={from}>
   {/* 
    In real video we load the asset:
    <Audio src={staticFile(`audio/sfx-${name}.wav`)} volume={volume} />
   */}
   <div style={{ display: "none" }} data-sfx={name} />
  </Sequence>
 );
};
