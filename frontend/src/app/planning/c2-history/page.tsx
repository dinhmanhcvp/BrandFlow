"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { RationaleTooltip } from '@/components/ui/RationaleTooltip';

const PORT_DATA = [
 { bcg: 'Ngôi sao (Star)', sbu: 'Thịt kho niêu (Signature)', rev: '12 tỷ', target: '25 tỷ' },
 { bcg: 'Bò sữa (Cash Cow)', sbu: 'Cơm văn phòng (App)', rev: '18 tỷ', target: '30 tỷ' },
 { bcg: 'Dấu hỏi (Question)', sbu: 'Gói Cơm B2B (Công ty)', rev: '2 tỷ', target: '15 tỷ' },
];

export default function PageC2History() {
 const { localData, saveStatus } = useAutoSaveForm('c2-history', { items: [] });
 const COLUMNS = [
  { key: 'bcg', header: 'Phân loại SBU (BCG)', className: 'bg-linear-surface font-bold text-linear-text-muted' },
  { 
   key: 'sbu', 
   header: 'Tên Đơn vị kinh doanh', 
   className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted',
   render: (row: any) => (
    <div className="flex items-center justify-between">
     <span>{row.sbu}</span>
     {row.rationale && (
      <RationaleTooltip rationale={row.rationale} type="source">
       <span className="sr-only">Why</span>
      </RationaleTooltip>
     )}
    </div>
   )
  },
  { key: 'rev', header: 'Doanh thu hiện tại', align: 'right' as const, className: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold border-x border-white dark:border-slate-800' },
  { key: 'target', header: 'Mục tiêu (+3 năm)', align: 'right' as const, headerClassName: 'bg-cyan-500/10 text-cyan-400', className: 'bg-cyan-500/10 text-cyan-400 font-bold' },
 ];

 return (
  <>
  <B2BPageTemplate
   saveStatus={saveStatus}
   title="Tóm tắt Lịch sử & Danh mục (Portfolio Summary)"
   description="Biểu đồ danh mục đầu tư (Matrix) đặt tất cả các SBU lên cùng một ma trận."
  >
   <div className="space-y-6">
    <InstructionAlert className="!bg-[#fdf4ff] !border-fuchsia-400 !text-fuchsia-800">
      Bức tranh tương lai sử dụng ma trận BCG (Bò sữa, Ngôi sao, Tiền mặt...) để điều tiết dòng tiền giữa các SBU.
    </InstructionAlert>
    
    <div className="bento-card p-6">
      <PastelTable columns={COLUMNS} data={localData?.items?.length > 0 ? localData.items : PORT_DATA} />
    </div>
    <WizardNavigation prevLink="/planning/c1-direction" prevLabel="Về C.1" nextLink="/planning/c3-issues" nextLabel="Tiếp tục: C.3 Phân tích Vấn đề" />
   </div>
  </B2BPageTemplate>
    </>
 );
}
