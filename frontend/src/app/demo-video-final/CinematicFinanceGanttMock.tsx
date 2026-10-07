"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PastelTable from '@/components/b2b/PastelTable';
import { RationaleTooltip } from '@/components/ui/RationaleTooltip';
import { ArrowRight, Sparkles, Wand2 } from 'lucide-react';

// Data for PnL
const getRowStyle = (itemName: string) => {
  if (!itemName) return '';
  if (itemName.includes('Doanh thu thuần') || itemName.includes('Lợi nhuận gộp') || itemName.includes('Lợi nhuận hoạt động')) {
    return 'font-bold text-foreground bg-slate-100 dark:bg-slate-800/80';
  }
  if (itemName.startsWith('(-)')) {
    return 'text-rose-600 dark:text-rose-400 pl-4';
  }
  return '';
};

const PNL_DATA = [
  { item: 'Doanh thu thuần', val: '600,000,000', ratio: '100%', rationale: "Ước tính doanh thu dựa trên số lượng đơn hàng trưa/tháng." },
  { item: '(-) Giá vốn hàng bán (COGS)', val: '-528,000,000', ratio: '88%', rationale: "Chi phí nguyên vật liệu, hộp bã mía..." },
  { item: 'Lợi nhuận gộp', val: '72,000,000', ratio: '12%', rationale: "Biên lợi nhuận 12% theo định vị chất lượng." },
  { item: '(-) Chi phí Marketing', val: '-25,000,000', ratio: '4.1%', rationale: "Ngân sách khả dụng chạy chiến dịch." },
  { item: 'Lợi nhuận hoạt động (EBIT)', val: '47,000,000', ratio: '7.8%', rationale: "Lợi nhuận gộp trừ đi CP Marketing." },
];

const COLUMNS_PNL = [
  { key: 'item', header: 'Hạng mục Tài chính', className: 'bg-linear-surface font-medium text-linear-text-muted',
    render: (row: any) => (
      <div className={`flex items-center justify-between py-1 ${getRowStyle(row.item)}`}>
        <span>{row.item}</span>
        {row.rationale && (
          <RationaleTooltip rationale={row.rationale} type="rationale">
            <span className="sr-only">Why</span>
          </RationaleTooltip>
        )}
      </div>
    )
  },
  { key: 'val', header: 'Giá trị (VNĐ)', align: 'right' as const, className: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-x border-white dark:border-slate-800',
    render: (row: any) => (
      <span className={getRowStyle(row.item)}>{row.val}</span>
    )
  },
  { key: 'ratio', header: 'Tỷ lệ (% Doanh thu)', align: 'center' as const, className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted',
    render: (row: any) => (
      <div className={`flex items-center justify-between ${getRowStyle(row.item)}`}>
        <span>{row.ratio}</span>
        {row.rationale && (
          <RationaleTooltip rationale={row.rationale} type="source">
            <span className="sr-only">Why</span>
          </RationaleTooltip>
        )}
      </div>
    )
  },
];

// Data for Gantt
const GANTT_DATA = [
  { name: 'On-air chiến dịch "Combo Chữa Lành"', t8: true, t9: true, t10: false, t11: false, t12: false, rationale: "Giai đoạn đầu đẩy mạnh awareness." },
  { name: 'Khuyến mãi: Tặng canh chua sườn non', t8: true, t9: true, t10: true, t11: false, t12: false, rationale: "Tăng tỷ lệ chốt đơn." },
  { name: 'Zalo Broadcast ưu đãi dân văn phòng', t8: true, t9: true, t10: true, t11: true, t12: false, rationale: "Tương tác và giữ chân khách hàng cũ." },
  { name: 'TikTok Video ASMR Review Đồ ăn', t8: false, t9: true, t10: true, t11: true, t12: true, rationale: "Bắt trend thu hút giới trẻ." },
];

const COLUMNS_GANTT = [
  { key: 'name', header: 'Chiến dịch / Hành động', className: 'bg-linear-surface font-medium text-foreground', width: '250px',
    render: (row: any) => (
      <div className="flex items-center justify-between">
        <span>{row.name}</span>
        {row.rationale && (
          <RationaleTooltip rationale={row.rationale} type="rationale">
            <span className="sr-only">Why</span>
          </RationaleTooltip>
        )}
      </div>
    )
  },
  { key: 't8', header: 'Tháng 1', align: 'center' as const, render: (r: any) => r.t8 ? <motion.div initial={{ width: 0 }} animate={{ width: '105%' }} transition={{ duration: 1 }} className="h-8 -ml-[2.5%] bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)] rounded-l-full"></motion.div> : null, className: 'border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-0 overflow-hidden' },
  { key: 't9', header: 'Tháng 2', align: 'center' as const, render: (r: any) => r.t9 ? <motion.div initial={{ width: 0 }} animate={{ width: '105%' }} transition={{ duration: 1, delay: 0.2 }} className="h-8 -ml-[2.5%] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" style={{ borderTopLeftRadius: !r.t8 ? '9999px' : '0', borderBottomLeftRadius: !r.t8 ? '9999px' : '0' }}></motion.div> : null, className: 'border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-0 overflow-hidden' },
  { key: 't10', header: 'Tháng 3', align: 'center' as const, render: (r: any) => r.t10 ? <motion.div initial={{ width: 0 }} animate={{ width: '105%' }} transition={{ duration: 1, delay: 0.4 }} className="h-8 -ml-[2.5%] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"></motion.div> : null, className: 'border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-0 overflow-hidden' },
  { key: 't11', header: 'Tháng 4', align: 'center' as const, render: (r: any) => r.t11 ? <motion.div initial={{ width: 0 }} animate={{ width: '105%' }} transition={{ duration: 1, delay: 0.6 }} className="h-8 -ml-[2.5%] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"></motion.div> : null, className: 'border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-0 overflow-hidden' },
  { key: 't12', header: 'Tháng 5', align: 'center' as const, render: (r: any) => r.t12 ? <motion.div initial={{ width: 0 }} animate={{ width: '105%' }} transition={{ duration: 1, delay: 0.8 }} className="h-8 -ml-[2.5%] bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.4)] rounded-r-full"></motion.div> : null, className: 'border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-0 overflow-hidden' },
];

export default function CinematicFinanceGanttMock({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0); 
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000), // Show UI
      setTimeout(() => setStep(2), 2500), // Show Generate Effect
      setTimeout(() => setStep(3), 4000), // Render PnL Table
      setTimeout(() => setStep(4), 6000), // Render Gantt Table
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
        }
      }, 7000), // Auto scroll down
      setTimeout(() => setStep(5), 10000), // Processing Complete
      setTimeout(() => onNext(), 14000) // End scene
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-full w-full overflow-hidden bg-transparent relative z-10">
      
      {/* Sidebar Mock - EXACT replica of B2B App Shell Sidebar */}
      <div className="w-64 bg-[#0B1120]/50 backdrop-blur-md border-r border-slate-800 flex flex-col z-20 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 text-cyan-400 rounded-full border-2 border-cyan-400 flex items-center justify-center shrink-0">BF</div>
          <span className="font-space font-bold text-lg text-white">BrandFlow</span>
        </div>
        <div className="flex-1 px-4 space-y-2 mt-4 text-sm font-medium">
            <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
               <span className="w-5 h-5 block" /> Dashboard
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
               <span className="w-5 h-5 block" /> Data Ingestion
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
               <span className="w-5 h-5 block" /> AI Strategy
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
               <span className="w-5 h-5 block" /> Content Lab
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl transition-colors bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
               <span className="w-5 h-5 block border-2 border-cyan-400 rounded" /> Gantt & Finance
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-y-auto custom-scrollbar" ref={containerRef}>
        
        <div className="p-8 max-w-6xl mx-auto space-y-8 pb-32">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              Kế hoạch Tài chính & Lịch biểu
              {step >= 1 && step < 3 && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30 font-mono animate-pulse flex items-center gap-2"><Wand2 className="w-3 h-3" /> AI GENERATING...</motion.div>}
            </h1>
            <p className="text-linear-text-muted">Tổng hợp báo cáo Lãi Lỗ (P&L) và Biểu đồ Gantt dựa trên ngân sách 25,000,000 VNĐ.</p>
          </motion.div>

          <AnimatePresence>
            {step >= 2 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bento-card p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Báo cáo Lãi Lỗ Dự phóng (P&L)</h3>
                    <p className="text-xs text-linear-text-muted">Ước tính ROS và ROI theo mục tiêu doanh thu 600tr.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-cyan-500 tracking-widest uppercase mb-1">Dự phóng lợi nhuận</div>
                    <div className="text-2xl font-black text-white font-space">+47,000,000 <span className="text-sm text-slate-500">VNĐ</span></div>
                  </div>
                </div>
                
                {step >= 3 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <PastelTable columns={COLUMNS_PNL} data={PNL_DATA} />
                  </motion.div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center space-y-4 border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                    <Sparkles className="w-8 h-8 text-cyan-500 animate-spin" />
                    <p className="text-cyan-400 font-bold uppercase tracking-widest text-xs">AI Calculating Financials...</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step >= 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="bento-card p-6 overflow-x-auto">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-foreground">Bảng lập kế hoạch hoạt động (Gantt Chart)</h3>
                  <p className="text-xs text-linear-text-muted">Lịch biểu phân bổ ngân sách 25tr trực quan theo tháng.</p>
                </div>
                
                {step >= 4 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <PastelTable columns={COLUMNS_GANTT} data={GANTT_DATA} />
                  </motion.div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center space-y-4 border border-dashed border-slate-700 rounded-xl bg-slate-800/30">
                    <Sparkles className="w-8 h-8 text-emerald-500 animate-spin" />
                    <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">AI Scheduling Gantt Timeline...</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>

      {/* Cinematic Overlay texts explaining what is happening */}
      <AnimatePresence>
        {step >= 4 && (
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-linear-surface/90 backdrop-blur-xl px-8 py-4 rounded-2xl border border-linear-border shadow-2xl z-50"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          >
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 text-center tracking-wide uppercase">
              TỰ ĐỘNG LẬP LỊCH TRÌNH VÀ DỰ BÁO TÀI CHÍNH
            </h3>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
