"use client";

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Hexagon, BrainCircuit, FileText, Download, Sparkles,
  ChevronRight, Zap, Shield, BarChart3, Users, Palette, PenTool,
  Monitor, Printer, QrCode, ArrowRight, ArrowDown, CheckCircle2,
  Globe, Mail, Layers, Target, TrendingUp, Activity,
  Database, Network, Loader2, type LucideIcon
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   BRAND TOKENS
   ═══════════════════════════════════════════════════════════════ */
const B = {
  navy: '#0B1120', surface: '#0F172A', blue: '#2563EB', cyan: '#06B6D4',
  white: '#FFFFFF', muted: '#8496AE', red: '#EF4444', emerald: '#10B981',
  grad: 'linear-gradient(135deg, #2563EB, #06B6D4)',
};

/* ═══════════════════════════════════════════════════════════════
   PRINT DIMENSIONS (mm → px at 3.78px/mm ≈ 96dpi screen reference)
   We render at a fixed px size, then html2canvas scales ×3 for 300dpi
   ═══════════════════════════════════════════════════════════════ */
const PRINT = {
  standee:     { w: 800, h: 2000, label: 'Standee 80×200cm', pdfW: 800, pdfH: 2000 },
  infographic: { w: 842, h: 1191, label: 'Infographic A3',   pdfW: 842, pdfH: 1191 },
  onepager:    { w: 595, h: 842,  label: 'One Pager A4',     pdfW: 595, pdfH: 842  },
  logo:        { w: 842, h: 595,  label: 'Logo Guide A4-L',  pdfW: 842, pdfH: 595  },
};

/* ═══════════════════════════════════════════════════════════════
   LOGO (print-safe: no box-shadow glow, solid bg)
   ═══════════════════════════════════════════════════════════════ */
function Logo({ size = 40, showText = true, dark = false }: { size?: number; showText?: boolean; dark?: boolean }) {
  const fs = size < 30 ? 14 : size < 50 ? 20 : size < 70 ? 32 : 48;
  
  const ELECTRIC_BLUE = "#3B82F6";
  const NEON_CYAN = "#06B6D4";

  const leftLines = [
    { d: "M 15 35 C 30 35, 35 20, 50 20" },
    { d: "M 8 45 C 25 45, 30 40, 45 40" },
    { d: "M 8 55 C 25 55, 30 60, 45 60" },
    { d: "M 15 65 C 30 65, 35 80, 50 80" }
  ];

  const networkLines = [
    { x1: 50, y1: 20, x2: 80, y2: 50 },
    { x1: 50, y1: 20, x2: 65, y2: 50 },
    { x1: 50, y1: 20, x2: 45, y2: 40 },
    { x1: 50, y1: 80, x2: 80, y2: 50 },
    { x1: 50, y1: 80, x2: 65, y2: 50 },
    { x1: 50, y1: 80, x2: 45, y2: 60 },
    { x1: 80, y1: 50, x2: 65, y2: 50 },
    { x1: 80, y1: 50, x2: 45, y2: 40 },
    { x1: 80, y1: 50, x2: 45, y2: 60 },
    { x1: 45, y1: 40, x2: 65, y2: 50 },
    { x1: 45, y1: 40, x2: 45, y2: 60 },
    { x1: 45, y1: 60, x2: 65, y2: 50 },
  ];

  const nodes = [
    { cx: 50, cy: 20, r: 3.5 },
    { cx: 50, cy: 80, r: 3.5 },
    { cx: 80, cy: 50, r: 4 },
    { cx: 65, cy: 50, r: 3 },
    { cx: 45, cy: 40, r: 3 },
    { cx: 45, cy: 60, r: 3 },
    { cx: 15, cy: 35, r: 3 },
    { cx: 8, cy: 45, r: 2.5 },
    { cx: 8, cy: 55, r: 2.5 },
    { cx: 15, cy: 65, r: 3 }
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.15 }}>
      <div style={{ width: size, height: size, position: 'relative' }}>
        <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="logoLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={ELECTRIC_BLUE} stopOpacity="0.9" />
              <stop offset="100%" stopColor={NEON_CYAN} stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {leftLines.map((line, idx) => (
            <path key={`ll-${idx}`} d={line.d} stroke="url(#logoLineGrad)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          ))}
          {networkLines.map((line, idx) => (
            <line key={`nl-${idx}`} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={NEON_CYAN} strokeOpacity="0.6" strokeWidth="1.2" />
          ))}
          {nodes.map((node, idx) => (
            <circle key={`nd-${idx}`} cx={node.cx} cy={node.cy} r={node.r} fill={NEON_CYAN} />
          ))}
        </svg>
      </div>
      {showText && (
        <span style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900,
          fontSize: fs, letterSpacing: '-0.02em', color: dark ? '#0F172A' : '#fff',
        }}>
          Brand<span style={{ color: B.cyan }}>Flow</span>
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRINT-SAFE METRIC BOX (solid colors, no gradients on text)
   ═══════════════════════════════════════════════════════════════ */
function PMetric({ value, label }: { value: string; label: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '18px 12px', borderRadius: 16,
      background: '#0F172A', border: '2px solid rgba(6,182,212,0.25)',
    }}>
      <span style={{
        fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900,
        fontSize: 36, color: B.cyan, lineHeight: 1,
      }}>{value}</span>
      <span style={{
        fontSize: 9, color: '#64748b', textTransform: 'uppercase',
        letterSpacing: '0.1em', fontWeight: 700, marginTop: 6, textAlign: 'center',
      }}>{label}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRINT-SAFE PHASE STEP (infographic)
   ═══════════════════════════════════════════════════════════════ */
function PPhase({ num, title, desc, highlight = false }: { num: string; title: string; desc: string; highlight?: boolean }) {
  return (
    <div style={{
      display: 'flex', gap: 16, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: highlight ? B.grad : '#0F172A',
        border: highlight ? `2px solid ${B.cyan}` : '1px solid rgba(148,163,184,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 900, fontSize: 14,
        fontFamily: 'var(--font-space-grotesk), sans-serif',
      }}>
        {highlight ? '⚡' : num}
      </div>
      <div style={{
        flex: 1, padding: '14px 18px', borderRadius: 12,
        background: highlight ? 'rgba(6,182,212,0.1)' : 'rgba(15,23,42,0.5)',
        border: highlight ? '2px solid rgba(6,182,212,0.3)' : '1px solid rgba(148,163,184,0.08)',
      }}>
        <div style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700,
          fontSize: 14, color: highlight ? B.cyan : '#fff', marginBottom: 4,
        }}>{title}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>{desc}</div>
        {highlight && (
          <div style={{
            marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 10px', borderRadius: 20, fontSize: 9, fontWeight: 700,
            background: 'rgba(6,182,212,0.15)', color: B.cyan, border: '1px solid rgba(6,182,212,0.3)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            🛡️ ANTI-HALLUCINATION ENGINE
          </div>
        )}
      </div>
    </div>
  );
}

/* print arrow connector */
function PArrow() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px 0', marginLeft: 20 }}>
      <div style={{ width: 2, height: 20, background: B.grad }} />
      <ArrowDown style={{ width: 14, height: 14, color: B.cyan, marginTop: -4 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ PRINT CANVAS — STANDEE  (80×200cm ratio)
   Professional Design: Oversized typography, SVG vectors, asymmetric layout
   ═══════════════════════════════════════════════════════════════ */
function PrintStandee() {
  const { w, h } = PRINT.standee;
  return (
    <div id="print-standee" style={{
      width: w, height: h, background: '#020617',
      fontFamily: 'var(--font-inter), sans-serif', color: '#fff', overflow: 'hidden',
      position: 'relative',
    }}>
      {/* ── BACKGROUND SCIFI NETWORK (Floating nodes) ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(6,182,212,0.1) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(59,130,246,0.1) 0%, transparent 60%)',
        zIndex: 0
      }} />

      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="neonPurple" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7000FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Floating nodes network for aesthetic background */}
        {Array.from({ length: 45 }).map((_, i) => {
          const x = (i * 137 + 50) % w;
          const y = (i * 283 + 100) % h;
          const r = (i % 3 === 0) ? 4 : 2;
          const nextX = ((i + 1) * 137 + 50) % w;
          const nextY = ((i + 1) * 283 + 100) % h;
          return (
            <g key={`bg-node-${i}`}>
              <circle cx={x} cy={y} r={r} fill="#00F0FF" opacity="0.3" />
              {i % 2 === 0 && <line x1={x} y1={y} x2={nextX} y2={nextY} stroke="#00F0FF" strokeOpacity="0.1" strokeWidth="1" />}
              {i % 5 === 0 && <circle cx={x} cy={y} r={r * 5} fill="none" stroke="#7000FF" strokeOpacity="0.2" strokeWidth="1" />}
            </g>
          );
        })}

        {/* Subtle geometric shards at the corners */}
        <polygon points="0,0 400,0 600,200 600,450 0,650" fill="url(#neonPurple)" opacity="0.2" />
        <polygon points="0,1800 800,1600 800,2000 0,2000" fill="url(#neonCyan)" opacity="0.15" />
      </svg>

      {/* ── FOREGROUND CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        
        {/* HEADER (170-200cm) => top: 60px */}
        <div style={{ position: 'absolute', top: 60, left: 60, right: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Logo size={120} />
            <div style={{ marginTop: 20, fontSize: 20, color: '#00F0FF', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'inline-block', width: 40, height: 2, background: '#00F0FF' }}></span>
              AI Multi-Agent OS
            </div>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end', marginTop: 20 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3].map(i => <div key={i} style={{ width: 16, height: 4, background: '#00F0FF', opacity: i === 3 ? 0.3 : 1 }} />)}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: 6, height: 6, background: '#64748b' }} />)}
            </div>
          </div>
        </div>

        {/* TITLE (130-170cm) => top: 300px */}
        <div style={{ position: 'absolute', top: 300, left: 60, maxWidth: '85%' }}>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900, fontSize: 80, lineHeight: 1.2, letterSpacing: '-0.02em', textTransform: 'uppercase', margin: 0 }}>
            <span style={{ color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.4)' }}>Từ Brief Đến Chiến Lược.</span><br/>
            <span style={{ 
              background: 'linear-gradient(to right, #00F0FF, #a855f7)', 
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.3))'
            }}>Không Cần Agency.</span>
          </h1>
          <p style={{ fontSize: 32, color: '#f8fafc', marginTop: 30, maxWidth: 650, lineHeight: 1.5, fontWeight: 400 }}>
            5 AI Agents tranh luận, CFO AI giữ ngân sách, bạn nhận Blueprint PDF sẵn sàng thuyết trình.
          </p>
        </div>

        {/* SCHEMA (100-130cm) => top: 700px */}
        <div style={{ position: 'absolute', top: 700, left: 60, right: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: 85, height: 85, borderRadius: '50%', background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(0,240,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00F0FF', fontSize: 14, fontWeight: 800, boxShadow: '0 0 15px rgba(0,240,255,0.2)' }}>Intake</div>
              <div style={{ width: 40, height: 3, background: 'rgba(0,240,255,0.4)' }} />
              <div style={{ width: 85, height: 85, borderRadius: '50%', background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(0,240,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00F0FF', fontSize: 14, fontWeight: 800 }}>Strategy</div>
              <div style={{ width: 40, height: 3, background: 'rgba(0,240,255,0.4)' }} />
              <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'rgba(0,240,255,0.1)', border: '3px solid #00F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 900, boxShadow: '0 0 30px rgba(0,240,255,0.6)', textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>CFO AI</div>
              <div style={{ width: 40, height: 3, background: 'rgba(0,240,255,0.4)' }} />
              <div style={{ width: 85, height: 85, borderRadius: '50%', background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(0,240,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00F0FF', fontSize: 14, fontWeight: 800 }}>Design</div>
              <div style={{ width: 40, height: 3, background: 'rgba(0,240,255,0.4)' }} />
              <div style={{ width: 85, height: 85, borderRadius: '50%', background: 'rgba(15,23,42,0.8)', border: '2px solid rgba(0,240,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00F0FF', fontSize: 14, fontWeight: 800 }}>Content</div>
            </div>
          </div>
        </div>

        {/* QR & CTA (60-100cm) => top: 980px */}
        <div style={{ position: 'absolute', top: 980, left: 60, right: 60 }}>
          <div style={{ display: 'flex', gap: 40, background: 'rgba(15,23,42,0.6)', padding: '40px', borderRadius: 32, border: '1px solid rgba(0,240,255,0.3)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ width: 220, height: 220, background: '#fff', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, boxShadow: '0 0 40px rgba(0,240,255,0.4)' }}>
              <QRCodeSVG value="https://brand-flow-hust.vercel.app/" style={{ width: '100%', height: '100%', color: '#020617' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
              <div style={{ fontSize: 24, color: '#00F0FF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                Quét mã để nhận Demo
              </div>
              <div style={{ fontSize: 38, fontWeight: 900, color: '#fff', lineHeight: 1.3, marginBottom: 25, letterSpacing: '-0.02em' }}>
                Nhận Blueprint mẫu cho thương hiệu của bạn
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: 22, color: '#cbd5e1', fontWeight: 600 }}>
                <span style={{ background: 'rgba(0,240,255,0.1)', padding: '12px 24px', borderRadius: 16, border: '1px solid rgba(0,240,255,0.2)' }}>🌐 brand-flow-hust.vercel.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARDS (25-60cm) => top: 1380px */}
        <div style={{ position: 'absolute', top: 1380, left: 60, right: 60, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {[
            { title: '5 Agents phản biện chéo như một team agency thật.', icon: Network },
            { title: 'CFO AI dự báo tài chính, đặt KPI, chặn kế hoạch rủi ro.', icon: Shield, highlight: true },
            { title: 'Xuất Blueprint PDF thuyết trình B2B trong vài phút.', icon: FileText },
          ].map((f, i) => (
            <div key={i} style={{ 
              display: 'flex', gap: 24, alignItems: 'center', padding: '28px 30px', 
              background: f.highlight ? 'rgba(0,240,255,0.1)' : 'rgba(15,23,42,0.8)', 
              border: f.highlight ? '2px solid #00F0FF' : '1px solid rgba(0,240,255,0.2)', 
              borderRadius: 24, backdropFilter: 'blur(10px)',
              boxShadow: f.highlight ? '0 0 30px rgba(0,240,255,0.2)' : 'none'
            }}>
              <div style={{
                width: 65, height: 65, borderRadius: 16, flexShrink: 0,
                background: f.highlight ? 'linear-gradient(135deg, rgba(0,240,255,0.4), rgba(112,0,255,0.4))' : 'rgba(0,240,255,0.1)', 
                border: f.highlight ? 'none' : '1px solid rgba(0,240,255,0.3)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <f.icon size={32} color={f.highlight ? '#fff' : '#00F0FF'} />
              </div>
              <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 30, fontWeight: 700, color: f.highlight ? '#fff' : '#cbd5e1' }}>
                {f.title}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ PRINT CANVAS — INFOGRAPHIC (A3 ratio)
   Professional Design: Flowchart, data nodes, premium tech aesthetic
   ═══════════════════════════════════════════════════════════════ */
function PrintInfographic() {
  const { w, h } = PRINT.infographic;
  return (
    <div id="print-infographic" style={{
      width: w, height: h, background: '#020617',
      fontFamily: 'var(--font-inter), sans-serif', color: '#fff',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      position: 'relative', padding: '40px 50px'
    }}>
      {/* ── BACKGROUND SCIFI NETWORK ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(circle at 10% 10%, rgba(0,240,255,0.15) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(112,0,255,0.15) 0%, transparent 40%)',
        zIndex: 0
      }} />
      <svg width={w} height={h} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="cyberLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#7000FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.8" />
          </linearGradient>
          <filter id="glowLine">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* Dynamic Circuit Paths */}
        <path d="M 150 250 C 150 450, 700 350, 700 550 C 700 750, 150 650, 150 850 C 150 1000, 700 950, 700 1100" fill="none" stroke="url(#cyberLine)" strokeWidth="3" filter="url(#glowLine)" opacity="0.6" />
        <path d="M 700 250 C 700 450, 150 350, 150 550 C 150 750, 700 650, 700 850 C 700 1000, 150 950, 150 1100" fill="none" stroke="url(#cyberLine)" strokeWidth="1" strokeDasharray="10 15" opacity="0.4" />
        
        {/* Intersection Nodes */}
        <circle cx="425" cy="400" r="8" fill="#00F0FF" filter="url(#glowLine)" />
        <circle cx="425" cy="400" r="25" fill="none" stroke="#7000FF" strokeWidth="2" strokeDasharray="4 4" />
        
        <circle cx="425" cy="700" r="8" fill="#00F0FF" filter="url(#glowLine)" />
        <circle cx="425" cy="700" r="25" fill="none" stroke="#7000FF" strokeWidth="2" strokeDasharray="4 4" />
      </svg>

      {/* ── HEADER ── */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,240,255,0.2)', paddingBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <Logo size={60} />
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ fontSize: 16, color: '#00F0FF', letterSpacing: '0.2em', fontWeight: 700 }}>AI ARCHITECTURE</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900, fontSize: 44, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase', textShadow: '0 0 20px rgba(0,240,255,0.3)' }}>
            Workflow <span style={{ color: '#00F0FF' }}>Engine</span>
          </h1>
          <div style={{ fontSize: 13, color: '#94a3b8', letterSpacing: '0.1em', marginTop: 8 }}>
            TỰ ĐỘNG HÓA QUY TRÌNH MARKETING B2B
          </div>
        </div>
      </div>

      {/* ── FLOWCHART CONTENT ── */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 30 }}>
        
        {/* Node 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, width: '85%' }}>
          <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 75, fontWeight: 900, color: 'rgba(0,240,255,0.15)', textShadow: '0 0 20px rgba(0,240,255,0.1)' }}>01</div>
          <div style={{ padding: '24px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: 20, flex: 1, backdropFilter: 'blur(12px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thiết Lập Mục Tiêu & Lằn Ranh Đỏ</h3>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6 }}>CMO AI thiết lập Sứ mệnh cốt lõi và <strong>Red Lines</strong>. Mọi chiến thuật sau này tuyệt đối không được vi phạm nguyên tắc lõi của doanh nghiệp.</p>
          </div>
        </div>

        {/* Node 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, width: '85%', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
          <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 75, fontWeight: 900, color: 'rgba(112,0,255,0.2)', textShadow: '0 0 20px rgba(112,0,255,0.1)' }}>02</div>
          <div style={{ padding: '24px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(112,0,255,0.4)', borderRadius: 20, flex: 1, backdropFilter: 'blur(12px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Audit Gap & Customer Insight</h3>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, textAlign: 'right' }}>Hệ thống tự động rà quét dữ liệu quá khứ, phân mảnh tệp khách hàng (Needs-based) và gán trọng số <strong>Critical Success Factors</strong>.</p>
          </div>
        </div>

        {/* Node MATH ENGINE (Center Hologram) */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -20, background: 'radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%)', filter: 'blur(20px)', zIndex: 0 }} />
          <div style={{ padding: '30px', background: 'linear-gradient(180deg, rgba(2,6,23,0.8) 0%, rgba(8,51,68,0.8) 100%)', border: '2px solid #00F0FF', borderRadius: 30, textAlign: 'center', width: '95%', position: 'relative', zIndex: 10, backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,240,255,0.2)' }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: '#00F0FF', color: '#020617', padding: '6px 24px', borderRadius: 30, fontWeight: 900, fontSize: 14, letterSpacing: '0.2em', boxShadow: '0 0 20px rgba(0,240,255,0.8)' }}>
              CORE MATH ENGINE
            </div>
            <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 42, fontWeight: 900, color: '#fff', margin: '20px 0 12px 0', textShadow: '0 0 20px rgba(0,240,255,0.5)', textTransform: 'uppercase' }}>AI CFO Cross-Audit</h2>
            <p style={{ fontSize: 16, color: '#cbd5e1', maxWidth: 700, margin: '0 auto', lineHeight: 1.6 }}>
              Cơ chế Thẩm định chéo tự trị (Autonomous Syndicate). <strong>CFO AI tự động dự báo ROI, mô phỏng rủi ro dòng tiền và <span style={{ color: '#00F0FF' }}>phủ quyết tuyệt đối</span> các chiến lược phi thực tế.</strong>
            </p>
          </div>
        </div>

        {/* Node 3 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, width: '85%' }}>
          <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 75, fontWeight: 900, color: 'rgba(0,240,255,0.15)', textShadow: '0 0 20px rgba(0,240,255,0.1)' }}>03</div>
          <div style={{ padding: '24px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(0,240,255,0.3)', borderRadius: 20, flex: 1, backdropFilter: 'blur(12px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chiến Lược & Ngân Sách Phái Sinh</h3>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6 }}>Dựa trên Ansoff Matrix. Hệ thống tự động phân bổ ngân sách theo chuẩn MoSCoW, cam kết không vượt quá trần chi phí.</p>
          </div>
        </div>

        {/* Node 4 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, width: '85%', alignSelf: 'flex-end', flexDirection: 'row-reverse' }}>
          <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 75, fontWeight: 900, color: 'rgba(112,0,255,0.2)', textShadow: '0 0 20px rgba(112,0,255,0.1)' }}>04</div>
          <div style={{ padding: '24px', background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(112,0,255,0.4)', borderRadius: 20, flex: 1, backdropFilter: 'blur(12px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Master Blueprint Generation</h3>
            <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6, textAlign: 'right' }}>Toàn bộ quy trình được đóng gói thành tài liệu PDF thuyết trình chuyên nghiệp, sẵn sàng trình bày cho hội đồng quản trị.</p>
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(0,240,255,0.2)', paddingTop: 24, marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 80, height: 80, background: '#fff', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, boxShadow: '0 0 20px rgba(0,240,255,0.2)' }}>
            <QRCodeSVG value="http://brandflowhust.vercel.app" style={{ width: 64, height: 64, color: '#020617' }} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>brandflow.ai</div>
            <div style={{ fontSize: 13, color: '#00F0FF', fontWeight: 600, marginTop: 4 }}>Quét mã QR để trải nghiệm Demo trực tiếp</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, color: '#00F0FF', fontWeight: 800, letterSpacing: '0.1em' }}>EXHIBITION EXCLUSIVE</div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, fontWeight: 600 }}>POWERED BY LLaMA-3.3-70B</div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ PRINT CANVAS — ONE PAGER (A4 ratio)
   Professional Design: Dark Tech Holographic
   ═══════════════════════════════════════════════════════════════ */
function PrintOnePager() {
  const { w, h } = PRINT.onepager;
  return (
    <div id="print-onepager" style={{
      width: w, height: h, background: '#020617',
      fontFamily: 'var(--font-inter), sans-serif', color: '#fff',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
    }}>
      {/* ── BACKGROUND SCIFI GEOMETRY ── */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,240,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.04) 1px, transparent 1px)', backgroundSize: '50px 50px', zIndex: 0 }} />
      
      {/* Massive Glowing Core */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(112,0,255,0.15) 0%, transparent 60%)', filter: 'blur(60px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-20%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0 }} />

      {/* ── HEADER ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '30px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo size={45} dark={false} />
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#00F0FF', letterSpacing: '0.3em', textTransform: 'uppercase' }}>PRODUCT SPECIFICATION</div>
          <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 6, letterSpacing: '0.1em', fontFamily: 'monospace' }}>DOC.REF: B2B-MKT-26 // A4</div>
        </div>
      </div>

      {/* ── HERO TYPOGRAPHY ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '10px 40px 0', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 56, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
          <span style={{ color: '#fff', textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>Hệ Điều Hành</span><br/>
          <span style={{ 
            background: 'linear-gradient(135deg, #00F0FF 0%, #7000FF 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 15px rgba(0,240,255,0.4))'
          }}>Marketing AI</span>
        </h1>
        <p style={{ fontSize: 15, color: '#cbd5e1', marginTop: 20, maxWidth: 450, lineHeight: 1.6, fontWeight: 300 }}>
          Giải pháp công nghệ tự động hóa chuỗi giá trị Marketing B2B với <strong style={{ color: '#00F0FF' }}>Cơ chế AI Thẩm định chéo đa luồng.</strong>
        </p>
      </div>

      {/* ── MASSIVE METRICS ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '30px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        
        {/* Metric 1 */}
        <div style={{ position: 'relative', padding: '30px 24px', background: 'rgba(0,240,255,0.03)', borderRadius: 24, border: '1px solid rgba(0,240,255,0.2)', overflow: 'hidden', boxShadow: 'inset 0 0 20px rgba(0,240,255,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#00F0FF', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Conversion Rate</div>
          <div style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 72, fontWeight: 900, lineHeight: 1,
            color: '#fff', textShadow: '0 0 20px rgba(0,240,255,0.5)'
          }}>10<span style={{ fontSize: 36, opacity: 0.8 }}>%</span></div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>Tỷ lệ chuyển đổi trung bình B2B</div>
          <svg width="100%" height="50" style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <path d="M0,50 Q100,0 200,50 Z" fill="rgba(0,240,255,0.1)" />
            <path d="M0,50 Q100,25 200,50 Z" fill="rgba(0,240,255,0.2)" />
          </svg>
        </div>

        {/* Metric 2 */}
        <div style={{ position: 'relative', padding: '30px 24px', background: 'rgba(112,0,255,0.03)', borderRadius: 24, border: '1px solid rgba(112,0,255,0.2)', overflow: 'hidden', boxShadow: 'inset 0 0 20px rgba(112,0,255,0.05)' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#c084fc', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>Time Saved</div>
          <div style={{
            fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 72, fontWeight: 900, lineHeight: 1,
            color: '#fff', textShadow: '0 0 20px rgba(112,0,255,0.5)'
          }}>85<span style={{ fontSize: 36, opacity: 0.8 }}>%</span></div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 12 }}>Rút ngắn quy trình hoạch định</div>
          <svg width="100%" height="50" style={{ position: 'absolute', bottom: 0, left: 0 }}>
            <path d="M0,50 Q100,0 200,50 Z" fill="rgba(112,0,255,0.1)" />
            <path d="M0,50 Q100,25 200,50 Z" fill="rgba(112,0,255,0.2)" />
          </svg>
        </div>

      </div>

      {/* ── CORE FEATURES (Cyber Cards) ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '0 40px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
        
        {/* Feature 1 */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', background: 'rgba(15,23,42,0.8)', padding: '20px 24px', borderRadius: 20, border: '1px solid rgba(0,240,255,0.2)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(0,240,255,0.1)', border: '1px solid #00F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00F0FF', fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-space-grotesk), sans-serif', boxShadow: '0 0 15px rgba(0,240,255,0.3)' }}>01</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>5 AI Agents Chuyên Biệt</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>Intake, Strategy, Design, Content giao tiếp và phân tích chéo như một đội ngũ Agency B2B thực sự.</div>
          </div>
        </div>

        {/* Feature 2 */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', background: 'rgba(15,23,42,0.8)', padding: '20px 24px', borderRadius: 20, border: '1px solid rgba(112,0,255,0.3)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(112,0,255,0.1)', border: '1px solid #7000FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc', fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-space-grotesk), sans-serif', boxShadow: '0 0 15px rgba(112,0,255,0.3)' }}>02</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>AI CFO & Cross-Audit</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>Hệ thống tự phản biện. AI CFO dự báo ROI và phủ quyết tuyệt đối các chiến lược rủi ro từ Marketer AI.</div>
          </div>
        </div>

        {/* Feature 3 */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', background: 'rgba(15,23,42,0.8)', padding: '20px 24px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 900, fontFamily: 'var(--font-space-grotesk), sans-serif' }}>03</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 4 }}>Master Blueprint PDF</div>
            <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>Xuất bản toàn bộ kế hoạch (Content, Ads, Metrics) thành tài liệu thuyết trình B2B chuyên nghiệp trong 4 phút.</div>
          </div>
        </div>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '35px 40px', borderTop: '1px solid rgba(0,240,255,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', background: 'rgba(2,6,23,0.9)' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ width: 100, height: 100, background: '#fff', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, boxShadow: '0 0 25px rgba(0,240,255,0.3)' }}>
            <QRCodeSVG value="http://brandflowhust.vercel.app" style={{ width: '100%', height: '100%', color: '#020617' }} />
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>brandflow.ai</div>
            <div style={{ fontSize: 15, color: '#00F0FF', marginTop: 6, fontWeight: 600 }}>contact@brandflow.ai</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#64748b', textAlign: 'right', letterSpacing: '0.05em' }}>
          SYSTEM POWERED BY<br/>
          <strong style={{ color: '#00F0FF', fontSize: 13 }}>LLaMA-3.3-70B</strong>
        </div>
      </div>

      {/* Premium Glossy Paper Glare Overlay for Print */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none', zIndex: 100 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ PRINT CANVAS — LOGO GUIDELINES (A4 Landscape)
   ═══════════════════════════════════════════════════════════════ */
function PrintLogoGuide() {
  const { w, h } = PRINT.logo;
  return (
    <div id="print-logo" style={{
      width: w, height: h, background: B.navy,
      padding: '40px 50px', fontFamily: 'var(--font-inter), sans-serif', color: '#fff',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: B.cyan, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 20 }}>
        BrandFlow — Brand Identity Guidelines
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 30, flex: 1 }}>
        {/* Left: Logo + Variants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Primary Logo */}
          <div style={{ padding: '40px 30px', borderRadius: 16, background: '#0F172A', border: '1px solid rgba(148,163,184,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Logo size={70} />
          </div>
          {/* Variants Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { label: 'Full', bg: '#0F172A', dark: false },
              { label: 'Icon Only', bg: '#0F172A', dark: false, iconOnly: true },
              { label: 'Mono White', bg: '#1e293b', dark: false },
              { label: 'On Light', bg: '#f8fafc', dark: true },
            ].map((v, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: 12,
                  background: v.bg, border: '1px solid rgba(148,163,184,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8,
                }}>
                  <Logo size={28} showText={!('iconOnly' in v && v.iconOnly)} dark={v.dark} />
                </div>
                <span style={{ fontSize: 8, color: '#64748b', fontWeight: 600, marginTop: 4, textTransform: 'uppercase' }}>{v.label}</span>
              </div>
            ))}
          </div>
          {/* Usage Rules */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {['Không xoay', 'Không kéo giãn', 'Không đổi màu', 'Không nền rối'].map((r, i) => (
              <div key={i} style={{ padding: '8px 6px', borderRadius: 10, textAlign: 'center', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
                <div style={{ fontSize: 16, marginBottom: 4, color: '#f87171' }}>✕</div>
                <div style={{ fontSize: 8, color: '#94a3b8' }}>{r}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Colors + Typography */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Color Palette */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: B.cyan, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Color Palette</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, borderRadius: 12, overflow: 'hidden' }}>
              {[
                { hex: '#2563EB', name: 'Primary Blue' },
                { hex: '#06B6D4', name: 'Cyan' },
                { hex: '#0B1120', name: 'Navy' },
                { hex: '#0F172A', name: 'Surface' },
                { hex: '#10B981', name: 'Success' },
                { hex: '#EF4444', name: 'Alert' },
              ].map((c, i) => (
                <div key={i} style={{ aspectRatio: '1', background: c.hex, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 6 }}>
                  <div style={{ fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontFamily: 'monospace' }}>{c.hex}</div>
                  <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.5)' }}>{c.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: B.cyan, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Typography</div>
            <div style={{ padding: '16px 20px', borderRadius: 12, background: '#0F172A', border: '1px solid rgba(148,163,184,0.08)', marginBottom: 10 }}>
              <div style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>Heading</div>
              <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 900, fontSize: 28, letterSpacing: '-0.02em' }}>Space Grotesk</div>
              <div style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: 16, color: '#64748b', marginTop: 2 }}>Aa Bb Cc Dd 0123456789</div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 12, background: '#0F172A', border: '1px solid rgba(148,163,184,0.08)' }}>
              <div style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>Body</div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>Inter</div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>Aa Bb Cc Dd 0123456789</div>
            </div>
          </div>

          {/* Specs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: '10px 14px', borderRadius: 10, background: '#0F172A', border: '1px solid rgba(148,163,184,0.06)' }}>
              <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Clear Space</div>
              <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 4 }}>Min = icon height × 0.5</div>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 10, background: '#0F172A', border: '1px solid rgba(148,163,184,0.06)' }}>
              <div style={{ fontSize: 8, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Min Size</div>
              <div style={{ fontSize: 10, color: '#cbd5e1', marginTop: 4 }}>Icon: 8mm · Full: 40mm</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(148,163,184,0.1)', display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#64748b' }}>
        <span>BrandFlow Brand Identity Guidelines v1.0</span>
        <span>© 2026 BrandFlow AI. Confidential.</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PDF EXPORT ENGINE — html-to-image (×3 scale) + jsPDF
   ═══════════════════════════════════════════════════════════════ */
async function exportToPDF(elementId: string, filename: string, pdfW: number, pdfH: number) {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Element not found');

  // Ensure element is visible for capture
  const prev = el.style.display;
  el.style.display = 'flex';
  
  // WAIT FOR BROWSER TO COMPUTE LAYOUT AND PAINT CSS FILTERS
  await new Promise(r => setTimeout(r, 150));

  // We use html-to-image which natively supports CSS filters, text gradients, etc.
  const { toPng } = await import('html-to-image');
  const { jsPDF } = await import('jspdf');

  const imgData = await toPng(el, {
    pixelRatio: 3, // 3× for ~300dpi equivalent
    cacheBust: true,
    style: {
      transform: 'scale(1)',
      transformOrigin: 'top left'
    }
  });

  el.style.display = prev;

  // Create PDF with exact dimensions (pt = points, 1pt ≈ 1/72 inch)
  const orientation = pdfW > pdfH ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'pt',
    format: [pdfW, pdfH],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH, undefined, 'FAST');
  pdf.save(filename);
}


/* ═══════════════════════════════════════════════════════════════
   TAB BUTTON
   ═══════════════════════════════════════════════════════════════ */
function TabBtn({ active, onClick, icon: Icon, label }: {
  active: boolean; onClick: () => void; icon: LucideIcon; label: string;
}) {
  return (
    <button onClick={onClick}
      className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${active
        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MOCKUP WRAPPERS (For Web Preview only, not for PDF)
   ═══════════════════════════════════════════════════════════════ */
function StandeeMockup({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6))', paddingBottom: 40 }}>
      {/* Top Clip */}
      <div style={{ width: 810, height: 24, background: 'linear-gradient(to bottom, #e2e8f0, #94a3b8)', borderTopLeftRadius: 6, borderTopRightRadius: 6, border: '1px solid #64748b', borderBottom: 'none', position: 'relative', zIndex: 2, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.7)' }} />
      
      {/* Banner Content */}
      <div style={{ position: 'relative', zIndex: 1, boxShadow: '0 0 10px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
         {children}
         {/* Subtle plastic/vinyl glare overlay */}
         <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0) 60%)', pointerEvents: 'none' }} />
      </div>

      {/* Bottom Base */}
      <div style={{ width: 860, height: 70, background: 'linear-gradient(to bottom, #cbd5e1, #475569)', position: 'relative', zIndex: 2, borderTop: '3px solid #f1f5f9', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, boxShadow: 'inset 0 5px 15px rgba(0,0,0,0.3), 0 20px 25px rgba(0,0,0,0.5)' }}>
         {/* Base detail */}
         <div style={{ position: 'absolute', top: 15, left: 30, right: 30, height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 10 }} />
         <div style={{ position: 'absolute', top: 35, left: '50%', transform: 'translateX(-50%)', width: 100, height: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 10 }} />
         
         {/* Feet (Left and Right) */}
         <div style={{ position: 'absolute', bottom: -16, left: 150, width: 70, height: 24, background: 'linear-gradient(to bottom, #64748b, #1e293b)', borderRadius: 4, transform: 'perspective(150px) rotateX(40deg)', border: '1px solid #334155', boxShadow: '0 10px 15px rgba(0,0,0,0.5)' }} />
         <div style={{ position: 'absolute', bottom: -16, right: 150, width: 70, height: 24, background: 'linear-gradient(to bottom, #64748b, #1e293b)', borderRadius: 4, transform: 'perspective(150px) rotateX(40deg)', border: '1px solid #334155', boxShadow: '0 10px 15px rgba(0,0,0,0.5)' }} />
      </div>
    </div>
  );
}

function PaperMockup({ children, landscape = false }: { children: React.ReactNode, landscape?: boolean }) {
  return (
    <div style={{ 
      position: 'relative',
      filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
      padding: '20px',
    }}>
      <div style={{ 
        position: 'relative', zIndex: 1, 
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
        borderRadius: 2, overflow: 'hidden'
      }}>
        {children}
        {/* Paper texture/glare overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none' }} />
      </div>
      
      {/* Curved shadow effect simulating page curl */}
      <div style={{ position: 'absolute', bottom: 35, left: 40, right: 40, top: 40, boxShadow: '0 25px 30px rgba(0,0,0,0.6)', borderRadius: '100px / 15px', zIndex: 0 }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ★ MAIN PAGE — Dual Mode: Web Preview + Print Export
   ═══════════════════════════════════════════════════════════════ */
type TabKey = 'standee' | 'infographic' | 'onepager' | 'logo';

export default function BoothMaterialsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('standee');
  const [exporting, setExporting] = useState<TabKey | null>(null);
  const [exportingAll, setExportingAll] = useState(false);
  const [exportProgress, setExportProgress] = useState(0); // 0-4

  const exportConfig: Record<TabKey, { id: string; file: string; w: number; h: number }> = {
    standee:     { id: 'print-standee',     file: 'BrandFlow_Standee_80x200cm.pdf',    w: PRINT.standee.pdfW,     h: PRINT.standee.pdfH },
    infographic: { id: 'print-infographic',  file: 'BrandFlow_Infographic_A3.pdf',      w: PRINT.infographic.pdfW, h: PRINT.infographic.pdfH },
    onepager:    { id: 'print-onepager',     file: 'BrandFlow_OnePager_A4.pdf',         w: PRINT.onepager.pdfW,    h: PRINT.onepager.pdfH },
    logo:        { id: 'print-logo',         file: 'BrandFlow_LogoGuidelines_A4L.pdf',  w: PRINT.logo.pdfW,        h: PRINT.logo.pdfH },
  };

  const handleExport = useCallback(async (tab: TabKey) => {
    setExporting(tab);
    try {
      const cfg = exportConfig[tab];
      await exportToPDF(cfg.id, cfg.file, cfg.w, cfg.h);
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Lỗi xuất PDF: ' + err.message);
    } finally {
      setExporting(null);
    }
  }, []);

  const handleExportAll = useCallback(async () => {
    setExportingAll(true);
    setExportProgress(0);
    const allTabs: TabKey[] = ['standee', 'infographic', 'onepager', 'logo'];
    for (let i = 0; i < allTabs.length; i++) {
      const tab = allTabs[i];
      setExporting(tab);
      setExportProgress(i + 1);
      try {
        const cfg = exportConfig[tab];
        await exportToPDF(cfg.id, cfg.file, cfg.w, cfg.h);
        // Small delay between exports to avoid browser choking
        await new Promise(r => setTimeout(r, 500));
      } catch (err: any) {
        console.error(`Export ${tab} error:`, err);
      }
    }
    setExporting(null);
    setExportingAll(false);
    setExportProgress(0);
  }, []);

  const tabs: { key: TabKey; label: string; icon: LucideIcon; spec: string }[] = [
    { key: 'standee', label: 'Standee', icon: Monitor, spec: '80×200cm' },
    { key: 'infographic', label: 'Infographic', icon: Network, spec: 'A3' },
    { key: 'onepager', label: 'One Pager', icon: FileText, spec: 'A4' },
    { key: 'logo', label: 'Logo & Brand', icon: Hexagon, spec: 'A4 Landscape' },
  ];

  const currentSpec = tabs.find(t => t.key === activeTab)!;

  return (
    <div className="w-full min-h-screen flex flex-col relative z-10 py-5 px-5 lg:px-6">

      {/* ═══ HIDDEN PRINT CANVASES — rendered offscreen for PDF capture ═══ */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, opacity: 1 }}
        aria-hidden="true">
        <PrintStandee />
        <PrintInfographic />
        <PrintOnePager />
        <PrintLogoGuide />
      </div>

      {/* ── HEADER ── */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(37,99,235,0.15))',
              borderColor: 'rgba(6,182,212,0.2)', boxShadow: '0 4px 20px rgba(6,182,212,0.1)',
            }}>
            <Printer className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h1 className="page-title">Booth Materials</h1>
            <p className="page-desc text-[11px]">Ấn phẩm in ấn · Print-ready PDF Export · 300 DPI</p>
          </div>
        </div>
        <div className="flex bg-linear-surface border border-linear-border rounded-xl p-1 gap-0.5 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <TabBtn key={tab.key} active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)} icon={tab.icon} label={tab.label} />
          ))}
        </div>
      </div>

      {/* ── EXPORT TOOLBAR ── */}
      <div className="mb-4 rounded-xl overflow-hidden"
        style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)' }}>
        {/* Top row: status + export-all */}
        <div className="p-3 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(6,182,212,0.1)' }}>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Print-Ready · {currentSpec.spec}
              </span>
              <p className="text-[10px] text-slate-400">
                Kích thước chuẩn in · Không animation · Solid colors · ×3 Scale (~300 DPI)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport(activeTab)}
              disabled={exporting !== null}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all disabled:opacity-50"
              style={{ background: B.grad }}
            >
              {exporting === activeTab && !exportingAll ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang xuất...</>
              ) : (
                <><Download className="w-3.5 h-3.5" /> Xuất PDF ({currentSpec.spec})</>
              )}
            </button>
            <button
              onClick={handleExportAll}
              disabled={exporting !== null}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              style={{
                background: exportingAll ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.25)',
                color: B.cyan,
              }}
            >
              {exportingAll ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang xuất {exportProgress}/4...</>
              ) : (
                <><Layers className="w-3.5 h-3.5" /> Xuất Tất Cả (4 PDF)</>
              )}
            </button>
          </div>
        </div>

        {/* Bottom row: 4 individual export cards */}
        <div className="px-3 pb-3 grid grid-cols-4 gap-2">
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            const isExporting = exporting === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                }}
                disabled={exporting !== null}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all disabled:opacity-50"
                style={{
                  background: isActive ? 'rgba(6,182,212,0.1)' : 'rgba(15,23,42,0.3)',
                  border: isActive ? '1px solid rgba(6,182,212,0.25)' : '1px solid rgba(148,163,184,0.06)',
                }}
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <tab.icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                )}
                <div className="min-w-0">
                  <div className={`text-[11px] font-bold truncate ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
                    {tab.label}
                  </div>
                  <div className="text-[9px] text-slate-500">{tab.spec} · PDF</div>
                </div>
                <Download className={`w-3 h-3 ml-auto shrink-0 ${isActive ? 'text-cyan-500' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── PREVIEW CANVAS — Scaled-down view of the print canvas ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Print spec badge */}
            <div className="mb-4 flex items-center gap-2 text-[10px] text-slate-400">
              <span className="px-2 py-1 rounded bg-slate-800/50 border border-slate-700/30 font-mono font-bold">
                {PRINT[activeTab].w} × {PRINT[activeTab].h} pt
              </span>
              <span>·</span>
              <span>{currentSpec.spec}</span>
              <span>·</span>
              <span>×3 Scale = ~300 DPI</span>
            </div>

            {/* Scaled Preview Container */}
            <div className="w-full flex justify-center mt-4" style={{ perspective: '1500px' }}>
              <div style={{
                transform: activeTab === 'standee'
                  ? 'scale(0.4)' : activeTab === 'logo' ? 'scale(0.65)' : 'scale(0.55)',
                transformOrigin: 'top center',
              }}>
                {activeTab === 'standee' && (
                  <StandeeMockup>
                    <PrintStandee />
                  </StandeeMockup>
                )}
                {activeTab === 'infographic' && (
                  <PaperMockup>
                    <PrintInfographic />
                  </PaperMockup>
                )}
                {activeTab === 'onepager' && (
                  <PaperMockup>
                    <PrintOnePager />
                  </PaperMockup>
                )}
                {activeTab === 'logo' && (
                  <PaperMockup landscape>
                    <PrintLogoGuide />
                  </PaperMockup>
                )}
              </div>
            </div>

            {/* Export buttons grid */}
            <div className="mt-8 w-full max-w-[700px]">
              {/* Individual exports */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {tabs.map(tab => {
                  const isExporting = exporting === tab.key;
                  const done = exportingAll && exportProgress > (['standee', 'infographic', 'onepager', 'logo'].indexOf(tab.key));
                  return (
                    <button
                      key={tab.key}
                      onClick={() => handleExport(tab.key)}
                      disabled={exporting !== null}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all hover:-translate-y-0.5 disabled:opacity-50"
                      style={{
                        background: 'rgba(15,23,42,0.6)',
                        border: activeTab === tab.key ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(148,163,184,0.08)',
                      }}
                    >
                      {isExporting ? (
                        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                      ) : done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <tab.icon className="w-5 h-5 text-slate-400" />
                      )}
                      <span className="text-[11px] font-bold text-white">{tab.label}</span>
                      <span className="text-[9px] text-slate-500">{tab.spec}</span>
                      <div className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: B.cyan }}>
                        <Download className="w-3 h-3" /> PDF
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Export All */}
              <button
                onClick={handleExportAll}
                disabled={exporting !== null}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-50"
                style={{ background: B.grad, boxShadow: '0 8px 30px rgba(6,182,212,0.2)' }}
              >
                {exportingAll ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Đang xuất tất cả... ({exportProgress}/4)</>
                ) : (
                  <><Layers className="w-5 h-5" /> Xuất Tất Cả 4 PDF — Standee + Infographic + One Pager + Logo</>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
