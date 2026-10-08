"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { RationaleTooltip } from '@/components/ui/RationaleTooltip';

const ASSUMP_DATA = [
 { core: 'Xu hướng "Cơm văn phòng healthy" tăng', logic: 'Thị hiếu người dùng ưu tiên sức khỏe', action: 'Tăng cường PR lợi ích dinh dưỡng' },
 { core: 'Giá nguyên liệu gạo & thịt heo ổn định', logic: 'Dự báo lạm phát < 4%', action: 'Chốt hợp đồng nguyên liệu dài hạn 6 tháng' },
];

export default function PageA7Assumptions() {
 const { localData, saveStatus } = useAutoSaveForm('a7-assumptions', { items: [] });
 const COLUMNS = [
  { key: 'core', header: 'Giả định cốt lõi', className: 'bg-linear-surface font-medium text-linear-text-muted' },
  { key: 'logic', header: 'Điều kiện Logic', className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
  { key: 'action', header: 'Hành động loại bỏ nếu sai', className: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold',
   render: (row: any) => (
    <div className="flex items-center justify-between">
     <span>{row.action}</span>
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
   title="Các giả định (Assumptions)"
   description="Danh sách ngắn gọn các giả định cốt lõi tác động trực tiếp đến kế hoạch."
  >
   <div className="space-y-6">
    <InstructionAlert>
     Nếu một giả định không xảy ra mà kế hoạch vẫn có thể thực hiện được, thì loại bỏ giả định đó khỏi danh sách.
    </InstructionAlert>
    
    <div className="bento-card p-6">
      <PastelTable columns={COLUMNS} data={localData?.items?.length > 0 ? localData.items : ASSUMP_DATA} />
    </div>
    <WizardNavigation prevLink="/planning/a6-portfolio" prevLabel="Về A.6" nextLink="/planning/a8-strategies" nextLabel="Tiếp tục: A.8 Mục tiêu & Chiến lược" />
   </div>
  </B2BPageTemplate>
    </>
 );
}
