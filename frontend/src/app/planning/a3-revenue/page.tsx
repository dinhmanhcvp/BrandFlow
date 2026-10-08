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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const CHART_DATA = [
 { year: 'Năm t0 (Nay)', app: 25.0, direct: 5.0, dineIn: 2.0, b2b: 0 },
 { year: 'Năm t+1', app: 28.0, direct: 12.0, dineIn: 4.5, b2b: 5.0 },
 { year: 'Năm t+2', app: 32.0, direct: 22.0, dineIn: 6.0, b2b: 15.0 },
 { year: 'Năm t+3', app: 35.0, direct: 35.0, dineIn: 8.0, b2b: 30.0 },
];

const FIN_DATA = [
 { metric: 'Doanh thu thuần', t0: '32 tỷ', t1: '49.5 tỷ', t2: '75 tỷ', t3: '108 tỷ', source: 'Đẩy mạnh B2B Catering & Zalo OA' },
 { metric: 'Lợi nhuận gộp', t0: '11.2 tỷ', t1: '18.3 tỷ', t2: '28.5 tỷ', t3: '43.2 tỷ', source: 'Tối ưu CAC trên App, tăng khách quen' },
];

export default function PageA3Revenue() {
 const { localData, saveStatus } = useAutoSaveForm('a3-revenue', { items: [] });
 const { t } = useLanguage();
 const FIN_COLUMNS = [
  { key: 'metric', header: 'Hạng mục dự báo', className: 'bg-linear-surface font-medium text-linear-text-muted' },
  { key: 't0', header: 'Năm t0 (Nay)', align: 'center' as const, headerClassName: 'bg-purple-100 dark:bg-purple-900/30 text-purple-900 dark:text-purple-400', className: 'bg-purple-50 dark:bg-purple-500/10 font-semibold text-purple-700 dark:text-purple-400' },
  { key: 't1', header: 'Năm t+1', align: 'center' as const, className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
  { key: 't2', header: 'Năm t+2', align: 'center' as const, className: 'bg-slate-50 dark:bg-slate-800/50 text-linear-text-muted' },
  { key: 't3', header: 'Năm t+3', align: 'center' as const, headerClassName: 'bg-cyan-500/10 text-cyan-400', className: 'bg-cyan-500/10 font-bold text-cyan-400' },
  { key: 'source', header: 'Nguồn tăng trưởng', className: 'bg-linear-surface text-linear-text-muted text-xs',
   render: (row: any) => (
    <div className="flex items-center justify-between">
     <span>{row.source}</span>
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
   title={t('a3.title' as TranslationKey) as string || "Dự phóng Doanh thu & Chỉ số Tài chính"}
   description={t('a3.desc' as TranslationKey) as string || "Tính toán và trực quan hóa kỳ vọng P&L dài hạn."}
  >
   <div className="space-y-6">
    <InstructionAlert className="!bg-cyan-500/10 border-cyan-500 !text-cyan-400">
      <strong>{t('a3.alert_title' as TranslationKey) as string || "Mục tiêu Tài chính:"}</strong> {t('a3.alert_desc' as TranslationKey) as string || "Bảng tóm tắt trực quan để người đọc nắm bắt ngay kết quả tài chính (từ Form 3)."}
    </InstructionAlert>

    <div className="bento-card p-6">
      <h3 className="text-sm font-semibold text-linear-text-muted mb-4 uppercase tracking-widest">Dự báo (Projections)</h3>
      <PastelTable columns={FIN_COLUMNS} data={localData?.items?.length > 0 ? localData.items : FIN_DATA} />
    </div>

    {/* Charts Section */}
    <div className="bento-card p-6 min-h-[400px] flex flex-col">
      <h3 className="text-sm font-semibold text-linear-text-muted mb-6 uppercase tracking-widest text-center">Cơ cấu Doanh thu (Tỷ VNĐ) - Xu hướng Pivot</h3>
      <div className="flex-1 h-[300px]">
       <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
         <defs>
          <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
           <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.8}/>
           <stop offset="95%" stopColor="#94A3B8" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorDirect" x1="0" y1="0" x2="0" y2="1">
           <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
           <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorDineIn" x1="0" y1="0" x2="0" y2="1">
           <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
           <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorB2B" x1="0" y1="0" x2="0" y2="1">
           <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
           <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
          </linearGradient>
         </defs>
         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
         <XAxis dataKey="year" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
         <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} tỷ`} />
         <RechartsTooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px' }} />
         <Legend wrapperStyle={{ paddingTop: '20px' }} />
         <Area type="monotone" dataKey="app" name="Kênh App (Thu hẹp)" stackId="1" stroke="#94A3B8" fill="url(#colorApp)" />
         <Area type="monotone" dataKey="direct" name="Kênh Zalo Direct" stackId="1" stroke="#3B82F6" fill="url(#colorDirect)" />
         <Area type="monotone" dataKey="dineIn" name="Kênh Dine-in" stackId="1" stroke="#10B981" fill="url(#colorDineIn)" />
         <Area type="monotone" dataKey="b2b" name="Kênh B2B Catering" stackId="1" stroke="#8B5CF6" fill="url(#colorB2B)" />
        </AreaChart>
       </ResponsiveContainer>
      </div>
    </div>
    
    <WizardNavigation 
     prevLink="/planning/a2-performance" prevLabel="A.2 Hiệu suất SBU" 
     nextLink="/planning/a4-market" nextLabel="A.4 Bản đồ Thị trường" 
    />
   </div>
  </B2BPageTemplate>
    </>
 );
}
