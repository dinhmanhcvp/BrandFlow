import React from 'react';
import { staticFile } from 'remotion';
import { color, font, layout, radius, stroke } from '../tokens';
import { s09 } from '../content';
import { Reveal, useShow, useText } from '../lib/show';
import { TextBlock, ImageBox } from '../components/Placeholders';

export const Slide09_Product: React.FC = () => {
  const { mode } = useShow();
  const hText = useText(s09.heading);
  const dText = useText(s09.desc);

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
        <div style={{ marginBottom: 36 }}>
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
            {s09.title}
          </h2>
          <div style={{ maxWidth: 880 }}>
            <TextBlock
              resolved={hText}
              field={s09.heading}
              mode={mode}
              fontSize={44}
              fontWeight={700}
              lineHeight={1.2}
              isHeading
            />
          </div>
        </div>
      </Reveal>

      {/* Khung thiết bị trình duyệt tối giản bao quanh ảnh chụp giao diện homepage */}
      <Reveal i={1}>
        <div
          style={{
            width: '100%',
            backgroundColor: color.surface,
            border: `1.5px solid ${color.border}`,
            borderRadius: radius.lg,
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            marginBottom: 36,
          }}
        >
          {/* Header trình duyệt tối giản */}
          <div
            style={{
              height: 56,
              backgroundColor: color.surfaceMuted,
              borderBottom: `1px solid ${color.border}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 20px',
              gap: 16,
            }}
          >
            {/* 3 chấm điều hướng */}
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
              <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
            </div>

            {/* Thanh địa chỉ URL */}
            <div
              style={{
                flex: 1,
                maxWidth: 580,
                height: 36,
                backgroundColor: color.surface,
                borderRadius: 6,
                border: `1px solid ${color.border}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                fontFamily: font.body,
                fontSize: 22,
                color: color.muted,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              https://{s09.url}
            </div>
          </div>

          {/* Ảnh chụp giao diện thật (Homepage) */}
          <div style={{ width: '100%', aspectRatio: s09.main.ratio, overflow: 'hidden' }}>
            <img
              src={staticFile(s09.main.src!)}
              alt="Giao diện BrandFlow"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </div>
        </div>
      </Reveal>

      {/* Mô tả sản phẩm */}
      <Reveal i={2}>
        <div style={{ maxWidth: 880, marginBottom: 36 }}>
          <TextBlock
            resolved={dText}
            field={s09.desc}
            mode={mode}
            fontSize={36}
            fontWeight={400}
            lineHeight={1.4}
            colorHex={color.muted}
          />
        </div>
      </Reveal>

      {/* 2 khung chi tiết bổ sung (giữ chỗ chuẩn tỉ lệ) */}
      <Reveal i={3}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {s09.secondary.map((sec, idx) => (
            <div key={`sec-prod-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <ImageBox field={sec} width="100%" height={160} />
              <TextBlock
                resolved={useText(s09.secondaryCaptions[idx])}
                field={s09.secondaryCaptions[idx]}
                mode={mode}
                fontSize={28}
                colorHex={color.muted}
              />
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
};
