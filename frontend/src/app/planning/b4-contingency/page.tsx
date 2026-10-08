"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { RationaleTooltip } from '@/components/ui/RationaleTooltip';

const CONT_DATA = [
 { risk: 'Chiết khấu App (ShopeeFood) tăng mạnh', level: 'Cao', impact: 'Giảm 10% biên LN Gộp', trigger: 'Phí sàn > 28%', action: 'Tặng mã giảm giá riêng lôi kéo khách qua Zalo OA' },
 { risk: 'Khan hiếm nguồn cung thịt sạch', level: 'TB', impact: 'Đứt gãy 20% menu chính', trigger: 'Báo động dịch bệnh từ NCC', action: 'Kích hoạt ngay nhà cung cấp dự phòng số 2' },
];

export default function PageB4Contingency() {
 const { localData, saveStatus } = useAutoSaveForm('b4-contingency', { items: [] });
 const COLUMNS = [
  { key: 'risk', header: 'Giả định rủi ro', className: 'bg-linear-surface font-medium text-linear-text-muted' },
  { key: 'level', header: 'Mức độ', align: 'center' as const, className: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold border-x border-white dark:border-slate-800' },
  { key: 'impact', header: 'Tác động tài chính', className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
  { key: 'trigger', header: 'Điểm kích hoạt', align: 'center' as const, headerClassName: 'bg-rose-100 dark:bg-rose-900/30 text-rose-900 dark:text-rose-400', className: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 font-bold border-x border-white dark:border-slate-800' },
  { key: 'action', header: 'Hành động dự phòng thực tế', className: 'bg-cyan-500/10 text-cyan-400',
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
  <B2BPageTemplate
   saveStatus={saveStatus}
   title="Kế hoạch Dự phòng (Contingency Plan)"
   description="Đánh giá rủi ro (Downside risk assessment) để trả lời câu hỏi 'Điều gì xảy ra nếu...?'"
  >
   <div className="space-y-6">
    <InstructionAlert>
     Lập kế hoạch hành động "Backup" cho các giả định rủi ro có khả năng xảy ra cao nhất, kèm điểm kích hoạt (Trigger point) rõ ràng.
    </InstructionAlert>
    
    <div className="bento-card p-6">
      <PastelTable columns={COLUMNS} data={localData?.items?.length > 0 ? localData.items : CONT_DATA} />
    </div>
    <WizardNavigation prevLink="/planning/b3-budget" prevLabel="Về B.3" nextLink="/planning/b5-pnl" nextLabel="Tiếp tục: B.5 Lãi lỗ" />
   </div>
     </B2BPageTemplate>
 );
}
