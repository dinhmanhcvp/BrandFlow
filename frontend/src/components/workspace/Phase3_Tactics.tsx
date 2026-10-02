"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, PenSquare, Palette, Share2, Calculator, CheckCircle2, Zap, ArrowRight, Activity, Smartphone, Hash, Heart, MessageCircle, RefreshCw, LayoutTemplate, Type, Box, Network, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';

export default function Phase3_Tactics({ onNext, onBack, globalBudget }: { onNext: () => void, onBack: () => void, globalBudget: string }) {
  const { language } = useLanguage();
  const [activePanel, setActivePanel] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState<Record<number, boolean>>({});

  const { brandDNA, wizardAnswers } = useFormStore();
  const isBepNhaMoc = brandDNA?.brand_name?.includes('Nhà Mộc') || wizardAnswers?.company_name?.includes('Nhà Mộc');

  const contentMock = isBepNhaMoc ? {
    pillars: [
      {
        title: "Pillar 1: Trạm Sạc Chữa Lành (Mindful Dining)",
        angle: "Cơm trưa không chỉ để no bụng, mà là khoảnh khắc 'ngắt kết nối' để xoa dịu áp lực (burn-out) chốn công sở.",
        formats: ["Cinematic Video", "ASMR Reels", "Photo Quotes"],
        channels: ["TikTok", "Instagram", "Facebook"],
        example: "POV: 11h30 trưa sếp dí 3 cái deadline... nhưng bụng thì réo rắt. Ngồi xuống hít một hơi thật sâu, mở hộp cơm bã mía bốc khói, cảm nhận hương vị thân thuộc của mâm cơm nhà mẹ nấu. Mọi muộn phiền tan biến."
      },
      {
        title: "Pillar 2: Corporate Wellness (B2B Approach)",
        angle: "Bữa trưa dinh dưỡng là phúc lợi thiết thực nhất, giúp tăng 30% hiệu suất làm việc buổi chiều của nhân sự, hạn chế Food Coma.",
        formats: ["Infographic", "PR Article", "LinkedIn Carousel"],
        channels: ["LinkedIn", "Zalo OA", "PR"],
        example: "HR Managers có biết: 70% nhân sự thừa nhận họ bị buồn ngủ và mất tập trung vào lúc 2h chiều do bữa trưa nhiều tinh bột và bột ngọt? Khám phá giải pháp Corporate Catering từ Bếp Nhà Mộc."
      },
      {
        title: "Pillar 3: Xanh & Bền Vững (Eco-friendly)",
        angle: "100% sử dụng hộp bã mía phân huỷ sinh học, không dùng hộp xốp nhựa. Ăn ngon nhưng vẫn phải có trách nhiệm với môi trường.",
        formats: ["Behind the scenes", "Minigame", "UGC Reviews"],
        channels: ["Facebook Group", "Zalo Mini App"],
        example: "Thử thách 7 ngày ăn trưa không rác thải nhựa cùng Bếp Nhà Mộc! Chụp ảnh hộp bã mía sau khi dùng xong để nhận ngay mã FREESHIP cho tuần tới."
      }
    ]
  } : {
    pillars: [
      { title: "Pillar 1: Core Value", angle: "Optimize business performance", formats: ["Blog", "Video"], channels: ["LinkedIn", "FB"], example: "How to save 40% cost." }
    ]
  };

  const designMock = isBepNhaMoc ? {
    colors: [
      { hex: "#064E3B", name: "Deep Forest", usage: "Primary Brand, Logo, CTA" },
      { hex: "#B45309", name: "Amber Wood", usage: "Accents, Highlights" },
      { hex: "#FEF3C7", name: "Warm Cream", usage: "Backgrounds, Canvas" },
      { hex: "#166534", name: "Fresh Leaf", usage: "Icons, Secondary" }
    ],
    typography: {
      heading: "Playfair Display (Serif) - Sang trọng, chậm rãi, mang tính di sản.",
      body: "Inter (Sans-serif) - Rõ ràng, hiện đại, tối ưu đọc trên app Zalo/Mobile."
    },
    guidelines: [
      "Luôn sử dụng ánh sáng vàng ấm (Warm sunset/Golden hour) trong nhiếp ảnh.",
      "Food styling phải tự nhiên, mộc mạc, không dùng đạo cụ nhựa.",
      "Khoảng trắng (White space) chiếm tối thiểu 40% layout để tạo cảm giác 'thở'."
    ]
  } : {
    colors: [{ hex: "#000", name: "Black", usage: "Primary" }], typography: { heading: "Arial", body: "Arial" }, guidelines: ["Minimalism"]
  };

  const agentsMock = [
    {
      role: "Content Strategist Agent",
      avatar: "bg-pink-500",
      description: "Phân tích tâm lý dân văn phòng, lập ma trận nội dung đa nền tảng. Viết kịch bản ASMR TikTok và bài PR chuyên sâu trên LinkedIn.",
      status: "Active"
    },
    {
      role: "Creative Director Agent",
      avatar: "bg-purple-500",
      description: "Quản lý Visual DNA. Đảm bảo mọi ấn phẩm thiết kế, packaging (hộp bã mía) và photography (chụp ảnh món ăn) tuân thủ đúng mood & tone 'Chữa lành'.",
      status: "Active"
    },
    {
      role: "Performance Lead Agent",
      avatar: "bg-blue-500",
      description: "Tối ưu ngân sách chạy Ads. Setup phễu chuyển đổi (Conversion Funnel) từ Facebook/Zalo Ads đổ về Zalo Mini App. Theo dõi CPA và ROAS.",
      status: "Active"
    },
    {
      role: "B2B Growth Agent",
      avatar: "bg-emerald-500",
      description: "Crawl data và tiếp cận HR Managers của các doanh nghiệp lớn. Xây dựng chương trình dùng thử (Sampling) và chiết khấu Corporate Catering.",
      status: "Active"
    }
  ];

  const planMock = isBepNhaMoc ? [
    { 
      id: "TSK-01",
      name: "Tích hợp Zalo Mini App (Loyalty & Retention)", 
      phase: "Tháng 1-2", 
      lead: "Performance Lead", 
      budget: "65,000,000 VNĐ", 
      status: "Executing",
      kpis: "Giảm Churn Rate 20% | Đạt 5,000 users",
      details: "Xây dựng hệ thống Zalo Mini App dành riêng cho Bếp Nhà Mộc. Tích hợp tính năng đặt cơm nhóm, tự động hóa tin nhắn ZNS nhắc lịch ăn trưa, tặng voucher sinh nhật và lưu trữ lịch sử đơn hàng để phân tích sở thích."
    },
    { 
      id: "TSK-02",
      name: "Chiến dịch Hero Video: 'Trạm Sạc Chữa Lành'", 
      phase: "Tháng 1", 
      lead: "Creative Director", 
      budget: "50,000,000 VNĐ", 
      status: "Planning",
      kpis: "1M Views | 5% CTR | 200 Booking",
      details: "Sản xuất Cinematic Video khai thác câu chuyện 'Food Coma' chốn công sở và giải pháp từ Bếp Nhà Mộc. Phân phối tập trung trên TikTok (định dạng dọc) và Facebook Reels với ngân sách Ads mồi 15tr."
    },
    { 
      id: "TSK-03",
      name: "Booking 30 Lifestyle Micro-KOLs (Office/Food)", 
      phase: "Tháng 2-3", 
      lead: "Content Strategist", 
      budget: "100,000,000 VNĐ", 
      status: "Ready",
      kpis: "Reach 2M | 150 UGC | Tương tác 50K",
      details: "Tổ chức chiến dịch Review chân thực thông qua tệp Micro-KOLs là dân văn phòng thực thụ. Mục tiêu tạo hiệu ứng truyền miệng (Word of Mouth) tại các toà nhà văn phòng lớn (Bitexco, Landmark, Keangnam). Cung cấp mã giảm giá riêng cho từng KOL để đo lường chuyển đổi."
    },
    { 
      id: "TSK-04",
      name: "B2B Corporate Lunch Activation (Direct Sales)", 
      phase: "Tháng 3-4", 
      lead: "B2B Growth", 
      budget: "30,000,000 VNĐ", 
      status: "Queued",
      kpis: "Ký kết 15 Hợp đồng | LTV tăng 35%",
      details: "Chạy chiến dịch LinkedIn InMail kết hợp Tele-sales tiếp cận trực tiếp phòng Nhân sự/Công đoàn của các doanh nghiệp quy mô 50+ nhân sự. Cung cấp gói ăn trưa định kỳ (Corporate Subscription) kèm buổi ăn thử (Sampling) miễn phí tận văn phòng."
    }
  ] : [
    { id: "TSK-01", name: "Setup Hub", phase: "M1", lead: "Tech", budget: "30M", status: "Ready", kpis: "Done", details: "Core setup." }
  ];

  useEffect(() => {
    if (!hasGenerated[activePanel]) {
      setIsGenerating(true);
      const timer = setTimeout(() => {
        setIsGenerating(false);
        setHasGenerated(prev => ({...prev, [activePanel]: true}));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activePanel]);

  const tabs = [
    { id: 0, title: "Content Matrix", icon: PenSquare, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/30" },
    { id: 1, title: "Visual DNA", icon: Palette, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/30" },
    { id: 2, title: "AI Swarm", icon: Network, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { id: 3, title: "Action Plan", icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" }
  ];

  return (
    <div className="h-full w-full flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto z-10 relative overflow-hidden">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 shrink-0 gap-4">
        <div>
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-3 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Zap className="w-4 h-4 text-blue-400 animate-pulse mr-2" />
            <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">Multi-Agent Engine</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            Tactical Execution Hub
          </h2>
          <p className="text-linear-text-muted mt-2 font-medium text-sm md:text-base max-w-2xl">
            Kế hoạch chiến thuật chi tiết được xây dựng tự động bởi tổ hợp AI (AI Swarm) dựa trên kết quả Debate và Brand DNA.
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
            onClick={onNext} 
            className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold transition-all shadow-lg shadow-cyan-500/20 overflow-hidden flex-1 md:flex-none flex items-center justify-center"
          >
            <span className="relative z-10 flex items-center">
              Chuyển sang Execution <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex space-x-2 md:space-x-4 mb-6 shrink-0 overflow-x-auto no-scrollbar pb-2">
        {tabs.map((tab) => {
          const isActive = activePanel === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id)}
              className={`
                flex items-center px-6 py-3.5 rounded-2xl transition-all duration-300 whitespace-nowrap shrink-0 border
                ${isActive ? `bg-linear-surface/80 ${tab.border} shadow-xl scale-105` : 'bg-linear-surface/30 border-transparent hover:bg-linear-surface/50 opacity-70 hover:opacity-100'}
              `}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${isActive ? tab.bg : 'bg-slate-800/50'}`}>
                <tab.icon className={`w-5 h-5 ${isActive ? tab.color : 'text-slate-400'}`} />
              </div>
              <span className={`font-black text-sm uppercase tracking-wide ${isActive ? 'text-foreground' : 'text-slate-400'}`}>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* ── Dynamic Content Area ── */}
      <div className="flex-1 bg-linear-surface/40 backdrop-blur-md rounded-3xl p-6 md:p-10 overflow-y-auto no-scrollbar relative flex flex-col border border-linear-border/30 shadow-2xl">
        <AnimatePresence mode="wait">
          
          {/* TAB 0: CONTENT MATRIX */}
          {activePanel === 0 && (
            <motion.div key="p0" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="h-full flex flex-col relative gap-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground">Ma Trận Nội Dung (Content Matrix)</h3>
                <div className="flex items-center text-pink-400/80 text-xs font-bold tracking-widest uppercase bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20">
                  <PenSquare className="w-3 h-3 mr-2" /> Content Strategist Active
                </div>
              </div>
              
              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <RefreshCw className="w-10 h-10 text-pink-500 animate-spin mb-4" />
                  <p className="text-pink-400 font-bold tracking-widest uppercase text-sm animate-pulse">Phân tích Insight & Tạo Ma Trận...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {contentMock.pillars.map((pillar, i) => (
                    <div key={i} className="bg-background/60 border border-linear-border rounded-2xl p-6 flex flex-col shadow-lg hover:border-pink-500/30 transition-colors">
                      <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center mb-6 border border-pink-500/20">
                        <Type className="w-6 h-6 text-pink-400" />
                      </div>
                      <h4 className="text-xl font-black text-foreground mb-3">{pillar.title}</h4>
                      <p className="text-sm text-linear-text-muted mb-6 leading-relaxed flex-1">{pillar.angle}</p>
                      
                      <div className="space-y-4 pt-4 border-t border-linear-border/50">
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Định dạng & Kênh</div>
                          <div className="flex flex-wrap gap-2">
                            {pillar.formats.concat(pillar.channels).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-md">{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-pink-500/5 border border-pink-500/10 rounded-xl p-4">
                          <div className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-1">Ví dụ Copywriting</div>
                          <p className="text-xs text-foreground italic leading-relaxed">"{pillar.example}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 1: VISUAL DNA */}
          {activePanel === 1 && (
            <motion.div key="p1" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="h-full flex flex-col relative gap-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground">Bộ nhận diện Cốt lõi (Visual DNA)</h3>
                <div className="flex items-center text-purple-400/80 text-xs font-bold tracking-widest uppercase bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-500/20">
                  <Palette className="w-3 h-3 mr-2" /> Creative Director Active
                </div>
              </div>

              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <RefreshCw className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                  <p className="text-purple-400 font-bold tracking-widest uppercase text-sm animate-pulse">Thiết lập Brand Guidelines...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left: Colors & Typography */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="bg-background/60 border border-linear-border rounded-2xl p-6">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Color Palette</h4>
                      <div className="space-y-4">
                        {designMock.colors.map(c => (
                          <div key={c.hex} className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl shadow-inner border border-black/10 shrink-0" style={{backgroundColor: c.hex}} />
                            <div>
                              <div className="font-bold text-foreground text-sm">{c.name}</div>
                              <div className="text-xs text-linear-text-muted font-mono mt-1">{c.hex} • {c.usage}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-background/60 border border-linear-border rounded-2xl p-6">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Typography</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-purple-400 font-bold mb-1">Heading Font</div>
                          <div className="text-sm text-foreground font-medium">{designMock.typography.heading}</div>
                        </div>
                        <div>
                          <div className="text-xs text-purple-400 font-bold mb-1">Body Font</div>
                          <div className="text-sm text-foreground font-medium">{designMock.typography.body}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Moodboard & Rules */}
                  <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="bg-background/60 border border-linear-border rounded-2xl p-6 h-full flex flex-col">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Art Direction & Photography</h4>
                      <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 relative group border border-linear-border">
                        {isBepNhaMoc ? (
                          <img src="/assets/bep-nha-moc/banner.jpg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Moodboard" />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500">Placeholder Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                          <span className="text-white font-bold text-sm tracking-wide">Cinematic Sunset Lighting Concept</span>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Creative Guidelines</h4>
                      <ul className="space-y-3">
                        {designMock.guidelines.map((rule, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-foreground bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
                            <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: AGENT SWARM */}
          {activePanel === 2 && (
            <motion.div key="p2" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="h-full flex flex-col relative gap-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground">Biệt Đội AI Triển Khai (AI Agent Swarm)</h3>
                <div className="flex items-center text-blue-400/80 text-xs font-bold tracking-widest uppercase bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                  <Network className="w-3 h-3 mr-2" /> System Orchestrator Active
                </div>
              </div>

              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                  <p className="text-blue-400 font-bold tracking-widest uppercase text-sm animate-pulse">Deploying Agent Swarm...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agentsMock.map((agent, i) => (
                    <div key={i} className="bg-background/60 border border-linear-border rounded-2xl p-6 flex gap-6 hover:border-blue-500/30 transition-colors shadow-lg">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${agent.avatar}/10 border border-${agent.avatar.replace('bg-', '')}/30`}>
                        <Bot className={`w-8 h-8 text-${agent.avatar.replace('bg-', '')}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-black text-foreground">{agent.role}</h4>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" /> {agent.status}
                          </span>
                        </div>
                        <p className="text-sm text-linear-text-muted leading-relaxed">{agent.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: ACTION PLAN */}
          {activePanel === 3 && (
            <motion.div key="p3" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="h-full flex flex-col relative gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground">Kế Hoạch Hành Động (Action Plan)</h3>
                <div className="flex items-center text-emerald-400/80 text-xs font-bold tracking-widest uppercase bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <Activity className="w-3 h-3 mr-2" /> Planner Active
                </div>
              </div>

              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                  <p className="text-emerald-400 font-bold tracking-widest uppercase text-sm animate-pulse">Scheduling Tasks & KPIs...</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-4">
                  {planMock.map((task, i) => (
                    <div key={i} className="bg-background/60 border border-linear-border rounded-2xl p-5 hover:border-emerald-500/30 transition-all group shadow-md flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold rounded font-mono">{task.id}</span>
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider border border-emerald-500/20">{task.phase}</span>
                        </div>
                        <h4 className="text-lg font-black text-foreground mb-2">{task.name}</h4>
                        <p className="text-sm text-linear-text-muted leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">{task.details}</p>
                      </div>

                      <div className="w-full lg:w-auto grid grid-cols-2 lg:flex lg:flex-row gap-4 lg:gap-8 shrink-0 border-t lg:border-t-0 lg:border-l border-linear-border/50 pt-4 lg:pt-0 lg:pl-8">
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Assignee</div>
                          <div className="flex items-center text-sm font-bold text-cyan-400"><Bot className="w-3.5 h-3.5 mr-1.5" /> {task.lead}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Ngân sách</div>
                          <div className="text-sm font-bold text-foreground">{task.budget}</div>
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">KPI Cam kết</div>
                          <div className="text-sm font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded inline-block">{task.kpis}</div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
