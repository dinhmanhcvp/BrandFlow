import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
 Sparkles, Copy, Send, CheckCircle2, MoreHorizontal, Heart, MessageCircle, Share2, 
 Globe, Search, ImageIcon, Music, Users, Briefcase, PenSquare, ArrowLeft, PlusSquare, Play, Flame, Bookmark, ThumbsUp
} from 'lucide-react';

const isBepNhaMoc = true;
const brandName = "Bếp Nhà Mộc";
const coreUsps = ["Thực đơn chữa lành", "Giao hàng hỏa tốc 30p", "Hộp bã mía bảo vệ môi trường"];
const trends = ["Ăn trưa không buồn ngủ", "Giảm stress văn phòng", "Cơm niêu truyền thống", "Tiệc doanh nghiệp"];
const platformOptions = [
 { name: 'Facebook', icon: Users, color: 'text-blue-600' },
 { name: 'LinkedIn', icon: Briefcase, color: 'text-sky-700' },
 { name: 'TikTok', icon: Music, color: 'text-slate-900 dark:text-white' },
 { name: 'Instagram', icon: Heart, color: 'text-pink-600' },
 { name: 'Zalo', icon: MessageCircle, color: 'text-blue-500' },
];

const MOCK_FACEBOOK_POST = `🔥 [CẢNH BÁO "BURN-OUT"] - GIẢI PHÁP CHỮA LÀNH TỪ BÊN TRONG DÀNH CHO DÂN VĂN PHÒNG! 🔥

Khảo sát cho thấy 70% dân văn phòng tại các thành phố lớn đang gặp tình trạng kiệt sức. Bạn uể oải, cạn kiệt năng lượng sau phiên họp sáng? 

Đã đến lúc nâng cấp bữa trưa của bạn với [COMBO CHỮA LÀNH] ĐỘC QUYỀN TỪ BẾP NHÀ MỘC! 🌱

Chỉ với 65K, Bếp mang đến cho bạn không chỉ là thức ăn, mà là một trải nghiệm Tái tạo năng lượng chuẩn chỉnh:
🍱 1 Phần Cơm Niêu Gạo ST25 chuẩn xuất khẩu.
🍖 1 Món chính tự chọn thay đổi mỗi ngày.
🍲 Tặng kèm Canh rau theo mùa & Đồ chua nhà muối.

👉 Đừng chần chừ, hãy để Bếp Nhà Mộc chăm sóc bữa trưa của bạn! 
💬 Inbox m.me/bepnhamoc hoặc Zalo OA (Link dưới bình luận) để đặt ngay Menu Nóng Hổi hôm nay!
#BepNhaMoc #ComVanPhongCaoCap #MindfulDining #ChuaLanh`;

const MOCK_LINKEDIN_POST = `🚀 LỜI GIẢI CHO BÀI TOÁN "BURN-OUT" TẠI CHỐN CÔNG SỞ 🚀

Là những nhà quản lý, chúng ta luôn tìm kiếm cách tối ưu hóa hiệu suất làm việc của nhân sự. Liệu bữa trưa hiện tại của team có đang cung cấp đủ "năng lượng sạch"?

Tại Bếp Nhà Mộc, chúng tôi định nghĩa lại "Cơm Trưa Văn Phòng" thông qua triết lý Mindful Dining:
✅ Nguồn nguyên liệu sạch 100% Farm-to-table.
✅ Bao bì xanh (Hộp bã mía), thể hiện trách nhiệm ESG của doanh nghiệp.
✅ Menu luân phiên thiết kế cân bằng dinh dưỡng.

Đầu tư vào bữa trưa của nhân viên chính là khoản đầu tư sinh lời cao nhất cho hiệu suất doanh nghiệp. 
Bếp Nhà Mộc tự hào là đối tác Tiệc doanh nghiệp cho hơn 25+ doanh nghiệp tại Hà Nội.

📩 Quý doanh nghiệp quan tâm đến giải pháp ăn trưa khỏe mạnh cho tập thể, vui lòng Inbox để nhận ngay bảng báo giá Corporate.
#CorporateCatering #B2B #HR #EmployeeWellbeing #MindfulDining`;

const MOCK_INSTAGRAM_POST = `Ăn trưa chữa lành cùng Bếp Nhà Mộc 🌿✨

Không gian xanh mát, hương vị thanh tao. Hãy để một phần cơm niêu nóng hổi xua tan đi áp lực deadline của bạn. 

Bữa trưa hôm nay của bạn có gì? Cùng tag người đồng nghiệp "cạ cứng" vào đây để lên kèo ăn trưa ngay nhé! 🍱👇

📸 Đừng quên check-in với hộp cơm bã mía siêu xinh của Bếp để nhận voucher 20% cho lần đặt tiếp theo!

#BepNhaMoc #ComVanPhong #InstaFood #HealthyLifestyle #MindfulDining`;

const MOCK_TIKTOK_POST = `[Trending Nhạc Nền ASMR + Lofi Chill]

POV: 11h30 trưa, sếp vừa dí thêm 3 cái deadline rớt nước mắt... nhưng bụng thì réo rắt đình công 😭 

Làm văn phòng khổ lắm mấy ní ơi, chạy KPI mệt bở hơi tai mà trưa còn phải lội nắng đi kiếm đồ ăn thì đúng là "trầm cảm". Ngồi xuống, hít một hơi thật sâu, để Bếp Nhà Mộc "chữa lành" cho mấy bà nha! 🌿✨

📦 [Unbox cùng tui nè] 
Trời ơi mở cái nắp ra là mùi thơm nức mũi! Hộp bã mía xịn xò 100% không lo hạt nhựa vi sinh nha. Cầm trên tay vẫn còn nóng hổi luôn.

🔥 Mấy ní nhanh tay bấm vào giỏ hàng góc trái màn hình 🛒. Đang có Flash Sale Freeship cho 50 bạn nhanh tay nhất nè! Nhớ rủ cả phòng đặt chung để áp mã giảm 30K nha!

#BepNhaMoc #ComVanPhong #WhatIEatInADay #VlogNhanVienVanPhong #ChuaLanh`;

const MOCK_ZALO_POST = `[ZALO OA - BẾP NHÀ MỘC] 🍱 TRƯA NAY TEAM MÌNH ĂN GÌ? - ĐẶT SỚM GIẢM SÂU, GIAO TẬN BÀN!

Mưa rào hay nắng gắt, bước ra ngoài ăn trưa luôn là nỗi ám ảnh của dân văn phòng. Đừng để thời tiết làm hỏng tâm trạng và bữa trưa của bạn! Để Bếp Nhà Mộc lo trọn gói từ A-Z với menu "Chữa lành" mỗi ngày.

🌟 [MENU THỨ 5 - NẠP NĂNG LƯỢNG CUỐI TUẦN]
🥢 Thịt Kho Niêu Đất: Ba rọi rút sườn kho rệu trong 4 tiếng.
🥢 Gà Nướng Sốt Teriyaki Mộc: Tươi mọng, healthy.

🎁 [ƯU ĐÃI ĐỘC QUYỀN TRÊN ZALO]
💥 Nhập mã TEAMMOC20 giảm ngay 20% cho nhóm đặt từ 5 phần.
💥 Tặng thêm Trà Gạo Lứt Đậu Đen Detox cho mỗi phần ăn.

👇 Gửi ngay bài viết này vào nhóm chat công ty và Nhấn nút [ĐẶT HÀNG NGAY] bên dưới! Hệ thống Zalo Mini App của Bếp sẽ tự động lên đơn trong 3 giây.
#BepNhaMoc #ComVanPhong #ZaloMiniApp #GiaoTanNoi`;

export default function CinematicContentDailyMock({ onNext }: { onNext: () => void }) {
 const [platform, setPlatform] = useState('Facebook');
 const [isGenerating, setIsGenerating] = useState(false);
 const [generatedContent, setGeneratedContent] = useState<string | null>(null);
 const [topic, setTopic] = useState('');
 const [step, setStep] = useState(0);

 useEffect(() => {
  if (step === 1) {
   let i = 0;
   const text = 'Tạo bài viết thu hút dân văn phòng khu vực Hà Đông ăn trưa nhóm...';
   const interval = setInterval(() => {
    setTopic(text.slice(0, i + 1));
    i++;
    if (i >= text.length) clearInterval(interval);
   }, 30);
   return () => clearInterval(interval);
  }
 }, [step]);

 useEffect(() => {
  // Sequence: 
  // 0: start empty
  // 1: Zoom in Prompt Box, Type topic
  // Wait for typing
  // IsGenerating
  // 2: Done FB, zoom out panel, zoom in phone
  // 3: swipe -> LinkedIn
  // 4: swipe -> TikTok
  // 5: swipe -> Instagram
  // 6: swipe -> Zalo
  // 7: onNext
  const sequence = async () => {
   await new Promise(r => setTimeout(r, 1000));
   setStep(1); // Zoom in on Prompt Box & start typing
   
   await new Promise(r => setTimeout(r, 3000)); // wait for typing
   setIsGenerating(true);
   
   await new Promise(r => setTimeout(r, 1500));
   setIsGenerating(false);
   setStep(2); // Phone pops up
   setGeneratedContent(MOCK_FACEBOOK_POST);

   await new Promise(r => setTimeout(r, 3000));
   setPlatform('LinkedIn');
   setGeneratedContent(MOCK_LINKEDIN_POST);

   await new Promise(r => setTimeout(r, 3000));
   setPlatform('TikTok');
   setGeneratedContent(MOCK_TIKTOK_POST);

   await new Promise(r => setTimeout(r, 3000));
   setPlatform('Instagram');
   setGeneratedContent(MOCK_INSTAGRAM_POST);

   await new Promise(r => setTimeout(r, 3000));
   setPlatform('Zalo');
   setGeneratedContent(MOCK_ZALO_POST);

   await new Promise(r => setTimeout(r, 3500));
   onNext();
  };
  sequence();
 }, []);

 const ProfilePic = ({ size = 10 }: { size?: number }) => (
  <div className={`w-${size} h-${size} rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-600 overflow-hidden`}>
   <img src="/assets/bep-nha-moc/avatar.jpg" className="w-full h-full object-cover" alt="Avatar" />
  </div>
 );

 const renderNativeUI = () => {
  if (!generatedContent) return null;

  if (platform === 'Facebook') {
   return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#f0f2f5] dark:bg-[#18191A] h-full flex flex-col relative w-full font-sans">
      <div className="bg-white dark:bg-[#242526] px-4 py-3 flex justify-between items-center shadow-sm z-10 shrink-0">
       <div className="text-[#0866FF] font-bold text-2xl tracking-tighter">facebook</div>
      </div>
      
      <div className="bg-white dark:bg-[#242526] mt-2 pb-2 h-full overflow-hidden flex flex-col">
       <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
         <ProfilePic size={10} />
         <div>
          <div className="font-bold text-[14px] text-black dark:text-[#E4E6EB] leading-tight flex items-center gap-1">{brandName} <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"><CheckCircle2 className="w-2 h-2 text-white" /></div></div>
          <div className="flex items-center text-[12px] text-[#65676B] dark:text-[#B0B3B8] gap-1">
           <span>Vừa xong</span> • <Globe className="w-3 h-3" />
          </div>
         </div>
        </div>
       </div>
       <div className="px-4 py-1 text-[14px] text-black dark:text-[#E4E6EB] whitespace-pre-wrap leading-snug flex-1 overflow-y-auto no-scrollbar">
        {generatedContent}
       </div>
       <div className="w-full aspect-video bg-slate-100 flex items-center justify-center border-y border-slate-200 overflow-hidden relative shrink-0">
        <img src="/assets/bep-nha-moc/banner.jpg" className="w-full h-full object-cover" alt="Post content" />
       </div>
       <div className="px-4 py-2 shrink-0">
        <div className="flex justify-between items-center text-[13px] text-[#65676B] border-b border-slate-200 pb-2">
         <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full bg-[#0866FF] flex items-center justify-center"><ThumbsUp className="w-2.5 h-2.5 text-white fill-white"/></div> 12K</div>
         <div className="flex gap-3"><span>432 bình luận</span><span>120 chia sẻ</span></div>
        </div>
       </div>
      </div>
    </motion.div>
   );
  }
  
  if (platform === 'LinkedIn') {
   return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#E9E5DF] h-full flex flex-col font-sans">
     <div className="bg-white px-4 py-3 flex justify-between items-center shrink-0 shadow-sm z-10 border-b border-slate-200">
      <div className="text-[#0A66C2] font-bold text-xl tracking-tighter flex items-center gap-1">
       <div className="w-6 h-6 bg-[#0A66C2] text-white rounded flex items-center justify-center font-bold text-sm">in</div>
       LinkedIn
      </div>
     </div>
     
     <div className="bg-white mt-2 pb-2 h-full overflow-hidden flex flex-col">
      <div className="px-3 pt-3 pb-2 flex items-start gap-3">
       <ProfilePic size={12} />
       <div>
        <div className="font-bold text-[14px] text-black leading-tight hover:text-[#0A66C2] cursor-pointer">{brandName}</div>
        <div className="text-[12px] text-slate-500 leading-tight">Tiệc doanh nghiệp & Mindful Dining Solutions</div>
        <div className="flex items-center text-[11px] text-slate-400 gap-1 mt-0.5">
         <span>1h</span> • <Globe className="w-3 h-3" />
        </div>
       </div>
      </div>
      <div className="px-4 py-1 text-[13px] text-black whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto no-scrollbar">
       {generatedContent}
      </div>
      <div className="w-full aspect-video bg-slate-100 flex items-center justify-center border-y border-slate-200 overflow-hidden relative shrink-0">
       <img src="/assets/bep-nha-moc/banner.jpg" className="w-full h-full object-cover" alt="Post content" />
      </div>
      <div className="px-4 py-2 shrink-0">
       <div className="flex justify-between items-center text-[12px] text-slate-500 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1"><div className="w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center"><ThumbsUp className="w-2.5 h-2.5 text-white fill-white"/></div> 894</div>
        <div className="flex gap-3"><span>124 comments</span><span>56 reposts</span></div>
       </div>
      </div>
     </div>
    </motion.div>
   );
  }
  
  if (platform === 'Instagram') {
   return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white h-full flex flex-col font-sans">
     <div className="bg-white px-4 py-3 flex justify-between items-center shrink-0 border-b border-slate-200 z-10">
      <div className="font-[Playfair_Display] font-bold text-xl italic tracking-tight">Instagram</div>
      <div className="flex gap-4">
       <Heart className="w-6 h-6" />
       <MessageCircle className="w-6 h-6" />
      </div>
     </div>
     
     <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
       <div className="flex items-center gap-2">
        <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
         <div className="bg-white p-[2px] rounded-full">
          <ProfilePic size={8} />
         </div>
        </div>
        <div className="font-bold text-[13px] text-black leading-tight flex items-center gap-1">
         {brandName.toLowerCase().replace(/\s/g, '_')} 
         <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"><CheckCircle2 className="w-2 h-2 text-white" /></div>
        </div>
       </div>
       <MoreHorizontal className="w-5 h-5" />
      </div>
      
      <div className="w-full aspect-square bg-slate-100 flex items-center justify-center border-y border-slate-100 overflow-hidden relative shrink-0">
       <img src="/assets/bep-nha-moc/banner.jpg" className="w-full h-full object-cover" alt="Post content" />
      </div>
      
      <div className="px-4 py-3 shrink-0">
       <div className="flex justify-between items-center mb-2">
        <div className="flex gap-4">
         <Heart className="w-6 h-6" />
         <MessageCircle className="w-6 h-6" />
         <Send className="w-6 h-6" />
        </div>
        <Bookmark className="w-6 h-6" />
       </div>
       <div className="font-bold text-[13px] mb-1">10,432 likes</div>
       <div className="text-[13px] text-black whitespace-pre-wrap leading-snug">
        <span className="font-bold mr-2">{brandName.toLowerCase().replace(/\s/g, '_')}</span>
        {generatedContent}
       </div>
      </div>
     </div>
    </motion.div>
   );
  }

  if (platform === 'Zalo') {
   return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#E2E8F0] h-full flex flex-col font-sans">
     <div className="bg-[#0068FF] text-white px-3 pt-4 pb-3 flex justify-between items-center shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
       <ArrowLeft className="w-6 h-6" />
       <div className="relative">
         <div className="w-10 h-10 rounded-full bg-white text-[#0068FF] flex items-center justify-center font-bold text-sm border-2 border-white">{brandName.substring(0,2)}</div>
         <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0068FF]" />
       </div>
       <div>
        <div className="font-bold text-[16px]">{brandName}</div>
        <div className="text-[12px] opacity-80 mt-0.5">Vừa mới truy cập</div>
       </div>
      </div>
     </div>
     
     <div className="flex-1 p-3 overflow-y-auto no-scrollbar flex flex-col gap-3 pb-10 bg-[#E2E8F0]">
      <div className="text-center text-[11px] font-bold text-slate-400 my-2 px-3 py-1 bg-slate-200/50 rounded-full self-center">10:45 Hôm nay</div>
      <div className="bg-white rounded-[18px] overflow-hidden shadow-sm border border-slate-200/50 max-w-[88%] self-start relative">
       <div className="w-full aspect-[4/3] bg-slate-100 flex items-center justify-center relative overflow-hidden">
        <img src="/assets/bep-nha-moc/banner.jpg" className="w-full h-full object-cover" alt="Banner" />
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded text-[11px] font-semibold backdrop-blur-sm">Zalo Broadcast</div>
       </div>
       <div className="p-3.5 text-[15px] text-black whitespace-pre-wrap leading-relaxed">
        {generatedContent}
       </div>
       <div className="p-3 border-t border-slate-100 flex justify-center bg-slate-50">
         <span className="text-[#0068FF] text-[15px] font-bold">Xem chi tiết</span>
       </div>
      </div>
     </div>
    </motion.div>
   );
  }

  if (platform === 'TikTok') {
   return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-black h-full flex flex-col relative text-white font-sans overflow-hidden">
     <div className="absolute top-0 inset-x-0 pt-4 pb-2 flex justify-between items-center px-4 z-20 text-white shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
      <div className="w-6 h-6 flex items-center justify-center"><Globe className="w-5 h-5" /></div>
      <div className="flex gap-4 font-bold text-[16px] tracking-tight">
       <span className="opacity-60">Following</span>
       <span className="relative">For You <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full" /></span>
      </div>
      <Search className="w-6 h-6" />
     </div>
     
     <div className="absolute inset-0 bg-[#121212] flex items-center justify-center overflow-hidden">
      <img src="/assets/bep-nha-moc/banner.jpg" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Video background" />
      <Play className="w-16 h-16 text-white/20 fill-white/20 relative z-10" />
     </div>

     <div className="absolute right-3 bottom-[90px] flex flex-col items-center gap-5 z-20">
      <div className="relative mb-2">
       <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-white"><ProfilePic size={12} /></div>
       <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#FE2C55] rounded-full flex items-center justify-center shadow-md"><span className="text-white text-[14px] font-bold leading-none">+</span></div>
      </div>
      <div className="flex flex-col items-center gap-1"><Heart className="w-8 h-8 fill-white/90 drop-shadow-md" /></div>
      <div className="flex flex-col items-center gap-1"><MessageCircle className="w-8 h-8 fill-white/90 drop-shadow-md" /></div>
      <div className="flex flex-col items-center gap-1"><Bookmark className="w-8 h-8 fill-[#FACD00]/90 text-[#FACD00] drop-shadow-md" /></div>
     </div>

     <div className="absolute bottom-[20px] left-0 right-[70px] px-3 z-20 h-[50%] overflow-y-auto no-scrollbar mask-image-bottom-fade flex flex-col justify-end pb-4">
      <div className="font-bold text-[15px] mb-1 text-white drop-shadow-md">@{brandName.toLowerCase().replace(/\s/g, '')}</div>
      <div className="text-[13px] leading-snug text-white drop-shadow-md font-medium whitespace-pre-wrap">{generatedContent}</div>
     </div>
    </motion.div>
   );
  }
 };

 return (
  <div className="flex flex-col h-full w-full overflow-hidden bg-transparent relative z-10">
   <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
   
   {/* Sidebar Mock */}
   <div className="w-64 bg-[#0B1120]/50 backdrop-blur-md border-r border-slate-800 flex flex-col z-20 shrink-0 absolute top-0 left-0 bottom-0 h-full">
    <div className="p-6 flex items-center gap-3">
     <div className="w-8 h-8 text-cyan-400 rounded-full border-2 border-cyan-400 flex items-center justify-center shrink-0 font-bold">BF</div>
     <span className="font-space font-bold text-lg text-white">BrandFlow</span>
    </div>
    <div className="flex-1 px-4 space-y-2 mt-4 text-sm font-medium">
      <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
        <span className="w-5 h-5 block" /> Dashboard
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
        <span className="w-5 h-5 block" /> Data Ingestion
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
        <span className="w-5 h-5 block" /> AI Strategy
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl transition-colors bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
        <span className="w-5 h-5 block border-2 border-cyan-400 rounded" /> Content Lab
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl transition-colors text-slate-400">
        <span className="w-5 h-5 block" /> Gantt & Finance
      </div>
    </div>
   </div>

   <motion.div 
    className="ml-64 flex-1 h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden z-20"
    initial={{ filter: 'blur(0px)', scale: 1 }}
    animate={{ filter: step >= 2 ? 'blur(10px)' : 'blur(0px)', scale: step >= 2 ? 1.05 : 1 }}
    transition={{ duration: 1 }}
   >
    <header className="shrink-0 mb-6 flex justify-between items-end">
     <div>
      <div className="page-badge inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 border-blue-200 text-blue-700 mb-2 border">
       <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Content Factory
      </div>
      <h1 className="text-3xl font-black tracking-tight text-white drop-shadow">Content Automation</h1>
     </div>
    </header>

    <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-8 bg-transparent">
     {/* COMPACT CONFIGURATION PANEL */}
     <motion.div 
      animate={
        step === 1 ? { scale: 1.25, x: 250, zIndex: 100, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' } : 
        { scale: 1, x: 0, zIndex: 10, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }
      }
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="lg:w-[450px] shrink-0 flex flex-col !p-5 shadow-sm border border-slate-200 rounded-3xl bg-white z-10 h-full origin-left"
     >
      <h2 className="text-base font-bold text-slate-900 flex items-center mb-4 shrink-0">
       <PenSquare className="w-4 h-4 mr-2 text-blue-500" /> Cấu hình Nội dung
      </h2>

      {/* Platform Selector */}
      <div className="grid grid-cols-5 gap-2 mb-4 shrink-0">
       {platformOptions.map((p) => (
        <button 
         key={p.name}
         className={`flex flex-col items-center py-2 rounded-xl transition-all border border-transparent hover:bg-slate-50 text-slate-400`}
        >
         <p.icon className={`w-4 h-4 mb-1`} />
         <span className={`text-[9px] font-bold`}>{p.name}</span>
        </button>
       ))}
      </div>

      {/* Quick Prompts */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-4 shrink-0">
       <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center mb-2"><Sparkles className="w-3 h-3 mr-1"/> Trending & DNA</span>
       <div className="flex flex-wrap gap-2">
        {coreUsps.slice(0, 1).map((usp, idx) => (
         <button key={`dna-${idx}`} className="text-[10px] font-bold bg-cyan-500/10 text-cyan-600 px-2.5 py-1.5 rounded-lg truncate max-w-[200px]">
          {usp}
         </button>
        ))}
        {trends.slice(0, 2).map((t_item, idx) => (
         <button key={idx} className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2.5 py-1.5 rounded-lg truncate max-w-[150px]">
          #{t_item}
         </button>
        ))}
       </div>
      </div>

      {/* Topic Input */}
      <div className="flex-1 flex flex-col mb-4 min-h-0 relative">
       <textarea 
        value={topic} readOnly
        placeholder="Nhập yêu cầu nội dung..."
        className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none resize-none shadow-inner text-slate-800"
       />
       {step === 1 && !isGenerating && (
         <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute bottom-4 right-4 text-[10px] font-bold text-blue-500 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
         >
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" /> typing...
         </motion.div>
       )}
      </div>

      <div className="mb-4 shrink-0">
       <select disabled className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold outline-none text-slate-600">
        <option value="Chuyên nghiệp">Giọng điệu: Khám phá, Thuyết phục</option>
       </select>
      </div>

      <button 
       className={`shrink-0 w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center transition-all ${
        isGenerating ? 'bg-slate-300 text-slate-500 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-md ring-2 ring-blue-500/50'
       }`}
      >
       {isGenerating ? <Sparkles className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
       {isGenerating ? "Đang xử lý đa nền tảng..." : "Sinh Nội Dung (AI)"}
      </button>
     </motion.div>

     <div className="flex-1 h-full flex flex-col items-center justify-center relative lg:min-h-0">
       <div className="w-[370px] h-[780px] lg:h-[90%] border-[8px] border-slate-200 rounded-[3.5rem] flex flex-col items-center justify-center relative bg-white shadow-xl opacity-30">
       </div>
     </div>
    </div>
   </motion.div>

   {/* 
    ========================================================================
    ZOOMED IN PHONE VIEW (CINEMATIC)
    ======================================================================== 
   */}
   <AnimatePresence>
    {step >= 2 && (
     <motion.div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
     >
       <motion.div 
        className="w-full max-w-[400px] h-[85vh] relative"
        initial={{ scale: 0.8, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
       >
        <div className="relative bg-slate-800 dark:bg-black rounded-[3.5rem] p-[4px] shadow-2xl flex flex-col flex-1 min-h-0 h-full ring-1 ring-white/10">
         <div className="bg-white dark:bg-black rounded-[3.2rem] overflow-hidden flex flex-col h-full relative border-[4px] border-black dark:border-[#121212]">
          
          <div className="absolute top-2 inset-x-0 h-7 bg-black rounded-full w-32 mx-auto z-50 flex justify-center items-center shadow-md">
           <div className="w-12 h-1 bg-[#1a1a1a] rounded-full" />
          </div>

          <div className="absolute top-0 inset-x-0 px-7 pt-4 pb-1 flex justify-between items-center text-[12px] font-bold z-40 pointer-events-none text-black mix-blend-difference">
            <span className="text-white">9:41</span>
          </div>

          <div className="flex-1 overflow-hidden relative w-full h-full pt-10">
            <AnimatePresence mode="wait">
             <motion.div 
              key={platform} 
              initial={{ x: 300, opacity: 0, rotateY: -15, scale: 0.9 }} 
              animate={{ x: 0, opacity: 1, rotateY: 0, scale: 1 }} 
              exit={{ x: -300, opacity: 0, rotateY: 15, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25 }}
              className="h-full w-full transform-gpu"
             >
               {renderNativeUI()}
             </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-1 inset-x-0 w-full h-4 flex justify-center items-center z-40 pointer-events-none">
            <div className="w-1/3 h-[5px] rounded-full bg-black/30" />
          </div>
         </div>
        </div>

        <div className="absolute -bottom-16 inset-x-0 flex justify-center">
         <motion.div 
          key={platform}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-white/20"
         >
          <span className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 uppercase tracking-widest">
            {platform} PLATFORM
          </span>
         </motion.div>
        </div>
       </motion.div>
     </motion.div>
    )}
   </AnimatePresence>

  </div>
 );
}
