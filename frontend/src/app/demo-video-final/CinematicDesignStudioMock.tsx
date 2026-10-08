"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Type, Layout, BookOpen, MonitorPlay, DownloadCloud, Link as LinkIcon, FileArchive, CheckCircle2, ImageIcon, Layers, Sparkles, TerminalSquare, Network, Briefcase, PlusSquare, MessageCircle, Info, Globe } from 'lucide-react';

const masterDNA = {
 brand_name: "Bếp Nhà Mộc",
 goal: "Bếp Nhà Mộc cung cấp các suất ăn văn phòng dựa trên triết lý Mindful Dining. Chúng tôi sử dụng thực phẩm sạch, hộp bã mía sinh học và hướng tới sự cân bằng thân-tâm-trí cho giới văn phòng.",
 industry: "Tiệc doanh nghiệp / F&B",
 core_usps: ["Thực đơn chữa lành", "Giao hỏa tốc 30p", "Bao bì xanh", "Không bột ngọt"],
 tone_of_voice: "The Caregiver"
};

const result = {
 logo_url: "/assets/bep-nha-moc/logo.jpg",
 banner_url: "/assets/bep-nha-moc/banner.jpg",
 avatar_url: "/assets/bep-nha-moc/avatar.jpg",
 guidelines: `BẾP NHÀ MỘC - BRAND GUIDELINES
1. Định vị: "Trạm sạc năng lượng cho dân văn phòng"
2. Tone of voice: Điềm tĩnh, thấu cảm, chữa lành (The Caregiver)
3. Pattern: Các đường cong mềm mại mô phỏng làn khói nóng và vân gỗ
4. Moodboard: Ấm áp, Mộc mạc, Thiên nhiên (Earth Tones)
5. Imagery: Ưu tiên ánh sáng hoàng hôn (Golden Hour) tạo cảm giác như bữa cơm nhà.`
};

export default function CinematicDesignStudioMock({ onNext }: { onNext: () => void }) {
 const [phase, setPhase] = useState(0);

 useEffect(() => {
  const timers = [
   setTimeout(() => setPhase(1), 500),  // Show Visuals Summary
   setTimeout(() => setPhase(2), 3000), // Scroll down to Logo & Colors
   setTimeout(() => setPhase(3), 6000), // Scroll down to Fanpage
   setTimeout(() => setPhase(4), 10000), // Switch to Case Study
   setTimeout(() => setPhase(5), 20000), // Switch to Deck Builder (Domino)
   setTimeout(() => setPhase(6), 28000), // Export Float
   setTimeout(() => setPhase(7), 31000), // Blackhole Suck-in
   setTimeout(() => onNext(), 34000),  // End
  ];
  return () => timers.forEach(clearTimeout);
 }, [onNext]);

 const activeTab = phase < 4 ? 'visuals' : phase < 5 ? 'case-study' : 'deck-builder';

 return (
  <div className="absolute inset-0 z-20 flex flex-col bg-transparent font-sans px-5 lg:px-6 py-5 overflow-hidden">
   
   {/* ─── ACTUAL DESIGN STUDIO UI WRAPPER ─── */}
   
   {/* HEADER */}
   <div className="mb-4 flex items-center justify-between shrink-0 z-30">
    <div className="flex items-center space-x-3 text-white">
     <div className="w-11 h-11 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
      <Palette className="w-5 h-5 text-cyan-500" />
     </div>
     <div>
      <h1 className="text-xl font-black tracking-tight">Design Studio</h1>
      <p className="text-slate-400 text-[11px]">AI-powered Visual Identity · Case Study · Brand Deck</p>
     </div>
    </div>
    
    {/* TABS */}
    <div className="flex bg-slate-800/50 border border-slate-700/50 rounded-xl p-1 gap-0.5">
      <button className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'visuals' ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
       <ImageIcon className="w-3.5 h-3.5" /> Visuals
      </button>
      <button className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'case-study' ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
       <Layers className="w-3.5 h-3.5" /> Case Study
      </button>
      <button className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'deck-builder' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
       <Sparkles className="w-3.5 h-3.5" /> Brand Deck
      </button>
    </div>
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 pb-2 z-30">
    
    {/* LEFT COLUMN: Control Panel */}
    <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden opacity-80 pointer-events-none">
     <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 flex flex-col shrink-0">
      <div className="flex items-center mb-4 pb-2.5 border-b border-slate-700">
       <Network className="w-4 h-4 mr-2 text-indigo-400" />
       <h2 className="text-xs font-bold text-white uppercase tracking-wider">DNA Sync</h2>
      </div>
      <div className="space-y-3">
       <div>
        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Brand Name</div>
        <div className="text-sm font-semibold text-white bg-slate-900 px-3 py-2 rounded-md">Bếp Nhà Mộc</div>
       </div>
       <div>
        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Target Audience</div>
        <div className="text-sm font-semibold text-white bg-slate-900 px-3 py-2 rounded-md">Dân văn phòng (Gen Z, Millennials)</div>
       </div>
       <div>
        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Brand Personality</div>
        <div className="text-sm font-semibold text-white bg-slate-900 px-3 py-2 rounded-md border border-emerald-500/30 text-emerald-400">The Caregiver (Mộc mạc, chữa lành)</div>
       </div>
      </div>
     </div>
     
     <div className="mt-2">
       <div className="text-[9px] font-bold text-cyan-400 uppercase mb-2">Custom Prompt</div>
       <textarea disabled className="w-full bg-slate-900 p-2.5 rounded-lg border border-cyan-500/20 text-xs text-white h-20 placeholder-slate-500" value="Màu xanh chủ đạo, phong cách tối giản, nhấn mạnh vào chất liệu thiên nhiên và sức khỏe." />
     </div>

     <button className="mt-4 w-full py-3 rounded-xl flex items-center justify-center font-bold text-white text-sm bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/10 opacity-50">
      Design Completed
     </button>
    </div>

    {/* CENTER COLUMN: CANVAS */}
    <div className="lg:col-span-6 flex flex-col overflow-hidden relative rounded-xl border border-slate-700/50 bg-white dark:bg-[#18191A] backdrop-blur-md">
      
      {/* TAB: VISUALS (Phases 1-3) */}
      <AnimatePresence>
       {activeTab === 'visuals' && (
        <motion.div 
         initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }}
         className="absolute inset-0 overflow-y-auto no-scrollbar flex flex-col p-4 gap-6"
        >
         <motion.div 
          animate={{ y: phase === 1 ? 0 : phase === 2 ? -200 : -600 }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="flex flex-col gap-6"
         >
           {/* Executive Identity Summary */}
           <motion.div initial={{ opacity: 0, y: 50 }} animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0 }} className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden shrink-0">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-cyan-300 mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Brand Identity Protocol
             </div>
             <h2 className="text-3xl font-black mb-3 tracking-tight">{masterDNA.brand_name}</h2>
             <p className="text-sm text-slate-300 font-light leading-relaxed mb-6">
              Thiết kế nhận diện được xây dựng trên triết lý <strong className="text-white font-medium">Mindful Dining</strong>. Chúng tôi kết hợp các sắc độ của thiên nhiên (Earth Tones) để mang lại cảm giác bình yên, xoa dịu áp lực (Burn-out) cho giới văn phòng.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-cyan-400 font-bold mb-1 flex items-center gap-2 text-sm"><Type className="w-3 h-3" /> Naming & Tone</h3>
                <p className="text-xs text-slate-300 leading-relaxed">Giọng điệu (Giọng điệu): Điềm tĩnh, thấu cảm, chuyên nghiệp.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-emerald-400 font-bold mb-1 flex items-center gap-2 text-sm"><ImageIcon className="w-3 h-3" /> Cover Art</h3>
                <p className="text-xs text-slate-300 leading-relaxed">Hình ảnh mâm cơm gia đình với ánh sáng hoàng hôn ấm áp.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <h3 className="text-amber-400 font-bold mb-1 flex items-center gap-2 text-sm"><Briefcase className="w-3 h-3" /> Visual Anchor</h3>
                <p className="text-xs text-slate-300 leading-relaxed">Nét chữ thư pháp hiện đại kết hợp với icon Lá mầm xanh.</p>
              </div>
             </div>
           </motion.div>

           {/* Logo Display & Color System */}
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
              <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
               <div className="flex items-center font-bold text-xs text-slate-900 dark:text-white">Master Brand Logo</div>
               <span className="text-[9px] font-semibold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">Vector Approved</span>
              </div>
              <div className="aspect-[4/3] bg-slate-900 flex flex-col items-center justify-center p-6 relative">
               <img src={result.logo_url} alt="Logo" className="w-[60%] h-[60%] object-cover rounded-2xl shadow-2xl" />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 flex flex-col justify-center">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Color System</h3>
              <div className="space-y-3">
               {[
                { hex: "#064E3B", name: "Deep Forest", usage: "Primary Brand Color" },
                { hex: "#B45309", name: "Amber Wood", usage: "CTA & Accents" },
                { hex: "#FEF3C7", name: "Warm Cream", usage: "Backgrounds" }
               ].map(c => (
                <div key={c.hex} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg shadow-inner border border-black/5" style={{backgroundColor: c.hex}}></div>
                  <div>
                   <div className="font-bold text-xs text-slate-900 dark:text-white">{c.name}</div>
                   <div className="text-[10px] text-slate-500 font-mono">{c.hex} • {c.usage}</div>
                  </div>
                </div>
               ))}
              </div>
            </div>
           </motion.div>

           {/* High-Fidelity Mô phỏng Fanpage */}
           <motion.div initial={{ opacity: 0, y: 100 }} animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0 }} className="rounded-2xl overflow-hidden bg-[#F0F2F5] dark:bg-[#18191A] border border-slate-200 dark:border-slate-800 shadow-xl shrink-0">
             <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#242526] flex items-center">
              <div className="text-[#0866FF] text-xl font-black tracking-tighter mr-3 leading-none">facebook</div>
              <span className="text-slate-500 font-medium text-[10px]">Giao diện Nhận diện Kênh Social</span>
             </div>
             
             <div className="relative bg-white dark:bg-[#242526]">
              <div className="w-full h-[180px] relative overflow-hidden group">
               <img src={result.banner_url} alt="Cover" className="w-full h-full object-cover" />
              </div>
              
              <div className="px-6 -mt-10 relative z-10 flex flex-col items-start pb-4">
                <div className="flex w-full items-end">
                 <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#242526] overflow-hidden bg-white shadow-lg shrink-0">
                   <img src={result.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                 </div>
                 <div className="ml-4 flex-1 mb-1">
                   <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{masterDNA.brand_name}</h2>
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                   </div>
                   <div className="text-xs font-semibold text-slate-500 dark:text-[#B0B3B8]">124K người theo dõi</div>
                 </div>
                </div>
              </div>
             </div>

             <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-[#242526] p-4 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-800/50">
                <h3 className="font-bold text-sm text-black dark:text-white mb-2">Giới thiệu</h3>
                <p className="text-[11px] text-slate-600 dark:text-[#B0B3B8] leading-relaxed mb-3">{masterDNA.goal}</p>
                <div className="text-[11px] text-black dark:text-white font-medium flex items-center gap-2"><Info className="w-4 h-4 text-slate-400" /> Tiệc doanh nghiệp / F&B</div>
              </div>
              <div className="bg-white dark:bg-[#242526] p-4 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-800/50">
                <h3 className="font-bold text-sm text-black dark:text-white mb-2">Brand Guidelines</h3>
                <pre className="whitespace-pre-wrap font-sans text-[9px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                 {result.guidelines}
                </pre>
              </div>
             </div>
           </motion.div>
         </motion.div>
        </motion.div>
       )}
      </AnimatePresence>

      {/* TAB: CASE STUDY (Phase 4) */}
      <AnimatePresence>
       {activeTab === 'case-study' && (
        <motion.div 
         initial={{ opacity: 0, x: 200 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
         className="absolute inset-0 overflow-hidden flex flex-col bg-slate-50 dark:bg-slate-900"
        >
         <motion.div 
          initial={{ y: 0 }} animate={{ y: -800 }} transition={{ duration: 10, ease: "linear" }}
          className="flex flex-col w-full relative"
         >
           {/* Hero Block Behance */}
           <div className="w-full h-[350px] flex flex-col items-center justify-center relative p-10 overflow-hidden bg-[#064E3B]">
            <img src={result.banner_url} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
            <h1 className="text-5xl font-black text-white text-center z-10 tracking-tighter uppercase drop-shadow-2xl">{masterDNA.brand_name}</h1>
            <p className="text-lg text-white/90 mt-4 text-center z-10 font-light tracking-wide">Brand Identity & Tiệc doanh nghiệp</p>
           </div>

           {/* Mission Block */}
           <div className="py-16 px-10 bg-white dark:bg-slate-800 flex flex-col items-center">
            <div className="max-w-2xl w-full text-center">
             <h2 className="text-3xl font-black mb-6 tracking-tight text-[#064E3B]">The Mission</h2>
             <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-l-4 border-[#064E3B] pl-4 text-left">{masterDNA.goal}</p>
            </div>
           </div>

           {/* Palette Block */}
           <div className="py-16 px-10 bg-slate-50 dark:bg-slate-900 flex flex-col items-center">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight uppercase">Color Palette</h2>
            <div className="flex w-full max-w-2xl shadow-xl rounded-xl overflow-hidden h-40">
              <div className="flex-1 bg-[#064E3B] flex items-end p-3 text-white text-xs font-mono font-bold">#064E3B</div>
              <div className="flex-1 bg-[#B45309] flex items-end p-3 text-white text-xs font-mono font-bold">#B45309</div>
              <div className="flex-1 bg-[#FEF3C7] flex items-end p-3 text-slate-900 text-xs font-mono font-bold">#FEF3C7</div>
            </div>
           </div>

           {/* Typography Block */}
           <div className="py-16 px-10 bg-white dark:bg-slate-800 flex flex-col items-center h-[400px]">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 tracking-tight uppercase">Typography System</h2>
            <div className="w-full max-w-2xl flex items-center justify-between">
              <div>
               <div className="text-6xl font-[Playfair_Display] font-bold text-slate-900 dark:text-white mb-2">Aa</div>
               <div className="text-sm font-bold text-slate-500">Playfair Display (Headings)</div>
              </div>
              <div>
               <div className="text-5xl font-sans font-medium text-slate-900 dark:text-white mb-2">Aa</div>
               <div className="text-sm font-bold text-slate-500">Roboto (Body Text)</div>
              </div>
            </div>
           </div>
         </motion.div>
        </motion.div>
       )}
      </AnimatePresence>

      {/* TAB: DECK BUILDER (Phase 5) */}
      <AnimatePresence>
       {activeTab === 'deck-builder' && (
        <motion.div 
         initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
         className="absolute inset-0 flex items-center justify-center bg-slate-900 p-6"
        >
         <div className="w-full z-30 grid grid-cols-4 gap-3 perspective-[1000px]">
          {Array.from({ length: 8 }).map((_, i) => (
           <motion.div
            key={i}
            initial={{ rotateY: 180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
            className="aspect-[4/3] bg-slate-800 rounded-lg shadow-xl relative overflow-hidden"
            style={{ transformStyle: "preserve-3d" }}
           >
            <div className="absolute inset-0 bg-white backface-hidden" style={{ transform: "rotateY(180deg)" }} />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1b26] to-[#0d1017] border border-amber-500/20 p-3 flex flex-col backface-hidden">
             <div className="text-[9px] font-bold text-amber-500 mb-2">{['COVER', 'PROBLEM', 'SOLUTION', 'MARKET', 'MODEL', 'TRACTION', 'TEAM', 'FUNDING'][i]}</div>
             <div className="flex-1 flex flex-col gap-1.5 mt-2">
              <div className="w-full h-1.5 bg-slate-700 rounded-full" />
              <div className="w-3/4 h-1.5 bg-slate-700 rounded-full" />
              <div className="mt-auto w-full aspect-video bg-white/5 rounded border border-white/10" />
             </div>
            </div>
           </motion.div>
          ))}
         </div>
        </motion.div>
       )}
      </AnimatePresence>

    </div>

    {/* RIGHT COLUMN: Trợ lý AI Logs */}
    <div className="lg:col-span-3 flex flex-col gap-4 overflow-hidden">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl flex flex-col flex-1 relative overflow-hidden">
       <div className="p-3.5 border-b border-slate-700 flex justify-between items-center bg-slate-900/80 backdrop-blur-md shrink-0">
         <div className="flex items-center">
          <TerminalSquare className="w-3.5 h-3.5 text-cyan-500 mr-2" />
          <h4 className="font-bold text-xs text-white tracking-wide">Trợ lý AI Logs</h4>
         </div>
         <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
         </div>
       </div>

       <div className="flex-1 p-4 flex flex-col relative gap-3 font-mono text-[10px]">
         <motion.div initial={{ opacity: 0, x: 20 }} animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0 }} className="text-cyan-400">
          [System] Kích hoạt mạng lưới thiết kế...
         </motion.div>
         <motion.div initial={{ opacity: 0, x: 20 }} animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0 }} transition={{ delay: 0.5 }} className="text-slate-300">
          [Trợ lý AI Sáng tạo] Trích xuất Giao thức Nhận diện Thương hiệu.
         </motion.div>
         <motion.div initial={{ opacity: 0, x: 20 }} animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0 }} className="text-emerald-400">
          [Trợ lý AI Bố cục] Khởi tạo Hệ thống Logo & Màu sắc...
         </motion.div>
         <motion.div initial={{ opacity: 0, x: 20 }} animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0 }} className="text-amber-400">
          [Trợ lý Mạng xã hội] Kết xuất Mô phỏng Fanpage độ phân giải cao...
         </motion.div>
         <motion.div initial={{ opacity: 0, x: 20 }} animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0 }} className="text-cyan-400">
          [Trợ lý AI Behance] Biên dịch bố cục Case Study...
         </motion.div>
         <motion.div initial={{ opacity: 0, x: 20 }} animate={phase >= 5 ? { opacity: 1, x: 0 } : { opacity: 0 }} className="text-white bg-green-500/20 px-2 py-1 rounded border border-green-500/30 mt-2">
          [Trợ lý AI Thuyết trình] Tạo Pitch Deck 8 trang hoàn tất!
         </motion.div>
       </div>
      </div>
    </div>

   </div>

   {/* PHASE 6 & 7: The Climax (Suck-in Blackhole) OVERLAYS EVERYTHING */}
   <AnimatePresence>
    {phase >= 6 && (
     <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      
      {/* The 4 Floating Artifacts */}
      <motion.div
       initial={{ opacity: 0, scale: 0.8 }}
       animate={phase === 6 ? { opacity: 1, scale: 1, y: [0, -15, 10, 0] } : { opacity: 0, scale: 0, x: 0, y: 0, rotate: 180 }}
       transition={phase === 6 ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.8, ease: "easeIn" }}
       className="absolute flex flex-wrap justify-center gap-8 w-[800px]"
      >
       {[Palette, Layout, BookOpen, MonitorPlay].map((Icon, i) => (
        <div key={i} className="w-40 h-40 bg-[#1a1b26]/90 border border-emerald-500/30 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.2)] flex flex-col items-center justify-center gap-4">
         <Icon className="w-12 h-12 text-emerald-400" />
         <span className="text-xs font-bold text-slate-300">TÀI SẢN 0{i + 1}</span>
        </div>
       ))}
      </motion.div>

      {/* Export Button -> Blackhole */}
      {phase === 6 && (
       <motion.button
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 200 }}
        exit={{ scale: 0 }}
        className="absolute px-8 py-4 bg-emerald-600 text-white font-black text-xl rounded-full shadow-[0_0_50px_rgba(16,185,129,0.8)] flex items-center gap-3 hover:scale-105"
       >
        <DownloadCloud className="w-6 h-6" /> XUẤT GIAO CHO KHÁCH HÀNG
       </motion.button>
      )}

      {/* Blackhole Burst & ZIP Result */}
      {phase >= 7 && (
       <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 5, 1], rotate: 360 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute z-[110] flex flex-col items-center"
       >
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-700 shadow-[0_0_100px_rgba(16,185,129,1)] flex items-center justify-center border-4 border-white/20 mb-6">
         <FileArchive className="w-16 h-16 text-white" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full font-bold">
         <CheckCircle2 className="w-5 h-5" /> Packaged Successfully
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7 }} className="text-slate-300 mt-3 font-mono text-sm underline">
         brandflow.ai/shared/bep-nha-moc-assets
        </motion.p>
       </motion.div>
      )}

     </div>
    )}
   </AnimatePresence>

  </div>
 );
}
