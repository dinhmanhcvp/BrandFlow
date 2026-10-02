"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import { Space_Grotesk, Inter } from 'next/font/google';
import { FileText, ShieldCheck, UploadCloud, BrainCircuit, LineChart, MessageSquare, Palette, Wand2, BarChart3, Clock } from 'lucide-react';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SCENES = [
  // ======================
  // INTRO SEQUENCE
  // ======================
  { id: 'start', type: 'system-intro' },
  { id: 'hook1', type: 'kinetic-text', text: '60% NGÂN SÁCH...' },
  { id: 'hook2', type: 'glitch-text', text: '...BỊ LÃNG PHÍ.' },
  { id: 'hook3', type: 'snappy-cut', text: 'THUÊ AGENCY? QUÁ ĐẮT.' },
  { id: 'hook4', type: 'snappy-cut', text: 'DÙNG CHATGPT? THIẾU THỰC TẾ.' },
  { id: 'logo-reveal', type: 'epic-logo' },

  // ======================
  // BODY SEQUENCE
  // ======================
  
  // 1. Onboarding: Ingest File -> Upload
  { 
    id: 'body-onboarding', 
    type: 'body-onboarding',
    subtitle: "1. ĐƯA DỮ LIỆU CỦA BẠN VÀO HỆ THỐNG."
  },

  // 2. Multi-Agent Debate (Phase 3)
  {
    id: 'body-debate',
    type: 'body-debate',
    subtitle: "2. HỘI ĐỒNG AI TRANH BIỆN BẢO VỆ NGÂN SÁCH."
  },

  // 3. Creative Studio (Phase 5)
  {
    id: 'body-creative',
    type: 'body-creative',
    subtitle: "3. TỰ ĐỘNG SẢN XUẤT TÀI NGUYÊN THIẾT KẾ."
  },

  // 4. Financial / Gantt (Phase 6)
  {
    id: 'body-finance',
    type: 'body-finance',
    subtitle: "4. THEO DÕI P&L VÀ TIẾN ĐỘ THỜI GIAN THỰC."
  },

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

  // Helper cho chữ Cursive
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
      {(step > 4) && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4, scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none mix-blend-screen z-0"
        >
          <div className="absolute top-[-10%] left-[10%] w-[50vw] h-[50vw] bg-cyan-600/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[60vw] h-[60vw] bg-blue-700/15 rounded-full blur-[150px]" />
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        
        {/* =========================================
            INTRO SCENES (Giữ nguyên như cũ)
            ========================================= */}
        {currentScene.type === 'system-intro' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 3, filter: 'blur(30px)', transition: { duration: 1.2 } }}
            className="absolute inset-0 flex items-center justify-center bg-[#070B14] z-50"
          >
            <motion.div initial={{ filter: 'blur(15px)', scale: 0.95, opacity: 0 }} animate={{ filter: 'blur(0px)', scale: 1, opacity: 1 }} transition={{ duration: 2.5 }}>
              {renderSignature('text-[90px] sm:text-[140px]')}
            </motion.div>
          </motion.div>
        )}

        {currentScene.type === 'kinetic-text' && (
          <motion.div key={currentScene.id} initial={{ opacity: 0, scale: 5, filter: 'blur(50px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }} transition={{ duration: 0.4, type: "spring", bounce: 0.2 }} className="absolute inset-0 flex items-center justify-center bg-black z-50">
            <h1 className="text-[70px] sm:text-[130px] md:text-[160px] font-black text-white tracking-tighter uppercase font-space text-center drop-shadow-2xl">{currentScene.text}</h1>
          </motion.div>
        )}

        {currentScene.type === 'glitch-text' && (
          <motion.div key={currentScene.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: 'blur(10px)' }} className="absolute inset-0 flex items-center justify-center bg-black z-50">
            <h1 className="text-[80px] sm:text-[150px] md:text-[200px] font-black uppercase font-space text-center text-red-500 glitch" data-text={currentScene.text}>{currentScene.text}</h1>
            <style dangerouslySetInnerHTML={{__html: `
              .glitch { position: relative; color: white; }
              .glitch::before, .glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: black; }
              .glitch::before { left: 6px; text-shadow: -4px 0 red; clip: rect(44px, 450px, 56px, 0); animation: glitch-anim 2s infinite linear alternate-reverse; }
              .glitch::after { left: -6px; text-shadow: -4px 0 cyan; clip: rect(44px, 450px, 56px, 0); animation: glitch-anim2 1.5s infinite linear alternate-reverse; }
              @keyframes glitch-anim { 0% { clip: rect(10px, 9999px, 83px, 0); } 100% { clip: rect(20px, 9999px, 90px, 0); } }
              @keyframes glitch-anim2 { 0% { clip: rect(65px, 9999px, 100px, 0); } 100% { clip: rect(80px, 9999px, 30px, 0); } }
            `}} />
          </motion.div>
        )}

        {currentScene.type === 'snappy-cut' && (
          <motion.div key={currentScene.id} initial={{ opacity: 1, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.05 } }} transition={{ duration: 0.1 }} className="absolute inset-0 flex items-center justify-center bg-black z-50">
            <h1 className="text-[50px] sm:text-[90px] md:text-[120px] font-black text-white tracking-tighter uppercase font-space text-center">{currentScene.text}</h1>
          </motion.div>
        )}

        {currentScene.type === 'epic-logo' && (
          <motion.div key={currentScene.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 2, filter: 'blur(40px)', transition: { duration: 1.5, ease: "easeIn" } }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0 flex items-center justify-center flex-col gap-6 z-50 bg-[#020617]">
            <motion.div initial={{ rotate: -180, scale: 0, filter: 'blur(20px)' }} animate={{ rotate: 0, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1.2, type: "spring", bounce: 0.4 }} className="relative mb-6">
              <div className="absolute inset-0 bg-cyan-400/50 blur-[100px] rounded-full scale-[2] animate-[pulse_2s_infinite]" />
              <BrandFlowLogo className="w-40 h-40 drop-shadow-[0_0_50px_rgba(255,255,255,0.8)] relative z-20 text-white" />
            </motion.div>
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 1.2 }}>
              {renderSignature('text-[100px] sm:text-[200px]', true)}
            </motion.div>
          </motion.div>
        )}

        {/* =========================================
            BODY: ONBOARDING / UPLOAD (Tài liệu doanh nghiệp)
            ========================================= */}
        {currentScene.type === 'body-onboarding' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            {/* Title */}
            <div className="absolute top-[10%] w-full text-center z-30">
              <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</motion.h2>
            </div>

            {/* Animation Khung File */}
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* File Icon -> Mở ra nội dung -> Gập lại -> Bay vào Upload */}
              <motion.div
                className="relative bg-slate-800/80 border border-slate-600/50 backdrop-blur-xl rounded-2xl flex flex-col overflow-hidden shadow-2xl"
                initial={{ y: 300, scale: 0, rotateX: 45 }}
                animate={{ 
                  y: [300, 0, 0, 0, -200], 
                  scale: [0, 1, 1.3, 0.4, 0], 
                  rotateX: [45, 0, 0, 0, 0],
                  opacity: [0, 1, 1, 1, 0]
                }}
                transition={{ duration: 5, times: [0, 0.15, 0.4, 0.8, 1], ease: "easeInOut" }}
                style={{ width: '400px', height: '500px' }}
              >
                {/* Header File */}
                <div className="bg-slate-900 p-4 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="text-cyan-400 w-6 h-6" />
                    <span className="font-bold text-white font-space">Tài liệu Doanh nghiệp.pdf</span>
                  </div>
                  <ShieldCheck className="text-emerald-400 w-6 h-6" />
                </div>
                
                {/* Nội dung File (Mô phỏng bóc tách dữ liệu) */}
                <div className="p-6 space-y-4">
                  <motion.div className="h-4 bg-slate-700 rounded w-3/4" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} />
                  <motion.div className="h-4 bg-slate-700 rounded w-full" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} />
                  <motion.div className="h-4 bg-slate-700 rounded w-5/6" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} />
                  <div className="pt-6">
                    <div className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-2 border border-emerald-400/30 bg-emerald-400/10 p-2 rounded w-max">
                      <ShieldCheck className="w-4 h-4" /> Cam kết bảo mật chuẩn Enterprise 100%
                    </div>
                  </div>
                </div>

                {/* Scan lướt qua file (Hiệu ứng AI đọc file) */}
                <motion.div 
                  className="absolute inset-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] z-50"
                  initial={{ top: '0%' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 2, times: [0, 0.5, 1], ease: "linear" }}
                />
              </motion.div>

              {/* Khu vực Upload (Đón file bay vào) */}
              <motion.div
                className="absolute top-[20%] flex flex-col items-center justify-center w-[300px] h-[300px] border-4 border-dashed border-cyan-500/50 rounded-full bg-cyan-900/20 backdrop-blur-md"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 0, 1, 1], opacity: [0, 0, 1, 1], borderColor: ['rgba(6,182,212,0.5)', 'rgba(6,182,212,1)'] }}
                transition={{ duration: 5, times: [0, 0.7, 0.8, 1] }}
              >
                <UploadCloud className="w-20 h-20 text-cyan-400 mb-4 animate-bounce" />
                <span className="font-bold text-cyan-300 font-space tracking-widest uppercase">BrandFlow Core</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* =========================================
            BODY: AI DEBATE (Hội đồng AI tranh biện)
            ========================================= */}
        {currentScene.type === 'body-debate' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            <div className="absolute top-[10%] w-full text-center z-30">
              <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</motion.h2>
            </div>

            {/* UI Mô phỏng Debate */}
            <motion.div 
              className="mt-20 w-[90vw] max-w-[1000px] bg-slate-900/90 border border-slate-700 rounded-3xl p-8 shadow-2xl flex flex-col gap-6"
              initial={{ rotateX: 30, y: 200, opacity: 0 }}
              animate={{ rotateX: 0, y: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.3, duration: 1 }}
            >
              {/* Message CMO */}
              <motion.div className="flex items-start gap-4" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 shrink-0">
                  <BrainCircuit className="text-cyan-400 w-6 h-6" />
                </div>
                <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 w-3/4">
                  <p className="text-cyan-400 font-bold mb-2 font-space">CMO Agent</p>
                  <p className="text-slate-200">Đề xuất tăng 50 triệu VNĐ vào chiến dịch Facebook Ads tập trung chuyển đổi nhanh!</p>
                </div>
              </motion.div>

              {/* Message Math Engine (Phản biện) */}
              <motion.div className="flex items-start gap-4 flex-row-reverse" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 2.2 }}>
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/40 shrink-0">
                  <LineChart className="text-red-400 w-6 h-6" />
                </div>
                <div className="bg-red-950/30 p-4 rounded-2xl rounded-tr-none border border-red-900/50 w-3/4 text-right">
                  <p className="text-red-400 font-bold mb-2 font-space">Math Engine Kernel</p>
                  <p className="text-slate-200">
                    <span className="text-red-400 font-bold">X Phủ quyết. </span> 
                    Biên lợi nhuận gộp (Gross Margin) dự phóng chỉ đạt 12% nếu tiếp tục nạp. Rủi ro cháy ngân sách. Đề nghị luân chuyển SEO.
                  </p>
                </div>
              </motion.div>
              
              {/* Kết quả đồng thuận */}
              <motion.div className="mt-4 flex justify-center" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 4, type: "spring" }}>
                <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-6 py-2 rounded-full font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Hệ thống đã ngăn chặn lãng phí thành công.
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* =========================================
            BODY: CREATIVE STUDIO (Asset Generation)
            ========================================= */}
        {currentScene.type === 'body-creative' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            <div className="absolute top-[10%] w-full text-center z-30">
              <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</motion.h2>
            </div>

            <div className="relative w-full max-w-[1200px] h-[600px] mt-20 flex items-center justify-center">
              {/* Các khung hình Placeholder lơ lửng */}
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="absolute bg-slate-800 rounded-2xl border border-slate-600 overflow-hidden shadow-2xl flex items-center justify-center"
                  style={{
                    width: i === 2 ? '500px' : '300px',
                    height: i === 2 ? '400px' : '250px',
                    left: i === 1 ? '10%' : i === 3 ? '65%' : '50%',
                    top: '50%',
                    x: '-50%', y: '-50%',
                    zIndex: i === 2 ? 10 : 5
                  }}
                  initial={{ scale: 0, rotate: i === 1 ? -10 : i === 3 ? 10 : 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.3, type: "spring" }}
                >
                  <Palette className="w-16 h-16 text-slate-600" />
                  
                  {/* Hiệu ứng Đũa thần quét qua tạo ra ảnh */}
                  <motion.div 
                    className="absolute inset-0 bg-[url('/docs/02_workspace_phase5.webp')] bg-cover bg-center"
                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                    animate={{ clipPath: 'inset(0 0% 0 0)' }}
                    transition={{ delay: 2 + (i * 0.2), duration: 1, ease: "easeInOut" }}
                  />
                </motion.div>
              ))}

              {/* Đũa thần (Wand) */}
              <motion.div
                className="absolute z-50 text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,1)]"
                initial={{ x: -400, y: 200, opacity: 0 }}
                animate={{ x: [ -400, 0, 400, 0 ], y: [ 200, 0, 100, 50 ], opacity: [0, 1, 1, 0] }}
                transition={{ delay: 1.5, duration: 2.5, ease: "easeInOut" }}
              >
                <Wand2 className="w-16 h-16" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* =========================================
            BODY: FINANCE & GANTT (Phase 6)
            ========================================= */}
        {currentScene.type === 'body-finance' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            <div className="absolute top-[10%] w-full text-center z-30">
              <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</motion.h2>
            </div>

            <div className="mt-20 w-[90vw] max-w-[1200px] h-[500px] bg-slate-900/80 border border-slate-700 rounded-3xl p-8 flex gap-8">
              {/* Cột trái: Chart */}
              <div className="flex-1 border-r border-slate-800 pr-8 flex flex-col justify-end gap-4">
                <div className="flex justify-between items-end h-full">
                  {[40, 70, 30, 90, 60, 100].map((h, i) => (
                    <motion.div 
                      key={i}
                      className="w-12 bg-cyan-500 rounded-t-lg relative"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 1, type: "spring" }}
                    >
                      {/* Glow trên đầu cột */}
                      <div className="absolute top-0 w-full h-4 bg-white/40 blur-sm rounded-t-lg" />
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-cyan-400 font-space font-bold text-xl mt-4">
                  <BarChart3 /> Phân bổ P&L Realtime
                </div>
              </div>

              {/* Cột phải: Gantt/Timeline */}
              <div className="flex-1 flex flex-col gap-6 justify-center">
                {[1, 2, 3].map((task) => (
                  <motion.div 
                    key={task}
                    className="h-16 bg-slate-800 rounded-xl relative overflow-hidden flex items-center px-4 border border-slate-700"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + (task * 0.2), type: "spring" }}
                  >
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 bg-blue-500/30 border-l-4 border-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${task * 30}%` }}
                      transition={{ delay: 1 + (task * 0.2), duration: 1 }}
                    />
                    <div className="relative z-10 flex items-center gap-3 text-slate-300 font-bold font-mono">
                      <Clock className="w-5 h-5 text-blue-400" />
                      Giai đoạn {task}: Tự động chạy
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
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
            <motion.div 
              className="absolute w-[150vw] h-[150vw] bg-gradient-to-tr from-cyan-900/40 via-blue-900/20 to-black rounded-full blur-[100px] mix-blend-screen"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 2, type: "spring", bounce: 0.2 }} className="mb-8 relative z-10">
              <BrandFlowLogo className="w-24 h-24 text-slate-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30, letterSpacing: '10px' }} animate={{ opacity: 1, y: 0, letterSpacing: '0px' }} transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }} className="relative z-10">
              {renderSignature('text-7xl sm:text-[140px]')}
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }} className="mt-12 flex flex-col items-center gap-3 relative z-10">
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
