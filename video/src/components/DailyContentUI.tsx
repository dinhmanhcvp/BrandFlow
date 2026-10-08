import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/Inter';
import { PenSquare, Sparkles, CheckCircle2, Globe, ThumbsUp, Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ArrowLeft, Search, Play, Users, Briefcase, Music } from 'lucide-react';

const { fontFamily } = loadFont();

const brandName = "Bếp Nhà Mộc";

const MOCK_FACEBOOK_POST = `🔥 [CẢNH BÁO "BURN-OUT"] - GIẢI PHÁP CHỮA LÀNH TỪ BÊN TRONG! 🔥\nĐã đến lúc nâng cấp bữa trưa của bạn với [COMBO CHỮA LÀNH] ĐỘC QUYỀN TỪ BẾP NHÀ MỘC! 🌱\n\nChỉ với 65K, Bếp mang đến cho bạn không chỉ là thức ăn, mà là một trải nghiệm Tái tạo năng lượng chuẩn chỉnh.`;

const MOCK_LINKEDIN_POST = `🚀 LỜI GIẢI CHO BÀI TOÁN "BURN-OUT" TẠI CHỐN CÔNG SỞ 🚀\nĐầu tư vào bữa trưa của nhân viên chính là khoản đầu tư sinh lời cao nhất cho hiệu suất doanh nghiệp. Bếp Nhà Mộc tự hào là đối tác Tiệc doanh nghiệp cho hơn 25+ doanh nghiệp.`;

const MOCK_INSTAGRAM_POST = `Ăn trưa chữa lành cùng Bếp Nhà Mộc 🌿✨\n\nKhông gian xanh mát, hương vị thanh tao. Hãy để một phần cơm niêu nóng hổi xua tan đi áp lực deadline của bạn.`;

const MOCK_TIKTOK_POST = `POV: 11h30 trưa, sếp vừa dí thêm 3 cái deadline rớt nước mắt... nhưng bụng thì réo rắt đình công 😭 \n\nNgồi xuống, hít một hơi thật sâu, để Bếp Nhà Mộc "chữa lành" cho mấy bà nha! 🌿✨`;

const MOCK_ZALO_POST = `[ZALO OA - BẾP NHÀ MỘC] 🍱 TRƯA NAY TEAM MÌNH ĂN GÌ? - ĐẶT SỚM GIẢM SÂU, GIAO TẬN BÀN!\n\nMưa rào hay nắng gắt, bước ra ngoài ăn trưa luôn là nỗi ám ảnh của dân văn phòng. Để Bếp Nhà Mộc lo trọn gói từ A-Z với menu "Chữa lành" mỗi ngày.`;

const avatarUrl = staticFile('assets/bep-nha-moc/avatar.jpg');
const bannerUrl = staticFile('assets/bep-nha-moc/banner.jpg');

export const DailyContentUI: React.FC = () => {
 const frame = useCurrentFrame();
 const { fps } = useVideoConfig();

 // Container entry animation
 const containerSpring = spring({ frame, fps, config: springConf.snappy });
 const scale = interpolate(containerSpring, [0, 1], [0.9, 1]);
 const opacity = interpolate(containerSpring, [0, 1], [0, 1]);

 // We have 180 frames (6 seconds).
 // 0 - 10: entry
 // 10 - 45: Typing prompt
 // 45 - 60: Button click, AI working
 // 60 - 180: Cycle through platforms (24 frames each)

 const phoneSpring = spring({ frame: Math.max(0, frame - 60), fps, config: springConf.snappy });
 const phoneScale = interpolate(phoneSpring, [0, 1], [0.8, 1]);
 const phoneOpacity = interpolate(phoneSpring, [0, 1], [0, 1]);
 
 // Shift container so the panel is centered initially, then shifts left to make room for phone
 // Panel is 380, Phone is 440, gap is 32. Total = 852.
 // Diff = (852/2) - (380/2) = 426 - 190 = 236px.
 const containerShiftX = interpolate(phoneSpring, [0, 1], [236, 0]);

 let platformIndex = 0;
 if (frame >= 60 && frame < 84) platformIndex = 0;
 else if (frame >= 84 && frame < 108) platformIndex = 1;
 else if (frame >= 108 && frame < 132) platformIndex = 2;
 else if (frame >= 132 && frame < 156) platformIndex = 3;
 else if (frame >= 156) platformIndex = 4;

 const platformNames = ['Facebook', 'LinkedIn', 'TikTok', 'Instagram', 'Zalo'];
 const platform = platformNames[platformIndex];

 // Swipe animation based on frame % 24
 const phaseFrame = Math.max(0, frame - 60) % 24;
 const isFirstPlatform = frame >= 60 && frame < 84;
 const isTransitioning = phaseFrame < 8 && !isFirstPlatform;
 
 const slideSpring = spring({
  frame: isTransitioning ? phaseFrame : 8,
  fps,
  config: springConf.snappy
 });
 
 const contentX = interpolate(slideSpring, [0, 1], [200, 0]);
 const contentOpacity = interpolate(slideSpring, [0, 1], [0, 1]);
 const contentRotateY = interpolate(slideSpring, [0, 1], [-15, 0]);

 const ProfilePic = ({ size = 32 }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', border: '1px solid #E2E8F0', overflow: 'hidden', flexShrink: 0 }}>
   <Img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </div>
 );

 const renderNativeUI = (platformName: string) => {
  if (platformName === 'Facebook') {
   return (
    <div style={{ backgroundColor: '#f0f2f5', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ backgroundColor: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', zIndex: 10 }}>
       <div style={{ color: '#0866FF', fontWeight: 800, fontSize: 20, letterSpacing: -0.5 }}>facebook</div>
      </div>
      
      <div style={{ backgroundColor: 'white', marginTop: 8, paddingBottom: 8, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
       <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
         <ProfilePic size={40} />
         <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'black', display: 'flex', alignItems: 'center', gap: 4 }}>
           {brandName} <div style={{ width: 12, height: 12, backgroundColor: '#0866FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={8} color="white" /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: '#65676B', gap: 4 }}>
           Vừa xong • <Globe size={12} />
          </div>
         </div>
        </div>
       </div>
       <div style={{ padding: '4px 16px', fontSize: 14, color: 'black', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
        {MOCK_FACEBOOK_POST}
       </div>
       <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', marginTop: 12, position: 'relative' }}>
        <Img src={bannerUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
       </div>
       <div style={{ padding: '8px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#65676B', borderBottom: '1px solid #E5E7EB', paddingBottom: 8 }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: '#0866FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <ThumbsUp size={10} color="white" fill="white" />
          </div> 12K
         </div>
         <div style={{ display: 'flex', gap: 12 }}><span>432 bình luận</span><span>120 chia sẻ</span></div>
        </div>
       </div>
      </div>
    </div>
   );
  }
  
  if (platformName === 'LinkedIn') {
   return (
    <div style={{ backgroundColor: '#E9E5DF', height: '100%', display: 'flex', flexDirection: 'column' }}>
     <div style={{ backgroundColor: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', zIndex: 10 }}>
      <div style={{ color: '#0A66C2', fontWeight: 800, fontSize: 18, letterSpacing: -0.5, display: 'flex', alignItems: 'center', gap: 4 }}>
       <div style={{ width: 20, height: 20, backgroundColor: '#0A66C2', color: 'white', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>in</div>
       LinkedIn
      </div>
     </div>
     
     <div style={{ backgroundColor: 'white', marginTop: 8, paddingBottom: 8, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ padding: '12px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
       <ProfilePic size={48} />
       <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: 'black' }}>{brandName}</div>
        <div style={{ fontSize: 12, color: '#64748B' }}>Tiệc doanh nghiệp & Mindful Dining Solutions</div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 11, color: '#94A3B8', gap: 4, marginTop: 2 }}>
         1h • <Globe size={11} />
        </div>
       </div>
      </div>
      <div style={{ padding: '4px 16px', fontSize: 13, color: 'black', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
       {MOCK_LINKEDIN_POST}
      </div>
      <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', marginTop: 12, position: 'relative' }}>
       <Img src={bannerUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
     </div>
    </div>
   );
  }
  
  if (platformName === 'Instagram') {
   return (
    <div style={{ backgroundColor: 'white', height: '100%', display: 'flex', flexDirection: 'column' }}>
     <div style={{ backgroundColor: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', zIndex: 10 }}>
      <div style={{ fontFamily: 'serif', fontWeight: 800, fontStyle: 'italic', fontSize: 20 }}>Instagram</div>
      <div style={{ display: 'flex', gap: 16 }}>
       <Heart size={20} color="black" />
       <MessageCircle size={20} color="black" />
      </div>
     </div>
     
     <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ padding: 2, borderRadius: '50%', background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
         <div style={{ border: '2px solid white', borderRadius: '50%' }}><ProfilePic size={32} /></div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'black', display: 'flex', alignItems: 'center', gap: 4 }}>
         {brandName.toLowerCase().replace(/\s/g, '_')} 
         <div style={{ width: 12, height: 12, backgroundColor: '#0866FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={8} color="white" /></div>
        </div>
       </div>
       <MoreHorizontal size={20} color="black" />
      </div>
      
      <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: '#F3F4F6', position: 'relative' }}>
       <Img src={bannerUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      <div style={{ padding: '12px 16px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', gap: 16 }}>
         <Heart size={24} color="black" />
         <MessageCircle size={24} color="black" />
         <Send size={24} color="black" />
        </div>
        <Bookmark size={24} color="black" />
       </div>
       <div style={{ fontWeight: 700, fontSize: 13, color: 'black', marginBottom: 4 }}>10,432 likes</div>
       <div style={{ fontSize: 13, color: 'black', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
        <span style={{ fontWeight: 700, marginRight: 8 }}>{brandName.toLowerCase().replace(/\s/g, '_')}</span>
        {MOCK_INSTAGRAM_POST}
       </div>
      </div>
     </div>
    </div>
   );
  }

  if (platformName === 'TikTok') {
   return (
    <div style={{ backgroundColor: 'black', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', color: 'white' }}>
     <div style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 16, paddingBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', zIndex: 20 }}>
      <Globe size={20} color="white" />
      <div style={{ display: 'flex', gap: 16, fontWeight: 700, fontSize: 16 }}>
       <span style={{ opacity: 0.6 }}>Following</span>
       <span style={{ position: 'relative' }}>For You <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 32, height: 4, backgroundColor: 'white', borderRadius: 2 }} /></span>
      </div>
      <Search size={20} color="white" />
     </div>
     
     <div style={{ position: 'absolute', inset: 0, backgroundColor: '#121212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Img src={bannerUrl} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
      <Play size={64} color="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.2)" style={{ position: 'relative', zIndex: 10 }} />
     </div>

     <div style={{ position: 'absolute', right: 12, bottom: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 20 }}>
      <div style={{ position: 'relative', marginBottom: 8 }}>
       <div style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid white', overflow: 'hidden' }}><ProfilePic size={48} /></div>
       <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 20, height: 20, backgroundColor: '#FE2C55', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>+</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Heart size={32} color="white" fill="white" /></div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><MessageCircle size={32} color="white" fill="white" /></div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Bookmark size={32} color="#FACD00" fill="#FACD00" /></div>
     </div>

     <div style={{ position: 'absolute', bottom: 20, left: 12, right: 70, zIndex: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>@{brandName.toLowerCase().replace(/\s/g, '')}</div>
      <div style={{ fontSize: 13, lineHeight: 1.4, fontWeight: 500, whiteSpace: 'pre-wrap', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{MOCK_TIKTOK_POST}</div>
     </div>
    </div>
   );
  }

  if (platformName === 'Zalo') {
   return (
    <div style={{ backgroundColor: '#E2E8F0', height: '100%', display: 'flex', flexDirection: 'column' }}>
     <div style={{ backgroundColor: '#0068FF', color: 'white', padding: '16px 12px', display: 'flex', alignItems: 'center', gap: 12, zIndex: 10 }}>
      <ArrowLeft size={24} color="white" />
      <div style={{ position: 'relative' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'white', color: '#0068FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>{brandName.substring(0,2)}</div>
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, backgroundColor: '#22c55e', borderRadius: '50%', border: '2px solid #0068FF' }} />
      </div>
      <div>
       <div style={{ fontWeight: 700, fontSize: 16 }}>{brandName}</div>
       <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>Vừa mới truy cập</div>
      </div>
     </div>
     
     <div style={{ flex: 1, padding: 12, display: 'flex', flexDirection: 'column', gap: 12, backgroundColor: '#E2E8F0' }}>
      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#94A3B8', padding: '4px 12px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 20, alignSelf: 'center', marginTop: 8 }}>10:45 Hôm nay</div>
      <div style={{ backgroundColor: 'white', borderRadius: 18, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', maxWidth: '88%', alignSelf: 'flex-start' }}>
       <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#F1F5F9', position: 'relative', overflow: 'hidden' }}>
        <Img src={bannerUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>Zalo Broadcast</div>
       </div>
       <div style={{ padding: 14, fontSize: 14, color: 'black', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
        {MOCK_ZALO_POST}
       </div>
       <div style={{ padding: 12, borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
         <span style={{ color: '#0068FF', fontSize: 15, fontWeight: 700 }}>Xem chi tiết</span>
       </div>
      </div>
     </div>
    </div>
   );
  }
  
  return null;
 };

 const promptFullText = "Tạo bài viết thu hút dân văn phòng khu vực Hà Đông ăn trưa nhóm...";
 // Type fast (2 chars per frame)
 const typedLen = Math.min(promptFullText.length, Math.max(0, Math.floor((frame - 10) * 2)));
 const displayedPrompt = promptFullText.substring(0, typedLen);
 const isTyping = frame < 45;
 const isGenerating = frame >= 45 && frame < 60;

 return (
  <div style={{
   width: '100%',
   height: '100%',
   fontFamily,
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   padding: 60,
   backgroundColor: 'transparent'
  }}>
   
   {/* Main Container replacing the entire space */}
   <div style={{
    willChange: 'transform, opacity',
    transform: `translateZ(0) scale(${scale}) translateX(${containerShiftX}px)`,
    opacity,
    width: '100%',
    maxWidth: 1100, // Increased slightly to accommodate wider phone
    height: '85%', // Reduce height slightly to make aspect ratio better
    display: 'flex',
    gap: 32,
    alignItems: 'center',
    justifyContent: 'center',
   }}>
    
    {/* Left Side: Configuration Panel */}
    <div data-fx="content-editor" style={{
     width: 380,
     backgroundColor: 'white',
     borderRadius: 32,
     padding: 24,
     boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)',
     display: 'flex',
     flexDirection: 'column',
     height: '100%'
    }}>
     <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', marginBottom: 20 }}>
      <PenSquare size={18} color="#3B82F6" style={{ marginRight: 8 }} /> Cấu hình Nội dung
     </h2>
     
     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 20 }}>
       {[
        { n: 'FB', i: Users, c: '#2563EB', a: platform === 'Facebook' },
        { n: 'IN', i: Briefcase, c: '#0284C7', a: platform === 'LinkedIn' },
        { n: 'TK', i: Music, c: '#0F172A', a: platform === 'TikTok' },
        { n: 'IG', i: Heart, c: '#DB2777', a: platform === 'Instagram' },
        { n: 'ZL', i: MessageCircle, c: '#3B82F6', a: platform === 'Zalo' }
       ].map((p, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', borderRadius: 12, backgroundColor: p.a ? `${p.c}1A` : 'transparent', border: p.a ? `1px solid ${p.c}33` : '1px solid transparent' }}>
         <p.i size={20} color={p.a ? p.c : '#94A3B8'} style={{ marginBottom: 4 }} />
         <span style={{ fontSize: 10, fontWeight: 800, color: p.a ? p.c : '#94A3B8' }}>{p.n}</span>
        </div>
       ))}
     </div>

     <div style={{ backgroundColor: '#F8FAFC', borderRadius: 16, padding: 12, border: '1px solid #E2E8F0', marginBottom: 20 }}>
      <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: '#64748B', display: 'flex', alignItems: 'center', marginBottom: 8 }}>
       <Sparkles size={12} style={{ marginRight: 4 }} /> Trending & DNA
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
       <span style={{ fontSize: 10, fontWeight: 800, backgroundColor: 'rgba(6,182,212,0.1)', color: '#0891B2', padding: '4px 10px', borderRadius: 8 }}>Thực đơn chữa lành</span>
       <span style={{ fontSize: 10, fontWeight: 800, backgroundColor: 'rgba(245,158,11,0.1)', color: '#D97706', padding: '4px 10px', borderRadius: 8 }}>#Giảm stress văn phòng</span>
      </div>
     </div>

     <div style={{ flex: 1, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: 16, position: 'relative', marginBottom: 20 }}>
      <div style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>
        {displayedPrompt}
        {isTyping && <span style={{ display: 'inline-block', width: 2, height: 16, backgroundColor: '#334155', verticalAlign: 'middle', marginLeft: 2 }} />}
      </div>
      {!isTyping && (
       <div style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 10, fontWeight: 800, color: '#3B82F6', display: 'flex', alignItems: 'center', gap: 4, backgroundColor: '#DBEAFE', padding: '4px 8px', borderRadius: 4 }}>
        <span style={{ width: 6, height: 6, backgroundColor: '#3B82F6', borderRadius: '50%', animation: 'pulse 1s infinite' }} /> {isGenerating ? "AI Working..." : "Completed"}
       </div>
      )}
     </div>

     <button style={{ 
      width: '100%', padding: 16, borderRadius: 16, 
      backgroundColor: isGenerating ? '#94A3B8' : '#2563EB', 
      color: 'white', fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', 
      boxShadow: isGenerating ? 'none' : '0 4px 12px rgba(37,99,235,0.3)',
      transition: 'all 0.2s'
     }}>
      {isGenerating ? (
       <span style={{ display: 'flex', alignItems: 'center' }}>
        <Sparkles size={16} style={{ marginRight: 8, opacity: 0.5 }} /> Đang xử lý đa nền tảng...
       </span>
      ) : (
       <span style={{ display: 'flex', alignItems: 'center' }}>
        <Sparkles size={16} style={{ marginRight: 8 }} /> Sinh Nội Dung (AI)
       </span>
      )}
     </button>
    </div>

    {/* Right Side: Phone Mô phỏng */}
    <div data-fx="mobile-preview" style={{ height: '100%', width: 440, position: 'relative', perspective: 1000, flexShrink: 0, opacity: phoneOpacity, transform: `scale(${phoneScale})`, willChange: 'transform, opacity' }}>
      <div style={{
       width: '100%', height: '100%', 
       backgroundColor: '#1E293B', 
       borderRadius: 48, 
       padding: 8, 
       boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.2)',
       display: 'flex', flexDirection: 'column'
      }}>
       <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 40, overflow: 'hidden', position: 'relative', border: '4px solid black' }}>
        {/* iPhone Notch/Dynamic Island */}
        <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 100, height: 28, backgroundColor: 'black', borderRadius: 20, zIndex: 100 }} />
        
        <div style={{
          width: '100%', height: '100%',
          willChange: 'transform, opacity',
          transform: `translateZ(0) translateX(${contentX}px) rotateY(${contentRotateY}deg)`,
          opacity: contentOpacity,
        }}>
          {renderNativeUI(platform)}
        </div>
       </div>
      </div>
      
      {/* Platform Badge */}
      <div style={{ position: 'absolute', bottom: -20, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'white', padding: '8px 24px', borderRadius: 30, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontWeight: 900, color: '#2563EB', textTransform: 'uppercase', fontSize: 14, letterSpacing: 1 }}>
       {platform}
      </div>
    </div>

   </div>
  </div>
 );
};
