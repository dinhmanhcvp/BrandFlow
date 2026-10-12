import React from 'react';
import { staticFile } from 'remotion';
import { QRCodeSVG } from 'qrcode.react';
import { color, font, layout, radius, stroke } from '../tokens';
import { brand, event, s12 } from '../content';
import { Reveal, useShow, useText } from '../lib/show';
import { BrandLogo } from '../components/BrandLogo';
import { TextBlock } from '../components/Placeholders';

export const Slide12_Outro: React.FC = () => {
  const { mode } = useShow();
  const closingText = useText(s12.closing);
  const taglineText = useText(brand.tagline);

  return (
    <div
      style={{
        width: layout.width,
        height: layout.height,
        padding: `${layout.top}px ${layout.marginX}px ${layout.bottom}px`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      {/* 1. Header: Hai logo trang trọng cạnh nhau */}
      <Reveal i={0}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {/* Logo lễ kỷ niệm */}
          <img
            src={staticFile('assets/official/logo-ky-niem-70-nam.svg')}
            alt={event.name.value}
            style={{ height: 110, width: 'auto', display: 'block', objectFit: 'contain' }}
          />

          {/* Đường kẻ dọc mảnh */}
          <div style={{ width: stroke.hair, height: 74, backgroundColor: color.borderStrong }} />

          {/* Logo BrandFlow */}
          <BrandLogo size={70} showWordmark wordmarkSize={46} />
        </div>
      </Reveal>

      {/* 2. Phần trung tâm: Khẩu hiệu & Mã QR thật */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 40 }}>
        {/* Khẩu hiệu */}
        <Reveal i={1}>
          <div style={{ maxWidth: 840 }}>
            <h1
              style={{
                fontFamily: font.heading,
                fontSize: 68,
                lineHeight: 1.15,
                fontWeight: 700,
                color: color.foreground,
                margin: '0 0 16px 0',
                letterSpacing: '-0.025em',
              }}
            >
              {taglineText.text}
            </h1>
            <TextBlock
              resolved={closingText}
              field={s12.closing}
              mode={mode}
              fontSize={36}
              colorHex={color.muted}
              lineHeight={1.4}
            />
          </div>
        </Reveal>

        {/* Khối Mã QR thật với viền trắng rộng để quét chuẩn trên màn hình quảng cáo */}
        <Reveal i={2}>
          <div
            style={{
              backgroundColor: '#ffffff',
              padding: 32,
              borderRadius: radius.lg,
              border: `2px solid ${color.border}`,
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 20,
            }}
          >
            <QRCodeSVG
              value={brand.websiteUrl}
              size={280}
              level="H"
              fgColor={color.foreground}
              bgColor="#ffffff"
            />
            <div
              style={{
                fontFamily: font.heading,
                fontSize: 28,
                fontWeight: 700,
                color: color.blue,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              {s12.qrLabel}
            </div>
          </div>
        </Reveal>

        {/* Website address */}
        <Reveal i={3}>
          <div
            style={{
              fontFamily: font.body,
              fontSize: 34,
              fontWeight: 600,
              color: color.foreground,
              letterSpacing: '0.02em',
            }}
          >
            https://{brand.website}
          </div>
        </Reveal>
      </div>

      {/* 3. Chân trang: Nhãn phần */}
      <Reveal i={4}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1.5px solid ${color.border}`,
            paddingTop: 20,
            fontFamily: font.body,
            fontSize: 28,
            color: color.muted,
            fontWeight: 500,
          }}
        >
          <span style={{ letterSpacing: '0.04em' }}>Đại học Bách khoa Hà Nội · {event.years}</span>
          <span style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {s12.section} · 12/12
          </span>
        </div>
      </Reveal>
    </div>
  );
};
