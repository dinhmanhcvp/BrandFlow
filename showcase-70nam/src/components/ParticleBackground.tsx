import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { color, layout } from '../tokens';

interface NodeData {
  x0: number;
  y0: number;
  r: number;
  speedX: number;
  speedY: number;
  ampX: number;
  ampY: number;
  phaseX: number;
  phaseY: number;
}

// Pseudo-random generator for reproducible node distribution
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export const ParticleBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const nodes = useMemo<NodeData[]>(() => {
    const list: NodeData[] = [];
    const count = 46;
    for (let i = 0; i < count; i++) {
      const s = i * 7.91 + 13.3;
      list.push({
        x0: seededRandom(s) * layout.width,
        y0: seededRandom(s + 1) * layout.height,
        r: 2.2 + seededRandom(s + 2) * 2.2,
        speedX: 0.008 + seededRandom(s + 3) * 0.012,
        speedY: 0.007 + seededRandom(s + 4) * 0.011,
        ampX: 25 + seededRandom(s + 5) * 35,
        ampY: 25 + seededRandom(s + 6) * 35,
        phaseX: seededRandom(s + 7) * Math.PI * 2,
        phaseY: seededRandom(s + 8) * Math.PI * 2,
      });
    }
    return list;
  }, []);

  // Compute current coordinates
  const currentPositions = useMemo(() => {
    return nodes.map((n) => {
      const x = n.x0 + Math.sin(frame * n.speedX + n.phaseX) * n.ampX;
      const y = n.y0 + Math.cos(frame * n.speedY + n.phaseY) * n.ampY;
      return { x, y, r: n.r };
    });
  }, [nodes, frame]);

  // Compute lines between close neighbors
  const lines = useMemo(() => {
    const maxDist = 160;
    const res: Array<{ x1: number; y1: number; x2: number; y2: number; opacity: number }> = [];
    for (let i = 0; i < currentPositions.length; i++) {
      for (let j = i + 1; j < currentPositions.length; j++) {
        const p1 = currentPositions[i];
        const p2 = currentPositions[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.22;
          res.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, opacity });
        }
      }
    }
    return res;
  }, [currentPositions]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: color.background,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Subtle ambient gradients */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, rgba(248,250,252,0) 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: -200,
          width: 800,
          height: 800,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.05) 0%, rgba(248,250,252,0) 70%)',
        }}
      />

      {/* Dynamic Floating Nodes & Connecting Mesh SVG */}
      <svg
        width={layout.width}
        height={layout.height}
        style={{ position: 'absolute', inset: 0 }}
      >
        {lines.map((l, idx) => (
          <line
            key={`l-${idx}`}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="#3b82f6"
            strokeOpacity={l.opacity}
            strokeWidth={1.2}
          />
        ))}
        {currentPositions.map((p, idx) => (
          <circle
            key={`c-${idx}`}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="#06b6d4"
            fillOpacity={0.35}
          />
        ))}
      </svg>
    </div>
  );
};
