import React from 'react';
import { staticFile } from 'remotion';
import { color, font, layout, radius, stroke } from '../tokens';
import { s03 } from '../content';
import { Reveal } from '../lib/show';
import { BrandLogo } from '../components/BrandLogo';

export const Slide03_Logo: React.FC = () => {
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
            {s03.title}
          </h2>
          <p
            style={{
              fontFamily: font.body,
              fontSize: 36,
              color: color.muted,
              margin: 0,
              lineHeight: 1.4,
              maxWidth: 880,
            }}
          >
            {s03.lead}
          </p>
        </div>
      </Reveal>

      {/* 1. Biểu trưng chuẩn & Vùng an toàn */}
      <Reveal i={1}>
        <div
          style={{
            backgroundColor: color.surface,
            border: `1.5px solid ${color.border}`,
            borderRadius: radius.lg,
            padding: '36px 40px',
            marginBottom: 36,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div
              style={{
                border: `1.5px dashed ${color.cyan}`,
                borderRadius: radius.md,
                padding: '24px 36px',
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: color.surfaceMuted,
              }}
            >
              <BrandLogo size={96} showWordmark wordmarkSize={64} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 420 }}>
              <div style={{ fontFamily: font.body, fontSize: 30, fontWeight: 600, color: color.foreground }}>
                {s03.clearLabel}
              </div>
              <div style={{ fontFamily: font.body, fontSize: 28, color: color.muted }}>
                {s03.minSizeLabel}: <strong style={{ color: color.foreground }}>{s03.minSizeValue}</strong>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 2. Quy tắc dùng sai (Không sử dụng) */}
      <Reveal i={2}>
        <div style={{ marginBottom: 36 }}>
          <div
            style={{
              fontFamily: font.heading,
              fontSize: 28,
              fontWeight: 700,
              color: color.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}
          >
            {s03.misuseTitle}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {/* Kéo giãn */}
            <div
              style={{
                backgroundColor: color.surface,
                border: `1.5px solid ${color.border}`,
                borderRadius: radius.md,
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                position: 'relative',
              }}
            >
              <div style={{ transform: 'scaleX(1.4)', opacity: 0.7 }}>
                <BrandLogo size={56} />
              </div>
              <span style={{ fontFamily: font.body, fontSize: 28, fontWeight: 500, color: '#ef4444' }}>
                ✕ {s03.misuse[0]}
              </span>
            </div>

            {/* Đổi màu */}
            <div
              style={{
                backgroundColor: color.surface,
                border: `1.5px solid ${color.border}`,
                borderRadius: radius.md,
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{ filter: 'hue-rotate(120deg)', opacity: 0.7 }}>
                <BrandLogo size={56} />
              </div>
              <span style={{ fontFamily: font.body, fontSize: 28, fontWeight: 500, color: '#ef4444' }}>
                ✕ {s03.misuse[1]}
              </span>
            </div>

            {/* Xoay nghiêng */}
            <div
              style={{
                backgroundColor: color.surface,
                border: `1.5px solid ${color.border}`,
                borderRadius: radius.md,
                padding: '24px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{ transform: 'rotate(-25deg)', opacity: 0.7 }}>
                <BrandLogo size={56} />
              </div>
              <span style={{ fontFamily: font.body, fontSize: 28, fontWeight: 500, color: '#ef4444' }}>
                ✕ {s03.misuse[2]}
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 3. Đặt cạnh biểu trưng sự kiện */}
      <Reveal i={3}>
        <div>
          <div
            style={{
              fontFamily: font.heading,
              fontSize: 28,
              fontWeight: 700,
              color: color.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}
          >
            {s03.pairingTitle}
          </div>

          <div
            style={{
              backgroundColor: color.surface,
              border: `1.5px solid ${color.border}`,
              borderRadius: radius.lg,
              padding: '28px 40px',
              display: 'flex',
              alignItems: 'center',
              gap: 36,
            }}
          >
            <img
              src={staticFile('assets/official/logo-ky-niem-70-nam.svg')}
              alt="HUST 70"
              style={{ height: 80, width: 'auto', objectFit: 'contain' }}
            />
            <div style={{ width: stroke.hair, height: 60, backgroundColor: color.borderStrong }} />
            <BrandLogo size={60} showWordmark wordmarkSize={40} />
          </div>
        </div>
      </Reveal>
    </div>
  );
};
