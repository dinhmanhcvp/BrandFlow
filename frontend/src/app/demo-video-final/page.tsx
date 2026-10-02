"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import { Space_Grotesk, Inter } from 'next/font/google';
import AmbientParticles from '@/components/AmbientParticles';
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

function BudgetCutHighlight({ text }: { text: string }) {
  const cutPattern = /(Cắt hẳn|Ép giá|cut|reduce|cắt|giảm):\s*(.+?)(?:\s*\(-?([\d,.]+)\s*VND\))/gi;
  const matches = [...text.matchAll(cutPattern)];
  if (matches.length === 0) return <span>{text}</span>;

  let lastIndex = 0;
  const parts: React.ReactNode[] = [];
  matches.forEach((match, idx) => {
    const beforeText = text.slice(lastIndex, match.index);
    if (beforeText) parts.push(<span key={`before-${idx}`}>{beforeText}</span>);

    const action = match[1];
    const itemName = match[2];
    const amount = match[3];
    const isCut = action.toLowerCase().includes('cắt') || action.toLowerCase().includes('cut');

    parts.push(
      <span key={`cut-${idx}`} className="relative inline-flex items-center group cursor-help mx-1">
        <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${isCut ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-orange-500/15 text-orange-400 border border-orange-500/20'}`}>
          {isCut ? <XCircle className="w-3 h-3" /> : <Scissors className="w-3 h-3" />}
          <span className={isCut ? 'line-through decoration-red-500/80' : ''}>{itemName.trim()}</span>
          <span className="font-mono opacity-70">-{amount}đ</span>
        </motion.span>
      </span>
    );
    lastIndex = (match.index || 0) + match[0].length;
  });
  const remaining = text.slice(lastIndex);
  if (remaining) parts.push(<span key="remaining">{remaining}</span>);
  return <>{parts}</>;
}

function TypewriterEffect({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);
  return <BudgetCutHighlight text={displayedText} />;
}

const CinematicDebateMock = ({ onNext }: { onNext: () => void }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const MOCK_DEBATE = [
    { id: 0, agent: 'CMO', type: 'proposal', text: 'Đề xuất chi 15,000,000 VND (60% ngân sách) chạy Facebook Ads nhắm khách hàng khu vực Hà Đông để tăng độ nhận diện dịp Tết.' },
    { id: 1, agent: 'CFO', type: 'budget_cut', text: '❌ Cảnh báo Cắt hẳn: Facebook Ads (-15,000,000 VND). Ngân sách tổng chỉ 25 triệu/tháng. Đốt 15 triệu vào Ads với biên lợi nhuận 8-12% sẽ không đủ bù vốn. Chuyển sang Zalo Broadcast Promo kéo khách từ App giao đồ ăn!' },
    { id: 2, agent: 'SYSTEM', type: 'approved', text: 'Chiến lược đã được xác nhận. Ngân sách sẽ được phân bổ ưu tiên cho kênh Zalo Broadcast và App Promo nội bộ.' }
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < MOCK_DEBATE.length) {
        setMessages(prev => [...prev, MOCK_DEBATE[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsLocked(true), 1500);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages.length]);

  const getAgentTheme = (agent: string, type: string) => {
    if (type === 'budget_cut') return { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-400', iconBg: 'bg-amber-500/20', icon: Scissors };
    if (agent === 'CMO') return { bg: 'bg-blue-500/5', border: 'border-blue-500/20', text: 'text-blue-400', iconBg: 'bg-blue-500/20', icon: Bot };
    if (agent === 'CFO') return { bg: 'bg-orange-500/5', border: 'border-orange-500/20', text: 'text-orange-400', iconBg: 'bg-orange-500/20', icon: TrendingDown };
    return { bg: 'bg-slate-800/20', border: 'border-slate-700', text: 'text-white', iconBg: 'bg-slate-800/50 border border-slate-700', icon: ShieldCheck };
  };

  const getStatusBadge = (type: string) => {
    if (type === 'budget_cut') return <span className="flex items-center text-[9px] uppercase font-bold text-amber-400 bg-amber-900/30 px-1.5 py-0.5 rounded ml-2 border border-amber-800/50"><Scissors className="w-2.5 h-2.5 mr-1" /> CUT</span>;
    if (type === 'approved') return <span className="flex items-center text-[9px] uppercase font-bold text-cyan-400 bg-cyan-900/30 px-1.5 py-0.5 rounded ml-2 border border-cyan-800/50"><CheckCircle2 className="w-2.5 h-2.5 mr-1" /> APPROVED</span>;
    return null;
  };

  const currentMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const historyMsgs = messages.slice(0, -1);

  return (
    <div className="w-full h-[800px] flex flex-col relative bg-transparent overflow-hidden">
      <div className="flex-none p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full z-10 pt-16">
        <div className="flex items-center justify-between mb-4">
          <div className="text-slate-400 flex items-center text-sm font-semibold border border-slate-800 bg-slate-900/50 py-2 px-4 rounded-lg shadow-sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> <span>Back</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/50 border border-slate-700/50 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
            <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Agent Network Active</span>
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space tracking-tight">Debate Kernel (Stage 2)</h2>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl mx-auto">AI Agents đang phản biện chéo để tìm ra chiến lược tối ưu nhất.</p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-8 flex flex-col lg:flex-row gap-6 min-h-0">
        <div className="w-full lg:w-3/5 h-full flex flex-col relative">
          <div className="flex-1 border border-slate-700/50 relative overflow-hidden flex flex-col bg-slate-900/40 shadow-2xl rounded-2xl">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="absolute top-[-20%] left-[-10%] w-3/4 h-3/4 bg-cyan-500/10 blur-[100px] rounded-full"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-1/2 h-1/2 bg-blue-500/10 blur-[80px] rounded-full"></div>
            </div>

            <div className="p-4 border-b border-slate-700/40 bg-slate-900/60 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-500" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Live Analysis Node</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
            </div>

            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative z-10">
              {!currentMsg && !isLocked ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg relative overflow-hidden">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-transparent border-t-cyan-500 rounded-2xl"></motion.div>
                    <Activity className="w-8 h-8 text-cyan-500 animate-pulse" />
                  </div>
                  <div className="text-sm font-bold text-cyan-500 tracking-widest uppercase animate-pulse">Initializing Sub-Agents...</div>
                </div>
              ) : currentMsg && !isLocked ? (
                <AnimatePresence mode="wait">
                  <motion.div key={currentMsg.id} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }} transition={{ duration: 0.4 }} className="flex flex-col h-full">
                    <div className="flex items-center mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${getAgentTheme(currentMsg.agent, currentMsg.type).iconBg} flex items-center justify-center border border-white/10 shadow-lg relative`}>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                        {React.createElement(getAgentTheme(currentMsg.agent, currentMsg.type).icon, { className: `w-7 h-7 ${getAgentTheme(currentMsg.agent, currentMsg.type).text}` })}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <h3 className={`text-xl font-black uppercase tracking-wider ${getAgentTheme(currentMsg.agent, currentMsg.type).text}`}>{currentMsg.agent} Agent</h3>
                          {getStatusBadge(currentMsg.type)}
                        </div>
                        <p className="text-xs font-mono text-slate-500">Executing evaluation protocol...</p>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                      <div className={`text-lg md:text-xl font-medium leading-relaxed text-white whitespace-pre-wrap ${currentMsg.type === 'budget_cut' ? 'text-amber-100' : ''}`}>
                        <TypewriterEffect text={currentMsg.text} />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : isLocked ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-full">
                  <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Debate Concluded</h3>
                  <p className="text-slate-400 mb-8 max-w-sm">All sub-agents have reached consensus. The strategic plan is ready for final review.</p>
                </motion.div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/5 h-64 lg:h-full flex flex-col bg-slate-900/30 border border-slate-700/40 rounded-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-3 border-b border-slate-700/30 bg-slate-900/50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Communication Log</span>
            <span className="text-[10px] font-mono text-slate-500">{historyMsgs.length} Entries</span>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <AnimatePresence initial={false}>
              {historyMsgs.map((msg) => {
                const theme = getAgentTheme(msg.agent, msg.type);
                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, x: -20, height: 0 }} animate={{ opacity: 1, x: 0, height: 'auto' }} className={`p-3 rounded-xl border ${theme.border} ${theme.bg} flex gap-3 opacity-60 hover:opacity-100 transition-opacity`}>
                    <div className={`w-8 h-8 rounded-lg ${theme.iconBg} flex items-center justify-center shrink-0`}>
                      {React.createElement(theme.icon, { className: `w-4 h-4 ${theme.text}` })}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold uppercase ${theme.text}`}>{msg.agent}</span>
                        <span className="text-[9px] font-mono text-slate-600">Archived</span>
                      </div>
                      <div className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{msg.text}</div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const MockAppShell = ({ activeMenu, children }: { activeMenu: string, children: React.ReactNode }) => (
    <div className="absolute inset-0 flex bg-background text-slate-300 font-inter text-sm z-10">
      <div className="w-64 bg-background border-r border-slate-800 flex flex-col z-20">
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
        {/* Workspace Flow Background Elements */}
        <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-[0.05] z-0 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-background/50 backdrop-blur-md z-20">
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
      className={`w-screen h-screen bg-background overflow-hidden flex items-center justify-center relative cursor-pointer ${inter.variable} ${spaceGrotesk.variable} font-sans`}
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
            BODY: ONBOARDING - FULL SCREEN, NO SIDEBAR
            ========================================= */}
        {currentScene.type === 'body-onboarding' && (
          <motion.div 
            key={currentScene.id} 
            className="absolute inset-0 z-20 bg-background overflow-hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} transition={{ duration: 0.5 }}
          >
            {/* Ambient Background for Onboarding Phase 1 */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <AmbientParticles />
            </div>

            <div className="flex flex-col items-center p-8 max-w-5xl mx-auto w-full min-h-full relative z-10 pt-20">
              
              {/* EXACT UI REPLICA OF Screen1_Source */}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 shrink-0 relative z-10 w-full">
                <div className="inline-flex items-center px-4 py-2 rounded-full border border-linear-border bg-linear-surface/50 backdrop-blur-sm mb-4 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-3 shrink-0" />
                  <span className="text-xs font-semibold text-foreground tracking-wide uppercase">Stage 1: Ingestion</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
                  Khởi tạo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Brand DNA</span>
                </h2>
                <p className="text-linear-text-muted max-w-2xl mx-auto text-base">Nạp dữ liệu thô của doanh nghiệp để AI học hỏi và định hình chiến lược.</p>
              </motion.div>

              {/* 3 Source Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8 shrink-0">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative group flex flex-col p-6 rounded-3xl transition-all duration-500 border backdrop-blur-xl shadow-sm overflow-hidden bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] scale-[1.02]">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors z-10 bg-cyan-500/20 border border-cyan-500/30">
                    <UploadCloud className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Tải lên Tệp dữ liệu</h3>
                  <p className="text-xs text-linear-text-muted leading-relaxed">PDF, Word, Excel, CSV, Audio, Video chứa tài liệu nội bộ, báo cáo kinh doanh.</p>
                  <div className="absolute top-4 right-4 text-cyan-400"><CheckCircle2 className="w-5 h-5" /></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative group flex flex-col p-6 rounded-3xl transition-all duration-500 border backdrop-blur-xl shadow-sm overflow-hidden bg-linear-surface hover:bg-linear-surface/80 border-linear-border hover:border-cyan-500/30">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors z-10 bg-linear-surface/50 border border-linear-border group-hover:border-cyan-500/30">
                    <LinkIcon className="w-6 h-6 text-linear-text-muted group-hover:text-cyan-500/70" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Quét Website / Mạng xã hội</h3>
                  <p className="text-xs text-linear-text-muted leading-relaxed">Dán link Fanpage, Tiktok, Website. AI sẽ tự động cào dữ liệu và phân tích.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative group flex flex-col p-6 rounded-3xl transition-all duration-500 border backdrop-blur-xl shadow-sm overflow-hidden bg-linear-surface hover:bg-linear-surface/80 border-linear-border hover:border-cyan-500/30">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors z-10 bg-linear-surface/50 border border-linear-border group-hover:border-cyan-500/30">
                    <FileText className="w-6 h-6 text-linear-text-muted group-hover:text-cyan-500/70" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Trả lời Câu hỏi trực tiếp</h3>
                  <p className="text-xs text-linear-text-muted leading-relaxed">Không có sẵn tài liệu? Hãy trả lời 5-10 câu hỏi phỏng vấn chuyên sâu từ AI.</p>
                </motion.div>
              </div>

              {/* Upload Zone & Cinematic Drag & Drop Effect */}
              <div className="w-full flex-1 flex flex-col items-center">
                <div className="w-full mb-6 overflow-hidden relative">
                  
                  {/* File thả vào (Cinematic Drag & Drop) */}
                  <motion.div 
                    className="absolute z-50 pointer-events-none"
                    initial={{ x: 600, y: -400, rotate: 25, scale: 1.5, opacity: 0 }}
                    animate={{ x: 0, y: 80, rotate: 0, scale: 0, opacity: [0, 1, 1, 0] }}
                    transition={{ delay: 1, duration: 1.2, ease: "anticipate" }}
                    style={{ left: '50%', marginLeft: '-40px' }}
                  >
                    <div className="w-20 h-28 bg-cyan-500/20 border-2 border-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.6)] backdrop-blur-md">
                      <FileText className="w-10 h-10 text-cyan-100" />
                    </div>
                  </motion.div>

                  {/* Dropzone Container */}
                  <motion.div 
                    className="w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center min-h-48 backdrop-blur-md relative overflow-hidden bg-linear-surface/50 border-linear-border"
                    animate={{
                      borderColor: ["#334155", "#06b6d4", "#334155"],
                      backgroundColor: ["rgba(0,0,0,0)", "rgba(6,182,212,0.1)", "rgba(0,0,0,0)"],
                      scale: [1, 1.02, 1]
                    }}
                    transition={{ delay: 1.8, duration: 0.5 }}
                  >
                    <UploadCloud className="w-10 h-10 mb-3 text-linear-text-muted" />
                    <p className="text-foreground font-bold mb-1">Thả file vào đây...</p>
                    <p className="text-xs text-linear-text-muted">Hỗ trợ: PDF, DOCX, TXT, MD, CSV, XLSX, XLS, HTML — tối đa 100MB/file</p>
                    <p className="text-xs text-cyan-500/70 mt-2 font-medium">hoặc nhấp để chọn file</p>
                  </motion.div>

                  {/* Result File Row */}
                  <motion.div className="mt-4 space-y-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 2.2 }}>
                    <p className="text-xs font-bold text-linear-text-muted uppercase tracking-wider mb-3">1 tài liệu đã chọn</p>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-surface/70 border border-linear-border hover:border-cyan-500/30 transition-all group">
                      <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <span className="text-[9px] font-black text-cyan-400">DOCX</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">BepNhaMoc_BrandFlow.docx</p>
                        <p className="text-xs text-linear-text-muted flex items-center gap-2">
                          18.4 KB <span className="opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400 flex items-center gap-1"><Eye className="w-3 h-3" /> Preview</span>
                        </p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: -5, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} transition={{ delay: 3 }}
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
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 px-6 py-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-transparent shadow-sm w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    <p className="text-[13px] leading-relaxed text-linear-text-muted mb-5 text-center relative z-10">
                      <Lock className="w-3.5 h-3.5 inline-block mr-1.5 text-linear-text-muted mb-0.5" />
                      <span>Tài liệu nội bộ được bảo vệ bởi chuẩn <b>Mã hóa Đầu cuối</b>. Nhằm đảm bảo tuyệt mật, hệ thống sẽ <b>tiêu hủy file gốc vĩnh viễn</b> khỏi máy chủ ngay sau khi phân tích. Trí tuệ Nhân tạo tuyệt đối không sử dụng Dữ liệu của bạn để tự huấn luyện.</span>
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] font-bold text-linear-text-muted uppercase tracking-widest relative z-10">
                      <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-cyan-500" /> Enterprise Privacy</span>
                      <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-cyan-500" /> AES-256 Encrypted</span>
                      <span className="flex items-center gap-1.5"><Server className="w-4 h-4 text-cyan-500" /> Zero Retention</span>
                    </div>
                  </motion.div>

                </div>
              </div>
            </div>
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
                <CinematicDebateMock onNext={() => {}} />
            </MockAppShell>
          </motion.div>
        )}

        {/* =========================================
            BODY: CONTENT DAILY
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
                initial={{ scale: 1, filter: 'blur(0px)', opacity: 1 }} animate={{ scale: 1.2, filter: 'blur(20px)', opacity: 0.5 }} transition={{ delay: 1.5, duration: 1, ease: "easeInOut" }}
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
                  initial={{ y: 800, scale: 0.5, rotateZ: -10 }} animate={{ y: 0, scale: 1, rotateZ: 0 }} transition={{ delay: 1.8, type: "spring", bounce: 0.3, duration: 1.2 }}
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
