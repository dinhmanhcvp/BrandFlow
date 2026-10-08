import React from 'react';
import { OffthreadVideo, Img, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { colors } from '../tokens';

interface PlateProps {
 src?: string;
 start?: number;
 end?: number;
 speed?: number;
 rect?: { x: number, y: number, w: number, h: number };
 tilt?: 'flat' | 'soft' | 'hero';
 radius?: number;
 children?: React.ReactNode;
}

export const Plate: React.FC<PlateProps> = ({ src, start = 0, end = 0, speed = 1, rect, tilt = 'flat', radius = 0, children }) => {
 const frame = useCurrentFrame();
 const { fps } = useVideoConfig();

 const tiltValues = {
  flat: { rx: 0, ry: 0, rz: 0, scale: 1 },
  soft: { rx: 5, ry: -5, rz: 2, scale: 0.95 },
  hero: { rx: 15, ry: -10, rz: 5, scale: 0.85 }
 };

 const targetTilt = tiltValues[tilt];
 // Use cinematic spring for a much slower, elegant 3D tilt
 const s = spring({ frame, fps, config: springConf.cinematic });
 
 const rx = interpolate(s, [0, 1], [0, targetTilt.rx]);
 const ry = interpolate(s, [0, 1], [0, targetTilt.ry]);
 const rz = interpolate(s, [0, 1], [0, targetTilt.rz]);
 const scale = interpolate(s, [0, 1], [0.9, targetTilt.scale]); // Starts slightly smaller
 
 // Smooth opacity fade in
 const opacity = interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: 'clamp' });

 // Handle zoom/crop
 const defaultRect = { x: 0, y: 0, w: 1920, h: 1080 };
 const targetRect = rect || defaultRect;
 
 const zoomScale = 1920 / targetRect.w;
 const zoomX = -targetRect.x * zoomScale;
 const zoomY = -targetRect.y * zoomScale;

 return (
  <AbsoluteFill style={{ perspective: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity }}>
   <div style={{
    position: 'absolute',
    width: 1920,
    height: 1080,
    willChange: 'transform',
    transform: `translateZ(0) scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
    transformStyle: 'preserve-3d',
    borderRadius: radius,
    overflow: 'hidden',
    boxShadow: tilt !== 'flat' ? '0 30px 60px rgba(0,0,0,0.6)' : 'none',
    border: tilt !== 'flat' ? `1px solid ${colors.accent}40` : 'none',
   }}>
    <div style={{
     position: 'absolute',
     width: 1920 * zoomScale,
     height: 1080 * zoomScale,
     left: zoomX,
     top: zoomY,
    }}>
     {src && (src.endsWith('.webp') || src.endsWith('.png')) ? (
      <Img 
       src={staticFile(`ref/${src}`)} 
       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
     ) : src ? (
      <OffthreadVideo 
       src={staticFile(`ref/${src}`)} 
       startFrom={Math.round(start * fps)} 
       endAt={Math.round(end * fps)} 
       playbackRate={speed}
       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
     ) : null}
    </div>
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {children}
    </div>
   </div>
  </AbsoluteFill>
 );
};
