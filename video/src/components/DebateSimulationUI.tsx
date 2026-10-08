import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { Scissors, TrendingDown, Activity, Cpu, AlertTriangle } from 'lucide-react';
import { WebBackground } from './WebBackground';

const { fontFamily } = loadFont();

export const DebateSimulationUI: React.FC = () => {
 const frame = useCurrentFrame();
 const { fps } = useVideoConfig();

 // Animations
 const containerSpring = spring({ frame, fps, config: springConf.snappy });
 const scale = interpolate(containerSpring, [0, 1], [0.95, 1]);
 const opacity = interpolate(containerSpring, [0, 1], [0, 1]);

 const agents = [
  { id: 'CFO', name: 'CFO Trợ lý AI', role: 'Financial Control', icon: TrendingDown, color: '#F87171', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', tag: 'WARNING', msg: "Ngân sách đang phân bổ quá nhiều vào Broad Targeting. Đề xuất cắt giảm 40% để tái đầu tư vào B2B Corporate.", startFrame: 30 },
  { id: 'CMO', name: 'CMO Trợ lý AI', role: 'Marketing Strategy', icon: Scissors, color: '#FBBF24', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', tag: 'CUT', msg: "Đồng ý. Đã tạm dừng chiến dịch Facebook Broad. Đang dồn lực vào kênh B2B LinkedIn.", startFrame: 150 },
  { id: 'COO', name: 'COO Trợ lý AI', role: 'Operations', icon: Activity, color: '#34D399', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)', tag: 'CAPACITY', msg: "Khoan đã. Nếu tăng khách B2B đột ngột, năng lực bếp hiện tại (150 suất/ngày) sẽ quá tải. Cần bổ sung thêm nhân sự bếp!", startFrame: 270 },
  { id: 'CEO', name: 'CEO Trợ lý AI', role: 'Executive', icon: AlertTriangle, color: '#A78BFA', bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)', tag: 'APPROVED', msg: "Approved! CFO giải ngân quỹ dự phòng. COO tiến hành tuyển dụng ngay trong tuần.", startFrame: 390 }
 ];

 const activeAgentIndex = agents.reduce((acc, agent, idx) => frame >= agent.startFrame - 30 ? idx : acc, -1);
 const activeAgent = activeAgentIndex >= 0 ? agents[activeAgentIndex] : agents[0];
 const archivedAgents = activeAgentIndex > 0 ? agents.slice(0, activeAgentIndex).reverse() : [];

 const isTyping = frame >= activeAgent.startFrame - 30 && frame < activeAgent.startFrame;
 const activeLen = Math.max(0, Math.floor((frame - activeAgent.startFrame) * 2));
 const activeMsgDisplay = activeAgent.msg.substring(0, activeLen);

 const leftAgentIndex = activeAgentIndex % 2 === 0 ? activeAgentIndex : Math.max(0, activeAgentIndex - 1);
 const rightAgentIndex = activeAgentIndex % 2 === 1 ? activeAgentIndex : (activeAgentIndex > 0 ? activeAgentIndex - 1 : -1);

 const renderAgentPanel = (aIndex: number, isRightSide: boolean) => {
  if (aIndex < 0) {
   // Empty placeholder for right side before 2nd agent starts
   return (
    <div style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <span style={{ color: '#64748B', fontFamily: 'monospace' }}>Awaiting Opposing Trợ lý AI...</span>
    </div>
   );
  }

  const agent = agents[aIndex];
  const isThisActive = aIndex === activeAgentIndex;
  const isTypingLocal = isThisActive ? isTyping : false;
  
  // If it's not active, show full message. If it is active, calculate substring.
  const displayLen = isThisActive ? activeLen : agent.msg.length;
  const msgDisplay = agent.msg.substring(0, displayLen);

  return (
   <div style={{
    flex: 1,
    backgroundColor: isThisActive ? 'rgba(15,23,42,0.9)' : 'rgba(15,23,42,0.4)',
    borderRadius: 24,
    border: `1px solid ${isThisActive ? agent.border.replace('0.2', '0.4') : 'rgba(255,255,255,0.1)'}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: isThisActive ? `0 25px 50px -12px ${agent.bg}, inset 0 0 20px ${agent.bg}` : 'none',
    transition: 'all 0.5s ease-out',
    opacity: frame >= agent.startFrame - 30 ? 1 : 0,
    transform: frame >= agent.startFrame - 30 ? 'scale(1)' : 'scale(0.95)'
   }}>
    {isThisActive && (
     <>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: agent.color, opacity: 0.05, transition: 'background-color 0.5s' }} />
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '75%', height: '75%', backgroundColor: agent.color, opacity: 0.1, borderRadius: '50%', transition: 'background-color 0.5s' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%', backgroundColor: agent.color, opacity: 0.05, borderRadius: '50%', transition: 'background-color 0.5s' }} />
     </>
    )}

    <div style={{ padding: '16px 24px', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <Cpu size={16} color={isThisActive ? "#06B6D4" : "#64748B"} />
      <span style={{ color: isThisActive ? '#94A3B8' : '#64748B', fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' }}>Live Analysis Node</span>
     </div>
     {isThisActive && (
      <div style={{ display: 'flex', gap: 6 }}>
       <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#EF4444' }} />
       <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
       <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse 1s infinite' }} />
      </div>
     )}
    </div>
    
    <div style={{ flex: 1, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}>
     <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: agent.bg, border: `1px solid ${agent.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
       <agent.icon size={32} color={agent.color} />
      </div>
      <div>
       <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: agent.color, margin: 0, textTransform: 'uppercase' }}>{agent.name}</h3>
        <span style={{ fontSize: 10, fontWeight: 800, color: agent.color, backgroundColor: agent.bg, border: `1px solid ${agent.border}`, padding: '2px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
         <agent.icon size={12} /> {agent.tag}
        </span>
       </div>
       <span style={{ fontSize: 14, color: '#64748B', fontFamily: 'monospace' }}>{agent.role} Module</span>
      </div>
     </div>
     
     {isTypingLocal ? (
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', height: 40, paddingLeft: 10 }}>
       <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: agent.color, animation: 'bounce 1s infinite 0s' }} />
       <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: agent.color, animation: 'bounce 1s infinite 0.2s' }} />
       <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: agent.color, animation: 'bounce 1s infinite 0.4s' }} />
      </div>
     ) : (
      <div style={{ fontSize: 28, color: isThisActive ? 'white' : '#94A3B8', lineHeight: 1.6, fontWeight: 600 }}>
       {msgDisplay}
       {isThisActive && displayLen < agent.msg.length && (
        <span style={{ display: 'inline-block', width: 4, height: 24, backgroundColor: agent.color, verticalAlign: 'middle', marginLeft: 6, animation: 'pulse 0.5s infinite' }} />
       )}
      </div>
     )}
    </div>
   </div>
  );
 };

 return (
  <div style={{
   width: '100%',
   height: '100%',
   display: 'flex',
   flexDirection: 'column',
   padding: '40px 60px',
   fontFamily,
   backgroundColor: '#0B1120',
  }}>
   <WebBackground />

   {/* Header */}
   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, zIndex: 10 }}>
    <div>
     <h2 style={{ fontSize: 32, fontWeight: 900, color: 'white', margin: 0 }}>Multi-Trợ lý AI Debate Protocol</h2>
     <p style={{ color: '#94A3B8', fontSize: 16, margin: '8px 0 0 0' }}>AI Agents are debating to optimize strategy based on Brand DNA...</p>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(51, 65, 85, 0.8)', padding: '8px 16px', borderRadius: 999 }}>
     <Activity size={16} color="#06B6D4" />
     <span style={{ fontSize: 12, fontWeight: 800, color: '#22D3EE', textTransform: 'uppercase', letterSpacing: 1 }}>Trợ lý AI Network Active</span>
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
    {renderAgentPanel(leftAgentIndex, false)}
    {renderAgentPanel(rightAgentIndex, true)}
   </div>
   
   <style>
    {`
     @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
     }
     @keyframes slideInRight {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
     }
     @keyframes bounce {
      0%, 100% { transform: translateY(0); opacity: 0.5; }
      50% { transform: translateY(-5px); opacity: 1; }
     }
    `}
   </style>
  </div>
 );
};
