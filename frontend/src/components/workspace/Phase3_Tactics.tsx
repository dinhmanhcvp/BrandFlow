"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, PenSquare, Palette, Share2, Calculator, CheckCircle2, Zap, ArrowRight, Activity, Smartphone, Hash, Heart, MessageCircle, RefreshCw, LayoutTemplate, Type, Box, Network, Users, Calendar, Clock, Target, AlignLeft, CheckSquare, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';

export default function Phase3_Tactics({ onNext, onBack, globalBudget }: { onNext: () => void, onBack: () => void, globalBudget: string }) {
  const { language } = useLanguage();
  const [activePanel, setActivePanel] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState<Record<number, boolean>>({});

  const { brandDNA, wizardAnswers, businessIntent } = useFormStore();
  const isBepNhaMoc = brandDNA?.brand_name?.includes('Nhà Mộc') || wizardAnswers?.company_name?.includes('Nhà Mộc');

  let totalBudget = 500000000; 
  if (businessIntent?.mode === 'budget_first' && businessIntent?.budget) {
    totalBudget = businessIntent.budget;
  } else if (businessIntent?.mode === 'idea_first') {
    totalBudget = 1500000000; 
  }

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(1) + ' Tỷ';
    if (val >= 1000000) return (val / 1000000).toFixed(0) + 'M';
    return val.toLocaleString() + 'đ';
  };

  const contentMock = isBepNhaMoc ? {
    pillars: [
      {
        title: "Trạm Sạc Chữa Lành (Mindful Dining)",
        angle: "Cơm trưa không chỉ để no bụng, mà là khoảnh khắc 'ngắt kết nối' để xoa dịu áp lực (burn-out) chốn công sở.",
        tone: "Nhẹ nhàng, thấu hiểu, mang tính trị liệu",
        formats: ["Cinematic Video", "ASMR Reels", "Photo Quotes"],
        channels: ["TikTok", "Instagram", "Facebook"],
        example: "POV: 11h30 trưa sếp dí 3 cái deadline... nhưng bụng thì réo rắt. Ngồi xuống hít một hơi thật sâu, mở hộp cơm bã mía bốc khói, cảm nhận hương vị thân thuộc của mâm cơm nhà mẹ nấu. Mọi muộn phiền tan biến."
      },
      {
        title: "Corporate Wellness (B2B Approach)",
        angle: "Bữa trưa dinh dưỡng là phúc lợi thiết thực nhất, giúp tăng 30% hiệu suất làm việc buổi chiều của nhân sự.",
        tone: "Chuyên nghiệp, khoa học, đáng tin cậy",
        formats: ["Infographic", "PR Article", "LinkedIn Carousel"],
        channels: ["LinkedIn", "Zalo OA", "Báo chí"],
        example: "HR Managers có biết: 70% nhân sự thừa nhận họ bị buồn ngủ và mất tập trung vào lúc 2h chiều do bữa trưa nhiều tinh bột và bột ngọt? Khám phá giải pháp Corporate Catering từ Bếp Nhà Mộc."
      },
      {
        title: "Xanh & Bền Vững (Eco-friendly)",
        angle: "100% sử dụng hộp bã mía phân huỷ sinh học. Ăn ngon nhưng vẫn phải có trách nhiệm với môi trường.",
        tone: "Truyền cảm hứng, tích cực, kêu gọi hành động",
        formats: ["Behind the scenes", "Minigame", "UGC Reviews"],
        channels: ["Facebook Group", "Zalo Mini App"],
        example: "Thử thách 7 ngày ăn trưa không rác thải nhựa cùng Bếp Nhà Mộc! Chụp ảnh hộp bã mía sau khi dùng xong để nhận ngay mã FREESHIP cho tuần tới."
      },
      {
        title: "Tinh Hoa Nguyên Bản (Heritage Ingredients)",
        angle: "Tôn vinh nguồn gốc nguyên liệu bản địa, từ hạt gạo ST25 đến nước mắm cốt nhĩ cá cơm 40 độ đạm.",
        tone: "Tự hào, hoài niệm, chân thực",
        formats: ["Documentary Short", "Macro Photography", "Storytelling Series"],
        channels: ["YouTube Shorts", "Instagram", "Website"],
        example: "Bạn có biết bí mật đằng sau thố cơm niêu giòn rụm? Đó là sự kết hợp của hạt gạo lúa tôm Sóc Trăng và chiếc niêu đất nung thủ công từ làng gốm Bàu Trúc. 120 phút lửa than đượm nồng chỉ để đổi lấy nụ cười của bạn."
      }
    ]
  } : {
    pillars: [
      { title: "Core Value", angle: "Optimize business performance", tone: "Professional", formats: ["Blog", "Video"], channels: ["LinkedIn", "FB"], example: "How to save 40% cost." }
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
      name: "Tích hợp Zalo Mini App (Loyalty & CRM)", 
      phase: "Tháng 1-2", 
      lead: "Performance Lead", 
      budget: `${formatCurrency(totalBudget * 0.15)}`, 
      status: "Executing",
      progress: 65,
      kpis: "Giảm Churn Rate 20% | 5,000 users",
      details: "Hệ thống Zalo Mini App dành riêng cho Bếp Nhà Mộc. Tích hợp tính năng đặt cơm nhóm, tự động hóa tin nhắn ZNS nhắc lịch ăn trưa.",
      subtasks: [
        { name: "Đăng ký Zalo OA Doanh nghiệp & Xác thực", done: true },
        { name: "Thiết kế UI/UX luồng đặt món (O2O)", done: true },
        { name: "Tích hợp cổng thanh toán (ZaloPay/VNPAY)", done: false },
        { name: "Thiết lập kịch bản Automation ZNS", done: false }
      ]
    },
    { 
      id: "TSK-02",
      name: "Chiến dịch Hero Video: 'Trạm Sạc Chữa Lành'", 
      phase: "Tháng 1", 
      lead: "Creative Director", 
      budget: `${formatCurrency(totalBudget * 0.35)}`, 
      status: "Planning",
      progress: 25,
      kpis: "1M Views | 5% CTR | 200 Booking",
      details: "Sản xuất Cinematic Video khai thác câu chuyện 'Food Coma' chốn công sở. Phân phối trên TikTok & FB Reels.",
      subtasks: [
        { name: "Duyệt kịch bản Storyboard (AI Generated)", done: true },
        { name: "Casting diễn viên & Chốt bối cảnh", done: false },
        { name: "Production (Quay phim 2 ngày)", done: false },
        { name: "Post-Production & Phân phối Ads", done: false }
      ]
    },
    { 
      id: "TSK-03",
      name: "Booking 50 Lifestyle Micro-KOLs", 
      phase: "Tháng 2-3", 
      lead: "Content Strategist", 
      budget: `${formatCurrency(totalBudget * 0.40)}`, 
      status: "Queued",
      progress: 0,
      kpis: "Reach 2M | 150 UGC | Tương tác 50K",
      details: "Tổ chức chiến dịch Review chân thực thông qua tệp Micro-KOLs là dân văn phòng. Tạo hiệu ứng truyền miệng tại các toà nhà văn phòng lớn.",
      subtasks: [
        { name: "Crawl & Lọc list 100 KOLs tiềm năng", done: false },
        { name: "Gửi brief và hộp quà trải nghiệm (Seeding Kit)", done: false },
        { name: "Theo dõi lịch lên bài & Đo lường hiệu quả", done: false }
      ]
    },
    { 
      id: "TSK-04",
      name: "B2B Corporate Lunch Activation", 
      phase: "Tháng 3-4", 
      lead: "B2B Growth", 
      budget: `${formatCurrency(totalBudget * 0.10)}`, 
      status: "Queued",
      progress: 0,
      kpis: "Ký kết 15 Hợp đồng | LTV tăng 35%",
      details: "Chạy chiến dịch LinkedIn InMail tiếp cận phòng Nhân sự quy mô 50+. Cung cấp gói ăn trưa định kỳ (Corporate Subscription).",
      subtasks: [
        { name: "Xây dựng Sales Deck (B2B Proposal)", done: false },
        { name: "Chạy LinkedIn Lead Gen Form", done: false },
        { name: "Tổ chức Tasting Event cho HR Managers", done: false }
      ]
    }
  ] : [
    { id: "TSK-01", name: "Setup Hub", phase: "M1", lead: "Tech", budget: "30M", status: "Ready", progress: 100, kpis: "Done", details: "Core setup.", subtasks: [] }
  ];

  useEffect(() => {
    if (!hasGenerated[activePanel]) {
      setIsGenerating(true);
      const timer = setTimeout(() => {
        setIsGenerating(false);
        setHasGenerated(prev => ({...prev, [activePanel]: true}));
      }, 2500); 
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
    <div className="w-full flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto z-10 relative">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-3 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Zap className="w-4 h-4 text-blue-400 animate-pulse mr-2" />
            <span className="text-xs font-bold text-blue-400 tracking-widest uppercase">Multi-Agent Engine</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            Tactical Execution Hub
          </h2>
          <p className="text-linear-text-muted mt-2 font-medium text-sm md:text-base max-w-2xl">
            Kế hoạch chiến thuật chi tiết được xây dựng tự động bởi tổ hợp AI (AI Swarm) dựa trên kết quả Debate và Brand DNA.<br/>
            {businessIntent?.mode === 'idea_first' ? (
              <span className="text-emerald-400 font-medium">Ngân sách đề xuất: {formatCurrency(totalBudget)} VNĐ dựa trên ý tưởng và quy mô công ty.</span>
            ) : (
              <span className="text-blue-400 font-medium">Phân bổ ngân sách: {formatCurrency(totalBudget)} VNĐ (Căn cứ trên nguồn vốn đã cấp).</span>
            )}
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
              Chuyển sang Lịch Trình (Gantt) <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

      {/* ── Tabs Navigation ── */}
      <div className="flex space-x-2 md:space-x-4 mb-6 overflow-x-auto no-scrollbar pb-2">
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
      <div className="bg-linear-surface/40 backdrop-blur-md rounded-3xl p-6 md:p-10 relative flex flex-col border border-linear-border/30 shadow-2xl min-h-[600px]">
        <AnimatePresence mode="wait">
          
          {/* ════════ TAB 0: CONTENT MATRIX ════════ */}
          {activePanel === 0 && (
            <motion.div key="p0" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="h-full flex flex-col relative gap-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-pink-400" />
                  Ma Trận Nội Dung (Content Matrix)
                </h3>
                <div className="flex items-center text-pink-400/80 text-xs font-bold tracking-widest uppercase bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20">
                  <PenSquare className="w-3 h-3 mr-2" /> Content Strategist Active
                </div>
              </div>
              
              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <RefreshCw className="w-10 h-10 text-pink-500 animate-spin mb-4" />
                  <p className="text-pink-400 font-bold tracking-widest uppercase text-sm animate-pulse">Phân tích Insight & Khởi tạo Matrix...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
                  {contentMock.pillars.map((pillar, i) => (
                    <div key={i} className="group bg-background/40 border border-linear-border rounded-3xl overflow-hidden hover:border-pink-500/40 transition-all duration-500 shadow-lg hover:shadow-pink-500/10 flex flex-col relative">
                      {/* Gradient Header */}
                      <div className="h-2 w-full bg-gradient-to-r from-pink-500/40 to-purple-500/40 group-hover:from-pink-500 group-hover:to-purple-500 transition-colors"></div>
                      
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 bg-pink-500/10 rounded-xl flex items-center justify-center border border-pink-500/20 text-pink-400">
                            <Type className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-800/50 px-2 py-1 rounded">Pillar {i+1}</span>
                        </div>
                        
                        <h4 className="text-lg font-black text-foreground mb-3 leading-tight">{pillar.title}</h4>
                        
                        <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/50 mb-4">
                          <p className="text-[13px] text-slate-300 leading-relaxed"><strong className="text-pink-400">Angle:</strong> {pillar.angle}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          <div className="w-full text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tone & Voice</div>
                          <span className="px-2 py-1 bg-pink-500/10 text-pink-300 text-[11px] font-medium rounded-md border border-pink-500/20">{pillar.tone}</span>
                        </div>
                        
                        <div className="space-y-4 pt-4 border-t border-linear-border/50 flex-1">
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Định dạng (Formats)</div>
                            <div className="flex flex-wrap gap-1.5">
                              {pillar.formats.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] font-bold rounded-md border border-slate-700">{tag}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Kênh phân phối (Channels)</div>
                            <div className="flex flex-wrap gap-1.5">
                              {pillar.channels.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-purple-500/10 text-purple-300 text-[10px] font-bold rounded-md border border-purple-500/20">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Copywriting Example - Hover to reveal or always visible at bottom */}
                        <div className="mt-6 bg-gradient-to-br from-pink-500/5 to-purple-500/5 border border-pink-500/10 rounded-xl p-4 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/5 rounded-bl-full"></div>
                          <div className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2 flex items-center">
                            <PenSquare className="w-3 h-3 mr-1.5" /> Demo Copywriting
                          </div>
                          <p className="text-[13px] text-slate-300 italic leading-relaxed">"{pillar.example}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ════════ TAB 1: VISUAL DNA ════════ */}
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

          {/* ════════ TAB 2: AGENT SWARM ════════ */}
          {activePanel === 2 && (
            <motion.div key="p2" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="flex flex-col relative gap-8">
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
                    <div 
                      key={i} 
                      className="bg-background/60 border border-linear-border rounded-2xl p-6 flex gap-6 hover:border-blue-500/30 transition-all shadow-lg cursor-pointer hover:-translate-y-1 group relative overflow-hidden"
                      onClick={() => window.location.href = `/agent-builder`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${agent.avatar}/10 border border-${agent.avatar.replace('bg-', '')}/30`}>
                        <Bot className={`w-8 h-8 text-${agent.avatar.replace('bg-', '')}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-black text-foreground">{agent.role}</h4>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" /> {agent.status}
                          </span>
                        </div>
                        <p className="text-sm text-linear-text-muted leading-relaxed mb-3">{agent.description}</p>
                        <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          Xem chi tiết cấu hình Agent <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ════════ TAB 3: ACTION PLAN ════════ */}
          {activePanel === 3 && (
            <motion.div key="p3" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="flex flex-col relative gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground flex items-center">
                  <Activity className="w-6 h-6 mr-3 text-emerald-400" /> Kế Hoạch Triển Khai (Action Plan)
                </h3>
                <div className="flex items-center text-emerald-400/80 text-xs font-bold tracking-widest uppercase bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <AlignLeft className="w-3 h-3 mr-2" /> Task Engine Active
                </div>
              </div>

              {isGenerating ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                  <p className="text-emerald-400 font-bold tracking-widest uppercase text-sm animate-pulse">Scheduling Tasks, KPIs & Budgeting...</p>
                </div>
              ) : (
                <div className="flex-1 pr-2 space-y-6">
                  {planMock.map((task, i) => (
                    <div key={i} className="bg-background/40 border border-linear-border rounded-3xl p-6 hover:border-emerald-500/40 transition-all duration-300 shadow-lg relative overflow-hidden group">
                      
                      {/* Background Status Indicator */}
                      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 transition-opacity rounded-full
                        ${task.status === 'Executing' ? 'bg-emerald-500' : task.status === 'Planning' ? 'bg-amber-500' : 'bg-slate-500'}`}>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                        {/* Task Info Left */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] font-black tracking-widest rounded-md font-mono border border-slate-700">{task.id}</span>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-md uppercase tracking-widest border border-emerald-500/20 flex items-center">
                              <Calendar className="w-3 h-3 mr-1.5" /> {task.phase}
                            </span>
                            <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider flex items-center
                              ${task.status === 'Executing' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' : 
                                task.status === 'Planning' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 
                                'text-slate-400 bg-slate-500/10 border border-slate-500/20'}`}>
                              {task.status === 'Executing' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />}
                              {task.status}
                            </span>
                          </div>
                          
                          <h4 className="text-xl font-black text-foreground mb-3 leading-tight">{task.name}</h4>
                          <p className="text-[13.5px] text-slate-400 leading-relaxed mb-6">{task.details}</p>
                          
                          {/* Subtasks */}
                          <div className="space-y-3">
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                              <CheckSquare className="w-3.5 h-3.5 mr-1.5" /> Sub-tasks List
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {task.subtasks.map((sub, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm">
                                  <div className={`w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center border ${sub.done ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'border-slate-600 bg-slate-800/50 text-transparent'}`}>
                                    {sub.done && <CheckCircle2 className="w-3 h-3" />}
                                  </div>
                                  <span className={sub.done ? 'text-slate-300' : 'text-slate-500'}>{sub.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Task Info Right: Metrics & Assignee */}
                        <div className="w-full lg:w-[320px] flex flex-col gap-5 shrink-0 bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                          {/* Progress */}
                          <div>
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tiến độ</span>
                              <span className="text-sm font-black text-foreground">{task.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full relative" style={{ width: `${task.progress}%` }}>
                                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Assignee (PIC)</div>
                              <div className="flex items-center text-sm font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1.5 rounded-lg border border-cyan-500/20 w-max">
                                <Bot className="w-4 h-4 mr-2" /> {task.lead}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Ngân sách</div>
                              <div className="text-sm font-black text-foreground bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 w-max">
                                {task.budget}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                              <Target className="w-3 h-3 mr-1.5 text-amber-500" /> KPI Cam Kết
                            </div>
                            <div className="text-[13px] font-bold text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/20 leading-relaxed">
                              {task.kpis}
                            </div>
                          </div>
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
