"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Palette, FileText, Image as ImageIcon, Wand2, Type, Layout, RefreshCw } from 'lucide-react';

export default function Phase5_Creative({ onNext, onBack }: { onNext: () => void, onBack?: () => void }) {
 const { language } = useLanguage();
 const [step, setStep] = useState(0);

 useEffect(() => {
  // Luôn kích hoạt delay suy nghĩ AI tuần tự để tạo cảm giác chân thực
  const timers = [
   setTimeout(() => setStep(1), 600),
   setTimeout(() => setStep(2), 1400),
   setTimeout(() => setStep(3), 2200),
  ];
  return () => timers.forEach(clearTimeout);
 }, []);

 return (
  <div className="w-full min-h-full flex flex-col p-4 md:p-6 max-w-[90rem] mx-auto z-10 relative pb-16">
   <div className="flex justify-between items-center mb-6">
    <div>
     <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
      Creative & Design Studio
     </h2>
     <p className="text-linear-text-muted mt-1">Multi-modal content generation & brand identity</p>
    </div>
    <div className="flex gap-3">
     <button 
      onClick={onBack} 
      className="px-5 py-2.5 rounded-lg border border-linear-border bg-linear-surface hover:bg-linear-surface/80 text-foreground font-bold transition-all shadow-sm flex items-center justify-center"
     >
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg> {language === 'vi' ? 'Quay lại' : 'Back'}
     </button>
     <button 
      id="btn-next-phase5"
      onClick={onNext}
      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center group"
     >
      {language === 'vi' ? 'Triển khai Trợ lý AI Tùy chỉnh' : 'Deploy Custom Agent'}
      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
     </button>
    </div>
   </div>

   {/* ── Overview Alert Banner ── */}
   <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center text-blue-300 text-sm">
     <Wand2 className="w-5 h-5 mr-3 text-blue-400 shrink-0" />
     <span>
      <strong>{language === 'vi' ? 'Bản xem trước (Overview):' : 'Overview Preview:'}</strong> {language === 'vi' ? 'Đây là giao diện tổng quan về quá trình tự động sinh nội dung và thiết kế. Để chỉnh sửa chuyên sâu, vui lòng truy cập các phân hệ chuyên biệt.' : 'This is an aggregate overview of automated copywriting and visual generation. For in-depth editing, visit dedicated modules.'}
     </span>
    </div>
    <div className="flex gap-3 ml-4 shrink-0">
     <button onClick={() => window.location.href='/content-lab'} className="px-4 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 text-xs font-bold rounded-lg transition-colors flex items-center">
      <FileText className="w-3.5 h-3.5 mr-1.5" /> Content Lab
     </button>
     <button onClick={() => window.location.href='/design-studio'} className="px-4 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 text-xs font-bold rounded-lg transition-colors flex items-center">
      <Palette className="w-3.5 h-3.5 mr-1.5" /> Design Studio
     </button>
    </div>
   </motion.div>

   
   {step < 3 && (
    <div className="mb-6 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3 text-purple-700 dark:text-purple-300 font-bold text-sm animate-pulse">
     <RefreshCw className="w-5 h-5 animate-spin text-purple-500 shrink-0" />
     <span>
      {step === 0 && "1/3. AI Copywriter đang sáng tạo thông điệp truyền thông Bếp Nhà Mộc..."}
      {step === 1 && "2/3. AI Art Director đang trích xuất bảng màu di sản và moodboard mâm cơm..."}
      {step === 2 && "3/3. Hoàn tất bộ nhận diện đa phương tiện & Typography!"}
     </span>
    </div>
   )}
<div className="flex-1 grid grid-cols-12 gap-6">
    {/* Left: Copywriting Lab */}
    <div className="col-span-5 bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-md flex flex-col">
     <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-4 flex items-center">
      <FileText className="w-5 h-5 mr-2 text-pink-400" />
      Copywriting Lab
     </h3>
     
     <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
      {step >= 1 && (
       <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
        <div className="flex justify-between items-start mb-2">
         <span className="text-xs font-bold text-pink-400 uppercase tracking-wider bg-pink-500/10 px-2 py-1 rounded">Facebook Post</span>
         <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Target: Housewives, 25-45</span>
        </div>
        <p className="text-sm text-slate-800 dark:text-slate-300 leading-relaxed font-medium">
         "POV: 11h30 trưa sếp dí 3 deadline, bụng réo rắt. Bỏ lại ồn ào công sở, ghé Bếp Nhà Mộc thưởng thức niêu cơm thơm phức gạo ST25, cá kho tộ đậm vị mộc mạc..."
        </p>
        <div className="mt-3 flex gap-2">
         <span className="text-[10px] text-slate-500 border border-slate-600/50 px-2 py-0.5 rounded-full">#BepNhaMoc</span>
         <span className="text-[10px] text-slate-500 border border-slate-600/50 px-2 py-0.5 rounded-full">#ComNieuGiaDinh</span>
        </div>
       </motion.div>
      )}

      {step >= 2 && (
       <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
        <div className="flex justify-between items-start mb-2">
         <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-1 rounded">PR Article (Intro)</span>
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">Bếp Nhà Mộc - Bồi Giữ Giá Trị Truyền Thống Trong Từng Thớ Gỗ</h4>
        <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed font-medium">
         Trước làn sóng của hàng loạt xu hướng nội thất hiện đại, việc tìm về với thiên nhiên và những giá trị gốc rễ đang trở thành một sự lựa chọn...
        </p>
       </motion.div>
      )}
     </div>
    </div>

    {/* Right: Design Studio */}
    <div className="col-span-7 bg-white/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm shadow-md flex flex-col">
     <h3 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-6 flex items-center">
      <Palette className="w-5 h-5 mr-2 text-purple-400" />
      Brand Identity Generator
     </h3>

     <div className="grid grid-cols-2 gap-6">
      {/* Colors */}
      <div>
       <h4 className="text-sm font-bold text-slate-700 dark:text-slate-400 mb-3 flex items-center"><Palette className="w-4 h-4 mr-1.5"/> Color Palette</h4>
       {step >= 2 && (
        <div className="flex gap-3">
         {[
          { c: 'bg-[#5c4033]', n: 'Moc Brown' },
          { c: 'bg-[#8b5a2b]', n: 'Oak' },
          { c: 'bg-[#2e8b57]', n: 'Leaf Green' },
          { c: 'bg-[#f5f5dc]', n: 'Beige' },
         ].map((color, i) => (
          <motion.div 
           key={i} 
           initial={{scale:0, opacity:0}} animate={{scale:1, opacity:1}} transition={{delay: i*0.1}}
           className="group cursor-pointer"
          >
           <div className={`w-12 h-12 rounded-full ${color.c} shadow-lg ring-2 ring-white/10 group-hover:ring-white/30 transition-all`} />
           <p className="text-[10px] text-center mt-2 text-slate-500">{color.n}</p>
          </motion.div>
         ))}
        </div>
       )}
      </div>

      {/* Typography */}
      <div>
       <h4 className="text-sm font-bold text-slate-700 dark:text-slate-400 mb-3 flex items-center"><Type className="w-4 h-4 mr-1.5"/> Typography</h4>
       {step >= 3 && (
        <motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50">
         <div>
          <span className="text-[10px] text-slate-500 uppercase">Primary / Headings</span>
          <p className="text-2xl font-serif text-slate-900 dark:text-slate-200 font-bold">Playfair Display</p>
         </div>
         <div className="h-px w-full bg-slate-700/50" />
         <div>
          <span className="text-[10px] text-slate-500 uppercase">Secondary / Body</span>
          <p className="text-base font-sans text-slate-800 dark:text-slate-300 font-medium">Inter / Roboto</p>
         </div>
        </motion.div>
       )}
      </div>

      {/* Moodboard */}
      <div className="col-span-2 mt-2">
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-400 mb-3 flex items-center"><ImageIcon className="w-4 h-4 mr-1.5"/> Moodboard & Layouts</h4>
        {step >= 3 && (
         <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="grid grid-cols-3 gap-3">
          <div className="h-24 bg-slate-800 rounded-lg overflow-hidden relative group">
           <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-100 transition-all" style={{backgroundImage: "url('https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"}}></div>
          </div>
          <div className="h-24 bg-slate-800 rounded-lg overflow-hidden relative group">
           <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-100 transition-all" style={{backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"}}></div>
          </div>
          <div className="h-24 bg-slate-800 rounded-lg border border-dashed border-slate-600 flex items-center justify-center text-slate-500 text-xs">
           <Wand2 className="w-4 h-4 mr-1" /> Generating...
          </div>
         </motion.div>
        )}
      </div>

     </div>
    </div>
   </div>
  </div>
 );
}
