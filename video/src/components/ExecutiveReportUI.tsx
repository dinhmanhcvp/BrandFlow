import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/SpaceGrotesk';
import { Zap, Target, TrendingUp, CheckCircle2 } from 'lucide-react';
import { WebBackground } from './WebBackground';

const { fontFamily } = loadFont();

export const ExecutiveReportUI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animations
  const containerSpring = spring({ frame, fps, config: springConf.snappy });
  const scale = interpolate(containerSpring, [0, 1], [0.95, 1]);
  const opacity = interpolate(containerSpring, [0, 1], [0, 1]);

  // Auto-scroll animation
  const scrollY = interpolate(frame, [10, 80], [0, -300], { extrapolateRight: 'clamp' });

  // Number counting effects
  const revVal = interpolate(frame, [40, 80], [0, 2.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }).toFixed(1);
  const growthVal = Math.floor(interpolate(frame, [40, 80], [0, 108], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const ebitdaVal = interpolate(frame, [50, 90], [0, 28.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }).toFixed(1);
  const profitVal = interpolate(frame, [50, 90], [0, 1.07], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }).toFixed(2);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 0',
      fontFamily,
      backgroundColor: '#0F172A',
      perspective: 1000
    }}>
      <WebBackground />
      
      {/* Report Container */}
      <div style={{
        transform: `scale(${scale}) translateY(${scrollY}px)`,
        opacity,
        width: 800,
        backgroundColor: 'white',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#0F172A',
        transformOrigin: 'top center'
      }}>
        
        {/* Cover Page */}
        <div style={{ height: 600, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', padding: 60, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, backgroundColor: 'rgba(20,184,166,0.1)', borderRadius: '50%' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: 24, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={24} color="#2DD4BF" /> BRANDFLOW
            </div>
            <div style={{ padding: '6px 12px', border: '1px solid rgba(45,212,191,0.3)', backgroundColor: 'rgba(45,212,191,0.1)', color: '#2DD4BF', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, borderRadius: 99 }}>
              Strictly Confidential
            </div>
          </div>

          <div style={{ marginTop: 'auto', marginBottom: 60 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ height: 1, width: 40, backgroundColor: '#2DD4BF' }} />
              <span style={{ color: '#2DD4BF', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>Strategic Marketing Plan</span>
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
              Báo Cáo<br/>
              <span style={{ color: '#2DD4BF' }}>Kế Hoạch Chiến Lược</span>
            </h1>
            <p style={{ color: '#94A3B8', fontSize: 16, marginTop: 24, maxWidth: 500, lineHeight: 1.6 }}>
              Tài liệu hoạch định chiến lược kinh doanh và Marketing tổng thể, được sinh tự động bởi hệ thống Multi-Agent AI (CEO, CMO, CFO, COO) dựa trên nguồn lực lõi của doanh nghiệp.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 30, marginTop: 'auto' }}>
            <div>
              <div style={{ fontSize: 10, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Prepared for</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>Bếp Nhà Mộc</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Date</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>2026</div>
            </div>
          </div>
        </div>

        {/* Page 2 */}
        <div data-fx="report-content" style={{ padding: 60, backgroundColor: '#F8FAFC' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: 16, marginBottom: 30 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#0F172A' }}>BRANDFLOW</div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 2 }}>01 / Strategic Foundation</div>
          </div>

          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Target size={20} color="#0D9488" />
              <h2 style={{ fontSize: 14, fontWeight: 900, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Sứ mệnh & Định vị cốt lõi</h2>
            </div>
            <div style={{ padding: 24, backgroundColor: 'white', borderLeft: '4px solid #0D9488', borderRadius: '0 8px 8px 0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: 18, fontStyle: 'italic', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                "Kiến tạo Bếp Nhà Mộc thành 'Thánh địa Mindful Dining' (Ẩm thực chánh niệm) tiên phong tại Sài Gòn phồn hoa. Không chỉ bán một bữa ăn, chúng ta trao đi 'Liệu pháp Chữa Lành'."
              </p>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <TrendingUp size={20} color="#0D9488" />
              <h2 style={{ fontSize: 14, fontWeight: 900, color: '#0F172A', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Mục tiêu Tài chính</h2>
            </div>
            <div style={{ padding: 24, backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: 8 }}>
               <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                 <CheckCircle2 size={16} color="#3B82F6" style={{ marginTop: 2 }} />
                 <span style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
                    Vượt đỉnh trì trệ (1.2 tỷ/tháng). Tăng trưởng Net Revenue lên mốc <strong style={{ color: '#0D9488' }}>{revVal} tỷ VNĐ/tháng</strong> (<span style={{ color: '#10B981' }}>+{growthVal}%</span>) trong Quý 1.
                 </span>
               </div>
               <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                 <CheckCircle2 size={16} color="#3B82F6" style={{ marginTop: 2 }} />
                 <span style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>
                    EBITDA dự phóng đạt <strong style={{ color: '#0D9488' }}>{ebitdaVal}%</strong> (Mức xuất sắc trong ngành F&B) tương đương <strong style={{ color: '#0D9488' }}>{profitVal} tỷ VNĐ/tháng</strong>.
                 </span>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
