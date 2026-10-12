import React from 'react';
import { Composition, Sequence, useCurrentFrame, interpolate } from 'remotion';
import { ensureFonts } from './lib/fonts';
import { FPS, sec, slideSeconds, motion, EASE } from './timing';
import { layout } from './tokens';
import { previewMode, PreviewMode, showEnglishTagline, s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12 } from './content';
import { ShowCtx } from './lib/show';
import { SlideWrapper } from './slides/SlideWrapper';

import { Slide01_Intro } from './slides/Slide01_Intro';
import { Slide02_Identity } from './slides/Slide02_Identity';
import { Slide03_Logo } from './slides/Slide03_Logo';
import { Slide04_Color } from './slides/Slide04_Color';
import { Slide05_Typography } from './slides/Slide05_Typography';
import { Slide06_Journey1 } from './slides/Slide06_Journey1';
import { Slide07_Journey2 } from './slides/Slide07_Journey2';
import { Slide08_Awards } from './slides/Slide08_Awards';
import { Slide09_Product } from './slides/Slide09_Product';
import { Slide10_Metrics } from './slides/Slide10_Metrics';
import { Slide11_Credits } from './slides/Slide11_Credits';
import { Slide12_Outro } from './slides/Slide12_Outro';

const SLIDES_CONFIG = [
  { id: 's01', name: 'Mở đầu', comp: Slide01_Intro, section: s01.section },
  { id: 's02', name: 'Bản sắc thương hiệu', comp: Slide02_Identity, section: s02.section },
  { id: 's03', name: 'Biểu trưng', comp: Slide03_Logo, section: s03.section },
  { id: 's04', name: 'Màu sắc', comp: Slide04_Color, section: s04.section },
  { id: 's05', name: 'Kiểu chữ', comp: Slide05_Typography, section: s05.section },
  { id: 's06', name: 'Hành trình 1', comp: Slide06_Journey1, section: s06.section },
  { id: 's07', name: 'Hành trình 2', comp: Slide07_Journey2, section: s07.section },
  { id: 's08', name: 'Thành tích', comp: Slide08_Awards, section: s08.section },
  { id: 's09', name: 'Sản phẩm', comp: Slide09_Product, section: s09.section },
  { id: 's10', name: 'Kết quả bước đầu', comp: Slide10_Metrics, section: s10.section },
  { id: 's11', name: 'Ghi nhận', comp: Slide11_Credits, section: s11.section },
  { id: 's12', name: 'Kết', comp: Slide12_Outro, section: s12.section },
];

interface MainVideoProps {
  previewMode?: PreviewMode;
}

const MainShowcase: React.FC<MainVideoProps> = ({ previewMode: activeMode = previewMode }) => {
  ensureFonts();

  let currentStart = 0;
  const slideEntries = SLIDES_CONFIG.map((cfg, idx) => {
    const durSec = slideSeconds[cfg.id] || 10;
    const durFrames = sec(durSec);
    const entry = {
      ...cfg,
      idx,
      startFrame: currentStart,
      durationFrames: durFrames,
    };
    currentStart += durFrames;
    return entry;
  });

  const totalFrames = currentStart;

  return (
    <>
      {slideEntries.map((item) => {
        const Comp = item.comp;
        const ctx: ShowCtx = {
          mode: activeMode,
          showEnglishTagline,
          slideStart: item.startFrame,
          totalFrames,
          index: item.idx,
          count: SLIDES_CONFIG.length,
          section: item.section,
        };

        return (
          <Sequence
            key={item.id}
            from={item.startFrame}
            durationInFrames={item.durationFrames}
          >
            <SlideFadeWrapper durationFrames={item.durationFrames}>
              <SlideWrapper ctx={ctx}>
                <Comp />
              </SlideWrapper>
            </SlideFadeWrapper>
          </Sequence>
        );
      })}
    </>
  );
};

// Seamless 0.4s fade transition between slides
const SlideFadeWrapper: React.FC<{ durationFrames: number; children: React.ReactNode }> = ({
  durationFrames,
  children,
}) => {
  const frame = useCurrentFrame();
  const transFrames = sec(motion.transition); // 0.4s = 12 frames

  const fadeIn = interpolate(frame, [0, transFrames], [0, 1], {
    easing: EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(frame, [durationFrames - transFrames, durationFrames], [1, 0], {
    easing: EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return <div style={{ width: '100%', height: '100%', opacity: Math.min(fadeIn, fadeOut) }}>{children}</div>;
};

// Standalone Slide Runner for STILL rendering
const SingleSlideRunner: React.FC<{ index: number; previewMode?: PreviewMode }> = ({
  index,
  previewMode: activeMode = 'empty',
}) => {
  ensureFonts();
  const cfg = SLIDES_CONFIG[index];
  const Comp = cfg.comp;
  const ctx: ShowCtx = {
    mode: activeMode,
    showEnglishTagline,
    slideStart: 0,
    totalFrames: 300,
    index,
    count: SLIDES_CONFIG.length,
    section: cfg.section,
  };

  return (
    <SlideWrapper ctx={ctx}>
      <Comp />
    </SlideWrapper>
  );
};

export const RemotionRoot: React.FC = () => {
  // Compute total duration of full sequence
  const totalSeconds = Object.values(slideSeconds).reduce((a, b) => a + b, 0);

  return (
    <>
      {/* 1. Main Full Vertical Video Presentation (1080 x 1920) */}
      <Composition
        id="Showcase70Nam"
        component={MainShowcase}
        durationInFrames={sec(totalSeconds)}
        fps={FPS}
        width={layout.width}
        height={layout.height}
        defaultProps={{
          previewMode: 'empty',
        }}
      />

      {/* 2. Compositions for each of the 12 slides (Individual Still & Preview) */}
      {SLIDES_CONFIG.map((cfg, idx) => (
        <Composition
          key={`slide-comp-${idx}`}
          id={`Slide-${(idx + 1).toString().padStart(2, '0')}`}
          component={SingleSlideRunner}
          durationInFrames={sec(slideSeconds[cfg.id] || 10)}
          fps={FPS}
          width={layout.width}
          height={layout.height}
          defaultProps={{
            index: idx,
            previewMode: 'empty',
          }}
        />
      ))}
    </>
  );
};
