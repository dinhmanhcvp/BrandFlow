"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { RationaleTooltip } from '@/components/ui/RationaleTooltip';

const GANTT_DATA = [
 { name: 'Ra mắt Cơm Trưa Chữa Lành', t8: true, t9: true, t10: false, t11: false, t12: false },
 { name: 'Phủ sóng KOC Review TikTok', t8: false, t9: true, t10: true, t11: false, t12: false },
 { name: 'Push Sale Khách B2B', t8: false, t9: false, t10: true, t11: true, t12: false },
 { name: 'Tri ân khách quen Zalo Cuối năm', t8: false, t9: false, t10: false, t11: false, t12: true },
];

export default function PageB6Gantt() {
 const { localData, saveStatus } = useAutoSaveForm('b6-gantt', { items: [] });
 const COLUMNS = [
  { key: 'name', header: 'Chiến dịch / Hành động', className: 'bg-linear-surface font-medium text-foreground', width: '250px',
   render: (row: any) => (
    <div className="flex items-center justify-between">
     <span>{row.name}</span>
     {row.rationale && (
      <RationaleTooltip rationale={row.rationale} type="rationale">
       <span className="sr-only">Why</span>
      </RationaleTooltip>
     )}
    </div>
   )
  },
  { key: 't8', header: 'Tháng 1', align: 'center' as const, render: (r: any) => r.t8 ? <div className="h-8 w-[105%] -ml-[2.5%] bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"></div> : null, className: 'border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-0 overflow-hidden' },
  { key: 't9', header: 'Tháng 2', align: 'center' as const, render: (r: any) => r.t9 ? <div className="h-8 w-[105%] -ml-[2.5%] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"></div> : null, className: 'border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-0 overflow-hidden' },
  { key: 't10', header: 'Tháng 3', align: 'center' as const, render: (r: any) => r.t10 ? <div className="h-8 w-[105%] -ml-[2.5%] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"></div> : null, className: 'border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-0 overflow-hidden' },
  { key: 't11', header: 'Tháng 4', align: 'center' as const, render: (r: any) => r.t11 ? <div className="h-8 w-[105%] -ml-[2.5%] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"></div> : null, className: 'border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-0 overflow-hidden' },
  { key: 't12', header: 'Tháng 5', align: 'center' as const, render: (r: any) => r.t12 ? <div className="h-8 w-[105%] -ml-[2.5%] bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.4)] rounded-r-full"></div> : null, className: 'border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-0 overflow-hidden' },
 ];

 return (
  <>
  <B2BPageTemplate
   saveStatus={saveStatus}
   title="Bảng lập kế hoạch hoạt động (Gantt Chart)"
   description="Lịch biểu trực quan các chiến dịch tiếp thị."
  >
   <div className="space-y-6">
    <InstructionAlert>
     Biểu đồ Gantt theo tháng/tuần đánh dấu thời gian bắt đầu và kết thúc của các chiến dịch lớn.
    </InstructionAlert>
    
    <div className="bento-card p-6 overflow-x-auto">
      <PastelTable columns={COLUMNS} data={localData?.items?.length > 0 ? localData.items : GANTT_DATA} />
    </div>
    <WizardNavigation prevLink="/planning/b5-pnl" prevLabel="Về B.5" nextLink="/planning/c0-overview" nextLabel="Hoàn thành Phần B! 👉 Sang Phần C" />
   </div>
  </B2BPageTemplate>
    </>
 );
}
