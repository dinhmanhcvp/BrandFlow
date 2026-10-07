import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily } = loadFont();

export const RemotionMetrics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerSpring = spring({ frame: frame - 10, fps, config: springConf.cinematic });
  const yOffset = interpolate(containerSpring, [0, 1], [100, 0]);
  const opacity = interpolate(containerSpring, [0, 1], [0, 1]);

  const metrics = [
    { value: 12, suffix: "+", label: "CHIẾN DỊCH AI", color: "#60A5FA" },
    { value: 50, suffix: "ms", label: "TỐC ĐỘ PHẢN HỒI", color: "#22D3EE" },
    { value: 8, suffix: "+", label: "TRỢ LÝ CHUYÊN SÂU", color: "#818CF8" },
    { value: 100, suffix: "%", label: "KIỂM SOÁT NGÂN SÁCH", color: "#34D399" },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      borderRadius: 40,
      padding: '40px 60px',
      width: '80%',
      transform: `translateY(${yOffset}px)`,
      opacity,
      boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 40px rgba(6,182,212,0.1)',
      fontFamily
    }}>
      {metrics.map((m, i) => {
        // Count up animation
        const countSpring = spring({ frame: frame - 20 - i * 5, fps, config: springConf.soft });
        const currentCount = Math.floor(interpolate(countSpring, [0, 1], [0, m.value]));
        
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: 'white', display: 'flex', alignItems: 'baseline' }}>
              {currentCount}
              <span style={{ fontSize: 48, color: m.color, marginLeft: 4 }}>{m.suffix}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#94A3B8', letterSpacing: 2, marginTop: 12 }}>
              {m.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
