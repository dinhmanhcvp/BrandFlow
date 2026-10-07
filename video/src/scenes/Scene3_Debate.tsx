import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { beat } from '../motion/beat';
import { SceneShell } from '../components/SceneShell';
import { KeywordLine } from '../components/KeywordLine';
import { WebBackground } from '../components/WebBackground';
import { DebateSimulationUI } from '../components/DebateSimulationUI';
import { BrandFlowLogo } from '../components/BrandFlowLogo';

export const Scene3_Debate: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <WebBackground />

      <Sequence from={0} durationInFrames={beat(36)}>
        {/* Debate visual logic */}
        <Sequence from={0} durationInFrames={beat(36)}>
           <SceneShell
             tilt="soft"
             shots={[
               { at: beat(4), type: 'push', target: 'active-speaker' },
               { at: beat(10), type: 'pull' },
               { at: beat(18), type: 'push', target: 'logs' },
               { at: beat(24), type: 'pull' }
             ]}
             screen={<DebateSimulationUI />}
           />
        </Sequence>
      </Sequence>

      {/* Messages */}
      <Sequence from={0}>
        {frame >= beat(4) && frame < beat(20) && (
          <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
            <KeywordLine parts={[{t:"Hệ thống AI "}, {t:"tranh biện", key:true}, {t:" tìm phương án tối ưu."}]} at={beat(4)} />
          </div>
        )}
        {frame >= beat(20) && frame < beat(36) && (
          <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
            <KeywordLine parts={[{t:"Tự động "}, {t:"đồng bộ", key:true}, {t:" chiến lược giữa các Agent."}]} at={beat(30)} />
          </div>
        )}
        
        {/* Persistent Logo */}
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 9999 }}>
           <BrandFlowLogo scale={0.3} transformOrigin="top left" />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
