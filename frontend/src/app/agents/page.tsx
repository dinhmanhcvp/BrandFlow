"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, BatteryCharging, BrainCircuit, Activity, Settings2, Plus, Zap, ArrowRight, Trash2, MessageSquare, Bot, Loader2, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Default preset agents (always shown) — Enterprise C-Suite Standard
const PRESET_AGENTS = [
 { id: 'cmo', name: 'Chief Marketing Officer', role: 'CMO — Chiến lược Marketing & Brand', brain: 97, status: 'Hoạt động', color: 'from-purple-600 to-cyan-500', iconColor: 'text-purple-600', skill: 'Brand Strategy · GTM · Positioning', isPreset: true },
 { id: 'cfo', name: 'Chief Financial Officer', role: 'CFO — Tài chính & Ngân sách Enterprise', brain: 95, status: 'Hoạt động', color: 'from-blue-600 to-cyan-500', iconColor: 'text-blue-600', skill: 'P&L · DCF · Unit Economics', isPreset: true },
 { id: 'cro', name: 'Chief Revenue Officer', role: 'CRO — Tăng trưởng & Chuyển đổi', brain: 93, status: 'Hoạt động', color: 'from-orange-500 to-amber-400', iconColor: 'text-amber-600', skill: 'Funnel · ROAS · A/B Testing', isPreset: true },
 { id: 'cdo', name: 'Chief Data Officer', role: 'CDO — Dữ liệu & Market Intelligence', brain: 96, status: 'Hoạt động', color: 'from-blue-500 to-indigo-600', iconColor: 'text-indigo-600', skill: 'TAM/SAM/SOM · Competitor Intel', isPreset: true },
];

interface CustomAgentItem {
 id: string;
 name: string;
 role: string;
 capabilities: string[];
 isPreset?: boolean;
 brain?: number;
 status?: string;
 color?: string;
 iconColor?: string;
 skill?: string;
}

const CAPABILITY_LABELS: Record<string, string> = {
 data_analysis: 'Python DA',
 web_search: 'Web Search',
 niche_knowledge: 'Niche RAG',
 financial_modeling: 'Tài chính',
 competitor_intel: 'Cạnh tranh',
 content_strategy: 'Content',
 customer_insights: 'Insight KH',
 campaign_optimizer: 'Campaigns',
 brand_health: 'Brand Health',
 market_sizing: 'Thị trường',
};

const COLOR_PRESETS = [
 'from-violet-500 to-purple-500',
 'from-cyan-500 to-blue-500',
 'from-emerald-500 to-teal-500',
 'from-rose-500 to-pink-500',
 'from-amber-500 to-orange-500',
 'from-fuchsia-500 to-pink-500',
];

export default function AgentsPage() {
 const { t } = useLanguage();
 const router = useRouter();
 const [customAgents, setCustomAgents] = useState<CustomAgentItem[]>([]);
 const [isLoading, setIsLoading] = useState(true);
 const [deletingId, setDeletingId] = useState<string | null>(null);
 const [selectedAgent, setSelectedAgent] = useState<any>(null);

 useEffect(() => {
  loadCustomAgents();
 }, []);

 const loadCustomAgents = async () => {
  setIsLoading(true);
  
  const local = localStorage.getItem('brandflow_custom_agents');
  const localAgents = local ? JSON.parse(local) : [];
  
  try {
   const res = await fetch('/api/v1/agents');
   if (res.ok) {
    const data = await res.json();
    if (data && data.length > 0) {
     setCustomAgents(data);
    } else {
     setCustomAgents(localAgents);
    }
   } else {
    throw new Error('API error');
   }
  } catch {
   // Fallback: load from localStorage if API is unavailable
   setCustomAgents(localAgents);
  } finally {
   setIsLoading(false);
  }
 };

 const handleDeleteAgent = async (id: string) => {
  setDeletingId(id);
  // Remove from local state
  setCustomAgents(prev => prev.filter(a => a.id !== id));
  // Also clean localStorage fallback
  const local = localStorage.getItem('brandflow_custom_agents');
  if (local) {
   const arr = JSON.parse(local).filter((a: any) => a.id !== id);
   localStorage.setItem('brandflow_custom_agents', JSON.stringify(arr));
  }
  setDeletingId(null);
 };

 const allAgents = [
  ...PRESET_AGENTS,
  ...customAgents.map((a, i) => ({
   ...a,
   brain: a.brain || Math.floor(70 + Math.random() * 25),
   status: a.status || 'Hoạt động',
   color: a.color || COLOR_PRESETS[i % COLOR_PRESETS.length],
   iconColor: a.iconColor || 'text-cyan-600',
   skill: a.skill || (a.capabilities?.slice(0, 2).map(c => CAPABILITY_LABELS[c] || c).join(', ') || 'Custom'),
  })),
 ];

 return (
 <div className="w-full h-full overflow-y-auto">
 <div className="page-container max-w-6xl min-h-full">
 <div className="mb-8 flex justify-between items-end">
 <div>
 <h2 className="page-title flex items-center">
 <Network className="w-6 h-6 mr-3 text-cyan-600" />
 {t('agents.title')}
 </h2>
 <p className="page-desc">{t('agents.desc')}</p>
 </div>
 <Link href="/agent-builder">
  <button className="hidden md:flex items-center btn-primary gap-2">
   <Plus className="w-4 h-4" /> Thuê Trợ lý mới
   <ArrowRight className="w-4 h-4 opacity-70" />
  </button>
 </Link>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {allAgents.map((agent, i) => (
 <motion.div 
 key={agent.id}
 onClick={() => setSelectedAgent(agent)}
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: i * 0.07 }}
 whileHover={{ scale: 1.03, y: -5 }}
 className="bento-card p-6 flex flex-col relative overflow-hidden group bg-linear-surface border-linear-border hover:border-cyan-500/30 shadow-sm hover:shadow-lg cursor-pointer transition-all duration-300"
 >
 {/* Background Glow */}
 <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${agent.color} rounded-full opacity-10 blur-[50px] group-hover:opacity-20 transition-opacity pointer-events-none`}></div>
 
 <div className="flex justify-between items-start mb-6 z-10">
 <div className="flex items-center">
 <div className={`w-12 h-12 rounded-xl bg-background border border-linear-border flex items-center justify-center mr-4 shadow-sm`}>
 <BrainCircuit className={`w-6 h-6 ${agent.iconColor}`} />
 </div>
 <div>
 <h3 className="text-lg font-bold text-foreground tracking-tight">{agent.name}</h3>
 <p className="text-xs font-semibold text-linear-text-muted uppercase tracking-widest">{agent.role}</p>
 </div>
 </div>
 <div className="flex gap-1">
  {!('isPreset' in agent && agent.isPreset) && (
   <button 
    onClick={(e) => { e.stopPropagation(); handleDeleteAgent(agent.id); }}
    className="text-linear-text-muted hover:text-red-500 bg-background p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
    title="Xóa agent"
   >
    <Trash2 className="w-4 h-4" />
   </button>
  )}
  <button className="text-linear-text-muted hover:text-foreground bg-background p-2 rounded-full hover:bg-linear-surface/80 transition-colors">
   <Settings2 className="w-4 h-4" />
  </button>
 </div>
 </div>

 <div className="space-y-4 flex-1 z-10">
 <div>
 <div className="flex justify-between items-end mb-1">
 <span className="text-xs font-bold text-linear-text-muted flex items-center"><BatteryCharging className="w-3 h-3 mr-1" /> {t('agents.load')}</span>
 <span className="text-xs font-bold font-mono text-foreground">{agent.brain}%</span>
 </div>
 <div className="h-2 w-full bg-linear-surface/50 border border-linear-border rounded-full overflow-hidden">
 <div className={`h-full bg-gradient-to-r ${agent.color}`} style={{ width: `${agent.brain}%` }}></div>
 </div>
 </div>
 
 <div className="flex justify-between items-center text-xs">
 <span className="bg-background border border-linear-border px-2 py-1 rounded-md text-linear-text-muted font-bold">Kỹ năng: {agent.skill}</span>
 <span className={`px-2 py-1 rounded-md font-bold flex items-center border ${agent.status === 'Hoạt động' ? 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-500/10 dark:border-blue-500/20' : agent.status === 'Đang xử lý' ? 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20 animate-pulse' : 'text-linear-text-muted bg-linear-surface/50 border-linear-border'}`}>
 {agent.status === 'Hoạt động' ? <Activity className="w-3 h-3 mr-1" /> : agent.status === 'Đang xử lý' ? <Zap className="w-3 h-3 mr-1" /> : null}
 {agent.status}
 </span>
 </div>
 </div>
 </motion.div>
 ))}

 {/* Add Trợ lý AI Placeholder */}
 <Link href="/agent-builder">
 <motion.div 
 whileHover={{ scale: 1.02 }}
 className="bento-card border-dashed border-linear-border bg-background hover:bg-linear-surface/80 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[220px] hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/5"
 >
 <div className="w-12 h-12 rounded-full border border-linear-border bg-linear-surface shadow-sm flex items-center justify-center mb-3 group-hover:border-cyan-500/30 transition-colors">
 <Plus className="w-6 h-6 text-linear-text-muted" />
 </div>
 <p className="text-sm font-bold text-foreground">Mở khóa Trợ lý mới</p>
 <p className="text-xs font-semibold text-linear-text-muted mt-1 px-4">Tạo AI Trợ lý AI chuyên biệt với các công cụ Research, Data Analysis, và nhiều hơn nữa.</p>
 <div className="mt-3 flex items-center gap-1 text-xs font-bold text-cyan-500">
  Tạo Trợ lý AI <ArrowRight className="w-3 h-3" />
 </div>
 </motion.div>
 </Link>
 </div>
 </div>

 {/* Trợ lý AI Activity Modal */}
 <AnimatePresence>
  {selectedAgent && (
   <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <motion.div 
     initial={{ opacity: 0 }} 
     animate={{ opacity: 1 }} 
     exit={{ opacity: 0 }} 
     className="absolute inset-0 bg-black/60 backdrop-blur-sm"
     onClick={() => setSelectedAgent(null)}
    />
    <motion.div 
     initial={{ opacity: 0, scale: 0.95, y: 20 }}
     animate={{ opacity: 1, scale: 1, y: 0 }}
     exit={{ opacity: 0, scale: 0.95, y: 20 }}
     className="relative w-full max-w-3xl max-h-[85vh] bg-background border border-linear-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    >
     {/* Modal Header */}
     <div className="flex items-center justify-between p-5 border-b border-linear-border bg-slate-50 dark:bg-slate-900/50">
      <div className="flex items-center gap-4">
       <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${selectedAgent.color} shadow-sm`}>
        <Bot className="w-6 h-6 text-white" />
       </div>
       <div>
        <h3 className="text-xl font-bold text-foreground leading-tight">{selectedAgent.name}</h3>
        <p className="text-xs text-linear-text-muted font-medium mt-0.5">{selectedAgent.role}</p>
       </div>
      </div>
      <button 
       onClick={() => setSelectedAgent(null)}
       className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
      >
       <X className="w-5 h-5" />
      </button>
     </div>

     {/* Modal Content - Activity Log */}
     <div className="flex-1 overflow-y-auto p-5 md:p-6 custom-scrollbar bg-slate-50/50 dark:bg-[#0B1120]">
      <div className="flex items-center justify-between mb-6">
       <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
        <Activity className="w-4 h-4 text-cyan-500" /> Chu trình đã chạy (Recent Cycles)
       </h4>
       <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        ONLINE
       </div>
      </div>
      <div className="space-y-5">
       {[1, 2, 3].map((cycle, idx) => (
        <div key={idx} className="p-4 rounded-xl border border-linear-border bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden group">
         <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${selectedAgent.color}`}></div>
         <div className="flex items-center justify-between mb-3 pl-2">
          <span className="text-xs font-bold text-slate-500 font-mono flex items-center gap-2">
           <BrainCircuit className="w-3.5 h-3.5" /> CYCLE_ID: 8F{idx}3-A{cycle}9B
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">SUCCESS</span>
         </div>
         <div className="text-[13px] text-slate-700 dark:text-slate-300 space-y-3 pl-2">
          <div className="flex items-start gap-2.5">
           <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
           <p><strong>Input:</strong> Nhận parameter context cho workflow <span className="text-cyan-600 dark:text-cyan-400 font-semibold">'{selectedAgent.skill}'</span>.</p>
          </div>
          <div className="flex items-start gap-2.5">
           <Network className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
           <p><strong>Processing:</strong> Thực thi Cognitive Load Simulation trên 10,000 variants. Lọc ra 3 kịch bản tối ưu nhất.</p>
          </div>
          <div className="flex items-start gap-2.5">
           <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
           <p><strong>Output:</strong> Đẩy dữ liệu chiến lược vào Shared Context cho quá trình Cross-Trợ lý AI Debate.</p>
          </div>
         </div>
         <div className="mt-4 pt-3 border-t border-linear-border flex justify-between items-center text-[10px] text-slate-400 pl-2">
          <span>Model: GPT-4-Omni-Enterprise</span>
          <span>Execution Time: {(1.2 + idx * 0.4).toFixed(2)}s</span>
         </div>
        </div>
       ))}
      </div>
     </div>
    </motion.div>
   </div>
  )}
 </AnimatePresence>

 </div>
 );
}
