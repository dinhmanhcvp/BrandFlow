import React from 'react';
import { color, font } from '../tokens';

interface BrandLogoProps {
  size?: number;
  showWordmark?: boolean;
  wordmarkSize?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 64,
  showWordmark = false,
  wordmarkSize = 36,
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
      {/* BrandFlow Vector Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ overflow: 'visible', flexShrink: 0 }}
      >
        <defs>
          <linearGradient id="bfLogoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Dynamic Sweep Lines (Left) */}
        <path d="M 15 35 C 30 35, 35 20, 50 20" stroke="url(#bfLogoGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M 8 45 C 25 45, 30 40, 45 40" stroke="url(#bfLogoGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M 8 55 C 25 55, 30 60, 45 60" stroke="url(#bfLogoGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M 15 65 C 30 65, 35 80, 50 80" stroke="url(#bfLogoGrad)" strokeWidth="2.2" fill="none" strokeLinecap="round" />

        {/* Network Connections (Right) */}
        <line x1="50" y1="20" x2="80" y2="50" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="65" y2="50" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />
        <line x1="50" y1="20" x2="45" y2="40" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />

        <line x1="50" y1="80" x2="80" y2="50" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />
        <line x1="50" y1="80" x2="65" y2="50" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />
        <line x1="50" y1="80" x2="45" y2="60" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />

        <line x1="80" y1="50" x2="65" y2="50" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />
        <line x1="80" y1="50" x2="45" y2="40" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />
        <line x1="80" y1="50" x2="45" y2="60" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />

        <line x1="45" y1="40" x2="65" y2="50" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />
        <line x1="45" y1="40" x2="45" y2="60" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />
        <line x1="45" y1="60" x2="65" y2="50" stroke="#06B6D4" strokeOpacity="0.75" strokeWidth="1.5" />

        {/* Nodes */}
        <circle cx="50" cy="20" r="4.2" fill="#06B6D4" />
        <circle cx="50" cy="80" r="4.2" fill="#06B6D4" />
        <circle cx="80" cy="50" r="5.0" fill="#06B6D4" />
        <circle cx="65" cy="50" r="3.8" fill="#06B6D4" />
        <circle cx="45" cy="40" r="3.8" fill="#06B6D4" />
        <circle cx="45" cy="60" r="3.8" fill="#06B6D4" />
        <circle cx="15" cy="35" r="3.6" fill="#06B6D4" />
        <circle cx="8" cy="45" r="3.2" fill="#06B6D4" />
        <circle cx="8" cy="55" r="3.2" fill="#06B6D4" />
        <circle cx="15" cy="65" r="3.6" fill="#06B6D4" />
      </svg>

      {showWordmark && (
        <span
          style={{
            fontFamily: font.wordmark,
            fontSize: wordmarkSize,
            fontWeight: 700,
            color: color.foreground,
            letterSpacing: '0.01em',
            display: 'inline-block',
            lineHeight: 1,
          }}
        >
          BrandFlow
        </span>
      )}
    </div>
  );
};
