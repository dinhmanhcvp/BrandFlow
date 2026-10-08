import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { beat } from './motion/beat';

import { Scene1_Hook } from './scenes/Scene1_Hook';
import { Scene2_Intake } from './scenes/Scene2_Intake';
import { Scene4_Features } from './scenes/Scene4_Features';
import { Scene5_CTA } from './scenes/Scene5_CTA';

export const Main30s: React.FC = () => {
 return (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
   {/* 0-4s */}
   <Sequence from={0} durationInFrames={beat(8)}>
    <Scene1_Hook />
   </Sequence>
   
   {/* 4-14s */}
   <Sequence from={beat(8)} durationInFrames={beat(20)}>
    <Scene2_Intake />
   </Sequence>

   {/* 14-22s */}
   <Sequence from={beat(28)} durationInFrames={beat(16)}>
    <Scene4_Features />
   </Sequence>

   {/* 22-30s */}
   <Sequence from={beat(44)} durationInFrames={beat(16)}>
    <Scene5_CTA />
   </Sequence>
  </AbsoluteFill>
 );
};
