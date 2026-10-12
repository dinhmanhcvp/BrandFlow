import React from 'react';
import { color, font, layout, radius, stroke } from '../tokens';
import { s07 } from '../content';
import { Reveal, useShow, useText } from '../lib/show';
import { TextBlock } from '../components/Placeholders';

export const Slide07_Journey2: React.FC = () => {
  const { mode } = useShow();

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
            {s07.title}
          </h2>
          <p style={{ fontFamily: font.body, fontSize: 36, color: color.muted, margin: 0 }}>
            Định hướng nghiên cứu, hoàn thiện công nghệ và mở rộng ứng dụng thực tiễn.
          </p>
        </div>
      </Reveal>

      {/* Trục thời gian dọc (Có đoạn nét đứt cho kế hoạch) */}
      <div style={{ position: 'relative', paddingLeft: 60, display: 'flex', flexDirection: 'column', gap: 64 }}>
        {/* Đường trục dọc: nét đứt */}
        <div
          style={{
            position: 'absolute',
            left: 17,
            top: 24,
            bottom: 40,
            width: stroke.line,
            borderLeft: `2.5px dashed ${color.borderStrong}`,
          }}
        />

        {s07.phases.map((p, idx) => {
          const timeText = useText(p.time);
          const nameText = useText(p.name);
          const descText = useText(p.desc);
          const isPlanned = (p as any).planned;

          return (
            <Reveal key={`phase2-${idx}`} i={1 + idx}>
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
                    backgroundColor: isPlanned ? color.surfaceMuted : color.surface,
                    border: `3px ${isPlanned ? 'dashed' : 'solid'} ${isPlanned ? color.borderStrong : color.cyan}`,
                    boxSizing: 'border-box',
                    zIndex: 2,
                  }}
                />

                {/* Hàng Header mốc: Thời gian + Tag Kế hoạch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      fontFamily: font.heading,
                      fontSize: 28,
                      fontWeight: 700,
                      color: isPlanned ? color.muted : color.cyanText,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    <TextBlock resolved={timeText} field={p.time} mode={mode} fontSize={28} />
                  </div>

                  {isPlanned && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        backgroundColor: color.surfaceMuted,
                        border: `1.5px solid ${color.borderStrong}`,
                        borderRadius: radius.sm,
                        padding: '2px 12px',
                        fontFamily: font.body,
                        fontSize: 28,
                        fontWeight: 600,
                        color: color.muted,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {s07.plannedLabel}
                    </span>
                  )}
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
