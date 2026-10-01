import React, { useState } from 'react';
import { Lightbulb, Info, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface RationaleTooltipProps {
  rationale: string;
  children: React.ReactNode;
}

export function RationaleTooltip({ rationale, children }: RationaleTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="inline-flex items-center gap-1 group relative">
      {children}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-linear-text-muted hover:text-emerald-400 transition-colors ml-1 p-0.5 rounded-full hover:bg-emerald-400/10 focus:outline-none"
        title="Tại sao AI đề xuất điều này?"
      >
        <Lightbulb className="w-4 h-4" />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-linear-background border border-emerald-500/30 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative"
          >
            {/* Ambient background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none" />

            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/10 p-4 border-b border-emerald-500/20 flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">AI Rationale</h4>
                  <p className="text-emerald-400 text-xs font-mono">Giải thích từ Hệ thống Hoạch định</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4 relative z-10">
              <div>
                <h5 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-500" />
                  Cơ sở đề xuất
                </h5>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  {rationale}
                </p>
              </div>
            </div>
            
            <div className="bg-black/40 p-3 text-center text-xs text-slate-500 border-t border-white/5 flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-emerald-500/50" />
              Powered by BrandFlow AI - Dữ liệu nội bộ Bếp Nhà Mộc
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
