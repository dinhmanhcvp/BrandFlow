"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { BrainCircuit, Zap, Bot, ShieldCheck } from 'lucide-react';

function AnimatedCounter({ end, suffix }: { end: number, suffix: string }) {
 const [count, setCount] = useState(0);

 useEffect(() => {
  let startTime: number | null = null;
  const duration = 2000; // 2s duration

  const animate = (time: number) => {
   if (!startTime) startTime = time;
   const progress = Math.min((time - startTime) / duration, 1);
   // easeOutExpo
   const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
   setCount(Math.floor(ease * end));
   if (progress < 1) {
    requestAnimationFrame(animate);
   }
  };
  requestAnimationFrame(animate);
 }, [end]);

 return <>{count}<span className="text-cyan-400">{suffix}</span></>;
}

export default function MetricsBanner() {
 const { t } = useLanguage();
 
 const METRICS = [
  { value: 12, suffix: "+", label: t('landing_metrics.m1'), icon: BrainCircuit, color: "text-blue-400" },
  { value: 50, suffix: "ms", label: t('landing_metrics.m2'), icon: Zap, color: "text-cyan-400" },
  { value: 8, suffix: "+", label: t('landing_metrics.m3'), icon: Bot, color: "text-indigo-400" },
  { value: 100, suffix: "%", label: t('landing_metrics.m4'), icon: ShieldCheck, color: "text-emerald-400" },
 ];

 return (
  <section className="relative -mt-16 z-30 px-6">
   <div className="max-w-6xl mx-auto">
    <motion.div 
     initial={{ opacity: 0, y: 30 }}
     whileInView={{ opacity: 1, y: 0 }}
     viewport={{ once: true, margin: "-100px" }}
     transition={{ duration: 0.6 }}
     className="relative bg-linear-surface/80 backdrop-blur-xl border ultra-thin-border rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden"
    >
     {/* Enhanced glowing accent lines */}
     <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
     <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
     
     {/* Corner glow accents */}
     <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 blur-[60px] rounded-full pointer-events-none" />
     <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none" />
     
     <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
      {METRICS.map((metric, idx) => {
       const Icon = metric.icon;
       return (
        <div 
         key={idx}
         className="text-center flex flex-col items-center justify-center relative group"
        >
         {/* Separator for desktop */}
         {idx > 0 && <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-16 bg-gradient-to-b from-transparent via-linear-border/60 to-transparent" />}
         
         {/* Icon */}
         <div className={`w-10 h-10 rounded-xl bg-linear-surface border ultra-thin-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm ${metric.color}`}>
          <Icon className="w-5 h-5" />
         </div>
         
         <h3 className="text-4xl md:text-5xl font-black mb-3 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 dark:from-white dark:to-slate-400">
          <AnimatedCounter end={metric.value} suffix={metric.suffix} />
         </h3>
         <p className="text-xs md:text-sm uppercase tracking-widest text-linear-text-muted font-bold max-w-[180px] mx-auto text-balance">
          {metric.label}
         </p>
        </div>
       );
      })}
     </div>
    </motion.div>
   </div>
  </section>
 );
}
