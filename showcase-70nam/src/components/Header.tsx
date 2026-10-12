import React from 'react';
import { staticFile } from 'remotion';
import { color, layout } from '../tokens';
import { useShow } from '../lib/show';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const { index, count } = useShow();
  // Slides 1 & 12 handle hero lockups in their own canvas body
  const isCoverOrEnd = index === 0 || index === count - 1;

  if (isCoverOrEnd) {
    return null;
  }

  return (
    <header
      style={{
        position: 'absolute',
        top: layout.top,
        left: layout.marginX,
        width: layout.contentWidth,
        height: layout.headerHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50,
      }}
    >
      {/* Left: BrandFlow Logo & Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <BrandLogo size={56} showWordmark wordmarkSize={38} />
      </div>

      {/* Right: Official HUST 70th Anniversary Emblem */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={staticFile('assets/official/logo-ky-niem-70-nam.svg')}
          alt="Kỷ niệm 70 năm ĐHBK Hà Nội"
          style={{
            height: 72,
            width: 'auto',
            display: 'block',
            objectFit: 'contain',
          }}
        />
      </div>
    </header>
  );
};
