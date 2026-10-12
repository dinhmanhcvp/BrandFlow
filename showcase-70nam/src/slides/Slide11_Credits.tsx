import React from 'react';
import { color, font, layout, radius, stroke } from '../tokens';
import { s11 } from '../content';
import { Reveal, useShow, useText } from '../lib/show';
import { TextBlock, ImageBox } from '../components/Placeholders';

export const Slide11_Credits: React.FC = () => {
  const { mode } = useShow();
  const thanksText = useText(s11.thanks);

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
        <div style={{ marginBottom: 40 }}>
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
            {s11.title}
          </h2>
          <p style={{ fontFamily: font.body, fontSize: 36, color: color.muted, margin: 0 }}>
            Tri ân tập thể nghiên cứu, các thầy cô hướng dẫn và các đơn vị đồng hành.
          </p>
        </div>
      </Reveal>

      {/* Lưới 2 cột: Nhóm thực hiện & Giảng viên */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, marginBottom: 40 }}>
        {/* Nhóm thực hiện */}
        <Reveal i={1}>
          <div
            style={{
              backgroundColor: color.surface,
              border: `1.5px solid ${color.border}`,
              borderRadius: radius.lg,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: font.heading,
                fontSize: 28,
                fontWeight: 700,
                color: color.blue,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: `1px solid ${color.border}`,
                paddingBottom: 10,
              }}
            >
              {s11.teamTitle}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {s11.team.map((mem, idx) => (
                <div key={`team-mem-${idx}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <TextBlock resolved={useText(mem.name)} field={mem.name} mode={mode} fontSize={34} fontWeight={600} />
                  <TextBlock resolved={useText(mem.role)} field={mem.role} mode={mode} fontSize={28} colorHex={color.muted} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Giảng viên hướng dẫn */}
        <Reveal i={2}>
          <div
            style={{
              backgroundColor: color.surface,
              border: `1.5px solid ${color.border}`,
              borderRadius: radius.lg,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: font.heading,
                fontSize: 28,
                fontWeight: 700,
                color: color.blue,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                borderBottom: `1px solid ${color.border}`,
                paddingBottom: 10,
              }}
            >
              {s11.advisorTitle}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {s11.advisors.map((adv, idx) => (
                <div key={`adv-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <TextBlock resolved={useText(adv.name)} field={adv.name} mode={mode} fontSize={36} fontWeight={600} isHeading />
                  <TextBlock resolved={useText(adv.unit)} field={adv.unit} mode={mode} fontSize={30} colorHex={color.muted} />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Đơn vị đồng hành */}
      <Reveal i={3}>
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
            {s11.partnerTitle}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {s11.partners.map((p, idx) => (
              <ImageBox key={`partner-${idx}`} field={p} width="100%" height={100} fallbackLabel={p.label} />
            ))}
          </div>
        </div>
      </Reveal>

      {/* Lời cảm ơn */}
      <Reveal i={4}>
        <div
          style={{
            backgroundColor: color.surfaceMuted,
            borderRadius: radius.md,
            padding: '24px 32px',
            borderLeft: `4px solid ${color.cyan}`,
          }}
        >
          <TextBlock
            resolved={thanksText}
            field={s11.thanks}
            mode={mode}
            fontSize={36}
            fontWeight={500}
            lineHeight={1.4}
            colorHex={color.foreground}
          />
        </div>
      </Reveal>
    </div>
  );
};
