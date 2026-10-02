"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import { Space_Grotesk, Inter } from 'next/font/google';
import { FileText, ShieldCheck, UploadCloud, BrainCircuit, LineChart, CheckCircle2, Wand2, BarChart3, Clock, Eye, AlertCircle, Sparkles } from 'lucide-react';

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
  // BODY SEQUENCE (BẾP NHÀ MỘC DATA)
  // ======================
  { id: 'body-onboarding', type: 'body-onboarding', subtitle: "1. UPLOAD DỮ LIỆU DOANH NGHIỆP." },
  { id: 'body-debate', type: 'body-debate', subtitle: "2. TRANH BIỆN BẢO VỆ NGÂN SÁCH." },
  { id: 'body-creative', type: 'body-creative', subtitle: "3. TỰ ĐỘNG SẢN XUẤT TÀI NGUYÊN." },
  { id: 'body-finance', type: 'body-finance', subtitle: "4. KIỂM SOÁT NGÂN SÁCH CHẶT CHẼ." },

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
        
        {/* INTRO */}
        {currentScene.type === 'system-intro' && (
          <motion.div key={currentScene.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 3, filter: 'blur(30px)' }} className="absolute inset-0 flex items-center justify-center bg-[#070B14] z-50">
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
            BODY: ONBOARDING (BẾP NHÀ MỘC DOCX REAL)
            ========================================= */}
        {currentScene.type === 'body-onboarding' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            <div className="absolute top-[8%] w-full text-center z-30">
              <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</motion.h2>
            </div>

            <motion.div 
              className="mt-20 w-[90vw] max-w-[800px] bg-slate-900/90 border border-slate-700/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative"
              initial={{ rotateX: 20, y: 150, opacity: 0 }} animate={{ rotateX: 0, y: 0, opacity: 1 }} transition={{ duration: 1.2 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-white mb-2">Khởi tạo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Brand DNA</span></h2>
                <p className="text-slate-400 text-sm">Nạp dữ liệu thô của doanh nghiệp để AI học hỏi</p>
              </div>

              {/* Upload Zone */}
              <div className="w-full border-2 border-dashed border-cyan-500/50 bg-cyan-900/10 rounded-3xl p-8 flex flex-col items-center justify-center mb-6 relative overflow-hidden">
                <UploadCloud className="w-12 h-12 text-cyan-400 mb-3" />
                <p className="text-white font-bold mb-1">Thả file vào đây...</p>
                <p className="text-xs text-slate-400">Hỗ trợ: PDF, DOCX, TXT — tối đa 100MB/file</p>
                <motion.div 
                  className="absolute inset-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)]"
                  initial={{ top: '0%' }} animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* Uploaded File (Thực tế file docx) */}
              <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <motion.div 
                  initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.2 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <span className="text-[9px] font-black text-blue-400">DOCX</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">BepNhaMoc_BrandFlow.docx</p>
                    <p className="text-xs text-slate-400">18.4 KB</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                </motion.div>
              </motion.div>

              {/* AI Extraction Data */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}
                className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-sm font-medium"
              >
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" /> 
                  <span className="font-bold uppercase tracking-wider">AI Đã Trích Xuất: Bếp Nhà Mộc</span>
                </div>
                <ul className="text-slate-300 text-xs space-y-1 ml-7">
                  <li><span className="text-cyan-300">Doanh thu:</span> 600–770 triệu/tháng | <span className="text-cyan-300">Margin:</span> 8–12%</li>
                  <li><span className="text-cyan-300">Vấn đề:</span> Phụ thuộc App Giao đồ ăn làm giảm biên lợi nhuận</li>
                  <li><span className="text-cyan-300">Ngân sách Marketing:</span> 15 – 25 triệu VND/tháng</li>
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* =========================================
            BODY: AI DEBATE (REAL DATA BẾP NHÀ MỘC)
            ========================================= */}
        {currentScene.type === 'body-debate' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            <div className="absolute top-[8%] w-full text-center z-30">
              <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</motion.h2>
            </div>

            <motion.div 
              className="mt-16 w-[90vw] max-w-[1000px] bg-slate-900/95 border border-slate-700 rounded-3xl p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6"
              initial={{ rotateX: 30, scale: 0.8, opacity: 0 }} animate={{ rotateX: 0, scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 1 }}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-widest">Debate Kernel V2.0</span>
                </div>
              </div>

              {/* CMO Message */}
              <motion.div className="flex items-start gap-4" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, type: "spring" }}>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40 shrink-0">
                  <BrainCircuit className="text-cyan-400 w-6 h-6" />
                </div>
                <div className="bg-slate-800 p-5 rounded-2xl rounded-tl-none border border-slate-700 w-[80%]">
                  <p className="text-cyan-400 font-bold mb-2 font-space">CMO Agent</p>
                  <p className="text-slate-200 leading-relaxed text-lg">
                    Đề xuất chi <span className="font-bold text-white">15 triệu (60% ngân sách)</span> chạy Facebook Ads nhắm khách hàng khu vực Hà Đông để tăng độ nhận diện dịp Tết.
                  </p>
                </div>
              </motion.div>

              {/* Math Engine Veto */}
              <motion.div className="flex items-start gap-4 flex-row-reverse mt-2" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 2.5, type: "spring" }}>
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/40 shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                  <LineChart className="text-red-400 w-6 h-6" />
                </div>
                <div className="bg-red-950/40 p-5 rounded-2xl rounded-tr-none border border-red-900/50 w-[85%] text-right">
                  <p className="text-red-400 font-bold mb-2 font-space">Math Engine Kernel</p>
                  <p className="text-slate-200 leading-relaxed text-lg">
                    <span className="text-red-400 font-black tracking-widest uppercase bg-red-500/20 px-2 py-1 rounded mr-2">❌ Phủ quyết</span> 
                    Ngân sách tổng chỉ <b className="text-white">25 triệu/tháng</b>. Đốt 15 triệu vào Ads với <b className="text-white">biên lợi nhuận 8-12%</b> sẽ không đủ bù vốn. 
                    <br/><br/>
                    Đề nghị hủy Ads! Chuyển ngân sách 15 triệu này để làm <b className="text-cyan-300">Zalo Broadcast Promo (ROI cao hơn)</b> kéo khách từ App giao đồ ăn sang đặt trực tiếp!
                  </p>
                </div>
              </motion.div>
              
              <motion.div className="mt-6 flex justify-center" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 4.5, type: "spring" }}>
                <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-6 py-3 rounded-full font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Đã tối ưu ngân sách: Hủy FB Ads, chuyển 15tr sang Zalo Promo.
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* =========================================
            BODY: CREATIVE STUDIO (BẾP NHÀ MỘC ZALO)
            ========================================= */}
        {currentScene.type === 'body-creative' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            <div className="absolute top-[8%] w-full text-center z-30">
              <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</motion.h2>
            </div>

            <div className="relative w-full max-w-[1200px] h-[600px] mt-16 flex items-center justify-center">
              
              <motion.div
                className="relative bg-white rounded-3xl border border-slate-300 overflow-hidden shadow-2xl flex flex-col z-10"
                style={{ width: '450px', height: '580px' }}
                initial={{ scale: 0, y: 100 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", duration: 1 }}
              >
                {/* Header Zalo OA */}
                <div className="bg-blue-600 p-4 text-white font-bold flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">MỘC</div>
                  <div>
                    <div className="text-lg leading-tight">Bếp Nhà Mộc (Official)</div>
                    <div className="text-xs font-normal opacity-80">Zalo Broadcast - Tháng 12</div>
                  </div>
                </div>

                <div className="p-4 flex-1 bg-slate-100 flex flex-col gap-4">
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-sm font-semibold text-slate-800 mb-2">🌿 COMBO BỮA TỐI GIA ĐÌNH</p>
                    <p className="text-xs text-slate-600 mb-3">Thoát khỏi phụ thuộc App giao đồ ăn! Đặt trực tiếp qua Zalo OA Bếp Nhà Mộc nhận ngay ưu đãi 20%. Nhận đơn nhóm đến hết ngày 8/1.</p>
                    
                    <div className="w-full h-56 bg-slate-200 rounded-xl relative overflow-hidden flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-slate-400 animate-pulse" />
                      
                      <motion.div 
                        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center"
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        animate={{ clipPath: 'inset(0 0% 0 0)' }}
                        transition={{ delay: 2, duration: 1.2, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute z-50 text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,1)]"
                initial={{ x: -300, y: 200, opacity: 0 }}
                animate={{ x: [ -300, 0, 300 ], y: [ 200, 0, 200 ], opacity: [0, 1, 0] }}
                transition={{ delay: 1.5, duration: 2, ease: "easeInOut" }}
              >
                <Wand2 className="w-20 h-20" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* =========================================
            BODY: FINANCE & GANTT (REAL OPEX)
            ========================================= */}
        {currentScene.type === 'body-finance' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            <div className="absolute top-[8%] w-full text-center z-30">
              <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</motion.h2>
            </div>

            <div className="mt-16 w-[95vw] max-w-[1300px] h-[550px] bg-slate-900/95 border border-slate-700/50 rounded-3xl p-8 shadow-2xl flex gap-8">
              
              {/* P&L Chart */}
              <div className="flex-1 border-r border-slate-800 pr-8 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-1">Ngân sách Marketing Tháng</h3>
                  <motion.div 
                    className="text-5xl font-black text-white font-space"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  >
                    25,000,000 <span className="text-cyan-500 text-2xl">VNĐ</span>
                  </motion.div>
                </div>
                
                <div className="flex-1 flex justify-between items-end pb-4 border-b border-slate-800">
                  {[
                    { label: 'Zalo Promo', h: 60, color: 'bg-emerald-500' }, // 15tr
                    { label: 'App Promo', h: 32, color: 'bg-blue-500' }, // 8tr
                    { label: 'Content', h: 8, color: 'bg-cyan-500' }, // 2tr
                    { label: 'FB Ads', h: 0, color: 'bg-red-500' } // Bị cắt
                  ].map((col, i) => (
                    <div key={i} className="flex flex-col items-center w-1/4 gap-3">
                      <motion.div 
                        className={`w-full ${col.color} rounded-t-xl relative`}
                        initial={{ height: 0 }} animate={{ height: `${col.h}%` }} transition={{ delay: 1 + i * 0.2, duration: 1, type: "spring" }}
                      >
                        {col.h > 0 && <div className="absolute top-0 w-full h-4 bg-white/30 blur-sm rounded-t-xl" />}
                      </motion.div>
                      <span className="text-xs font-bold text-slate-400">{col.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gantt Tasks (Thực thi) */}
              <div className="flex-1 flex flex-col gap-5 justify-center pl-4">
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Tiến độ chiến dịch Tết</h3>
                
                {[
                  { title: "Triển khai Zalo Broadcast", time: "Tuần 3", color: "bg-emerald-500", p: 100 },
                  { title: "Đơn giản hóa thực đơn bán chạy", time: "Tuần 4", color: "bg-blue-500", p: 70 },
                  { title: "Cập nhật Canva Templates", time: "Tuần 7", color: "bg-cyan-500", p: 10 }
                ].map((task, idx) => (
                  <motion.div 
                    key={idx}
                    className="h-20 bg-slate-800/80 rounded-2xl relative overflow-hidden flex flex-col justify-center px-5 border border-slate-700"
                    initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.5 + (idx * 0.2), type: "spring" }}
                  >
                    <motion.div 
                      className={`absolute left-0 top-0 bottom-0 ${task.color} opacity-20 border-l-4 border-current`}
                      initial={{ width: 0 }} animate={{ width: `${task.p}%` }} transition={{ delay: 2 + (idx * 0.2), duration: 1.5 }}
                    />
                    
                    <div className="relative z-10 flex justify-between items-center w-full">
                      <div>
                        <div className="text-white font-bold text-lg">{task.title}</div>
                        <div className="text-slate-400 text-sm flex items-center gap-1"><Clock className="w-3 h-3"/> {task.time}</div>
                      </div>
                      <div className="text-xl font-black text-slate-300 font-space">{task.p}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
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
