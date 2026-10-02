"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import { Space_Grotesk, Inter } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SCENES = [
  // ======================
  // INTRO SEQUENCE (VIETNAMESE SCRIPT)
  // ======================
  // 1. Màn hình chờ (Logo cách điệu)
  { id: 'start', type: 'system-intro' },

  // Shot 1 (0:00 - 0:03)
  { id: 'hook1', type: 'kinetic-text', text: '60% NGÂN SÁCH...' },
  { id: 'hook2', type: 'glitch-text', text: '...BỊ LÃNG PHÍ.' },

  // Shot 2 (0:03 - 0:07)
  { id: 'hook3', type: 'snappy-cut', text: 'THUÊ AGENCY? QUÁ ĐẮT.' },
  { id: 'hook4', type: 'snappy-cut', text: 'DÙNG CHATGPT? THIẾU THỰC TẾ.' },

  // Chốt Intro bằng Logo bừng sáng
  { id: 'logo-reveal', type: 'epic-logo' },

  // ======================
  // BODY
  // ======================
  { id: 'body-placeholder', type: 'placeholder', text: 'PHẦN THÂN (SẼ CẬP NHẬT SAU...)' },

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
      
      {/* GLOBAL AMBIENT LAYER */}
      {/* Tắt nền glow khi ở các Scene đầu để đảm bảo Visual Pitch Black (Nền đen tuyền) */}
      {(step > 4) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4, scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none mix-blend-screen"
        >
          <div className="absolute top-[-10%] left-[10%] w-[50vw] h-[50vw] bg-cyan-600/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[60vw] h-[60vw] bg-blue-700/15 rounded-full blur-[150px]" />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        
        {/* =========================================
            SCENE 0: SYSTEM INTRO
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
            SHOT 1A: KINETIC TEXT (60% NGÂN SÁCH...)
            ========================================= */}
        {currentScene.type === 'kinetic-text' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 5, filter: 'blur(50px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.5, filter: 'blur(20px)', transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }} // Fast ease-in
            className="absolute inset-0 flex items-center justify-center bg-black"
          >
            <h1 className="text-[70px] sm:text-[130px] md:text-[160px] font-black text-white tracking-tighter uppercase font-space leading-none text-center drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
              {currentScene.text}
            </h1>
          </motion.div>
        )}

        {/* =========================================
            SHOT 1B: GLITCH TEXT (...BỊ LÃNG PHÍ.)
            ========================================= */}
        {currentScene.type === 'glitch-text' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 0.2 } }}
            className="absolute inset-0 flex items-center justify-center bg-black z-20"
          >
            <h1 
              className="text-[80px] sm:text-[150px] md:text-[200px] font-black tracking-tighter uppercase font-space leading-none text-center text-red-500 glitch"
              data-text={currentScene.text}
            >
              {currentScene.text}
            </h1>

            {/* CSS Glitch Animation */}
            <style dangerouslySetInnerHTML={{__html: `
              .glitch {
                position: relative;
                color: white;
              }
              .glitch::before, .glitch::after {
                content: attr(data-text);
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: black;
              }
              .glitch::before {
                left: 6px;
                text-shadow: -4px 0 red;
                clip: rect(44px, 450px, 56px, 0);
                animation: glitch-anim 2s infinite linear alternate-reverse;
              }
              .glitch::after {
                left: -6px;
                text-shadow: -4px 0 cyan;
                clip: rect(44px, 450px, 56px, 0);
                animation: glitch-anim2 1.5s infinite linear alternate-reverse;
              }
              @keyframes glitch-anim {
                0% { clip: rect(10px, 9999px, 83px, 0); transform: skew(0.6deg); }
                5% { clip: rect(61px, 9999px, 12px, 0); transform: skew(0.3deg); }
                10% { clip: rect(11px, 9999px, 5px, 0); transform: skew(0.1deg); }
                15% { clip: rect(111px, 9999px, 50px, 0); transform: skew(0.8deg); }
                20% { clip: rect(21px, 9999px, 80px, 0); transform: skew(0.5deg); }
                25% { clip: rect(10px, 9999px, 83px, 0); transform: skew(0.1deg); }
                30% { clip: rect(40px, 9999px, 100px, 0); transform: skew(0.7deg); }
                100% { clip: rect(20px, 9999px, 90px, 0); transform: skew(0deg); }
              }
              @keyframes glitch-anim2 {
                0% { clip: rect(65px, 9999px, 100px, 0); transform: skew(0.2deg); }
                10% { clip: rect(10px, 9999px, 20px, 0); transform: skew(0.8deg); }
                20% { clip: rect(45px, 9999px, 80px, 0); transform: skew(0.3deg); }
                30% { clip: rect(15px, 9999px, 50px, 0); transform: skew(0.6deg); }
                100% { clip: rect(80px, 9999px, 30px, 0); transform: skew(0deg); }
              }
            `}} />
          </motion.div>
        )}

        {/* =========================================
            SHOT 2: SNAPPY CUTS
            ========================================= */}
        {currentScene.type === 'snappy-cut' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 1, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.05 } }} // Siêu tốc (0.05s) tắt lịm đi
            transition={{ duration: 0.1, ease: "easeOut" }} // Siêu tốc hiện ra
            className="absolute inset-0 flex items-center justify-center bg-black"
          >
            <h1 className="text-[50px] sm:text-[90px] md:text-[120px] font-black text-white tracking-tighter uppercase font-space leading-none text-center">
              {currentScene.text}
            </h1>
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
            className="absolute inset-0 flex items-center justify-center flex-col gap-6 z-10 bg-[#020617]"
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
            <p className="text-slate-500 font-mono mt-4">Đợi bạn ra lệnh kịch bản cho phần thân...</p>
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

      {/* Progress Dots */}
      <div className="absolute bottom-10 right-10 flex gap-2 z-50">
        {SCENES.map((_, i) => (
          <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === step ? 'w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,1)]' : 'w-1.5 bg-white/20'}`} />
        ))}
      </div>

    </div>
  );
}
