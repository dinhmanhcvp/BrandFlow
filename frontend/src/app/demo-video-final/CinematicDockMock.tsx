"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { 
 Database, MessagesSquare, CalendarDays, Edit3, 
 Paintbrush, BrainCircuit, LineChart, Network
} from 'lucide-react';

const MODULES = [
 { id: 'ingestion', icon: Database, label: "Data Ingestion", desc: "Thu thập & Phân tích Dữ liệu", color: "from-blue-500 to-indigo-600" },
 { id: 'dna', icon: Network, label: "Brand DNA", desc: "Định hình Cốt lõi", color: "from-cyan-400 to-blue-600" },
 { id: 'debate', icon: MessagesSquare, label: "AI Debate", desc: "Hội đồng Tranh biện", color: "from-purple-500 to-fuchsia-600" },
 { id: 'planning', icon: CalendarDays, label: "Gantt & Finance", desc: "Lập Kế hoạch", color: "from-emerald-400 to-green-600" },
 { id: 'content', icon: Edit3, label: "Content Lab", desc: "Sản xuất Nội dung", color: "from-amber-400 to-orange-500" },
 { id: 'design', icon: Paintbrush, label: "Design Studio", desc: "Thiết kế Hình ảnh", color: "from-pink-500 to-rose-600" },
 { id: 'agents', icon: BrainCircuit, label: "Trợ lý AI Builder", desc: "Trợ lý Chuyên biệt", color: "from-indigo-500 to-violet-600" },
 { id: 'analytics', icon: LineChart, label: "Analytics", desc: "Đo lường & Tối ưu", color: "from-rose-500 to-red-600" },
];

export default function CinematicDockMock({ onNext }: { onNext: () => void }) {
 const [introFinished, setIntroFinished] = useState(false);
 
 // The virtual cursor moving across the dock
 const cursorX = useMotionValue(-700); 
 const smoothCursorX = useSpring(cursorX, { damping: 25, stiffness: 120 });
 
 // To track which tooltip should be visible
 const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

 useEffect(() => {
  // 1. Chờ dock hiện ra
  const t0 = setTimeout(() => {
   setIntroFinished(true);
  }, 1500);

  // 2. Start the fluid sweep after 2.5 seconds
  const START_SWIPE = 2500;
  
  // We will animate cursorX from -600 to +600 over 4.5 seconds.
  let startTime: number;
  let animationFrame: number;
  
  const duration = 4500;
  
  const animateCursor = (timestamp: number) => {
   if (!startTime) startTime = timestamp;
   const elapsed = timestamp - startTime;
   const progress = Math.min(elapsed / duration, 1);
   
   // Easing: easeInOutQuad for smooth start and stop
   const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
   
   const currentX = -600 + (ease * 1200);
   cursorX.set(currentX);
   
   // Calculate which icon is currently closest
   let closestIdx = -1;
   let minDistance = 999;
   for(let i=0; i<8; i++) {
    const iconCenter = -392 + (i * 112);
    const dist = Math.abs(currentX - iconCenter);
    if(dist < minDistance) {
     minDistance = dist;
     closestIdx = i;
    }
   }
   
   // If close enough, set tooltip
   if (minDistance < 56) {
    setActiveTooltip(MODULES[closestIdx].id);
   } else {
    setActiveTooltip(null);
   }

   if (progress < 1) {
    animationFrame = requestAnimationFrame(animateCursor);
   } else {
    setActiveTooltip(null);
   }
  };
  
  const tSweep = setTimeout(() => {
   animationFrame = requestAnimationFrame(animateCursor);
  }, START_SWIPE);

  // 4. Chuyển scene
  const tNext = setTimeout(() => {
   onNext();
  }, START_SWIPE + duration + 1500);

  return () => {
   clearTimeout(t0);
   clearTimeout(tSweep);
   clearTimeout(tNext);
   if(animationFrame) cancelAnimationFrame(animationFrame);
  };
 }, [onNext]);

 return (
  <div className="absolute inset-0 z-20 overflow-hidden flex flex-col items-center justify-center bg-transparent pointer-events-none">
   
   {/* Tiêu đề System Overview (Chỉ hiện sau khi dock load xong) */}
   <AnimatePresence>
    {introFinished && (
     <motion.div 
      initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0 }}
      className="absolute top-[25%] text-center"
     >
      <div className="inline-block px-4 py-1.5 rounded-[20px] border border-cyan-500/30 bg-[#0B1120]/80 backdrop-blur-md text-cyan-400 font-bold text-xs tracking-[0.2em] uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
       Hệ Sinh Thái BrandFlow
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight drop-shadow-2xl">
       Tích hợp Tất cả trong Một
      </h2>
     </motion.div>
    )}
   </AnimatePresence>

   {/* MacOS-like Dock */}
   <motion.div 
    initial={{ y: 150, opacity: 0, scale: 0.8 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    transition={{ duration: 1, type: "spring", bounce: 0.4 }}
    className="relative mt-32"
   >
    <div className="flex items-end gap-4 px-8 py-5 rounded-[40px] bg-[#1a1b26]/60 border border-white/5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]">
     {MODULES.map((mod, idx) => {
      // Virtual center X of this icon relative to dock center
      // (24 w-24 = 96px) + (gap-4 = 16px) = 112px spacing
      // center of 8 icons -> (-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5) * 112
      const iconCenter = -392 + (idx * 112); 
      
      // Calculate distance for magnification using Framer Motion Transform
      const distance = useTransform(smoothCursorX, (val) => val - iconCenter);
      
      // Map distance to Scale (macOS curve: max at 0, 1 at +- 200)
      const scale = useTransform(distance, [-220, 0, 220], [1, 1.7, 1]);
      // Map distance to Y translation (moves up when scaling)
      const translateY = useTransform(distance, [-220, 0, 220], [0, -40, 0]);
      
      // Appearance changes
      const opacity = useTransform(distance, [-220, 0, 220], [0.7, 1, 0.7]);
      const borderOpacity = useTransform(distance, [-150, 0, 150], [0.1, 0.7, 0.1]);
      const borderBg = useMotionTemplate`rgba(255, 255, 255, ${borderOpacity})`;

      return (
       <div key={mod.id} className="relative flex flex-col items-center">
        
        {/* Tooltip */}
        <AnimatePresence>
         {activeTooltip === mod.id && (
          <motion.div
           initial={{ opacity: 0, y: 10, scale: 0.9, filter: 'blur(4px)' }}
           animate={{ opacity: 1, y: -120, scale: 1, filter: 'blur(0px)' }}
           exit={{ opacity: 0, y: 10, scale: 0.9, filter: 'blur(4px)', transition: { duration: 0.2 } }}
           className="absolute bottom-full whitespace-nowrap flex flex-col items-center z-50"
          >
           <div className="bg-[#1e1e24]/90 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-[16px] shadow-[0_15px_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <span className="text-white font-bold text-[17px] drop-shadow-md z-10">{mod.label}</span>
            <span className="text-slate-400 text-[12px] font-medium mt-1 z-10">{mod.desc}</span>
           </div>
           {/* Tam giác mũi tên tooltip */}
           <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/10 relative -top-[1px]" />
           <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-[#1e1e24]/90 absolute bottom-[-7px]" />
          </motion.div>
         )}
        </AnimatePresence>

        {/* Squirkle Icon (3D Apple Style) */}
        <motion.div
         style={{ scale, y: translateY, opacity }}
         className="w-24 h-24 rounded-[28px] flex items-center justify-center relative shadow-[0_15px_35px_rgba(0,0,0,0.6)] z-10 overflow-hidden"
        >
         {/* Base Vibrant Gradient Color */}
         <div className={`absolute inset-0 rounded-[28px] bg-gradient-to-b ${mod.color}`} />
         
         {/* Top inner highlight (Glass 3D effect) */}
         <div className="absolute inset-0 rounded-[28px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] pointer-events-none z-20" />
         
         {/* Dynamic glowing border that gets brighter when active */}
         <motion.div 
          style={{ borderColor: borderBg }}
          className="absolute inset-0 rounded-[28px] border-2 pointer-events-none z-20" 
         />

         {/* The Icon Itself */}
         <mod.icon className="w-12 h-12 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] relative z-30" />
         
         {/* Intense inner flare when active (Additive glow) */}
         <AnimatePresence>
           {activeTooltip === mod.id && (
            <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className={`absolute inset-0 bg-white mix-blend-overlay rounded-[28px] z-20 shadow-[inset_0_0_30px_rgba(255,255,255,0.8)]`} 
            />
           )}
         </AnimatePresence>
        </motion.div>

        {/* Chấm sáng chỉ báo (Indicator) cho app đang chạy */}
        <AnimatePresence>
         {activeTooltip === mod.id && (
          <motion.div 
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           exit={{ scale: 0, opacity: 0 }}
           className={`w-2 h-2 rounded-full bg-white mt-3 absolute -bottom-5 shadow-[0_0_12px_rgba(255,255,255,1)]`} 
          />
         )}
        </AnimatePresence>
       </div>
      );
     })}
    </div>
   </motion.div>
  </div>
 );
}
