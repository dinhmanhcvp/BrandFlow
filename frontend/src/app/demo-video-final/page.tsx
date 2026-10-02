"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SCENES = [
  // ======================
  // INTRO SEQUENCE
  // ======================
  // 1. Lên hình tĩnh mờ mờ, màn hình chờ
  { id: 'start', type: 'system-intro' },

  // 2. Chữ đổi font chớp nhoáng
  { id: 'hook1', type: 'font-roulette', text: 'MARKETING.' },

  // 3. Chữ dập khổng lồ
  { id: 'hook2', type: 'kinetic-text', text: 'AUTOMATED.' },
  
  // 4. Chữ chạy vệt sáng ngang
  { id: 'hook3', type: 'shimmer-text', text: 'REIMAGINED.' },

  // 5. Cú nổ lộ diện (Mask Reveal)
  { id: 'phrase', type: 'staggered-text', words: ['BEYOND', 'HUMAN', 'LIMITS.'] },

  // 6. Siêu sáng rực rỡ bừng lên (Đỉnh điểm Intro)
  { id: 'logo-reveal', type: 'epic-logo' },

  // ======================
  // BODY (Sẽ thiết kế sau theo ý User)
  // ======================
  { id: 'body-placeholder', type: 'placeholder', text: 'BODY SECTION (TO BE CONTINUED...)' },

  // ======================
  // OUTRO SEQUENCE
  // ======================
  { id: 'outro', type: 'outro' },
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

  // Component Font Roulette siêu gắt
  const FontRouletteText = ({ text }: { text: string }) => {
    const fonts = ['font-sans', 'font-serif', 'font-mono', 'font-space', 'italic font-serif'];
    const [fontIdx, setFontIdx] = useState(0);

    useEffect(() => {
      let count = 0;
      const interval = setInterval(() => {
        if (count > 15) {
          clearInterval(interval);
          setFontIdx(3);
        } else {
          setFontIdx(Math.floor(Math.random() * fonts.length));
          count++;
        }
      }, 50);
      return () => clearInterval(interval);
    }, []);

    return (
      <motion.h1 
        initial={{ scale: 0.9, opacity: 0, letterSpacing: '0.2em' }}
        animate={{ scale: 1, opacity: 1, letterSpacing: '-0.05em' }}
        exit={{ scale: 1.5, opacity: 0, filter: 'blur(15px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`text-[80px] sm:text-[150px] md:text-[200px] text-white uppercase transition-all duration-75 ${fonts[fontIdx]} drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]`}
      >
        {text}
      </motion.h1>
    );
  };

  // Hàm render chữ Cursive Signature đặc trưng của hệ thống
  const renderSignature = (sizeClass: string, isGlowing = false) => (
    <span 
      className={`${sizeClass} text-[#E2E8F0] tracking-tight relative z-10 block leading-none`}
      style={{
        fontFamily: "'Dancing Script', 'Brush Script MT', 'Great Vibes', 'Playfair Display', cursive",
        textShadow: isGlowing ? "0 0 60px rgba(34, 211, 238, 1), 0 0 100px rgba(59, 130, 246, 0.8)" : "0 4px 30px rgba(255, 255, 255, 0.15)",
        paddingBottom: '20px'
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
      
      {/* GLOBAL AMBIENT LAYER (Luôn chạy ngầm, thở nhịp nhàng) */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute top-[-10%] left-[10%] w-[50vw] h-[50vw] bg-cyan-600/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[60vw] h-[60vw] bg-blue-700/15 rounded-full blur-[150px]" />
      </motion.div>

      <AnimatePresence mode="wait">
        
        {/* =========================================
            SCENE 0: SYSTEM INTRO (Chữ mờ ảo, deep không gian)
            ========================================= */}
        {currentScene.type === 'system-intro' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 3, filter: 'blur(30px)', transition: { duration: 1.2, ease: "easeInOut" } }}
            className="absolute inset-0 flex items-center justify-center bg-[#070B14] z-50"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] right-[-20%] h-[60vh] bg-gradient-to-b from-[#1E293B]/60 via-[#0F172A]/40 to-transparent blur-[100px]" />
              <div className="absolute bottom-[-20%] left-[-20%] right-[-20%] h-[60vh] bg-gradient-to-t from-[#06b6d4]/40 via-[#0284c7]/30 to-transparent blur-[120px]" />
            </div>

            <motion.div 
              initial={{ filter: 'blur(15px)', scale: 0.95, opacity: 0 }}
              animate={{ filter: 'blur(0px)', scale: 1, opacity: 1 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            >
              {renderSignature('text-[90px] sm:text-[140px]')}
            </motion.div>

            {step === 0 && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                className="absolute bottom-10 font-mono text-sm text-slate-500 animate-pulse tracking-[0.3em]"
              >
                [ SPACE TO INITIATE ]
              </motion.div>
            )}
          </motion.div>
        )}

        {/* =========================================
            SCENE 1: FONT ROULETTE (Chớp nhoáng)
            ========================================= */}
        {currentScene.type === 'font-roulette' && (
          <motion.div key={currentScene.id} className="absolute inset-0 flex items-center justify-center z-20">
            <FontRouletteText text={currentScene.text || ''} />
          </motion.div>
        )}

        {/* =========================================
            SCENE 2: KINETIC TEXT (Dập ầm ầm vào màn hình)
            ========================================= */}
        {currentScene.type === 'kinetic-text' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 4, filter: 'blur(40px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.5, filter: 'blur(15px)', transition: { duration: 0.2 } }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <h1 className="text-[90px] sm:text-[160px] md:text-[220px] font-black text-white tracking-tighter uppercase font-space leading-none text-center drop-shadow-2xl">
              {currentScene.text}
            </h1>
          </motion.div>
        )}

        {/* =========================================
            SCENE 3: SHIMMER TEXT (Vệt sáng kim loại)
            ========================================= */}
        {currentScene.type === 'shimmer-text' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(15px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center z-20 text-center"
          >
            <h1 className="text-[70px] sm:text-[140px] md:text-[180px] font-black tracking-tighter uppercase font-space relative leading-none">
              <span className="text-slate-800 absolute inset-0">{currentScene.text}</span>
              <span 
                className="relative text-transparent bg-clip-text animate-[shimmer_2.5s_infinite_ease-in-out]"
                style={{
                  backgroundImage: 'linear-gradient(110deg, rgba(255,255,255,0) 0%, rgba(34,211,238,0.2) 30%, rgba(255,255,255,1) 50%, rgba(34,211,238,0.2) 70%, rgba(255,255,255,0) 100%)',
                  backgroundSize: '200% auto',
                }}
              >
                {currentScene.text}
              </span>
            </h1>
          </motion.div>
        )}

        {/* =========================================
            SCENE 4: MASK REVEAL STAGGERED
            ========================================= */}
        {currentScene.type === 'staggered-text' && currentScene.words && (
          <motion.div
            key={currentScene.id}
            exit={{ opacity: 0, filter: 'blur(20px)', scale: 0.9, transition: { duration: 0.5 } }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex gap-4 sm:gap-6 md:gap-10 flex-wrap justify-center overflow-hidden p-10">
              {currentScene.words.map((word, index) => (
                <motion.div key={index} className="overflow-hidden pb-4">
                  <motion.h1
                    initial={{ y: "150%", rotateZ: 5, opacity: 0 }}
                    animate={{ y: "0%", rotateZ: 0, opacity: 1 }}
                    transition={{ delay: index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[60px] sm:text-[100px] md:text-[140px] font-black text-white tracking-tighter uppercase font-space leading-none"
                  >
                    {word}
                  </motion.h1>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* =========================================
            SCENE 5: EPIC LOGO BỪNG SÁNG (Đỉnh cao Intro)
            ========================================= */}
        {currentScene.type === 'epic-logo' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2, filter: 'blur(40px)', transition: { duration: 1.5, ease: "easeIn" } }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center flex-col gap-6 z-10"
          >
            <motion.div 
              initial={{ rotate: -180, scale: 0, filter: 'blur(20px)' }}
              animate={{ rotate: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
              className="relative mb-6"
            >
              {/* Lõi năng lượng siêu sáng */}
              <div className="absolute inset-0 bg-cyan-400/50 blur-[100px] rounded-full scale-[2] animate-[pulse_2s_infinite]" />
              <div className="absolute inset-0 bg-blue-500/30 blur-[60px] rounded-full scale-[1.5] animate-[ping_3s_infinite]" />
              
              <BrandFlowLogo className="w-40 h-40 drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] relative z-20 text-white" />
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
            >
              {renderSignature('text-[100px] sm:text-[160px] md:text-[200px]', true)}
            </motion.div>
          </motion.div>
        )}

        {/* =========================================
            SCENE 6: BODY PLACEHOLDER (Chờ ý tưởng)
            ========================================= */}
        {currentScene.type === 'placeholder' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, filter: 'blur(20px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -100 }}
            className="absolute inset-0 flex flex-col items-center justify-center border-4 border-dashed border-cyan-500/30 rounded-3xl m-10 bg-cyan-950/20 backdrop-blur-sm"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="mb-8">
              <div className="w-24 h-24 border-t-4 border-cyan-400 border-solid rounded-full" />
            </motion.div>
            <h2 className="text-3xl font-space font-bold text-cyan-300 tracking-widest">{currentScene.text}</h2>
            <p className="text-slate-500 font-mono mt-4">Waiting for your brilliant UI/UX body concepts...</p>
          </motion.div>
        )}

        {/* =========================================
            SCENE 7: CINEMATIC OUTRO
            ========================================= */}
        {currentScene.type === 'outro' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, filter: 'blur(30px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50 overflow-hidden"
          >
            {/* Siêu hố đen / Nebula background ở Outro */}
            <motion.div 
              className="absolute w-[150vw] h-[150vw] bg-gradient-to-tr from-cyan-900/40 via-blue-900/20 to-black rounded-full blur-[100px] mix-blend-screen"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            
            <motion.div
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 2, type: "spring", bounce: 0.2 }}
              className="mb-8 relative z-10"
            >
              <BrandFlowLogo className="w-24 h-24 text-slate-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30, letterSpacing: '10px' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0px' }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
              className="relative z-10"
            >
              {renderSignature('text-7xl sm:text-[140px]')}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
              className="mt-12 flex flex-col items-center gap-3 relative z-10"
            >
              <div className="text-sm md:text-lg text-slate-400 tracking-[0.5em] uppercase font-medium font-inter flex items-center gap-4">
                <span className="w-10 h-[1px] bg-slate-700" />
                Đại học Bách Khoa Hà Nội
                <span className="w-10 h-[1px] bg-slate-700" />
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Progress Dots (Tinh tế hơn) */}
      <div className="absolute bottom-10 right-10 flex gap-2 z-50">
        {SCENES.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === step ? 'w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,1)]' : 'w-1.5 bg-white/20'}`} />
        ))}
      </div>

    </div>
  );
}
