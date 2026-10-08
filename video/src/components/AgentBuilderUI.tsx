import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { Bot, Code, TrendingUp, Search, MessageSquare, Terminal, Check } from 'lucide-react';
import { WebBackground } from './WebBackground';

const { fontFamily } = loadFont();

export const AgentBuilderUI: React.FC = () => {
 const frame = useCurrentFrame();
 const { fps } = useVideoConfig();

 // Animations
 const containerSpring = spring({ frame, fps, config: springConf.snappy });
 const scale = interpolate(containerSpring, [0, 1], [0.95, 1]);
 const opacity = interpolate(containerSpring, [0, 1], [0, 1]);

 const showTools = frame > 20;
 const showChat = frame > 60;

 const chatText = "Phân tích tài chính cho thấy Bếp Nhà Mộc có Unit Economics chưa tối ưu (LTV/CAC = 1.2). Tôi đã viết script Python để tính toán lại điểm hòa vốn. Chi tiết trong bảng dưới đây.";
 const typeLen = Math.floor(Math.max(0, (frame - 60) * 1.5));
 const chatDisplay = chatText.substring(0, typeLen);
 const showCode = typeLen >= chatText.length;
 
 // Staggered springs for tools
 const tool1Spring = spring({ frame: Math.max(0, frame - 25), fps, config: springConf.wobbly });
 const tool2Spring = spring({ frame: Math.max(0, frame - 35), fps, config: springConf.wobbly });
 
 // Pulse animation
 const pulse = Math.sin((frame / fps) * Math.PI * 2) * 0.5 + 0.5;

 return (
  <div style={{
   width: '100%',
   height: '100%',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   padding: 60,
   fontFamily,
   backgroundColor: '#0F172A',
  }}>
   <WebBackground />
   
   {/* Main Container */}
   <div style={{
    transform: `scale(${scale})`,
    opacity,
    width: '100%',
    maxWidth: 1200,
    height: '100%',
    backgroundColor: 'rgba(15, 23, 42, 1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    borderRadius: 32,
    display: 'flex',
    overflow: 'hidden'
   }}>
    {/* Left Side: Trợ lý AI Config */}
    <div data-fx="agent-identity" style={{ flex: 1, borderRight: '1px solid rgba(255,255,255,0.1)', padding: 40, display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 30, display: 'flex', alignItems: 'center', gap: 12 }}>
       <Bot size={28} color="#10B981" /> Custom Trợ lý AI Builder
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
       <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Trợ lý AI Name & Vai trò</label>
        <div style={{ backgroundColor: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
         <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <TrendingUp size={24} color="#10B981" />
         </div>
         <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>CFO Advisor</div>
          <div style={{ fontSize: 12, color: '#10B981' }}>Enterprise Financial Intelligence</div>
         </div>
        </div>
       </div>

       <div>
        <label style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8, display: 'block' }}>Chỉ thị Hệ thống</label>
        <div style={{ backgroundColor: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '16px 20px', fontSize: 13, color: '#CBD5E1', lineHeight: 1.6 }}>
         Bạn là CFO Advisor. LUÔN viết code Python để tính toán — KHÔNG BAO GIỜ tự nhẩm tính. Hỗ trợ: DCF valuation, P&L projection, unit economics...
        </div>
       </div>

       <div style={{ opacity: showTools ? 1 : 0, transition: 'all 0.5s ease', marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
         <label style={{ fontSize: 14, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
          Tích hợp Capability
          <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'none' }}>(Modules chức năng)</span>
         </label>
         <div style={{ fontSize: 10, fontWeight: 800, color: '#06B6D4', backgroundColor: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', padding: '4px 10px', borderRadius: 99 }}>
          2 / 5 module
         </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
         <div style={{ 
          display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, border: '1px solid rgba(99,102,241,0.4)', backgroundColor: 'rgba(99,102,241,0.15)',
          transform: `scale(${interpolate(tool1Spring, [0, 1], [0.8, 1])}) translateX(${interpolate(tool1Spring, [0, 1], [-20, 0])}px)`,
          opacity: interpolate(tool1Spring, [0, 1], [0, 1])
         }}>
          <Code size={18} color="#818CF8" />
          <div style={{ flex: 1 }}>
           <div style={{ fontSize: 14, fontWeight: 700, color: '#818CF8' }}>Python Data Analyst</div>
           <div style={{ fontSize: 11, color: '#A5B4FC', marginTop: 2 }}>Zero Hallucination Engine</div>
          </div>
          <Check size={18} color="#818CF8" style={{ opacity: pulse }} />
         </div>
         
         <div style={{ 
          display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, border: '1px solid rgba(6,182,212,0.4)', backgroundColor: 'rgba(6,182,212,0.15)',
          transform: `scale(${interpolate(tool2Spring, [0, 1], [0.8, 1])}) translateX(${interpolate(tool2Spring, [0, 1], [-20, 0])}px)`,
          opacity: interpolate(tool2Spring, [0, 1], [0, 1])
         }}>
          <Search size={18} color="#22D3EE" />
          <div style={{ flex: 1 }}>
           <div style={{ fontSize: 14, fontWeight: 700, color: '#22D3EE' }}>Live Web Research</div>
           <div style={{ fontSize: 11, color: '#67E8F9', marginTop: 2 }}>Fact-Checked Intelligence</div>
          </div>
          <Check size={18} color="#22D3EE" style={{ opacity: pulse }} />
         </div>
         
         {/* Unselected Capability */}
         <div style={{ 
          display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(15,23,42,0.5)',
          opacity: interpolate(tool2Spring, [0, 1], [0, 0.5])
         }}>
          <MessageSquare size={18} color="#64748B" />
          <div style={{ flex: 1 }}>
           <div style={{ fontSize: 14, fontWeight: 700, color: '#94A3B8' }}>Brand Voice Enforcer</div>
           <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>Tone & Style Checker</div>
          </div>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
         </div>
        </div>
       </div>
      </div>
    </div>

    {/* Right Side: Playground */}
    <div data-fx="agent-preview" style={{ flex: 1.2, backgroundColor: '#0B1120', display: 'flex', flexDirection: 'column' }}>
     <div style={{ padding: '20px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: 8 }}><Terminal size={16} /> Playground Simulation</span>
      <span style={{ fontSize: 10, fontWeight: 800, color: '#10B981', padding: '4px 8px', borderRadius: 4, backgroundColor: 'rgba(16,185,129,0.1)', textTransform: 'uppercase' }}>Ready</span>
     </div>

     <div style={{ flex: 1, padding: 30, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* User Message */}
      <div style={{ alignSelf: 'flex-end', backgroundColor: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '16px 20px', borderRadius: '20px 20px 4px 20px', color: 'white', fontSize: 14, maxWidth: '80%' }}>
       Hãy tính điểm hòa vốn cho Bếp Nhà Mộc với dữ liệu chi phí cố định là 100tr/tháng.
      </div>

      {/* AI Response */}
      {showChat && (
       <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: 8, maxWidth: '90%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
         <div style={{ width: 24, height: 24, borderRadius: 6, backgroundColor: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={14} color="#10B981" />
         </div>
         <span style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>CFO Advisor</span>
        </div>
        
        <div style={{ backgroundColor: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px', borderRadius: '20px 20px 20px 4px', color: '#E2E8F0', fontSize: 14, lineHeight: 1.6, position: 'relative' }}>
         {chatDisplay}
         {!showCode && <span style={{ display: 'inline-block', width: 4, height: 14, backgroundColor: '#10B981', marginLeft: 4, animation: 'pulse 1s infinite' }} />}
         
         {showCode && (
          <div style={{ marginTop: 16, backgroundColor: '#0F172A', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, overflow: 'hidden' }}>
           <div style={{ backgroundColor: 'rgba(99,102,241,0.1)', padding: '8px 12px', fontSize: 10, color: '#818CF8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid rgba(99,102,241,0.3)' }}>
            <Code size={12} style={{ opacity: pulse }} /> Executing Python...
           </div>
           <div style={{ padding: 12, fontFamily: 'monospace', fontSize: 12, color: '#10B981' }}>
            def calculate_breakeven(fixed_costs, price, vc):<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;return fixed_costs / (price - vc)<br/><br/>
            <span style={{ color: '#64748B' }}># Output: 4,000 units</span>
           </div>
          </div>
         )}
        </div>
       </div>
      )}
     </div>
     
     <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ width: '100%', height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12 }}>
       <MessageSquare size={16} color="#64748B" />
       <span style={{ fontSize: 14, color: '#64748B' }}>Chat to test your agent...</span>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};
