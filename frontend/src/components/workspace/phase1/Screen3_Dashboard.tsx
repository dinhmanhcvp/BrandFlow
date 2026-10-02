"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Shield, ChevronRight, Activity, ArrowUpRight, Check, AlertTriangle, AlertCircle, EyeOff, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

import { useFormStore } from '@/store/useFormStore';

export default function Screen3_Dashboard({ onGoToHub, onGoToNext }: { onGoToHub: () => void, onGoToNext: () => void }) {
 const { t, language } = useLanguage();
 const intakeAnalysis = useFormStore(state => state.intakeAnalysis);
 const [loading, setLoading] = useState(true);
 const [loadingTextIndex, setLoadingTextIndex] = useState(0);
 const [isFocusExpanded, setIsFocusExpanded] = useState(false);

 const loadingTexts = [
 t('dashboard.loading1'),
 t('dashboard.loading2'),
 t('dashboard.loading3'),
 t('dashboard.loading4')
 ];

 useEffect(() => {
   let minTimePassed = false;
   const timer = setTimeout(() => { minTimePassed = true; }, 3500);

   const interval = setInterval(() => {
     setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
   }, 800);

   const isDemo = typeof window !== 'undefined' && (window as any).__DEMO_MODE__;
   const checkInterval = setInterval(() => {
     if ((minTimePassed && intakeAnalysis) || isDemo) {
       setLoading(false);
       clearInterval(checkInterval);
       clearInterval(interval);
     }
   }, 100);

   // Tự động thoát loading nếu quá 60s
   const timeoutFallback = setTimeout(() => {
     setLoading(false);
     clearInterval(checkInterval);
     clearInterval(interval);
   }, 60000);

   return () => {
     clearInterval(interval);
     clearInterval(checkInterval);
     clearTimeout(timer);
     clearTimeout(timeoutFallback);
   };
 }, [intakeAnalysis]);

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto text-center">
 <div className="relative w-24 h-24 mb-8">
 <div className="absolute inset-0 border-4 border-linear-border rounded-full"></div>
 <motion.div 
 animate={{ rotate: 360 }}
 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
 className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-cyan-400 rounded-full"
 ></motion.div>
 <div className="absolute inset-0 flex items-center justify-center">
 <Zap className="w-8 h-8 text-blue-600 animate-pulse" />
 </div>
 </div>
 <h2 className="text-xl font-bold text-foreground mb-2">{t('dashboard.loading_title')}</h2>
 <motion.p 
 key={loadingTextIndex}
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -5 }}
 className="text-sm font-bold text-cyan-400 tracking-widest uppercase"
 >
 {loadingTexts[loadingTextIndex]}
 </motion.p>
 </div>
 );
 }

 const audit = intakeAnalysis?.strategic_marketing_audit || {};
 const visualDNA = intakeAnalysis?.visual_brand_dna || {};
 const expertAnalysis = intakeAnalysis?.expert_business_analysis;
 
 const trustScore = audit.trust_score || 64;
 const competitivePositioning = audit.competitive_positioning || (language === 'vi' ? 'Mô hình F&B chất lượng cao hướng tới tệp khách hàng văn phòng (Corporate). Tuy nhiên, tỷ lệ giữ chân khách hàng (Retention Rate) đang ở mức báo động do trải nghiệm O2O chưa liền mạch. Ngân sách marketing đang bị lãng phí quá lớn vào các chiến dịch quảng cáo diện rộng (Broad Targeting) trên Facebook, dẫn đến chi phí CPA cao gấp nhiều lần so với giá trị trọn đời (LTV) của khách hàng.' : 'High-quality F&B model targeting Corporate customers. However, Retention Rate is at an alarming level due to inconsistent O2O experience. Marketing budget is heavily wasted on Broad Targeting Facebook ads, resulting in a CPA much higher than Customer Lifetime Value (LTV).');

 const visualArchetype = visualDNA.visual_archetype || (language === 'vi' ? 'Mộc mạc, Ấm cúng, Chuyên nghiệp' : 'Rustic, Cozy, Professional');
 const primaryColors = visualDNA.primary_colors || ["#0F172A", "#D97706", "#059669"];
 const moodboardKeywords = visualDNA.moodboard_keywords || ["Healthy", "Mindful", "Corporate Lunch", "Organic"];

 const weaknesses = audit.macro_environment_pestle?.slice(0, 2) || [
     language === 'vi' ? 'Cơ sở hạ tầng CRM yếu, chưa khai thác được dữ liệu khách hàng cũ' : 'Weak CRM infrastructure, unable to exploit existing customer data',
     language === 'vi' ? 'Trải nghiệm Offline tại quán và Online (Zalo OA) chưa đồng bộ' : 'Inconsistent Offline and Online (Zalo OA) experience'
 ];

 const radar2 = audit.core_competences?.slice(0, 2) || [
     language === 'vi' ? 'Cắt giảm 100% ngân sách Facebook Ads Broad' : 'Cut 100% of Broad Facebook Ads budget',
     language === 'vi' ? 'Triển khai chiến dịch thẻ thành viên Corporate' : 'Launch Corporate membership card campaign'
 ];

 const focusObjective = audit.marketing_objectives?.[0] || t('dashboard.focus_2');
 const allObjectives = audit.marketing_objectives || [focusObjective];

 // Mock Radar Data cho Bếp Nhà Mộc (Current vs Benchmark)
 const radarData = [
   { subject: language === 'vi' ? 'Chất lượng Lõi' : 'Core Product', current: 95, benchmark: 80, fullMark: 100 },
   { subject: language === 'vi' ? 'Trải nghiệm O2O' : 'O2O Experience', current: 30, benchmark: 85, fullMark: 100 },
   { subject: language === 'vi' ? 'Chiến lược Giá' : 'Pricing Strategy', current: 45, benchmark: 80, fullMark: 100 },
   { subject: language === 'vi' ? 'Mức độ Phủ sóng' : 'Channel Reach', current: 40, benchmark: 75, fullMark: 100 },
   { subject: language === 'vi' ? 'Công suất Bàn' : 'Asset Utilization', current: 55, benchmark: 90, fullMark: 100 },
   { subject: language === 'vi' ? 'Khách Văn phòng' : 'Corporate Base', current: 35, benchmark: 80, fullMark: 100 },
 ];

 return (
 <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-[#0B1120] relative">
 {/* Enhance Visuals: Background Ambient Glows */}
 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none z-0" />
 <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0" />

 <div className="flex flex-col w-full max-w-5xl mx-auto p-8 min-h-full relative z-10">
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-10"
 >
 <div className="inline-flex items-center px-4 py-2 rounded-full border border-linear-border bg-linear-surface/50 backdrop-blur-sm mb-4 shadow-sm">
 <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse mr-3 shrink-0" />
 <span className="text-xs font-semibold text-foreground tracking-wide uppercase">AI Research Completed</span>
 </div>
 <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
 {language === 'vi' ? 'Phân tích' : 'Brand'}{' '}
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
 {language === 'vi' ? 'DNA' : 'DNA'}
 </span>
 </h2>
 <p className="text-linear-text-muted text-lg max-w-2xl">{t('dashboard.desc')}</p>
 </motion.div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
 {/* Module 1: Sức Khỏe Thương hiệu (Hero Scorecard) */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.1 }}
 className="md:col-span-3 bento-card p-8 flex flex-col md:flex-row items-start md:items-center gap-10 bg-gradient-to-br from-slate-900 via-[#0B1120] to-[#0a192f] border border-cyan-500/20 relative overflow-hidden"
 >
 {/* Background effects */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
 <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />

 {/* Score Circle */}
 <div className="relative w-48 h-48 flex items-center justify-center shrink-0 mx-auto md:mx-0">
 <svg className="absolute inset-0 w-full h-full -rotate-90 filter drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
 <circle cx="96" cy="96" r="86" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
 <motion.circle 
 cx="96" cy="96" r="86" 
 fill="none" 
 stroke="url(#scoreGradient)" 
 strokeWidth="12" 
 strokeDasharray="540"
 initial={{ strokeDashoffset: 540 }}
 animate={{ strokeDashoffset: 540 - (540 * trustScore) / 100 }}
 transition={{ duration: 2, ease: "easeOut" }}
 strokeLinecap="round"
 />
 <defs>
 <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" stopColor="#06b6d4" />
 <stop offset="100%" stopColor="#3b82f6" />
 </linearGradient>
 </defs>
 </svg>
 <div className="text-center absolute">
 <span className="block text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-cyan-200">{trustScore}</span>
 <span className="text-[11px] uppercase font-bold text-cyan-400 tracking-[0.2em] mt-1 block">{t('dashboard.score')}</span>
 </div>
 </div>

 {/* Details */}
 <div className="flex-1 w-full relative z-10">
 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
 <div>
 <h3 className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-1">{language === 'vi' ? 'Thực trạng Doanh thu & Cạnh tranh' : 'Revenue & Market Reality'}</h3>
 <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight">Bếp Nhà Mộc <span className="text-slate-500 font-normal">| Corporate F&B</span></h4>
 </div>
 <div className="px-4 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-2 shrink-0">
 <Activity className="w-3.5 h-3.5" /> High Risk
 </div>
 </div>
 
 <p className="text-base text-slate-300 leading-relaxed font-medium mb-8 max-w-3xl">
 {competitivePositioning}
 </p>

 {/* Mini Metrics Grid */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {[
 { label: 'LTV : CAC', value: '1.2x', desc: 'Dưới mức an toàn (3x)', color: 'text-red-400', bg: 'bg-red-500/5', border: 'border-red-500/20' },
 { label: 'Churn Rate', value: '68%', desc: 'Tệp khách Corporate', color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/20' },
 { label: 'Wasted OPEX', value: '45%', desc: 'Facebook Ads Broad', color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/20' },
 { label: 'Market Share', value: '2.4%', desc: 'Bán kính 3km', color: 'text-cyan-400', bg: 'bg-cyan-500/5', border: 'border-cyan-500/20' },
 ].map((metric, idx) => (
 <div key={idx} className={cn("p-4 rounded-2xl border backdrop-blur-sm transition-all hover:-translate-y-1", metric.bg, metric.border)}>
 <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-2">{metric.label}</div>
 <div className={cn("text-3xl font-black mb-1", metric.color)}>{metric.value}</div>
 <div className={cn("text-[10px] font-medium opacity-80", metric.color)}>{metric.desc}</div>
 </div>
 ))}
 </div>
 </div>
 </motion.div>

 {/* Module 2: Visual Brand DNA */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.2 }}
 className="bento-card p-6 border-linear-border"
 >
 <h3 className="text-xs font-bold text-linear-text-muted uppercase tracking-widest mb-4">🎨 Visual Brand DNA</h3>
 <div className="flex items-center mb-6">
 <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mr-4 shadow-sm border border-orange-100">
 <Shield className="w-6 h-6 text-orange-600" />
 </div>
 <div>
 <p className="text-lg font-bold text-foreground">{visualArchetype}</p>
 <p className="text-xs text-linear-text-muted">{language === 'vi' ? 'Khung thiết kế (Archetype)' : 'Archetype'}</p>
 </div>
 </div>
 
 <div className="mb-4">
 <p className="text-[10px] text-linear-text-muted font-bold uppercase tracking-wider mb-2">{language === 'vi' ? 'Bảng màu đề xuất' : 'Suggested Palette'}</p>
 <div className="flex space-x-2">
 {primaryColors.map((color: string, idx: number) => {
   const hexColor = color.split(' ')[0];
   return (
    <div key={idx} className="w-8 h-8 rounded-full border border-linear-border shadow-sm flex items-center justify-center relative group cursor-pointer" style={{ backgroundColor: hexColor }}>
      <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-slate-800 text-white font-medium px-2 py-1 rounded absolute -top-8 whitespace-nowrap shadow-md z-20 pointer-events-none transition-opacity">{color}</span>
    </div>
   );
 })}
 </div>
 </div>
 
 <div className="space-y-2 flex flex-wrap gap-2">
 {moodboardKeywords.map((kw: string, idx: number) => (
   <span key={idx} className="inline-block px-3 py-1 bg-linear-surface border border-linear-border rounded-full text-xs font-medium text-linear-text-muted shadow-sm">{kw}</span>
 ))}
 </div>
 </motion.div>

 {/* Module 3: Opportunities & Refinements */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.3 }}
 className="bento-card p-6 border-linear-border flex flex-col"
 >
 <h3 className="text-xs font-bold text-linear-text-muted uppercase tracking-widest mb-4">🔍 {language === 'vi' ? 'Năng lực Cốt lõi (VRIO Analysis)' : 'Market Audit'}</h3>
 
 {/* Recharts Radar Chart */}
 <div className="w-full h-48 mb-6 -ml-2">
   <ResponsiveContainer width="100%" height="100%">
     <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
       <PolarGrid stroke="#334155" opacity={0.3} />
       <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 'bold' }} />
       <RechartsTooltip 
         contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
         itemStyle={{ color: '#e2e8f0' }}
       />
       <Radar name={language === 'vi' ? 'Hiện tại' : 'Current'} dataKey="current" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
       <Radar name={language === 'vi' ? 'Tiêu chuẩn ngành' : 'Benchmark'} dataKey="benchmark" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeDasharray="3 3" />
     </RadarChart>
   </ResponsiveContainer>
 </div>
 
 <div className="mb-4">
 <h4 className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-2">{language === 'vi' ? 'Điểm chưa hoàn thiện (Weaknesses)' : 'Areas for Refinement'}</h4>
 <ul className="space-y-2">
 {weaknesses.map((w: string, idx: number) => (
   <li key={idx} className="flex items-start text-sm text-foreground"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 mr-2 shrink-0"></div> {w}</li>
 ))}
 </ul>
 </div>
 
 <div>
 <h4 className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-2">{language === 'vi' ? 'Khuyến nghị Định hướng' : t('dashboard.radar_2')}</h4>
 <ul className="space-y-2">
 {radar2.map((r: string, idx: number) => (
   <li key={idx} className="flex items-start text-sm text-foreground"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 mr-2 shrink-0"></div> {r}</li>
 ))}
 </ul>
 </div>
 </motion.div>

 {/* Module 4: 90-Day Focus */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4 }}
 className="bento-card p-6 border-linear-border relative overflow-hidden bg-background cursor-pointer hover:border-blue-400 transition-colors"
 onClick={() => setIsFocusExpanded(!isFocusExpanded)}
 >
 <h3 className="text-xs font-bold text-linear-text-muted uppercase tracking-widest mb-4 flex justify-between items-center">
   <span>{t('dashboard.focus')}</span>
   <span className="text-[10px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">{isFocusExpanded ? (language === 'vi' ? 'Thu gọn' : 'Collapse') : (language === 'vi' ? 'Xem chi tiết' : 'Expand')}</span>
 </h3>
 
 <div className="flex items-start mb-4 relative z-10 flex-col">
 <p className="text-sm font-bold text-foreground mb-2">{t('dashboard.focus_1')}</p>
 
 {!isFocusExpanded ? (
   <p className="text-[1.3rem] font-black text-blue-600 leading-snug line-clamp-2" title={focusObjective}>{focusObjective}</p>
 ) : (
   <div className="space-y-3 mt-2 w-full pb-4">
     {allObjectives.map((obj: string, i: number) => (
       <div key={i} className="flex items-start p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
         <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 mr-3">{i+1}</div>
         <p className="text-sm font-bold text-blue-800">{obj}</p>
       </div>
     ))}
   </div>
 )}
 
 {!isFocusExpanded && <Activity className="w-6 h-6 text-blue-600 opacity-50 absolute right-0 bottom-0 mb-1" />}
 </div>

 {/* Pure SVG Sparkline */}
 <div className="absolute bottom-0 left-0 w-full h-16 opacity-30 pointer-events-none">
 <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
 <motion.path 
 d="M0,30 L10,25 L20,28 L30,20 L40,22 L50,15 L60,18 L70,10 L80,12 L90,5 L100,2 L100,30 Z" 
 fill="url(#sparklineGradient)" 
 />
 <motion.path 
 d="M0,30 L10,25 L20,28 L30,20 L40,22 L50,15 L60,18 L70,10 L80,12 L90,5 L100,2" 
 fill="none" 
 stroke="#06b6d4" 
 strokeWidth="1.5"
 initial={{ pathLength: 0 }}
 animate={{ pathLength: 1 }}
 transition={{ duration: 1.5, ease: "easeOut" }}
 />
 <defs>
 <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
 <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
 </linearGradient>
 </defs>
 </svg>
 </div>
 </motion.div>
 
 {expertAnalysis && (
   <motion.div 
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: 0.45 }}
     className="md:col-span-3 bento-card p-6 md:p-8 border-linear-border bg-gradient-to-br from-slate-900 to-[#0F172A] text-white relative overflow-hidden shadow-2xl mt-4 rounded-3xl"
   >
     <div className="absolute top-0 right-0 p-8 opacity-5">
       <Activity className="w-64 h-64 text-cyan-400 -translate-y-10 translate-x-10" />
     </div>
     
     <div className="flex items-center justify-between mb-8 relative z-10 border-b border-slate-700/50 pb-4">
       <h3 className="text-lg font-black text-white flex items-center">
         <Zap className="w-6 h-6 mr-3 text-cyan-400" />
         {language === 'vi' ? 'Báo cáo Cấp bách từ Ban Chiến lược' : 'Expert Business Analysis'}
       </h3>
       <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full animate-pulse">High Priority</span>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-8">
       
       {/* Financial Health */}
       <div className="bg-slate-800/40 p-5 rounded-2xl border border-rose-500/20 hover:bg-slate-800/60 transition-colors group shadow-lg">
         <h4 className="text-xs text-rose-400 font-bold uppercase tracking-widest mb-3 flex items-center">
           <AlertTriangle className="w-4 h-4 mr-2" /> {language === 'vi' ? 'Sức khỏe Tài chính' : 'Financial Health'}
         </h4>
         <div className="text-sm text-slate-300 leading-relaxed">
           {expertAnalysis.financial_health.includes(':') ? (
             <>
               <strong className="text-white block mb-2 text-base group-hover:text-rose-300 transition-colors">{expertAnalysis.financial_health.split(':')[0]}</strong>
               <span className="opacity-90">{expertAnalysis.financial_health.split(':').slice(1).join(':').trim()}</span>
             </>
           ) : expertAnalysis.financial_health}
         </div>
       </div>

       {/* Operational Bottlenecks */}
       <div className="bg-slate-800/40 p-5 rounded-2xl border border-amber-500/20 hover:bg-slate-800/60 transition-colors group shadow-lg">
         <h4 className="text-xs text-amber-400 font-bold uppercase tracking-widest mb-3 flex items-center">
           <AlertCircle className="w-4 h-4 mr-2" /> {language === 'vi' ? 'Nút thắt Vận hành' : 'Operational Bottlenecks'}
         </h4>
         <div className="text-sm text-slate-300 leading-relaxed">
           {expertAnalysis.operational_bottlenecks.includes(':') ? (
             <>
               <strong className="text-white block mb-2 text-base group-hover:text-amber-300 transition-colors">{expertAnalysis.operational_bottlenecks.split(':')[0]}</strong>
               <span className="opacity-90">{expertAnalysis.operational_bottlenecks.split(':').slice(1).join(':').trim()}</span>
             </>
           ) : expertAnalysis.operational_bottlenecks}
         </div>
       </div>

       {/* Brand Equity */}
       <div className="bg-slate-800/40 p-5 rounded-2xl border border-purple-500/20 hover:bg-slate-800/60 transition-colors md:col-span-2 lg:col-span-1 group shadow-lg">
         <h4 className="text-xs text-purple-400 font-bold uppercase tracking-widest mb-3 flex items-center">
           <EyeOff className="w-4 h-4 mr-2" /> {language === 'vi' ? 'Định vị Thương hiệu' : 'Brand Equity'}
         </h4>
         <div className="text-sm text-slate-300 leading-relaxed">
           {expertAnalysis.brand_equity_assessment.includes(':') ? (
             <>
               <strong className="text-white block mb-2 text-base group-hover:text-purple-300 transition-colors">{expertAnalysis.brand_equity_assessment.split(':')[0]}</strong>
               <span className="opacity-90">{expertAnalysis.brand_equity_assessment.split(':').slice(1).join(':').trim()}</span>
             </>
           ) : expertAnalysis.brand_equity_assessment}
         </div>
       </div>
     </div>

     {/* Strategic Recommendation - Full Width */}
     <div className="p-6 bg-gradient-to-r from-blue-900/40 to-cyan-900/20 rounded-2xl border border-cyan-500/30 backdrop-blur-sm shadow-xl relative z-10">
       <h4 className="text-sm text-cyan-300 font-bold uppercase tracking-widest mb-4 flex items-center">
         <Lightbulb className="w-5 h-5 mr-2 text-cyan-400" /> {language === 'vi' ? 'Đề xuất Chiến lược Cấp bách' : 'Strategic Recommendation'}
       </h4>
       
       {expertAnalysis.strategic_recommendation.match(/(?=\d+\))/) ? (
         <div className="space-y-4">
           <strong className="text-white block text-sm opacity-90">{expertAnalysis.strategic_recommendation.split(/(?=\d+\))/)[0]}</strong>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {expertAnalysis.strategic_recommendation.split(/(?=\d+\))/).slice(1).map((item, idx) => (
               <div key={idx} className="flex items-start text-sm text-cyan-50 bg-cyan-950/50 p-4 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all hover:-translate-y-1 shadow-md">
                 <CheckCircle2 className="w-6 h-6 text-cyan-400 mr-3 shrink-0 mt-0.5" />
                 <span className="leading-relaxed font-medium">{item.replace(/^\d+\)\s*/, '')}</span>
               </div>
             ))}
           </div>
         </div>
       ) : (
         <p className="text-sm text-blue-50 font-medium leading-relaxed">{expertAnalysis.strategic_recommendation}</p>
       )}
     </div>

   </motion.div>
 )}

 </div>

 {/* Module 5: CTA */}
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.5 }}
 className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-8 pt-8 border-t border-linear-border/50"
 >
  <button 
  id='btn-next-phase3-dashboard' onClick={onGoToNext}
  className="group relative px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-1 w-full sm:w-auto justify-center overflow-hidden"
  >
  {/* Shine effect */}
  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
  <span className="relative z-10 flex items-center">
  🚀 {language === 'vi' ? 'Tiếp tục — Chọn Tính Năng' : 'Continue — Select Feature'} <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
  </span>
  </button>
 </motion.div>
 </div>
 </div>
 );
}
