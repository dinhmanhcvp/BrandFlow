import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { beat } from '../motion/beat';
import { Plate } from '../components/Plate';
import { SceneShell } from '../components/SceneShell';
import { KeywordLine } from '../components/KeywordLine';
import { WebBackground } from '../components/WebBackground';
import { DragDropOverlay } from '../components/DragDropOverlay';
import { ProcessingOverlay } from '../components/ProcessingOverlay';
import { BrandDNADashboardUI } from '../components/BrandDNADashboardUI';
import { BrandFlowLogo } from '../components/BrandFlowLogo';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily } = loadFont();

export const Scene2_Intake: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <WebBackground />
      
      <Sequence from={0} durationInFrames={beat(40)}>
        {/* Agent Intake process */}
        <Sequence from={beat(0)} durationInFrames={beat(8)}>
           <Plate src="AgentIntake.mp4" start={0} end={10} speed={1} />
           <DragDropOverlay />
        </Sequence>
        {/* Processing Overlay is covering beat 8 to 16 */}
        <Sequence from={beat(8)} durationInFrames={beat(8)}>
           <ProcessingOverlay />
        </Sequence>
        
        {/* Brand DNA Dashboard replaces the static screenshots */}
        <Sequence from={beat(16)} durationInFrames={beat(24)}>
           <SceneShell
             tilt="soft"
             shots={[
               { at: beat(4), type: 'push', target: 'scorecard' },
               { at: beat(12), type: 'pull' },
               { at: beat(14), type: 'push', target: 'expert' },
               { at: beat(20), type: 'pull' }
             ]}
             screen={<BrandDNADashboardUI />}
           />
        </Sequence>
      </Sequence>

      {/* Foreground Messages */}
      <Sequence from={0}>
        {frame >= beat(2) && frame < beat(10) && (
          <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
            <KeywordLine parts={[{t:"Thả một "}, {t:"file tài liệu", key:true, color:"emerald"}, {t:" lên hệ thống..."}]} at={beat(2)} />
          </div>
        )}
        {frame >= beat(11) && frame < beat(20) && (
          <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
            <KeywordLine parts={[{t:"AI tự đọc và phân tích "}, {t:"DNA thương hiệu.", key:true, color:"purple"}]} at={beat(11)} />
          </div>
        )}
        {frame >= beat(21) && frame < beat(39) && (
          <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 9999 }}>
            <KeywordLine parts={[{t:"Khởi tạo "}, {t:"Master Brand Profile", key:true, color:"amber"}, {t:" thành công."}]} at={beat(21)} />
            <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)', marginTop: 12, fontFamily, letterSpacing: 1 }}>(Đảm bảo sự nhất quán 100% trên mọi điểm chạm)</div>
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
