"use client";

import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';
import React from 'react';
import B2BPageTemplate from '@/components/b2b/B2BPageTemplate';
import InstructionAlert from '@/components/b2b/InstructionAlert';
import PastelTable from '@/components/b2b/PastelTable';
import WizardNavigation from '@/components/b2b/WizardNavigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/i18n/translations';
import { RationaleTooltip } from '@/components/ui/RationaleTooltip';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const RADAR_DATA = [
 { ksf: 'Chất lượng lõi', our_score: 8, comp_score: 5 },
 { ksf: 'Định vị Thương hiệu', our_score: 4, comp_score: 8 },
 { ksf: 'Vận hành Delivery', our_score: 6, comp_score: 9 },
 { ksf: 'Đa dạng Doanh thu', our_score: 2, comp_score: 7 },
 { ksf: 'CSKH (CRM)', our_score: 5, comp_score: 4 },
];

const KSF_DATA = [
 { ksf: 'Không gian tĩnh lặng & Concept', weight: '35%', our_score: 9, comp_score: 6, issue: 'Điểm khác biệt cốt lõi (VRIO) cần duy trì' },
 { ksf: 'Chất lượng nguyên liệu (Organic)', weight: '25%', our_score: 8, comp_score: 7, issue: 'Truyền thông mạnh về Farm-to-Table' },
 { ksf: 'Hương vị món ăn truyền thống', weight: '25%', our_score: 8, comp_score: 8, issue: 'Giữ vững chuẩn vị cơm nhà' },
 { ksf: 'Chi phí tiếp cận (Pricing)', weight: '15%', our_score: 6, comp_score: 8, issue: 'Cần ra mắt gói Combo Trưa (Business Lunch)' },
];

export default function PageA5Swot() {
 const { localData, saveStatus } = useAutoSaveForm('a5-swot', { items: [] });
 const { t } = useLanguage();
 const COLUMNS = [
  { key: 'ksf', header: 'Yếu tố thành công (CSFs)', className: 'bg-linear-surface font-medium text-linear-text-muted' },
  { key: 'weight', header: 'Trọng số', align: 'center' as const, className: 'bg-slate-100 dark:bg-slate-800/30 font-semibold' },
  { key: 'our_score', header: 'Điểm SBU (1-10)', align: 'center' as const, headerClassName: 'bg-[#eecbff] text-purple-900 dark:text-purple-400', className: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border-r border-white dark:border-slate-800' },
  { key: 'comp_score', header: 'Điểm Đối thủ', align: 'center' as const, headerClassName: 'bg-[#ffdec2] text-orange-900 dark:text-orange-400', className: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold' },
  { key: 'issue', header: 'Vấn đề then chốt rút ra', className: 'bg-linear-surface text-linear-text-muted border-l border-linear-border',
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
   title={t('a5.title' as TranslationKey) as string || "Phân tích SWOT & Năng lực cạnh tranh"}
   description={t('a5.desc' as TranslationKey) as string || "Đánh giá năng lực cốt lõi so với đối thủ cạnh tranh hàng đầu để định hướng phân bổ trọng số chiến lược."}
  >
   <div className="space-y-6">
    <InstructionAlert>
     {t('a5.alert_desc' as TranslationKey) as string || "Bạn phải lặp lại Form này cho MỖI phân khúc khách hàng/sản phẩm quan trọng."}
    </InstructionAlert>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
     <div className="bento-card p-6 xl:col-span-2">
       <h3 className="text-sm font-semibold text-linear-text-muted mb-4 uppercase tracking-widest">Phân tích KSF & SWOT</h3>
       <PastelTable 
        columns={COLUMNS} 
        data={localData.items && localData.items.length > 0 ? localData.items : []}
       />
     </div>

     <div className="bento-card p-6 min-h-[400px] flex flex-col justify-center items-center xl:col-span-1">
       <h3 className="text-sm font-semibold text-linear-text-muted mb-6 uppercase tracking-widest text-center">Bản đồ Năng lực Cạnh tranh</h3>
       <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
         <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="ksf" tick={{ fill: '#94A3B8', fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
          <RechartsTooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Radar name="Bếp Nhà Mộc" dataKey="our_score" stroke="#A855F7" fill="#A855F7" fillOpacity={0.4} />
          <Radar name="Đối thủ mạnh nhất" dataKey="comp_score" stroke="#F97316" fill="#F97316" fillOpacity={0.4} />
         </RadarChart>
        </ResponsiveContainer>
       </div>
     </div>
    </div>
    <WizardNavigation prevLink="/planning/a4-market" prevLabel="Về A.4" nextLink="/planning/a6-portfolio" nextLabel="Tiếp: A.6 Ma trận" />
   </div>
  </B2BPageTemplate>
    </>
 );
}
