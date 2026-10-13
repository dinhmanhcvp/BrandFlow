"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { DebateTurn, StanceType } from './debateTypes';

interface DebateSpeechCardProps {
  currentTurn: DebateTurn;
  isShowcase: boolean;
  isPaused: boolean;
  shouldReduceMotion: boolean;
  getStanceBadge: (stance: StanceType) => React.ReactNode;
}

export const DebateSpeechCard = React.memo(function DebateSpeechCard({
  currentTurn,
  isShowcase,
  isPaused,
  shouldReduceMotion,
  getStanceBadge
}: DebateSpeechCardProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(true);
  const [thinkingMessage, setThinkingMessage] = useState('');

  const thinkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fullTextRef = useRef<string>('');
  const charIndexRef = useRef<number>(0);

  const getAgentThinkingMessage = (speaker?: string) => {
    switch (speaker) {
      case 'strategy':
        return 'Trợ lý chiến lược đang phân tích dung lượng thị trường F&B & đối thủ Cloud Kitchen...';
      case 'finance':
        return 'Trợ lý tài chính đang rà soát điểm hòa vốn, biên lợi nhuận ròng 8.4% & chiết khấu App 25%...';
      case 'customer':
        return 'Trợ lý góc nhìn khách hàng đang bóc tách hành vi đặt cơm trưa văn phòng & khảo sát thực tế...';
      case 'operations':
        return 'Trợ lý vận hành đang đối chiếu công suất bếp 120 suất/giờ & năng lực giao hàng 2 chi nhánh...';
      case 'decider':
        return 'Người quyết định đang tổng hợp ý kiến Hội đồng và phê duyệt nghị quyết cuối cùng...';
      default:
        return 'Công cụ tính toán tài chính đang thẩm định số liệu...';
    }
  };

  const clearAllTimers = () => {
    if (thinkTimerRef.current) {
      clearTimeout(thinkTimerRef.current);
      thinkTimerRef.current = null;
    }
    if (typeTimerRef.current) {
      clearInterval(typeTimerRef.current);
      typeTimerRef.current = null;
    }
  };

  useEffect(() => {
    clearAllTimers();

    if (!currentTurn) return;

    fullTextRef.current = currentTurn.message || '';
    charIndexRef.current = 0;
    setDisplayedText('');
    setIsThinking(true);
    setIsTyping(false);
    setThinkingMessage(getAgentThinkingMessage(currentTurn.speaker));

    // Reduced motion preference: immediate display, no typewriter
    if (shouldReduceMotion) {
      setIsThinking(false);
      setDisplayedText(fullTextRef.current);
      return;
    }

    // 800ms AI Thinking delay before speech starts
    thinkTimerRef.current = setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);

      const targetText = fullTextRef.current;
      typeTimerRef.current = setInterval(() => {
        if (charIndexRef.current < targetText.length) {
          charIndexRef.current += 1;
          setDisplayedText(targetText.slice(0, charIndexRef.current));
        } else {
          if (typeTimerRef.current) {
            clearInterval(typeTimerRef.current);
            typeTimerRef.current = null;
          }
          setIsTyping(false);
        }
      }, 20);
    }, 800);

    return () => {
      clearAllTimers();
    };
  }, [currentTurn.id, currentTurn.speaker, currentTurn.message, shouldReduceMotion]);

  // Handle Pause / Resume cleanly
  useEffect(() => {
    if (isPaused) {
      if (typeTimerRef.current) {
        clearInterval(typeTimerRef.current);
        typeTimerRef.current = null;
      }
    } else {
      if (isTyping && charIndexRef.current < fullTextRef.current.length && !typeTimerRef.current) {
        const targetText = fullTextRef.current;
        typeTimerRef.current = setInterval(() => {
          if (charIndexRef.current < targetText.length) {
            charIndexRef.current += 1;
            setDisplayedText(targetText.slice(0, charIndexRef.current));
          } else {
            if (typeTimerRef.current) {
              clearInterval(typeTimerRef.current);
              typeTimerRef.current = null;
            }
            setIsTyping(false);
          }
        }, 20);
      }
    }
  }, [isPaused, isTyping]);

  return (
    <motion.div 
      key={currentTurn.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white dark:bg-slate-900 border-2 border-cyan-500/40 dark:border-cyan-500/30 p-5 rounded-3xl shadow-xl relative overflow-hidden"
    >
      {/* Header: Speaker info & stance badge */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
            {currentTurn.speakerName}
          </span>
          <span className="text-xs text-slate-500 font-medium">({currentTurn.speakerTitle})</span>
        </div>
        <div>
          {getStanceBadge(currentTurn.stance)}
        </div>
      </div>

      {/* Stable fixed-height message container: completely prevents layout shift / jitter */}
      <div className="min-h-[105px] md:min-h-[115px] flex flex-col justify-center">
        {isThinking ? (
          <div className="flex items-center gap-3 py-3 text-cyan-700 dark:text-cyan-400 font-semibold text-sm md:text-base animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-500 shrink-0" />
            <span className="line-clamp-2">{thinkingMessage || 'AI đang suy nghĩ và đối chiếu dữ liệu...'}</span>
          </div>
        ) : (
          <p className={`${isShowcase ? 'text-lg md:text-xl' : 'text-base md:text-lg'} font-medium leading-relaxed text-slate-800 dark:text-slate-100 select-none`}>
            “{displayedText}”
            {isTyping && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-500 rounded-full animate-pulse align-middle" />
            )}
          </p>
        )}
      </div>

      {/* Direct Impact Notice */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          Tác động trực tiếp lên mục: <strong className="text-slate-800 dark:text-slate-200">{currentTurn.targetFieldLabel}</strong>
        </span>
        <span className="font-mono text-cyan-700 dark:text-cyan-400 font-bold">
          Lời nói tạo ra hệ quả số liệu ➔
        </span>
      </div>
    </motion.div>
  );
});

export default DebateSpeechCard;
