"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Target, Activity, FileText, CheckCircle2, ChevronRight, Users, Shield, PieChart, Brain, Rocket, DollarSign, Wallet, AlertTriangle, TrendingUp, Calendar, Compass, History, AlertCircle, Download, Presentation, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const PLAN_GROUPS = [
  {
    title: 'A. PHÂN TÍCH & CHIẾN LƯỢC',
    items: [
      { id: 'overview', title: 'Tổng Quan', icon: LayoutDashboard, path: '/planning/a0-overview' },
      { id: 'mission', title: 'A.1 Sứ Mệnh', icon: Target, path: '/planning/a1-mission' },
      { id: 'performance', title: 'A.2 Hiệu Suất', icon: Activity, path: '/planning/a2-performance' },
      { id: 'revenue', title: 'A.3 Doanh Thu', icon: TrendingUp, path: '/planning/a3-revenue' },
      { id: 'market', title: 'A.4 Thị Trường', icon: Users, path: '/planning/a4-market' },
      { id: 'swot', title: 'A.5 Phân Tích SWOT', icon: Shield, path: '/planning/a5-swot' },
      { id: 'portfolio', title: 'A.6 Danh Mục', icon: PieChart, path: '/planning/a6-portfolio' },
      { id: 'assumptions', title: 'A.7 Giả Định', icon: Brain, path: '/planning/a7-assumptions' },
      { id: 'strategies', title: 'A.8 Chiến Lược', icon: Rocket, path: '/planning/a8-strategies' },
      { id: 'budget', title: 'A.9 Ngân Sách', icon: DollarSign, path: '/planning/a9-budget' },
    ]
  },
  {
    title: 'B. THỰC THI & TÀI CHÍNH',
    items: [
      { id: 'b0', title: 'B.0 Tổng Quan', icon: LayoutDashboard, path: '/planning/b0-overview' },
      { id: 'b2', title: 'B.2 Kế Hoạch', icon: CheckCircle2, path: '/planning/b2-action' },
      { id: 'b3', title: 'B.3 Phân Bổ NS', icon: Wallet, path: '/planning/b3-budget' },
      { id: 'b4', title: 'B.4 Rủi Ro', icon: AlertTriangle, path: '/planning/b4-contingency' },
      { id: 'b5', title: 'B.5 P&L', icon: BarChart3, path: '/planning/b5-pnl' },
      { id: 'b6', title: 'B.6 Gantt Chart', icon: Calendar, path: '/planning/b6-gantt' },
    ]
  },
  {
    title: 'C. ĐÁNH GIÁ & TỐI ƯU',
    items: [
      { id: 'c0', title: 'C.0 Tổng Quan', icon: LayoutDashboard, path: '/planning/c0-overview' },
      { id: 'c1', title: 'C.1 Định Hướng', icon: Compass, path: '/planning/c1-direction' },
      { id: 'c2', title: 'C.2 Lịch Sử', icon: History, path: '/planning/c2-history' },
      { id: 'c3', title: 'C.3 Vấn Đề', icon: AlertCircle, path: '/planning/c3-issues' },
    ]
  },
  {
    title: 'D. XUẤT BẢN',
    items: [
      { id: 'd0', title: 'D.0 Executive Report', icon: Download, path: '/planning/d0-report' },
    ]
  }
];

export default function PlanningLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex w-full h-full">
      {/* ── Sub Navigation Sidebar ── */}
      <div className="w-72 shrink-0 border-r border-linear-border/50 bg-slate-900/40 hidden lg:flex flex-col relative z-20">
        <div className="p-6 border-b border-linear-border/50">
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-heading tracking-tight mb-2">
            Strategic Planning
          </h2>
          <p className="text-xs text-slate-400 font-medium">12 bước chuẩn hóa kế hoạch tiếp thị đa kênh.</p>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {PLAN_GROUPS.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1.5">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-2">{group.title}</h3>
                {group.items.map((section) => {
                  const isActive = pathname.startsWith(section.path);
                  const Icon = section.icon;
                  
                  return (
                    <Link key={section.id} href={section.path}>
                      <div className={`
                        flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group relative overflow-hidden
                        ${isActive ? 'bg-cyan-500/10 border border-cyan-500/20' : 'hover:bg-white/5 border border-transparent'}
                      `}>
                        {isActive && <motion.div layoutId="activePlanTab" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-cyan-400 rounded-r-full" />}
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className={`text-sm font-bold ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                            {section.title}
                          </span>
                        </div>
                        {isActive ? (
                          <ChevronRight className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 opacity-50" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-linear-border/50">
             <div className="glassbox-card !p-4 bg-slate-900/60 border border-slate-700">
               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                   <Presentation className="w-4 h-4 text-purple-400" />
                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Master Plan</span>
                 </div>
                 <span className="text-xs font-black text-emerald-400">85%</span>
               </div>
               <div className="w-full bg-slate-800 rounded-full h-1.5 mb-4">
                 <div className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 h-1.5 rounded-full w-[85%] shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
               </div>
               
               <div className="grid grid-cols-2 gap-2">
                 <div className="bg-slate-800/80 rounded px-2 py-1.5">
                   <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Budget</div>
                   <div className="text-xs font-bold text-slate-200">140M</div>
                 </div>
                 <div className="bg-slate-800/80 rounded px-2 py-1.5">
                   <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Proj. ROI</div>
                   <div className="text-xs font-bold text-emerald-400">250%</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* ── Main Content Area ── */}
      <div className="flex-1 w-full h-full relative z-10 overflow-hidden bg-slate-950/20">
        {children}
      </div>
    </div>
  );
}
