import React from 'react';
import { color, font, layout, radius, stroke } from '../tokens';
import { s04 } from '../content';
import { Reveal } from '../lib/show';

export const Slide04_Color: React.FC = () => {
  return (
    <div
      style={{
        width: layout.width,
        height: layout.height,
        paddingTop: layout.contentTop,
        paddingLeft: layout.marginX,
        paddingRight: layout.marginX,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Tiêu đề & Giới thiệu */}
      <Reveal i={0}>
        <div style={{ marginBottom: 40 }}>
          <h2
            style={{
              fontFamily: font.heading,
              fontSize: 60,
              fontWeight: 700,
              color: color.foreground,
              margin: '0 0 12px 0',
              letterSpacing: '-0.02em',
            }}
          >
            {s04.title}
          </h2>
          <p
            style={{
              fontFamily: font.body,
              fontSize: 36,
              color: color.muted,
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {s04.lead}
          </p>
        </div>
      </Reveal>

      {/* 1. Thanh tỉ lệ màu trực quan */}
      <Reveal i={1}>
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: font.heading,
              fontSize: 28,
              fontWeight: 700,
              color: color.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}
          >
            <span>{s04.ratioTitle}</span>
            <span>60 : 20 : 8 : 7 : 5</span>
          </div>

          <div
            style={{
              width: '100%',
              height: 48,
              borderRadius: radius.md,
              overflow: 'hidden',
              display: 'flex',
              border: `1.5px solid ${color.border}`,
            }}
          >
            {s04.swatches.map((sw, idx) => (
              <div
                key={`bar-${idx}`}
                style={{
                  width: `${sw.share}%`,
                  height: '100%',
                  backgroundColor: sw.hex,
                }}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* 2. Danh sách các token màu chính */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {s04.swatches.map((sw, idx) => (
          <Reveal key={`swatch-${idx}`} i={2 + idx}>
            <div
              style={{
                backgroundColor: color.surface,
                border: `1.5px solid ${color.border}`,
                borderRadius: radius.md,
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                {/* Khối màu */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: radius.sm,
                    backgroundColor: sw.hex,
                    border: `1.5px solid ${sw.hex === '#F8FAFC' ? color.borderStrong : sw.hex}`,
                    flexShrink: 0,
                  }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontFamily: font.body, fontSize: 36, fontWeight: 600, color: color.foreground }}>
                    {sw.name}
                  </span>
                  <span style={{ fontFamily: font.body, fontSize: 28, color: color.muted, fontVariantNumeric: 'tabular-nums' }}>
                    {sw.token}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                <span
                  style={{
                    fontFamily: font.heading,
                    fontSize: 32,
                    fontWeight: 700,
                    color: color.foreground,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {sw.hex}
                </span>
                <span
                  style={{
                    fontFamily: font.heading,
                    fontSize: 28,
                    fontWeight: 600,
                    color: color.muted,
                    width: 60,
                    textAlign: 'right',
                  }}
                >
                  {sw.share}%
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
};
