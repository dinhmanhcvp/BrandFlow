import React from 'react';
import { color, font, layout, radius, stroke } from '../tokens';
import { s08 } from '../content';
import { Reveal, useShow, useText } from '../lib/show';
import { TextBlock } from '../components/Placeholders';

export const Slide08_Awards: React.FC = () => {
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
            {s08.title}
          </h2>
          <p style={{ fontFamily: font.body, fontSize: 36, color: color.muted, margin: 0 }}>
            Các giải thưởng khoa học, công nghệ và khởi nghiệp đổi mới sáng tạo.
          </p>
        </div>
      </Reveal>

      {/* Bảng dạng biên tập */}
      <Reveal i={1}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            backgroundColor: color.surface,
            border: `1.5px solid ${color.border}`,
            borderRadius: radius.lg,
            overflow: 'hidden',
          }}
        >
          {/* Header Bảng */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 1fr 180px',
              gap: 20,
              padding: '20px 28px',
              backgroundColor: color.surfaceMuted,
              borderBottom: `${stroke.hair}px solid ${color.border}`,
              fontFamily: font.heading,
              fontSize: 28,
              fontWeight: 700,
              color: color.muted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <div>{s08.columns.year}</div>
            <div>{s08.columns.name}</div>
            <div>{s08.columns.organizer}</div>
            <div style={{ textAlign: 'right' }}>{s08.columns.result}</div>
          </div>

          {/* Dòng dữ liệu (Tối đa 6 hàng) */}
          {s08.awards.slice(0, 6).map((a, idx) => {
            const yText = useText(a.year);
            const nText = useText(a.name);
            const oText = useText(a.organizer);
            const rText = useText(a.result);

            return (
              <div
                key={`award-row-${idx}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 1fr 180px',
                  gap: 20,
                  padding: '24px 28px',
                  alignItems: 'baseline',
                  borderBottom: idx < 5 ? `1px solid ${color.border}` : 'none',
                }}
              >
                {/* Năm */}
                <div style={{ fontFamily: font.heading, fontSize: 34, fontWeight: 700, color: color.blue }}>
                  <TextBlock resolved={yText} field={a.year} mode={mode} fontSize={32} />
                </div>

                {/* Tên giải */}
                <div>
                  <TextBlock resolved={nText} field={a.name} mode={mode} fontSize={36} fontWeight={600} isHeading />
                </div>

                {/* Đơn vị tổ chức */}
                <div>
                  <TextBlock resolved={oText} field={a.organizer} mode={mode} fontSize={34} colorHex={color.muted} />
                </div>

                {/* Kết quả */}
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      fontFamily: font.heading,
                      fontSize: 30,
                      fontWeight: 700,
                      color: color.cyanText,
                    }}
                  >
                    <TextBlock resolved={rText} field={a.result} mode={mode} fontSize={30} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
};
