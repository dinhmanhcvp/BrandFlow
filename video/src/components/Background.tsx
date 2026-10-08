import React from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';

export const PlexusBackground: React.FC<{ opacity?: number }> = ({ opacity = 0.4 }) => {
 return (
  <AbsoluteFill style={{ backgroundColor: '#0B132B' }}>
   <OffthreadVideo 
    src={staticFile('ref/Homepage.mp4')} 
    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity }} 
    muted 
    playbackRate={0.5} // Slow, elegant movement
   />
   {/* Dark gradient overlay for text readability */}
   <div style={{
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, rgba(11,19,43,0.3) 0%, rgba(11,19,43,0.9) 100%)'
   }} />
  </AbsoluteFill>
 );
};
