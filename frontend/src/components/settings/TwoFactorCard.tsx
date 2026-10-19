"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Status = { enabled: boolean; pending_setup: boolean };
type Detail = string | { message?: string } | undefined;

const TXT = {
 title: { en: "Two-factor authentication (2FA)", vi: "Xác thực 2 lớp (2FA)" },
 on: { en: "Enabled — sign-in asks for a code from your authenticator app.", vi: "Đang bật — đăng nhập sẽ hỏi mã từ ứng dụng xác thực." },
 off: { en: "Off. Add a second layer with Google Authenticator, Authy or 1Password.", vi: "Đang tắt. Thêm lớp bảo vệ bằng Google Authenticator, Authy hoặc 1Password." },
 setup: { en: "Set up 2FA", vi: "Thiết lập 2FA" },
 scan: { en: "Scan this QR code, then enter the 6-digit code to finish.", vi: "Quét mã QR này, rồi nhập mã 6 số để hoàn tất." },
 manual: { en: "Or enter this key manually:", vi: "Hoặc nhập khóa này thủ công:" },
 enable: { en: "Enable", vi: "Bật 2FA" },
 disable: { en: "Turn off 2FA", vi: "Tắt 2FA" },
 code: { en: "6-digit code", vi: "Mã 6 số" },
 login: { en: "Sign in with a real account to manage 2FA.", vi: "Đăng nhập tài khoản thật để quản lý 2FA." },
};

export default function TwoFactorCard() {
 const { language } = useLanguage();
 const lang = language as 'en' | 'vi';
 const tr = (k: keyof typeof TXT) => TXT[k][lang];

 const [status, setStatus] = useState<Status | null>(null);
 const [setupData, setSetupData] = useState<{ secret: string; otpauth_uri: string } | null>(null);
 const [code, setCode] = useState('');
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState('');
 const [available, setAvailable] = useState(true);

 const call = useCallback(async (path: string, body?: object) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('brandflow_token') : null;
  const res = await fetch(`${API_URL}/api/v1/auth${path}`, {
   method: body ? 'POST' : 'GET',
   headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
   body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
   const detail = data.detail as Detail;
   throw Object.assign(new Error(typeof detail === 'string' ? detail : detail?.message || `HTTP ${res.status}`), { status: res.status });
  }
  return data;
 }, []);

 useEffect(() => {
  const token = localStorage.getItem('brandflow_token');
  if (!token || token.startsWith('mock_')) { setAvailable(false); return; }
  call('/2fa/status').then(setStatus).catch(() => setAvailable(false));
 }, [call]);

 const run = async (fn: () => Promise<void>) => {
  setBusy(true); setError('');
  try { await fn(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
 };

 const startSetup = () => run(async () => { setSetupData(await call('/2fa/setup', {})); setCode(''); });
 const enable = () => run(async () => { setStatus(await call('/2fa/enable', { code }).then(() => ({ enabled: true, pending_setup: false }))); setSetupData(null); setCode(''); });
 const disable = () => run(async () => { await call('/2fa/disable', { code }); setStatus({ enabled: false, pending_setup: false }); setCode(''); });

 return (
  <section>
   <h3 className="text-sm font-bold uppercase tracking-widest text-linear-text-muted mb-4 flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> {tr('title')}</h3>
   <div className="section-card p-6 space-y-4">
    {!available ? (
     <p className="text-sm text-linear-text-muted">{tr('login')}</p>
    ) : !status ? (
     <Loader2 className="w-5 h-5 animate-spin text-linear-text-muted" />
    ) : (
     <>
      <p className="text-sm text-foreground">{status.enabled ? tr('on') : tr('off')}</p>

      {!status.enabled && !setupData && (
       <button onClick={startSetup} disabled={busy} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60">
        {tr('setup')}
       </button>
      )}

      {!status.enabled && setupData && (
       <div className="flex flex-col sm:flex-row gap-5 items-start">
        <div className="bg-white p-3 rounded-lg border border-linear-border shrink-0">
         <QRCodeSVG value={setupData.otpauth_uri} size={160} />
        </div>
        <div className="space-y-2 min-w-0">
         <p className="text-sm text-foreground">{tr('scan')}</p>
         <p className="text-xs text-linear-text-muted">{tr('manual')}</p>
         <code className="block text-xs font-mono break-all bg-linear-surface/50 border border-linear-border rounded px-2 py-1">{setupData.secret}</code>
        </div>
       </div>
      )}

      {(status.enabled || setupData) && (
       <div className="flex flex-wrap gap-2 items-center">
        <input
         value={code}
         onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
         inputMode="numeric"
         autoComplete="one-time-code"
         placeholder={tr('code')}
         className="input-field w-40 tracking-[0.3em] placeholder:tracking-normal"
        />
        {status.enabled ? (
         <button onClick={disable} disabled={busy || code.length !== 6} className="px-4 py-2 rounded-lg border border-red-500/40 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-500/10 disabled:opacity-50">
          {tr('disable')}
         </button>
        ) : (
         <button onClick={enable} disabled={busy || code.length !== 6} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
          {tr('enable')}
         </button>
        )}
        {busy && <Loader2 className="w-4 h-4 animate-spin text-linear-text-muted" />}
       </div>
      )}

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
     </>
    )}
   </div>
  </section>
 );
}
