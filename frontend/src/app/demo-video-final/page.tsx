"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

/**
 * HƯỚNG DẪN SỬ DỤNG CHO NGƯỜI EDIT:
 * 1. Đổi tên link src ở dưới cho khớp (VD: src="/docs/01_workspace_phase3.webp")
 * 2. Mở trang http://localhost:3000/demo-video-final
 * 3. Nhấn F11 (Fullscreen).
 * 4. Bấm SPACE (khoảng trắng) để chuyển cảnh khớp với beat nhạc.
 */

const SCENES = [
  { id: 'start', type: 'intro', text: 'Nhấn SPACE để bắt đầu' },
  { id: 'hook1', type: 'text', text: 'MARKETING.', delay: 0.1 },
  { id: 'hook2', type: 'text', text: 'AUTOMATED.', delay: 0.1 },
  { id: 'hook3', type: 'text', text: 'REIMAGINED.', delay: 0.1 },
  { id: 'logo', type: 'logo', text: 'BRANDFLOW' },
  { 
    id: 'scene1', 
    type: 'video', 
    src: '/docs/01_workspace_phase3.webp',
    title: 'THE POWER OF AN AGENCY.', 
    subtitle: 'Nằm gọn trong một hệ thống.',
    animation: '3d-tilt-zoom'
  },
  { 
    id: 'scene2', 
    type: 'video', 
    src: '/docs/02_workspace_phase5.webp',
    title: 'INFINITE CREATIVITY.', 
    subtitle: 'Zero độ trễ. Thiết kế Multi-modal.',
    animation: 'slide-scale-fast'
  },
  { 
    id: 'scene3', 
    type: 'video', 
    src: '/docs/03_workspace_phase6.webp',
    title: 'AI INTELLIGENCE.', 
    subtitle: 'Dành riêng cho B2B.',
    animation: 'macro-zoom-pan'
  },
  { 
    id: 'scene4', 
    type: 'video', 
    src: '/docs/04_planning_gantt.webp',
    title: 'TOTAL CONTROL.', 
    subtitle: 'Ngân sách dưới tầm kiểm soát tuyệt đối.',
    animation: 'epic-zoom-out'
  },
  { id: 'outro', type: 'outro', text: 'BRANDFLOW' },
];

export default function EpicVideoComposer() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setStep(s => Math.min(s + 1, SCENES.length - 1));
      }
      if (e.code === 'ArrowLeft') {
        setStep(s => Math.max(s - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentScene = SCENES[step];

  return (
    <div 
      className={`w-screen h-screen bg-[#020617] overflow-hidden flex items-center justify-center relative cursor-pointer ${inter.variable} ${spaceGrotesk.variable} font-sans`}
      onClick={() => setStep(s => Math.min(s + 1, SCENES.length - 1))}
      style={{ perspective: '2500px' }}
    >
      
      {/* Background Ambient Particles/Glow matching Visual DNA */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-cyan-600/30 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-blue-700/20 rounded-full blur-[150px] mix-blend-screen" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- DẠNG 1: HOOK TEXT (Apple Style - Fast & Punchy) --- */}
        {currentScene.type === 'text' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <h1 className="text-8xl md:text-[140px] font-black text-white tracking-tighter uppercase font-space">
              {currentScene.text}
            </h1>
          </motion.div>
        )}

        {/* --- DẠNG 2: LOGO GLOW (Epic Reveal) --- */}
        {currentScene.type === 'logo' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(30px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center flex-col gap-8 z-10"
          >
            <motion.div 
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-cyan-400/30 blur-[60px] rounded-full scale-150 animate-pulse" />
              <BrandFlowLogo className="w-40 h-40 drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]" />
            </motion.div>
            
            <h1 className="text-7xl md:text-[130px] font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 z-10 tracking-tight font-space drop-shadow-lg">
              {currentScene.text}
            </h1>
          </motion.div>
        )}

        {/* --- DẠNG 3: VIDEO SHOWCASE (Apple + ElevenLabs Style) --- */}
        {currentScene.type === 'video' && (
          <motion.div
            key={currentScene.id}
            className="absolute inset-0 flex flex-col items-center justify-center w-full h-full z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.6 }}
          >
            {/* Top Typography (Apple Style) */}
            <div className="absolute top-[8%] left-0 right-0 text-center z-30">
              <motion.h2 
                initial={{ y: 40, opacity: 0, scale: 0.9 }} 
                animate={{ y: 0, opacity: 1, scale: 1 }} 
                transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
                className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] font-space uppercase"
              >
                {currentScene.title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ delay: 0.6, duration: 0.7 }}
                className="text-2xl md:text-3xl text-cyan-200/80 font-medium mt-4 tracking-wide font-inter"
              >
                {currentScene.subtitle}
              </motion.p>
            </div>

            {/* Khung Video (ElevenLabs Floating UI) */}
            <motion.div
              className="relative w-[90vw] max-w-[1500px] mt-24 aspect-[16/9] rounded-3xl overflow-hidden border border-white/20 shadow-[0_50px_150px_rgba(0,0,0,0.9),0_0_50px_rgba(34,211,238,0.2)]"
              // Các kiểu hiệu ứng Camera khác nhau tùy scene cực gắt
              initial={
                currentScene.animation === '3d-tilt-zoom' ? { rotateX: 30, rotateY: -20, rotateZ: 5, scale: 0.6, y: 200, opacity: 0 } :
                currentScene.animation === 'slide-scale-fast' ? { x: 500, scale: 0.5, rotateY: 30, opacity: 0 } :
                currentScene.animation === 'macro-zoom-pan' ? { scale: 1.8, x: '20%', y: '-10%', opacity: 0 } :
                { scale: 1.5, opacity: 0, filter: "blur(20px)" } // epic-zoom-out
              }
              animate={
                currentScene.animation === '3d-tilt-zoom' ? { rotateX: 8, rotateY: -8, rotateZ: 0, scale: 0.95, y: 20, opacity: 1 } :
                currentScene.animation === 'slide-scale-fast' ? { x: 0, scale: 0.95, rotateY: 0, opacity: 1 } :
                currentScene.animation === 'macro-zoom-pan' ? { scale: 1.25, x: '-5%', y: '5%', opacity: 1 } :
                { scale: 0.95, opacity: 1, filter: "blur(0px)" }
              }
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Fake Glass Reflection Highlight */}
              <motion.div 
                className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none mix-blend-overlay origin-left"
                initial={{ x: '-100%', skewX: -20 }}
                animate={{ x: '100%' }}
                transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
              />
              
              <img 
                src={currentScene.src} 
                className="w-full h-full object-cover"
                alt="Demo Scene"
              />
            </motion.div>
          </motion.div>
        )}

        {/* --- DẠNG 4: OUTRO --- */}
        {currentScene.type === 'outro' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] z-50"
          >
            <div className="absolute w-[60vw] h-[60vw] bg-gradient-to-tr from-cyan-600/30 to-blue-700/30 rounded-full blur-[120px] mix-blend-screen"></div>
            
            <BrandFlowLogo className="w-24 h-24 mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
            
            <h1 className="text-6xl md:text-[110px] font-black text-white tracking-tighter z-10 font-space uppercase">
              {currentScene.text}
            </h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col items-center gap-2"
            >
              <p className="text-xl text-cyan-200 tracking-[0.3em] uppercase font-bold font-inter">Đại học Bách Khoa Hà Nội</p>
              <div className="w-12 h-1 bg-cyan-500 rounded-full mt-2" />
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Progress Dots */}
      <div className="absolute bottom-8 right-8 flex gap-3 z-50">
        {SCENES.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'w-2 bg-white/20'}`} />
        ))}
      </div>

    </div>
  );
}
