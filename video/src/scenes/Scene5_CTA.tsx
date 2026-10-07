import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring } from 'remotion';
import { beat, FPS } from '../motion/beat';
import { BrandFlowLogo } from '../components/BrandFlowLogo';
import { WebBackground } from '../components/WebBackground';
import { RemotionMetrics } from '../components/RemotionMetrics';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily } = loadFont();

export const Scene5_CTA: React.FC = () => {
  const frame = useCurrentFrame();

  const logoScale = spring({ frame: frame - beat(2), fps: FPS, config: springConf.bouncy });
  const textOpacity = interpolate(frame, [beat(4), beat(6)], [0, 1], { extrapolateRight: 'clamp' });
  const ctaPop = spring({ frame: frame - beat(6), fps: FPS, config: springConf.pop });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000', color: 'white', fontFamily, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      <WebBackground />

      <Sequence>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}>
          {frame >= beat(2) && (
            <div style={{ 
              transform: `scale(${logoScale})`, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}>
              <BrandFlowLogo scale={0.9} />
            </div>
          )}

          <div style={{ opacity: textOpacity, textAlign: 'center', marginTop: 40 }}>
            <p style={{ fontSize: 44, fontWeight: '800', margin: '0 0 12px 0', textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
              The Ultimate AI Marketing Operating System
            </p>
            <p style={{ fontSize: 26, color: '#94a3b8', margin: '0 0 48px 0', fontWeight: '500' }}>
              Tự động hóa toàn bộ quy trình Marketing với AI
            </p>
            
            <div style={{ marginBottom: 40, opacity: textOpacity, width: '100%', display: 'flex', justifyContent: 'center' }}>
              {frame >= beat(4) && <RemotionMetrics />}
            </div>

            <div style={{ 
              transform: `scale(${ctaPop})`,
              padding: '3px',
              background: 'linear-gradient(90deg, #3B82F6, #06B6D4)',
              borderRadius: 60,
              display: 'inline-block',
              boxShadow: '0 0 40px rgba(6, 182, 212, 0.4)'
            }}>
              <div style={{
                background: '#0B132B',
                padding: '20px 60px',
                borderRadius: 57,
                fontSize: 26,
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                letterSpacing: 1
              }}>
                Trải nghiệm ngay
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 40,
              opacity: interpolate(frame, [beat(8), beat(10)], [0, 1], { extrapolateRight: 'clamp' })
            }}>
              <div style={{ 
                fontSize: 36, 
                fontWeight: '800',
                color: '#06B6D4', 
                letterSpacing: 2,
                textShadow: '0 0 20px rgba(6, 182, 212, 0.8)'
              }}>
                https://brand-flow-hust.vercel.app
              </div>
            </div>
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};
