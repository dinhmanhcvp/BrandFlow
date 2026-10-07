import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, CheckCircle2, XCircle, AlertTriangle, FileText, ArrowLeft, Activity, Scissors, TrendingDown, ShieldCheck, Cpu, LayoutDashboard, UploadCloud, Target, PenTool, Calendar } from 'lucide-react';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';

function BudgetCutHighlight({ text }: { text: string }) {
  const cutPattern = /(Cắt hẳn|Ép giá|cut|reduce|cắt|giảm):\s*(.+?)(?:\s*\(-?([\d,.]+)\s*VND\))/gi;
  const matches = [...text.matchAll(cutPattern)];
  if (matches.length === 0) return <span>{text}</span>;

  let lastIndex = 0;
  const parts: React.ReactNode[] = [];
  matches.forEach((match, idx) => {
    const beforeText = text.slice(lastIndex, match.index);
    if (beforeText) parts.push(<span key={`before-${idx}`}>{beforeText}</span>);

    const action = match[1];
    const itemName = match[2];
    const amount = match[3];
    const isCut = action.toLowerCase().includes('cắt') || action.toLowerCase().includes('cut');

    parts.push(
      <span key={`cut-${idx}`} className="relative inline-flex items-center group cursor-help mx-1">
        <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-semibold ${isCut ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-orange-500/15 text-orange-400 border border-orange-500/20'}`}>
          {isCut ? <XCircle className="w-3 h-3" /> : <Scissors className="w-3 h-3" />}
          <span className={isCut ? 'line-through decoration-red-500/80' : ''}>{itemName.trim()}</span>
          <span className="font-mono opacity-70">-{amount}đ</span>
        </motion.span>
      </span>
    );
    lastIndex = (match.index || 0) + match[0].length;
  });
  const remaining = text.slice(lastIndex);
  if (remaining) parts.push(<span key="remaining">{remaining}</span>);
  return <>{parts}</>;
}

function TypewriterEffect({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 2));
      i += 2;
      if (i >= text.length) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [text]);
  return <BudgetCutHighlight text={displayedText} />;
}

export default function CinematicDebateMock({ onNext }: { onNext: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const MOCK_DEBATE = [
    { id: 0, agent: 'CMO', type: 'proposal', text: 'Đề xuất chiến dịch "Chữa Lành Buổi Trưa". \nNgân sách: 15,000,000 VND chạy Facebook Ads nhắm khách hàng khu vực Cầu Giấy và Hà Đông. \nMục tiêu: Tăng độ nhận diện thương hiệu, kéo khách hàng mới và tăng trưởng doanh thu quý. Tập trung truyền thông 100% hộp bã mía thân thiện môi trường.' },
    { id: 1, agent: 'CFO', type: 'budget_cut', text: '❌ Cảnh báo Ép giá: Facebook Ads (-8,000,000 VND).\nNgân sách tổng chỉ 25 triệu/tháng. Lợi nhuận gộp hiện tại rất mỏng (8-12%). Việc đốt 15 triệu vào Ads với CAC cao sẽ không đủ bù vốn. Đề nghị cắt giảm quảng cáo diện rộng, tập trung vào kênh 0 đồng.' },
    { id: 2, agent: 'Customer', type: 'warning', text: 'Phân tích Data Khách Hàng: Chân dung khách hàng chính là dân văn phòng bị burn-out. Họ lướt Facebook nhưng không đưa ra quyết định mua hàng ngay lúc đó. Họ thường chốt đơn vào lúc 10h-11h sáng qua nhóm chat Zalo của công ty.' },
    { id: 3, agent: 'COO', type: 'proposal', text: 'Đồng ý với Customer Agent. Năng lực bếp hiện tại (28 nhân sự) có thể đáp ứng giao hỏa tốc 30 phút, nhưng nếu nổ quá nhiều đơn lẻ rải rác từ Facebook, chúng ta sẽ vỡ vận hành giờ cao điểm.\nNên nhắm vào đơn nhóm.' },
    { id: 4, agent: 'CMO', type: 'proposal', text: 'Đã nhận phản hồi. Pivot chiến lược:\nChuyển ngân sách 7,000,000 VND sang Zalo Broadcast Promo. \nTạo mã giảm giá nhóm (từ 5 phần trở lên). \nThay vì chạy Ads kéo khách mới mù quáng, chúng ta sẽ làm Loyalty Program trên Zalo Mini App để giữ chân khách cũ.' },
    { id: 5, agent: 'SYSTEM', type: 'approved', text: '✅ Consensus Reached.\nChiến lược đã được xác nhận. Ngân sách sẽ phân bổ ưu tiên cho kênh Zalo Broadcast và App Promo nội bộ, kết hợp chốt đơn nhóm. Hệ thống sẽ tiến hành khởi tạo Gantt Chart và P&L tự động.' }
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < MOCK_DEBATE.length) {
        setMessages(prev => [...prev, MOCK_DEBATE[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setIsLocked(true), 1500);
        setTimeout(() => onNext(), 4000);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  const getAgentTheme = (agent: string, type: string) => {
    if (type === 'warning') return { bg: 'bg-red-500/5', border: 'border-red-500/20', text: 'text-red-400', iconBg: 'bg-red-500/20', icon: AlertTriangle };
    if (type === 'budget_cut') return { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-400', iconBg: 'bg-amber-500/20', icon: Scissors };
    if (agent === 'CMO') return { bg: 'bg-blue-500/5', border: 'border-blue-500/20', text: 'text-blue-400', iconBg: 'bg-blue-500/20', icon: Bot };
    if (agent === 'Customer') return { bg: 'bg-cyan-500/5', border: 'border-cyan-500/20', text: 'text-cyan-400', iconBg: 'bg-cyan-500/20', icon: Bot };
    if (agent === 'CFO') return { bg: 'bg-orange-500/5', border: 'border-orange-500/20', text: 'text-orange-400', iconBg: 'bg-orange-500/20', icon: TrendingDown };
    if (agent === 'COO') return { bg: 'bg-purple-500/5', border: 'border-purple-500/20', text: 'text-purple-400', iconBg: 'bg-purple-500/20', icon: Bot };
    if (agent === 'SALES') return { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-400', iconBg: 'bg-emerald-500/20', icon: Bot };
    return { bg: 'bg-slate-800/20', border: 'border-slate-700/50', text: 'text-slate-300', iconBg: 'bg-slate-800/50 border border-slate-700', icon: ShieldCheck };
  };

  const getStatusBadge = (type: string) => {
    switch (type) {
      case 'rejected': return <span className="flex items-center text-[9px] uppercase font-bold text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded ml-2 border border-red-800/50"><XCircle className="w-2.5 h-2.5 mr-1" /> REJECTED</span>;
      case 'warning': return <span className="flex items-center text-[9px] uppercase font-bold text-orange-400 bg-orange-900/30 px-1.5 py-0.5 rounded ml-2 border border-orange-800/50"><AlertTriangle className="w-2.5 h-2.5 mr-1" /> WARNING</span>;
      case 'budget_cut': return <span className="flex items-center text-[9px] uppercase font-bold text-amber-400 bg-amber-900/30 px-1.5 py-0.5 rounded ml-2 border border-amber-800/50"><Scissors className="w-2.5 h-2.5 mr-1" /> CUT</span>;
      case 'approved': return <span className="flex items-center text-[9px] uppercase font-bold text-cyan-400 bg-cyan-900/30 px-1.5 py-0.5 rounded ml-2 border border-cyan-800/50"><CheckCircle2 className="w-2.5 h-2.5 mr-1" /> APPROVED</span>;
      default: return null;
    }
  };

  const currentMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const historyMsgs = messages.slice(0, -1);

  return (
    <div className="absolute inset-0 flex bg-transparent text-slate-300 font-inter text-sm z-10">
      <div className="w-64 bg-[#0B1120]/50 backdrop-blur-md border-r border-slate-800 flex flex-col z-20 shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 text-cyan-400 rounded-full border-2 border-cyan-400 flex items-center justify-center shrink-0 font-bold">BF</div>
          <span className="font-space font-bold text-lg text-white">BrandFlow</span>
        </div>
        <div className="flex-1 px-4 space-y-2 mt-4 font-medium text-sm">
            <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
               <span className="w-5 h-5 block" /> Dashboard
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
               <span className="w-5 h-5 block" /> Data Ingestion
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl transition-colors bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
               <span className="w-5 h-5 block border-2 border-cyan-400 rounded" /> AI Strategy
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
               <span className="w-5 h-5 block" /> Content Lab
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
               <span className="w-5 h-5 block" /> Gantt & Finance
            </div>
        </div>
      </div>

      <div className="flex-1 w-full h-full flex flex-col relative bg-transparent overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex-none p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full z-10">
          <div className="flex items-center justify-between mb-4">
            <button className="text-slate-400 hover:text-white transition-colors flex items-center text-sm font-semibold border border-slate-700/50 bg-slate-800/30 py-2 px-4 rounded-lg shadow-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> <span>Back</span>
            </button>
            
            <div className="flex items-center space-x-2 bg-slate-900/50 border border-slate-700/50 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
              <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Agent Network Active</span>
            </div>
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space tracking-tight">Debate Kernel (Stage 2)</h2>
            <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl mx-auto">AI Agents đang phản biện chéo để tìm ra chiến lược tối ưu nhất.</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-8 flex flex-col lg:flex-row gap-6 min-h-0">
          
          <div className="w-full lg:w-3/5 h-full flex flex-col relative">
            <div className="flex-1 border border-slate-700/50 relative overflow-hidden flex flex-col bg-slate-900/40 shadow-2xl rounded-2xl">
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-3/4 h-3/4 bg-cyan-500/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-1/2 h-1/2 bg-blue-500/10 blur-[80px] rounded-full"></div>
              </div>

              <div className="p-4 border-b border-slate-700/40 bg-slate-900/60 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-500" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Live Analysis Node</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
              </div>

              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative z-10">
                {!currentMsg && !isLocked ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg relative overflow-hidden">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-transparent border-t-cyan-500 rounded-2xl"></motion.div>
                      <Activity className="w-8 h-8 text-cyan-500 animate-pulse" />
                    </div>
                    <div className="text-sm font-bold text-cyan-500 tracking-widest uppercase animate-pulse">Initializing Sub-Agents...</div>
                  </div>
                ) : currentMsg && !isLocked ? (
                  <AnimatePresence mode="wait">
                    <motion.div key={currentMsg.id} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }} transition={{ duration: 0.4 }} className="flex flex-col h-full">
                      <div className="flex items-center mb-6">
                        <div className={`w-14 h-14 rounded-2xl ${getAgentTheme(currentMsg.agent, currentMsg.type).iconBg} flex items-center justify-center border border-white/10 shadow-lg relative`}>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                          {React.createElement(getAgentTheme(currentMsg.agent, currentMsg.type).icon, { className: `w-7 h-7 ${getAgentTheme(currentMsg.agent, currentMsg.type).text}` })}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <h3 className={`text-xl font-black uppercase tracking-wider ${getAgentTheme(currentMsg.agent, currentMsg.type).text}`}>{currentMsg.agent} Agent</h3>
                            {getStatusBadge(currentMsg.type)}
                          </div>
                          <p className="text-xs font-mono text-slate-500">Executing evaluation protocol...</p>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div className={`text-lg md:text-xl font-medium leading-relaxed text-white whitespace-pre-wrap ${currentMsg.type === 'budget_cut' ? 'text-amber-100' : ''}`}>
                          <TypewriterEffect text={currentMsg.text} />
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : isLocked ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center h-full">
                    <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">Debate Concluded</h3>
                    <p className="text-slate-400 mb-8 max-w-sm">All sub-agents have reached consensus. The strategic plan is ready for final review.</p>
                  </motion.div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5 h-64 lg:h-full flex flex-col bg-slate-900/30 border border-slate-700/40 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-3 border-b border-slate-700/30 bg-slate-900/50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Communication Log</span>
              <span className="text-[10px] font-mono text-slate-500">{historyMsgs.length} Entries</span>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              <AnimatePresence initial={false}>
                {historyMsgs.map((msg) => {
                  const theme = getAgentTheme(msg.agent, msg.type);
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, x: -20, height: 0 }} animate={{ opacity: 1, x: 0, height: 'auto' }} className={`p-3 rounded-xl border ${theme.border} ${theme.bg} flex gap-3 opacity-60 hover:opacity-100 transition-opacity`}>
                      <div className={`w-8 h-8 rounded-lg ${theme.iconBg} flex items-center justify-center shrink-0`}>
                        {React.createElement(theme.icon, { className: `w-4 h-4 ${theme.text}` })}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-[10px] font-bold uppercase ${theme.text}`}>{msg.agent}</span>
                          <span className="text-[9px] font-mono text-slate-600">Archived</span>
                        </div>
                        <div className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{msg.text}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
