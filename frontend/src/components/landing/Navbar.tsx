"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { BrandFlowLogo } from '@/components/brand/BrandFlowLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const { t, language, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#services', label: t('landing_nav.services') },
    { href: '#pricing', label: t('landing_nav.pricing') },
    { href: '#about', label: t('landing_nav.about') },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-slate-50/80 dark:bg-[#0B1120]/80 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-black/30 border-b border-linear-border/50'
          : 'bg-slate-50/50 dark:bg-[#0B1120]/50 backdrop-blur-lg border-b ultra-thin-border'
      }`}>
        {/* Gradient accent line at very top */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent opacity-60" />

        <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'h-16' : 'h-20'
        }`}>
          <Link href="/" className="flex items-center space-x-3 group">
            <BrandFlowLogo className={`transition-all duration-500 ${scrolled ? 'w-8 h-8' : 'w-10 h-10'}`} />
            <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-cyan-500">
              Brand<span className="text-cyan-500">F</span>low
            </span>
          </Link>
   
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-sm font-medium text-linear-text-muted hover:text-foreground transition-colors nav-link-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden sm:flex bg-background/50 rounded-full p-1 border ultra-thin-border h-9 items-center">
              <button 
                onClick={toggleLanguage}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center ${language === 'en' ? "bg-linear-surface text-cyan-400 shadow-sm border border-cyan-500/20" : "text-linear-text-muted hover:text-foreground"}`}
              >🇺🇸 EN</button>
              <button 
                onClick={toggleLanguage}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center ${language === 'vi' ? "bg-linear-surface text-cyan-400 shadow-sm border border-cyan-500/20" : "text-linear-text-muted hover:text-foreground"}`}
              >🇻🇳 VI</button>
            </div>
            <ThemeToggle />
            <Link href="/login" className="text-sm font-medium text-foreground hover:text-blue-600 transition-colors hidden sm:block">
              {t('landing_nav.login')}
            </Link>
            <Link href="/login">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex items-center px-5 py-2.5 rounded-full gradient-ai-bg text-sm font-semibold btn-shine"
              >
                {t('landing_nav.start_free')} <ArrowRight className="w-4 h-4 ml-2" />
              </motion.button>
            </Link>

            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-linear-surface transition-colors text-foreground"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" 
              onClick={() => setMobileOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              className="fixed top-20 left-4 right-4 bg-linear-surface/95 backdrop-blur-2xl border border-linear-border/50 rounded-2xl p-6 z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setMobileOpen(false)}
                    className="text-base font-medium text-foreground hover:text-cyan-500 transition-colors py-2 border-b border-linear-border/30 last:border-0"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <button className="w-full py-3 rounded-xl gradient-ai-bg text-sm font-semibold btn-shine mt-2">
                    {t('landing_nav.start_free')} <ArrowRight className="w-4 h-4 ml-1 inline" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
