import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, interpolateColors, spring, useVideoConfig } from 'remotion';
import { beat } from '../motion/beat';
import { KeywordLine } from '../components/KeywordLine';
import { BrandFlowLogo } from '../components/BrandFlowLogo';
import { Flare } from '../motion/fx';
import { WebBackground } from '../components/WebBackground';
import { FloatingBadges } from '../components/FloatingBadges';
import { spring as springConf } from '../motion/springs';

export const Scene1_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dynamic Scale and Y for Apple-like snappy typography
  const textScale1 = spring({ frame: frame - beat(0), fps, config: springConf.bouncy });
  const textScale2 = spring({ frame: frame - beat(6), fps, config: springConf.bouncy });
  const textScale3 = spring({ frame: frame - beat(12), fps, config: springConf.bouncy });
  const textScale4 = spring({ frame: frame - beat(17), fps, config: springConf.cinematic });

  // Floating Badges Definitions
  const badges1 = [
    { text: "LÃNG PHÍ", x: "20%", y: "30%", color: "#EF4444", delay: 10, rotate: -15 },
    { text: "CPA CAO", x: "80%", y: "25%", color: "#F59E0B", delay: 25, rotate: 10 },
    { text: "-45% NGÂN SÁCH", x: "75%", y: "70%", color: "#EF4444", delay: 40, rotate: -5 },
    { text: "KHÔNG HIỆU QUẢ", x: "25%", y: "65%", color: "#F97316", delay: 55, rotate: 12 },
  ];

  const badges2 = [
    { text: "CHỜ ĐỢI 2 TUẦN", x: "25%", y: "25%", color: "#A855F7", delay: 10, rotate: -10 },
    { text: "$2000/THÁNG", x: "75%", y: "30%", color: "#EC4899", delay: 20, rotate: 15 },
    { text: "SỬA ĐI SỬA LẠI", x: "80%", y: "65%", color: "#8B5CF6", delay: 35, rotate: -8 },
    { text: "TRỄ DEADLINE", x: "20%", y: "70%", color: "#D946EF", delay: 50, rotate: 12 },
  ];

  const badges3 = [
    { text: "VĂN MẪU AI", x: "20%", y: "30%", color: "#3B82F6", delay: 5, rotate: -12 },
    { text: "SAI BRAND VOICE", x: "80%", y: "25%", color: "#06B6D4", delay: 15, rotate: 10 },
    { text: "ẢO GIÁC THÔNG TIN", x: "75%", y: "70%", color: "#3B82F6", delay: 25, rotate: -5 },
    { text: "KHÔNG THỰC TẾ", x: "25%", y: "65%", color: "#6366F1", delay: 35, rotate: 8 },
  ];

  return (
    <AbsoluteFill style={{ 
      backgroundColor: interpolateColors(frame, [beat(26), beat(28)], ['#301111', '#0B1120']), 
      overflow: 'hidden' 
    }}>
      {/* Dynamic Grid Removed */}

      <WebBackground />

      {/* Light sweep effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at ${50 + Math.sin(frame / 30) * 20}% ${50 + Math.cos(frame / 30) * 20}%, rgba(59, 130, 246, 0.15) 0%, transparent 60%)`,
        zIndex: 1
      }} />

      <Sequence from={beat(0)} durationInFrames={beat(32)}>
        
        {/* Reason 1 */}
        {frame >= beat(0) && frame < beat(8) && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <FloatingBadges badges={badges1} startFrame={beat(0)} />
            <div style={{ 
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', 
              justifyContent: 'center', alignItems: 'center', zIndex: 10,
              transform: `scale(${textScale1 * 1.3}) translateY(${interpolate(frame, [beat(7.5), beat(8)], [0, -50], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
              opacity: interpolate(frame, [beat(7.5), beat(8)], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }}>
              <KeywordLine parts={[{t:"Ngân sách marketing bị "}, {t:"đốt phí", key:true, color:"amber"}, {t:" vì đâu?"}]} at={beat(0)} />
            </div>
          </div>
        )}

        {/* Reason 2 */}
        {frame >= beat(8) && frame < beat(16) && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <FloatingBadges badges={badges2} startFrame={beat(8)} />
            <div style={{ 
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', 
              justifyContent: 'center', alignItems: 'center', zIndex: 10,
              transform: `scale(${textScale2 * 1.3 * interpolate(frame, [beat(15.5), beat(16)], [1, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
              opacity: interpolate(frame, [beat(15.5), beat(16)], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }}>
              <KeywordLine parts={[{t:"Thuê agency", strike:true}, {t:" chậm, quá đắt đỏ.", key:true, color:"purple"}]} at={beat(8)} />
            </div>
          </div>
        )}

        {/* Reason 3 */}
        {frame >= beat(16) && frame < beat(24) && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <FloatingBadges badges={badges3} startFrame={beat(16)} />
            <div style={{ 
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', 
              justifyContent: 'center', alignItems: 'center', zIndex: 10,
              transform: `scale(${textScale3 * 1.3})`,
              filter: `blur(${interpolate(frame, [beat(23.5), beat(24)], [0, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
              opacity: interpolate(frame, [beat(23.5), beat(24)], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }}>
              <KeywordLine parts={[{t:"Dùng công cụ AI cơ bản? "}, {t:"Thiếu thực tế.", key:true, color:"blue"}]} at={beat(16)} />
            </div>
          </div>
        )}

        {/* Resolution */}
        {frame >= beat(24) && frame < beat(28) && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <div style={{ 
              position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', 
              justifyContent: 'center', alignItems: 'center', zIndex: 10,
              transform: `scale(${textScale4 * 1.3}) perspective(1000px) rotateX(${interpolate(frame, [beat(27), beat(28)], [0, 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}deg)`,
              opacity: interpolate(frame, [beat(27), beat(28)], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            }}>
              <KeywordLine parts={[{t:"Vậy đâu là "}, {t:"giải pháp tốt nhất?", key:true, color:"emerald"}]} at={beat(24)} />
            </div>
          </div>
        )}
        
        {/* Reveal Logo */}
        {frame >= beat(28) && (
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: interpolate(frame, [beat(28), beat(29)], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), zIndex: 20 }}>
             <BrandFlowLogo scale={1.8} />

          </AbsoluteFill>
        )}
        <Flare startFrame={0} />
      </Sequence>
    </AbsoluteFill>
  );
};
