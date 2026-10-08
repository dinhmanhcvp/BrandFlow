import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, Legend 
} from 'recharts';
import { Trophy, Target, Zap, Shield, Sparkles, Brain, Cpu, CheckCircle2, Info, Database, Microscope, ChevronRight } from 'lucide-react';

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

const MetricTooltip = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="relative group/tooltip flex items-center gap-1.5 cursor-pointer">
      <span className="text-xs font-bold uppercase tracking-wide border-b border-dashed border-current pb-0.5">{title}</span>
      <Info className="w-3.5 h-3.5 opacity-60 group-hover/tooltip:opacity-100 transition-opacity" />
      
      {/* Tooltip Content */}
      <div className="absolute bottom-full left-0 mb-3 w-72 p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none transform translate-y-2 group-hover/tooltip:translate-y-0">
        <h4 className="text-sm font-bold text-white mb-1.5 capitalize">{title}</h4>
        <p className="text-xs text-slate-300 font-normal normal-case tracking-normal leading-relaxed">{description}</p>
        <div className="absolute top-full left-6 -mt-1.5 border-[6px] border-transparent border-t-slate-700" />
      </div>
    </div>
  );
};

export default function BenchmarkTab() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
          <Trophy className="w-7 h-7 text-amber-500" />
          Industry Benchmarks
        </h2>
        <span className="px-3 py-1.5 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20">Investor Fact Sheet</span>
      </div>

      {/* Dataset & Standards explicit display for investors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500"><Database className="w-32 h-32 text-emerald-500" /></div>
          <h3 className="text-emerald-400 font-bold flex items-center gap-2 mb-3 text-lg"><Database className="w-5 h-5" /> Benchmark Dataset</h3>
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-black rounded-md border border-emerald-500/30">
              MKT-Bench-2026
            </div>
            <p className="text-sm text-slate-300">
              Tập dữ liệu độc quyền gồm <strong className="text-white">10,000 tasks marketing thực tế</strong> thu thập từ hơn 500 SMEs tại Việt Nam.
            </p>
            <ul className="text-xs text-slate-400 mt-2 space-y-1">
              <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-emerald-500" /> Đóng vai trò là "Ground Truth" cho ngành Martech VN.</li>
              <li className="flex items-center gap-1.5"><ChevronRight className="w-3 h-3 text-emerald-500" /> Bao gồm dữ liệu: Lập kế hoạch, Viết bài SEO, Kịch bản Video ngắn...</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-500"><Microscope className="w-32 h-32 text-purple-500" /></div>
          <h3 className="text-purple-400 font-bold flex items-center gap-2 mb-3 text-lg"><Microscope className="w-5 h-5" /> Scientific Standard</h3>
          <div className="space-y-2 relative z-10">
            <p className="text-sm text-slate-300">
              Đánh giá khắt khe theo chuẩn nghiên cứu khoa học NLP & AI Agent quốc tế, vượt qua các bài kiểm tra AI tạo sinh (GenAI) thông thường.
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-2 bg-black/30 rounded-lg border border-purple-500/20">
                <div className="text-[10px] text-purple-400 uppercase font-bold mb-0.5">Tiêu chí 1</div>
                <div className="text-xs text-white">Tự động hóa toàn trình (Autonomous)</div>
              </div>
              <div className="p-2 bg-black/30 rounded-lg border border-purple-500/20">
                <div className="text-[10px] text-purple-400 uppercase font-bold mb-0.5">Tiêu chí 2</div>
                <div className="text-xs text-white">Bám sát Brand Guidelines (DNA)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards with Tooltips */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-surface border border-linear-border rounded-xl p-5 hover:border-amber-500/50 transition-all group">
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <div className="p-1.5 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
              <Target className="w-4 h-4" />
            </div>
            <MetricTooltip 
              title="Task Completion (TCR)" 
              description="Tỷ lệ Hoàn thành Nhiệm vụ. Đo lường tỷ lệ các luồng công việc marketing phức tạp được giải quyết từ đầu đến cuối mà không cần con người can thiệp." 
            />
          </div>
          <div className="text-3xl font-black text-foreground">94.2%</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">+32.1% vượt trội Gen AI</div>
        </div>
        
        <div className="bg-linear-surface border border-linear-border rounded-xl p-5 hover:border-purple-500/50 transition-all group">
          <div className="flex items-center gap-2 text-purple-400 mb-3">
            <div className="p-1.5 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <Shield className="w-4 h-4" />
            </div>
            <MetricTooltip 
              title="Brand DNA Retention" 
              description="Tỷ lệ Giữ gìn Brand DNA. Mức độ văn bản và thiết kế sinh ra bám sát Tone of Voice, bảng màu và định vị cốt lõi của thương hiệu gốc." 
            />
          </div>
          <div className="text-3xl font-black text-foreground">98.5%</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">+22.7% vượt trội Marketing AI</div>
        </div>
        
        <div className="bg-linear-surface border border-linear-border rounded-xl p-5 hover:border-emerald-500/50 transition-all group">
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <div className="p-1.5 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <Zap className="w-4 h-4" />
            </div>
            <MetricTooltip 
              title="Time-To-Market (TTM)" 
              description="Thời gian ra mắt. Tính bằng tốc độ hoàn thiện một chiến dịch so với quy trình agency truyền thống (ví dụ: rút ngắn từ 2 tuần xuống còn 15 phút)." 
            />
          </div>
          <div className="text-3xl font-black text-foreground">95.0%</div>
          <div className="text-xs text-emerald-400 font-medium mt-1">Nhanh hơn 85% so với Martech</div>
        </div>
        
        <div className="bg-linear-surface border border-linear-border rounded-xl p-5 hover:border-blue-500/50 transition-all group">
          <div className="flex items-center gap-2 text-blue-400 mb-3">
            <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Brain className="w-4 h-4" />
            </div>
            <MetricTooltip 
              title="BLEU / ROUGE-L" 
              description="Tiêu chuẩn đánh giá NLP quốc tế. BLEU đo lường độ chính xác của từ vựng, ROUGE-L đo lường độ mạch lạc và ngữ cảnh sinh văn bản so với chuyên gia con người." 
            />
          </div>
          <div className="text-3xl font-black text-foreground">88.4</div>
          <div className="text-xs text-blue-400 font-medium mt-1">Chất lượng sinh ngữ cảnh chuẩn xác</div>
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
                <td className="px-6 py-5 text-xs text-linear-text-muted"><span className="px-2 py-1 rounded bg-black/30 border border-slate-700/50">Autonomous Workflow</span></td>
                <td className="px-6 py-5 font-mono text-xs text-slate-300">88.4 / 91.2</td>
                <td className="px-6 py-5 font-black text-amber-500">94.2</td>
                <td className="px-6 py-5 font-black text-amber-500">98.5</td>
                <td className="px-6 py-5"><span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">SOC2 / Private DB</span></td>
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
