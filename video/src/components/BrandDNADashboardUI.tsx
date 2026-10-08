import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { Activity, Shield, AlertTriangle, AlertCircle, Zap, Lightbulb } from 'lucide-react';
import { WebBackground } from './WebBackground';

const { fontFamily } = loadFont();

export const BrandDNADashboardUI: React.FC = () => {
 const frame = useCurrentFrame();
 const { fps } = useVideoConfig();

 // Animations
 const containerSpring = spring({ frame, fps, config: springConf.snappy });
 const scale = interpolate(containerSpring, [0, 1], [0.9, 1]);
 const opacity = interpolate(containerSpring, [0, 1], [0, 1]);

 // Auto-scroll animation
 // Dashboard is long, so we slowly scroll it up
 // Reduced scrolling distance and delayed start so the header is readable
 const scrollY = interpolate(frame, [fps * 2, fps * 8], [0, -150], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

 // Child animations (staggered)
 const headerSpring = spring({ frame: frame - 10, fps, config: springConf.snappy });
 
 // Left column appears first since camera pushes to scorecard first
 const scorecardSpring = spring({ frame: frame - 45, fps, config: springConf.bouncy });
 
 // Right column appears when camera pulls back/pushes to expert
 const expertSpring = spring({ frame: frame - 180, fps, config: springConf.bouncy });
 
 // Visual DNA appears after Scorecard
 const visualSpring = spring({ frame: frame - 60, fps, config: springConf.bouncy });

 // Circular progress for score 82 (starts when scorecard appears)
 const scoreProgress = spring({ frame: frame - 55, fps, config: springConf.snappy });
 const scoreValue = Math.round(interpolate(scoreProgress, [0, 1], [0, 82], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
 const strokeDashoffset = interpolate(scoreProgress, [0, 1], [540, 540 - (540 * 82) / 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

 return (
  <div style={{
   width: '100%',
   height: '100%',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   padding: 40,
   fontFamily,
  }}>
   {/* Main Container */}
   <div style={{
    transform: `scale(${scale})`,
    opacity,
    width: '100%',
    height: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 32,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 0 60px rgba(6, 182, 212, 0.15)',
    position: 'relative',
    overflow: 'hidden'
   }}>
    <WebBackground />
    
    {/* Scrollable Content */}
    <div style={{
     width: '100%',
     padding: '60px',
     transform: `translateY(${scrollY}px)`,
     display: 'flex',
     flexDirection: 'column',
     gap: 40
    }}>
     
     {/* Header */}
     <div style={{ 
      marginBottom: 20,
      opacity: headerSpring,
      transform: `translateY(${interpolate(headerSpring, [0, 1], [20, 0])}px)`
     }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 16px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.05)', marginBottom: 16 }}>
       <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#06B6D4', marginRight: 12 }} />
       <span style={{ fontSize: 14, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: 1 }}>AI Research Completed</span>
      </div>
      <h2 style={{ fontSize: 56, fontWeight: 900, color: 'white', margin: '0 0 16px 0' }}>
       Brand <span style={{ color: '#3B82F6' }}>DNA</span>
      </h2>
      <p style={{ fontSize: 20, color: '#94A3B8', margin: 0 }}>Hồ sơ Thương hiệu successfully synthesized.</p>
     </div>

     <div style={{ display: 'flex', gap: 30 }}>
      {/* Left Column (Scorecard & Visual DNA) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30 }}>
       
       {/* Scorecard Module */}
       <div data-fx="scorecard" style={{ 
        padding: 40, borderRadius: 24, background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(11,17,32,0.9))', border: '1px solid rgba(6,182,212,0.2)', display: 'flex', flexDirection: 'column', gap: 30,
        opacity: scorecardSpring,
        transform: `translateY(${interpolate(scorecardSpring, [0, 1], [40, 0])}px)`
       }}>
        <div style={{ display: 'flex', gap: 40 }}>
         {/* Circle */}
         <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
           <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
           <circle cx="90" cy="90" r="80" fill="none" stroke="#06B6D4" strokeWidth="12" strokeDasharray="540" strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
           <span style={{ fontSize: 56, fontWeight: 900, color: 'white' }}>{scoreValue}</span>
           <span style={{ fontSize: 12, fontWeight: 800, color: '#06B6D4', textTransform: 'uppercase', letterSpacing: 2 }}>Score</span>
          </div>
         </div>
         
         {/* Details */}
         <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
           <div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#06B6D4', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px 0' }}>Revenue & Market Reality</h3>
            <h4 style={{ fontSize: 32, fontWeight: 900, color: 'white', margin: '0 0 16px 0' }}>Bếp Nhà Mộc <span style={{ color: '#64748B', fontWeight: 400 }}>| Corporate F&B</span></h4>
           </div>
           <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171', padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Activity size={14} /> High Risk
           </div>
          </div>
          <p style={{ fontSize: 16, color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
           Bếp Nhà Mộc sở hữu lợi thế lớn về chất lượng 'chuẩn cơm nhà', ít dầu mỡ. Tuy nhiên, quán đang rơi vào 'bẫy giá rẻ' khi cạnh tranh trên App.
          </p>
         </div>
        </div>
        
        {/* Metrics */}
        <div style={{ display: 'flex', gap: 20 }}>
         <div style={{ flex: 1, backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: 20, borderRadius: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8 }}>LTV : CAC</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#F87171', marginBottom: 4 }}>1.2x</div>
          <div style={{ fontSize: 12, color: '#F87171', opacity: 0.8 }}>Dưới mức an toàn (3x)</div>
         </div>
         <div style={{ flex: 1, backgroundColor: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', padding: 20, borderRadius: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8 }}>Churn Rate</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#FBBF24', marginBottom: 4 }}>68%</div>
          <div style={{ fontSize: 12, color: '#FBBF24', opacity: 0.8 }}>Tệp khách Corporate</div>
         </div>
         <div style={{ flex: 1, backgroundColor: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)', padding: 20, borderRadius: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8 }}>Wasted OPEX</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#C084FC', marginBottom: 4 }}>45%</div>
          <div style={{ fontSize: 12, color: '#C084FC', opacity: 0.8 }}>Facebook Ads Broad</div>
         </div>
        </div>
       </div>

       {/* Visual Brand DNA */}
       <div style={{ 
        padding: 30, borderRadius: 24, backgroundColor: 'rgba(30,41,59,0.5)', border: '1px solid rgba(255,255,255,0.1)',
        opacity: visualSpring,
        transform: `translateY(${interpolate(visualSpring, [0, 1], [40, 0])}px)`
       }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 24px 0' }}>🎨 Visual Brand DNA</h3>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
         <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 20 }}>
          <Shield size={32} color="#EA580C" />
         </div>
         <div>
          <h4 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: '0 0 4px 0' }}>Warm, Authentic, Simple</h4>
          <span style={{ fontSize: 14, color: '#94A3B8' }}>Archetype</span>
         </div>
        </div>
        
        <h4 style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Suggested Palette</h4>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
         {['#C4622D', '#F9F5F0', '#3E523A'].map(color => (
          <div key={color} style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: color, border: '1px solid rgba(255,255,255,0.2)' }} />
         ))}
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
         {['Bát gốm mộc mạc', 'Ánh sáng tự nhiên', 'Khay gỗ', 'Gần gũi'].map(kw => (
          <span key={kw} style={{ padding: '8px 16px', borderRadius: 999, backgroundColor: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 14, color: '#CBD5E1' }}>{kw}</span>
         ))}
        </div>
       </div>
      </div>

      {/* Right Column (Expert Analysis & Market) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30 }}>
       
       {/* Expert Business Analysis */}
       <div data-fx="expert" style={{ 
        padding: 40, borderRadius: 24, background: 'linear-gradient(135deg, #0F172A, #1E293B)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        opacity: expertSpring,
        transform: `translateY(${interpolate(expertSpring, [0, 1], [40, 0])}px)`
       }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 24, marginBottom: 24 }}>
         <h3 style={{ fontSize: 24, fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', margin: 0 }}>
          <Zap size={28} color="#22D3EE" style={{ marginRight: 12 }} /> Expert Business Analysis
         </h3>
         <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171', padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
          High Priority
         </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
         {/* Financial Health */}
         <div style={{ backgroundColor: 'rgba(30,41,59,0.4)', padding: 24, borderRadius: 16, border: '1px solid rgba(244,63,94,0.2)' }}>
          <h4 style={{ fontSize: 12, fontWeight: 800, color: '#FB7185', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, display: 'flex', alignItems: 'center' }}>
           <AlertTriangle size={16} style={{ marginRight: 8 }} /> Financial Health
          </h4>
          <p style={{ fontSize: 16, color: 'white', fontWeight: 700, marginBottom: 8 }}>Cảnh báo Lợi nhuận (Margin Warning)</p>
          <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>Doanh thu ổn định ở mức 685 triệu VNĐ/tháng nhưng Biên lợi nhuận ròng đang suy giảm, chỉ còn 9%. Phụ thuộc quá nhiều vào App giao đồ ăn.</p>
         </div>

         {/* Operational Bottlenecks */}
         <div style={{ backgroundColor: 'rgba(30,41,59,0.4)', padding: 24, borderRadius: 16, border: '1px solid rgba(245,158,11,0.2)' }}>
          <h4 style={{ fontSize: 12, fontWeight: 800, color: '#FBBF24', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, display: 'flex', alignItems: 'center' }}>
           <AlertCircle size={16} style={{ marginRight: 8 }} /> Operational Bottlenecks
          </h4>
          <p style={{ fontSize: 16, color: 'white', fontWeight: 700, marginBottom: 8 }}>Nút thắt Vận hành</p>
          <p style={{ fontSize: 14, color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>Quá tải giờ cao điểm trưa (11:30 - 12:30). Không có phần mềm điều phối đồng bộ giữa các đơn App và Zalo.</p>
         </div>
         
         {/* Strategic Recommendation */}
         <div style={{ background: 'linear-gradient(90deg, rgba(30,58,138,0.4), rgba(8,145,178,0.2))', padding: 24, borderRadius: 16, border: '1px solid rgba(6,182,212,0.3)' }}>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: '#67E8F9', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16, display: 'flex', alignItems: 'center' }}>
           <Lightbulb size={20} style={{ marginRight: 12 }} /> Strategic Recommendation
          </h4>
          <ul style={{ margin: 0, paddingLeft: 20, color: 'white', fontSize: 14, lineHeight: 1.8, fontWeight: 500 }}>
           <li style={{ marginBottom: 8 }}>Dừng ngay lập tức các chương trình Flash Sale trên App.</li>
           <li style={{ marginBottom: 8 }}>Phát Flyer chuyển đổi tệp khách hàng App sang đặt Zalo OA.</li>
           <li>Phát triển gói Cơm Doanh nghiệp (Subscription).</li>
          </ul>
         </div>
        </div>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};
