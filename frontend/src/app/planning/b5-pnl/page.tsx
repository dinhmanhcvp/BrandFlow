"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { RationaleTooltip } from '@/components/ui/RationaleTooltip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

const PNL_CHART = [
  { name: 'DT Gộp', val: 12.5, fill: '#3B82F6' },
  { name: 'Giá vốn', val: -4.0, fill: '#EF4444' },
  { name: 'LN Gộp', val: 7.5, fill: '#10B981' },
  { name: 'Chi phí', val: -4.8, fill: '#EF4444' },
  { name: 'EBITDA', val: 2.6, fill: '#8B5CF6' },
  { name: 'EBT (Lãi)', val: 2.2, fill: '#10B981' },
];

const getRowStyle = (itemName: string) => {
  if (!itemName) return '';
  if (itemName.includes('Doanh Thu Thuần') || itemName.includes('Lợi Nhuận Gộp') || itemName.includes('EBITDA') || itemName.includes('Lợi Nhuận Ròng')) {
    return 'font-bold text-foreground bg-slate-100 dark:bg-slate-800/80';
  }
  if (itemName.startsWith('(-)')) {
    return 'text-rose-600 dark:text-rose-400 pl-4';
  }
  return '';
};

const PNL_DATA = [
  { item: 'Doanh thu thuần', val: '60.0', ratio: '100%' },
  { item: 'Biên LN Gộp', val: '25.2', ratio: '42.0%' },
  { item: 'Chi phí Marketing', val: '3.5', ratio: '5.8%' },
  { item: 'Lợi nhuận hoạt động', val: '16.7', ratio: '27.8% (ROS)' },
];

export default function PageB5Pnl() {
  const { localData, saveStatus } = useAutoSaveForm('b5-pnl', { items: [] });
  const COLUMNS = [
    { key: 'item', header: 'Hạng mục Tài chính', className: 'bg-linear-surface font-medium text-linear-text-muted',
      render: (row: any) => (
        <div className={`flex items-center justify-between py-1 ${getRowStyle(row.item)}`}>
          <span>{row.item}</span>
          {row.rationale && (
            <RationaleTooltip rationale={row.rationale} type="rationale">
              <span className="sr-only">Why</span>
            </RationaleTooltip>
          )}
        </div>
      )
    },
    { key: 'val', header: 'Giá trị (VNĐ)', align: 'right' as const, className: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-x border-white dark:border-slate-800',
      render: (row: any) => (
        <span className={getRowStyle(row.item)}>{row.val}</span>
      )
    },
    { key: 'ratio', header: 'Tỷ lệ (% Doanh thu)', align: 'center' as const, className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted',
      render: (row: any) => (
        <div className={`flex items-center justify-between ${getRowStyle(row.item)}`}>
          <span>{row.ratio}</span>
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
      title="Báo cáo Lãi Lỗ Dự phóng ngắn hạn (P&L)"
      description="Tổng hợp báo cáo lãi lỗ dựa trên chiến dịch 1 năm."
    >
      <div className="space-y-6">
        <InstructionAlert>
          Báo cáo ROS và ROI ngắn hạn để trình ban giám đốc xét duyệt ngân sách.
        </InstructionAlert>
        
        <div className="bento-card p-6">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>

        <div className="bento-card p-6 min-h-[400px] flex flex-col">
           <h3 className="text-sm font-semibold text-linear-text-muted mb-6 uppercase tracking-widest text-center">Cấu trúc Lợi nhuận (Tỷ VNĐ)</h3>
           <div className="flex-1 h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={PNL_CHART} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                 <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                 <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}`} />
                 <RechartsTooltip cursor={{fill: '#1E293B'}} contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
                 <ReferenceLine y={0} stroke="#64748B" />
                 <Bar dataKey="val" radius={[4, 4, 4, 4]} maxBarSize={60}>
                   {PNL_CHART.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        <WizardNavigation prevLink="/planning/b4-contingency" prevLabel="Về B.4" nextLink="/planning/b6-gantt" nextLabel="Tiếp tục: B.6 Gantt Chart" />
      </div>
    </B2BPageTemplate>
        </>
  );
}
