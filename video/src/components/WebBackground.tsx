import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

export const WebBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const particles = React.useMemo(() => {
    // Generate pseudo-random particles that stay consistent
    const pseudoRandom = (seed: number) => {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    
    return new Array(80).fill(0).map((_, i) => {
      return {
        id: i,
        x: pseudoRandom(i * 123.45), // 0 to 1
        y: pseudoRandom(i * 678.9), // 0 to 1
        size: pseudoRandom(i * 345.6) * 4 + 2, // 2px to 6px
        speedY: pseudoRandom(i * 789.1) * 1 + 0.2,
        speedX: (pseudoRandom(i * 234.5) - 0.5) * 1,
        opacity: pseudoRandom(i * 890.1) * 0.4 + 0.1,
      };
    });
  }, []);

  // Pre-calculate positions for the current frame
  const currentPositions = particles.map(p => {
    const startX = p.x * 1920;
    const startY = p.y * 1080;
    
    let currentY = (startY - frame * p.speedY * 2) % 1080;
    if (currentY < 0) currentY += 1080;
    
    let currentX = (startX + frame * p.speedX * 2) % 1920;
    if (currentX < 0) currentX += 1920;
    
    return { ...p, currentX, currentY };
  });

  // Find connections
  const connections = [];
  const maxDistance = 150;
  
  for (let i = 0; i < currentPositions.length; i++) {
    for (let j = i + 1; j < currentPositions.length; j++) {
      const dx = currentPositions[i].currentX - currentPositions[j].currentX;
      const dy = currentPositions[i].currentY - currentPositions[j].currentY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < maxDistance) {
        // Opacity inversely proportional to distance
        const lineOpacity = (1 - dist / maxDistance) * 0.3;
        connections.push(
          <line 
            key={`${i}-${j}`}
            x1={currentPositions[i].currentX}
            y1={currentPositions[i].currentY}
            x2={currentPositions[j].currentX}
            y2={currentPositions[j].currentY}
            stroke={`rgba(56, 189, 248, ${lineOpacity})`}
            strokeWidth={1}
          />
        );
      }
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B132B' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        
        {/* Network Lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {connections}
        </svg>

        {/* Particles */}
        {currentPositions.map(p => (
          <div 
            key={p.id}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: p.size,
              height: p.size,
              backgroundColor: '#38BDF8',
              borderRadius: '50%',
              opacity: p.opacity,
              transform: `translate(${p.currentX - p.size/2}px, ${p.currentY - p.size/2}px)`,
              boxShadow: `0 0 ${p.size * 2}px rgba(56, 189, 248, 0.8)`
            }}
          />
        ))}
      </div>
      
      {/* Subtle top-left gradient to give it a premium feel without being blurry */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(6, 182, 212, 0.15), transparent 70%)',
        pointerEvents: 'none'
      }} />
    </AbsoluteFill>
  );
};
