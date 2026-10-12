import React from 'react';
import { color, font, layout } from '../tokens';
import { useShow } from '../lib/show';

export const Footer: React.FC = () => {
  const { index, count, section } = useShow();
  const isCoverOrEnd = index === 0 || index === count - 1;

  if (isCoverOrEnd) {
    return null;
  }

  const slideNum = (index + 1).toString().padStart(2, '0');
  const totalNum = count.toString().padStart(2, '0');

  return (
    <footer
      style={{
        position: 'absolute',
        bottom: layout.bottom,
        left: layout.marginX,
        width: layout.contentWidth,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        zIndex: 50,
      }}
    >
      {/* Hairline divider */}
      <div
        style={{
          width: '100%',
          height: 1.5,
          backgroundColor: color.border,
        }}
      />

      {/* Footer labels */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: font.body,
          fontSize: 28,
          color: color.muted,
          fontWeight: 500,
        }}
      >
        <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {section}
        </span>
        <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>
          {slideNum} / {totalNum}
        </span>
      </div>
    </footer>
  );
};
