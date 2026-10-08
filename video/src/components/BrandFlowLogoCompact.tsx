import React from 'react';
import { Img, staticFile } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Pacifico';

const { fontFamily } = loadFont();

/**
 * Compact corner logo: icon + "BrandFlow" text only, no subtitle.
 * Used in top-left of Scene 2/3/4 to avoid covering content.
 */
export const BrandFlowLogoCompact: React.FC = () => {
 return (
  <div style={{
   display: 'flex',
   alignItems: 'center',
   gap: 8,
  }}>
   <Img 
    src={staticFile('ref/logos/brandflow_icon.svg')} 
    style={{ width: 32, height: 32 }} 
   />
   <div style={{
    fontFamily,
    fontSize: 22,
    color: '#FFFFFF',
    filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.5))',
    lineHeight: 1,
    letterSpacing: 0,
   }}>
    BrandFlow
   </div>
  </div>
 );
};
