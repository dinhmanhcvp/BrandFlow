"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Calculator, Download, CheckCircle, ArrowRight, Target, 
  BarChart3, Users, Zap, Calendar, DollarSign, LayoutDashboard, 
  Share2, RefreshCw, CheckCircle2, ShieldCheck, ChevronRight, 
  Layers, Clock, TrendingUp, Sparkles, Building, ShieldAlert,
  Sliders, ArrowUpRight, CheckSquare, MessageSquare
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFormStore } from '@/store/useFormStore';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

export default function Phase4_Execution({ onBack, onNext }: { onBack: () => void, onNext?: () => void }) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'gantt' | 'ledger' | 'projection'>('gantt');
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>('m1');
  const [step, setStep] = useState(0); 
  const { brandDNA, wizardAnswers, businessIntent } = useFormStore();
  const isBepNhaMoc = true;

  // Ngân sách 35.000.000đ chốt từ phiên tranh luận đa tác nhân
  const totalBudget = 35000000; 

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // ── Multi-Track Gantt Streams ──
  const GANTT_STREAMS = [
    {
      id: 'stream-crm',
      title: 'Luồng 1: Zalo O2O CRM & Mini App',
      owner: 'Trợ lý chiến lược & Vận hành',
      ownerAvatar: 'bg-blue-600',
      color: 'blue',
      milestones: [
        {
          id: 'm1',
          code: 'ZLO-01',
          title: 'Khởi tạo Zalo OA Doanh Nghiệp & Mini App Menu',
          weeks: 'Tuần 1 - 2',
          startWeek: 1,
          spanWeeks: 2,
          budget: 5500000,
          status: 'completed',
          kpi: 'Menu O2O online, tích hợp thanh toán ZaloPay/VNPAY',
          description: 'Xây dựng luồng đặt cơm nhóm cho dân công sở, tự động phân luồng suất ăn theo tòa nhà văn phòng và lưu trữ lịch sử đặt hàng.',
          deliverables: [
            'Chứng thực Zalo Official Account tích vàng doanh nghiệp',
            'Giao diện Mini App mobile-first tối ưu cho thời gian đặt món 11h-11h30',
            'Đấu nối cổng thanh toán trực tuyến & mã voucher công ty'
          ]
        },
        {
          id: 'm2',
          code: 'ZLO-02',
          title: 'Vận hành kịch bản Automation ZNS & Đặt Cơm Nhóm',
          weeks: 'Tuần 3 - 6',
          startWeek: 3,
          spanWeeks: 4,
          budget: 4500000,
          status: 'in_progress',
          kpi: 'Tỷ lệ mở ZNS > 82%, 1.200 đơn cơm nhóm',
          description: 'Tin nhắn ZNS nhắc lịch ăn trưa tự động lúc 10h45 sáng cho khách hàng đã quan tâm OA, đính kèm ưu đãi combo tuần.',
          deliverables: [
            '3 kịch bản tin nhắn chăm sóc tự động theo thời gian thực',
            'Tính năng Gom Đơn Chung Tòa Nhà miễn phí ship',
            'Báo cáo tỷ lệ chuyển đổi từ tin nhắn sang đơn hàng'
          ]
        },
        {
          id: 'm3',
          code: 'ZLO-03',
          title: 'Kích hoạt Thẻ Thành Viên Trả Trước (Prepaid Pass)',
          weeks: 'Tuần 7 - 8',
          startWeek: 7,
          spanWeeks: 2,
          budget: 2000000,
          status: 'scheduled',
          kpi: '350 thẻ thành viên tháng được kích hoạt',
          description: 'Gói thẻ cơm trưa trả trước 20 ngày chiết khấu 15%, giữ chân nhân viên văn phòng ổn định cả tháng.',
          deliverables: [
            'Hệ thống cấp mã thẻ ảo trên Zalo Mini App',
            'Chính sách bù hủy linh hoạt nếu nhân viên nghỉ phép',
            'Dashboard theo dõi dòng tiền trả trước của doanh nghiệp'
          ]
        }
      ]
    },
    {
      id: 'stream-media',
      title: 'Luồng 2: Truyền Thông & Micro-KOLs Công Sở',
      owner: 'Trợ lý góc nhìn khách hàng',
      ownerAvatar: 'bg-amber-600',
      color: 'amber',
      milestones: [
        {
          id: 'm4',
          code: 'MED-01',
          title: 'Booking 10 Micro-KOLs Văn Phòng Trải Nghiệm Thực Tế',
          weeks: 'Tuần 1 - 3',
          startWeek: 1,
          spanWeeks: 3,
          budget: 9000000,
          status: 'in_progress',
          kpi: '1.5M views TikTok, 25.000 lượt lưu công thức/menu',
          description: 'Hợp tác các bạn trẻ sáng tạo nội dung văn phòng Duy Tân - Cầu Giấy quay video unbox bữa trưa "chữa lành" bã mía tại bàn làm việc.',
          deliverables: [
            'Hợp đồng & brief cam kết không dùng kịch bản quảng cáo giả trân',
            '10 video Reels / TikTok đạt tiêu chuẩn âm thanh ASMR giòn tan',
            '2 bài PR định hướng trên chuyên mục Đời sống & Doanh nhân'
          ]
        },
        {
          id: 'm5',
          code: 'MED-02',
          title: 'Meta Ads Siêu Định Vị (Bán Kính 2km Duy Tân)',
          weeks: 'Tuần 3 - 6',
          startWeek: 3,
          spanWeeks: 4,
          budget: 5000000,
          status: 'scheduled',
          kpi: 'CPA < 22.000đ/lead đặt món, tần suất 3.2 lần/người',
          description: 'Chiến dịch Meta Broad Ads tập trung quét bán kính 2km xung quanh 18 tòa nhà văn phòng cao tầng trong khung giờ 9h30 - 11h00.',
          deliverables: [
            'Bộ 6 creative hình ảnh mâm cơm niêu bốc khói kích thích vị giác',
            'Custom Audience nhắm chọn nhân sự văn phòng độ tuổi 24 - 40',
            'Tự động tắt quảng cáo sau 11h30 để tránh lãng phí ngân sách'
          ]
        }
      ]
    },
    {
      id: 'stream-b2b',
      title: 'Luồng 3: B2B Corporate Sampling & Hợp Đồng Doanh Nghiệp',
      owner: 'Trợ lý chiến lược',
      ownerAvatar: 'bg-purple-600',
      color: 'purple',
      milestones: [
        {
          id: 'm6',
          code: 'B2B-01',
          title: 'Chương Trình 150 Suất Ăn Thử (Tasting Event) Cho HR Managers',
          weeks: 'Tuần 2 - 4',
          startWeek: 2,
          spanWeeks: 3,
          budget: 4500000,
          status: 'in_progress',
          kpi: 'Tiếp cận 30 HR Managers, tỷ lệ hẹn gặp 40%',
          description: 'Gửi hộp cơm mẫu kèm thiệp mời trân trọng tới ban nhân sự các công ty công nghệ tại Keangnam, FPT Tower và CMC Building.',
          deliverables: [
            'Bộ Presentation phúc lợi ăn trưa dinh dưỡng cho nhân sự',
            'Mẫu hợp đồng pháp lý suất ăn văn phòng có hóa đơn VAT',
            'Biên bản đánh giá vị giác thực tế của ban nhân sự'
          ]
        },
        {
          id: 'm7',
          code: 'B2B-02',
          title: 'Ký Kết Hợp Đồng Cung Cấp Cơm Tháng Cho 12 Doanh Nghiệp',
          weeks: 'Tuần 5 - 8',
          startWeek: 5,
          spanWeeks: 4,
          budget: 1500000,
          status: 'scheduled',
          kpi: '12 hợp đồng B2B dài hạn (Doanh thu cam kết 650M/tháng)',
          description: 'Chốt hợp đồng cung ứng cố định từ 20 - 50 suất/ngày cho mỗi doanh nghiệp, đảm bảo doanh số nền tảng vững chắc.',
          deliverables: [
            'Bảng giá chiết khấu lũy tiến theo số lượng suất ăn',
            'Cam kết chất lượng an toàn vệ sinh thực phẩm có bảo hiểm',
            'Quy trình đối soát công nợ thanh toán cuối tháng'
          ]
        }
      ]
    },
    {
      id: 'stream-ops',
      title: 'Luồng 4: Vận Hành Bếp & Đóng Gói Sinh Học',
      owner: 'Trợ lý vận hành',
      ownerAvatar: 'bg-emerald-600',
      color: 'emerald',
      milestones: [
        {
          id: 'm8',
          code: 'OPS-01',
          title: 'Khống Chế Công Suất Bếp Trần 120 Suất/Giờ & Hộp Bã Mía',
          weeks: 'Tuần 1 - 8',
          startWeek: 1,
          spanWeeks: 8,
          budget: 3000000,
          status: 'in_progress',
          kpi: 'Thời gian giao trung bình 16 phút, 0 đơn vỡ hộp',
          description: 'Kiểm soát chặt chẽ nhịp ra món của bếp trung tâm, ứng dụng hộp bã mía kháng dầu 120°C và tem niêm phong QR bảo mật.',
          deliverables: [
            'Lô 5.000 hộp bã mía ép nhiệt tiêu chuẩn FDA',
            'Tem dán niêm phong chống đổ canh tích hợp mã QR tích điểm',
            'Đội ngũ 6 shipper nội bộ túc trực giờ cao điểm 11h15 - 12h00'
          ]
        }
      ]
    }
  ];

  // ── Financial Ledger Table Data ──
  const BUDGET_LEDGER = [
    {
      category: 'Phát triển Zalo Mini App & Tích hợp cổng thanh toán',
      allocated: 5500000,
      percentage: '15.7%',
      targetChannel: 'Zalo O2O Platform',
      expectedKpi: 'Hoàn thiện luồng đặt cơm nhóm, 0 lỗi thanh toán',
      status: 'audited'
    },
    {
      category: 'Chiến dịch Automation ZNS & Thông báo nhắc lịch ăn trưa',
      allocated: 4500000,
      percentage: '12.9%',
      targetChannel: 'Zalo ZNS Business',
      expectedKpi: 'Tỷ lệ đọc 82%, 1.200 đơn hàng chuyển đổi',
      status: 'audited'
    },
    {
      category: 'Hợp tác 10 Micro-KOLs văn phòng & Bài PR Chữa lành',
      allocated: 9000000,
      percentage: '25.7%',
      targetChannel: 'TikTok & Báo chí',
      expectedKpi: '1.5M tiếp cận tự nhiên, 25.000 lượt lưu thực đơn',
      status: 'audited'
    },
    {
      category: 'Meta Ads Geofencing quét bán kính 2km Duy Tân',
      allocated: 5000000,
      percentage: '14.3%',
      targetChannel: 'Facebook & Instagram Ads',
      expectedKpi: 'CPA < 22.000đ/khách, quét đúng 18 tòa nhà văn phòng',
      status: 'audited'
    },
    {
      category: 'Bộ Tasting Box mẫu cho 150 HR Managers tòa nhà',
      allocated: 4500000,
      percentage: '12.9%',
      targetChannel: 'B2B Direct Sampling',
      expectedKpi: '30 cuộc hẹn đàm phán hợp đồng cung cấp suất ăn',
      status: 'audited'
    },
    {
      category: 'Thẻ thành viên trả trước & Đóng gói bao bì bã mía',
      allocated: 3500000,
      percentage: '10.0%',
      targetChannel: 'In-house Packaging',
      expectedKpi: '5.000 hộp bã mía sinh học, tỷ lệ hài lòng 98%',
      status: 'audited'
    },
    {
      category: 'Quỹ dự phòng phát sinh & Tối ưu chi phí thực địa',
      allocated: 3000000,
      percentage: '8.5%',
      targetChannel: 'Contingency Reserve',
      expectedKpi: 'Bảo toàn số dư an toàn trong suốt 8 tuần thực thi',
      status: 'audited'
    }
  ];

  // ── Growth Chart Data ──
  const chartData = [
    { week: 'T1', reach: 60, orders: 450, revenue: 31.5, cpa: 28 },
    { week: 'T2', reach: 180, orders: 920, revenue: 64.4, cpa: 26 },
    { week: 'T3', reach: 420, orders: 1850, revenue: 129.5, cpa: 24 },
    { week: 'T4', reach: 780, orders: 3100, revenue: 217.0, cpa: 23 },
    { week: 'T5', reach: 1250, orders: 4900, revenue: 343.0, cpa: 22 },
    { week: 'T6', reach: 1800, orders: 7200, revenue: 504.0, cpa: 21 },
    { week: 'T7', reach: 2400, orders: 10500, revenue: 735.0, cpa: 20 },
    { week: 'T8', reach: 3100, orders: 14200, revenue: 994.0, cpa: 19 },
  ];

  const currentSelectedMilestone = GANTT_STREAMS
    .flatMap(s => s.milestones)
    .find(m => m.id === selectedMilestone) || GANTT_STREAMS[0].milestones[0];

  return (
    <div className="w-full min-h-full flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto z-10 relative pb-20">
      
      {/* ── 1. HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-300 dark:border-cyan-700/60 text-xs font-black uppercase tracking-widest text-cyan-800 dark:text-cyan-300 mb-2.5">
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            Bảng Điều Khiển Thực Thi Chiến Dịch · Bếp Nhà Mộc 2026
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Kế Hoạch Thực Thi Tích Hợp (IMC Master Plan)
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-xs md:text-sm font-medium max-w-3xl leading-relaxed">
            Kế hoạch hành động 8 tuần đa luồng đã giải quyết trọn vẹn điểm nghẽn chiết khấu App 25%, chuyển dịch khách hàng sang kênh sở hữu Zalo O2O và bảo toàn biên lợi nhuận ròng F&B tối thiểu 22%.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={onBack} 
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all text-xs flex items-center justify-center cursor-pointer shadow-sm"
          >
            <ArrowRight className="w-4 h-4 mr-1.5 rotate-180" /> Quay lại (Debate)
          </button>
          
          {onNext && (
            <button 
              onClick={onNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center group cursor-pointer"
            >
              Tiến hành sang Phase 5 (Creative Studio)
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* ── 2. EXECUTIVE METRIC TICKER (5 KEY MISSION INDICATORS) ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-8">
        
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Ngân Sách Thực Thi</span>
            <DollarSign className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatCurrency(totalBudget)}
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            ✓ Đã chốt sau Debate
          </span>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Doanh Thu Dự Phóng</span>
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            2.5 Tỷ VNĐ
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1">
            Mục tiêu 8 tuần (ROI 71.4x)
          </span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>CPA Đích (Chi phí/Khách)</span>
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
            22.000đ
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1">
            Tiết kiệm 37% phí App
          </span>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Hoàn Vốn (Payback)</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            18 Ngày
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-1">
            Hòa vốn sau 1.420 suất cơm
          </span>
        </div>

        {/* Metric 5 */}
        <div className="col-span-2 md:col-span-1 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2">
            <span>Trần Công Suất Bếp</span>
            <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-xl md:text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            120 Suất/h
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1">
            ✓ Khóa trần an toàn vận hành
          </span>
        </div>

      </div>

      {/* ── 3. VIEW TABS SWITCHER ── */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="inline-flex p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('gantt')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'gantt'
                ? 'bg-white dark:bg-slate-800 text-cyan-800 dark:text-cyan-300 shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Lộ Trình Đa Luồng (Multi-Track Gantt)
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'ledger'
                ? 'bg-white dark:bg-slate-800 text-cyan-800 dark:text-cyan-300 shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Sổ Cái Phân Bổ Ngân Sách (35Mđ)
          </button>

          <button
            onClick={() => setActiveTab('projection')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'projection'
                ? 'bg-white dark:bg-slate-800 text-cyan-800 dark:text-cyan-300 shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Dự Phóng Tăng Trưởng & P&L
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Kế hoạch đã thẩm định tài chính độc lập</span>
        </div>
      </div>

      {/* ── 4. TAB CONTENT ── */}
      {activeTab === 'gantt' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT GANTT BOARD (Cols 1-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Week Ruler Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                <span>Luồng Triển Khai Nghiệp Vụ</span>
                <div className="hidden sm:flex items-center gap-6 pr-4">
                  <span>Tuần 1-2</span>
                  <span>Tuần 3-4</span>
                  <span>Tuần 5-6</span>
                  <span>Tuần 7-8</span>
                </div>
              </div>

              {/* Streams */}
              <div className="space-y-4">
                {GANTT_STREAMS.map((stream) => (
                  <div key={stream.id} className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                        <h3 className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-tight">
                          {stream.title}
                        </h3>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">
                        Chủ trì: <strong>{stream.owner}</strong>
                      </span>
                    </div>

                    {/* Milestones chips inside stream */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {stream.milestones.map((m) => {
                        const isSelected = selectedMilestone === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMilestone(m.id)}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-cyan-50/90 dark:bg-cyan-950/40 border-cyan-500 shadow-sm ring-1 ring-cyan-500'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-mono text-[10px] font-black text-cyan-700 dark:text-cyan-400">
                                #{m.code}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                m.status === 'completed' 
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                                  : m.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 animate-pulse'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}>
                                {m.status === 'completed' ? 'Xong' : m.status === 'in_progress' ? 'Đang chạy' : 'Lên lịch'}
                              </span>
                            </div>

                            <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug">
                              {m.title}
                            </p>

                            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                              <span>{m.weeks}</span>
                              <strong className="text-slate-900 dark:text-slate-100">{formatCurrency(m.budget)}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT DETAIL INSPECTOR (Cols 9-12) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 p-6 rounded-3xl shadow-xl flex flex-col justify-between sticky top-24">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-600 dark:text-cyan-400 font-bold block">
                      Chi Tiết Nhiệm Vụ #{currentSelectedMilestone.code}
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                      {currentSelectedMilestone.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300">
                    {currentSelectedMilestone.weeks}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {currentSelectedMilestone.description}
                </p>

                {/* Target KPI badge */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 mb-5 text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">KPI Mục Tiêu:</span>
                  <strong className="text-cyan-800 dark:text-cyan-300 font-bold leading-snug block">
                    {currentSelectedMilestone.kpi}
                  </strong>
                </div>

                {/* Deliverables Checklist */}
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                    Sản Phẩm Đầu Ra Cam Kết (Deliverables):
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    {currentSelectedMilestone.deliverables.map((del, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Budget allocated for this milestone */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">Ngân sách giai đoạn:</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    {formatCurrency(currentSelectedMilestone.budget)}
                  </span>
                </div>
                <button 
                  onClick={() => alert(`Đã tải xuống tài liệu chi tiết cho #${currentSelectedMilestone.code}`)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Tải hồ sơ task
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ── 5. TAB 2: FINANCIAL LEDGER TABLE ── */}
      {activeTab === 'ledger' && (
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Sổ Cái Phân Bổ Ngân Sách Chiến Dịch (35.000.000 VNĐ)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mỗi đồng chi phí đều gắn liền với đơn vị thụ hưởng và chỉ tiêu hoàn vốn trực tiếp.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 block">Tổng ngân sách:</span>
              <span className="text-xl font-black text-cyan-600 dark:text-cyan-400 font-mono">35.000.000đ</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 px-3">Hạng Mục Đầu Tư</th>
                  <th className="pb-3 px-3 text-right">Số Tiền (VNĐ)</th>
                  <th className="pb-3 px-3 text-center">Tỷ Trọng</th>
                  <th className="pb-3 px-3">Kênh / Nền Tảng</th>
                  <th className="pb-3 px-3">Chỉ Số Cam Kết</th>
                  <th className="pb-3 px-3 text-center">Thẩm Định</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {BUDGET_LEDGER.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-black text-slate-900 dark:text-white">
                      {formatCurrency(item.allocated)}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-cyan-700 dark:text-cyan-400 font-bold">
                      {item.percentage}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      {item.targetChannel}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">
                      {item.expectedKpi}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã kiểm
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 6. TAB 3: PROJECTION & GROWTH CHART ── */}
      {activeTab === 'projection' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Mô Phỏng Doanh Thu & Đơn Hàng 8 Tuần
                  </h3>
                  <p className="text-xs text-slate-500">
                    Đường cong tăng trưởng khi chuyển đổi thành công từ khách hàng vãng lai sang tệp khách cơm tuần Zalo OA.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-cyan-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Doanh thu (Triệu VNĐ)
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Đơn hàng lũy kế
                  </span>
                </div>
              </div>

              <div className="w-full h-[320px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }} 
                    />
                    <Area type="monotone" dataKey="revenue" name="Doanh thu (Triệu VNĐ)" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="orders" name="Đơn hàng" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOrd)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 text-center italic">
              * Dựa trên tỷ lệ hoàn đơn 18% của khách hàng văn phòng và chu kỳ mua lại trung bình 3.2 lần/tuần.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="p-6 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 border-2 border-emerald-400 dark:border-emerald-600 shadow-md">
              <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300 block mb-2">
                So Sánh Hiệu Quả Mô Hình
              </span>
              <ul className="space-y-3 text-xs leading-relaxed">
                <li className="flex justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-900/40">
                  <span className="text-slate-600 dark:text-slate-400">Chiết khấu App trước đây:</span>
                  <strong className="text-rose-600 font-bold">-25% trên giá món</strong>
                </li>
                <li className="flex justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-900/40">
                  <span className="text-slate-600 dark:text-slate-400">Chi phí Zalo O2O mới:</span>
                  <strong className="text-emerald-700 dark:text-emerald-300 font-black">~4.2% (Bao gồm Ads & ZNS)</strong>
                </li>
                <li className="flex justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-900/40">
                  <span className="text-slate-600 dark:text-slate-400">Dòng tiền dôi dư giữ lại:</span>
                  <strong className="text-emerald-700 dark:text-emerald-300 font-black">+520.000.000đ / 8 tuần</strong>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Tệp dữ liệu khách hàng:</span>
                  <strong className="text-slate-900 dark:text-white font-bold">100% Thuộc quyền sở hữu</strong>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 block">
                  Xuất Hồ Sơ Master Plan
                </span>
                <span className="text-[11px] text-slate-500">File tài liệu trình Hội đồng quản trị (PDF 45 trang)</span>
              </div>
              <button 
                onClick={() => alert('Đang tạo và tải xuống bản báo cáo PDF...')}
                className="p-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-md cursor-pointer transition-colors"
                title="Tải PDF"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
