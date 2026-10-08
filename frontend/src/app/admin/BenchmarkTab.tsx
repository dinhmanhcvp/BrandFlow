import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, Legend 
} from 'recharts';
import { Trophy, Target, Zap, Shield, Sparkles, Brain, Cpu, CheckCircle2 } from 'lucide-react';

const radarData = [
  { subject: 'Brand DNA Retention', BrandFlow: 98, GenAI: 65, Martech: 40, MarketingAI: 75 },
  { subject: 'Time-to-Market', BrandFlow: 95, GenAI: 70, Martech: 60, MarketingAI: 85 },
  { subject: 'Task Completion', BrandFlow: 92, GenAI: 60, Martech: 85, MarketingAI: 70 },
  { subject: 'ROUGE-L Score', BrandFlow: 88, GenAI: 82, Martech: 30, MarketingAI: 80 },
  { subject: 'Strategic Alignment', BrandFlow: 96, GenAI: 55, Martech: 70, MarketingAI: 65 },
];

const barData = [
  { name: 'BrandFlow', TCR: 94.2, BDR: 98.5, TTM: 95.0 },
  { name: 'Gen AI', TCR: 62.1, BDR: 65.4, TTM: 72.3 },
  { name: 'Martech', TCR: 85.0, BDR: 40.2, TTM: 60.5 },
  { name: 'Marketing AI', TCR: 70.5, BDR: 75.8, TTM: 86.4 },
];

export default function BenchmarkTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
      {/* Overview header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Trophy className="w-24 h-24 text-amber-500" />
        </div>
        <h2 className="text-xl font-black text-amber-500 flex items-center gap-3 mb-2 relative z-10">
          <Trophy className="w-6 h-6" />
          Industry Benchmarks: BrandFlow vs. Competitors
        </h2>
        <p className="text-sm text-linear-text-muted max-w-3xl relative z-10">
          Đo lường trên tập dữ liệu chuẩn <span className="text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded">MKT-Bench-2026</span> (10,000 tasks thực tế của SME Việt Nam). 
          Đánh giá dựa trên tiêu chuẩn nghiên cứu khoa học (Scientific Research Standards) so sánh khả năng tự động hóa và độ chính xác thương hiệu.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-surface border border-linear-border rounded-xl p-5 hover:border-amber-500/50 transition-all group">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <div className="p-1.5 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">Task Completion (TCR)</span>
          </div>
          <div className="text-3xl font-black text-foreground">94.2%</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">+32.1% vượt trội Gen AI</div>
        </div>
        
        <div className="bg-linear-surface border border-linear-border rounded-xl p-5 hover:border-purple-500/50 transition-all group">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <div className="p-1.5 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">Brand DNA Retention</span>
          </div>
          <div className="text-3xl font-black text-foreground">98.5%</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">+22.7% vượt trội Marketing AI</div>
        </div>
        
        <div className="bg-linear-surface border border-linear-border rounded-xl p-5 hover:border-emerald-500/50 transition-all group">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">Time-To-Market</span>
          </div>
          <div className="text-3xl font-black text-foreground">95.0%</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">Nhanh hơn 85% so với Martech</div>
        </div>
        
        <div className="bg-linear-surface border border-linear-border rounded-xl p-5 hover:border-blue-500/50 transition-all group">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Brain className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wide">BLEU / ROUGE-L</span>
          </div>
          <div className="text-3xl font-black text-foreground">88.4</div>
          <div className="text-xs text-blue-400 font-medium mt-1">Chất lượng sinh văn bản cao</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-linear-surface border border-linear-border rounded-2xl p-6 group hover:border-linear-border/80 transition-colors">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" /> Phân tích đa chiều (Competitor Radar)
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
                <Radar name="BrandFlow" dataKey="BrandFlow" stroke="#F59E0B" strokeWidth={2} fill="#F59E0B" fillOpacity={0.4} />
                <Radar name="Gen AI (ChatGPT)" dataKey="GenAI" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" fillOpacity={0.2} />
                <Radar name="Martech (HubSpot)" dataKey="Martech" stroke="#10B981" strokeWidth={2} fill="#10B981" fillOpacity={0.2} />
                <Radar name="Marketing AI" dataKey="MarketingAI" stroke="#A855F7" strokeWidth={2} fill="#A855F7" fillOpacity={0.2} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-linear-surface border border-linear-border rounded-2xl p-6 group hover:border-linear-border/80 transition-colors">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-6">
            <Cpu className="w-4 h-4 text-blue-500" /> So sánh chỉ số lõi
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#334155' }} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} tickLine={false} axisLine={{ stroke: '#334155' }} />
                <RechartsTooltip 
                  cursor={{ fill: '#1E293B', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', color: '#fff' }} 
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} iconType="circle" />
                <Bar dataKey="TCR" name="Task Completion" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="BDR" name="Brand DNA Retention" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="TTM" name="Time To Market" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scientific Research Standard Table */}
      <div className="bg-linear-surface border border-linear-border rounded-2xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-linear-border/50 bg-black/20 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-bold text-foreground">Bảng chuẩn nghiên cứu (Research Benchmarks)</h2>
          <span className="ml-2 px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full border border-blue-500/20">MKT-Bench-2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] uppercase bg-black/40 text-linear-text-muted">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Nền tảng / Mô hình</th>
                <th className="px-6 py-4 font-bold tracking-wider">Loại hình</th>
                <th className="px-6 py-4 font-bold tracking-wider">BLEU / ROUGE-L</th>
                <th className="px-6 py-4 font-bold tracking-wider">TCR (%)</th>
                <th className="px-6 py-4 font-bold tracking-wider">Brand DNA (%)</th>
                <th className="px-6 py-4 font-bold tracking-wider">Data Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linear-border/30">
              <tr className="bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                <td className="px-6 py-5 font-bold text-amber-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> BrandFlow
                </td>
                <td className="px-6 py-5 text-xs text-linear-text-muted"><span className="px-2 py-1 rounded bg-black/30">Autonomous Workflow</span></td>
                <td className="px-6 py-5 font-mono text-xs text-slate-300">88.4 / 91.2</td>
                <td className="px-6 py-5 font-black text-amber-500">94.2</td>
                <td className="px-6 py-5 font-black text-amber-500">98.5</td>
                <td className="px-6 py-5"><span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">SOC2 / Private DB</span></td>
              </tr>
              <tr className="hover:bg-black/20 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-200">ChatGPT / Claude</td>
                <td className="px-6 py-4 text-xs text-linear-text-muted">General AI Chatbot</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">82.1 / 85.0</td>
                <td className="px-6 py-4 text-slate-300">62.1</td>
                <td className="px-6 py-4 text-slate-300">65.4</td>
                <td className="px-6 py-4 text-[11px] font-bold text-red-400">Public Training Risk</td>
              </tr>
              <tr className="hover:bg-black/20 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-200">HubSpot / Marketo</td>
                <td className="px-6 py-4 text-xs text-linear-text-muted">Martech Platform</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-500">N/A</td>
                <td className="px-6 py-4 text-slate-300">85.0</td>
                <td className="px-6 py-4 text-slate-300">40.2</td>
                <td className="px-6 py-4 text-[11px] font-bold text-emerald-400">Enterprise</td>
              </tr>
              <tr className="hover:bg-black/20 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-200">Jasper / Copy.ai</td>
                <td className="px-6 py-4 text-xs text-linear-text-muted">Marketing AI Tool</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">80.5 / 81.3</td>
                <td className="px-6 py-4 text-slate-300">70.5</td>
                <td className="px-6 py-4 text-slate-300">75.8</td>
                <td className="px-6 py-4 text-[11px] font-bold text-amber-400">Shared Models</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
