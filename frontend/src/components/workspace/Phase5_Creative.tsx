"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, FileText, Image as ImageIcon, Wand2, Type, Layout, 
  RefreshCw, CheckCircle2, Copy, Check, ArrowRight, Share2, 
  Sparkles, Smartphone, Heart, MessageCircle, Send, Bookmark, 
  Download, Eye, ThumbsUp, ShieldCheck, Box, Sliders, Layers
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Phase5_Creative({ onNext, onBack }: { onNext: () => void, onBack?: () => void }) {
  const { language } = useLanguage();
  const [activePlatform, setActivePlatform] = useState<'zalo' | 'facebook' | 'tiktok' | 'linkedin'>('zalo');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [specimenText, setSpecimenText] = useState('Bếp Nhà Mộc · Cơm Niêu Chữa Lành Cho Dân Công Sở');
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 400),
      setTimeout(() => setStep(2), 900),
      setTimeout(() => setStep(3), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Copy to clipboard helper
  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // ── 1. Heritage Color System ──
  const COLOR_PALETTE = [
    {
      name: 'Nâu Gụ Mộc',
      enName: 'Teak Heritage Brown',
      hex: '#4A2E18',
      role: 'Màu nhận diện chủ đạo (Primary Dark)',
      usage: 'Logo, tiêu đề thực đơn, viền niêu đất nung',
      rgb: 'RGB(74, 46, 24)',
      bgClass: 'bg-[#4A2E18]'
    },
    {
      name: 'Men Gốm Phù Lãng',
      enName: 'Terra Cotta Amber',
      hex: '#C2410C',
      role: 'Màu nhấn cảm xúc (Warm Accent)',
      usage: 'Huy hiệu ưu đãi, màu cá kho tộ, nút CTA đặt món',
      rgb: 'RGB(194, 65, 12)',
      bgClass: 'bg-[#C2410C]'
    },
    {
      name: 'Lá Chuối Tươi',
      enName: 'Banana Leaf Green',
      hex: '#15803D',
      role: 'Biểu trưng tươi ngon (Fresh Organic)',
      usage: 'Cam kết xanh, bao bì sinh học, huy hiệu sạch 100%',
      rgb: 'RGB(21, 128, 61)',
      bgClass: 'bg-[#15803D]'
    },
    {
      name: 'Vàng Nếp Mùa',
      enName: 'Golden Grain Yellow',
      hex: '#D97706',
      role: 'Màu kích thích vị giác (Appetite Warm)',
      usage: 'Cơm cháy giòn, hạt gạo mùa vàng, thẻ hội viên VIP',
      rgb: 'RGB(217, 119, 6)',
      bgClass: 'bg-[#D97706]'
    },
    {
      name: 'Trắng Men Bát Tràng',
      enName: 'Ceramic Ivory White',
      hex: '#FDFBF7',
      role: 'Màu nền thoáng đãng (Surface Light)',
      usage: 'Nền hộp bã mía, khoảng thở giao diện, thiệp mời B2B',
      rgb: 'RGB(253, 251, 247)',
      bgClass: 'bg-[#FDFBF7]'
    }
  ];

  // ── 2. Content Templates by Platform ──
  const PLATFORM_CONTENT = {
    zalo: {
      platformName: 'Zalo Mini App & OA Feed',
      audience: 'Dân văn phòng bán kính 2km Duy Tân · Khung giờ 10h30 - 11h15',
      copy: `🌿 11h15 rồi, đừng để deadline "nuốt chửng" bữa trưa của bạn!

Bỏ lại màn hình máy tính chói mắt và tiếng gõ phím rào rào, hãy ngồi xuống thưởng thức niêu cơm thơm lừng gạo ST25 cùng cá bống kho tộ đậm vị mộc mạc từ Bếp Nhà Mộc.

🍱 100% món ăn được giữ nóng hổi trong hộp bã mía sinh học kháng nhiệt 120°C, ship tận bàn làm việc chỉ trong 16 phút.

🎁 ĐẶC QUYỀN TRÊN ZALO MINI APP:
• Giảm ngay 15% cho đơn nhóm từ 3 phần
• Miễn phí canh cua mồng tơi & tráng miệng chè sen
• Tích điểm tự động đổi voucher cơm tuần

Bấm nút bên dưới để chọn món ngay trước giờ cao điểm kẻo hết cơm niêu nhé bạn ơi!`,
      hashtags: '#BepNhaMoc #ComNieuChuaLanh #ZaloMiniApp #ComTruaVanPhong',
      cta: 'Đặt Cơm Trưa Ngay · Giảm 15%',
      likes: '1.4K',
      comments: '342',
      shares: '89',
      toneScores: { mindful: 96, authentic: 94, ctaStrength: 90 }
    },
    facebook: {
      platformName: 'Facebook Sponsored Feed',
      audience: 'Nhân sự 24 - 40 tuổi, Tòa nhà Keangnam, FPT Tower, CMC Building',
      copy: `[GỬI DÂN CÔNG SỞ DUY TÂN] Bạn có đang ăn trưa trong vội vã chỉ để kịp chấm công?

Khoa học chứng minh: 70% cảm giác uể oải, buồn ngủ lúc 14h00 xuất phát từ những bữa trưa dầu mỡ và bột ngọt.

Tại Bếp Nhà Mộc, chúng mình không bán một hộp cơm công nghiệp. Chúng mình mang đến một "khoảng lặng chữa lành" giữa ngày làm việc:
👉 Cơm niêu nấu từ gạo ST25 dẻo thơm từng hạt
👉 Cá kho tộ, thịt rang cháy cạnh chuẩn vị mâm cơm mẹ nấu
👉 Đựng trong hộp bã mía tự nhiên, an toàn tuyệt đối cho sức khỏe

Ăn ngon để tái tạo năng lượng. Đặt một bữa cơm trưa tử tế cho chính mình ngay hôm nay!`,
      hashtags: '#BepNhaMoc #MindfulDining #ComNieuGiaDinh #AnTruaLanhManh',
      cta: 'Xem Thực Đơn Hôm Nay',
      likes: '2.8K',
      comments: '516',
      shares: '174',
      toneScores: { mindful: 92, authentic: 96, ctaStrength: 86 }
    },
    tiktok: {
      platformName: 'TikTok Script & Storyboard',
      audience: 'Gen Z & Millennial Professionals · ASMR & Cinematic Foodie',
      copy: `🎬 KỊCH BẢN VIDEO ASMR (Thời lượng: 30 giây):

[00:00 - 00:05] Cận cảnh âm thanh: Tiếng gõ bàn phím dồn dập $\\rightarrow$ Âm thanh bụng đói cồn cào $\\rightarrow$ Chuyển cảnh tiếng bốc khói xèo xèo của niêu cơm cá bống.
[00:06 - 00:15] Visual chữa lành: Đôi bàn tay người đầu bếp mộc mạc rắc hành hoa tươi, múc từng muỗng canh cua mồng tơi xanh mướt vào hộp bã mía sinh học.
[00:16 - 00:24] Unboxing tại văn phòng: Mở nắp hộp bã mía bốc khói ngun ngút tại bàn làm việc giữa giờ trưa. Tiếng cắn miếng cơm cháy giòn rụm "RỘM!".
[00:25 - 00:30] Voiceover ấm áp: "Bão deadline ngoài kia cứ để sau. Giờ này là của mâm cơm mẹ nấu. Bếp Nhà Mộc - Chữa lành từng bữa trưa."

🔗 Ghé bio đặt cơm để nhận voucher 20k cho đơn đầu tiên!`,
      hashtags: '#ASMRFood #BepNhaMoc #POVVanPhong #ComNieu #AnNgonMoiNgay',
      cta: 'Ghé Zalo OA Nhận Voucher',
      likes: '14.2K',
      comments: '1.2K',
      shares: '890',
      toneScores: { mindful: 98, authentic: 90, ctaStrength: 88 }
    },
    linkedin: {
      platformName: 'LinkedIn B2B Article',
      audience: 'HR Managers, Operations Directors, Corporate Welfare Leaders',
      copy: `Bữa trưa công sở: Phúc lợi nhân sự bị bỏ quên hay đòn bẩy tăng 30% hiệu suất làm việc?

Kính gửi các anh/chị phụ trách Nhân sự & Vận hành doanh nghiệp,

Theo khảo sát sức khỏe nghề nghiệp 2025, hơn 65% nhân sự thừa nhận năng suất buổi chiều sụt giảm nghiêm trọng sau những bữa ăn ngoài thiếu kiểm soát vệ sinh và chứa nhiều phụ gia thực phẩm.

Bếp Nhà Mộc hân hạnh giới thiệu giải pháp "Bữa Cơm Đồng Nghiệp - Corporate Dining":
1. Dinh dưỡng cân bằng: Thực đơn luân phiên 30 ngày, tối ưu protein sạch và chất xơ.
2. Tiêu chuẩn Xanh (ESG): 100% sử dụng bao bì bã mía sinh học, không rác thải nhựa tại văn phòng.
3. Hóa đơn VAT & Pháp lý đầy đủ: Đối soát công nợ linh hoạt cuối tháng.

Chúng tôi dành tặng 10 gói Tasting Event (Ăn thử miễn phí 20 suất) cho các doanh nghiệp quy mô trên 50 nhân sự tại Hà Nội trong tháng này.`,
      hashtags: '#CorporateWellness #HRVietnam #EmployeeBenefit #ESG #BepNhaMoc',
      cta: 'Đăng Ký Tasting Event Doanh Nghiệp',
      likes: '840',
      comments: '112',
      shares: '68',
      toneScores: { mindful: 88, authentic: 95, ctaStrength: 94 }
    }
  };

  // ── 3. Packaging Specs Data ──
  const PACKAGING_SPECS = [
    {
      title: 'Hộp Cơm Bã Mía 3 Ngăn Ép Nhiệt',
      subtitle: 'Quy cách sinh học tiêu chuẩn FDA',
      tag: 'Kháng dầu 120°C',
      detail: 'Sản xuất từ 100% bã mía tự nhiên, tự phân hủy sinh học trong 45 ngày. Giữ nhiệt độ cơm nóng hổi 60°C trong suốt 45 phút giao hàng.',
      features: ['Ngăn riêng biệt không lẫn vị', 'An toàn lò vi sóng 3 phút', 'Thân thiện môi trường 100%']
    },
    {
      title: 'Tem Niêm Phong Chống Đổ Canh QR Code',
      subtitle: 'Bảo mật ẩm thực & Tích điểm O2O',
      tag: 'Tamper-Evident Seal',
      detail: 'Tem dán mép hộp bã mía có rãnh xé một chiều, cam kết đơn hàng nguyên vẹn từ tay đầu bếp đến bàn làm việc. Quét mã QR để nhận điểm thưởng.',
      features: ['Chống mở nắp dọc đường', 'Mã QR cấp mã voucher tức thì', 'In mực thực phẩm từ đậu nành']
    },
    {
      title: 'Thẻ Thành Viên "Bữa Cơm Đồng Nghiệp"',
      subtitle: 'Thẻ trả trước (Prepaid Pass) B2B',
      tag: 'Tiết kiệm 15%',
      detail: 'Gói thẻ cơm trưa 20 ngày dành cho nhóm đồng nghiệp. Thiết kế kỹ thuật số mô phỏng vân gỗ khắc laser, lưu trữ trực tiếp trong Zalo Ví.',
      features: ['Chia sẻ số dư trong nhóm', 'Bảo lưu ngày nếu nghỉ phép', 'Tặng món tráng miệng thứ 6']
    }
  ];

  const currentPlatformData = PLATFORM_CONTENT[activePlatform];

  return (
    <div className="w-full min-h-full flex flex-col p-4 md:p-8 max-w-[1600px] mx-auto z-10 relative pb-20">
      
      {/* ── 1. HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-700/60 text-xs font-black uppercase tracking-widest text-purple-800 dark:text-purple-300 mb-2.5">
            <Palette className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Studio Thiết Kế & Sáng Tạo Nội Dung Đa Kênh · BrandFlow
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Creative & Content Studio
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1.5 text-xs md:text-sm font-medium max-w-3xl leading-relaxed">
            Hệ thống nhận diện thương hiệu di sản F&B kết hợp mô phỏng nội dung truyền thông đa kênh theo thời gian thực. Đảm bảo mọi điểm chạm từ bài đăng Zalo đến hộp cơm bã mía đều đồng nhất 100% Brand DNA.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={onBack} 
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold transition-all text-xs flex items-center justify-center cursor-pointer shadow-sm"
          >
            <ArrowRight className="w-4 h-4 mr-1.5 rotate-180" /> Quay lại (Phase 4)
          </button>
          
          {onNext && (
            <button 
              onClick={onNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center group cursor-pointer"
            >
              Tiến hành sang Phase 6 (AI Deployment)
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* ── 2. TWO-COLUMN STUDIO STAGE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">

        {/* LEFT COLUMN (Cols 1-7): INTERACTIVE SOCIAL / O2O CONTENT SIMULATOR */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 flex flex-col">
            
            {/* Header with Platform Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400 font-bold block">
                  Trình Mô Phỏng Bài Đăng Thực Tế (Live Feed Simulator)
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  Nội Dung Truyền Thông Chuẩn Hóa
                </h3>
              </div>

              {/* 4 Platform Buttons */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                {[
                  { key: 'zalo', label: '📱 Zalo OA' },
                  { key: 'facebook', label: '📘 Facebook' },
                  { key: 'tiktok', label: '🎵 TikTok' },
                  { key: 'linkedin', label: '💼 LinkedIn' }
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setActivePlatform(p.key as any)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-xs ${
                      activePlatform === p.key
                        ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm font-black'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience Badge */}
            <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs text-purple-900 dark:text-purple-300">
              <span className="font-bold">🎯 Đối tượng mục tiêu:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{currentPlatformData.audience}</span>
            </div>

            {/* REALISTIC MOBILE FEED CARD MOCKUP */}
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm relative">
              
              {/* Post Header: Brand Avatar & Verified Badge */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A2E18] to-[#C2410C] flex items-center justify-center text-white font-black text-sm shadow-md ring-2 ring-white dark:ring-slate-700">
                    MỘC
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-xs md:text-sm text-slate-900 dark:text-white">
                        Bếp Nhà Mộc · Cơm Niêu Chữa Lành
                      </span>
                      <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-black">
                        ✓
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Hôm nay lúc 10:45 · Được tài trợ bởi BrandFlow
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => handleCopyText(currentPlatformData.copy)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Đã sao chép!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Sao chép bài
                    </>
                  )}
                </button>
              </div>

              {/* Post Content Body */}
              <div className="text-xs md:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-normal mb-4">
                {currentPlatformData.copy}
              </div>

              {/* Hashtags */}
              <div className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-4">
                {currentPlatformData.hashtags}
              </div>

              {/* Simulated Food Image Showcase Banner */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-[#3b2314] to-[#1e130c] p-6 text-white mb-4 shadow-inner">
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-amber-300 border border-amber-400/30">
                  ✨ Visual Asset Chuẩn DNA
                </div>
                
                <div className="max-w-md">
                  <span className="text-[11px] uppercase tracking-widest text-amber-400 font-mono font-bold block mb-1">
                    Gạo ST25 · Cá Bống Kho Tộ · Canh Cua Mồng Tơi
                  </span>
                  <h4 className="text-lg md:text-xl font-serif font-black tracking-tight leading-tight">
                    Mâm Cơm Niêu Chữa Lành
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                    Nấu thủ công từng niêu gang, thơm giòn lớp cháy đáy nồi, đượm vị mộc mạc của gian bếp xưa.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300">
                    Giá dùng thử: 49.000đ <span className="line-through text-slate-400 text-[10px]">65.000đ</span>
                  </span>
                  <span className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-md">
                    {currentPlatformData.cta} ➔
                  </span>
                </div>
              </div>

              {/* Post Engagement Bar */}
              <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 dark:border-slate-700/60 pt-3 font-medium">
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
                  <span>{currentPlatformData.likes}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>{currentPlatformData.comments} bình luận</span>
                  <span>{currentPlatformData.shares} chia sẻ</span>
                </div>
              </div>

            </div>

            {/* Live Copywriting Quality Audit Score */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Chữa Lành (Mindful)</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {currentPlatformData.toneScores.mindful}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Mộc Mạc (Authentic)</span>
                <span className="text-base font-black text-blue-600 dark:text-blue-400 font-mono">
                  {currentPlatformData.toneScores.authentic}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Kêu Gọi (CTA Score)</span>
                <span className="text-base font-black text-purple-600 dark:text-purple-400 font-mono">
                  {currentPlatformData.toneScores.ctaStrength}%
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (Cols 8-12): HERITAGE VISUAL TOKENS & TYPOGRAPHY SPECIMEN */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* 1. HERITAGE COLOR PALETTE SYSTEM */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400 font-bold block">
                  Bảng Màu Di Sản (Brand Color Tokens)
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  Nguyên Bản Bếp Nhà Mộc
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">5 Mã Màu Chuẩn</span>
            </div>

            <div className="space-y-3">
              {COLOR_PALETTE.map((color) => {
                const isCopied = copiedColor === color.hex;
                return (
                  <div 
                    key={color.hex}
                    onClick={() => handleCopyColor(color.hex)}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 transition-all cursor-pointer flex items-center justify-between group bg-slate-50/50 dark:bg-slate-800/40"
                    title="Click để sao chép mã HEX"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-10 h-10 rounded-xl shrink-0 shadow-md ring-2 ring-black/5 flex items-center justify-center text-white" 
                        style={{ backgroundColor: color.hex }}
                      >
                        {isCopied && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {color.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-bold">
                            {color.hex}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {color.usage}
                        </p>
                      </div>
                    </div>

                    <div className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-purple-600 transition-colors shrink-0 ml-2">
                      {isCopied ? 'Đã chép!' : 'Copy HEX'}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-400 italic text-center mt-3">
              * Click vào bất kỳ ô màu nào để sao chép mã màu HEX trực tiếp vào bộ nhớ tạm.
            </p>
          </div>

          {/* 2. TYPOGRAPHY HIERARCHY SPECIMEN */}
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400 font-bold block">
                  Hệ Thống Phông Chữ (Typography Stack)
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  Serif Truyền Thống & Sans Hiện Đại
                </h3>
              </div>
            </div>

            {/* Specimen Live Preview */}
            <div className="space-y-4">
              
              {/* Heading Specimen */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-500 font-bold uppercase font-mono">
                  <span>Primary Display: Playfair Display / Noto Serif</span>
                  <span>Heading H1 - H3</span>
                </div>
                <p className="text-lg md:text-xl font-serif font-black text-slate-900 dark:text-white leading-snug">
                  Hương Vị Niêu Cơm Xưa Giữa Lòng Thủ Đô
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Sử dụng cho Menu, slogan nhận diện và tiêu đề chiến dịch.
                </span>
              </div>

              {/* Body Specimen */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-500 font-bold uppercase font-mono">
                  <span>Secondary Body: Inter / Sans-Serif</span>
                  <span>UI & Body Text</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  Gạo ST25 chuẩn thơm dẻo, cá bống kho tiêu cay nồng trong niêu đất, canh cua mồng tơi ngọt lành giải nhiệt ngày hè oi ả.
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tối ưu đọc rõ ràng trên Zalo Mini App và thiết bị di động.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ── 3. ECO-PACKAGING ENGINEERING SPECIFICATIONS (3 CARDS) ── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-black uppercase text-purple-700 dark:text-purple-400 tracking-wider">
              Bao Bì & Điểm Chạm Thực Địa (Physical Brand Touchpoints)
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Quy Chuẩn Đóng Gói Sinh Học & Trải Nghiệm Mở Hộp
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">Tiêu chuẩn FDA & ESG</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PACKAGING_SPECS.map((spec, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between hover:border-purple-400 dark:hover:border-purple-600 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {spec.tag}
                  </span>
                  <Box className="w-5 h-5 text-slate-400" />
                </div>

                <h3 className="text-base font-black text-slate-900 dark:text-white mb-1">
                  {spec.title}
                </h3>
                <span className="text-xs text-purple-700 dark:text-purple-400 font-bold block mb-3">
                  {spec.subtitle}
                </span>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {spec.detail}
                </p>

                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {spec.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500">
                ✓ Đã khớp với công suất bếp trung tâm
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. MIDJOURNEY / FLUX FOOD PHOTOGRAPHY PROMPT PROMPT KIT ── */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                Prompt Kỹ Thuật Sinh Ảnh Món Ăn (AI Food Photography Prompt)
              </h3>
              <p className="text-xs text-slate-400">
                Tối ưu cho Midjourney v6 & Flux Pro để tạo ảnh thực đơn chuẩn ánh sáng mộc mạc không bị giả.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const promptText = `/imagine prompt: authentic Vietnamese traditional claypot rice with braised goby fish, steaming hot, sliced red chili and fresh green onions, warm golden hour ambient lighting, rustic wooden table surface, handmade ceramic bowl, hyper-realistic food photography, commercial culinary shot, 8k resolution, depth of field --ar 16:9 --style raw --v 6.0`;
              navigator.clipboard.writeText(promptText);
              setCopiedPrompt(true);
              setTimeout(() => setCopiedPrompt(false), 2000);
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            {copiedPrompt ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedPrompt ? 'Đã sao chép Prompt!' : 'Sao chép Prompt Studio'}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-purple-300 leading-relaxed select-all">
          /imagine prompt: authentic Vietnamese traditional claypot rice with braised goby fish, steaming hot, sliced red chili and fresh green onions, warm golden hour ambient lighting, rustic wooden table surface, handmade ceramic bowl, hyper-realistic food photography, commercial culinary shot, 8k resolution, depth of field --ar 16:9 --style raw --v 6.0
        </div>
      </div>

    </div>
  );
}
