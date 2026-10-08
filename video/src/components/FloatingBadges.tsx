import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily } = loadFont();

interface BadgeDef {
 text: string;
 x: string;
 y: string;
 color: string;
 delay: number; // in frames
 rotate: number;
}

export const FloatingBadges: React.FC<{ badges: BadgeDef[], startFrame: number }> = ({ badges, startFrame }) => {
 const frame = useCurrentFrame();
 const { fps } = useVideoConfig();

 return (
  <>
   {badges.map((b, i) => {
    const localFrame = frame - startFrame - b.delay;
    if (localFrame < 0) return null;

    const scale = spring({ frame: localFrame, fps, config: springConf.bouncy });
    const yOffset = interpolate(localFrame, [0, fps * 2], [50, -50], { extrapolateRight: 'clamp' });
    const opacity = interpolate(localFrame, [0, 5, fps * 1.5, fps * 2], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

    return (
     <div key={i} style={{
      position: 'absolute',
      left: b.x,
      top: b.y,
      transform: `translate(-50%, -50%) scale(${scale}) translateY(${yOffset}px) rotate(${b.rotate}deg)`,
      opacity,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      border: `1px solid ${b.color}40`,
      padding: '12px 24px',
      borderRadius: 999,
      color: b.color,
      fontSize: 24,
      fontWeight: 800,
      fontFamily,
      textTransform: 'uppercase',
      letterSpacing: 2,
      boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 20px ${b.color}20`,
      backdropFilter: 'blur(8px)',
      zIndex: 5
     }}>
      {b.text}
     </div>
    );
   })}
  </>
 );
};
