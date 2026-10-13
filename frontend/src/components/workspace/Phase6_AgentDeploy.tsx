"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, CheckCircle, Database, Shield, Terminal, Cpu, Network, 
  Lock, MessageSquare, ArrowRight, Activity, Server, FileJson, 
  Layers, RefreshCw, Layout, Send, Sparkles, CheckCircle2, 
  AlertTriangle, Copy, Check, Globe, Smartphone, QrCode, Sliders
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  sourceDoc?: string;
  confidence?: number;
}

export default function Phase6_AgentDeploy({ onNext, onBack }: { onNext: () => void, onBack?: () => void }) {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      text: 'Dạ, Mộc chào anh/chị ạ! 🌿 Em là Trợ lý AI của Bếp Nhà Mộc, đã được đồng bộ 100% dữ liệu thực đơn di sản, chính sách suất ăn doanh nghiệp B2B và quy trình bếp trung tâm. Anh/chị có thể thử đặt câu hỏi kiểm tra nghiệp vụ bên dưới nhé!',
      timestamp: '11:00',
      sourceDoc: 'brand_dna_bep_nha_moc.json',
      confidence: 100
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Pre-configured questions
  const SAMPLE_QUESTIONS = [
    {
      q: 'Tôi muốn đặt 40 suất cơm niêu cho công ty ở Keangnam trưa nay?',
      ans: 'Dạ vâng ạ! 🌿 Với đơn 40 suất giao tới Keangnam Phạm Hùng (bán kính 1.8km), Bếp Nhà Mộc hoàn toàn đáp ứng được trọn vẹn trong khung giờ 11h15 - 11h45.\n\n🍱 Mộc áp dụng ưu đãi Đơn nhóm công ty:\n• Chiết khấu trực tiếp 15% trên giá thực đơn\n• Tặng kèm 40 phần canh cua mồng tơi & chè sen tráng miệng\n• Suất ăn đựng trong hộp bã mía sinh học 100% giữ nóng hổi 60°C.\n\nAnh/chị cho Mộc xin số Zalo để chuyên viên gửi menu chọn món và xuất hóa đơn đỏ VAT cho công ty ngay nhé ạ!',
      source: 'chinh_sach_hop_dong_b2b.docx · Trang 2',
      conf: 99.4
    },
    {
      q: 'Thực đơn trưa nay có món thanh đạm cho người ăn chay không?',
      ans: 'Dạ có ạ! 🌾 Thực đơn Chữa Lành hôm nay nhà Mộc có món Đậu Hũ Sốt Nấm Niêu Đất và Canh Rong Biển Hạt Sen thanh ngọt. Cơm được nấu từ gạo lứt hoặc gạo ST25 mộc mạc nguyên cám.\n\nToàn bộ đồ chay của Mộc được nấu riêng bằng niêu gang độc lập, không dính dầu mỡ động vật nên anh/chị an tâm 100% nhé ạ!',
      source: 'menu_thuc_don_mua_he.pdf · Trang 5',
      conf: 98.8
    },
    {
      q: 'Bên bạn có xuất hóa đơn đỏ VAT và cho thanh toán cuối tháng không?',
      ans: 'Dạ có đầy đủ 100% ạ! 📑 Bếp Nhà Mộc xuất hóa đơn điện tử VAT đầy đủ theo mã số thuế doanh nghiệp.\n\nVới các công ty ký Hợp đồng cung ứng cơm tháng (từ 20 suất/ngày trở lên), Mộc hỗ trợ chính sách đối soát công nợ linh hoạt vào ngày cuối cùng của tháng, kèm biên bản giao nhận suất ăn có chữ ký shipper nội bộ ạ.',
      source: 'quy_che_phap_ly_b2b.pdf · Điều 4',
      conf: 100
    }
  ];

  const handleSendPrompt = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Find match or generate context-aware answer
    const matched = SAMPLE_QUESTIONS.find(sq => sq.q.toLowerCase().includes(text.toLowerCase()) || text.toLowerCase().includes(sq.q.slice(0, 15).toLowerCase()));

    setTimeout(() => {
      const agentMsg: ChatMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        text: matched ? matched.ans : `Dạ Mộc đã ghi nhận câu hỏi của anh/chị về "${text}". 🌿\n\nToàn bộ thông tin thực đơn gạo ST25, hộp bã mía sinh học và chính sách giao cơm văn phòng bán kính 2km Duy Tân đều sẵn sàng phục vụ. Anh/chị có thể để lại số Zalo để Mộc hỗ trợ gửi menu chi tiết nhé ạ!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        sourceDoc: matched ? matched.source : 'knowledge_base_rag_master.json',
        confidence: matched ? matched.conf : 97.2
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1100);
  };

  // ── Vector Knowledge Base ──
  const VECTOR_KNOWLEDGE = [
    {
      name: 'menu_bep_nha_moc_2026.pdf',
      vectors: '68 Vectors',
      accuracy: '99.4%',
      status: 'Indexed & Ready',
      desc: 'Menu cơm niêu 4 mùa, định lượng calo, thành phần món ăn'
    },
    {
      name: 'quy_chuan_ve_sinh_an_toan_bep.pdf',
      vectors: '42 Vectors',
      accuracy: '100%',
      status: 'Indexed & Ready',
      desc: 'Quy trình kiểm thực 3 bước, nhiệt độ hộp bã mía 120°C'
    },
    {
      name: 'chinh_sach_hop_dong_b2b_doanh_nghiep.docx',
      vectors: '35 Vectors',
      accuracy: '98.7%',
      status: 'Indexed & Ready',
      desc: 'Bảng giá chiết khấu 15%, hóa đơn VAT, thanh toán cuối tháng'
    },
    {
      name: 'kich_ban_cs_khach_hang_zalo_oa.csv',
      vectors: '110 Cặp Q&A',
      accuracy: '99.8%',
      status: 'Indexed & Ready',
      desc: 'Xưng hô "Mộc", giọng điệu chữa lành, xử lý khiếu nại ship chậm'
    }
  ];

  // ── Operational Guardrails ──
  const GUARDRAILS = [
    {
      title: 'Khóa trần công suất bếp 120 suất/h',
      status: 'Enforced',
      rule: 'Nếu số lượng đơn trong khung giờ 11h15 - 12h00 chạm mốc 120 suất, AI tự động thông báo hẹn lùi 20 phút để bảo toàn chất lượng.'
    },
    {
      title: 'Giới hạn bán kính giao nhanh 3km',
      status: 'Enforced',
      rule: 'Khách hàng ngoài bán kính 3km Duy Tân được thông báo nguy cơ giảm nhiệt độ cơm, đề xuất đặt trước tối thiểu 60 phút.'
    },
    {
      title: 'Chuyển tuyến B2B Concierge (> 30 suất)',
      status: 'Active',
      rule: 'Đơn tiệc doanh nghiệp trên 2.000.000đ tự động tạo lead trên CRM và thông báo quản lý nhà hàng gọi điện tư vấn trực tiếp.'
    }
  ];

  return (
    <div className="w-full min-h-full flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto z-10 relative pb-20">
      
      {/* ── 1. HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-300 mb-2.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Trung Tâm Triển Khai & Điều Phối Trợ Lý AI · BrandFlow
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Đóng Gói & Triển Khai Trợ Lý AI Doanh Nghiệp (Mộc Assistant)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-xs md:text-sm font-medium max-w-3xl leading-relaxed">
            Mô hình ngôn ngữ tinh chỉnh chuyên sâu ngành F&B, đồng bộ 100% Brand DNA Bếp Nhà Mộc. Hệ thống tích hợp RAG truy xuất thực đơn thời gian thực và khóa an toàn nghiệp vụ chống quá tải bếp.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={onBack} 
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all text-xs flex items-center justify-center cursor-pointer shadow-sm"
          >
            <ArrowRight className="w-4 h-4 mr-1.5 rotate-180" /> Quay lại (Phase 5)
          </button>
          
          {onNext && (
            <button 
              onClick={onNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center group cursor-pointer"
            >
              Xem Báo Cáo Chiến Lược (Phase 7)
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* ── 2. MODEL CORE HUD (5 KEY SPECS) ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-8">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Kiến Trúc Mô Hình</span>
          <span className="text-sm font-black text-slate-900 dark:text-white font-mono truncate">BrandFlow-Llama3-F&B</span>
          <span className="text-[10px] text-emerald-600 font-bold mt-1">✓ Fine-tuned chuyên sâu</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Độ Trễ Phản Hồi</span>
          <span className="text-xl font-black text-cyan-600 dark:text-cyan-400 font-mono">420ms</span>
          <span className="text-[10px] text-slate-500 mt-1">Edge Cluster Hà Nội</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Cửa Sổ Ngữ Cảnh</span>
          <span className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">32K Tokens</span>
          <span className="text-[10px] text-slate-500 mt-1">Chứa toàn bộ Menu & CRM</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Độ Chuẩn Guardrails</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">99.8%</span>
          <span className="text-[10px] text-emerald-600 font-bold mt-1">✓ Khóa trần 120 suất/h</span>
        </div>

        <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Trạng Thái Kết Nối</span>
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            Zalo OA Webhook Live
          </span>
          <span className="text-[10px] text-slate-500 mt-1">Sẵn sàng nhận khách</span>
        </div>

      </div>

      {/* ── 3. TWO-COLUMN OPERATIONAL CONSOLE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">

        {/* LEFT COLUMN (Cols 1-5): RAG KNOWLEDGE BASE & OPERATIONAL GUARDRAILS */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* 1. Vector Knowledge Base Inspection */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold block">
                  Cơ Sở Tri Thức Vector (RAG Vector Store)
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  Dữ Liệu Đã Nạp & Indexing
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                100% Hoàn tất
              </span>
            </div>

            <div className="space-y-3">
              {VECTOR_KNOWLEDGE.map((vk, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono truncate max-w-[220px]">
                      {vk.name}
                    </span>
                    <span className="text-[10px] font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {vk.vectors} · {vk.accuracy}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {vk.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Operational Guardrails Policy */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400 font-bold block">
                  Khóa An Toàn Nghiệp Vụ (Guardrails)
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  Quy Tắc Vận Hành Bếp Bắt Buộc
                </h3>
              </div>
              <Shield className="w-5 h-5 text-purple-600" />
            </div>

            <div className="space-y-3">
              {GUARDRAILS.map((gr, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-purple-900 dark:text-purple-300">
                      {gr.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
                      {gr.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    {gr.rule}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Cols 6-12): LIVE INTERACTIVE AI TEST SANDBOX */}
        <div className="lg:col-span-7 flex flex-col">
          
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[680px]">
            
            {/* Sandbox Header */}
            <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      Mộc Assistant · Live Sandbox Test
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Môi trường kiểm thử tương tác thực tế · Phản hồi chuẩn Brand Voice
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMessages([messages[0]])}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              >
                Xóa lịch sử chat
              </button>
            </div>

            {/* Quick Sample Questions Bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Hỏi thử:</span>
              {SAMPLE_QUESTIONS.map((sq, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleSendPrompt(sq.q)}
                  disabled={isTyping}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  💡 {sq.q}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div 
              ref={chatScrollRef}
              className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[10px] font-bold text-slate-400">
                      {msg.sender === 'user' ? 'Khách Hàng Văn Phòng' : 'Mộc Assistant (AI)'}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className={`p-4 rounded-2xl max-w-[85%] text-xs md:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-xs shadow-md'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-slate-700 shadow-md'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Source Doc Citation */}
                    {msg.sourceDoc && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>🔍 Trích xuất: <strong>{msg.sourceDoc}</strong></span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Độ tin cậy: {msg.confidence}%</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                  </div>
                  <span className="font-medium animate-pulse">Mộc Assistant đang tra cứu Menu & tạo câu trả lời...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendPrompt(); }}
              className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập câu hỏi kiểm tra nghiệp vụ cho Mộc Assistant..."
                disabled={isTyping}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Gửi</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* ── 4. OMNICHANNEL DEPLOYMENT INTEGRATIONS (4 CHANNELS) ── */}
      <div>
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">
              Cổng Triển Khai Đa Kênh (Omnichannel Deploy Targets)
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Đồng Bộ Hóa Điểm Tiếp Xúc Khách Hàng
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">API Webhook v2.4</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">📱</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Đang chạy
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Zalo OA & Mini App</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Tự động tư vấn thực đơn, chốt đơn nhóm và gửi thông báo ZNS nhắc giờ ăn trưa.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-emerald-600 font-bold">
              Webhook: /api/zalo-bot
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">🌐</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  Sẵn sàng nhúng
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Website Floating Widget</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Cửa sổ chat trực tiếp trên trang chủ bepnhamoc.vn cho khách hàng doanh nghiệp đặt tiệc.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400">
              Snippet: &lt;script src="..."&gt;
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">📘</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Chờ liên kết Page
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Facebook Messenger</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Phản hồi bình luận quảng cáo Meta Ads tự động và điều hướng khách vào inbox nhận ưu đãi.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400">
              Chờ cấp Page Token
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">💻</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Đã đồng bộ API
                </span>
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">POS KiotViet / Ocha</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Tự động đẩy đơn hàng thành công về máy in hóa đơn bếp trung tâm và trừ kho nguyên liệu.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-emerald-600 font-bold">
              API Webhook Active
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
