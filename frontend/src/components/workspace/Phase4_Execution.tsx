"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Calculator, Download, CheckCircle, ArrowRight, Target, BarChart3, Users, Zap, Calendar, DollarSign, LayoutDashboard, Share2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export default function Phase4_Execution({ onBack, onNext }: { onBack: () => void, onNext?: () => void }) {
 const { language } = useLanguage();
 const [step, setStep] = useState(0); 
 const { brandDNA, wizardAnswers, businessIntent } = useFormStore();
 const isBepNhaMoc = brandDNA?.brand_name?.includes('Nhà Mộc') || wizardAnswers?.company_name?.includes('Nhà Mộc');

 let totalBudget = 500000000; 
 if (businessIntent?.mode === 'budget_first' && businessIntent?.budget) {
  totalBudget = businessIntent.budget;
 } else if (businessIntent?.mode === 'idea_first') {
  totalBudget = 300000000; 
 }

 const formatCurrency = (val: number) => {
  if (val >= 1000000000) return (val / 1000000000).toFixed(1) + ' Tỷ';
  if (val >= 1000000) return (val / 1000000).toFixed(0) + 'M';
  return val.toLocaleString() + 'đ';
 };

 const chartData = [
  { week: 'W1', reach: 50, conversion: 2, cpa: 45 },
  { week: 'W2', reach: 150, conversion: 10, cpa: 40 },
  { week: 'W3', reach: 300, conversion: 45, cpa: 35 },
  { week: 'W4', reach: 500, conversion: 80, cpa: 32 },
  { week: 'W5', reach: 800, conversion: 150, cpa: 30 },
  { week: 'W6', reach: 1200, conversion: 250, cpa: 28 },
  { week: 'W7', reach: 1500, conversion: 350, cpa: 25 },
  { week: 'W8', reach: 1800, conversion: 450, cpa: 22 },
 ];

 useEffect(() => {
  if (window && (window as any).__DEMO_MODE__) {
   const timers = [
    setTimeout(() => setStep(1), 500), 
    setTimeout(() => setStep(2), 1500), 
    setTimeout(() => setStep(3), 2500), 
   ];
   return () => timers.forEach(clearTimeout);
  } else {
   setStep(3);
  }
 }, []);

 const campaignPhases = [
  {
   id: "01",
   title: "Awareness & Teasing",
   duration: "Tuần 1 - 2",
   budget: "30% Ngân sách",
   budgetVal: `${formatCurrency(totalBudget * 0.3)} VNĐ`,
   color: "from-blue-500 to-cyan-400",
   bgLight: "bg-blue-500/10",
   borderLight: "border-blue-500/20",
   textLight: "text-blue-400",
   platforms: ["TikTok", "Facebook", "PR", "KOLs"],
   activities: [
    "Booking 10 Micro-KOLs (Vlog văn phòng, Food Review) trải nghiệm 'Cơm trưa chữa lành'.",
    "Lên 2 bài PR trên CafeF, Kênh14 về xu hướng Mindful Dining chống Food Coma.",
    "Chạy Ads Video ASMR chuẩn bị nguyên liệu sạch lúc 5h sáng."
   ],
   kpis: "Reach: 2M+ | Video Views: 500K+ | Cost per View: < 50đ",
   contentSync: "Tuyến bài: Đánh thức dân VP, POV deadline ngập đầu & Ăn trưa chánh niệm."
  },
  {
   id: "02",
   title: "Performance & Conversion",
   duration: "Tuần 3 - 6",
   budget: "50% Ngân sách",
   budgetVal: `${formatCurrency(totalBudget * 0.5)} VNĐ`,
   color: "from-amber-500 to-orange-500",
   bgLight: "bg-amber-500/10",
   borderLight: "border-amber-500/20",
   textLight: "text-amber-400",
   platforms: ["Facebook Ads", "Zalo Ads", "LinkedIn B2B"],
   activities: [
    "Chạy Ads Conversion đổ traffic về Zalo Mini App chốt đơn (Target: Toà nhà hạng A).",
    "LinkedIn InMail Campaign: Gửi package Tiệc doanh nghiệp dùng thử cho HR Managers.",
    "Tung mã ưu đãi TEAMMOC20 giảm 20% cho đơn nhóm trên 5 phần."
   ],
   kpis: "Đơn hàng: 15,000 | Hợp đồng B2B: 20 | CPA < 35K | ROAS: > 3.5",
   contentSync: "Tuyến bài: Cơm ngon chốt đơn lẹ, Review thực tế từ khách, Menu mỗi ngày."
  },
  {
   id: "03",
   title: "Retention & Loyalty",
   duration: "Tuần 7 - 8",
   budget: "20% Ngân sách",
   budgetVal: `${formatCurrency(totalBudget * 0.2)} VNĐ`,
   color: "from-emerald-500 to-teal-400",
   bgLight: "bg-emerald-500/10",
   borderLight: "border-emerald-500/20",
   textLight: "text-emerald-400",
   platforms: ["Zalo ZNS", "Email", "App Push"],
   activities: [
    "Gửi ZNS CSKH sau 3 ngày mua, tặng mã giảm giá cá nhân hoá.",
    "Phát hành thẻ thành viên thân thiết trên Zalo (Tích điểm đổi món).",
    "Chương trình 'Mời bạn mới - Nhận cơm ngon' trên app."
   ],
   kpis: "Retention Rate: > 45% | LTV Tăng 2.5x | Khách hàng giới thiệu: 15%",
   contentSync: "Tuyến bài: Câu chuyện nông trại, Tri ân khách hàng, Cập nhật menu mới."
  }
 ];

 return (
  <div className="h-full w-full flex flex-col p-6 max-w-[1600px] mx-auto z-10 relative overflow-y-auto no-scrollbar">
   {/* Header */}
   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
    <div>
     <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-3">
      <LayoutDashboard className="w-3.5 h-3.5" /> Campaign Master Plan
     </div>
     <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
      Kế Hoạch Thực Thi Tích Hợp (IMC)
     </h2>
     <p className="text-linear-text-muted mt-2 text-sm md:text-base max-w-2xl">
      Chiến dịch: <strong className="text-cyan-400 font-semibold">{isBepNhaMoc ? "Trạm Sạc Chữa Lành - Nạp Năng Lượng" : "Tăng Trưởng Đột Phá 2026"}</strong><br/>
      {businessIntent?.mode === 'idea_first' ? (
       <span className="text-emerald-400 font-medium">Đề xuất ngân sách tối ưu: {formatCurrency(totalBudget)} VNĐ dựa trên năng lực tài chính và Idea cung cấp.</span>
      ) : (
       <span className="text-blue-400 font-medium">Ngân sách triển khai: {formatCurrency(totalBudget)} VNĐ (Phân bổ tự động theo mục tiêu doanh nghiệp).</span>
      )}
      <br/>Kế hoạch phân bổ ngân sách, chiến thuật đa kênh và bộ KPI cam kết chi tiết. Dành cho C-Level Marketing duyệt.
     </p>
    </div>
    <div className="flex gap-3">
     <button 
      onClick={onBack} 
      className="px-5 py-2.5 rounded-xl border border-linear-border bg-linear-surface hover:bg-linear-surface/80 text-foreground font-bold transition-all shadow-sm flex items-center justify-center"
     >
      <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Quay lại
     </button>
     <button 
      onClick={onNext}
      className={`px-6 py-2.5 rounded-xl font-bold flex items-center transition-all ${step >= 3 ? 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/20' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
     >
      Sang Phase 5 <ArrowRight className="ml-2 w-4 h-4" />
     </button>
    </div>
   </div>

   <div className="flex flex-col xl:flex-row gap-6 pb-10">
    {/* Left: Detailed Campaign Phases */}
    <div className="flex-1 flex flex-col gap-5">
     <AnimatePresence>
      {step >= 1 && campaignPhases.map((phase, index) => (
       <motion.div 
        key={phase.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.2 }}
        className={`bg-linear-surface/60 backdrop-blur-md border border-linear-border rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-linear-border/80 transition-colors`}
       >
        {/* Phase Number Watermark */}
        <div className="absolute -right-6 -top-10 text-[120px] font-black text-slate-500/5 group-hover:text-slate-500/10 transition-colors pointer-events-none select-none">
         {phase.id}
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6">
         {/* Left Column: Info & Budget */}
         <div className="md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-linear-border/50 pb-4 md:pb-0 md:pr-6">
          <div>
           <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${phase.color}`} />
            <span className="text-xs font-bold text-linear-text-muted uppercase tracking-widest">{phase.duration}</span>
           </div>
           <h3 className="text-xl font-black text-foreground mb-4">{phase.title}</h3>
           
           <div className="flex flex-wrap gap-2 mb-6">
            {phase.platforms.map(p => (
             <span key={p} className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-md ${phase.bgLight} ${phase.textLight} border ${phase.borderLight}`}>
              {p}
             </span>
            ))}
           </div>
          </div>
          
          <div className="bg-background/50 rounded-xl p-4 border border-linear-border/50">
           <div className="text-[10px] font-bold text-linear-text-muted uppercase mb-1">Phân bổ ngân sách</div>
           <div className="text-2xl font-black text-foreground">{phase.budgetVal}</div>
           <div className="text-xs font-medium text-linear-text-muted mt-1">{phase.budget}</div>
          </div>
         </div>
         
         {/* Right Column: Execution Details */}
         <div className="md:w-2/3 flex flex-col justify-center space-y-4">
          
          <div>
           <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
            <Zap className={`w-4 h-4 ${phase.textLight}`} /> Hoạt động cốt lõi (Key Tactics)
           </h4>
           <ul className="space-y-2">
            {phase.activities.map((act, i) => (
             <li key={i} className="text-sm text-linear-text-muted flex items-start">
              <span className="mr-2 mt-1 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" /> {act}
             </li>
            ))}
           </ul>
          </div>
          
          <div className="pt-2 border-t border-linear-border/30 grid grid-cols-1 md:grid-cols-2 gap-4">
           <div>
            <h4 className="text-[11px] font-bold text-linear-text-muted uppercase mb-1.5 flex items-center gap-1.5">
             <Share2 className="w-3 h-3" /> Content Sync
            </h4>
            <p className="text-xs text-foreground font-medium">{phase.contentSync}</p>
           </div>
           <div>
            <h4 className="text-[11px] font-bold text-linear-text-muted uppercase mb-1.5 flex items-center gap-1.5">
             <Target className="w-3 h-3" /> KPIs Cam Kết
            </h4>
            <p className="text-xs text-foreground font-medium">{phase.kpis}</p>
           </div>
          </div>

         </div>
        </div>
       </motion.div>
      ))}
     </AnimatePresence>
    </div>

    {/* Right: P&L Chart & Export */}
    <div className="xl:w-[400px] flex flex-col gap-6 shrink-0">
     
     <AnimatePresence>
      {step >= 2 && (
       <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-linear-surface/60 backdrop-blur-md border border-linear-border rounded-3xl p-6 shadow-xl flex flex-col">
         <div className="flex items-center justify-between mb-6">
          <div>
           <h3 className="text-lg font-black text-foreground">Target P&L Secured</h3>
           <p className="text-xs text-linear-text-muted mt-0.5">Dự phóng hiệu quả chiến dịch 8 tuần</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
           <BarChart3 className="w-5 h-5 text-emerald-500" />
          </div>
         </div>
         
         <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-background/50 rounded-2xl p-4 border border-linear-border">
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3"/> Est. Revenue</p>
           <p className="text-xl font-black text-emerald-400">{isBepNhaMoc ? "2.5 Tỷ" : "1.8 Tỷ"}</p>
          </div>
          <div className="bg-background/50 rounded-2xl p-4 border border-linear-border">
           <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> CPA Target</p>
           <p className="text-xl font-black text-blue-400">{isBepNhaMoc ? "22K" : "35K"} VNĐ</p>
          </div>
         </div>
         
         <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
             <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
             </linearGradient>
             <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
             </linearGradient>
            </defs>
            <XAxis dataKey="week" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <RechartsTooltip 
             contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '12px', color: '#fff' }} 
             itemStyle={{ color: '#fff', fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="reach" name="Reach (K)" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorReach)" />
            <Area type="monotone" dataKey="conversion" name="Đơn hàng" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorConv)" />
           </AreaChart>
          </ResponsiveContainer>
         </div>
       </motion.div>
      )}
     </AnimatePresence>

     <AnimatePresence>
      {step >= 3 && (
       <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-orange-500/30 rounded-3xl p-6 shadow-xl flex items-center justify-between group hover:border-orange-500/50 cursor-pointer transition-colors relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/10 blur-[50px]" />
        <div className="flex items-center relative z-10">
         <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-orange-500/30 shrink-0">
          <FileText className="w-5 h-5 text-white" />
         </div>
         <div>
          <h4 className="text-base font-black text-foreground">Xuất Master Plan PDF</h4>
          <p className="text-xs text-linear-text-muted mt-0.5">Báo cáo C-Level • 45 Trang</p>
         </div>
        </div>
        <Download className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform relative z-10" />
       </motion.div>
      )}
     </AnimatePresence>

    </div>
   </div>
  </div>
 );
}
