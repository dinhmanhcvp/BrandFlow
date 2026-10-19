"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import {
 Database, UploadCloud, FolderUp, Loader2, CheckCircle2, AlertTriangle, XCircle, Copy,
 Sparkles, ArrowRight, Table2, HelpCircle, ShieldCheck, ChevronDown, LogIn,
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const TABULAR = /\.(xlsx|xlsm|xls|csv)$/i;
// Mỗi request chỉ tải file lên (server trả job_id ngay), số hóa chạy nền → batch chỉ để giới hạn dung lượng request
const BATCH_SIZE = 50;
const POLL_MS = 1500;

type Lang = 'en' | 'vi';
type Bi = { en: string; vi: string };

const TXT = {
 title: { en: "Data Hub", vi: "Kho Dữ liệu" },
 subtitle: {
  en: "Drop hundreds of messy Excel/CSV files. BrandFlow cleans them, maps them to a standard model and lets AI agents query the numbers instead of guessing.",
  vi: "Thả hàng trăm file Excel/CSV lộn xộn. BrandFlow tự làm sạch, ánh xạ về mô hình chuẩn và để AI truy vấn số liệu thay vì đoán.",
 },
 loginNeeded: {
  en: "Sign in with a real account to store data. Demo accounts can only view.",
  vi: "Đăng nhập bằng tài khoản thật để lưu dữ liệu. Tài khoản demo chỉ xem được.",
 },
 signIn: { en: "Sign in", vi: "Đăng nhập" },
 dropTitle: { en: "Smart Data Dropzone", vi: "Thả dữ liệu" },
 dropHint: { en: "Drag Excel/CSV files here", vi: "Kéo thả file Excel/CSV vào đây" },
 pickFiles: { en: "Choose files", vi: "Chọn file" },
 pickFolder: { en: "Choose a folder", vi: "Chọn cả thư mục" },
 uploading: { en: "Digitizing", vi: "Đang số hóa" },
 sending: { en: "Uploading", vi: "Đang tải lên" },
 matrix: { en: "Monthly matrix → one row per (period, value)", vi: "Bảng ma trận theo kỳ → mỗi ô thành một dòng (kỳ, giá trị)" },
 readiness: { en: "Data health", vi: "Sức khỏe dữ liệu" },
 missing: { en: "Missing", vi: "Còn thiếu" },
 present: { en: "Available", vi: "Đã có" },
 questions: { en: "Confirm column mapping", vi: "Xác nhận ánh xạ cột" },
 questionsHint: {
  en: "One answer applies to every file built from the same template.",
  vi: "Trả lời một lần, áp dụng cho mọi file cùng mẫu.",
 },
 skip: { en: "Not this", vi: "Không phải" },
 confirm: { en: "Confirm mapping", vi: "Xác nhận ánh xạ" },
 notLoaded: { en: "Waiting for you — not used by AI yet", vi: "Đang chờ bạn — AI chưa dùng bảng này" },
 showAll: { en: "Show all", vi: "Xem tất cả" },
 showLess: { en: "Show less", vi: "Thu gọn" },
 ask: { en: "Ask your data", vi: "Hỏi dữ liệu" },
 askPlaceholder: { en: "e.g. Which channel brought the most revenue last quarter?", vi: "VD: Kênh nào mang lại doanh thu cao nhất quý trước?" },
 sql: { en: "Query used", vi: "Truy vấn đã chạy" },
 source: { en: "Source", vi: "Nguồn" },
 tables: { en: "Digitized tables", vi: "Bảng đã số hóa" },
 insights: { en: "Verified insights", vi: "Chỉ số đã kiểm chứng" },
 empty: { en: "No data yet — drop your first files.", vi: "Chưa có dữ liệu — hãy thả file đầu tiên." },
 rows: { en: "rows", vi: "dòng" },
 files: { en: "files", vi: "file" },
 custom: { en: "Own table", vi: "Bảng riêng" },
} satisfies Record<string, Bi>;

const ENTITY_LABEL: Record<string, Bi> = {
 sales_line: { en: "Sales", vi: "Bán hàng" },
 product: { en: "Products", vi: "Sản phẩm" },
 customer: { en: "Customers", vi: "Khách hàng" },
 budget_plan: { en: "Budget plans", vi: "Ngân sách" },
 marketing_spend: { en: "Marketing spend", vi: "Chi phí marketing" },
 kpi_target: { en: "KPI targets", vi: "Chỉ tiêu KPI" },
 store_outlet: { en: "Outlets", vi: "Điểm bán" },
 custom: { en: "Own table", vi: "Bảng riêng" },
};

const ASK_SUGGESTIONS: Bi[] = [
 { en: "Top 5 products by revenue", vi: "Top 5 sản phẩm theo doanh thu" },
 { en: "Revenue by month", vi: "Doanh thu theo tháng" },
 { en: "Total budget by plan table", vi: "Tổng ngân sách theo từng bảng kế hoạch" },
];

interface TableReport { table_name: string; sheet: string; range: string; entity: string; data_rows: number; issues: { message: string }[] }
interface FileReport { filename: string; status: string; error?: string; tables?: TableReport[]; data_rows?: number; empty_sheets?: string[] }
interface UploadJob { job_id: string; status: 'queued' | 'running' | 'done' | 'failed'; total: number; processed: number; current_file: string | null; results: FileReport[]; error: string | null }
interface Readiness { score: number; coverage: { present: string[]; missing: string[] }; pending_questions: number; integrity_issues: number }
interface Question { kind?: 'unpivot'; period_columns?: string[]; column: string; suggestion: string | null; options: string[]; option_labels?: Record<string, string>; samples: string[]; question: string }
interface RecipeQuestions { recipe_id: string; entity: string; loaded: boolean; column_map: Record<string, string>; questions: Question[]; applies_to: { file: string; sheet: string }[] }
interface Catalog { files: number; data_rows: number; canonical_tables: { table: string; rows: number; source_tables: number }[]; raw_tables: { table: string; file: string; sheet: string; range: string; entity: string | null; rows: number }[] }
interface Brief { text: string; insights: { key: string; text: string }[]; readiness: Readiness | null; files: number }
interface AskResult { status: string; answer: string; data?: Record<string, unknown>[]; sql?: string; lineage?: { file?: string; sheet?: string; rows?: number }[] }

function getToken(): string | null {
 if (typeof window === 'undefined') return null;
 return localStorage.getItem('brandflow_token');
}

function hasRealToken(): boolean {
 const token = getToken();
 return !!token && !token.startsWith('mock_');
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
 const token = getToken();
 const res = await fetch(`${API_URL}${path}`, {
  ...init,
  headers: { ...(init.headers || {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
 });
 if (!res.ok) {
  const body = await res.json().catch(() => ({}));
  throw Object.assign(new Error(body.detail || `HTTP ${res.status}`), { status: res.status });
 }
 return res.json();
}

function entityLabel(entity: string | null | undefined, lang: Lang): string {
 return (ENTITY_LABEL[entity || 'custom'] || ENTITY_LABEL.custom)[lang];
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
 return <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 ${className}`}>{children}</div>;
}

function CardTitle({ icon: Icon, children, tone = "text-cyan-600" }: { icon: React.ElementType; children: React.ReactNode; tone?: string }) {
 return (
  <h2 className="font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
   <Icon className={`w-5 h-5 ${tone}`} />{children}
  </h2>
 );
}

export default function DataHubPage() {
 const { language } = useLanguage();
 const lang = language as Lang;
 const tr = (k: keyof typeof TXT) => TXT[k][lang];

 const [canWrite, setCanWrite] = useState(false);
 const [brief, setBrief] = useState<Brief | null>(null);
 const [catalog, setCatalog] = useState<Catalog | null>(null);
 const [questions, setQuestions] = useState<RecipeQuestions[]>([]);
 const [answers, setAnswers] = useState<Record<string, Record<string, string | null>>>({});
 const [showAllQuestions, setShowAllQuestions] = useState(false);
 const [reports, setReports] = useState<FileReport[]>([]);
 const [progress, setProgress] = useState<{ phase: 'sending' | 'uploading'; done: number; total: number; current?: string | null } | null>(null);
 const [dragging, setDragging] = useState(false);
 const [question, setQuestion] = useState('');
 const [asking, setAsking] = useState(false);
 const [askResult, setAskResult] = useState<AskResult | null>(null);
 const [error, setError] = useState('');
 const fileInput = useRef<HTMLInputElement>(null);
 const folderInput = useRef<HTMLInputElement>(null);

 const refresh = useCallback(async () => {
  if (!hasRealToken()) return;
  try {
   const [b, c, q] = await Promise.all([
    api<Brief>('/api/v1/data/brief'),
    api<Catalog>('/api/v1/data/tables'),
    api<RecipeQuestions[]>('/api/v1/data/questions'),
   ]);
   setBrief(b); setCatalog(c); setQuestions(q);
  } catch (e) {
   const err = e as Error & { status?: number };
   if (err.status === 401) setCanWrite(false);
   else setError(err.message);
  }
 }, []);

 useEffect(() => {
  // Thư mục chọn qua input cần thuộc tính webkitdirectory (không có trong typings của React)
  folderInput.current?.setAttribute('webkitdirectory', '');
  setCanWrite(hasRealToken());
  refresh();
 }, [refresh]);

 const upload = async (fileList: File[]) => {
  const files = fileList.filter(f => TABULAR.test(f.name));
  if (!files.length || !canWrite) return;
  setError('');
  setReports([]);
  // 1) Tải lên theo batch — mỗi batch được server xếp thành một job nền
  setProgress({ phase: 'sending', done: 0, total: files.length });
  const jobIds: string[] = [];
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
   const form = new FormData();
   files.slice(i, i + BATCH_SIZE).forEach(f => form.append('files', f, f.name));
   try {
    const job = await api<UploadJob>('/api/v1/data/upload', { method: 'POST', body: form });
    jobIds.push(job.job_id);
   } catch (e) {
    setError((e as Error).message);
    break;
   }
   setProgress({ phase: 'sending', done: Math.min(i + BATCH_SIZE, files.length), total: files.length });
  }
  // 2) Poll tiến độ số hóa của mọi job cho tới khi xong
  const jobs: Record<string, UploadJob> = {};
  while (jobIds.length) {
   try {
    const latest = await Promise.all(jobIds.map(id => api<UploadJob>(`/api/v1/data/jobs/${id}`)));
    latest.forEach(j => { jobs[j.job_id] = j; });
   } catch (e) {
    setError((e as Error).message);
    break;
   }
   const all = jobIds.map(id => jobs[id]);
   const running = all.find(j => j.status === 'queued' || j.status === 'running');
   setProgress({
    phase: 'uploading',
    done: all.reduce((n, j) => n + j.processed, 0),
    total: all.reduce((n, j) => n + j.total, 0),
    current: running?.current_file,
   });
   setReports(all.flatMap(j => j.results));
   const failed = all.find(j => j.status === 'failed');
   if (failed?.error) setError(failed.error);
   if (!running) break;
   await new Promise(r => setTimeout(r, POLL_MS));
  }
  setProgress(null);
  await refresh();
 };

 const onDrop = (e: React.DragEvent) => {
  e.preventDefault();
  setDragging(false);
  upload(Array.from(e.dataTransfer.files));
 };

 const choose = (recipeId: string, column: string, value: string | null) => {
  setAnswers(prev => ({ ...prev, [recipeId]: { ...(prev[recipeId] || {}), [column]: value } }));
 };

 const confirmRecipe = async (rq: RecipeQuestions) => {
  const chosen = answers[rq.recipe_id] || {};
  const columnMap: Record<string, string> = { ...rq.column_map };
  let valueColumn: string | null = null;
  for (const q of rq.questions) {
   const value = q.column in chosen ? chosen[q.column] : q.suggestion;
   if (q.kind === 'unpivot') {
    // Cột kỳ không map trực tiếp: giá trị các ô tháng/quý đổ vào một cột số chuẩn
    valueColumn = value;
    continue;
   }
   if (value) columnMap[q.column] = value;
   else delete columnMap[q.column];
  }
  const unpivotSkipped = rq.questions.some(q => q.kind === 'unpivot') && !valueColumn;
  try {
   await api(`/api/v1/data/recipes/${rq.recipe_id}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(unpivotSkipped
     ? { entity: 'custom', column_map: {} }
     : { entity: rq.entity, column_map: columnMap, value_column: valueColumn }),
   });
   await refresh();
  } catch (e) {
   setError((e as Error).message);
  }
 };

 const ask = async (text: string) => {
  if (!text.trim() || !canWrite) return;
  setAsking(true);
  setAskResult(null);
  try {
   setAskResult(await api<AskResult>('/api/v1/data/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: text }),
   }));
  } catch (e) {
   setAskResult({ status: 'error', answer: (e as Error).message });
  } finally {
   setAsking(false);
  }
 };

 const readiness = brief?.readiness;

 return (
  <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-4 md:p-8">
   <div className="max-w-6xl mx-auto space-y-5">

    <Card>
     <div className="flex items-start gap-4">
      <div className="w-12 h-12 shrink-0 bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 rounded-xl flex items-center justify-center">
       <Database className="w-6 h-6" />
      </div>
      <div className="min-w-0">
       <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">{tr('title')}</h1>
       <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{tr('subtitle')}</p>
      </div>
     </div>
     {!canWrite && (
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
       <AlertTriangle className="w-4 h-4 shrink-0" />
       <span className="flex-1">{tr('loginNeeded')}</span>
       <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-amber-900 dark:text-amber-200 hover:underline">
        <LogIn className="w-4 h-4" />{tr('signIn')}
       </Link>
      </div>
     )}
     {error && (
      <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 px-4 py-3 text-sm text-red-800 dark:text-red-200">{error}</div>
     )}
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
     <Card className="lg:col-span-2">
      <CardTitle icon={UploadCloud}>{tr('dropTitle')}</CardTitle>
      <div
       onDragOver={e => { e.preventDefault(); setDragging(true); }}
       onDragLeave={() => setDragging(false)}
       onDrop={onDrop}
       className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragging ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10' : 'border-slate-300 dark:border-slate-700'} ${canWrite ? '' : 'opacity-50 pointer-events-none'}`}
      >
       {progress ? (
        <div className="flex flex-col items-center gap-2 text-slate-700 dark:text-slate-300">
         <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
         <div className="text-sm font-medium">{tr(progress.phase)} {progress.done}/{progress.total} {tr('files')}…</div>
         <div className="w-full max-w-xs h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div className="h-full bg-cyan-500 transition-all" style={{ width: `${progress.total ? (100 * progress.done) / progress.total : 0}%` }} />
         </div>
         {progress.current && <div className="text-xs text-slate-500 truncate max-w-xs">{progress.current}</div>}
        </div>
       ) : (
        <>
         <UploadCloud className="w-9 h-9 mx-auto text-slate-400 mb-2" />
         <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{tr('dropHint')}</div>
         <div className="text-xs text-slate-500 mt-1">.xlsx · .xlsm · .xls · .csv</div>
         <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button onClick={() => fileInput.current?.click()} className="px-4 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700">{tr('pickFiles')}</button>
          <button onClick={() => folderInput.current?.click()} className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-1.5">
           <FolderUp className="w-4 h-4" />{tr('pickFolder')}
          </button>
         </div>
        </>
       )}
       <input ref={fileInput} type="file" multiple accept=".xlsx,.xlsm,.xls,.csv" className="hidden"
        onChange={e => { upload(Array.from(e.target.files || [])); e.target.value = ''; }} />
       <input ref={folderInput} type="file" multiple className="hidden"
        onChange={e => { upload(Array.from(e.target.files || [])); e.target.value = ''; }} />
      </div>

      {reports.length > 0 && (
       <ul className="mt-4 space-y-2 max-h-72 overflow-y-auto">
        {reports.map((r, i) => (
         <li key={`${r.filename}-${i}`} className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2 text-sm">
          <div className="flex items-center gap-2">
           {r.status === 'digitized' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            : r.status === 'duplicate' ? <Copy className="w-4 h-4 text-slate-400 shrink-0" />
            : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
           <span className="font-medium text-slate-800 dark:text-slate-200 truncate flex-1">{r.filename}</span>
           {r.status === 'digitized' && <span className="text-xs text-slate-500 shrink-0">{r.tables?.length} {lang === 'vi' ? 'bảng' : 'tables'} · {(r.data_rows || 0).toLocaleString()} {tr('rows')}</span>}
          </div>
          {r.error && <div className="text-xs text-slate-500 mt-1 pl-6">{r.error}</div>}
          {r.tables && r.tables.length > 0 && (
           <div className="flex flex-wrap gap-1.5 mt-1.5 pl-6">
            {r.tables.filter(t => t.entity !== 'custom').map(t => (
             <span key={t.table_name} className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-300">
              {t.sheet} → {entityLabel(t.entity, lang)}{t.issues.length ? ' ⚠' : ''}
             </span>
            ))}
           </div>
          )}
         </li>
        ))}
       </ul>
      )}
     </Card>

     <Card>
      <CardTitle icon={ShieldCheck} tone="text-emerald-600">{tr('readiness')}</CardTitle>
      {readiness ? (
       <div className="space-y-3">
        <div className="flex items-end gap-2">
         <span className="text-5xl font-black text-slate-900 dark:text-slate-100">{readiness.score}</span>
         <span className="text-slate-500 mb-1.5">/100</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
         <div className="h-full bg-emerald-500" style={{ width: `${readiness.score}%` }} />
        </div>
        <div className="text-sm text-slate-700 dark:text-slate-300">
         {(catalog?.files || 0).toLocaleString()} {tr('files')} · {(catalog?.data_rows || 0).toLocaleString()} {tr('rows')}
        </div>
        <div className="text-xs">
         <div className="text-slate-500 mb-1">{tr('present')}</div>
         <div className="flex flex-wrap gap-1">
          {readiness.coverage.present.map(e => <span key={e} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">{entityLabel(e, lang)}</span>)}
         </div>
         {readiness.coverage.missing.length > 0 && <>
          <div className="text-slate-500 mt-2 mb-1">{tr('missing')}</div>
          <div className="flex flex-wrap gap-1">
           {readiness.coverage.missing.map(e => <span key={e} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">{entityLabel(e, lang)}</span>)}
          </div>
         </>}
        </div>
       </div>
      ) : (
       <p className="text-sm text-slate-500">{tr('empty')}</p>
      )}
     </Card>
    </div>

    {questions.length > 0 && (
     <Card>
      <CardTitle icon={HelpCircle} tone="text-amber-600">{tr('questions')}</CardTitle>
      <p className="text-xs text-slate-500 -mt-2 mb-3">{tr('questionsHint')}</p>
      <div className="space-y-4">
       {(showAllQuestions ? questions : questions.slice(0, 3)).map(rq => (
        <div key={rq.recipe_id} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
         {!rq.loaded && <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 mb-1">{tr('notLoaded')}</div>}
         <div className="text-xs text-slate-500 mb-2">
          {entityLabel(rq.entity, lang)} · {rq.applies_to.slice(0, 3).map(a => `${a.file} / ${a.sheet}`).join(', ')}
          {rq.applies_to.length > 3 ? ` +${rq.applies_to.length - 3}` : ''}
         </div>
         <div className="space-y-3">
          {rq.questions.map(q => {
           const chosen = answers[rq.recipe_id]?.[q.column];
           const current = chosen === undefined ? q.suggestion : chosen;
           return (
            <div key={q.column}>
             {q.kind === 'unpivot' && <div className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 mb-0.5">{tr('matrix')}</div>}
             <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{q.question}</div>
             {q.samples.length > 0 && <div className="text-xs text-slate-500 mt-0.5">{q.samples.join(' · ')}</div>}
             <div className="flex flex-wrap gap-1.5 mt-2">
              {q.options.map(opt => (
               <button key={opt} onClick={() => choose(rq.recipe_id, q.column, opt)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${current === opt ? 'bg-cyan-600 border-cyan-600 text-white' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500'}`}>
                {lang === 'vi' && q.option_labels?.[opt] ? q.option_labels[opt] : opt}
               </button>
              ))}
              <button onClick={() => choose(rq.recipe_id, q.column, null)}
               className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${current === null ? 'bg-slate-700 border-slate-700 text-white' : 'border-slate-300 dark:border-slate-700 text-slate-500 hover:border-slate-500'}`}>
               {tr('skip')}
              </button>
             </div>
            </div>
           );
          })}
         </div>
         <button onClick={() => confirmRecipe(rq)} className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
          {tr('confirm')}
         </button>
        </div>
       ))}
      </div>
      {questions.length > 3 && (
       <button onClick={() => setShowAllQuestions(v => !v)} className="mt-3 text-sm font-semibold text-cyan-700 dark:text-cyan-400 hover:underline">
        {showAllQuestions ? tr('showLess') : `${tr('showAll')} (${questions.length})`}
       </button>
      )}
     </Card>
    )}

    <Card>
     <CardTitle icon={Sparkles} tone="text-violet-600">{tr('ask')}</CardTitle>
     <form onSubmit={e => { e.preventDefault(); ask(question); }} className="relative">
      <input value={question} onChange={e => setQuestion(e.target.value)} disabled={!canWrite || !brief?.files}
       placeholder={tr('askPlaceholder')}
       className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-60" />
      <button type="submit" disabled={asking || !question.trim() || !canWrite}
       className="absolute right-2 top-2 bottom-2 bg-violet-600 text-white rounded-lg px-3 hover:bg-violet-700 disabled:opacity-50 flex items-center">
       {asking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
      </button>
     </form>
     <div className="flex flex-wrap gap-1.5 mt-2">
      {ASK_SUGGESTIONS.map(s => (
       <button key={s.en} disabled={!canWrite || !brief?.files} onClick={() => { setQuestion(s[lang]); ask(s[lang]); }}
        className="text-xs px-2.5 py-1 rounded-full bg-violet-50 text-violet-800 dark:bg-violet-500/10 dark:text-violet-300 hover:bg-violet-100 disabled:opacity-50">
        {s[lang]}
       </button>
      ))}
     </div>
     {askResult && (
      <div className="mt-4 space-y-3">
       <div className={`rounded-xl p-4 text-sm whitespace-pre-wrap leading-relaxed ${askResult.status === 'ok' ? 'bg-violet-50 dark:bg-violet-500/10 text-slate-800 dark:text-slate-200' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-200'}`}>
        {askResult.answer}
       </div>
       {askResult.data && askResult.data.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
         <table className="w-full text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
           <tr>{Object.keys(askResult.data[0]).map(k => <th key={k} className="text-left px-3 py-2 font-semibold">{k}</th>)}</tr>
          </thead>
          <tbody>
           {askResult.data.slice(0, 20).map((row, i) => (
            <tr key={i} className="border-t border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200">
             {Object.values(row).map((v, j) => <td key={j} className="px-3 py-1.5">{typeof v === 'number' ? v.toLocaleString() : String(v ?? '—')}</td>)}
            </tr>
           ))}
          </tbody>
         </table>
        </div>
       )}
       {askResult.lineage && askResult.lineage.length > 0 && (
        <div className="text-xs text-slate-500">
         {tr('source')}: {askResult.lineage.slice(0, 4).map(l => `${l.file} / ${l.sheet} (${l.rows} ${tr('rows')})`).join(' · ')}
        </div>
       )}
       {askResult.sql && (
        <details className="text-xs text-slate-500">
         <summary className="cursor-pointer inline-flex items-center gap-1"><ChevronDown className="w-3 h-3" />{tr('sql')}</summary>
         <pre className="mt-2 p-3 rounded-lg bg-slate-900 text-slate-100 overflow-x-auto">{askResult.sql}</pre>
        </details>
       )}
      </div>
     )}
    </Card>

    {brief && brief.files > 0 && (
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <Card>
       <CardTitle icon={CheckCircle2} tone="text-emerald-600">{tr('insights')}</CardTitle>
       {brief.insights.length ? (
        <ul className="space-y-2">
         {brief.insights.map(i => <li key={i.key} className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">• {i.text}</li>)}
        </ul>
       ) : <p className="text-sm text-slate-500">—</p>}
      </Card>
      <Card>
       <CardTitle icon={Table2}>{tr('tables')}</CardTitle>
       <div className="flex flex-wrap gap-1.5 mb-3">
        {catalog?.canonical_tables.map(t => (
         <span key={t.table} className="text-xs px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 dark:bg-cyan-500/10 dark:text-cyan-300">
          {entityLabel(t.table, lang)} · {t.rows.toLocaleString()} {tr('rows')}
         </span>
        ))}
       </div>
       <ul className="space-y-1 max-h-64 overflow-y-auto text-xs">
        {catalog?.raw_tables.map(t => (
         <li key={t.table} className="flex gap-2 text-slate-600 dark:text-slate-400">
          <span className="truncate flex-1">{t.file} / {t.sheet} <span className="text-slate-400">{t.range}</span></span>
          <span className="shrink-0">{entityLabel(t.entity, lang)}</span>
          <span className="shrink-0 w-16 text-right">{t.rows.toLocaleString()}</span>
         </li>
        ))}
       </ul>
      </Card>
     </div>
    )}

   </div>
  </div>
 );
}
