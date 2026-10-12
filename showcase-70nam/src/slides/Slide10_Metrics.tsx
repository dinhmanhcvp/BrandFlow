import React from 'react';
import { color, font, layout, radius, stroke } from '../tokens';
import { s10 } from '../content';
import { Reveal, useProgress, useShow, useText, at } from '../lib/show';
import { TextBlock } from '../components/Placeholders';

export const Slide10_Metrics: React.FC = () => {
  const { mode } = useShow();
  // Đếm tăng một lần 1.2s
  const countProgress = useProgress(at(1), 1.2);

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
        <div style={{ marginBottom: 60 }}>
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
            {s10.title}
          </h2>
          <p style={{ fontFamily: font.body, fontSize: 36, color: color.muted, margin: 0 }}>
            Dữ liệu ghi nhận từ quá trình vận hành thử nghiệm và triển khai giải pháp.
          </p>
        </div>
      </Reveal>

      {/* Lưới 4 chỉ số lớn (2 hàng x 2 cột) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
        {s10.metrics.map((m, idx) => {
          const nameText = useText(m.name);
          const sourceText = useText(m.source);

          // Xử lý giá trị số:
          // Nếu mode = empty và không có value thật: hiện "—"
          const isReal = m.value !== null;
          const targetNum = isReal ? m.value! : mode === 'empty' ? null : m.sample;
          const displayedNum = targetNum !== null ? Math.round(targetNum * countProgress) : null;

          return (
            <Reveal key={`metric-${idx}`} i={1 + idx}>
              <div
                style={{
                  backgroundColor: color.surface,
                  border: `1.5px solid ${color.border}`,
                  borderRadius: radius.lg,
                  padding: '40px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  minHeight: 260,
                }}
              >
                {/* Con số lớn */}
                <div
                  style={{
                    fontFamily: font.heading,
                    fontSize: 84,
                    fontWeight: 700,
                    color: color.blue,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    fontVariantNumeric: 'tabular-nums',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 6,
                  }}
                >
                  {displayedNum !== null ? (
                    <>
                      <span>{displayedNum.toLocaleString('vi-VN')}</span>
                      {m.suffix && <span style={{ fontSize: 52 }}>{m.suffix}</span>}
                    </>
                  ) : (
                    <span style={{ color: color.borderStrong }}>—</span>
                  )}
                </div>

                {/* Tên chỉ số */}
                <div style={{ minHeight: 64 }}>
                  <TextBlock
                    resolved={nameText}
                    field={m.name}
                    mode={mode}
                    fontSize={38}
                    fontWeight={600}
                    lineHeight={1.3}
                    isHeading
                  />
                </div>

                {/* Nguồn và thời điểm */}
                <div
                  style={{
                    borderTop: `1px solid ${color.border}`,
                    paddingTop: 12,
                    marginTop: 'auto',
                  }}
                >
                  <TextBlock
                    resolved={sourceText}
                    field={m.source}
                    mode={mode}
                    fontSize={28}
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
