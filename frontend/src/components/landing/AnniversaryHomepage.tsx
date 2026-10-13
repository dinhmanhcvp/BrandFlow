'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Play,
  Pause,
  ArrowRight,
  ExternalLink,
  Clock,
  Users,
  Compass,
  Cpu,
  Database,
  Briefcase,
  Palette,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  HelpCircle
} from 'lucide-react';
import { lekyniemContent } from '@/content/lekyniem';
import { ANNIVERSARY_CONFIG } from '@/config/anniversary';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';

interface AnniversaryHomepageProps {
  onExitShowcase?: () => void;
}

export default function AnniversaryHomepage({ onExitShowcase }: AnniversaryHomepageProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(2026);
  const [activeDept, setActiveDept] = useState<string>('cntt');
  const [networkLit, setNetworkLit] = useState(false);

  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const sectionIds = ['sec-hero', 'sec-timeline', 'sec-depts', 'sec-outcomes', 'sec-rulers', 'sec-actions'];

  // Xử lý sự kiện tương tác của người dùng (chạm là dừng, 60s không chạm thì tự về vòng lặp)
  const handleUserActivity = useCallback(() => {
    setIsUserInteracting(true);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, ANNIVERSARY_CONFIG.IDLE_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    window.addEventListener('pointerdown', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    return () => {
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [handleUserActivity]);

  // Vòng lặp trình chiếu tự động (45 - 60 giây)
  useEffect(() => {
    if (!isPlaying || isUserInteracting || prefersReducedMotion) {
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      return;
    }

    loopIntervalRef.current = setInterval(() => {
      setActiveSectionIndex((prev) => {
        const next = (prev + 1) % sectionIds.length;
        const targetEl = document.getElementById(sectionIds[next]);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return next;
      });
    }, 9000); // Mỗi khoang hiển thị khoảng 9 giây, hoàn thành 1 vòng ~54 giây

    return () => {
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    };
  }, [isPlaying, isUserInteracting, prefersReducedMotion]);

  // Hiệu ứng mạng lưới cùng sáng lên khi chạm mốc nút thứ 70
  useEffect(() => {
    const timer = setTimeout(() => {
      setNetworkLit(true);
      const settleTimer = setTimeout(() => setNetworkLit(false), 1600);
      return () => clearTimeout(settleTimer);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  // Tính toán vị trí 70 nút (1956 - 2026) theo ma trận mạng lưới bản vẽ kỹ thuật
  const totalNodes = 70;
  const nodes = Array.from({ length: totalNodes }, (_, i) => {
    const year = 1956 + i;
    const col = i % 14;
    const row = Math.floor(i / 14);
    // Tọa độ chuẩn hóa trong khung SVG 1000 x 360
    const x = 70 + col * 64 + (row % 2 === 1 ? 24 : 0);
    const y = 50 + row * 62;
    const milestone = lekyniemContent.timeline.milestones.find((m) => m.year === year);
    return { index: i, year, x, y, milestone, isFinal: year === 2026 };
  });

  return (
    <div
      className="min-h-screen bg-[#FBF9F4] text-[#1C1917] selection:bg-[#990012]/15 selection:text-[#990012] font-sans antialiased relative overflow-x-hidden"
      style={{
        backgroundImage: `
          radial-gradient(#D6D3D1 0.75px, transparent 0.75px),
          linear-gradient(to right, rgba(120, 113, 108, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(120, 113, 108, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px, 24px 24px, 24px 24px'
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          VẠCH CHIA THƯỚC KỸ THUẬT Ở CÁC LỀ TRANG (ENGINEERING RULERS)
      ───────────────────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 h-2 bg-[#F5F2EB] border-b border-[#E7E5E4] z-40 hidden md:flex items-center justify-between px-4 overflow-hidden pointer-events-none opacity-60">
        {Array.from({ length: 48 }).map((_, idx) => (
          <div key={idx} className="flex items-end gap-1 h-full">
            <div className={`w-[1px] ${idx % 5 === 0 ? 'h-full bg-stone-500' : 'h-1 bg-stone-300'}`} />
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          1. DẢI ĐẦU TRANG (HEADER STRIP & LOGO LOCKUP)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#FBF9F4]/95 backdrop-blur-xs border-b border-stone-300 px-4 sm:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Cụm biểu trưng đồng thương hiệu */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* 1.1 Biểu trưng Đại học Bách khoa Hà Nội */}
            <div className="flex items-center gap-2.5 py-1 px-1">
              <div className="relative h-10 sm:h-12 w-28 sm:w-36 flex items-center">
                <Image
                  src={lekyniemContent.header.universityLogoSrc}
                  alt="Đại học Bách khoa Hà Nội"
                  fill
                  sizes="144px"
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>

            {/* Đường kẻ dọc phân cách 1.5px */}
            <div className="h-9 w-[1.5px] bg-stone-300" aria-hidden="true" />

            {/* 1.2 Biểu trưng kỷ niệm 70 năm */}
            <div className="flex items-center py-1">
              <div className="relative h-11 sm:h-13 w-20 sm:w-24">
                <Image
                  src={lekyniemContent.header.anniversaryLogoSrc}
                  alt="Biểu trưng 70 năm Đại học Bách khoa Hà Nội"
                  fill
                  sizes="96px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Đường kẻ dọc phân cách 1.5px */}
            <div className="h-9 w-[1.5px] bg-stone-300" aria-hidden="true" />

            {/* 1.3 Biểu trưng Không gian ĐMST liên ngành (Khung giữ chỗ nét đứt) */}
            <div
              className="border border-dashed border-stone-400 rounded-xs px-2.5 py-1 text-[11px] sm:text-xs text-stone-600 font-mono tracking-tight bg-stone-100/60 hidden lg:flex items-center gap-1.5"
              title="Biểu trưng chính thức đang chờ cập nhật"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Không gian ĐMST liên ngành [CẦN ĐIỀN]</span>
            </div>

            {/* Đường kẻ dọc phân cách 1.5px (cho màn hình lớn) */}
            <div className="h-9 w-[1.5px] bg-stone-300 hidden lg:block" aria-hidden="true" />

            {/* 1.4 Biểu trưng BrandFlow */}
            <div className="flex items-center gap-2">
              <BrandFlowLogo className="w-8 h-8" />
              <span className="text-lg font-bold tracking-tight text-stone-900 font-sans">
                Brand<span className="text-cyan-700">F</span>low
              </span>
            </div>
          </div>

          {/* Cụm điều khiển trình chiếu & chuyển chế độ */}
          <div className="flex items-center gap-3">
            {/* Chỉ báo trạng thái chạy vòng lặp */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xs border border-stone-300 bg-stone-100/80 text-[11px] font-mono text-stone-700">
              <span className={`w-2 h-2 rounded-full ${isPlaying && !isUserInteracting ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'}`} />
              <span>{isUserInteracting ? 'Tương tác tự do' : isPlaying ? 'Trưng bày tự động' : 'Tạm dừng'}</span>
            </div>

            {/* Nút tạm dừng / tiếp tục */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono border border-stone-300 rounded-xs bg-[#FBF9F4] hover:bg-stone-200/60 transition-colors text-stone-800"
              title={isPlaying ? 'Tạm dừng vòng lặp tự động' : 'Bật lại vòng lặp tự động'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-stone-700" /> : <Play className="w-3.5 h-3.5 text-stone-700" />}
              <span className="hidden md:inline">{isPlaying ? 'Tạm dừng' : 'Tiếp tục'}</span>
            </button>

            {/* Nút trở về Chế độ thường (người dùng thật) */}
            <Link
              href="/"
              onClick={() => {
                if (onExitShowcase) onExitShowcase();
              }}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium border border-stone-800 rounded-xs bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors tracking-wide"
            >
              <span>Vào ứng dụng</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. KHOANG MỞ ĐẦU (HERO SECTION - CON SỐ 70 LÀ TÂM ĐIỂM)
      ───────────────────────────────────────────────────────────── */}
      <section id="sec-hero" className="relative pt-12 pb-16 px-4 sm:px-8 border-b border-stone-300 max-w-7xl mx-auto">
        {/* Dấu định vị tọa độ kỹ thuật ở 4 góc */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-stone-400 tracking-wider">REF: BK70-HUST-2026</div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-stone-400 tracking-wider">SCALE: 1:1 // DWG-01</div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Cột trái: Con số 70 khổng lồ theo phong cách bản vẽ kỹ thuật */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center">
            <div className="relative select-none">
              {/* Con số 70 cách điệu kỹ thuật */}
              <div className="text-[120px] sm:text-[160px] md:text-[200px] leading-none font-bold tracking-tighter text-[#990012] font-mono flex items-baseline">
                <span>70</span>
                <span className="text-2xl sm:text-3xl text-stone-500 font-sans font-normal ml-3 tracking-normal">
                  năm
                </span>
              </div>

              {/* Thước đo kích thước kỹ thuật phía dưới con số 70 */}
              <div className="flex items-center gap-2 mt-1 text-stone-500 font-mono text-xs w-full">
                <span className="w-2 h-2 border-l border-b border-stone-400" />
                <div className="h-[1.5px] flex-1 bg-stone-300 relative">
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#FBF9F4] px-2 text-[11px] text-stone-600 font-mono">
                    1956 — 2026
                  </span>
                </div>
                <span className="w-2 h-2 border-r border-b border-stone-400" />
              </div>
            </div>

            {/* Nhãn tem kiểm duyệt kỹ thuật */}
            <div className="mt-4 border border-stone-300 bg-stone-100/60 p-2.5 rounded-xs text-xs font-mono text-stone-700 space-y-0.5">
              <div>ĐẠI HỌC BÁCH KHOA HÀ NỘI</div>
              <div className="text-stone-500 text-[11px]">KHÔNG GIAN ĐỔI MỚI SÁNG TẠO LIÊN NGÀNH</div>
            </div>
          </div>

          {/* Cột phải: Tiêu đề trang trọng và giới thiệu một câu */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="inline-block px-2.5 py-1 text-xs font-mono font-medium text-[#990012] bg-[#990012]/10 border border-[#990012]/30 rounded-xs">
                SỰ KIỆN CHÍNH THỨC
              </div>

              {/* Dòng chào mừng hai sự kiện */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-[1.2]">
                {lekyniemContent.hero.anniversaryGreeting}
              </h1>

              <p className="text-lg sm:text-2xl font-medium text-stone-700 leading-snug">
                {lekyniemContent.hero.inaugurationGreeting}{' '}
                <span className="underline decoration-dotted underline-offset-4 font-semibold text-stone-900">
                  {lekyniemContent.hero.innovationSpaceName}
                </span>
              </p>
            </div>

            {/* Một câu giới thiệu BrandFlow */}
            <div className="border-l-2 border-[#990012] pl-4 py-1">
              <p className="text-base sm:text-xl text-stone-800 leading-relaxed font-normal">
                {lekyniemContent.hero.brandflowIntroduction}
              </p>
            </div>

            {/* Vị trí trưng bày trong không gian */}
            <div className="text-xs sm:text-sm text-stone-600 font-mono flex items-center gap-2 pt-2">
              <Compass className="w-4 h-4 text-stone-500 shrink-0" />
              <span>Vị trí trưng bày: Gian công nghệ trí tuệ nhân tạo, Tầng 1 Không gian ĐMST liên ngành.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. KHOANG "BẢY MƯƠI NĂM, BẢY MƯƠI NÚT" (1956 ĐẾN 2026)
      ───────────────────────────────────────────────────────────── */}
      <section id="sec-timeline" className="py-16 px-4 sm:px-8 border-b border-stone-300 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-1">MỤC 03 // BẢN ĐỒ MỐC THỜI GIAN</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {lekyniemContent.timeline.title}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-1 max-w-2xl">
              {lekyniemContent.timeline.subtitle}
            </p>
          </div>

          {/* Chú thích các loại nút */}
          <div className="flex items-center gap-4 text-xs font-mono text-stone-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-300 border border-stone-500" />
              <span>Mỗi năm (1 nút)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#990012]" />
              <span>Mốc lịch sử trường</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-cyan-600" />
              <span>Nút BrandFlow (2026)</span>
            </div>
          </div>
        </div>

        {/* Khung mạng lưới 70 nút (SVG) */}
        <div className="relative border border-stone-300 rounded-xs bg-[#FAF7F2] p-4 sm:p-6 overflow-hidden">
          <div className="w-full overflow-x-auto">
            <svg
              viewBox="0 0 1000 360"
              className="w-full min-w-[760px] h-auto select-none"
              style={{ maxHeight: '380px' }}
            >
              {/* Lưới tọa độ phụ */}
              <defs>
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(120, 113, 108, 0.08)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="1000" height="360" fill="url(#smallGrid)" />

              {/* Đường nối giữa các năm liên tiếp (stroke drawing) */}
              <path
                d={nodes.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ')}
                fill="none"
                stroke={networkLit ? '#990012' : '#CBD5E1'}
                strokeWidth="1.5"
                strokeDasharray="4 2"
                className="transition-colors duration-700"
              />

              {/* Các đường kết nối chéo mô phỏng mạng lưới BrandFlow */}
              {nodes.map((n, i) => {
                if (i % 7 === 0 && i + 15 < totalNodes) {
                  const target = nodes[i + 15];
                  return (
                    <line
                      key={`diag-${i}`}
                      x1={n.x}
                      y1={n.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={networkLit ? '#F59E0B' : '#E2E8F0'}
                      strokeWidth="0.75"
                      opacity="0.6"
                    />
                  );
                }
                return null;
              })}

              {/* Vẽ từng nút trong 70 nút */}
              {nodes.map((n) => {
                const isSelected = selectedMilestone === n.year;
                const isKey = !!n.milestone;
                const isFinal = n.isFinal;

                return (
                  <g
                    key={n.year}
                    className="cursor-pointer group"
                    onClick={() => setSelectedMilestone(n.year)}
                  >
                    {/* Vòng hào quang khi được chọn hoặc khi mạng lưới cùng sáng */}
                    {(isSelected || (networkLit && isFinal)) && (
                      <circle
                        cx={n.x}
                        cy={n.y}
                        r={isFinal ? 14 : 9}
                        fill="none"
                        stroke={isFinal ? '#0E7490' : isKey ? '#990012' : '#78716C'}
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        className="animate-spin"
                        style={{ transformOrigin: `${n.x}px ${n.y}px`, animationDuration: '6s' }}
                      />
                    )}

                    {/* Điểm tròn của nút */}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={isFinal ? 8 : isKey ? 6 : 3}
                      fill={isFinal ? '#0E7490' : isKey ? '#990012' : isSelected ? '#1C1917' : '#A8A29E'}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      className="transition-transform group-hover:scale-125"
                    />

                    {/* Nhãn năm (chỉ hiện cho mốc chính hoặc khi hover) */}
                    {(isKey || isFinal || n.year % 10 === 0) && (
                      <text
                        x={n.x}
                        y={n.y - (isFinal ? 12 : 9)}
                        textAnchor="middle"
                        fontSize={isFinal ? '11' : isKey ? '10' : '8'}
                        fontFamily="monospace"
                        fontWeight={isKey || isFinal ? 'bold' : 'normal'}
                        fill={isFinal ? '#0E7490' : isKey ? '#990012' : '#78716C'}
                      >
                        {n.year}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Thẻ hiển thị thông tin mốc năm được chọn */}
          <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs font-mono text-stone-700">
            <div>
              <span className="font-semibold text-stone-900">Mốc năm đang xem: {selectedMilestone}</span>
              {(() => {
                const m = lekyniemContent.timeline.milestones.find((x) => x.year === selectedMilestone);
                if (m) {
                  return <span className="text-[#990012] font-sans font-medium ml-2"> — {m.label}</span>;
                }
                if (selectedMilestone === 2026) {
                  return <span className="text-cyan-700 font-sans font-medium ml-2"> — Điểm hội tụ BrandFlow</span>;
                }
                return <span className="text-stone-500 font-sans ml-2"> — Nút thời gian trong hành trình 70 năm</span>;
              })()}
            </div>
            <div className="text-stone-500 text-[11px]">
              Nhấp vào bất kỳ nút nào để xem chi tiết
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. KHOANG LIÊN NGÀNH (CÁC SỢI NỐI KÉO VỀ BRANDFLOW)
      ───────────────────────────────────────────────────────────── */}
      <section id="sec-depts" className="py-16 px-4 sm:px-8 border-b border-stone-300 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-1">MỤC 04 // KHÔNG GIAN ĐỔI MỚI SÁNG TẠO</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {lekyniemContent.interdisciplinary.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-700 mt-2 max-w-3xl leading-relaxed">
            {lekyniemContent.interdisciplinary.narrative}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Cột trái: Danh sách các ngành tham gia */}
          <div className="lg:col-span-7 space-y-3">
            {lekyniemContent.interdisciplinary.departments.map((dept, index) => {
              const isActive = activeDept === dept.id;
              const icons = [Cpu, Database, Briefcase, Palette];
              const IconComp = icons[index % icons.length];

              return (
                <div
                  key={dept.id}
                  onClick={() => setActiveDept(dept.id)}
                  className={`cursor-pointer border p-4 rounded-xs transition-all ${
                    isActive
                      ? 'border-[#990012] bg-[#FAF5F0] shadow-2xs'
                      : 'border-stone-300 bg-[#FAF7F2] hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xs shrink-0 ${isActive ? 'bg-[#990012] text-white' : 'bg-stone-200 text-stone-700'}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-semibold text-base ${isActive ? 'text-[#990012]' : 'text-stone-900'}`}>
                          {dept.name}
                        </h3>
                        <span className="text-[11px] font-mono text-stone-500">NHÁNH 0{index + 1}</span>
                      </div>
                      <p className="text-sm text-stone-700 leading-relaxed font-normal">
                        {dept.contribution}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cột phải: Sơ đồ trực quan các sợi nối kéo về BrandFlow */}
          <div className="lg:col-span-5 border border-stone-300 rounded-xs bg-[#FAF7F2] p-6 flex flex-col items-center justify-center relative min-h-[320px]">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-stone-400">SƠ ĐỒ HỘI TỤ LIÊN NGÀNH</div>

            <svg viewBox="0 0 320 280" className="w-full h-auto select-none max-w-[280px]">
              {/* 4 nút góc đại diện cho 4 ngành */}
              {[
                { id: 'cntt', x: 40, y: 40, label: 'CNTT' },
                { id: 'httt', x: 280, y: 40, label: 'HTTT' },
                { id: 'qtkd', x: 40, y: 240, label: 'QTKD' },
                { id: 'tkcn', x: 280, y: 240, label: 'Thiết kế' }
              ].map((point) => {
                const isCurrent = activeDept === point.id;
                return (
                  <g key={point.id}>
                    {/* Sợi nối mảnh kéo về tâm (160, 140) */}
                    <line
                      x1={point.x}
                      y1={point.y}
                      x2={160}
                      y2={140}
                      stroke={isCurrent ? '#990012' : '#CBD5E1'}
                      strokeWidth={isCurrent ? '2' : '1'}
                      strokeDasharray={isCurrent ? 'none' : '3 2'}
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isCurrent ? 10 : 8}
                      fill={isCurrent ? '#990012' : '#E2E8F0'}
                      stroke="#78716C"
                      strokeWidth="1.5"
                    />
                    <text
                      x={point.x}
                      y={point.y + (point.y < 140 ? -14 : 20)}
                      textAnchor="middle"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                      fill={isCurrent ? '#990012' : '#57534E'}
                    >
                      {point.label}
                    </text>
                  </g>
                );
              })}

              {/* Điểm hội tụ ở giữa: BrandFlow */}
              <circle
                cx={160}
                cy={140}
                r={26}
                fill="#1C1917"
                stroke="#0E7490"
                strokeWidth="2.5"
              />
              <circle
                cx={160}
                cy={140}
                r={32}
                fill="none"
                stroke="#0E7490"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <text
                x={160}
                y={144}
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="#FFFFFF"
                fontFamily="sans-serif"
              >
                BrandFlow
              </text>
            </svg>

            <div className="mt-4 text-center">
              <span className="inline-block px-3 py-1 bg-stone-900 text-stone-100 rounded-xs text-xs font-mono">
                {lekyniemContent.interdisciplinary.convergencePoint}
              </span>
              <p className="text-xs text-stone-500 mt-1">
                Các chuyên ngành kỹ thuật và quản trị cùng kiến tạo một giải pháp chung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. KHOANG KẾT QUẢ (4 CON SỐ LỚN KÈM NGUỒN VÀ THỜI ĐIỂM)
      ───────────────────────────────────────────────────────────── */}
      <section id="sec-outcomes" className="py-16 px-4 sm:px-8 border-b border-stone-300 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-1">MỤC 05 // KIỂM CHỨNG THỰC TẾ</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {lekyniemContent.outcomes.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-1">
            {lekyniemContent.outcomes.subtitle}
          </p>
        </div>

        {/* 4 Thẻ chỉ số lớn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lekyniemContent.outcomes.metrics.map((item, idx) => (
            <div
              key={item.id}
              className="border border-stone-300 rounded-xs bg-[#FAF7F2] p-5 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Số thứ tự góc thẻ */}
              <div className="absolute top-2 right-2 text-[10px] font-mono text-stone-400">CHỈ SỐ 0{idx + 1}</div>

              <div>
                {/* Con số lớn */}
                <div className="text-4xl sm:text-5xl font-bold font-mono text-stone-900 tracking-tight flex items-baseline">
                  <span>{item.value}</span>
                  {item.unit && <span className="text-xl text-stone-600 font-sans ml-1">{item.unit}</span>}
                </div>

                {/* Tiêu đề chỉ số */}
                <h3 className="font-semibold text-base text-stone-900 mt-3 leading-snug">
                  {item.title}
                </h3>

                {/* Mô tả chi tiết */}
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Nguồn và thời điểm (bắt buộc) */}
              <div className="mt-5 pt-3 border-t border-stone-200 text-[11px] font-mono text-stone-500 space-y-0.5">
                <div>Nguồn: {item.source}</div>
                <div>Thời điểm: {item.timestamp}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Ghi chú về đối tác đề xuất */}
        <div className="mt-4 p-3 border border-stone-200 bg-stone-100/50 rounded-xs text-xs text-stone-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
            <span>
              {lekyniemContent.outcomes.allowNamingPartners
                ? `Đối tác ghi nhận: ${lekyniemContent.outcomes.partnerNames.partnerA} và ${lekyniemContent.outcomes.partnerNames.partnerB}`
                : `Hai đối tác ghi nhận ẩn danh theo thỏa thuận: ${lekyniemContent.outcomes.partnerNames.anonymousDescription}.`}
            </span>
          </div>
          <span className="text-[11px] font-mono text-stone-400">REF: PARTNER-MOU-2026</span>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. KHOANG THƯỚC ĐO (HAI THƯỚC ĐO THỜI GIAN)
      ───────────────────────────────────────────────────────────── */}
      <section id="sec-rulers" className="py-16 px-4 sm:px-8 border-b border-stone-300 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-1">MỤC 06 // SO SÁNH HIỆU SUẤT</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {lekyniemContent.rulers.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-1">
            {lekyniemContent.rulers.subtitle}
          </p>
        </div>

        <div className="border border-stone-300 rounded-xs bg-[#FAF7F2] p-6 sm:p-8 space-y-8">
          {/* Thước dài: Cách làm truyền thống (2 đến 4 tuần) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-stone-400" />
                <span className="font-semibold text-stone-800 text-sm sm:text-base">
                  {lekyniemContent.rulers.traditional.label}
                </span>
              </div>
              <span className="font-mono font-bold text-lg text-stone-800">
                {lekyniemContent.rulers.traditional.duration}
              </span>
            </div>

            {/* Thước đo kỹ thuật mô phỏng thanh dài */}
            <div className="relative">
              <div className="h-6 w-full bg-stone-200 rounded-xs border border-stone-300 overflow-hidden relative flex items-center px-2">
                {/* Các vạch chia milimet */}
                <div className="absolute inset-0 flex justify-between px-1 opacity-40 pointer-events-none">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} className={`w-[1px] bg-stone-500 ${i % 7 === 0 ? 'h-full' : 'h-2 self-end'}`} />
                  ))}
                </div>
                <span className="text-[11px] font-mono text-stone-600 relative z-10">100% thời lượng truyền thống (họp, khảo sát, duyệt nhiều cấp)</span>
              </div>
            </div>
            <p className="text-xs text-stone-500">{lekyniemContent.rulers.traditional.details}</p>
          </div>

          {/* Phân cách mảnh */}
          <div className="h-[1px] bg-stone-300 w-full" />

          {/* Thước ngắn: BrandFlow (khoảng 8 phút) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#990012]" />
                <span className="font-semibold text-[#990012] text-sm sm:text-base">
                  {lekyniemContent.rulers.brandflow.label}
                </span>
              </div>
              <span className="font-mono font-bold text-lg text-[#990012]">
                {lekyniemContent.rulers.brandflow.duration}
              </span>
            </div>

            {/* Thước đo kỹ thuật mô phỏng thanh ngắn (vẽ theo tỉ lệ tượng trưng) */}
            <div className="relative">
              <div className="h-6 w-full bg-stone-100 rounded-xs border border-stone-300 overflow-hidden relative flex items-center">
                <motion.div
                  className="h-full bg-[#990012] text-white flex items-center px-2 text-[11px] font-mono whitespace-nowrap overflow-hidden"
                  initial={{ width: '0%' }}
                  whileInView={{ width: '12%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                >
                  ~8 phút
                </motion.div>
                <span className="ml-3 text-[11px] font-mono text-stone-600">Đa trợ lý trí tuệ nhân tạo phối hợp song song</span>
              </div>
            </div>
            <p className="text-xs text-stone-500">{lekyniemContent.rulers.brandflow.details}</p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. KHOANG HÀNH ĐỘNG (3 NÚT LỚN + NÚT ĐĂNG NHẬP)
      ───────────────────────────────────────────────────────────── */}
      <section id="sec-actions" className="py-16 px-4 sm:px-8 border-b border-stone-300 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-1">MỤC 07 // CỬA VÀO ỨNG DỤNG</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {lekyniemContent.actions.title}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-1">
              {lekyniemContent.actions.subtitle}
            </p>
          </div>

          {/* Nút nhỏ Đăng nhập cho người dùng thật */}
          <Link
            href={lekyniemContent.actions.loginButton.href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-stone-400 rounded-xs bg-[#FAF7F2] hover:bg-stone-200 transition-colors text-stone-800 self-start sm:self-auto"
          >
            <span>{lekyniemContent.actions.loginButton.label}</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
          </Link>
        </div>

        {/* 3 Nút lớn hành động */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Nút 1: Xem các trợ lý tranh luận */}
          <Link
            href={lekyniemContent.actions.primaryButtons.debate.href}
            className="group border border-stone-300 rounded-xs bg-[#FAF7F2] hover:border-[#990012] p-5 flex flex-col justify-between transition-all hover:bg-white hover:shadow-sm"
          >
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xs bg-[#990012]/10 border border-[#990012]/30 flex items-center justify-center text-[#990012]">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-stone-900 group-hover:text-[#990012] transition-colors flex items-center justify-between">
                <span>{lekyniemContent.actions.primaryButtons.debate.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                {lekyniemContent.actions.primaryButtons.debate.description}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-200 text-[11px] font-mono text-stone-500">
              ROUTE: /workspace?stage=1
            </div>
          </Link>

          {/* Nút 2: Thử với doanh nghiệp của bạn */}
          <Link
            href={lekyniemContent.actions.primaryButtons.trial.href}
            className="group border border-stone-300 rounded-xs bg-[#FAF7F2] hover:border-cyan-700 p-5 flex flex-col justify-between transition-all hover:bg-white hover:shadow-sm"
          >
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xs bg-cyan-700/10 border border-cyan-700/30 flex items-center justify-center text-cyan-800">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-stone-900 group-hover:text-cyan-800 transition-colors flex items-center justify-between">
                <span>{lekyniemContent.actions.primaryButtons.trial.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                {lekyniemContent.actions.primaryButtons.trial.description}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-200 text-[11px] font-mono text-stone-500">
              ROUTE: /onboarding (Dữ liệu mẫu Bếp Nhà Mộc)
            </div>
          </Link>

          {/* Nút 3: Xem bản kế hoạch mẫu */}
          <Link
            href={lekyniemContent.actions.primaryButtons.samplePlan.href}
            className="group border border-stone-300 rounded-xs bg-[#FAF7F2] hover:border-amber-700 p-5 flex flex-col justify-between transition-all hover:bg-white hover:shadow-sm"
          >
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xs bg-amber-700/10 border border-amber-700/30 flex items-center justify-center text-amber-800">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors flex items-center justify-between">
                <span>{lekyniemContent.actions.primaryButtons.samplePlan.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed font-normal">
                {lekyniemContent.actions.primaryButtons.samplePlan.description}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-stone-200 text-[11px] font-mono text-stone-500">
              ROUTE: /workspace?stage=2 (Chiến lược 3 chặng)
            </div>
          </Link>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. KHOANG GHI NHẬN (TRI ÂN NHÀ TRƯỜNG & THẦY CÔ)
      ───────────────────────────────────────────────────────────── */}
      <section id="sec-acknowledgements" className="py-16 px-4 sm:px-8 border-b border-stone-300 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-1">MỤC 08 // GHI NHẬN VÀ TRI ÂN</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {lekyniemContent.acknowledgements.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nhóm sinh viên thực hiện */}
          <div className="border border-stone-300 rounded-xs bg-[#FAF7F2] p-5 space-y-4">
            <h3 className="font-semibold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2">
              <Users className="w-4 h-4 text-stone-600" />
              <span>{lekyniemContent.acknowledgements.teamTitle}</span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              {lekyniemContent.acknowledgements.members.map((member, i) => (
                <li key={i} className="flex justify-between items-baseline border-b border-stone-200/50 pb-1.5">
                  <span className="font-medium text-stone-900">{member.name}</span>
                  <span className="text-stone-500 font-mono text-[11px]">{member.department}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Giảng viên hướng dẫn */}
          <div className="border border-stone-300 rounded-xs bg-[#FAF7F2] p-5 space-y-4">
            <h3 className="font-semibold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2">
              <Compass className="w-4 h-4 text-stone-600" />
              <span>{lekyniemContent.acknowledgements.advisorTitle}</span>
            </h3>
            <ul className="space-y-2.5 text-xs">
              {lekyniemContent.acknowledgements.advisors.map((advisor, i) => (
                <li key={i} className="space-y-0.5 border-b border-stone-200/50 pb-1.5">
                  <div className="font-medium text-stone-900">{advisor.name}</div>
                  <div className="text-stone-500 font-mono text-[11px]">{advisor.title} — {advisor.department}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Đơn vị đồng hành & Lời tri ân */}
          <div className="border border-stone-300 rounded-xs bg-[#FAF7F2] p-5 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-2">
                <Briefcase className="w-4 h-4 text-stone-600" />
                <span>{lekyniemContent.acknowledgements.partnerTitle}</span>
              </h3>
              <ul className="space-y-1.5 text-xs mt-2">
                {lekyniemContent.acknowledgements.partners.map((partner, i) => (
                  <li key={i} className="text-stone-700">
                    <span className="font-medium">{partner.name}</span> — {partner.role}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lời cảm ơn nhà trường */}
            <div className="bg-stone-100 p-3 rounded-xs text-xs text-stone-700 italic border-l-2 border-[#990012] leading-relaxed">
              "{lekyniemContent.acknowledgements.gratitudeText}"
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. CHÂN TRANG (MÃ QR & NHÃN "DỮ LIỆU MINH HỌA")
      ───────────────────────────────────────────────────────────── */}
      <footer className="py-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border border-stone-300 rounded-xs bg-[#FAF7F2] p-6 sm:p-8">
          {/* Cột trái: Mã QR vào bản thử */}
          <div className="md:col-span-4 flex items-center gap-4">
            <div className="bg-white p-2 border border-stone-300 rounded-xs shrink-0 shadow-2xs">
              <QRCodeSVG
                value={lekyniemContent.footer.qrUrl}
                size={96}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#1C1917"
              />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-semibold text-stone-900">
                {lekyniemContent.footer.qrNotice}
              </div>
              <div className="text-xs font-mono text-cyan-800 underline">
                {lekyniemContent.footer.websiteLabel}
              </div>
              <div className="text-[11px] font-mono text-stone-500">
                Tương thích mọi thiết bị di động
              </div>
            </div>
          </div>

          {/* Cột giữa: Nhãn bắt buộc "DỮ LIỆU MINH HỌA" */}
          <div className="md:col-span-4 flex flex-col items-start md:items-center justify-center">
            <div className="border border-dashed border-stone-400 bg-stone-100 px-3 py-1.5 rounded-xs text-xs font-mono text-stone-700 text-center">
              <span className="font-semibold text-[#990012]">[{lekyniemContent.footer.sampleDataNotice}]</span>
              <div className="text-[10px] text-stone-500 mt-0.5">Áp dụng cho mọi vị trí dùng số mẫu và đối tác ẩn danh</div>
            </div>
          </div>

          {/* Cột phải: Bản quyền & thông tin phiên bản */}
          <div className="md:col-span-4 text-left md:text-right text-xs font-mono text-stone-500 space-y-1">
            <div>{lekyniemContent.footer.copyright}</div>
            <div>PHIÊN BẢN TRƯNG BÀY SỰ KIỆN: 70.0-RELEASE</div>
            <div className="text-[10px] text-stone-400">KIẾN TRÚC BẢN VẼ KỸ THUẬT // NỀN GIẤY NGÀ</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
