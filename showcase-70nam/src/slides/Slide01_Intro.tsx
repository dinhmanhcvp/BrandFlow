import React from 'react';
import { staticFile } from 'remotion';
import { color, font, layout, stroke } from '../tokens';
import { brand, event, s01 } from '../content';
import { Reveal, useShow, useText } from '../lib/show';
import { BrandLogo } from '../components/BrandLogo';
import { TextBlock } from '../components/Placeholders';

export const Slide01_Intro: React.FC = () => {
  const { mode, showEnglishTagline } = useShow();
  const journeyText = useText(s01.journeyLine);
  const welcomeText = useText(s01.welcome);
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
          {/* Logo lễ kỷ niệm đứng trước */}
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

      {/* 2. Phần trung tâm: Khẩu hiệu & Sứ mệnh */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 36, maxWidth: 900 }}>
        {/* Lời chào mừng sự kiện */}
        <Reveal i={1}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: font.body,
              fontSize: 28,
              fontWeight: 600,
              color: color.cyanText,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color.cyan }} />
            <TextBlock resolved={welcomeText} field={s01.welcome} mode={mode} fontSize={28} />
          </div>
        </Reveal>

        {/* Khẩu hiệu chính */}
        <Reveal i={2}>
          <h1
            style={{
              fontFamily: font.heading,
              fontSize: 78,
              lineHeight: 1.12,
              fontWeight: 700,
              color: color.foreground,
              margin: 0,
              letterSpacing: '-0.025em',
            }}
          >
            {taglineText.text}
          </h1>
          {showEnglishTagline && (
            <div
              style={{
                fontFamily: font.body,
                fontSize: 34,
                color: color.muted,
                fontStyle: 'italic',
                marginTop: 12,
              }}
            >
              "{brand.taglineEn}"
            </div>
          )}
        </Reveal>

        {/* Dòng phụ về hành trình */}
        <Reveal i={3}>
          <div style={{ maxWidth: 840 }}>
            <TextBlock
              resolved={journeyText}
              field={s01.journeyLine}
              mode={mode}
              fontSize={38}
              lineHeight={1.4}
              colorHex={color.muted}
            />
          </div>
        </Reveal>
      </div>

      {/* 3. Chân trang: Website & Nhãn phần */}
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
          <span style={{ letterSpacing: '0.04em' }}>{brand.website}</span>
          <span style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {s01.section} · 01/12
          </span>
        </div>
      </Reveal>
    </div>
  );
};
