import React, { useState } from 'react';
import { Lightbulb, Info, X, Sparkles, BookOpen, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface RationaleTooltipProps {
 rationale: string;
 type?: 'rationale' | 'source';
 children: React.ReactNode;
}

export function RationaleTooltip({ rationale, type = 'rationale', children }: RationaleTooltipProps) {
 const [isOpen, setIsOpen] = useState(false);
 const isSource = type === 'source';

 return (
  <div className="inline-flex items-center gap-1 group relative">
   {children}
   <button 
    onClick={() => setIsOpen(true)}
    className={`text-linear-text-muted transition-colors ml-1 p-0.5 rounded-full focus:outline-none ${isSource ? 'hover:text-amber-400 hover:bg-amber-400/10' : 'hover:text-emerald-400 hover:bg-emerald-400/10'}`}
    title={isSource ? "Xem trích dẫn gốc" : "Tại sao AI đề xuất điều này?"}
   >
    {isSource ? <BookOpen className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
   </button>

   {isOpen && typeof document !== 'undefined' && createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
     <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      onClick={(e) => e.stopPropagation()}
      className={`bg-linear-background border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative ${isSource ? 'border-amber-500/30' : 'border-emerald-500/30'}`}
     >
      {/* Ambient background glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[60px] rounded-full pointer-events-none ${isSource ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`} />

      <div className={`p-4 border-b flex justify-between items-start relative z-10 ${isSource ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-amber-500/20' : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border-emerald-500/20'}`}>
       <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${isSource ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
         {isSource ? <Quote className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </div>
        <div>
         <h4 className="font-bold text-white text-lg">{isSource ? "Trích dẫn Dữ liệu" : "AI Rationale"}</h4>
         <p className={`text-xs font-mono ${isSource ? 'text-amber-400' : 'text-emerald-400'}`}>
          {isSource ? "Phân tích từ thông tin gốc" : "Giải thích từ Hệ thống Hoạch định"}
         </p>
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
        <h5 className={`text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2 ${isSource ? 'text-amber-400' : 'text-emerald-500'}`}>
         {isSource ? <BookOpen className="w-4 h-4" /> : <Info className="w-4 h-4" />}
         {isSource ? "Trích đoạn & Phân tích" : "Cơ sở đề xuất & Lập luận (Rationale)"}
        </h5>
        <div className="text-sm text-slate-300 leading-relaxed font-light space-y-3">
         {rationale.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
         ))}
        </div>
       </div>
      </div>
      
      <div className="bg-black/40 p-3 text-center text-xs text-slate-500 border-t border-white/5 flex items-center justify-center gap-2">
       {isSource ? <Quote className="w-3 h-3 text-amber-500/50" /> : <Sparkles className="w-3 h-3 text-emerald-500/50" />}
       Powered by BrandFlow Strategic AI
      </div>
     </motion.div>
    </div>,
    document.body
   )}
  </div>
 );
}
