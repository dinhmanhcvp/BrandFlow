import React from 'react';
import { interpolate, spring } from 'remotion';
import { useCurrentFrame } from 'remotion';
import { FPS } from '../motion/beat';
import { loadFont } from '@remotion/google-fonts/Inter';
import { spring as springConf } from '../motion/springs';

const { fontFamily } = loadFont();

export type KeywordPart = {
  t: string;
  key?: boolean;
  strike?: boolean; // Added strike
  color?: 'blue' | 'purple' | 'amber' | 'emerald' | 'violet' | 'cyan' | 'rose';
};

export const KeywordLine: React.FC<{ parts: KeywordPart[], at: number }> = ({ parts, at }) => {
  const frame = useCurrentFrame();
  const rel = frame - at;

  const getGradient = (color: KeywordPart['color']) => {
    switch(color) {
      case 'purple': return `linear-gradient(110deg, #c084fc, #9333ea, #f0abfc, #9333ea, #c084fc)`;
      case 'amber': return `linear-gradient(110deg, #fde68a, #f59e0b, #fef3c7, #f59e0b, #fde68a)`;
      case 'emerald': return `linear-gradient(110deg, #6ee7b7, #10b981, #a7f3d0, #10b981, #6ee7b7)`;
      case 'violet': return `linear-gradient(110deg, #c4b5fd, #7c3aed, #ddd6fe, #7c3aed, #c4b5fd)`;
      case 'cyan': return `linear-gradient(110deg, #67e8f9, #0891b2, #a5f3fc, #0891b2, #67e8f9)`;
      case 'rose': return `linear-gradient(110deg, #fecdd3, #e11d48, #ffe4e6, #e11d48, #fecdd3)`;
      case 'blue':
      default: return `linear-gradient(110deg, #7dd3fc, #0ea5e9, #bae6fd, #0ea5e9, #7dd3fc)`;
    }
  };

  const getShadow = (color: KeywordPart['color']) => {
    switch(color) {
      case 'purple': return '0 10px 40px rgba(168,85,247,0.5), 0 0 20px rgba(168,85,247,0.3)';
      case 'amber': return '0 10px 40px rgba(245,158,11,0.5), 0 0 20px rgba(245,158,11,0.3)';
      case 'emerald': return '0 10px 40px rgba(16,185,129,0.5), 0 0 20px rgba(16,185,129,0.3)';
      case 'violet': return '0 10px 40px rgba(124,58,237,0.5), 0 0 20px rgba(124,58,237,0.3)';
      case 'cyan': return '0 10px 40px rgba(8,145,178,0.5), 0 0 20px rgba(8,145,178,0.3)';
      case 'rose': return '0 10px 40px rgba(225,29,72,0.5), 0 0 20px rgba(225,29,72,0.3)';
      case 'blue':
      default: return '0 10px 40px rgba(14,165,233,0.5), 0 0 20px rgba(14,165,233,0.3)';
    }
  };

  let globalWordIndex = 0;

  return (
    <div style={{
      display: 'inline-block',
      fontFamily,
      fontSize: 68, // Bigger
      fontWeight: '900',
      letterSpacing: -3, // Premium tight tracking
      textAlign: 'center',
      lineHeight: 1.1,
    }}>
      {parts.map((p, pIndex) => {
        // Split text by space but preserve the word structure
        const words = p.t.split(' ');
        
        return (
          <span key={pIndex} style={{ display: 'inline-block' }}>
            {words.map((w, wIndex) => {
              if (w === '') return null;
              
              const idx = globalWordIndex++;
              // Extreme snappy cinematic stagger (very small delay between words)
              const staggerRel = rel - (idx * 2);
              
              const revealSpring = spring({ frame: staggerRel, fps: FPS, config: springConf.snappy });
              
              // Apple-style typography entry: scale down + fade in + blur reveal + slide up
              const y = interpolate(revealSpring, [0, 1], [30, 0]);
              const scale = interpolate(revealSpring, [0, 1], [1.3, 1]); // Big punch
              const rotateX = interpolate(revealSpring, [0, 1], [45, 0]); 
              const opacity = interpolate(staggerRel, [0, 8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
              const blur = interpolate(staggerRel, [0, 8], [24, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
              
              // Continuous gradient shift for highlighted words
              const shift = p.key ? (frame * 1.5) % 200 : 0;
              
              const hasTrailingSpace = wIndex < words.length - 1 || p.t.endsWith(' ');
              const shouldAddSpaceEnd = hasTrailingSpace && pIndex < parts.length - 1 && wIndex === words.length - 1 && !p.t.endsWith(' ');
              
              // Wobbly tilt for highlight
              const rotateZ = p.key ? interpolate(spring({ frame: staggerRel, fps: FPS, config: springConf.wobbly }), [0, 1], [5, 0]) : 0;

              // Optimization: Don't render filter string if blur is 0
              const filterStr = blur > 0 ? `blur(${blur}px)` : undefined;

              return (
                <span key={wIndex} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
                  <span style={{ 
                    display: 'inline-block',
                    position: 'relative',
                    willChange: 'transform, opacity, filter',
                    transform: `perspective(800px) translateZ(0) translateY(${y}px) scale(${scale}) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`,
                    opacity,
                    filter: filterStr,
                    color: p.key ? 'transparent' : '#FFFFFF',
                    backgroundImage: p.key ? getGradient(p.color) : 'none',
                    backgroundSize: p.key ? '200% auto' : 'auto',
                    backgroundPositionX: p.key ? `${shift}%` : '0%',
                    WebkitBackgroundClip: p.key ? 'text' : 'none',
                    WebkitTextFillColor: p.key ? 'transparent' : '#FFFFFF',
                    textShadow: p.key ? getShadow(p.color) : '0 4px 12px rgba(0,0,0,0.5)',
                    padding: p.key ? '0 8px' : 0, 
                  }}>
                    {w}
                    {p.strike && (
                      <span style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        width: `${interpolate(staggerRel, [10, 15], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })}%`,
                        height: '8px',
                        backgroundColor: '#EF4444',
                        transform: 'translateY(-50%) rotate(-2deg)',
                        borderRadius: 4,
                        boxShadow: '0 2px 10px rgba(239, 68, 68, 0.5)'
                      }} />
                    )}
                  </span>
                  {(hasTrailingSpace || shouldAddSpaceEnd) ? '\u00A0' : ''}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};
