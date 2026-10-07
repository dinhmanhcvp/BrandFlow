import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { beat } from '../motion/beat';
import { Plate } from '../components/Plate';
import { SceneShell } from '../components/SceneShell';
import { DesignStudioUI } from '../components/DesignStudioUI';
import { DailyContentUI } from '../components/DailyContentUI';
import { AgentBuilderUI } from '../components/AgentBuilderUI';
import { AgentDeployUI } from '../components/AgentDeployUI';
import { PlanningUI } from '../components/PlanningUI';
import { ExecutiveReportUI } from '../components/ExecutiveReportUI';
import { KeywordLine } from '../components/KeywordLine';
import { WebBackground } from '../components/WebBackground';
import { BrandFlowLogo } from '../components/BrandFlowLogo';

export const Scene4_Features: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <WebBackground />

      <Sequence from={0} durationInFrames={beat(84)}>
        <Sequence from={beat(0)} durationInFrames={beat(16)}>
           <SceneShell
             tilt="soft"
             shots={[
               { at: beat(4), type: 'push', target: 'fanpage' },
               { at: beat(8), type: 'pull' }
             ]}
             screen={<DesignStudioUI />}
           />
        </Sequence>
        
        <Sequence from={beat(16)} durationInFrames={beat(12)}>
           <div style={{ position: 'absolute', inset: 0, transform: 'scale(0.85) translateY(-80px)', transformOrigin: 'center center' }}>
             <Plate start={0} end={10} tilt="flat">
                <DailyContentUI />
             </Plate>
           </div>
        </Sequence>

        <Sequence from={beat(28)} durationInFrames={beat(12)}>
           <SceneShell
             tilt="soft"
             shots={[
               { at: beat(4), type: 'push', target: 'agent-preview' },
               { at: beat(8), type: 'pull' }
             ]}
             screen={<AgentBuilderUI />}
           />
        </Sequence>

        <Sequence from={beat(40)} durationInFrames={beat(12)}>
           <div style={{ position: 'absolute', inset: 0, transform: 'scale(0.85) translateY(-80px)', transformOrigin: 'center center' }}>
             <Plate start={0} end={10} tilt="soft">
                <AgentDeployUI />
             </Plate>
           </div>
        </Sequence>
        
        <Sequence from={beat(52)} durationInFrames={beat(12)}>
           <SceneShell
             tilt="flat"
             shots={[
               { at: beat(4), type: 'push', target: 'gantt-chart' },
               { at: beat(8), type: 'pull' }
             ]}
             screen={<PlanningUI />}
           />
        </Sequence>

        <Sequence from={beat(64)} durationInFrames={beat(20)}>
           <SceneShell
             tilt="soft"
             shots={[
               { at: beat(4), type: 'push', target: 'report-content' },
               { at: beat(16), type: 'pull' }
             ]}
             screen={<ExecutiveReportUI />}
           />
        </Sequence>
      </Sequence>

      {/* Messages */}
      <Sequence from={0}>
        {frame >= beat(4) && frame < beat(14) && (
          <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
             <KeywordLine parts={[{t:"Tự động "}, {t:"thiết kế UI/UX", key:true, color:"emerald"}, {t:" & Nhận diện thương hiệu."}]} at={beat(4)} />
          </div>
        )}
        {frame >= beat(16) && frame < beat(26) && (
          <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
             <KeywordLine parts={[{t:"Phân phối "}, {t:"nội dung đa nền tảng", key:true, color:"blue"}, {t:" chỉ với một chạm."}]} at={beat(16)} />
          </div>
        )}
        {frame >= beat(28) && frame < beat(38) && (
          <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
             <KeywordLine parts={[{t:"Tùy biến "}, {t:"AI Agent", key:true, color:"violet"}, {t:" theo đặc thù doanh nghiệp."}]} at={beat(28)} />
          </div>
        )}
        {frame >= beat(40) && frame < beat(50) && (
          <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
             <KeywordLine parts={[{t:"Huấn luyện AI với "}, {t:"dữ liệu nội bộ", key:true, color:"amber"}, {t:" độc quyền."}]} at={beat(40)} />
          </div>
        )}
        {frame >= beat(52) && frame < beat(62) && (
          <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
             <KeywordLine parts={[{t:"Lập kế hoạch & "}, {t:"quản lý ngân sách", key:true, color:"cyan"}, {t:" thông minh."}]} at={beat(52)} />
          </div>
        )}
        {frame >= beat(64) && frame < beat(80) && (
          <div style={{ position: 'absolute', bottom: 120, width: '100%', display: 'flex', justifyContent: 'center', zIndex: 9999 }}>
             <KeywordLine parts={[{t:"Trích xuất "}, {t:"báo cáo chuyên sâu", key:true, color:"rose"}, {t:" theo thời gian thực."}]} at={beat(64)} />
          </div>
        )}

        {/* Reveal the logo subtly in the corner */}
        {frame >= beat(10) && (
          <div style={{ position: 'absolute', top: 20, left: 20, opacity: interpolate(frame, [beat(10), beat(12)], [0, 1]), zIndex: 9999 }}>
             <BrandFlowLogo scale={0.3} transformOrigin="top left" />
          </div>
        )}
      </Sequence>
    </AbsoluteFill>
  );
};
