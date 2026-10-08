"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, CheckCircle, Database, Shield, Terminal, Cpu, Network, Lock, MessageSquare, ArrowRight, Activity, Server, FileJson, Layers, RefreshCw, Layout } from 'lucide-react';
import { useFormStore } from '@/store/useFormStore';

export default function Phase6_AgentDeploy({ onNext, onBack }: { onNext: () => void, onBack?: () => void }) {
 const [step, setStep] = useState(0);
 const { brandDNA, wizardAnswers } = useFormStore();
 const isBepNhaMoc = brandDNA?.brand_name?.includes('Nhà Mộc') || wizardAnswers?.company_name?.includes('Nhà Mộc');

 useEffect(() => {
  if (typeof window !== 'undefined' && (window as any).__DEMO_MODE__) {
   const timers = [
    setTimeout(() => setStep(1), 500),
    setTimeout(() => setStep(2), 1500),
    setTimeout(() => setStep(3), 2800),
    setTimeout(() => setStep(4), 4000),
    setTimeout(() => setStep(5), 5500),
    setTimeout(() => setStep(6), 7000),
   ];
   return () => timers.forEach(clearTimeout);
  } else {
   const timer = setTimeout(() => setStep(6), 0);
   return () => clearTimeout(timer);
  }
 }, []);

 const metrics = [
  { label: "Vector Database", value: "2.4 GB", icon: Database, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Neural Params", value: "8.5B", icon: Cpu, color: "text-purple-400", bg: "bg-purple-500/10" },
  { label: "Latency", value: "45ms", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10" }
 ];

 const dataSources = [
  { name: "menu_bepnhamoc_2026.pdf", type: "Catalog", status: "Vectorized" },
  { name: "brand_voice_guidelines.md", type: "Ruleset", status: "Enforced" },
  { name: "zalo_oa_chat_history.csv", type: "Training Data", status: "Ingested" },
  { name: "crisis_management_protocol.json", type: "Guardrails", status: "Active" }
 ];

 return (
  <div className="h-full w-full flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto z-10 relative">
   {/* ── Header ── */}
   <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
    <div>
     <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
      <Server className="w-4 h-4 text-emerald-400 mr-2" />
      <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">Deployment Center</span>
     </div>
     <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
      Personal Trợ lý AI Deployment
     </h2>
     <p className="text-linear-text-muted mt-2 font-medium text-sm md:text-base max-w-2xl">
      Tiến trình huấn luyện và đóng gói AI độc quyền dựa trên dữ liệu {isBepNhaMoc ? "Bếp Nhà Mộc" : "Doanh nghiệp"}. Hệ thống đang đồng bộ Brand DNA vào Neural Network.
     </p>
    </div>
    <div className="flex gap-3 w-full md:w-auto">
     <button 
      onClick={onBack} 
      className="px-5 py-3 rounded-xl border border-linear-border bg-linear-surface hover:bg-linear-surface/80 text-foreground font-bold transition-all shadow-sm flex items-center justify-center"
     >
      <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Quay lại
     </button>
     <button 
      id="btn-next-phase6"
      onClick={onNext}
      disabled={step < 6}
      className={`group relative px-6 py-3 rounded-xl font-bold transition-all overflow-hidden flex-1 md:flex-none flex items-center justify-center
       ${step >= 6 
        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
     >
      <span className="relative z-10 flex items-center">
       {step < 6 ? 'Deploying...' : 'View Executive Report'} 
       {step >= 6 && <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
      </span>
     </button>
    </div>
   </div>

   {/* ── Overview Alert Banner ── */}
   <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center text-emerald-300 text-sm">
     <Bot className="w-5 h-5 mr-3 text-emerald-400 shrink-0" />
     <span>
      <strong>Bản xem trước (Overview):</strong> Đây là giao diện tổng quan về quá trình đóng gói AI. Để cấu hình chi tiết, vui lòng chuyển đến trang Builder hoặc Planning.
     </span>
    </div>
    <div className="flex gap-3 ml-4 shrink-0">
     <button onClick={() => window.location.href='/agent-builder'} className="px-4 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg transition-colors flex items-center">
      <Cpu className="w-3.5 h-3.5 mr-1.5" /> Trợ lý AI Builder
     </button>
     <button onClick={() => window.location.href='/planning/d0-report'} className="px-4 py-1.5 bg-teal-600/20 hover:bg-teal-600/40 border border-teal-500/30 text-teal-300 text-xs font-bold rounded-lg transition-colors flex items-center">
      <Layout className="w-3.5 h-3.5 mr-1.5" /> Go to Planning
     </button>
    </div>
   </motion.div>

   {/* ── Main Layout ── */}
   <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-8">
    
    {/* LEFT PANEL: AGENT CORE & METRICS */}
    <div className="xl:col-span-5 flex flex-col gap-6">
     
     {/* Trợ lý AI Identity Card */}
     <div className="bg-linear-surface/40 backdrop-blur-md border border-linear-border/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="flex items-center gap-6 relative z-10">
       <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] relative">
        <Bot className="w-10 h-10 text-white relative z-10" />
        {step < 6 && (
         <div className="absolute inset-0 border-2 border-white/50 rounded-2xl animate-[spin_3s_linear_infinite] border-t-transparent"></div>
        )}
       </div>
       <div>
        <h3 className="text-2xl font-black text-foreground mb-1">{isBepNhaMoc ? "Mộc Assistant" : "Corporate AI"}</h3>
        <div className="flex items-center gap-2">
         <span className={`flex items-center px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border
          ${step >= 6 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${step >= 6 ? 'bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-amber-400 animate-pulse'}`} /> 
          {step >= 6 ? 'Online & Ready' : 'Training Pipeline Active'}
         </span>
        </div>
       </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
       {metrics.map((m, i) => (
        <div key={i} className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50 flex flex-col items-center justify-center text-center">
         <div className={`w-8 h-8 rounded-xl ${m.bg} flex items-center justify-center mb-2`}>
          <m.icon className={`w-4 h-4 ${m.color}`} />
         </div>
         <div className="text-lg font-black text-foreground">{step >= i + 2 ? m.value : '-'}</div>
         <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{m.label}</div>
        </div>
       ))}
      </div>
     </div>

     {/* Integration Status */}
     <div className="bg-linear-surface/40 backdrop-blur-md border border-linear-border/30 rounded-3xl p-8 shadow-2xl flex-1 flex flex-col">
      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
       <Layers className="w-4 h-4 mr-2 text-blue-400" /> Data Ingestion Pipeline
      </h4>
      <div className="space-y-4 flex-1">
       {dataSources.map((ds, i) => {
        const isLoaded = step > i + 1;
        const isLoading = step === i + 1;
        return (
         <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300
          ${isLoaded ? 'bg-emerald-500/5 border-emerald-500/20' : isLoading ? 'bg-blue-500/5 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' : 'bg-slate-800/30 border-slate-700/50 opacity-50'}`}>
          <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700">
            {isLoaded ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : isLoading ? <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" /> : <FileJson className="w-4 h-4 text-slate-500" />}
           </div>
           <div>
            <div className={`text-sm font-bold ${isLoaded ? 'text-emerald-300' : isLoading ? 'text-blue-300' : 'text-slate-400'}`}>{ds.name}</div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">{ds.type}</div>
           </div>
          </div>
          {isLoaded && <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded uppercase tracking-wider">{ds.status}</span>}
          {isLoading && <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-2 py-1 rounded uppercase tracking-wider">Processing...</span>}
         </div>
        );
       })}
      </div>

      <div className="mt-6 pt-6 border-t border-linear-border/50">
       <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center">
        <Shield className="w-4 h-4 mr-2 text-purple-400" /> Security & Guardrails
       </h4>
       <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-lg border text-xs font-medium flex items-center ${step >= 5 ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}>
         <Lock className="w-3.5 h-3.5 mr-2 shrink-0" /> PII Masking Active
        </div>
        <div className={`p-3 rounded-lg border text-xs font-medium flex items-center ${step >= 5 ? 'bg-purple-500/10 border-purple-500/30 text-purple-300' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}>
         <Shield className="w-3.5 h-3.5 mr-2 shrink-0" /> Tone Enforcement
        </div>
       </div>
      </div>
     </div>
    </div>

    {/* RIGHT PANEL: LIVE SIMULATION CONSOLE */}
    <div className="xl:col-span-7 bg-[#0F172A] border border-slate-700 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col">
     {/* Console Header */}
     <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center z-10 shrink-0">
      <div className="flex items-center gap-3">
       <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
       </div>
       <div className="w-px h-4 bg-slate-700 mx-2"></div>
       <Terminal className="w-4 h-4 text-slate-400" />
       <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">Live Integration Testing</span>
      </div>
      <div className="flex items-center gap-2">
       <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${step >= 6 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${step >= 6 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
       </span>
       <span className="text-[10px] font-mono text-slate-400">{step >= 6 ? 'SYSTEM_READY' : 'SIMULATING_SCENARIO'}</span>
      </div>
     </div>

     {/* Chat Area */}
     <div className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 relative bg-[url('/img/grid.svg')] bg-center">
      
      <AnimatePresence>
       {step >= 5 && (
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex flex-col gap-2">
         <div className="flex items-center justify-end gap-2 mb-1">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Khách hàng (B2B Lead)</span>
         </div>
         <div className="self-end bg-slate-800 text-slate-200 px-5 py-4 rounded-2xl rounded-tr-sm text-sm md:text-base max-w-[85%] shadow-md border border-slate-700/50">
          Chào Mộc, bên mình là công ty công nghệ quy mô 150 nhân sự ở Quận 1. Mình đang tìm đối tác cung cấp suất ăn trưa văn phòng dài hạn. Bên bạn có đáp ứng được số lượng lớn mà vẫn đảm bảo dùng hộp bã mía không? Có ưu đãi gì cho HĐ 6 tháng không?
         </div>
        </motion.div>
       )}
       
       {step === 5 && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center gap-4 mt-2">
         <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Bot className="w-5 h-5 text-emerald-400" />
         </div>
         <div className="bg-slate-800/80 px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-700/50 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></div>
         </div>
        </motion.div>
       )}

       {step >= 6 && (
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="flex flex-col gap-2 mt-2">
         <div className="flex items-center justify-start gap-3 mb-1">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-sm">
           <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Mộc Assistant</span>
         </div>
         <div className="self-start bg-emerald-900/30 border border-emerald-500/20 text-slate-200 px-6 py-5 rounded-2xl rounded-tl-sm text-sm md:text-[15px] max-w-[90%] shadow-lg leading-relaxed relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          Dạ, Mộc chào anh/chị ạ! 🌿 Rất cảm ơn anh/chị đã quan tâm đến giải pháp Tiệc doanh nghiệp của Bếp Nhà Mộc.
          <br/><br/>
          Với quy mô 150 nhân sự tại Quận 1, Mộc hoàn toàn tự tin có thể phục vụ chu đáo mỗi ngày. 100% suất ăn của nhà Mộc đều sử dụng hộp bã mía phân hủy sinh học, đi kèm bộ muỗng nĩa gỗ để đảm bảo tiêu chí Xanh & Bền vững như Brand DNA của chúng mình.
          <br/><br/>
          🎁 <strong className="text-emerald-300">Đặc quyền dành riêng cho Hợp đồng 6 tháng (Corporate Pack):</strong>
          <ul className="mt-2 space-y-2 list-none">
           <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-400 shrink-0"/> Chiết khấu trực tiếp <strong>15%</strong> trên tổng bill tháng.</li>
           <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-400 shrink-0"/> Tráng miệng luân phiên (Trái cây/Chè nấm tuyết) miễn phí thứ 6 hàng tuần.</li>
           <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-emerald-400 shrink-0"/> Miễn phí Setup 01 buổi Tasting Event (Ăn thử) ngay tại văn phòng cho toàn bộ 150 nhân sự.</li>
          </ul>
          <br/>
          Anh/chị có thể để lại số Zalo hoặc email, đội ngũ B2B của Mộc sẽ liên hệ trong vòng 15 phút để gửi Proposal chi tiết và menu tháng ạ!
         </div>
        </motion.div>
       )}
      </AnimatePresence>

      {/* Terminal Matrix Effect Overlay when loading */}
      {step < 5 && (
       <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm z-20">
        <Network className="w-16 h-16 text-blue-500/50 animate-pulse mb-6" />
        <div className="font-mono text-sm text-blue-400 text-center space-y-2">
         <div className="animate-pulse">Initialize Neural Weights... [OK]</div>
         {step >= 2 && <div className="animate-pulse">Vectorizing Knowledge Base... [OK]</div>}
         {step >= 3 && <div className="animate-pulse">Applying Brand Guidelines... [OK]</div>}
         {step >= 4 && <div className="animate-pulse">Loading Test Simulation Environment...</div>}
        </div>
       </div>
      )}
     </div>
     
     {/* Console Input (Visual only) */}
     <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0">
      <div className="relative">
       <input 
        type="text" 
        disabled 
        placeholder={step >= 6 ? "AI Trợ lý AI is ready for interaction..." : "System locked during deployment..."}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none cursor-not-allowed"
       />
       <MessageSquare className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
