"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SCENES = [
  // Scene 0: System Intro
  { id: 'start', type: 'system-intro' },

  // Scene 1: Font Roulette (Chữ đổi font liên tục)
  { id: 'roulette', type: 'font-roulette', text: 'MARKETING.' },

  // Scene 2: Apple-style Kinetic Text Slam
  { id: 'hook2', type: 'kinetic-text', text: 'AUTOMATED.' },
  { id: 'hook3', type: 'kinetic-text', text: 'REIMAGINED.' },
  
  // Scene 3: Apple Shimmer Text (Vệt sáng lướt qua)
  { id: 'shimmer', type: 'shimmer-text', text: 'TAKE YOUR BRAND EVERYWHERE.' },

  // Scene 4: The Staggered "Mask Reveal" Phrase
  { id: 'phrase', type: 'staggered-text', words: ['BEYOND', 'HUMAN', 'LIMITS.'] },

  // Scene 5: The Logo (Chữ BrandFlow cách điệu)
  { id: 'logo', type: 'logo', text: 'BrandFlow' },

  // Scene 6: Video 1
  { 
    id: 'scene1', 
    type: 'video', 
    src: '/docs/01_workspace_phase3.webp',
    title: 'THE POWER OF AN AGENCY.', 
    subtitle: 'Nằm gọn trong một hệ thống.',
    animation: '3d-tilt-zoom'
  },
  
  // Scene 7: Video 2
  { 
    id: 'scene2', 
    type: 'video', 
    src: '/docs/02_workspace_phase5.webp',
    title: 'INFINITE CREATIVITY.', 
    subtitle: 'Zero độ trễ. Thiết kế Multi-modal.',
    animation: 'slide-scale-fast'
  },

  // Scene 8: Video 3
  { 
    id: 'scene3', 
    type: 'video', 
    src: '/docs/03_workspace_phase6.webp',
    title: 'AI INTELLIGENCE.', 
    subtitle: 'Dành riêng cho B2B.',
    animation: 'macro-zoom-pan'
  },

  // Scene 9: Video 4
  { 
    id: 'scene4', 
    type: 'video', 
    src: '/docs/04_planning_gantt.webp',
    title: 'TOTAL CONTROL.', 
    subtitle: 'Ngân sách dưới tầm kiểm soát tuyệt đối.',
    animation: 'epic-zoom-out'
  },
  
  { id: 'outro', type: 'outro', text: 'BrandFlow' },
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

  // Component Font Roulette
  const FontRouletteText = ({ text }: { text: string }) => {
    const fonts = [
      'font-sans', 'font-serif', 'font-mono', 
      'font-space', 'italic font-serif', 
      'font-black font-sans'
    ];
    const [fontIdx, setFontIdx] = useState(0);

    useEffect(() => {
      // Đổi font cực nhanh (50ms) trong 1.5 giây đầu, sau đó chốt lại font chuẩn
      let count = 0;
      const interval = setInterval(() => {
        if (count > 20) {
          clearInterval(interval);
          setFontIdx(3); // Chốt bằng font Space Grotesk
        } else {
          setFontIdx(Math.floor(Math.random() * fonts.length));
          count++;
        }
      }, 60);
      return () => clearInterval(interval);
    }, []);

    return (
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
        className={`text-8xl md:text-[180px] text-white tracking-tighter uppercase transition-all duration-75 ${fonts[fontIdx]}`}
      >
        {text}
      </motion.h1>
    );
  };

  // Hàm render chữ BrandFlow cách điệu (Signature Cursive)
  const renderBrandFlowCursive = (sizeClass: string, isGlowing = false) => (
    <span 
      className={`${sizeClass} text-[#E2E8F0] tracking-tight relative z-10 block leading-none`}
      style={{
        fontFamily: "'Dancing Script', 'Brush Script MT', 'Great Vibes', 'Playfair Display', cursive",
        textShadow: isGlowing ? "0 0 40px rgba(34, 211, 238, 0.8), 0 0 80px rgba(59, 130, 246, 0.6)" : "0 4px 20px rgba(255, 255, 255, 0.1)",
        paddingBottom: '20px' // Tránh bị cắt đuôi chữ
      }}
    >
      BrandFlow
    </span>
  );

  return (
    <div 
      className={`w-screen h-screen bg-[#020617] overflow-hidden flex items-center justify-center relative cursor-pointer ${inter.variable} ${spaceGrotesk.variable} font-sans`}
      onClick={() => setStep(s => Math.min(s + 1, SCENES.length - 1))}
      style={{ perspective: '2500px' }}
    >
      
      {/* Background Ambient Particles/Glow matching Visual DNA */}
      {currentScene.type !== 'system-intro' && (
        <div className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-1000">
          <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-cyan-600/30 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-blue-700/20 rounded-full blur-[150px] mix-blend-screen" />
        </div>
      )}

      <AnimatePresence mode="wait">
        
        {/* --- DẠNG 0: SYSTEM INTRO (Chữ cách điệu BrandFlow bg mờ ảo) --- */}
        {currentScene.type === 'system-intro' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 3, filter: 'blur(20px)', transition: { duration: 1.5, ease: "easeInOut" } }}
            className="absolute inset-0 flex items-center justify-center bg-[#070B14] z-50"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] right-[-20%] h-[60vh] bg-gradient-to-b from-[#1E293B]/60 via-[#0F172A]/40 to-transparent blur-[100px]" />
              <div className="absolute bottom-[-20%] left-[-20%] right-[-20%] h-[60vh] bg-gradient-to-t from-[#06b6d4]/40 via-[#0284c7]/30 to-transparent blur-[120px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-900/20 blur-[100px] rounded-full" />
            </div>

            <motion.div 
              initial={{ filter: 'blur(10px)', scale: 0.9, opacity: 0 }}
              animate={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              {renderBrandFlowCursive('text-7xl sm:text-9xl')}
            </motion.div>

            {step === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                className="absolute bottom-10 font-mono text-sm text-slate-500 animate-pulse uppercase tracking-widest"
              >
                Nhấn SPACE để tiếp tục
              </motion.div>
            )}
          </motion.div>
        )}

        {/* --- DẠNG 1.1: FONT ROULETTE --- */}
        {currentScene.type === 'font-roulette' && (
          <motion.div
            key={currentScene.id}
            className="absolute inset-0 flex items-center justify-center z-20"
          >
            <FontRouletteText text={currentScene.text || ''} />
          </motion.div>
        )}

        {/* --- DẠNG 1.2: SHIMMER TEXT (Vệt sáng lướt qua) --- */}
        {currentScene.type === 'shimmer-text' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex items-center justify-center z-20 px-10 text-center"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter uppercase font-space relative leading-tight">
              {/* Lớp nền xám tối */}
              <span className="text-slate-800 absolute inset-0">{currentScene.text}</span>
              {/* Lớp màu phát sáng chạy qua mặt nạ clip-text */}
              <span 
                className="relative text-transparent bg-clip-text animate-[shimmer_3s_infinite_linear]"
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(34,211,238,1) 30%, rgba(255,255,255,1) 50%, rgba(34,211,238,1) 70%, rgba(255,255,255,0) 100%)',
                  backgroundSize: '200% auto',
                }}
              >
                {currentScene.text}
              </span>
            </h1>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
            `}} />
          </motion.div>
        )}

        {/* --- DẠNG 1.3: KINETIC TEXT SLAM --- */}
        {currentScene.type === 'kinetic-text' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 3, filter: 'blur(30px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)', transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <h1 className="text-8xl md:text-[180px] font-black text-white tracking-tighter uppercase font-space text-center leading-none">
              {currentScene.text}
            </h1>
          </motion.div>
        )}

        {/* --- DẠNG 2: STAGGERED TEXT --- */}
        {currentScene.type === 'staggered-text' && currentScene.words && (
          <motion.div
            key={currentScene.id}
            exit={{ opacity: 0, y: -100, filter: 'blur(20px)', transition: { duration: 0.5 } }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex gap-4 sm:gap-8 flex-wrap justify-center overflow-hidden p-4">
              {currentScene.words.map((word, index) => (
                <motion.div key={index} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "120%", rotate: 10, opacity: 0 }}
                    animate={{ y: "0%", rotate: 0, opacity: 1 }}
                    exit={{ y: "-120%", opacity: 0, filter: 'blur(10px)' }}
                    transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-[120px] font-black text-white tracking-tighter uppercase font-space"
                  >
                    {word}
                  </motion.h1>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- DẠNG 3: LOGO GLOW (Sử dụng Cursive) --- */}
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
              initial={{ rotate: -90, opacity: 0, filter: 'blur(20px)' }}
              animate={{ rotate: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mb-6"
            >
              <div className="absolute inset-0 bg-cyan-400/40 blur-[80px] rounded-full scale-150 animate-[pulse_3s_infinite]" />
              <BrandFlowLogo className="w-32 h-32 drop-shadow-[0_0_40px_rgba(34,211,238,0.6)]" />
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            >
              {renderBrandFlowCursive('text-8xl md:text-[160px]', true)}
            </motion.div>
          </motion.div>
        )}

        {/* --- DẠNG 4: VIDEO SHOWCASE --- */}
        {currentScene.type === 'video' && (
          <motion.div
            key={currentScene.id}
            className="absolute inset-0 flex flex-col items-center justify-center w-full h-full z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.4 } }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute top-[8%] left-0 right-0 text-center z-30">
              <motion.div className="overflow-hidden inline-block">
                <motion.h2 
                  initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} 
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)] font-space uppercase"
                >
                  {currentScene.title}
                </motion.h2>
              </motion.div>
              
              <motion.div className="overflow-hidden mt-4">
                <motion.p 
                  initial={{ y: "-100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} 
                  transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-2xl md:text-3xl text-cyan-200/80 font-medium tracking-wide font-inter"
                >
                  {currentScene.subtitle}
                </motion.p>
              </motion.div>
            </div>

            <motion.div
              className="relative w-[90vw] max-w-[1500px] mt-24 aspect-[16/9] rounded-3xl overflow-hidden border border-white/20 shadow-[0_50px_150px_rgba(0,0,0,0.9),0_0_50px_rgba(34,211,238,0.2)]"
              initial={
                currentScene.animation === '3d-tilt-zoom' ? { rotateX: 45, rotateY: -30, rotateZ: 10, scale: 0.4, y: 300, opacity: 0, filter: 'blur(20px)' } :
                currentScene.animation === 'slide-scale-fast' ? { x: 800, scale: 0.5, rotateY: 40, opacity: 0, filter: 'blur(10px)' } :
                currentScene.animation === 'macro-zoom-pan' ? { scale: 2, x: '25%', y: '-15%', opacity: 0 } :
                { scale: 1.8, opacity: 0, filter: "blur(20px)" }
              }
              animate={
                currentScene.animation === '3d-tilt-zoom' ? { rotateX: 5, rotateY: -5, rotateZ: 0, scale: 0.95, y: 20, opacity: 1, filter: 'blur(0px)' } :
                currentScene.animation === 'slide-scale-fast' ? { x: 0, scale: 0.95, rotateY: 0, opacity: 1, filter: 'blur(0px)' } :
                currentScene.animation === 'macro-zoom-pan' ? { scale: 1.25, x: '-5%', y: '5%', opacity: 1 } :
                { scale: 0.95, opacity: 1, filter: "blur(0px)" }
              }
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div 
                className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-10 pointer-events-none mix-blend-overlay origin-left"
                initial={{ x: '-100%', skewX: -20 }}
                animate={{ x: '100%' }}
                transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 4 }}
              />
              
              <img src={currentScene.src} className="w-full h-full object-cover" alt="Demo Scene" />
            </motion.div>
          </motion.div>
        )}

        {/* --- DẠNG 5: OUTRO (Sử dụng Cursive) --- */}
        {currentScene.type === 'outro' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] z-50"
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="absolute w-[60vw] h-[60vw] bg-gradient-to-tr from-cyan-600/30 to-blue-700/30 rounded-full blur-[120px] mix-blend-screen"></div>
            
            <motion.div
              initial={{ rotate: 180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
              className="mb-8"
            >
              <BrandFlowLogo className="w-20 h-20 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {renderBrandFlowCursive('text-7xl md:text-[140px]', true)}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 flex flex-col items-center gap-2"
            >
              <p className="text-xl text-cyan-200 tracking-[0.3em] uppercase font-bold font-inter">Đại học Bách Khoa Hà Nội</p>
              <div className="w-12 h-1 bg-cyan-500 rounded-full mt-2" />
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      <div className="absolute bottom-8 right-8 flex gap-3 z-50">
        {SCENES.map((_, i) => (
          <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 'w-2 bg-white/10'}`} />
        ))}
      </div>

    </div>
  );
}
