import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { FileText, MousePointer2 } from 'lucide-react';
import { beat } from '../motion/beat';

export const DragDropOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // File animation
  const startDragBeat = 1;
  const dropBeat = 4;
  
  const dragProgress = spring({
    frame: frame - beat(startDragBeat),
    fps,
    config: springConf.soft,
  });

  const dropProgress = spring({
    frame: frame - beat(dropBeat),
    fps,
    config: springConf.snappy,
  });

  // Calculate positions
  // Start from bottom right (outside the dropzone) and move to center
  const startX = 600;
  const startY = 400;
  const targetX = 0;
  const targetY = 0;

  const currentX = interpolate(dragProgress, [0, 1], [startX, targetX]);
  const currentY = interpolate(dragProgress, [0, 1], [startY, targetY]);

  // When dropping, SCALE UP rapidly to fill screen (Shared Element Transition)
  // File is approx 120px wide, screen is 1920px. Scale up to at least 20x.
  const scale = interpolate(dropProgress, [0, 1], [1, 30]);
  // Fade out late so the color change covers the screen
  const opacity = interpolate(dropProgress, [0, 0.8, 1], [1, 1, 0]);
  
  // Transition background color from white to dark blue (#0B1120)
  const bgColorOpacity = interpolate(dropProgress, [0, 1], [1, 0]);

  // Cursor animation
  const cursorScale = interpolate(spring({ frame: frame - beat(dropBeat - 0.5), fps, config: { damping: 10, stiffness: 300, mass: 0.5 } }), [0, 1], [1, 0.8]);
  const cursorOpacity = interpolate(dropProgress, [0, 0.2], [1, 0]);

  if (frame < beat(startDragBeat) || frame > beat(dropBeat + 3)) {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div style={{
        position: 'absolute',
        transform: `translate(${currentX}px, ${currentY}px) scale(${scale})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}>
        {/* The File */}
        <div style={{
          width: 120,
          height: 160,
          backgroundColor: `rgba(255, 255, 255, ${bgColorOpacity})`,
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 0 4px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          transform: `rotate(${interpolate(dragProgress, [0, 1], [15, 0])}deg)`
        }}>
           <div style={{ opacity: bgColorOpacity, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
             <FileText size={48} color="#10B981" />
             <div style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>brand_data.pdf</div>
           </div>
        </div>

        {/* The Cursor */}
        <div style={{
          position: 'absolute',
          bottom: -40,
          right: -30,
          transform: `scale(${cursorScale})`,
          opacity: cursorOpacity
        }}>
          <MousePointer2 size={40} color="white" fill="#0F172A" />
        </div>
      </div>
    </div>
  );
};
