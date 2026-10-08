"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { RationaleTooltip } from '@/components/ui/RationaleTooltip';

const ISSUES_DATA = [
 { sbu: 'Thịt kho niêu', market: 'Tăng trưởng nhanh (30%)', comp: 'Ít đối thủ làm chuẩn vị', issue: 'Scale-up quy mô sản xuất bị giới hạn do quy trình thủ công.' },
 { sbu: 'Cơm văn phòng (App)', market: 'Bão hòa, phí sàn cao', comp: 'Khốc liệt về giá', issue: 'Chuyển đổi khách hàng từ App sang Zalo OA để giữ biên lợi nhuận.' },
];

export default function PageC3Issues() {
 const { localData, saveStatus } = useAutoSaveForm('c3-issues', { items: [] });
 const COLUMNS = [
  { key: 'sbu', header: 'Tên SBU', className: 'bg-linear-surface font-bold text-foreground',
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
  { key: 'market', header: 'Đặc điểm Thị trường', className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted border-l border-white dark:border-slate-800' },
  { key: 'comp', header: 'Đặc điểm Cạnh tranh', className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted border-l border-white dark:border-slate-800' },
  { key: 'issue', header: 'Vấn đề Chiến lược Then chốt', className: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-medium border-l border-white dark:border-slate-800',
   render: (row: any) => (
    <div className="flex items-center justify-between">
     <span>{row.issue}</span>
     {row.rationale && (
      <RationaleTooltip rationale={row.rationale} type="rationale">
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
   title="Bảng Phân tích Vấn đề (Major Issues)"
   description="Tạo bảng so sánh chéo (cross-reference) vấn đề để HQ dễ dàng ra quyết định."
  >
   <div className="space-y-6">
    <InstructionAlert className="!bg-[#fdf4ff] !border-fuchsia-400 !text-fuchsia-800">
      Mang tất cả các Đặc thù Thị trường và Vấn đề Then chốt (từ SWOT của từng SBU) nhập lên HQ để tìm kiếm điểm cộng hưởng (Synergy).
    </InstructionAlert>
    
    <div className="bento-card p-6">
      <PastelTable columns={COLUMNS} data={localData?.items?.length > 0 ? localData.items : ISSUES_DATA} />
    </div>
    <WizardNavigation prevLink="/planning/c2-history" prevLabel="Về C.2" nextLink="/planning/c4-dashboard" nextLabel="Tiếp tục: C.4 Bảng điều khiển" />
   </div>
  </B2BPageTemplate>
    </>
 );
}
