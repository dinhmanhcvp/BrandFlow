import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { spring as springConf } from '../motion/springs';
import { loadFont } from '@remotion/google-fonts/Inter';
import { LayoutDashboard, Target, Activity, CheckCircle2, ChevronRight, Users, Shield, PieChart, Brain, Rocket, DollarSign, Wallet, AlertTriangle, TrendingUp, Calendar, Compass, History, AlertCircle, Download, Presentation, BarChart3, ShieldAlert, FileText } from 'lucide-react';

const { fontFamily } = loadFont();

const PLAN_GROUPS = [
 {
  title: 'A. PHÂN TÍCH & CHIẾN LƯỢC',
  items: [
   { title: 'Tổng Quan', icon: LayoutDashboard, path: 'a0', done: true },
   { title: 'A.1 Sứ Mệnh', icon: Target, path: 'a1', done: true },
   { title: 'A.2 Hiệu Suất', icon: Activity, path: 'a2', done: true },
   { title: 'A.3 Doanh Thu', icon: TrendingUp, path: 'a3', done: true },
   { title: 'A.4 Thị Trường', icon: Users, path: 'a4', done: true },
   { title: 'A.5 Phân Tích SWOT', icon: Shield, path: 'a5', done: true },
   { title: 'A.6 Danh Mục', icon: PieChart, path: 'a6', done: true },
   { title: 'A.7 Giả Định', icon: Brain, path: 'a7', done: false },
   { title: 'A.8 Chiến Lược', icon: Rocket, path: 'a8', done: false },
   { title: 'A.9 Ngân Sách', icon: DollarSign, path: 'a9', done: false },
  ]
 },
 {
  title: 'B. THỰC THI & TÀI CHÍNH',
  items: [
   { title: 'B.0 Tổng Quan', icon: LayoutDashboard, path: 'b0', done: false },
   { title: 'B.2 Kế Hoạch', icon: CheckCircle2, path: 'b2', done: false },
   { title: 'B.3 Phân Bổ NS', icon: Wallet, path: 'b3', done: false },
   { title: 'B.4 Rủi Ro', icon: AlertTriangle, path: 'b4', done: false },
   { title: 'B.5 P&L', icon: BarChart3, path: 'b5', done: false },
   { title: 'B.6 Gantt Chart', icon: Calendar, path: 'b6', done: false },
  ]
 },
 {
  title: 'C. ĐÁNH GIÁ & TỐI ƯU',
  items: [
   { title: 'C.0 Tổng Quan', icon: LayoutDashboard, path: 'c0', done: false },
   { title: 'C.1 Định Hướng', icon: Compass, path: 'c1', done: false },
   { title: 'C.2 Lịch Sử', icon: History, path: 'c2', done: false },
   { title: 'C.3 Vấn Đề', icon: AlertCircle, path: 'c3', done: false },
  ]
 },
 {
  title: 'D. XUẤT BẢN',
  items: [
   { title: 'D.0 Executive Report', icon: Download, path: 'd0', done: false },
  ]
 }
];

// Which tab page to highlight per activeTab
const TAB_HIGHLIGHT = ['a0', 'b0', 'c0', 'd0'];

// Content for each tab's main area
const MAIN_CONTENT = [
 {
  header: 'Tổng quan Phần A: Chiến Lược (Strategy)',
  description: '12 bước chuẩn hóa kế hoạch tiếp thị đa kênh.',
  heroTitle: 'Mục tiêu của Phần A là gì?',
  heroDesc: 'Chúng ta sẽ cùng nhau trả lời 3 câu hỏi lớn nhất:',
  points: [
   '1. Chúng ta là ai? (Sứ mệnh)',
   '2. Chúng ta đang đứng ở đâu? (Hiệu suất & SWOT)',
   '3. Chúng ta muốn đi tới đâu? (Mục tiêu & Ngân sách)'
  ],
  cards: [
   { icon: Target, title: 'Đích đến rõ ràng', desc: 'Form A.1 xác định Sứ mệnh, ngăn kinh doanh lan man.' },
   { icon: TrendingUp, title: 'Nhìn lại 3 năm', desc: 'Form A.2 & A.3 bóc tách hiệu suất quá khứ.' },
   { icon: ShieldAlert, title: 'Trận đồ Cạnh tranh', desc: 'Ma trận SWOT và Market Map đối thủ.' }
  ]
 },
 {
  header: 'Tổng quan Phần B: Thực Thi & Tài Chính',
  description: 'Chuyển chiến lược thành hành động cụ thể.',
  heroTitle: 'Mục tiêu của Phần B là gì?',
  heroDesc: 'Biến chiến lược thành kế hoạch hành động:',
  points: [
   '1. Action Plan chi tiết theo từng tuần',
   '2. Phân bổ ngân sách theo kênh & giai đoạn',
   '3. Quản lý rủi ro & P&L Projection'
  ],
  cards: [
   { icon: CheckCircle2, title: 'Kế hoạch cụ thể', desc: 'Action Plan chi tiết theo từng milestone.' },
   { icon: Wallet, title: 'Ngân sách tối ưu', desc: 'Phân bổ NS thông minh theo ROI kỳ vọng.' },
   { icon: Calendar, title: 'Timeline Gantt', desc: 'Biểu đồ Gantt cho toàn bộ chiến dịch.' }
  ]
 },
 {
  header: 'Tổng quan Phần C: Đánh Giá & Tối Ưu',
  description: 'Review và tối ưu liên tục dựa trên data.',
  heroTitle: 'Mục tiêu của Phần C là gì?',
  heroDesc: 'Đo lường kết quả và liên tục tối ưu:',
  points: [
   '1. Theo dõi KPIs theo thời gian thực',
   '2. So sánh hiệu suất vs. kế hoạch ban đầu',
   '3. Phát hiện & xử lý vấn đề sớm'
  ],
  cards: [
   { icon: Compass, title: 'Định hướng', desc: 'Đánh giá hướng đi đúng đắn của chiến dịch.' },
   { icon: History, title: 'Lịch sử data', desc: 'So sánh hiệu suất qua các giai đoạn.' },
   { icon: AlertCircle, title: 'Phát hiện vấn đề', desc: 'Cảnh báo sớm bất thường trong KPIs.' }
  ]
 },
 {
  header: 'Xuất Executive Report',
  description: 'Tổng hợp toàn bộ thành báo cáo chuyên sâu.',
  heroTitle: 'Xuất bản & Chia sẻ',
  heroDesc: 'Tự động tổng hợp toàn bộ dữ liệu:',
  points: [
   '1. Executive Summary cho C-Level',
   '2. Breakdown chi tiết theo từng KPI',
   '3. Xuất PDF/Slide cho stakeholders'
  ],
  cards: [
   { icon: Download, title: 'Auto Export', desc: 'Xuất PDF/Slides tự động từ data thực.' },
   { icon: FileText, title: 'Chi tiết sâu', desc: 'Breakdown theo từng kênh, từng giai đoạn.' },
   { icon: Presentation, title: 'Pitch-ready', desc: 'Slide deck sẵn sàng cho presentation.' }
  ]
 }
];

export const PlanningUI: React.FC = () => {
 const frame = useCurrentFrame();
 const { fps } = useVideoConfig();

 const containerSpring = spring({ frame, fps, config: springConf.snappy });
 const scale = interpolate(containerSpring, [0, 1], [0.95, 1]);
 const opacity = interpolate(containerSpring, [0, 1], [0, 1]);

 // Tab switching: A (0-45), B (45-90), C (90-135), D (135-180)
 const activeTab = frame < 45 ? 0 : frame < 90 ? 1 : frame < 135 ? 2 : 3;
 const activePath = TAB_HIGHLIGHT[activeTab];
 const content = MAIN_CONTENT[activeTab];

 return (
  <div style={{
   width: '100%', height: '100%', display: 'flex', fontFamily,
   backgroundColor: '#0B1120', color: 'white', transform: `scale(${scale})`, opacity, overflow: 'hidden'
  }}>
   {/* ── Sub Navigation Sidebar ── */}
   <div style={{
    width: 280, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(15,23,42,0.95)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
   }}>
    {/* Sidebar Header */}
    <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
     <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, background: 'linear-gradient(90deg, #22D3EE, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
      Strategic Planning
     </h2>
     <p style={{ fontSize: 11, color: '#94A3B8', margin: '6px 0 0 0', fontWeight: 600 }}>12 bước chuẩn hóa kế hoạch tiếp thị đa kênh.</p>
    </div>

    {/* Nav Items */}
    <div style={{ flex: 1, padding: '16px 12px', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: 20 }}>
     {PLAN_GROUPS.map((group, gIdx) => (
      <div key={gIdx}>
       <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: 2, padding: '0 12px', marginBottom: 8 }}>
        {group.title}
       </div>
       <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {group.items.map((item) => {
         const isActive = item.path === activePath;
         const Icon = item.icon;
         return (
          <div key={item.path} style={{
           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
           padding: '8px 12px', borderRadius: 10, position: 'relative', overflow: 'hidden',
           background: isActive ? 'rgba(6,182,212,0.1)' : 'transparent',
           border: isActive ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent',
          }}>
           {isActive && <div style={{ position: 'absolute', left: 0, top: '25%', bottom: '25%', width: 3, background: '#22D3EE', borderRadius: '0 4px 4px 0' }} />}
           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
             width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
             background: isActive ? 'rgba(6,182,212,0.2)' : 'rgba(30,41,59,0.8)'
            }}>
             <Icon size={14} color={isActive ? '#22D3EE' : '#64748B'} />
            </div>
            <span style={{ fontSize: 12, fontWeight: isActive ? 700 : 600, color: isActive ? '#22D3EE' : '#94A3B8' }}>
             {item.title}
            </span>
           </div>
           {isActive ? (
            <ChevronRight size={14} color="#22D3EE" />
           ) : (
            item.done ? <CheckCircle2 size={12} color="#10B981" /> : <div style={{ width: 12, height: 12, borderRadius: '50%', border: '1.5px solid #475569' }} />
           )}
          </div>
         );
        })}
       </div>
      </div>
     ))}
    </div>

    {/* Bottom Master Plan Card */}
    <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
     <div style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Presentation size={14} color="#A855F7" />
        <span style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 2 }}>Master Plan</span>
       </div>
       <span style={{ fontSize: 12, fontWeight: 900, color: '#34D399' }}>85%</span>
      </div>
      <div style={{ width: '100%', height: 6, background: '#1E293B', borderRadius: 3, overflow: 'hidden', marginBottom: 12 }}>
       <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #10B981, #06B6D4, #A855F7)', borderRadius: 3, boxShadow: '0 0 10px rgba(6,182,212,0.5)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
       <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: 8, padding: '8px 12px' }}>
        <div style={{ fontSize: 9, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Budget</div>
        <div style={{ fontSize: 13, fontWeight: 800 }}>140M</div>
       </div>
       <div style={{ background: 'rgba(30,41,59,0.8)', borderRadius: 8, padding: '8px 12px' }}>
        <div style={{ fontSize: 9, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Proj. ROI</div>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#34D399' }}>250%</div>
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* ── Main Content Area ── */}
   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(15,23,42,0.3)', overflow: 'hidden' }}>
    {/* Page Header */}
    <div style={{ padding: '24px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
     <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{content.header}</h1>
     <p style={{ fontSize: 13, color: '#94A3B8', margin: '6px 0 0 0' }}>{content.description}</p>
    </div>

    <div style={{ flex: 1, padding: 40, display: 'flex', flexDirection: 'column', gap: 24, overflow: 'hidden' }}>
     {/* Hero Card */}
     <div style={{
      background: 'linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.5))',
      border: '1px solid rgba(6,182,212,0.15)', borderRadius: 16, padding: 32, position: 'relative', overflow: 'hidden'
     }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, background: 'rgba(6,182,212,0.05)', borderRadius: '50%' }} />
      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#22D3EE', margin: '0 0 12px 0', position: 'relative', zIndex: 1 }}>{content.heroTitle}</h2>
      <p style={{ fontSize: 15, color: '#94A3B8', margin: '0 0 16px 0', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>{content.heroDesc}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 1 }}>
       {content.points.map((pt, i) => (
        <div key={i} style={{ fontSize: 15, fontWeight: 700, color: '#CBD5E1' }}>{pt}</div>
       ))}
      </div>
     </div>

     {/* 3 Cards Row */}
     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
      {content.cards.map((card, idx) => {
       const CardIcon = card.icon;
       return (
        <div key={idx} style={{
         background: 'rgba(30,41,59,0.4)', border: '1px solid rgba(255,255,255,0.05)',
         borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
         <div style={{ width: 48, height: 48, background: 'rgba(6,182,212,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <CardIcon size={24} color="#22D3EE" />
         </div>
         <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 8px 0' }}>{card.title}</h3>
         <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, lineHeight: 1.5 }}>{card.desc}</p>
        </div>
       );
      })}
     </div>

     {/* CTA Bottom Bar */}
     <div style={{
      marginTop: 'auto', background: 'rgba(30,41,59,0.3)', border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
     }}>
      <div>
       <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px 0' }}>Bạn đã sẵn sàng chưa?</h3>
       <p style={{ fontSize: 13, color: '#94A3B8', margin: 0 }}>Sử dụng AI Assistant ở góc phải để phân tích nhanh.</p>
      </div>
      <div style={{ background: 'linear-gradient(90deg, #06B6D4, #3B82F6)', padding: '10px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
       Bắt đầu →
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};
