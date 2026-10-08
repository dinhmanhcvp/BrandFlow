import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/Inter';
import { Palette, ImageIcon, Layers, Sparkles, Network, Briefcase, Type, CheckCircle2, Info } from 'lucide-react';

const { fontFamily } = loadFont();

const masterDNA = {
 brand_name: "Bếp Nhà Mộc",
 goal: "Bếp Nhà Mộc cung cấp các suất ăn văn phòng dựa trên triết lý Mindful Dining. Chúng tôi sử dụng thực phẩm sạch, hộp bã mía sinh học và hướng tới sự cân bằng thân-tâm-trí cho giới văn phòng.",
 industry: "Tiệc doanh nghiệp / F&B",
 tone_of_voice: "The Caregiver"
};

const result = {
 logo_url: staticFile('assets/bep-nha-moc/logo.jpg'),
 banner_url: staticFile('assets/bep-nha-moc/banner.jpg'),
 avatar_url: staticFile('assets/bep-nha-moc/avatar.jpg'),
 guidelines: `BẾP NHÀ MỘC - BRAND GUIDELINES
1. Định vị: "Trạm sạc năng lượng cho dân văn phòng"
2. Tone of voice: Điềm tĩnh, thấu cảm, chữa lành
3. Pattern: Các đường cong mềm mại mô phỏng làn khói
4. Moodboard: Ấm áp, Mộc mạc, Thiên nhiên`
};

export const DesignStudioUI: React.FC = () => {
 const frame = useCurrentFrame();
 const { fps } = useVideoConfig();

 // Animations
 const containerSpring = spring({ frame, fps, config: springConf.snappy });
 const scale = interpolate(containerSpring, [0, 1], [0.95, 1]);
 const opacity = interpolate(containerSpring, [0, 1], [0, 1]);

 // Phases in 180 frames (6 seconds)
 // 0-30: Entry
 // 30-90: Show Summary + Logo
 // 90-180: Scroll to Fanpage
 const phase1Spring = spring({ frame: frame - 15, fps, config: springConf.bouncy });
 const phase2Spring = spring({ frame: frame - 40, fps, config: springConf.bouncy });
 const scrollSpring = spring({ frame: frame - 100, fps, config: springConf.soft });
 
 const scrollY = interpolate(scrollSpring, [0, 1], [0, -850]);

 return (
  <div style={{
   width: '100%',
   height: '100%',
   display: 'flex',
   flexDirection: 'column',
   padding: '40px 60px',
   fontFamily,
   backgroundColor: '#0F172A',
   color: 'white',
   overflow: 'hidden',
   transform: `scale(${scale})`,
   opacity
  }}>
   
   {/* HEADER */}
   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30, flexShrink: 0, zIndex: 30 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
     <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(6,182,212,0.2)' }}>
      <Palette size={24} color="#06B6D4" />
     </div>
     <div>
      <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: -1 }}>Design Studio</h1>
      <p style={{ color: '#94A3B8', fontSize: 13, margin: 0 }}>AI-powered Visual Identity · Case Study · Brand Deck</p>
     </div>
    </div>
    
    {/* TABS */}
    <div style={{ display: 'flex', background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 12, padding: 4, gap: 4 }}>
      <div style={{ padding: '8px 16px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: frame < 150 ? '#06B6D4' : 'transparent', color: frame < 150 ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', gap: 8, boxShadow: frame < 150 ? '0 4px 12px rgba(6,182,212,0.2)' : 'none' }}>
       <ImageIcon size={16} /> Visuals
      </div>
      <div style={{ padding: '8px 16px', fontSize: 13, fontWeight: 700, borderRadius: 8, background: frame >= 150 ? '#06B6D4' : 'transparent', color: frame >= 150 ? 'white' : '#94A3B8', display: 'flex', alignItems: 'center', gap: 8, boxShadow: frame >= 150 ? '0 4px 12px rgba(6,182,212,0.2)' : 'none' }}>
       <Layers size={16} /> Case Study
      </div>
      <div style={{ padding: '8px 16px', fontSize: 13, fontWeight: 700, borderRadius: 8, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 8 }}>
       <Sparkles size={16} /> Brand Deck
      </div>
    </div>
   </div>

   <div style={{ display: 'flex', gap: 24, flex: 1, minHeight: 0 }}>
    
    {/* LEFT COLUMN: Control Panel */}
    <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: 16, opacity: 0.8 }}>
     <div style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 20, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #334155' }}>
       <Network size={16} color="#818CF8" style={{ marginRight: 8 }} />
       <h2 style={{ fontSize: 12, fontWeight: 800, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>DNA Sync</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
       <div>
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Brand Name</div>
        <div style={{ fontSize: 14, fontWeight: 600, background: '#0F172A', padding: '10px 12px', borderRadius: 8 }}>Bếp Nhà Mộc</div>
       </div>
       <div>
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Target Audience</div>
        <div style={{ fontSize: 14, fontWeight: 600, background: '#0F172A', padding: '10px 12px', borderRadius: 8 }}>Dân văn phòng (Gen Z)</div>
       </div>
       <div>
        <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Brand Personality</div>
        <div style={{ fontSize: 14, fontWeight: 600, background: '#0F172A', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(16,185,129,0.3)', color: '#34D399' }}>The Caregiver</div>
       </div>
      </div>
     </div>
    </div>

    {/* CENTER COLUMN: CANVAS */}
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 20, border: '1px solid rgba(51,65,85,0.5)', background: '#1E293B', display: 'flex', flexDirection: 'column' }}>
      
     {/* VISUALS TAB CONTENT */}
     <div style={{ display: frame < 150 ? 'flex' : 'none', flexDirection: 'column', padding: 24, gap: 24, transform: `translateY(${scrollY}px)` }}>
      
      {/* Executive Identity Summary */}
      <div style={{ 
        background: 'linear-gradient(to bottom right, #0F172A, #1E293B)', borderRadius: 24, padding: 32, 
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)', flexShrink: 0,
        opacity: phase1Spring, transform: `translateY(${interpolate(phase1Spring, [0, 1], [40, 0])}px)`
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#67E8F9', marginBottom: 20 }}>
         <Sparkles size={14} /> Brand Identity Protocol
        </div>
        <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 16px 0', letterSpacing: -1 }}>{masterDNA.brand_name}</h2>
        <p style={{ fontSize: 15, color: '#CBD5E1', lineHeight: 1.6, marginBottom: 24 }}>
         Thiết kế nhận diện được xây dựng trên triết lý <strong>Mindful Dining</strong>. Chúng tôi kết hợp các sắc độ của thiên nhiên (Earth Tones) để mang lại cảm giác bình yên, xoa dịu áp lực (Burn-out) cho giới văn phòng.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
         <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20 }}>
           <h3 style={{ color: '#22D3EE', fontWeight: 700, margin: '0 0 8px 0', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Type size={14} /> Naming & Tone</h3>
           <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>Điềm tĩnh, thấu cảm, chuyên nghiệp.</p>
         </div>
         <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20 }}>
           <h3 style={{ color: '#34D399', fontWeight: 700, margin: '0 0 8px 0', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}><ImageIcon size={14} /> Cover Art</h3>
           <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>Ánh sáng hoàng hôn ấm áp.</p>
         </div>
         <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20 }}>
           <h3 style={{ color: '#FBBF24', fontWeight: 700, margin: '0 0 8px 0', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}><Briefcase size={14} /> Visual Anchor</h3>
           <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>Chữ thư pháp & icon Lá mầm xanh.</p>
         </div>
        </div>
      </div>

      {/* Logo Display & Color System */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flexShrink: 0,
        opacity: phase2Spring, transform: `scale(${interpolate(phase2Spring, [0, 1], [0.95, 1])})`
      }}>
       <div style={{ borderRadius: 24, border: '1px solid #334155', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
         <div style={{ padding: 12, borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0F172A' }}>
          <div style={{ fontWeight: 700, fontSize: 12, color: 'white' }}>Master Brand Logo</div>
          <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(16,185,129,0.1)', color: '#10B981', padding: '4px 8px', borderRadius: 6 }}>Vector Approved</span>
         </div>
         <div style={{ flex: 1, background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, minHeight: 250 }}>
          <Img src={result.logo_url} style={{ width: '80%', height: '80%', objectFit: 'cover', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
         </div>
       </div>
       
       <div style={{ borderRadius: 24, border: '1px solid #334155', padding: 24, background: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
         <h3 style={{ fontWeight: 800, color: 'white', margin: '0 0 20px 0', fontSize: 16 }}>Color System</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
           { hex: "#064E3B", name: "Deep Forest", usage: "Primary Brand Color" },
           { hex: "#B45309", name: "Amber Wood", usage: "CTA & Accents" },
           { hex: "#FEF3C7", name: "Warm Cream", usage: "Backgrounds", dark: true }
          ].map(c => (
           <div key={c.hex} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: c.hex, border: '1px solid rgba(255,255,255,0.1)' }}></div>
             <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'white', marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace' }}>{c.hex} • {c.usage}</div>
             </div>
           </div>
          ))}
         </div>
       </div>
      </div>

      {/* High-Fidelity Mô phỏng Fanpage */}
      <div data-fx="fanpage" style={{ borderRadius: 24, overflow: 'hidden', background: '#242526', border: '1px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', flexShrink: 0 }}>
        <div style={{ padding: 12, borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', background: '#242526' }}>
         <div style={{ color: '#0866FF', fontSize: 20, fontWeight: 900, marginRight: 12, letterSpacing: -1 }}>facebook</div>
         <span style={{ color: '#94A3B8', fontWeight: 600, fontSize: 11 }}>Giao diện Nhận diện Kênh Social</span>
        </div>
        
        <div style={{ position: 'relative' }}>
         <div style={{ width: '100%', height: 240, position: 'relative', overflow: 'hidden' }}>
          <Img src={result.banner_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         </div>
         
         <div style={{ padding: '0 24px 20px 24px', marginTop: -40, position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
           <div style={{ display: 'flex', width: '100%', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
             <div style={{ width: 120, height: 120, borderRadius: '50%', border: '4px solid #242526', overflow: 'hidden', background: 'white', flexShrink: 0 }}>
               <Img src={result.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             <div style={{ marginLeft: 20, paddingBottom: 10 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: 0 }}>{masterDNA.brand_name}</h2>
                <div style={{ width: 24, height: 24, background: '#0866FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <CheckCircle2 size={16} color="white" />
                </div>
               </div>
               <div style={{ fontSize: 14, fontWeight: 600, color: '#B0B3B8' }}>124K người theo dõi • 23 đang theo dõi</div>
             </div>
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 8, paddingBottom: 10 }}>
             <div style={{ background: '#0866FF', color: 'white', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
               <span style={{ fontSize: 16 }}>+</span> Theo dõi
             </div>
             <div style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 600 }}>
               Nhắn tin
             </div>
             <div style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: 6, fontSize: 14, fontWeight: 600 }}>
               ...
             </div>
            </div>
           </div>
           
           {/* Tabs */}
           <div style={{ display: 'flex', gap: 24, marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
             <div style={{ color: '#0866FF', fontSize: 14, fontWeight: 700, borderBottom: '3px solid #0866FF', paddingBottom: 8 }}>Bài viết</div>
             <div style={{ color: '#B0B3B8', fontSize: 14, fontWeight: 600 }}>Giới thiệu</div>
             <div style={{ color: '#B0B3B8', fontSize: 14, fontWeight: 600 }}>Người theo dõi</div>
             <div style={{ color: '#B0B3B8', fontSize: 14, fontWeight: 600 }}>Ảnh</div>
             <div style={{ color: '#B0B3B8', fontSize: 14, fontWeight: 600 }}>Video</div>
           </div>
         </div>
        </div>

        <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
         <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
           <h3 style={{ fontWeight: 800, fontSize: 15, color: 'white', margin: '0 0 12px 0' }}>Giới thiệu</h3>
           <p style={{ fontSize: 13, color: '#B0B3B8', lineHeight: 1.6, margin: '0 0 16px 0' }}>{masterDNA.goal}</p>
           <div style={{ fontSize: 13, color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={16} color="#94A3B8" /> Tiệc doanh nghiệp / F&B
           </div>
         </div>
         <div style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
           <h3 style={{ fontWeight: 800, fontSize: 15, color: 'white', margin: '0 0 12px 0' }}>Brand Guidelines</h3>
           <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'sans-serif', fontSize: 12, color: '#94A3B8', lineHeight: 1.6, background: '#1E293B', padding: 16, borderRadius: 12, margin: 0 }}>
            {result.guidelines}
           </pre>
         </div>
        </div>
      </div>

     </div>

     {/* CASE STUDY TAB CONTENT */}
     {frame >= 150 && (
      <div style={{ 
       position: 'absolute', inset: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column',
       background: '#0F172A',
       opacity: interpolate(frame, [150, 160], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
      }}>
       <div style={{ 
        display: 'flex', flexDirection: 'column', width: '100%', position: 'relative',
        transform: `translateY(${interpolate(frame, [160, 200], [0, -600], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`
       }}>
         {/* Hero Block Behance */}
         <div style={{ width: '100%', height: 350, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: 40, overflow: 'hidden', backgroundColor: '#064E3B' }}>
          <Img src={result.banner_url} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, mixBlendMode: 'overlay' }} />
          <h1 style={{ fontSize: 48, fontWeight: 900, color: 'white', textAlign: 'center', zIndex: 10, letterSpacing: -1, textTransform: 'uppercase', margin: 0, textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>{masterDNA.brand_name}</h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', marginTop: 16, textAlign: 'center', zIndex: 10, fontWeight: 300, letterSpacing: 1 }}>Brand Identity & Tiệc doanh nghiệp</p>
         </div>

         {/* Mission Block */}
         <div style={{ padding: '64px 40px', backgroundColor: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ maxWidth: 672, width: '100%', textAlign: 'center' }}>
           <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 24, letterSpacing: -1, color: '#34D399' }}>The Mission</h2>
           <p style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 1.8, borderLeft: '4px solid #34D399', paddingLeft: 16, textAlign: 'left', margin: 0 }}>
            {masterDNA.goal}
           </p>
          </div>
         </div>

         {/* Palette Block */}
         <div style={{ padding: '64px 40px', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 32, letterSpacing: -1, textTransform: 'uppercase' }}>Color Palette</h2>
          <div style={{ display: 'flex', width: '100%', maxWidth: 672, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', borderRadius: 12, overflow: 'hidden', height: 160 }}>
            <div style={{ flex: 1, backgroundColor: '#064E3B', display: 'flex', alignItems: 'flex-end', padding: 12, color: 'white', fontSize: 12, fontFamily: 'monospace', fontWeight: 700 }}>#064E3B</div>
            <div style={{ flex: 1, backgroundColor: '#B45309', display: 'flex', alignItems: 'flex-end', padding: 12, color: 'white', fontSize: 12, fontFamily: 'monospace', fontWeight: 700 }}>#B45309</div>
            <div style={{ flex: 1, backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'flex-end', padding: 12, color: '#0F172A', fontSize: 12, fontFamily: 'monospace', fontWeight: 700 }}>#FEF3C7</div>
          </div>
         </div>

         {/* Typography Block */}
         <div style={{ padding: '64px 40px', backgroundColor: '#1E293B', display: 'flex', flexDirection: 'column', alignItems: 'center', height: 400 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 32, letterSpacing: -1, textTransform: 'uppercase' }}>Typography System</h2>
          <div style={{ width: '100%', maxWidth: 672, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
             <div style={{ fontSize: 60, fontFamily: 'serif', fontWeight: 700, color: 'white', marginBottom: 8 }}>Aa</div>
             <div style={{ fontSize: 14, fontWeight: 700, color: '#94A3B8' }}>Playfair Display (Headings)</div>
            </div>
            <div>
             <div style={{ fontSize: 48, fontFamily: 'sans-serif', fontWeight: 500, color: 'white', marginBottom: 8 }}>Aa</div>
             <div style={{ fontSize: 14, fontWeight: 700, color: '#94A3B8' }}>Roboto (Body Text)</div>
            </div>
          </div>
         </div>
       </div>
      </div>
     )}

    </div>

   </div>
  </div>
 );
};
