import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { SCENES } from './timeline';
import { beat } from './motion/beat';
import { Transition } from './components/Transition';

import { Scene1_Hook } from './scenes/Scene1_Hook';
import { Scene2_Intake } from './scenes/Scene2_Intake';
import { Scene3_Debate } from './scenes/Scene3_Debate';
import { Scene4_Features } from './scenes/Scene4_Features';
import { Scene5_CTA } from './scenes/Scene5_CTA';
import { SfxTrack } from './components/SfxTrack';

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Sequence from={beat(SCENES.hook[0])} durationInFrames={beat(SCENES.hook[1] - SCENES.hook[0])}>
        <Transition type="blur">
          <Scene1_Hook />
        </Transition>
      </Sequence>
      
      <Sequence from={beat(SCENES.intake[0])} durationInFrames={beat(SCENES.intake[1] - SCENES.intake[0])}>
        <Transition type="slide-up">
          <Scene2_Intake />
        </Transition>
      </Sequence>

      <Sequence from={beat(SCENES.debate[0])} durationInFrames={beat(SCENES.debate[1] - SCENES.debate[0])}>
        <Transition type="flip">
          <Scene3_Debate />
        </Transition>
      </Sequence>

      <Sequence from={beat(SCENES.features[0])} durationInFrames={beat(SCENES.features[1] - SCENES.features[0])}>
        <Transition type="slide">
          <Scene4_Features />
        </Transition>
      </Sequence>

      <Sequence from={beat(SCENES.cta[0])} durationInFrames={beat(SCENES.cta[1] - SCENES.cta[0])}>
        <Transition type="zoom">
          <Scene5_CTA />
        </Transition>
      </Sequence>
      
      {/* Audio mixing and SFX cue player */}
      <SfxTrack />
    </AbsoluteFill>
  );
};
