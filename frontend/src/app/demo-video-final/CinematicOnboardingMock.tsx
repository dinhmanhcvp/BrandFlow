"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, UploadCloud, Link as LinkIcon, CheckCircle2, Bot, LayoutDashboard, Target } from 'lucide-react';

export default function CinematicOnboardingMock({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000), // Show upload zone selected
      setTimeout(() => setPhase(2), 2500), // File drags in
      setTimeout(() => setPhase(3), 3500), // File snaps to dropzone
      setTimeout(() => setPhase(4), 4500), // Dropzone glows/digests
      setTimeout(() => setPhase(5), 5500), // Screen shrinks & glitches
      setTimeout(() => setPhase(6), 6500), // Transforms into Brand DNA
      setTimeout(() => onNext(), 12000),   // End
    ];
    return () => timers.forEach(clearTimeout);
  }, [onNext]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center pt-24 bg-transparent overflow-hidden font-sans" ref={containerRef}>
      
      {/* ─── REAL WEB APP LAYOUT MOCK ─── */}
      <AnimatePresence>
        {phase < 5 && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            className="w-full max-w-5xl flex flex-col relative z-10"
          >
            {/* Header */}
            <div className="mb-10 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Cung cấp Dữ liệu Đầu vào</h1>
              <p className="text-slate-400">Chọn nguồn dữ liệu để AI phân tích DNA thương hiệu của bạn.</p>
            </div>

            {/* Source Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-6">
              {[
                { id: 'upload', icon: UploadCloud, title: 'Tài liệu (Files)', desc: 'Tải lên PDF, DOCX, CSV về sản phẩm, doanh số.', active: phase >= 1 },
                { id: 'web', icon: LinkIcon, title: 'Website / Social', desc: 'Cung cấp URL Fanpage, Website, Đối thủ.', active: false },
                { id: 'form', icon: FileText, title: 'Khảo sát (Form)', desc: 'Trả lời nhanh 5 câu hỏi để định hình chiến lược.', active: false },
              ].map(card => (
                <div key={card.id} className={`relative flex flex-col p-6 rounded-3xl border backdrop-blur-xl shadow-sm overflow-hidden transition-all duration-500 ${card.active ? "bg-cyan-500/10 border-cyan-500/50 scale-[1.02]" : "bg-slate-800/50 border-slate-700/50"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 z-10 ${card.active ? "bg-cyan-500/20 border border-cyan-500/30 text-cyan-400" : "bg-slate-800 border border-slate-700 text-slate-400"}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                  {card.active && <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-cyan-400" />}
                </div>
              ))}
            </div>

            {/* Upload Zone */}
            {phase >= 1 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="w-full px-6 overflow-visible relative">
                <motion.div 
                  animate={
                    phase === 3 ? { scale: 0.95, borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,0.1)' } : // Spring sink
                    phase === 4 ? { scale: 1, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)' } : // Success glow
                    { scale: 1 }
                  }
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-full border-2 border-dashed border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden"
                >
                  <UploadCloud className={`w-12 h-12 mb-4 ${phase >= 4 ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <p className="text-white font-bold mb-1">Thả file vào đây...</p>
                  <p className="text-xs text-slate-500">Hỗ trợ: PDF, DOCX, TXT, MD, CSV — tối đa 100MB/file</p>
                  
                  {/* Glowing success ring */}
                  {phase >= 4 && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 1 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1 }}
                      className="absolute inset-0 rounded-3xl border-4 border-emerald-400"
                    />
                  )}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── FAKE FLOATING FILE (MAGNETIC DROP) ─── */}
      <AnimatePresence>
        {phase >= 2 && phase < 4 && (
          <motion.div
            initial={{ x: 800, y: -400, rotate: 15, scale: 1.2 }}
            animate={
              phase === 3 
                ? { x: 0, y: 150, rotate: 0, scale: 1 } // Snap to center of dropzone
                : { x: 200, y: 0, rotate: 5, scale: 1.1 } // Hover over
            }
            exit={{ scale: 0, filter: "blur(10px)" }}
            transition={phase === 3 ? { type: "spring", stiffness: 400, damping: 20 } : { type: "tween", duration: 1, ease: "easeOut" }}
            className="absolute z-50 flex items-center gap-4 bg-slate-800 border border-slate-600 rounded-2xl p-4 shadow-2xl"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">bep_nha_moc_data.pdf</p>
              <p className="text-slate-400 text-xs">2.4 MB</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── BRAND DNA MORPH (Phase 6) ─── */}
      <AnimatePresence>
        {phase >= 6 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-transparent"
          >
            <div className="w-full max-w-6xl mx-auto px-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="w-full p-8 flex flex-col md:flex-row items-center gap-10 bg-slate-900 border border-emerald-500/30 rounded-3xl relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.1)]"
              >
                {/* Background effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px]" />

                {/* Score Circle */}
                <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                  <svg className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <circle cx="96" cy="96" r="86" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                    <motion.circle 
                      cx="96" cy="96" r="86" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="540"
                      initial={{ strokeDashoffset: 540 }} animate={{ strokeDashoffset: 540 - (540 * 85) / 100 }} transition={{ duration: 2, ease: "easeOut" }} strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-center absolute">
                    <span className="block text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-emerald-200">85</span>
                    <span className="text-[11px] uppercase font-bold text-emerald-400 tracking-[0.2em] mt-1 block">SỨC MẠNH DNA</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 w-full relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Thực trạng Doanh thu & Cạnh tranh</h3>
                      <h4 className="text-3xl font-black text-white tracking-tight">Bếp Nhà Mộc <span className="text-slate-500 font-normal">| Corporate F&B</span></h4>
                    </div>
                  </div>
                  
                  <p className="text-base text-slate-300 leading-relaxed font-medium mb-8 max-w-3xl">
                    Bếp Nhà Mộc sở hữu lợi thế lớn về chất lượng 'chuẩn cơm nhà', ít dầu mỡ. Tuy nhiên, quán đang rơi vào 'bẫy giá rẻ' (Price trap) khi phải cạnh tranh với hàng loạt quán cơm bình dân khác trên App.
                  </p>

                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'LTV : CAC', value: '1.2x', desc: 'Dưới mức an toàn', color: 'text-red-400', bg: 'bg-red-500/10' },
                      { label: 'Churn Rate', value: '68%', desc: 'Tệp khách Corporate', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                      { label: 'Wasted OPEX', value: '45%', desc: 'Facebook Ads', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                      { label: 'Market Share', value: '2.4%', desc: 'Bán kính 3km', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    ].map((m, idx) => (
                      <div key={idx} className={`p-4 rounded-2xl ${m.bg} border border-white/5`}>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">{m.label}</div>
                        <div className={`text-2xl font-black mb-1 ${m.color}`}>{m.value}</div>
                        <div className={`text-[10px] font-medium opacity-80 ${m.color}`}>{m.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
