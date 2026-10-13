"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle, FileBarChart, Presentation, Mail, RefreshCw } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Phase7_Report({ onExport, onBack }: { onExport: () => void, onBack?: () => void }) {
 const { language } = useLanguage();
 const [step, setStep] = useState(0);

 useEffect(() => {
  // Luôn kích hoạt delay suy nghĩ AI tuần tự khi tổng hợp báo cáo
  const timers = [
   setTimeout(() => setStep(1), 600),
   setTimeout(() => setStep(2), 1400),
   setTimeout(() => setStep(3), 2200),
  ];
  return () => timers.forEach(clearTimeout);
 }, []);

 return (
  <div className="h-full w-full flex flex-col items-center justify-center p-6 z-10 relative">
   <div className="absolute top-6 left-6 z-20">
    <button 
     onClick={onBack} 
     className="px-5 py-2.5 rounded-lg border border-linear-border bg-linear-surface hover:bg-linear-surface/80 text-foreground font-bold transition-all shadow-sm flex items-center justify-center"
    >
     <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
     </svg> {language === 'vi' ? 'Quay lại' : 'Back'}
    </button>
   </div>
   <div className="max-w-2xl w-full text-center">
    <motion.div 
     initial={{scale: 0.8, opacity: 0}} 
     animate={{scale: 1, opacity: 1}} 
     className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30"
    >
     <CheckCircle className="w-12 h-12 text-white" />
    </motion.div>

    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">{language === 'vi' ? 'Kế Hoạch Tổng Thể Đã Sẵn Sàng' : 'Master Plan Generated'}</h2>
    <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 font-medium">
     BrandFlow has successfully analyzed Bếp Nhà Mộc's DNA, debated strategy, modeled financials, created brand assets, and deployed your custom AI agent.
    </p>

    
    {step < 3 && (
     <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-3 text-emerald-700 dark:text-emerald-300 font-bold text-sm animate-pulse">
      <RefreshCw className="w-5 h-5 animate-spin text-emerald-500 shrink-0" />
      <span>
       {step === 0 && "1/3. Đang xuất bản Pitch Deck 12 Slides Bếp Nhà Mộc..."}
       {step === 1 && "2/3. Đang tổng hợp báo cáo kiểm toán tài chính & chỉ số ROI 2.8x..."}
       {step === 2 && "3/3. Hoàn tất đóng gói toàn bộ hồ sơ chiến lược Master Plan!"}
      </span>
     </div>
    )}
<div className="grid grid-cols-3 gap-6 mb-12">
     {/* Action 1 */}
     <motion.div 
      initial={{y: 20, opacity: 0}} animate={step >= 1 ? {y: 0, opacity: 1} : {}} 
      className="bg-white/95 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-md hover:bg-slate-800 transition-all cursor-pointer group"
     >
      <Presentation className="w-8 h-8 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">Pitch Deck</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">12 Slides (PPTX)</p>
     </motion.div>

     {/* Action 2 */}
     <motion.div 
      initial={{y: 20, opacity: 0}} animate={step >= 2 ? {y: 0, opacity: 1} : {}} transition={{delay: 0.1}}
      onClick={onExport}
      id="btn-export-final"
      className="bg-gradient-to-b from-emerald-900/50 to-teal-900/50 p-6 rounded-2xl border border-emerald-500/30 hover:border-emerald-400/60 transition-all cursor-pointer group shadow-lg shadow-emerald-900/20"
     >
      <Download className="w-8 h-8 text-emerald-400 mx-auto mb-4 group-hover:-translate-y-1 transition-transform" />
      <h3 className="text-sm font-bold text-white mb-1">Executive Report</h3>
      <p className="text-xs text-emerald-500/70">Comprehensive PDF</p>
     </motion.div>

     {/* Action 3 */}
     <motion.div 
      initial={{y: 20, opacity: 0}} animate={step >= 3 ? {y: 0, opacity: 1} : {}} transition={{delay: 0.2}}
      className="bg-white/95 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-md hover:bg-slate-800 transition-all cursor-pointer group"
     >
      <Mail className="w-8 h-8 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-1">Email C-Level</h3>
      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Share via Outlook</p>
     </motion.div>
    </div>

   </div>
  </div>
 );
}
