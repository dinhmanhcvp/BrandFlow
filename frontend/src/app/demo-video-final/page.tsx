"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import { Space_Grotesk, Inter } from 'next/font/google';
import AmbientParticles from '@/components/AmbientParticles';
import NodeNetworkCanvas from '@/components/landing/NodeNetworkCanvas';
import CinematicContentDailyMock from './CinematicContentDailyMock';
import CinematicOnboardingMock from './CinematicOnboardingMock';
import CinematicFinanceGanttMock from './CinematicFinanceGanttMock';
import CinematicDebateMock from './CinematicDebateMock';
import CinematicDockMock from './CinematicDockMock';
import CinematicDesignStudioMock from './CinematicDesignStudioMock';
import { 
 FileText, ShieldCheck, UploadCloud, BrainCircuit, LineChart, 
 CheckCircle2, Wand2, BarChart3, Clock, LayoutDashboard, 
 Target, PenTool, Calendar, Settings, Bell, Search, Heart, MessageCircle, Share2,
 Link as LinkIcon, Lock, Server, Eye, X, AlertCircle, Bot, TrendingDown, AlertTriangle, Scissors, Activity, ArrowLeft, Cpu, XCircle
} from 'lucide-react';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SCENES = [
 // INTRO
 { id: 'start', type: 'system-intro' },
 { id: 'hook1', type: 'bespoke-hook1' },
 { id: 'hook3', type: 'bespoke-hook3' },
 { id: 'hook4', type: 'bespoke-hook4' },
 { id: 'logo-reveal', type: 'epic-logo' },
 { id: 'feature-dock', type: 'feature-dock' },

 // BODY
 { id: 'body-onboarding', type: 'body-onboarding', subtitle: "1. UPLOAD DỮ LIỆU DOANH NGHIỆP." },
 { id: 'body-design-studio', type: 'body-design-studio', subtitle: "2. TỰ ĐỘNG THIẾT KẾ ĐA ĐIỂM CHẠM." },
 { id: 'body-debate', type: 'body-debate', subtitle: "3. TRANH BIỆN BẢO VỆ NGÂN SÁCH." },
 { id: 'body-content-daily', type: 'body-content-daily', subtitle: "4. AUTO-GEN CONTENT ĐA NỀN TẢNG." },
 { id: 'body-finance', type: 'body-finance', subtitle: "5. KIỂM SOÁT NGÂN SÁCH CHẶT CHẼ." },

 // OUTRO
 { id: 'outro', type: 'outro' },
];



const StaggeredText = ({ text, className = "" }: { text: string, className?: string }) => {
 const words = text.split(' ');
 return (
  <motion.div
   initial="hidden"
   animate="visible"
   variants={{
    visible: { transition: { staggerChildren: 0.15 } }
   }}
   className={`flex flex-wrap justify-center gap-x-[0.3em] ${className}`}
  >
   {words.map((word, i) => (
    <motion.span
     key={i}
     variants={{
      hidden: { opacity: 0, y: 40, filter: 'blur(10px)', scale: 0.9 },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, transition: { type: 'spring', damping: 15, stiffness: 200 } }
     }}
     className="inline-block"
    >
     {word}
    </motion.span>
   ))}
  </motion.div>
 );
};

const BespokeHook1 = () => {
 const [phase, setPhase] = useState(0);

 useEffect(() => {
  const t1 = setTimeout(() => setPhase(1), 1500); 
  const t2 = setTimeout(() => setPhase(2), 3000); 
  return () => [t1, t2].forEach(clearTimeout);
 }, []);

 return (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)' }} className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-50 overflow-hidden font-space">
   <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-white mix-blend-overlay z-40 pointer-events-none" />

   {/* 60% NGÂN SÁCH */}
   <AnimatePresence>
    {phase < 2 && (
     <motion.div 
      initial={{ y: 50, opacity: 0, scale: 0.9 }} 
      animate={{ 
       y: phase === 1 ? -60 : 0, 
       opacity: 1, 
       scale: phase === 1 ? 0.8 : 1,
       filter: 'blur(0px)' 
      }} 
      exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.2, transition: { duration: 0.5 } }}
      transition={{ type: 'spring' }}
      className="text-[70px] md:text-[130px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-300 to-slate-500 tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] absolute"
     >
      <StaggeredText text="60% NGÂN SÁCH" />
     </motion.div>
    )}
   </AnimatePresence>

   <AnimatePresence>
    {phase >= 1 && (
      <motion.h1
       initial={{ scale: 1.5, opacity: 0, y: 60 }}
       animate={phase === 1 ? { scale: 1, opacity: 1, y: 60, filter: 'blur(0px)' } : { scale: 1.1, opacity: 0, y: -50, filter: 'blur(30px)' }}
       transition={phase === 1 ? { duration: 0.5, type: 'spring' } : { duration: 1.5, ease: 'easeOut' }}
       className="text-[80px] md:text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-red-700 drop-shadow-[0_0_50px_rgba(239,68,68,1)] tracking-tighter uppercase absolute z-20"
      >
       BỊ LÃNG PHÍ
      </motion.h1>
    )}
   </AnimatePresence>
   
   {/* Ash Particles / Burning Effect */}
   <AnimatePresence>
    {phase === 2 && (
      <motion.div 
       initial={{ opacity: 0, y: 60, scale: 1 }} 
       animate={{ opacity: [0, 1, 0], y: -200, scale: 1.5, filter: 'blur(10px)' }} 
       transition={{ duration: 1.5, ease: "easeOut" }}
       className="absolute w-full h-[400px] bg-[url('/img/noise.png')] opacity-80 mix-blend-color-dodge flex justify-center z-30 pointer-events-none"
      >
       <div className="w-[800px] h-full bg-gradient-to-t from-red-600 via-orange-500 to-transparent blur-2xl opacity-80 animate-pulse" style={{ clipPath: 'polygon(0 100%, 100% 100%, 80% 0, 20% 0)' }} />
      </motion.div>
    )}
   </AnimatePresence>
  </motion.div>
 );
};

const BespokeHook3 = () => {
 const [phase, setPhase] = useState(0);
 const [counter, setCounter] = useState(0);

 useEffect(() => {
  const t1 = setTimeout(() => setPhase(1), 1200); 
  const t2 = setTimeout(() => setPhase(2), 2700); 
  const t3 = setTimeout(() => setPhase(3), 4000); 
  const t4 = setTimeout(() => setPhase(4), 6000); 
  return () => [t1, t2, t3, t4].forEach(clearTimeout);
 }, []);

 useEffect(() => {
  if (phase === 1) {
   let startTime = Date.now();
   const duration = 1500;
   const animateCount = () => {
    let now = Date.now();
    let p = Math.min((now - startTime) / duration, 1);
    let val = Math.floor(Math.pow(p, 4) * 100000000);
    setCounter(val);
    if (p < 1) requestAnimationFrame(animateCount);
   };
   requestAnimationFrame(animateCount);
  }
 }, [phase]);

 return (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)' }} className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-50 overflow-hidden font-space">
   <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-white mix-blend-overlay z-40 pointer-events-none" />
   
   <motion.div 
    initial={{ y: 50, opacity: 0 }} animate={{ y: phase >= 1 ? -100 : 0, opacity: 1, scale: phase >= 1 ? 0.7 : 1 }} transition={{ type: 'spring' }}
    className="text-[60px] md:text-[100px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-300 to-slate-500 tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] absolute"
   >
    <StaggeredText text="THUÊ AGENCY?" />
   </motion.div>

   <AnimatePresence>
    {phase === 1 && (
     <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 2, filter: 'blur(10px)' }} className="absolute text-center mt-20">
      <h2 className="text-3xl text-slate-400 font-bold mb-2">CHI PHÍ ƯỚC TÍNH</h2>
      <div className={`text-[80px] font-black tabular-nums tracking-tighter ${counter > 50000000 ? 'text-red-500 animate-pulse drop-shadow-[0_0_40px_rgba(239,68,68,0.8)]' : counter > 10000000 ? 'text-amber-400 drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]' : 'text-white'}`}>
       {new Intl.NumberFormat('vi-VN').format(counter)} VNĐ
      </div>
     </motion.div>
    )}
   </AnimatePresence>

   <AnimatePresence>
    {phase >= 2 && (
     <motion.div initial={{ scale: 3, opacity: 0, rotate: -10 }} animate={{ scale: 1, opacity: 1, rotate: -5 }} className="absolute z-30 flex gap-10 mt-10">
      <h1 className="text-[120px] font-black text-red-600 drop-shadow-[0_0_50px_rgba(239,68,68,1)] uppercase tracking-tighter mix-blend-screen" style={{ WebkitTextStroke: '2px white' }}>
       QUÁ ĐẮT
      </h1>
     </motion.div>
    )}
   </AnimatePresence>

   <AnimatePresence>
    {phase === 3 && (
     <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 3, filter: 'blur(20px)' }} className="absolute z-20 mt-64">
      <div className="w-32 h-32 border-8 border-slate-800 border-t-amber-500 rounded-full animate-spin flex items-center justify-center">
       <div className="w-16 h-16 border-8 border-slate-700 border-b-red-500 rounded-full animate-spin-reverse" />
      </div>
      <p className="text-center text-amber-500 font-bold mt-4 animate-pulse">PROCESSING...</p>
     </motion.div>
    )}
   </AnimatePresence>

   <AnimatePresence>
    {phase >= 4 && (
     <motion.div initial={{ scale: 0, opacity: 0, y: 100 }} animate={{ scale: [1.2, 1], opacity: 1, y: 150 }} className="absolute z-30">
      <h1 className="text-[100px] font-black text-amber-400 drop-shadow-[0_0_50px_rgba(251,191,36,1)] uppercase tracking-tighter glitch" data-text="QUÁ LÂU">
       QUÁ LÂU
      </h1>
      <style dangerouslySetInnerHTML={{__html: `
       .glitch { position: relative; }
       .glitch::before, .glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent; }
       .glitch::before { left: 5px; text-shadow: -4px 0 red; clip: rect(44px, 1500px, 56px, 0); animation: glitch-anim 0.3s infinite linear alternate-reverse; }
       .glitch::after { left: -5px; text-shadow: -4px 0 blue; clip: rect(44px, 1500px, 56px, 0); animation: glitch-anim2 0.4s infinite linear alternate-reverse; }
      `}} />
     </motion.div>
    )}
   </AnimatePresence>
  </motion.div>
 );
};

const BespokeHook4 = () => {
 const [phase, setPhase] = useState(0);
 
 useEffect(() => {
  const t1 = setTimeout(() => setPhase(1), 1200);
  const t2 = setTimeout(() => setPhase(2), 2500);
  const t3 = setTimeout(() => setPhase(3), 4000);
  return () => [t1, t2, t3].forEach(clearTimeout);
 }, []);

 // Generate some random garbage text for phase 2
 const [garbage, setGarbage] = useState('THIẾU THỰC TẾ');
 useEffect(() => {
  if (phase === 2) {
   const chars = '!<>-_\\\\/[]{}—=+*^?#_010101';
   const interval = setInterval(() => {
    setGarbage(Array(13).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join(''));
   }, 50);
   return () => clearInterval(interval);
  }
 }, [phase]);

 return (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)' }} className="absolute inset-0 flex flex-col items-center justify-center bg-transparent z-50 overflow-hidden font-space">
   <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-white mix-blend-overlay z-40 pointer-events-none" />

   <motion.div 
    initial={{ y: 50, opacity: 0 }} animate={{ y: phase >= 1 ? -80 : 0, opacity: 1, scale: phase >= 1 ? 0.7 : 1 }} transition={{ type: 'spring' }}
    className="text-[60px] md:text-[100px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-300 to-slate-500 tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] absolute"
   >
    <StaggeredText text="DÙNG CHATGPT?" />
   </motion.div>

   <AnimatePresence>
    {phase === 1 && (
     <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 50 }} exit={{ opacity: 0, filter: 'blur(10px)' }} className="absolute">
      <h1 className="text-[80px] md:text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_40px_rgba(34,211,238,0.8)] tracking-tighter uppercase">
       THIẾU THỰC TẾ
      </h1>
     </motion.div>
    )}
   </AnimatePresence>

   <AnimatePresence>
    {phase === 2 && (
     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-12">
      <h1 className="text-[80px] md:text-[120px] font-black text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] tracking-tighter uppercase whitespace-nowrap mix-blend-screen glitch" data-text={garbage}>
       {garbage}
      </h1>
     </motion.div>
    )}
   </AnimatePresence>

   <AnimatePresence>
    {phase === 3 && (
     <motion.div 
      initial={{ opacity: 1, y: 50, filter: 'blur(0px)' }} 
      animate={{ opacity: 0, y: 300, filter: 'blur(40px)', scale: 1.5 }} 
      transition={{ duration: 2, ease: "easeIn" }}
      className="absolute"
     >
      <h1 className="text-[80px] md:text-[120px] font-black text-slate-600 tracking-tighter uppercase">
       THIẾU THỰC TẾ
      </h1>
      {/* Sand particles falling simulation */}
      <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-50 mix-blend-overlay animate-pulse" />
     </motion.div>
    )}
   </AnimatePresence>

  </motion.div>
 );
};

const DemoBackground = () => (
 <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#0B1120]">
  <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-500/15 rounded-full blur-[150px] pointer-events-none" />
  <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none" />
  <NodeNetworkCanvas />
  <AmbientParticles />
 </div>
);

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

 // Auto-advance logic for Intro Scenes
 useEffect(() => {
  let t: NodeJS.Timeout;
  if (currentScene.type === 'system-intro') {
   t = setTimeout(() => setStep(s => s + 1), 3500); 
  } else if (currentScene.type === 'bespoke-hook1') {
   t = setTimeout(() => setStep(s => s + 1), 4500); 
  } else if (currentScene.type === 'bespoke-hook3') {
   t = setTimeout(() => setStep(s => s + 1), 7500); 
  } else if (currentScene.type === 'bespoke-hook4') {
   t = setTimeout(() => setStep(s => s + 1), 5500);
  } else if (currentScene.type === 'epic-logo') {
   t = setTimeout(() => setStep(s => s + 1), 4500); 
  }
  // feature-dock auto advances itself internally
  return () => clearTimeout(t);
 }, [step, currentScene.type]);

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

 const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
 };

 const MockAppShell = ({ activeMenu, children }: { activeMenu: string, children: React.ReactNode }) => (
  <div className="absolute inset-0 flex bg-transparent text-slate-300 font-inter text-sm z-10">
   <div className="w-64 bg-[#0B1120]/50 backdrop-blur-md border-r border-slate-800 flex flex-col z-20">
    <div className="p-6 flex items-center gap-3">
     <BrandFlowLogo className="w-8 h-8 text-cyan-400" />
     <span className="font-space font-bold text-lg text-white">BrandFlow</span>
    </div>
    <div className="flex-1 px-4 space-y-2">
     {[
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'onboarding', icon: UploadCloud, label: 'Data Ingestion' },
      { id: 'strategy', icon: Target, label: 'AI Strategy' },
      { id: 'content', icon: PenTool, label: 'Content Lab' },
      { id: 'planning', icon: Calendar, label: 'Gantt & Finance' }
     ].map(menu => (
      <div key={menu.id} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${activeMenu === menu.id ? 'bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20' : 'text-slate-400'}`}>
       <menu.icon className="w-5 h-5" />
       {menu.label}
      </div>
     ))}
    </div>
    <div className="p-4 border-t border-slate-800">
     <div className="flex items-center gap-3 p-2">
      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white">AD</div>
      <div className="text-xs">
       <p className="font-bold text-white">Admin</p>
       <p className="text-slate-500">Bếp Nhà Mộc</p>
      </div>
     </div>
    </div>
   </div>
   
   <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
    {/* Workspace Flow Background Elements */}
    <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.05] z-0 pointer-events-none" />
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

    <div className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#0B1120]/50 backdrop-blur-md z-20">
     <div className="flex items-center gap-4 text-slate-400">
      <Search className="w-4 h-4" />
      <span>Search anything... (Press 'Cmd + K')</span>
     </div>
     <div className="flex items-center gap-4">
      <Bell className="w-5 h-5 text-slate-400" />
      <Settings className="w-5 h-5 text-slate-400" />
      <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-2">
       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Sync
      </div>
     </div>
    </div>
    
    <div className="flex-1 overflow-y-auto relative z-10">
     {children}
    </div>
   </div>
  </div>
 );

 return (
  <div 
   className={`w-screen h-screen bg-[#0B1120] overflow-hidden flex items-center justify-center relative cursor-pointer ${inter.variable} ${spaceGrotesk.variable} font-sans`}
   onClick={() => setStep(s => Math.min(s + 1, SCENES.length - 1))}
   style={{ perspective: '2500px' }}
  >
   <DemoBackground />

   <AnimatePresence mode="wait">
    
    {/* INTRO */}
    {currentScene.type === 'system-intro' && (
     <motion.div key={currentScene.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 3, filter: 'blur(30px)' }} className="absolute inset-0 flex items-center justify-center bg-transparent z-50">
      <AmbientParticles />
      <motion.div initial={{ filter: 'blur(15px)', scale: 0.95, opacity: 0 }} animate={{ filter: 'blur(0px)', scale: 1, opacity: 1 }} transition={{ duration: 2.5 }}>
       {renderSignature('text-[90px] sm:text-[140px]')}
      </motion.div>
     </motion.div>
    )}

    {currentScene.type === 'bespoke-hook1' && <BespokeHook1 key={currentScene.id} />}

    {currentScene.type === 'bespoke-hook3' && <BespokeHook3 key={currentScene.id} />}
    {currentScene.type === 'bespoke-hook4' && <BespokeHook4 key={currentScene.id} />}

    {currentScene.type === 'epic-logo' && (
     <motion.div key={currentScene.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 2, filter: 'blur(40px)', transition: { duration: 1.5, ease: "easeIn" } }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0 flex items-center justify-center flex-col gap-6 z-50 bg-transparent overflow-hidden">
      <motion.div initial={{ rotate: -180, scale: 0, filter: 'blur(20px)' }} animate={{ rotate: 0, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1.2, type: "spring", bounce: 0.4 }} className="relative mb-6 z-20">
       <div className="absolute inset-0 bg-cyan-400/50 blur-[100px] rounded-full scale-[2] animate-[pulse_2s_infinite]" />
       <BrandFlowLogo className="w-40 h-40 drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] relative z-20 text-white" />
      </motion.div>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 1.2 }} className="z-20 flex flex-col items-center">
       {renderSignature('text-[100px] sm:text-[200px]', true)}
       <motion.h2 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 1.2, duration: 1 }}
        className="text-cyan-400 font-space tracking-[0.3em] uppercase text-sm sm:text-xl font-bold mt-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
       >
        Hệ Sinh Thái AI Quản Trị Marketing & Tài Chính Toàn Diện
       </motion.h2>
      </motion.div>
      
      {/* Sweep light effect */}
      <motion.div 
       initial={{ x: '-100%', opacity: 0 }}
       animate={{ x: '100%', opacity: [0, 0.5, 0] }}
       transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
       className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent skew-x-12 z-30 pointer-events-none"
      />
     </motion.div>
    )}

    {currentScene.type === 'feature-dock' && (
     <motion.div key={currentScene.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(20px)' }} className="absolute inset-0 flex items-center justify-center bg-transparent z-50">
      <CinematicDockMock onNext={() => setStep(s => Math.min(s + 1, SCENES.length - 1))} />
     </motion.div>
    )}

    {/* =========================================
      BODY: ONBOARDING - FULL SCREEN, NO SIDEBAR
      ========================================= */}
    {currentScene.type === 'body-onboarding' && (
     <motion.div 
      key={currentScene.id} 
      className="absolute inset-0 z-20"
      initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, y: -100, filter: 'blur(15px)' }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
     >
      <CinematicOnboardingMock onNext={() => {
       setStep(prev => Math.min(prev + 1, SCENES.length - 1));
      }} />
     </motion.div>
    )}

    {/* =========================================
      BODY: AI DEBATE 
      ========================================= */}
    {currentScene.type === 'body-debate' && (
     <motion.div 
      key={currentScene.id} 
      className="absolute inset-0 z-20"
      initial={{ opacity: 0, x: '100%', skewX: -10 }} 
      animate={{ opacity: 1, x: 0, skewX: 0 }} 
      exit={{ opacity: 0, x: '-100%', skewX: 10 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
     >
      <CinematicDebateMock onNext={() => {
       setStep(prev => Math.min(prev + 1, SCENES.length - 1));
      }} />
     </motion.div>
    )}

    {/* =========================================
      BODY: CONTENT DAILY
      ========================================= */}
    {currentScene.type === 'body-content-daily' && (
     <motion.div 
      key={currentScene.id} 
      className="absolute inset-0 z-20"
      initial={{ opacity: 0, y: '100%' }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, ease: "easeOut" }}
     >
      <CinematicContentDailyMock onNext={() => {
       setStep(prev => Math.min(prev + 1, SCENES.length - 1));
      }} />
     </motion.div>
    )}

    {/* =========================================
      BODY: DESIGN STUDIO
      ========================================= */}
    {currentScene.type === 'body-design-studio' && (
     <motion.div 
      key={currentScene.id} 
      className="absolute inset-0 z-20"
      initial={{ opacity: 0, scale: 0.5, rotateY: 90 }} 
      animate={{ opacity: 1, scale: 1, rotateY: 0 }} 
      exit={{ opacity: 0, filter: 'blur(30px)' }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
     >
      <CinematicDesignStudioMock onNext={() => {
       setStep(prev => Math.min(prev + 1, SCENES.length - 1));
      }} />
     </motion.div>
    )}

    {/* =========================================
      BODY: FINANCE
      ========================================= */}
    {currentScene.type === 'body-finance' && (
     <motion.div 
      key={currentScene.id} 
      className="absolute inset-0 z-20"
      initial={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }} 
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
      exit={{ opacity: 0, rotate: 5, scale: 0.5, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
     >
      <CinematicFinanceGanttMock onNext={() => {
       setStep(prev => Math.min(prev + 1, SCENES.length - 1));
      }} />
     </motion.div>
    )}

    {/* OUTRO */}
    {currentScene.type === 'outro' && (
     <motion.div key={currentScene.id} initial={{ opacity: 0, filter: 'blur(30px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 2, ease: "easeInOut" }} className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50 overflow-hidden">
      <motion.div className="absolute w-[150vw] h-[150vw] bg-gradient-to-tr from-cyan-900/40 via-blue-900/20 to-black rounded-full blur-[100px] mix-blend-screen" animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
      <motion.div initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 2, type: "spring", bounce: 0.2 }} className="mb-8 relative z-10">
       <BrandFlowLogo className="w-24 h-24 text-slate-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 30, letterSpacing: '10px' }} animate={{ opacity: 1, y: 0, letterSpacing: '0px' }} transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }} className="relative z-10">
       {renderSignature('text-7xl sm:text-[140px]')}
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }} className="mt-12 flex flex-col items-center gap-3 relative z-10">
       <div className="text-sm md:text-lg text-slate-400 tracking-[0.5em] uppercase font-medium font-inter flex items-center gap-4">
        <span className="w-10 h-[1px] bg-slate-700" /> Đại học Bách Khoa Hà Nội <span className="w-10 h-[1px] bg-slate-700" />
       </div>
      </motion.div>
     </motion.div>
    )}

   </AnimatePresence>

   <div className="absolute bottom-10 right-10 flex gap-2 z-50">
    {SCENES.map((_, i) => (
     <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${i === step ? 'w-10 bg-white shadow-[0_0_10px_rgba(255,255,255,1)]' : 'w-1.5 bg-white/20'}`} />
    ))}
   </div>

  </div>
 );
}
