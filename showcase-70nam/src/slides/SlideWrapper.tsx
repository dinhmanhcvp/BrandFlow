import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ShowContext, ShowCtx } from '../lib/show';
import { ParticleBackground } from '../components/ParticleBackground';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

interface SlideWrapperProps {
  ctx: ShowCtx;
  children: React.ReactNode;
}

export const SlideWrapper: React.FC<SlideWrapperProps> = ({ ctx, children }) => {
  return (
    <ShowContext.Provider value={ctx}>
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        {/* Dynamic Light Floating Particles Background */}
        <ParticleBackground />

        {/* Global Slide Header (Top safe area) */}
        <Header />

        {/* Slide Body Content */}
        {children}

        {/* Global Slide Footer (Bottom safe area) */}
        <Footer />
      </AbsoluteFill>
    </ShowContext.Provider>
  );
};
