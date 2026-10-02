"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import { Space_Grotesk, Inter } from 'next/font/google';
import { 
  FileText, ShieldCheck, UploadCloud, BrainCircuit, LineChart, 
  CheckCircle2, Wand2, BarChart3, Clock, LayoutDashboard, 
  Target, PenTool, Calendar, Settings, Bell, Search, Heart, MessageCircle, Share2,
  Link as LinkIcon, Lock, Server, CheckCircle, Eye, X, AlertCircle
} from 'lucide-react';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const SCENES = [
  // INTRO
  { id: 'start', type: 'system-intro' },
  { id: 'hook1', type: 'kinetic-text', text: '60% NGÂN SÁCH...' },
  { id: 'hook2', type: 'glitch-text', text: '...BỊ LÃNG PHÍ.' },
  { id: 'hook3', type: 'snappy-cut', text: 'THUÊ AGENCY? QUÁ ĐẮT.' },
  { id: 'hook4', type: 'snappy-cut', text: 'DÙNG CHATGPT? THIẾU THỰC TẾ.' },
  { id: 'logo-reveal', type: 'epic-logo' },

  // BODY
  { id: 'body-onboarding', type: 'body-onboarding', subtitle: "1. UPLOAD DỮ LIỆU DOANH NGHIỆP." },
  { id: 'body-debate', type: 'body-debate', subtitle: "2. TRANH BIỆN BẢO VỆ NGÂN SÁCH." },
  { id: 'body-content-daily', type: 'body-content-daily', subtitle: "3. AUTO-GEN CONTENT ĐA NỀN TẢNG." },
  { id: 'body-finance', type: 'body-finance', subtitle: "4. KIỂM SOÁT NGÂN SÁCH CHẶT CHẼ." },

  // OUTRO
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

  const MockAppShell = ({ activeMenu, children }: { activeMenu: string, children: React.ReactNode }) => (
    <div className="absolute inset-0 flex bg-[#020617] text-slate-300 font-inter text-sm z-10">
      <div className="w-64 bg-[#020617] border-r border-slate-800 flex flex-col z-20">
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
      
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#070B14]">
        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-md z-20">
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
      className={`w-screen h-screen bg-[#020617] overflow-hidden flex items-center justify-center relative cursor-pointer ${inter.variable} ${spaceGrotesk.variable} font-sans`}
      onClick={() => setStep(s => Math.min(s + 1, SCENES.length - 1))}
      style={{ perspective: '2500px' }}
    >
      {(step <= 5 || step === SCENES.length - 1) && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 0.4, scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
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
            BODY: ONBOARDING - EXACT REPLICA OF Screen1_Source
            ========================================= */}
        {currentScene.type === 'body-onboarding' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} transition={{ duration: 0.5 }}
          >
            <MockAppShell activeMenu="onboarding">
              <div className="flex flex-col items-center p-8 max-w-5xl mx-auto w-full min-h-full">
                
                {/* TITLE OVERLAY FOR DEMO PURPOSE ONLY */}
                <div className="absolute top-[2%] w-full text-center z-30 drop-shadow-2xl pointer-events-none">
                  <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</motion.h2>
                </div>

                {/* --- EXACT UI REPLICA --- */}
                <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="w-full mt-12">
                  
                  {/* Header */}
                  <div className="text-center mb-10 shrink-0 relative z-10">
                    <div className="inline-flex items-center px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-sm mb-4 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-3 shrink-0" />
                      <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">Stage 1: Ingestion</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                      Khởi tạo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Brand DNA</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-base">Nạp dữ liệu thô của doanh nghiệp để AI học hỏi và định hình chiến lược.</p>
                  </div>

                  {/* 3 Source Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8 shrink-0">
                    {/* Card 1 (Active) */}
                    <div className="relative group flex flex-col p-6 rounded-3xl transition-all duration-500 border backdrop-blur-xl shadow-sm overflow-hidden bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] scale-[1.02]">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors z-10 bg-cyan-500/20 border border-cyan-500/30">
                        <UploadCloud className="w-6 h-6 text-cyan-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Tải lên Tệp dữ liệu</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">PDF, Word, Excel, CSV, Audio, Video chứa tài liệu nội bộ, báo cáo kinh doanh, brand guideline.</p>
                      <div className="absolute top-4 right-4 text-cyan-400"><CheckCircle2 className="w-5 h-5 animate-in fade-in" /></div>
                      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                    </div>

                    {/* Card 2 */}
                    <div className="relative group flex flex-col p-6 rounded-3xl transition-all duration-500 border backdrop-blur-xl shadow-sm overflow-hidden bg-slate-800/50 border-slate-700">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors z-10 bg-slate-800 border border-slate-700">
                        <LinkIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Quét Website / Mạng xã hội</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">Dán link Fanpage, Tiktok, Website. AI sẽ tự động cào dữ liệu và phân tích ngôn ngữ thương hiệu hiện tại.</p>
                    </div>

                    {/* Card 3 */}
                    <div className="relative group flex flex-col p-6 rounded-3xl transition-all duration-500 border backdrop-blur-xl shadow-sm overflow-hidden bg-slate-800/50 border-slate-700">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors z-10 bg-slate-800 border border-slate-700">
                        <FileText className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Trả lời Câu hỏi trực tiếp</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">Không có sẵn tài liệu? Hãy trả lời 5-10 câu hỏi phỏng vấn chuyên sâu từ AI để tạo khung sườn.</p>
                    </div>
                  </div>

                  {/* Upload Zone */}
                  <div className="w-full flex-1 flex flex-col items-center">
                    <div className="w-full mb-6 overflow-hidden">
                      <div className="w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-h-48 backdrop-blur-md relative overflow-hidden bg-slate-800/50 border-slate-700">
                        <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
                        <p className="text-white font-bold mb-1">Thả file vào đây...</p>
                        <p className="text-xs text-slate-400">Hỗ trợ: PDF, DOCX, TXT, MD, CSV, XLSX, XLS, HTML — tối đa 100MB/file</p>
                        <p className="text-xs text-cyan-500/70 mt-2 font-medium">hoặc nhấp để chọn file</p>
                        
                        {/* ANIMATED DRAG & DROP FAKE ACTION */}
                        <motion.div 
                          className="absolute inset-0 bg-cyan-500/10 border-2 border-cyan-400 rounded-3xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ delay: 2, duration: 1, times: [0, 0.5, 1] }}
                        />
                      </div>

                      {/* File rows (Animations) */}
                      <motion.div className="mt-4 space-y-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }}>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">1 tài liệu đã chọn</p>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/70 border border-slate-700">
                          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                            <span className="text-[9px] font-black text-cyan-400">DOCX</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">BepNhaMoc_BrandFlow.docx</p>
                            <p className="text-xs text-slate-400 flex items-center gap-2">
                              18.4 KB <span className="opacity-100 text-cyan-400 flex items-center gap-1"><Eye className="w-3 h-3" /> Preview</span>
                            </p>
                          </div>
                          <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: 3.5, duration: 0.1 }}>
                            <X className="w-4 h-4 text-slate-400" />
                          </motion.div>
                          <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 3.5, duration: 0.3 }} className="absolute right-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          </motion.div>
                        </div>

                        {/* Status Message (After upload) */}
                        <motion.div 
                          initial={{ opacity: 0, y: -5, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} transition={{ delay: 4 }}
                          className="flex items-start gap-2 p-3 rounded-xl text-sm font-medium mt-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                          <span className="whitespace-pre-line">
                            ✅ BepNhaMoc_BrandFlow.docx · 18.4k ký tự [AI Extraction]{'\n'}
                            ⚡ Math Engine & Cross-Validation: Hoàn tất (0.8s)
                          </span>
                        </motion.div>
                      </motion.div>

                      {/* Enterprise Security Badge */}
                      <div className="mt-6 px-6 py-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-transparent shadow-sm w-full relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                        <p className="text-[13px] leading-relaxed text-slate-400 mb-5 text-center relative z-10">
                          <Lock className="w-3.5 h-3.5 inline-block mr-1.5 text-slate-400 mb-0.5" />
                          <span>Tài liệu nội bộ được bảo vệ bởi chuẩn <b>Mã hóa Đầu cuối</b>. Nhằm đảm bảo tuyệt mật, hệ thống sẽ <b>tiêu hủy file gốc vĩnh viễn</b> khỏi máy chủ ngay sau khi phân tích. Trí tuệ Nhân tạo tuyệt đối không sử dụng Dữ liệu của bạn để tự huấn luyện.</span>
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest relative z-10">
                          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-cyan-500" /> Enterprise Privacy</span>
                          <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-cyan-500" /> AES-256 Encrypted</span>
                          <span className="flex items-center gap-1.5"><Server className="w-4 h-4 text-cyan-500" /> Zero Retention</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>

              </div>
            </MockAppShell>
          </motion.div>
        )}

        {/* =========================================
            BODY: AI DEBATE 
            ========================================= */}
        {currentScene.type === 'body-debate' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            <MockAppShell activeMenu="strategy">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="absolute top-[2%] w-full text-center z-30">
                  <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</motion.h2>
                </div>

                {/* Base UI (Debate Canvas) */}
                <motion.div 
                  className="mt-12 w-full max-w-[1000px] h-[600px] bg-slate-900 border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-white">AI Strategy Optimizer</h2>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                      <span className="font-mono text-xs text-cyan-400">Debate Kernel V2.0 Active</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-6">
                    {/* CMO Message */}
                    <motion.div className="flex items-start gap-4" initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8, type: "spring" }}>
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/40">
                        <BrainCircuit className="text-cyan-400 w-6 h-6" />
                      </div>
                      <div className="bg-slate-800 p-5 rounded-2xl rounded-tl-none border border-slate-700 w-[80%]">
                        <p className="text-cyan-400 font-bold mb-1 font-space">CMO Agent</p>
                        <p className="text-slate-200 text-lg">Đề xuất chi <span className="font-bold text-white">15 triệu (60% ngân sách)</span> chạy Facebook Ads nhắm khách hàng khu vực Hà Đông để tăng độ nhận diện dịp Tết.</p>
                      </div>
                    </motion.div>

                    {/* Math Engine Veto */}
                    <motion.div className="flex items-start gap-4 flex-row-reverse" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 2.5, type: "spring" }}>
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                        <LineChart className="text-red-400 w-6 h-6" />
                      </div>
                      <div className="bg-red-950/40 p-5 rounded-2xl rounded-tr-none border border-red-900/50 w-[85%] text-right">
                        <p className="text-red-400 font-bold mb-1 font-space">Math Engine Kernel</p>
                        <p className="text-slate-200 text-lg">
                          <span className="text-red-400 font-black tracking-widest uppercase bg-red-500/20 px-2 py-1 rounded mr-2">❌ Phủ quyết</span> 
                          Ngân sách tổng chỉ <b className="text-white">25 triệu/tháng</b>. Đốt 15 triệu vào Ads với <b className="text-white">biên lợi nhuận 8-12%</b> sẽ không đủ bù vốn. 
                          <br/><br/>
                          Chuyển sang <b className="text-cyan-300">Zalo Broadcast Promo (ROI cao hơn)</b> kéo khách từ App giao đồ ăn sang đặt trực tiếp!
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </MockAppShell>
          </motion.div>
        )}

        {/* =========================================
            BODY: CONTENT DAILY (SWIPE ĐIỆN THOẠI)
            ========================================= */}
        {currentScene.type === 'body-content-daily' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            <MockAppShell activeMenu="content">
              
              <motion.div 
                className="absolute inset-0 bg-slate-900 p-8 flex flex-col gap-6 origin-center"
                initial={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                animate={{ scale: 1.2, filter: 'blur(20px)', opacity: 0.5 }}
                transition={{ delay: 1.5, duration: 1, ease: "easeInOut" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">Content Calendar</h2>
                  <div className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Auto Generate All</div>
                </div>
                <div className="grid grid-cols-4 gap-4 flex-1">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                      <div className="h-4 w-1/2 bg-slate-700 rounded mb-4" />
                      <div className="h-24 w-full bg-slate-700/50 rounded mb-2" />
                      <div className="h-2 w-3/4 bg-slate-700 rounded" />
                    </div>
                  ))}
                </div>
              </motion.div>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <motion.div 
                  className="absolute top-[8%] w-full text-center z-50 drop-shadow-2xl"
                  initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.8 }}
                >
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</h2>
                  <p className="text-cyan-400 font-mono mt-2 text-xl font-bold">1 Click. Tối ưu định dạng cho mọi nền tảng.</p>
                </motion.div>

                <motion.div
                  className="relative w-[360px] h-[720px] bg-black border-[12px] border-slate-800 rounded-[3rem] shadow-[0_0_80px_rgba(6,182,212,0.4)] overflow-hidden z-40 mt-12"
                  initial={{ y: 800, scale: 0.5, rotateZ: -10 }}
                  animate={{ y: 0, scale: 1, rotateZ: 0 }}
                  transition={{ delay: 1.8, type: "spring", bounce: 0.3, duration: 1.2 }}
                >
                  <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
                    <div className="w-32 h-6 bg-black rounded-b-xl" />
                  </div>

                  <motion.div 
                    className="flex w-[300%]"
                    initial={{ x: "0%" }} animate={{ x: ["0%", "-33.33%", "-66.66%"] }} 
                    transition={{ duration: 8, times: [0, 0.45, 0.9], ease: "easeInOut", delay: 3 }}
                  >
                    
                    <div className="w-1/3 h-full bg-white relative">
                      <div className="bg-white border-b border-gray-200 h-16 pt-6 px-4 flex items-center">
                        <span className="text-blue-600 font-bold text-xl">facebook</span>
                      </div>
                      <motion.div className="flex flex-col gap-2 p-2 bg-gray-200 h-full" initial={{ y: 0 }} animate={{ y: -150 }} transition={{ delay: 3.5, duration: 2, ease: "linear" }}>
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500" />
                            <div>
                              <p className="font-bold text-black text-sm">Bếp Nhà Mộc</p>
                              <p className="text-xs text-gray-500">2 giờ trước</p>
                            </div>
                          </div>
                          <p className="text-sm text-black mb-3 font-inter leading-relaxed">
                            Cơm nhà chuẩn vị nấu từ tâm. <br/>Tặng canh chua sườn non cho mọi đơn nhóm gia đình. Khách ghé chi nhánh Hà Đông cuối tuần nhé! 🍚✨
                          </p>
                          <div className="w-full h-48 bg-[url('https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=400&q=80')] bg-cover bg-center rounded-lg" />
                          <div className="flex items-center justify-between mt-3 px-2 border-t pt-2 text-gray-500">
                            <span className="flex items-center gap-1 text-xs"><Heart className="w-4 h-4"/> 1.2k</span>
                            <span className="flex items-center gap-1 text-xs"><MessageCircle className="w-4 h-4"/> 342</span>
                            <span className="flex items-center gap-1 text-xs"><Share2 className="w-4 h-4"/> Chia sẻ</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="w-1/3 h-full bg-slate-100 relative">
                      <div className="bg-blue-500 h-16 pt-6 px-4 flex items-center text-white font-bold gap-2">
                        <div className="w-6 h-6 rounded-full bg-white text-blue-500 flex items-center justify-center text-xs">M</div>
                        Bếp Nhà Mộc (OA)
                      </div>
                      <motion.div className="p-4" initial={{ y: 0 }} animate={{ y: -100 }} transition={{ delay: 6.5, duration: 2, ease: "linear" }}>
                        <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-100">
                          <p className="text-blue-600 font-bold mb-2">🌿 ƯU ĐÃI RIÊNG CHO ZALO</p>
                          <p className="text-sm text-gray-700 mb-3">Nhắn "ĐẶT BÀN" để nhận ngay Voucher 20% + Miễn phí Trà thảo mộc. Áp dụng đến cuối tuần.</p>
                          <div className="w-full h-40 bg-[url('https://images.unsplash.com/photo-1620288627223-53302f4e8c74?auto=format&fit=crop&w=400&q=80')] bg-cover bg-center rounded-xl" />
                          <div className="mt-4 flex gap-2">
                            <button className="flex-1 bg-blue-500 text-white py-2 rounded-full font-bold text-sm">Nhận Mã</button>
                            <button className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-full font-bold text-sm">Đặt Bàn</button>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="w-1/3 h-full bg-black relative text-white">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80')] bg-cover bg-center opacity-60" />
                      <div className="absolute top-8 left-0 right-0 flex justify-center gap-4 text-lg font-bold drop-shadow-md">
                        <span className="opacity-50">Dành cho bạn</span>
                        <span>Đang Follow</span>
                      </div>
                      <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center drop-shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-white" />
                        <div className="flex flex-col items-center"><Heart className="w-8 h-8 text-white"/><span className="text-xs">45K</span></div>
                        <div className="flex flex-col items-center"><MessageCircle className="w-8 h-8 text-white"/><span className="text-xs">1.2K</span></div>
                        <div className="flex flex-col items-center"><Share2 className="w-8 h-8 text-white"/><span className="text-xs">Chia sẻ</span></div>
                      </div>
                      <div className="absolute bottom-8 left-4 right-16 drop-shadow-lg">
                        <p className="font-bold mb-2">@bepnhamoc</p>
                        <p className="text-sm">Bí mật nấu cơm ngon như mẹ làm. Xem ngay! 🤫🔥 #bepnhamoc #comnha #amthuc</p>
                      </div>
                    </div>

                  </motion.div>
                </motion.div>
              </div>
            </MockAppShell>
          </motion.div>
        )}

        {/* =========================================
            BODY: FINANCE & GANTT
            ========================================= */}
        {currentScene.type === 'body-finance' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 z-20"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          >
            <MockAppShell activeMenu="planning">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="absolute top-[2%] w-full text-center z-30">
                  <motion.h2 initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-black text-white tracking-tighter uppercase font-space">{currentScene.subtitle}</motion.h2>
                </div>

                <div className="mt-12 w-[95%] max-w-[1200px] h-[550px] bg-slate-900 border border-slate-700/50 rounded-3xl p-8 shadow-2xl flex gap-8">
                  <div className="flex-1 border-r border-slate-800 pr-8 flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-1">Ngân sách Marketing Tháng</h3>
                      <motion.div className="text-5xl font-black text-white font-space" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                        25,000,000 <span className="text-cyan-500 text-2xl">VNĐ</span>
                      </motion.div>
                    </div>
                    <div className="flex-1 flex justify-between items-end pb-4 border-b border-slate-800">
                      {[
                        { label: 'Zalo Promo', h: 60, color: 'bg-emerald-500' },
                        { label: 'App Promo', h: 32, color: 'bg-blue-500' },
                        { label: 'Content', h: 8, color: 'bg-cyan-500' },
                        { label: 'FB Ads', h: 0, color: 'bg-red-500' }
                      ].map((col, i) => (
                        <div key={i} className="flex flex-col items-center w-1/4 gap-3">
                          <motion.div className={`w-full ${col.color} rounded-t-xl relative`} initial={{ height: 0 }} animate={{ height: `${col.h}%` }} transition={{ delay: 1 + i * 0.2, duration: 1, type: "spring" }}>
                            {col.h > 0 && <div className="absolute top-0 w-full h-4 bg-white/30 blur-sm rounded-t-xl" />}
                          </motion.div>
                          <span className="text-xs font-bold text-slate-400">{col.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-5 justify-center pl-4">
                    <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Tiến độ chiến dịch Tết</h3>
                    {[
                      { title: "Triển khai Zalo Broadcast", time: "Tuần 3", color: "bg-emerald-500", p: 100 },
                      { title: "Đơn giản hóa thực đơn bán chạy", time: "Tuần 4", color: "bg-blue-500", p: 70 },
                      { title: "Cập nhật Canva Templates", time: "Tuần 7", color: "bg-cyan-500", p: 10 }
                    ].map((task, idx) => (
                      <motion.div key={idx} className="h-20 bg-slate-800/80 rounded-2xl relative overflow-hidden flex flex-col justify-center px-5 border border-slate-700" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.5 + (idx * 0.2), type: "spring" }}>
                        <motion.div className={`absolute left-0 top-0 bottom-0 ${task.color} opacity-20 border-l-4 border-current`} initial={{ width: 0 }} animate={{ width: `${task.p}%` }} transition={{ delay: 2 + (idx * 0.2), duration: 1.5 }} />
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
              </div>
            </MockAppShell>
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
