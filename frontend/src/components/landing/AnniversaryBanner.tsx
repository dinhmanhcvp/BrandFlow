'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { lekyniemContent } from '@/content/lekyniem';

export default function AnniversaryBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('bk70_banner_dismissed');
    if (isDismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('bk70_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Thông báo sự kiện Bách khoa 70 năm" 
      className="relative z-50 bg-[#FBF9F4] text-[#1C1917] border-b border-[#E7E5E4] px-4 py-2 text-xs md:text-sm font-sans"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(153, 0, 18, 0.04), rgba(217, 119, 6, 0.04))'
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* Logo 70 năm */}
          <div className="relative w-6 h-6 shrink-0">
            <Image
              src={lekyniemContent.header.anniversaryLogoSrc}
              alt="Biểu trưng 70 năm Bách khoa"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <p className="font-medium text-stone-800 leading-snug">
            <span className="font-semibold text-[#990012]">Kỷ niệm 70 năm ĐHBK Hà Nội (1956 — 2026)</span>
            <span className="hidden sm:inline"> và Lễ khánh thành Không gian ĐMST liên ngành.</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/?trungbay=1"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#990012] text-white hover:bg-[#7E000F] transition-colors text-xs font-medium tracking-wide shadow-xs"
          >
            <span>Khu vực trưng bày</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleDismiss}
            aria-label="Đóng dải thông báo"
            className="p-1 text-stone-400 hover:text-stone-700 transition-colors rounded hover:bg-stone-200/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
