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
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

const BCG_DATA = [
  { name: 'Cơm Văn Phòng (App)', share: 80, growth: 15, fill: '#3B82F6', z: 300, quadrant: 'Bò Sữa (Cash Cow)' }, 
  { name: 'Thịt kho niêu (Signature)', share: 75, growth: 85, fill: '#10B981', z: 200, quadrant: 'Ngôi Sao (Star)' }, 
  { name: 'Gói Cơm B2B', share: 20, growth: 90, fill: '#F59E0B', z: 150, quadrant: 'Dấu Hỏi (Question Mark)' }, 
  { name: 'Món chiên xào', share: 15, growth: 10, fill: '#EF4444', z: 100, quadrant: 'Chó Mực (Dog)' }, 
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0F172A] border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="font-bold text-white mb-1">{data.name}</p>
        <p className="text-xs text-slate-400">Phân loại: <span className="text-white font-medium">{data.quadrant}</span></p>
        <p className="text-xs text-slate-400">Thị phần tương đối: <span className="text-white font-medium">{data.share}%</span></p>
        <p className="text-xs text-slate-400">Tốc độ tăng trưởng: <span className="text-white font-medium">{data.growth}%</span></p>
      </div>
    );
  }
  return null;
};

const DPM_DATA = [
  { segment: 'Mẹ & Trẻ em', attr: 'Cao', pos: 'Mạnh', decision: 'Đầu tư mạnh để tăng trưởng' },
  { segment: 'Dân văn phòng', attr: 'Trung bình', pos: 'Khá', decision: 'Duy trì & Quản lý chọn lọc' },
];

export default function PageA6Portfolio() {
  const { localData, saveStatus } = useAutoSaveForm('a6-portfolio', { items: [] });
  const { t } = useLanguage();
  const COLUMNS = [
    { key: 'segment', header: 'Phân khúc', className: 'bg-linear-surface font-medium text-linear-text-muted' },
    { key: 'attr', header: 'Sức hấp dẫn thị trường', align: 'center' as const, className: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 font-semibold' },
    { key: 'pos', header: 'Vị thế cạnh tranh', align: 'center' as const, className: 'bg-cyan-500/10 text-cyan-400 font-semibold border-l border-white dark:border-slate-800' },
    { key: 'decision', header: 'Quyết định đầu tư', className: 'bg-linear-surface text-linear-text-muted',
      render: (row: any) => (
        <div className="flex items-center justify-between">
          <span>{row.decision}</span>
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
      title={t('a6.title' as TranslationKey) as string || "Ma trận Danh mục đầu tư (DPM)"}
      description={t('a6.desc' as TranslationKey) as string || "Tóm tắt danh mục dựa trên kết quả SWOT."}
    >
      <div className="space-y-6">
        <InstructionAlert>
          {t('a6.strategy' as TranslationKey) as string || "Xuất ra một ma trận trực quan với trục tung/hoành phân loại các phân khúc."}
        </InstructionAlert>
        
        <div className="bento-card p-6">
           <PastelTable columns={COLUMNS} data={localData.items} />
        </div>
        
        {/* BCG Matrix ScatterChart */}
        <div className="bento-card p-6 min-h-[450px] flex flex-col">
           <h3 className="text-sm font-semibold text-linear-text-muted mb-2 uppercase tracking-widest text-center">Ma trận Boston (BCG Matrix)</h3>
           <p className="text-xs text-center text-slate-500 mb-6">Trục X: Thị phần tương đối (Đảo ngược) — Trục Y: Tốc độ tăng trưởng thị trường</p>
           <div className="flex-1 h-[350px] relative">
             <ResponsiveContainer width="100%" height="100%">
               <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                 {/* X Axis is reversed in traditional BCG matrix (High on left, Low on right) */}
                 <XAxis type="number" dataKey="share" name="Thị phần" domain={[0, 100]} reversed={true} stroke="#64748B" fontSize={11} tickFormatter={(v) => `${v}%`} />
                 <YAxis type="number" dataKey="growth" name="Tăng trưởng" domain={[0, 100]} stroke="#64748B" fontSize={11} tickFormatter={(v) => `${v}%`} />
                 <RechartsTooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#475569' }} />
                 <ReferenceLine x={50} stroke="#475569" strokeDasharray="4 4" />
                 <ReferenceLine y={50} stroke="#475569" strokeDasharray="4 4" />
                 <Scatter name="SBU" data={BCG_DATA} fill="#8884d8">
                   {BCG_DATA.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                   ))}
                 </Scatter>
               </ScatterChart>
             </ResponsiveContainer>
             
             {/* Quadrant Labels */}
             <div className="absolute top-[10%] left-[10%] opacity-20 pointer-events-none font-bold text-2xl text-emerald-500">STAR</div>
             <div className="absolute top-[10%] right-[10%] opacity-20 pointer-events-none font-bold text-2xl text-amber-500">QUESTION</div>
             <div className="absolute bottom-[10%] left-[10%] opacity-20 pointer-events-none font-bold text-2xl text-blue-500">CASH COW</div>
             <div className="absolute bottom-[10%] right-[10%] opacity-20 pointer-events-none font-bold text-2xl text-rose-500">DOG</div>
           </div>
        </div>
        <WizardNavigation prevLink="/planning/a5-swot" prevLabel="Về A.5" nextLink="/planning/a7-assumptions" nextLabel="Tiếp tục: A.7 Giả định" />
      </div>
    </B2BPageTemplate>
        </>
  );
}
