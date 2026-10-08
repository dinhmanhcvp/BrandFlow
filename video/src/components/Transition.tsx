import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring as springConf } from '../motion/springs';

export const Transition: React.FC<{ children: React.ReactNode, type?: 'slide' | 'zoom' | 'fade' | 'slide-up' | 'slide-down' | 'flip' | 'blur' }> = ({ children, type = 'zoom' }) => {
 const frame = useCurrentFrame();
 const { fps, durationInFrames } = useVideoConfig();

 // Enter animation
 const enterSpring = spring({ frame, fps, config: springConf.bouncy });
 // Exit animation (starts 15 frames before the end of this sequence)
 const exitFrame = frame - (durationInFrames - 15);
 const exitSpring = exitFrame > 0 ? spring({ frame: exitFrame, fps, config: springConf.soft }) : 0;

 let style: React.CSSProperties = { width: '100%', height: '100%' };

 if (type === 'zoom') {
  const scale = interpolate(enterSpring, [0, 1], [1.1, 1]) - interpolate(exitSpring, [0, 1], [0, 0.1]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]) - interpolate(exitSpring, [0, 1], [0, 1]);
  style = { ...style, transform: `scale(${scale})`, opacity };
 } else if (type === 'slide') {
  const x = interpolate(enterSpring, [0, 1], [100, 0]) - interpolate(exitSpring, [0, 1], [0, -100]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]) - interpolate(exitSpring, [0, 1], [0, 1]);
  style = { ...style, transform: `translateX(${x}%)`, opacity };
 } else if (type === 'slide-up') {
  const y = interpolate(enterSpring, [0, 1], [100, 0]) - interpolate(exitSpring, [0, 1], [0, -100]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]) - interpolate(exitSpring, [0, 1], [0, 1]);
  style = { ...style, transform: `translateY(${y}%)`, opacity };
 } else if (type === 'slide-down') {
  const y = interpolate(enterSpring, [0, 1], [-100, 0]) - interpolate(exitSpring, [0, 1], [0, 100]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]) - interpolate(exitSpring, [0, 1], [0, 1]);
  style = { ...style, transform: `translateY(${y}%)`, opacity };
 } else if (type === 'flip') {
  const rot = interpolate(enterSpring, [0, 1], [90, 0]) - interpolate(exitSpring, [0, 1], [0, -90]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]) - interpolate(exitSpring, [0, 1], [0, 1]);
  style = { ...style, transform: `perspective(1000px) rotateY(${rot}deg)`, opacity };
 } else if (type === 'blur') {
  const b = interpolate(enterSpring, [0, 1], [50, 0]) + interpolate(exitSpring, [0, 1], [0, 50]);
  const scale = interpolate(enterSpring, [0, 1], [1.2, 1]) - interpolate(exitSpring, [0, 1], [0, 0.2]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]) - interpolate(exitSpring, [0, 1], [0, 1]);
  style = { ...style, filter: `blur(${b}px)`, transform: `scale(${scale})`, opacity };
 } else {
  // fade
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]) - interpolate(exitSpring, [0, 1], [0, 1]);
  style = { ...style, opacity };
 }

 return (
  <div style={style}>
   {children}
  </div>
 );
};
