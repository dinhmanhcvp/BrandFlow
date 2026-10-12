import React from 'react';
import { color, font, layout, radius, stroke } from '../tokens';
import { s05 } from '../content';
import { Reveal } from '../lib/show';

export const Slide05_Typography: React.FC = () => {
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
      {/* Tiêu đề mục */}
      <Reveal i={0}>
        <div style={{ marginBottom: 44 }}>
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
            {s05.title}
          </h2>
          <p style={{ fontFamily: font.body, fontSize: 36, color: color.muted, margin: 0 }}>
            Hệ thống phân cấp chữ cho trình chiếu và ứng dụng.
          </p>
        </div>
      </Reveal>

      {/* 1. Các họ phông chữ chính */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 52 }}>
        {s05.families.map((f, idx) => (
          <Reveal key={`font-family-${idx}`} i={1 + idx}>
            <div
              style={{
                backgroundColor: color.surface,
                border: `1.5px solid ${color.border}`,
                borderRadius: radius.md,
                padding: '24px 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span
                  style={{
                    fontFamily: font.body,
                    fontSize: 28,
                    fontWeight: 600,
                    color: color.blue,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {f.role}
                </span>
                <span
                  style={{
                    fontFamily: f.kind === 'heading' ? font.heading : f.kind === 'wordmark' ? font.wordmark : font.body,
                    fontSize: f.kind === 'wordmark' ? 52 : 44,
                    fontWeight: 700,
                    color: color.foreground,
                    lineHeight: 1.1,
                  }}
                >
                  {f.name}
                </span>
              </div>

              <span style={{ fontFamily: font.body, fontSize: 28, color: color.muted, maxWidth: 380, textAlign: 'right' }}>
                {f.weights}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      {/* 2. Mẫu các cấp chữ (Type Scale Specimen) */}
      <Reveal i={4}>
        <div>
          <div
            style={{
              fontFamily: font.heading,
              fontSize: 28,
              fontWeight: 700,
              color: color.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 20,
              borderBottom: `${stroke.hair}px solid ${color.border}`,
              paddingBottom: 12,
            }}
          >
            Mẫu phân cấp cỡ chữ
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {s05.levels.map((lvl, idx) => (
              <div
                key={`lvl-${idx}`}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  paddingBottom: 16,
                  borderBottom: idx < s05.levels.length - 1 ? `1px solid ${color.border}` : 'none',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontFamily: font.body, fontSize: 28, color: color.muted }}>
                    {lvl.name} ({lvl.spec})
                  </span>
                  <span
                    style={{
                      fontFamily: idx < 3 ? font.heading : font.body,
                      fontSize: idx === 0 ? 56 : idx === 1 ? 46 : idx === 2 ? 38 : 36,
                      fontWeight: idx < 3 ? 700 : 400,
                      color: color.foreground,
                    }}
                  >
                    {lvl.sample}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
};
