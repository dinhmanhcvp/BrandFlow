"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Cpu, Layers } from 'lucide-react';

export default function VideoDemoPage() {
 return (
  <div className="p-8 w-full max-w-7xl mx-auto flex flex-col items-center">
   <div className="w-full mb-10">
    <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Platform Demo</h1>
    <p className="text-linear-text-muted">High-fidelity demonstration of BrandFlow AI Multi-Trợ lý AI architecture.</p>
   </div>

   <div className="w-full aspect-video bg-[#050505] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl flex items-center justify-center">
    <video 
      src="/videos/Brandflow_Final.mp4" 
      controls 
      className="w-full h-full"
    />
   </div>

   <div className="grid grid-cols-3 gap-6 w-full mt-12">
    {[
     { title: 'Intake & Strategy', time: '02:15', desc: 'Trợ lý AI phân tích thị trường & định vị' },
     { title: 'CFO Cross-Audit', time: '05:30', desc: 'Tranh biện tài chính và tối ưu ROI' },
     { title: 'Export Blueprint', time: '08:45', desc: 'Xuất báo cáo PDF & Dashboard GTM' }
    ].map((item, i) => (
     <div key={i} className="p-6 rounded-xl bg-[#0B1120]/50 border border-white/5 hover:border-cyan-500/30 hover:bg-[#0B1120] transition-all cursor-pointer">
      <div className="flex justify-between items-start mb-4">
       <h4 className="font-bold text-white tracking-tight">{item.title}</h4>
       <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">{item.time}</span>
      </div>
      <p className="text-sm text-linear-text-muted leading-relaxed">{item.desc}</p>
     </div>
    ))}
   </div>
  </div>
 );
}
