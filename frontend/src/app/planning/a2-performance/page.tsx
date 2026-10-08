"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { RationaleTooltip } from '@/components/ui/RationaleTooltip';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const CHART_DATA = [
 { year: 'Năm t-3 (2023)', revenue: 4.5, margin: 16.5 },
 { year: 'Năm t-2 (2024)', revenue: 6.96, margin: 11.2 },
 { year: 'Năm t-1 (2025)', revenue: 8.22, margin: 8.4 },
];

const PERF_DATA = [
 { metric: 'Khối lượng bán ra', y3: '50 tấn', y2: '85 tấn', y1: '150 tấn', reason: 'Nắm bắt xu hướng "healthy"' },
 { metric: 'Doanh thu thuần', y3: '15 tỷ VNĐ', y2: '25.5 tỷ VNĐ', y1: '45 tỷ VNĐ', reason: 'Mở rộng kênh đại lý' },
 { metric: 'Tỷ suất LN gộp (%)', y3: '35%', y2: '38%', y1: '42%', reason: 'Lợi thế quy mô (Scale)' },
 { metric: 'Biên LN gộp', y3: '5.25 tỷ', y2: '9.69 tỷ', y1: '18.9 tỷ', reason: 'Tối ưu chi phí vận hành bếp' },
];

export default function PageA2Performance() {
 const { localData, saveStatus } = useAutoSaveForm('a2-performance', { items: [] });
 const COLUMNS = [
  { key: 'metric', header: 'Chỉ số (Cố định giá)', className: 'bg-linear-surface font-medium text-linear-text-muted' },
  { key: 'y3', header: 'Năm t-3 (2023)', align: 'center' as const, className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
  { key: 'y2', header: 'Năm t-2 (2024)', align: 'center' as const, className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
  { key: 'y1', header: 'Năm ngoái (2025)', align: 'center' as const, headerClassName: 'text-cyan-400 bg-cyan-500/10', className: 'bg-cyan-500/10 font-bold text-cyan-400' },
  { 
   key: 'reason', 
   header: 'Nguyên nhân chính', 
   className: 'bg-linear-surface text-linear-text-muted text-sm',
   render: (row: any) => (
    <div className="flex items-center justify-between">
     <span>{row.reason}</span>
     {row.rationale && (
      <RationaleTooltip rationale={row.rationale} type="source">
       <span className="sr-only">Why</span>
      </RationaleTooltip>
     )}
    </div>
   )
  },
 ];

 return (
  <>
   <B2BPageTemplate
   saveStatus={saveStatus}
    title="Hiệu suất SBU (3 Năm)"
    description="Tóm tắt hiệu suất của doanh nghiệp trong 3 năm liền kề."
   >
    <div className="space-y-6">
     <InstructionAlert>
      Bảng dữ liệu định lượng và phần bình luận giải thích lý do chính về hiệu suất trong giai đoạn vừa qua.
     </InstructionAlert>
     
     <div className="bento-card p-6">
       <h3 className="text-sm font-semibold text-linear-text-muted mb-4 uppercase tracking-widest">Tóm tắt hiệu suất</h3>
       <PastelTable columns={COLUMNS} data={localData.items} />
     </div>

     <div className="bento-card p-6 min-h-[400px] flex flex-col">
       <h3 className="text-sm font-semibold text-linear-text-muted mb-6 uppercase tracking-widest text-center">Tương quan Doanh thu & Biên lợi nhuận</h3>
       <div className="flex-1 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
         <ComposedChart data={CHART_DATA} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
          <XAxis dataKey="year" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis yAxisId="left" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} tỷ`} />
          <YAxis yAxisId="right" orientation="right" stroke="#10B981" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
          <RechartsTooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar yAxisId="left" dataKey="revenue" name="Doanh thu (Tỷ VNĐ)" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={50} />
          <Line yAxisId="right" type="monotone" dataKey="margin" name="Biên LN Ròng (%)" stroke="#10B981" strokeWidth={3} dot={{ r: 6, fill: '#10B981' }} activeDot={{ r: 8 }} />
         </ComposedChart>
        </ResponsiveContainer>
       </div>
     </div>

     <WizardNavigation 
      prevLink="/planning/a1-mission" prevLabel="A.1 Sứ mệnh" 
      nextLink="/planning/a3-revenue" nextLabel="A.3 Dự phóng Doanh thu" 
     />
    </div>
   </B2BPageTemplate>
   
     </>
 );
}
