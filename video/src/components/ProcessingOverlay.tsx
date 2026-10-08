import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { Zap, Check } from 'lucide-react';
import { WebBackground } from './WebBackground';

const { fontFamily } = loadFont();

export const ProcessingOverlay: React.FC = () => {
 const frame = useCurrentFrame();
 const { fps } = useVideoConfig();

 // Animations
 const containerSpring = spring({ frame, fps, config: springConf.snappy });
 const opacity = interpolate(containerSpring, [0, 1], [0, 1]);

 // Loading texts array
 const loadingTexts = [
  "Phân tích dữ liệu đầu vào (Bếp Nhà Mộc)...",
  "Trích xuất giá trị cốt lõi (Core Values)...",
  "Đối chiếu dữ liệu thị trường (Market Mapping)...",
 ];

 // We have 120 frames. 
 // Frame 0-30: text 0
 // Frame 30-60: text 1
 // Frame 60-90: text 2
 // Frame 90+: SUCCESS STATE



 const textIndex = Math.min(
  Math.floor(frame / 30),
  loadingTexts.length - 1
 );
 
 // Animate text appearance for the current index
 const textEnterFrame = frame - (textIndex * 30);
 const textOpacity = interpolate(textEnterFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
 const textY = interpolate(textEnterFrame, [0, 15], [5, 0], { extrapolateRight: 'clamp' });

 // Rotate spinner
 const rotate = (frame / fps) * 360; // 1 full rotation per second
 const pulse = Math.sin((frame / fps) * Math.PI * 2) * 0.5 + 0.5; // 0 to 1

 return (
  <AbsoluteFill style={{ 
   backgroundColor: '#0B1120', 
   zIndex: 100, 
   opacity,
   fontFamily
  }}>
   <WebBackground />
   
   <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    textAlign: 'center'
   }}>
    <div style={{ position: 'relative', width: 96, height: 96, marginBottom: 32 }}>
     {/* Base circle */}
     <div style={{
      position: 'absolute',
      inset: 0,
      border: '4px solid',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '50%',
      backgroundColor: 'transparent',
      transition: 'all 0.3s ease'
     }} />
     
     {/* Rotating gradient border */}
     <div style={{
      position: 'absolute',
      inset: 0,
      border: '4px solid transparent',
      borderTopColor: '#3B82F6',
      borderRightColor: '#22D3EE',
      borderRadius: '50%',
      transform: `rotate(${rotate}deg)`
     }} />
     
     {/* Icon */}
     <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
     }}>
      <div style={{ opacity: 0.5 + (pulse * 0.5) }}>
       <Zap size={32} color="#2563EB" />
      </div>
     </div>
    </div>
    
    <h2 style={{ 
     fontSize: 24, 
     fontWeight: 800, 
     color: 'white', 
     marginBottom: 8 
    }}>
     Đang khởi tạo Brand DNA...
    </h2>
    <p style={{
     fontSize: 14,
     fontWeight: 700,
     color: '#22D3EE',
     letterSpacing: 2,
     textTransform: 'uppercase',
     opacity: textOpacity,
     transform: `translateY(${textY}px)`
    }}>
     {loadingTexts[textIndex]}
    </p>
   </div>
  </AbsoluteFill>
 );
};
