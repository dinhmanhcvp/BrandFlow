import React from 'react';
import { Img, staticFile } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Pacifico';

const { fontFamily } = loadFont();

export const BrandFlowLogo: React.FC<{ scale?: number; transformOrigin?: string }> = ({ scale = 1, transformOrigin = 'center' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transform: `scale(${scale})`,
      transformOrigin,
    }}>
      {/* Icon */}
      <Img 
        src={staticFile('ref/logos/brandflow_icon.svg')} 
        style={{ width: 120, height: 120, marginBottom: -20, zIndex: 10 }} 
      />
      
      {/* Cursive Text */}
      <div style={{
        fontFamily,
        fontSize: 100,
        color: '#FFFFFF',
        filter: 'drop-shadow(0 0 10px #06B6D4) drop-shadow(0 0 20px #06B6D4)',
        lineHeight: 1,
        letterSpacing: 0,
        zIndex: 5
      }}>
        BrandFlow
      </div>

      {/* Subtitle */}
      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#06B6D4',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginTop: 10,
        textShadow: '0 0 10px rgba(6,182,212,0.5)'
      }}>
        Hệ sinh thái AI quản trị Marketing & Tài chính toàn diện
      </div>
    </div>
  );
};
