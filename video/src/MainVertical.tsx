import React from 'react';
import { AbsoluteFill } from 'remotion';
import { MainVideo } from './Main';
import { WebBackground } from './components/WebBackground';

export const MainVertical: React.FC = () => {
 return (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
   <WebBackground />
   {/* Blurred background video effect */}
   <div style={{
    position: 'absolute',
    width: 1920,
    height: 1080,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%) scale(1.777)', // Fill height
    filter: 'blur(40px)',
    opacity: 0.3
   }}>
    <MainVideo />
   </div>

   {/* Main Content scaled to fit width (1080) */}
   <div style={{
    position: 'absolute',
    width: 1920,
    height: 1080,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%) scale(0.5625)', // 1080 / 1920 = 0.5625
    boxShadow: '0 0 100px rgba(0,0,0,1)'
   }}>
    <MainVideo />
   </div>
  </AbsoluteFill>
 );
};
