import React from 'react';
import { color, font, layout, radius, stroke } from '../tokens';
import { s02 } from '../content';
import { Reveal, useShow, useText } from '../lib/show';
import { TextBlock } from '../components/Placeholders';

export const Slide02_Identity: React.FC = () => {
  const { mode } = useShow();
  const missionText = useText(s02.mission);

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
      {/* Kicker & Mission */}
      <Reveal i={0}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: font.body,
            fontSize: 28,
            fontWeight: 600,
            color: color.blue,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color.blue }} />
          {s02.kicker}
        </div>
      </Reveal>

      {/* Sứ mệnh lớn */}
      <Reveal i={1}>
        <div style={{ marginBottom: 80, maxWidth: 900 }}>
          <TextBlock
            resolved={missionText}
            field={s02.mission}
            mode={mode}
            fontSize={56}
            fontWeight={700}
            lineHeight={1.22}
            isHeading
          />
        </div>
      </Reveal>

      {/* Tiêu đề 3 nguyên tắc */}
      <Reveal i={2}>
        <div
          style={{
            fontFamily: font.heading,
            fontSize: 32,
            fontWeight: 700,
            color: color.muted,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            borderBottom: `${stroke.hair}px solid ${color.border}`,
            paddingBottom: 16,
            marginBottom: 36,
          }}
        >
          {s02.principlesTitle}
        </div>
      </Reveal>

      {/* Danh sách 3 nguyên tắc dạng biên tập */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {s02.principles.map((p, idx) => {
          const tText = useText(p.title);
          const bText = useText(p.body);
          return (
            <Reveal key={`principle-${idx}`} i={3 + idx}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 32,
                  paddingBottom: 36,
                  borderBottom: idx < s02.principles.length - 1 ? `1px solid ${color.border}` : 'none',
                }}
              >
                {/* Số thứ tự */}
                <div
                  style={{
                    fontFamily: font.heading,
                    fontSize: 36,
                    fontWeight: 700,
                    color: color.cyanText,
                    fontVariantNumeric: 'tabular-nums',
                    width: 52,
                    flexShrink: 0,
                  }}
                >
                  0{idx + 1}
                </div>

                {/* Nội dung nguyên tắc */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <TextBlock
                    resolved={tText}
                    field={p.title}
                    mode={mode}
                    fontSize={40}
                    fontWeight={600}
                    lineHeight={1.25}
                    isHeading
                  />
                  <TextBlock
                    resolved={bText}
                    field={p.body}
                    mode={mode}
                    fontSize={36}
                    fontWeight={400}
                    lineHeight={1.4}
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
