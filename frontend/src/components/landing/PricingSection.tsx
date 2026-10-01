"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PricingSection() {
  const { t } = useLanguage();

  const TIERS = [
    {
      name: t('landing_pricing.tier1_name'),
      price: t('landing_pricing.tier1_price'),
      description: t('landing_pricing.tier1_desc'),
      features: [
        t('landing_pricing.tier1_f1'),
        t('landing_pricing.tier1_f2'),
        t('landing_pricing.tier1_f3'),
        t('landing_pricing.tier1_f4')
      ],
      cta: t('landing_pricing.tier1_cta'),
      link: "/onboarding",
      popular: false,
      accent: "text-slate-400",
      checkColor: "text-slate-400"
    },
    {
      name: t('landing_pricing.tier2_name'),
      price: t('landing_pricing.tier2_price'),
      period: t('landing_pricing.tier2_period'),
      description: t('landing_pricing.tier2_desc'),
      features: [
        t('landing_pricing.tier2_f1'),
        t('landing_pricing.tier2_f2'),
        t('landing_pricing.tier2_f3'),
        t('landing_pricing.tier2_f4'),
        t('landing_pricing.tier2_f5')
      ],
      cta: t('landing_pricing.tier2_cta'),
      link: "/onboarding",
      popular: true,
      accent: "text-cyan-400",
      checkColor: "text-cyan-400"
    },
    {
      name: t('landing_pricing.tier3_name'),
      price: t('landing_pricing.tier3_price'),
      description: t('landing_pricing.tier3_desc'),
      features: [
        t('landing_pricing.tier3_f1'),
        t('landing_pricing.tier3_f2'),
        t('landing_pricing.tier3_f3'),
        t('landing_pricing.tier3_f4')
      ],
      cta: t('landing_pricing.tier3_cta'),
      link: "#",
      popular: false,
      accent: "text-indigo-400",
      checkColor: "text-indigo-400"
    }
  ];

  return (
    <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 relative">
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            {t('landing_pricing.title')}
          </h2>
          <p className="text-linear-text-muted text-lg max-w-2xl mx-auto">
            {t('landing_pricing.desc')}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {TIERS.map((tier, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`bento-card flex flex-col transition-all duration-300 ${
              tier.popular 
                ? 'border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.12)] relative md:scale-105 z-10 card-hover-lift' 
                : 'hover:-translate-y-1 opacity-90 hover:opacity-100'
            }`}
          >
            {tier.popular && (
              <>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] whitespace-nowrap">
                    {t('landing_pricing.tier2_badge')}
                  </span>
                </div>
                {/* Inner glow overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-blue-500/3 pointer-events-none rounded-2xl" />
                {/* Top accent line */}
                <div className="absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent rounded-full" />
              </>
            )}

            <div className="mb-8 relative z-10">
              <h3 className={`text-xl font-bold mb-2 ${tier.popular ? 'text-foreground' : 'text-foreground/80'}`}>{tier.name}</h3>
              <p className="text-sm text-linear-text-muted h-10">{tier.description}</p>
            </div>
            
            <div className="mb-8 relative z-10">
              <div className="flex items-end">
                <span className={`text-4xl font-black ${tier.popular ? 'text-foreground' : 'text-foreground/80'}`}>{tier.price}</span>
                {tier.period && <span className="text-linear-text-muted ml-1 mb-1">{tier.period}</span>}
              </div>
            </div>

            {/* Feature list with grouped visual */}
            <div className="relative z-10 mb-8 flex-1">
              <div className="p-4 rounded-xl bg-linear-surface/30 border border-linear-border/30">
                <ul className="space-y-3">
                  {tier.features.map((feat, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className={`w-4.5 h-4.5 mr-3 shrink-0 mt-0.5 ${tier.checkColor}`} />
                      <span className="text-sm text-linear-text-muted">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href={tier.link} className="w-full relative z-10">
              <button 
                className={`w-full py-3.5 rounded-xl font-semibold transition-all group overflow-hidden relative flex items-center justify-center gap-2 ${
                  tier.popular 
                  ? 'gradient-ai-bg shadow-lg shadow-cyan-500/20 text-white btn-shine' 
                  : 'bg-transparent border ultra-thin-border text-foreground hover:bg-linear-surface/80 hover:border-cyan-500/20'
                }`}
              >
                <span className="relative z-10">{tier.cta}</span>
                {tier.popular && <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
