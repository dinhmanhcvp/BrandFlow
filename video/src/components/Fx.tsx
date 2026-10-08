import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { useFx } from './FxStage';
import { ease } from '../motion/easings';
import { spring as springConf } from '../motion/springs';
import { Sfx } from './Sfx';
import { colors, frame as frameTokens } from '../tokens';

export const FocusMask: React.FC<{ target: string; at: number; hold?: number }> = ({ target, at, hold = 60 }) => {
 const frame = useCurrentFrame();
 const rect = useFx(target);

 if (!rect) return null;

 const progressIn = interpolate(frame, [at, at + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
 const progressOut = interpolate(frame, [at + hold, at + hold + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
 
 const opacity = progressIn - progressOut;

 if (opacity <= 0) return null;

 return (
  <div
   style={{
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    backdropFilter: 'blur(6px)',
    opacity,
    zIndex: 9000,
    pointerEvents: 'none',
    clipPath: `polygon(
     evenodd,
     0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%, 
     ${rect.x - 12}px ${rect.y - 12}px, 
     ${rect.x + rect.w + 12}px ${rect.y - 12}px, 
     ${rect.x + rect.w + 12}px ${rect.y + rect.h + 12}px, 
     ${rect.x - 12}px ${rect.y + rect.h + 12}px, 
     ${rect.x - 12}px ${rect.y - 12}px
    )`,
   }}
  />
 );
};

export const Highlight: React.FC<{ target: string; at: number }> = ({ target, at }) => {
 const frame = useCurrentFrame();
 const rect = useFx(target);

 if (!rect) return null;
 if (frame < at) return null;

 const progress = interpolate(frame, [at, at + 10], [100, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
  easing: ease.out
 });

 return (
  <div
   style={{
    position: 'absolute',
    left: rect.x - 4,
    top: rect.y - 4,
    width: rect.w + 8,
    height: rect.h + 8,
    backgroundColor: 'rgba(6, 182, 212, 0.35)',
    clipPath: `inset(0 ${progress}% 0 0)`,
    pointerEvents: 'none',
    zIndex: 100
   }}
  />
 );
};

export const PopCard: React.FC<{ at: number; from?: 'center' | 'left' | 'right'; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, from = 'center', children, style }) => {
 const frame = useCurrentFrame();
 const { fps } = useVideoConfig();

 if (frame < at) return null;

 const s = spring({
  frame: frame - at,
  fps,
  config: from === 'center' ? springConf.pop : springConf.menu
 });

 const opacity = interpolate(frame, [at, at + 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
 const scale = from === 'center' ? interpolate(s, [0, 1], [0.9, 1]) : 1;
 const tx = from === 'left' ? interpolate(s, [0, 1], [-80, 0]) : from === 'right' ? interpolate(s, [0, 1], [80, 0]) : 0;

 return (
  <>
   <div
    style={{
     position: 'absolute',
     transform: `translate3d(${tx}px, 0, 60px) scale(${scale})`,
     opacity,
     zIndex: 8000,
     boxShadow: `${frameTokens.shadows.multi}, ${frameTokens.shadows.glow}`,
     borderRadius: frameTokens.borderRadius.popup,
     border: frameTokens.border,
     backgroundColor: colors.bg.base,
     ...style
    }}
   >
    {children}
   </div>
   <Sfx at={at} name="pop" volume={0.6} />
  </>
 );
};

export const ScanReveal: React.FC<{ target: string; at: number }> = ({ target, at }) => {
 const frame = useCurrentFrame();
 const rect = useFx(target);

 if (!rect) return null;
 
 if (frame < at) return null;
 const progress = interpolate(frame, [at, at + 14], [0, 1], { extrapolateRight: 'clamp' });

 if (progress >= 1) return <Sfx at={at + 14} name="ding" volume={0.5} />;

 const scanY = rect.y + progress * rect.h;

 return (
  <div
   style={{
    position: 'absolute',
    left: rect.x,
    top: rect.y,
    width: rect.w,
    height: rect.h,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 500
   }}
  >
   {/* Blurry un-scanned area */}
   <div style={{ position: 'absolute', left: 0, top: progress * rect.h, right: 0, bottom: 0, backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.2)' }} />
   {/* Scanline */}
   <div style={{ position: 'absolute', left: 0, top: progress * rect.h - 2, right: 0, height: 4, backgroundColor: colors.accent, boxShadow: `0 0 12px ${colors.accent}` }} />
  </div>
 );
};

export const AbsorbFx: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
 const frame = useCurrentFrame();
 if (frame < at) return <>{children}</>;
 
 const progress = interpolate(frame, [at, at + 12], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
  easing: ease.in
 });
 
 const scale = 1 - 0.8 * progress; // 1 -> 0.2
 const rotate = progress * 45; // rotate 45 deg
 const opacity = 1 - progress; // fade out at the end

 return (
  <div style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, opacity, transformOrigin: 'center' }}>
   {children}
  </div>
 );
};

export const CountUp: React.FC<{ at: number; value: number; format?: 'vnd' | 'percent'; duration?: number }> = ({ at, value, format = 'vnd', duration = 12 }) => {
 const frame = useCurrentFrame();
 
 const progress = interpolate(frame, [at, at + duration], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
  easing: ease.out
 });
 
 const currentVal = Math.round(value * progress);
 
 let formatted = currentVal.toLocaleString();
 if (format === 'vnd') formatted = `${formatted} ₫`;
 else if (format === 'percent') formatted = `${formatted}%`;
 
 return <span>{formatted}</span>;
};

export const GanttReveal: React.FC<{ at: number; bars: { w: number, color: string }[] }> = ({ at, bars }) => {
 const frame = useCurrentFrame();
 
 return (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
   {bars.map((bar, i) => {
    const barAt = at + i * 3;
    const progress = interpolate(frame, [barAt, barAt + 10], [0, bar.w], {
     extrapolateLeft: 'clamp',
     extrapolateRight: 'clamp',
     easing: ease.out
    });
    
    return (
     <div key={i} style={{ width: `${progress}%`, height: 16, backgroundColor: bar.color, borderRadius: 8 }} />
    );
   })}
  </div>
 );
};

