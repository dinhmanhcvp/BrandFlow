import React from 'react';
import { color, font, layout, radius, stroke } from '../tokens';
import { s06 } from '../content';
import { Reveal, useProgress, useShow, useText } from '../lib/show';
import { TextBlock } from '../components/Placeholders';

export const Slide06_Journey1: React.FC = () => {
  const { mode } = useShow();
  // Animation: trục thời gian vẽ dần
  const lineProgress = useProgress(0.3, 1.2);

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
        <div style={{ marginBottom: 56 }}>
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
            {s06.title}
          </h2>
          <p style={{ fontFamily: font.body, fontSize: 36, color: color.muted, margin: 0 }}>
            Hành trình xây dựng và phát triển BrandFlow qua các cột mốc trọng điểm.
          </p>
        </div>
      </Reveal>

      {/* Trục thời gian dọc */}
      <div style={{ position: 'relative', paddingLeft: 60, display: 'flex', flexDirection: 'column', gap: 64 }}>
        {/* Đường trục dọc vẽ dần */}
        <div
          style={{
            position: 'absolute',
            left: 17,
            top: 24,
            bottom: 24,
            width: stroke.line,
            backgroundColor: color.border,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 17,
            top: 24,
            height: `${lineProgress * 85}%`,
            width: stroke.line,
            backgroundColor: color.blue,
            transition: 'height 0.1s linear',
          }}
        />

        {s06.phases.map((p, idx) => {
          const timeText = useText(p.time);
          const nameText = useText(p.name);
          const descText = useText(p.desc);

          return (
            <Reveal key={`phase1-${idx}`} i={1 + idx}>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Nút mốc tròn */}
                <div
                  style={{
                    position: 'absolute',
                    left: -60,
                    top: 6,
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: color.surface,
                    border: `3px solid ${color.blue}`,
                    boxSizing: 'border-box',
                    zIndex: 2,
                  }}
                />

                {/* Thời gian */}
                <div
                  style={{
                    fontFamily: font.heading,
                    fontSize: 28,
                    fontWeight: 700,
                    color: color.blue,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  <TextBlock resolved={timeText} field={p.time} mode={mode} fontSize={28} />
                </div>

                {/* Tên giai đoạn */}
                <TextBlock
                  resolved={nameText}
                  field={p.name}
                  mode={mode}
                  fontSize={44}
                  fontWeight={700}
                  lineHeight={1.2}
                  isHeading
                />

                {/* Mô tả ngắn */}
                <div style={{ maxWidth: 820 }}>
                  <TextBlock
                    resolved={descText}
                    field={p.desc}
                    mode={mode}
                    fontSize={36}
                    fontWeight={400}
                    lineHeight={1.38}
                    colorHex={color.muted}
                  />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
};
