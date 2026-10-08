import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { Bot, Server, Database, Cpu, Activity, Terminal, CheckCircle } from 'lucide-react';
import { WebBackground } from './WebBackground';

const { fontFamily } = loadFont();

export const AgentDeployUI: React.FC = () => {
 const frame = useCurrentFrame();
 const { fps } = useVideoConfig();

 // Animations
 const containerSpring = spring({ frame, fps, config: springConf.snappy });
 const scale = interpolate(containerSpring, [0, 1], [0.95, 1]);
 const opacity = interpolate(containerSpring, [0, 1], [0, 1]);

 const step = Math.min(6, Math.floor(frame / 20)); // Every 20 frames, advance a step
 const isLoaded = step >= 6;

 // Staggered springs for datasets and metrics
 const ds1Spring = spring({ frame: Math.max(0, frame - 20), fps, config: springConf.wobbly });
 const ds2Spring = spring({ frame: Math.max(0, frame - 40), fps, config: springConf.wobbly });
 const ds3Spring = spring({ frame: Math.max(0, frame - 60), fps, config: springConf.wobbly });
 const dsSprings = [ds1Spring, ds2Spring, ds3Spring];

 const m1Spring = spring({ frame: Math.max(0, frame - 30), fps, config: springConf.wobbly });
 const m2Spring = spring({ frame: Math.max(0, frame - 50), fps, config: springConf.wobbly });
 const m3Spring = spring({ frame: Math.max(0, frame - 70), fps, config: springConf.wobbly });
 const mSprings = [m1Spring, m2Spring, m3Spring];

 // Laser scanner effect for the bot avatar
 const laserY = (frame * 4) % 80;

 // Typing effect for the simulated response
 const responseText = "Dạ, Mộc chào anh/chị ạ! 🌿 Rất cảm ơn anh/chị đã quan tâm đến giải pháp Tiệc doanh nghiệp của Bếp Nhà Mộc.\n\nVới quy mô 150 nhân sự tại Quận 1, Mộc hoàn toàn tự tin có thể phục vụ chu đáo mỗi ngày. 100% suất ăn của nhà Mộc đều sử dụng hộp bã mía phân hủy sinh học, đi kèm bộ muỗng nĩa gỗ để đảm bảo tiêu chí Xanh & Bền vững như Brand DNA của chúng mình.";
 
 const typeStartFrame = 100;
 const typeLen = Math.floor(Math.max(0, (frame - typeStartFrame) * 2));
 const textDisplay = responseText.substring(0, typeLen);

 const metrics = [
  { label: "Vector Database", value: "2.4 GB", icon: Database, color: "#60A5FA", bg: "rgba(96,165,250,0.1)" },
  { label: "Neural Params", value: "8.5B", icon: Cpu, color: "#C084FC", bg: "rgba(192,132,252,0.1)" },
  { label: "Latency", value: "45ms", icon: Activity, color: "#34D399", bg: "rgba(52,211,153,0.1)" }
 ];

 return (
  <div style={{
   width: '100%',
   height: '100%',
   display: 'flex',
   flexDirection: 'column',
   padding: '40px 60px',
   fontFamily,
   backgroundColor: '#0F172A',
  }}>
   <WebBackground />

   {/* Header */}
   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, zIndex: 10 }}>
    <div>
     <div style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', borderRadius: 8, backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: 12 }}>
      <Server size={16} color="#34D399" style={{ marginRight: 8 }} />
      <span style={{ fontSize: 12, fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: 1 }}>Deployment Center</span>
     </div>
     <h2 style={{ fontSize: 40, fontWeight: 900, color: 'white', margin: 0 }}>Personal Trợ lý AI Deployment</h2>
     <p style={{ color: '#94A3B8', fontSize: 16, margin: '8px 0 0 0' }}>Tiến trình huấn luyện và đóng gói AI độc quyền dựa trên dữ liệu Bếp Nhà Mộc.</p>
    </div>
   </div>

   {/* Main Split View */}
   <div style={{
    transform: `scale(${scale})`,
    opacity,
    flex: 1,
    display: 'flex',
    gap: 30,
    zIndex: 10
   }}>
    
    {/* Left Panel: Trợ lý AI Core */}
    <div data-fx="agent-core" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
     <div style={{ backgroundColor: 'rgba(30,41,59,0.9)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', padding: 32, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: '50%' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative', zIndex: 10 }}>
       <div style={{ width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, #34D399, #0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(16,185,129,0.3)', position: 'relative', overflow: 'hidden' }}>
        <Bot size={40} color="white" style={{ position: 'relative', zIndex: 10 }} />
        {!isLoaded && (
          <>
           <div style={{ position: 'absolute', inset: -2, border: '2px solid rgba(255,255,255,0.5)', borderRadius: 26, borderTopColor: 'transparent', animation: 'spin 2s linear infinite' }} />
           {/* Scanning laser */}
           <div style={{ position: 'absolute', left: 0, right: 0, height: 2, top: laserY, backgroundColor: 'rgba(255,255,255,0.8)', boxShadow: '0 0 10px white' }} />
          </>
        )}
       </div>
       <div>
        <h3 style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: '0 0 8px 0' }}>Mộc Assistant</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
         <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, backgroundColor: isLoaded ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: isLoaded ? '#34D399' : '#FBBF24', border: `1px solid ${isLoaded ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`, display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: isLoaded ? '#34D399' : '#FBBF24', marginRight: 6, animation: isLoaded ? 'none' : 'blink 1s infinite' }} />
          {isLoaded ? 'Online & Ready' : 'Training Pipeline Active'}
         </span>
        </div>
       </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 32, position: 'relative', zIndex: 10 }}>
       {metrics.map((m, i) => {
        const s = mSprings[i];
        const sValue = interpolate(s, [0, 1], [0, 1]);
        return (
         <div key={i} style={{ 
          backgroundColor: 'rgba(15,23,42,0.5)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
          transform: `scale(${interpolate(sValue, [0, 1], [0.8, 1])}) translateY(${interpolate(sValue, [0, 1], [20, 0])}px)`,
          opacity: sValue
         }}>
          <div style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
           <m.icon size={16} color={m.color} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>{m.value}</div>
          <div style={{ fontSize: 10, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{m.label}</div>
         </div>
        );
       })}
      </div>
     </div>

     <div style={{ flex: 1, backgroundColor: 'rgba(30,41,59,0.9)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', padding: 32 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
       {[
        { n: 'menu_bepnhamoc_2026.pdf', t: 'Catalog', s: 'Vectorized' },
        { n: 'brand_voice_guidelines.md', t: 'Ruleset', s: 'Enforced' },
        { n: 'zalo_oa_chat_history.csv', t: 'Training Data', s: 'Ingested' }
       ].map((ds, i) => {
        const s = dsSprings[i];
        const sValue = interpolate(s, [0, 1], [0, 1]);
        

        return (
         <div key={i} style={{ 
          padding: 16, borderRadius: 16, backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transform: `scale(${interpolate(sValue, [0, 1], [0.9, 1])}) translateX(${interpolate(sValue, [0, 1], [-20, 0])}px)`,
          opacity: sValue
         }}>
           <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#6EE7B7' }}>{ds.n}</div>
            <div style={{ fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{ds.t}</div>
           </div>
           <CheckCircle size={16} color="#34D399" />
         </div>
        )
       })}
      </div>
     </div>
    </div>

    {/* Right Panel: Simulation Console */}
    <div data-fx="simulation" style={{ flex: 1.5, backgroundColor: '#0F172A', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
     <div style={{ backgroundColor: '#1E293B', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
       <div style={{ display: 'flex', gap: 6 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#EF4444' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981' }} />
       </div>
       <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.1)' }} />
       <Terminal size={16} color="#94A3B8" />
       <span style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Live Integration Testing</span>
      </div>
     </div>

     <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
      {step >= 4 && (
       <div style={{ alignSelf: 'flex-end', maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, opacity: interpolate(frame, [80, 90], [0, 1], { extrapolateRight: 'clamp' }), transform: `translateY(${interpolate(frame, [80, 90], [20, 0], { extrapolateRight: 'clamp' })}px)` }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1 }}>Khách hàng (B2B Lead)</span>
        <div style={{ backgroundColor: '#1E293B', padding: 20, borderRadius: '24px 24px 4px 24px', fontSize: 16, color: '#F8FAFC', lineHeight: 1.6, border: '1px solid rgba(255,255,255,0.05)' }}>
         Chào Mộc, bên mình là công ty công nghệ quy mô 150 nhân sự ở Quận 1. Mình đang tìm đối tác cung cấp suất ăn trưa văn phòng dài hạn. Bên bạn có đáp ứng được số lượng lớn mà vẫn đảm bảo dùng hộp bã mía không?
        </div>
       </div>
      )}

      {step >= 5 && frame >= typeStartFrame && (
       <div style={{ alignSelf: 'flex-start', maxWidth: '80%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
         <div style={{ width: 24, height: 24, borderRadius: 8, background: 'linear-gradient(135deg, #34D399, #0D9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={14} color="white" />
         </div>
         <span style={{ fontSize: 10, fontWeight: 800, color: '#34D399', textTransform: 'uppercase', letterSpacing: 1 }}>Mộc Assistant</span>
        </div>
        <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: 20, borderRadius: '24px 24px 24px 4px', fontSize: 16, color: '#F8FAFC', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
         {textDisplay}
         <span style={{ display: typeLen < responseText.length ? 'inline-block' : 'none', width: 4, height: 18, backgroundColor: '#34D399', verticalAlign: 'middle', marginLeft: 4 }} />
        </div>
       </div>
      )}
     </div>
    </div>
   </div>
   
   <style>
    {`
     @keyframes spin {
      to { transform: rotate(360deg); }
     }
     @keyframes blink {
      50% { opacity: 0; }
     }
    `}
   </style>
  </div>
 );
};
