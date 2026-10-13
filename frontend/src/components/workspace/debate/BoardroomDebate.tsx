"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  CheckCircle2, AlertTriangle, ArrowRight, Play, Pause, RefreshCw, 
  RotateCcw, ShieldCheck, ChevronRight, Calculator, FileCheck, 
  QrCode, Layers, ArrowLeft
} from 'lucide-react';
import { DebateTurn, IndustryScenario, TargetFieldKey, StanceType } from './debateTypes';
import { SHOWCASE_SCENARIOS } from './showcaseScenarios';
import { convertRealLogsToDebateTurns, getScenario } from './debateAdapter';

interface BoardroomDebateProps {
  onNext?: () => void;
  onBack?: () => void;
  realLogs?: Array<{ agent: string; message: string; role?: string }>;
  forceShowcaseMode?: boolean;
}

export default function BoardroomDebate({
  onNext,
  onBack,
  realLogs,
  forceShowcaseMode = false
}: BoardroomDebateProps) {
  const shouldReduceMotion = useReducedMotion();

  // ── URL & Display Mode Detection ──
  const [isShowcase, setIsShowcase] = useState(forceShowcaseMode);
  const [selectedIndustryKey, setSelectedIndustryKey] = useState<string>('bep_nha_moc');
  const [isPaused, setIsPaused] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Typewriter & AI Thinking effect state
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(true);
  const [thinkingMessage, setThinkingMessage] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [isTransitioningNext, setIsTransitioningNext] = useState(false);

  // 60-second Touch Idle Timer for showcase display
  const lastTouchTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('trungbay') === '1' || params.get('showcase') === '1') {
        setIsShowcase(true);
      }
    }
  }, []);

  // ── Scenarios & Turns Resolution ──
  const activeScenario: IndustryScenario = useMemo(() => {
    return getScenario(selectedIndustryKey);
  }, [selectedIndustryKey]);

  const turns: DebateTurn[] = useMemo(() => {
    // Luôn ưu tiên bản mock Bếp Nhà Mộc chi tiết, chuyên nghiệp theo chỉ thị
    return activeScenario.turns;
  }, [activeScenario]);

  const currentTurn = turns[currentTurnIndex] || turns[0];

  // Helper để sinh thông điệp suy nghĩ AI theo vai trò
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

  // ── Plan Sheet Accumulator ──
  const planState = useMemo(() => {
    const fields: Record<TargetFieldKey, { label: string; value: string; oldValue?: string; isAgreed: boolean }> = {
      budget: { label: 'Tổng ngân sách', value: activeScenario.initialPlan.budget, isAgreed: false },
      channels: { label: 'Kênh tiếp cận', value: activeScenario.initialPlan.channels, isAgreed: false },
      timeline: { label: 'Thời gian', value: activeScenario.initialPlan.timeline, isAgreed: false },
      operations: { label: 'Công suất vận hành', value: activeScenario.initialPlan.operations, isAgreed: false },
      pricing: { label: 'Chính sách ưu đãi', value: activeScenario.initialPlan.pricing, isAgreed: false }
    };

    // Apply modifications up to current turn
    for (let i = 0; i <= currentTurnIndex && i < turns.length; i++) {
      const t = turns[i];
      if (t.targetField && fields[t.targetField]) {
        if (t.oldValue) fields[t.targetField].oldValue = t.oldValue;
        if (t.newValue) fields[t.targetField].value = t.newValue;
        if (t.stance === 'agree' || i === turns.length - 1) {
          fields[t.targetField].isAgreed = true;
        }
      }
    }

    return fields;
  }, [turns, currentTurnIndex, activeScenario]);

  // ── Decisions History Accumulator ──
  const savedDecisions = useMemo(() => {
    const list = [];
    for (let i = 0; i <= currentTurnIndex && i < turns.length; i++) {
      if (turns[i]?.decisionSaved) {
        list.push(turns[i].decisionSaved!);
      }
    }
    return list;
  }, [turns, currentTurnIndex]);

  // ── AI Thinking & Typing Effect Simulation ──
  useEffect(() => {
    if (!currentTurn) return;

    setDisplayedText('');
    setIsThinking(true);
    setIsTyping(false);
    setIsCalculating(true);
    setThinkingMessage(getAgentThinkingMessage(currentTurn.speaker));

    // Simulated AI Thinking Delay: 1200ms trước khi bắt đầu nói
    const thinkTimer = setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);

      const fullText = currentTurn.message;
      let charIndex = 0;

      // Typewriter interval (~33 chars / sec)
      const intervalTime = 30;
      const typeTimer = setInterval(() => {
        if (charIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeTimer);
          setIsTyping(false);
        }
      }, intervalTime);

      return () => clearInterval(typeTimer);
    }, 1200);

    // Calculate delay: thinking before financial check resolves (2200ms)
    const calcTimer = setTimeout(() => {
      setIsCalculating(false);
    }, 2200);

    return () => {
      clearTimeout(thinkTimer);
      clearTimeout(calcTimer);
    };
  }, [currentTurnIndex, currentTurn]);

  // ── Step Auto-Advance (Minimum 6s per turn including thinking) ──
  useEffect(() => {
    if (isPaused || isFinished) return;

    const turnHoldMs = ((currentTurn?.durationSeconds || 5) + 1.8) * 1000;

    const nextTimeout = setTimeout(() => {
      if (currentTurnIndex < turns.length - 1) {
        setCurrentTurnIndex(prev => prev + 1);
      } else {
        setIsFinished(true);

        // In showcase mode: after 10s on final screen, auto-loop
        if (isShowcase) {
          setTimeout(() => {
            handleResetLoop();
          }, 10000);
        }
      }
    }, turnHoldMs);

    return () => clearTimeout(nextTimeout);
  }, [currentTurnIndex, turns.length, isPaused, isFinished, isShowcase, currentTurn]);

  // ── Touch Activity Watcher (60s Idle Reset) ──
  const registerTouchActivity = () => {
    lastTouchTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (!isShowcase) return;

    const idleChecker = setInterval(() => {
      const now = Date.now();
      if (now - lastTouchTimeRef.current > 60000) {
        // Idle 60s -> reset to default scenario loop
        setSelectedIndustryKey('bep_nha_moc');
        handleResetLoop();
        lastTouchTimeRef.current = Date.now();
      }
    }, 5000);

    return () => clearInterval(idleChecker);
  }, [isShowcase]);

  const handleResetLoop = () => {
    setCurrentTurnIndex(0);
    setIsFinished(false);
    setIsPaused(false);
  };

  const handleSelectIndustry = (key: string) => {
    registerTouchActivity();
    setSelectedIndustryKey(key);
    handleResetLoop();
  };

  // ── Easing curve ──
  const transitionEasing = [0.22, 1, 0.36, 1] as const;

  // ── Geometric Agent Metadata ──
  const AGENT_LIST = [
    {
      key: 'strategy',
      title: 'Trợ lý chiến lược',
      subtitle: 'Thị trường & Kênh',
      shape: 'diamond',
      colorToken: '#2563EB',
      textColor: 'text-blue-700 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      borderColor: 'border-blue-400 dark:border-blue-500'
    },
    {
      key: 'finance',
      title: 'Trợ lý tài chính',
      subtitle: 'Dòng tiền & Lợi nhuận',
      shape: 'hexagon',
      colorToken: '#D97706',
      textColor: 'text-amber-800 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      borderColor: 'border-amber-400 dark:border-amber-500'
    },
    {
      key: 'operations',
      title: 'Trợ lý vận hành',
      subtitle: 'Công suất & Năng lực bếp',
      shape: 'octagon',
      colorToken: '#7C3AED',
      textColor: 'text-purple-800 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      borderColor: 'border-purple-400 dark:border-purple-500'
    },
    {
      key: 'customer',
      title: 'Trợ lý khách hàng',
      subtitle: 'Trải nghiệm & Hành vi',
      shape: 'semicircle',
      colorToken: '#0D9488',
      textColor: 'text-teal-800 dark:text-teal-400',
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      borderColor: 'border-teal-400 dark:border-teal-500'
    },
    {
      key: 'decider',
      title: 'Người quyết định',
      subtitle: 'Hội đồng quản trị',
      shape: 'star',
      colorToken: '#E11D48',
      textColor: 'text-rose-800 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      borderColor: 'border-rose-400 dark:border-rose-500'
    }
  ];

  // Helper for rendering pure geometric icons
  const renderGeometricShape = (shape: string, color: string, isActive: boolean) => {
    switch (shape) {
      case 'diamond':
        return (
          <div 
            className="w-5 h-5 rotate-45 transition-transform duration-300" 
            style={{ 
              backgroundColor: isActive ? color : 'transparent',
              border: `2.5px solid ${color}`
            }} 
          />
        );
      case 'hexagon':
        return (
          <div 
            className="w-5 h-5 rounded-xs transition-transform duration-300"
            style={{ 
              backgroundColor: isActive ? color : 'transparent',
              border: `2.5px solid ${color}`,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
            }}
          />
        );
      case 'octagon':
        return (
          <div 
            className="w-5 h-5 rounded-md transition-transform duration-300"
            style={{ 
              backgroundColor: isActive ? color : 'transparent',
              border: `2.5px solid ${color}`
            }}
          />
        );
      case 'semicircle':
        return (
          <div 
            className="w-5 h-3 rounded-t-full transition-transform duration-300"
            style={{ 
              backgroundColor: isActive ? color : 'transparent',
              border: `2.5px solid ${color}`,
              borderBottom: 'none'
            }}
          />
        );
      case 'star':
        return (
          <div 
            className="w-5 h-5 flex items-center justify-center transition-transform duration-300"
            style={{ color: color }}
          >
            <span className="text-xl font-black">✦</span>
          </div>
        );
      default:
        return (
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: color }} 
          />
        );
    }
  };

  const getStanceBadge = (stance: StanceType) => {
    switch (stance) {
      case 'agree':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đồng ý
          </span>
        );
      case 'disagree':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700">
            <AlertTriangle className="w-3.5 h-3.5" /> Phản đối
          </span>
        );
      case 'proposal':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
            <ChevronRight className="w-3.5 h-3.5" /> Đề xuất khác
          </span>
        );
    }
  };

  // Safe area CSS classes when in vertical 9:16 showcase mode
  const showcaseSafeClass = isShowcase 
    ? 'px-6 md:px-16 pt-10 pb-16 max-w-[1080px] min-h-screen select-none' 
    : 'px-4 md:px-8 py-6 max-w-7xl';

  return (
    <div 
      className={`w-full h-full flex flex-col bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-white transition-colors duration-300 relative overflow-x-hidden ${isShowcase ? 'overflow-y-hidden' : 'overflow-y-auto'}`}
      onClick={registerTouchActivity}
      onTouchStart={registerTouchActivity}
    >
      {/* ── Fixed Illustration Watermark Badge (Mandatory) ── */}
      <div className="absolute top-3 right-4 z-50 flex items-center gap-2">
        <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shadow-sm">
          Dữ liệu minh họa
        </span>
        {isShowcase && (
          <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700/60 shadow-sm">
            Showcase 70 Năm ĐHBK
          </span>
        )}
      </div>

      <div className={`mx-auto w-full flex-1 flex flex-col ${showcaseSafeClass}`}>

        {/* ── HEADER SECTION ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 shrink-0 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              {!isShowcase && onBack && (
                <button 
                  onClick={onBack}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors mr-2 cursor-pointer"
                  title="Quay lại"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <span className="text-xs font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                Phiên tranh luận chiến lược
              </span>
              <span className="text-slate-400 dark:text-slate-600 font-bold">•</span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Vòng {currentTurn.round} trên {currentTurn.totalRounds}
              </span>
            </div>

            <h1 className={`${isShowcase ? 'text-2xl md:text-3xl font-black' : 'text-xl md:text-2xl font-black'} tracking-tight text-slate-900 dark:text-white`}>
              {activeScenario.businessName} <span className="text-slate-400 dark:text-slate-500 font-medium text-base">| {activeScenario.name}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
              {activeScenario.tagline}
            </p>
          </div>

          {/* Controls: Industry Switcher (Touch Friendly) & Play/Pause */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* 3 Industry Touch Buttons */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200/80 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs font-bold">
              {Object.values(SHOWCASE_SCENARIOS).map((sc) => {
                const isSelected = sc.id === selectedIndustryKey;
                return (
                  <button
                    key={sc.id}
                    onClick={() => handleSelectIndustry(sc.id)}
                    className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? 'bg-white dark:bg-slate-800 text-cyan-800 dark:text-cyan-300 shadow-sm font-black' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {sc.name.split('&')[0].trim()}
                  </button>
                );
              })}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
              title={isPaused ? 'Tiếp tục phiên tranh luận' : 'Tạm dừng'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-slate-600 dark:text-slate-300" />}
            </button>

            {/* Replay Button */}
            <button
              onClick={handleResetLoop}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm cursor-pointer"
              title="Chạy lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Showcase Mode Toggle */}
            <button
              onClick={() => setIsShowcase(!isShowcase)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isShowcase 
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-sm' 
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
            >
              {isShowcase ? '🖥️ Đang chiếu' : '🖥️ Bật chế độ trưng bày'}
            </button>
          </div>
        </div>

        {/* ── THƯỚC ĐO ĐỒNG THUẬN (CONSENSUS METER) ── */}
        <div className="w-full bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm mb-6 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              Thước đo mức độ đồng thuận chiến lược
            </span>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-sm font-black text-cyan-700 dark:text-cyan-400">
                {currentTurn.consensusLevel}%
              </span>
              <span className="text-xs font-medium text-slate-500">
                {currentTurn.consensusLevel >= 95 ? 'Đạt đồng thuận tuyệt đối' : currentTurn.consensusLevel >= 65 ? 'Đang thu hẹp bất đồng' : 'Bất đồng quan điểm'}
              </span>
            </div>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700/60">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded-full"
              initial={{ width: '20%' }}
              animate={{ width: `${currentTurn.consensusLevel}%` }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: transitionEasing }}
            />
          </div>
        </div>

        {/* ── MAIN BOARDROOM STAGE (Split Layout) ── */}
        {!isFinished ? (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">

            {/* LEFT / CENTER STAGE (Cols 1-8): TỜ KẾ HOẠCH & BÀN CHIẾN LƯỢC */}
            <div className="lg:col-span-8 flex flex-col gap-6">

              {/* 1. AGENTS ROUNDTABLE (Các trợ lý quanh bàn) */}
              <div className="bg-white/95 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-md">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1">
                  Hội đồng Trợ lý AI Tham vấn chiến lược
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {AGENT_LIST.map((agent) => {
                    const isSpeaking = currentTurn.speaker === agent.key;
                    return (
                      <motion.div
                        key={agent.key}
                        animate={{
                          scale: isSpeaking && !shouldReduceMotion ? [1, 1.025, 1] : 1,
                          opacity: isSpeaking ? 1 : 0.55
                        }}
                        transition={{
                          scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                          opacity: { duration: 0.3 }
                        }}
                        className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden ${
                          isSpeaking 
                            ? `${agent.bgColor} ${agent.borderColor} shadow-md ring-2 ring-cyan-500/30` 
                            : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                        }`}
                      >
                        {/* Geometric Shape Icon */}
                        <div className="mb-2 shrink-0">
                          {renderGeometricShape(agent.shape, agent.colorToken, isSpeaking)}
                        </div>

                        {/* Agent Label */}
                        <span className={`text-xs font-black uppercase tracking-tight ${agent.textColor}`}>
                          {agent.title}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {agent.subtitle}
                        </span>

                        {/* Speaking Pulse Badge */}
                        {isSpeaking && (
                          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* 2. THẺ LỜI NÓI CỦA NGƯỜI ĐANG NÓI (Speech Card) */}
              <motion.div 
                key={currentTurn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: transitionEasing }}
                className="bg-white dark:bg-slate-900 border-2 border-cyan-500/40 dark:border-cyan-500/30 p-5 rounded-3xl shadow-xl relative overflow-hidden"
              >
                {/* Visual Connector Wire indication */}
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

                {/* Speech Message (Thinking Delay & Typewriter Effect) */}
                {isThinking ? (
                  <div className="flex items-center gap-3 py-3.5 text-cyan-700 dark:text-cyan-400 font-semibold text-sm md:text-base animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-500 shrink-0" />
                    <span>{thinkingMessage || 'AI đang suy nghĩ và đối chiếu dữ liệu...'}</span>
                  </div>
                ) : (
                  <p className={`${isShowcase ? 'text-lg md:text-xl' : 'text-base md:text-lg'} font-medium leading-relaxed text-slate-800 dark:text-slate-100`}>
                    "{displayedText}"
                    {isTyping && <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-500 animate-pulse" />}
                  </p>
                )}

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

              {/* 3. TỜ KẾ HOẠCH Ở GIỮA (Centerpiece Plan Sheet) */}
              <div className="bg-white dark:bg-slate-900/95 border-2 border-slate-300 dark:border-slate-700 p-6 rounded-3xl shadow-xl flex-1 flex flex-col relative overflow-hidden">
                {/* Stamp effect decoration watermark */}
                <div className="flex items-center justify-between mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Tờ Kế Hoạch Chiến Lược (Bản thảo trực tiếp)
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Mã hồ sơ: #{activeScenario.id.toUpperCase()}-2026
                  </span>
                </div>

                {/* Field List with Strike-through & Modification Highlight */}
                <div className="space-y-3.5 flex-1 justify-center flex flex-col">
                  {Object.entries(planState).map(([key, item]) => {
                    const isTargetField = currentTurn.targetField === key;
                    return (
                      <div 
                        key={key}
                        className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          isTargetField 
                            ? 'bg-cyan-50/70 dark:bg-cyan-950/30 border-cyan-400 dark:border-cyan-500 shadow-sm ring-1 ring-cyan-400' 
                            : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {item.isAgreed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-400 shrink-0" />
                          )}
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 w-36 shrink-0">
                            {item.label}
                          </span>
                        </div>

                        {/* Values with old struck out, new beside */}
                        <div className="flex items-center gap-3 flex-wrap justify-end">
                          {item.oldValue && item.oldValue !== item.value && (
                            <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-medium decoration-rose-500/80">
                              {item.oldValue}
                            </span>
                          )}
                          <span className={`text-sm font-black ${
                            isTargetField 
                              ? 'text-cyan-800 dark:text-cyan-300 bg-cyan-100/60 dark:bg-cyan-900/40 px-2 py-0.5 rounded-md' 
                              : item.isAgreed 
                              ? 'text-emerald-700 dark:text-emerald-400' 
                              : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {item.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT STAGE (Cols 9-12): KHUNG KIỂM TRA TÀI CHÍNH & NHẬT KÝ QUYẾT ĐỊNH */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              {/* 1. KHUNG KIỂM TRA TÀI CHÍNH (Financial Verification Engine) */}
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 p-5 rounded-3xl shadow-xl flex flex-col relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Công Cụ Kiểm Tra Tài Chính
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                    Độc lập
                  </span>
                </div>

                {/* Calculation Status Banner */}
                <div className={`p-3.5 rounded-2xl border mb-4 text-xs font-bold leading-relaxed transition-colors duration-300 ${
                  isCalculating
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 text-blue-800 dark:text-blue-300'
                    : currentTurn.financialCheck.status === 'matched'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-300'
                    : currentTurn.financialCheck.status === 'exceeded'
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-800 dark:text-amber-300'
                }`}>
                  {isCalculating ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" /> Đang kiểm toán dòng tiền...
                    </span>
                  ) : (
                    currentTurn.financialCheck.verificationMessage
                  )}
                </div>

                {/* Financial Indicators: Thu - Chi - Còn lại */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>Doanh thu dự phóng:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {currentTurn.financialCheck.revenue.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span>Chi phí đề xuất:</span>
                    <span className={`font-black ${currentTurn.financialCheck.status === 'exceeded' ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}`}>
                      {currentTurn.financialCheck.expense.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-bold">Số dư ngân sách:</span>
                    <span className={`font-black text-sm ${currentTurn.financialCheck.balance < 0 ? 'text-rose-600' : 'text-emerald-700 dark:text-emerald-400'}`}>
                      {currentTurn.financialCheck.balance.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {/* The "ĐÃ KIỂM" Stamp on Match */}
                {currentTurn.financialCheck.isAudited && !isCalculating && (
                  <motion.div 
                    initial={{ scale: 1.25, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: transitionEasing }}
                    className="mt-4 p-3 rounded-xl border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    ĐÃ KIỂM TOÁN TÀI CHÍNH
                  </motion.div>
                )}

                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3 text-center italic">
                  Con số do công cụ tính toán, không phải AI ước đoán ngẫu nhiên.
                </p>
              </div>

              {/* 2. NHẬT KÝ QUYẾT ĐỊNH (Decision Records Archive) */}
              <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 p-5 rounded-3xl shadow-xl flex-1 flex flex-col min-h-60 overflow-hidden">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-600" />
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                      Nhật Ký Quyết Định
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {savedDecisions.length} mục đã lưu
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 no-scrollbar">
                  <AnimatePresence>
                    {savedDecisions.map((dec) => (
                      <motion.div
                        key={dec.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: transitionEasing }}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs shadow-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{dec.title}</span>
                          <span className="text-[9px] font-mono text-slate-400">{dec.timestamp}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                          {dec.detail}
                        </p>
                        <div className="mt-1.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <span>✓ Đã lưu vào hồ sơ doanh nghiệp</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* ── MÀN KẾT: SO SÁNH PHƯƠNG ÁN BAN ĐẦU VÀ SAU TRANH LUẬN ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: transitionEasing }}
            className="flex-1 bg-white dark:bg-slate-900 border-2 border-emerald-500/40 p-6 md:p-8 rounded-3xl shadow-2xl flex flex-col justify-between"
          >
            <div>
              {/* Header result */}
              <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider mb-2">
                    <CheckCircle2 className="w-4 h-4" /> Đồng thuận hoàn tất
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                    Kết Quả So Sánh Phương Án Chiến Lược
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Tranh luận đa tác nhân đã giúp điều chỉnh phương án ban đầu thành kế hoạch tối ưu, bảo toàn dòng tiền và đảm bảo năng lực vận hành.
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs uppercase font-bold text-slate-400">Hiệu quả kiểm soát chi phí</span>
                  <span className="text-2xl font-black text-emerald-600">Đã tiết kiệm ~30%</span>
                </div>
              </div>

              {/* Side-by-Side Comparison Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Column 1: Phương án ban đầu */}
                <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-rose-200/80 dark:border-rose-900/60 pb-3">
                    <h3 className="text-sm font-black uppercase text-rose-800 dark:text-rose-300 tracking-wider">
                      1. Đề xuất ban đầu (Trước tranh luận)
                    </h3>
                    <span className="text-xs font-bold text-rose-600">Nhiều rủi ro</span>
                  </div>

                  <ul className="space-y-3 text-xs leading-relaxed">
                    <li className="flex justify-between pb-2 border-b border-rose-100 dark:border-rose-900/30">
                      <span className="text-slate-500">Ngân sách dự kiến:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{activeScenario.initialPlan.budget}</strong>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-rose-100 dark:border-rose-900/30">
                      <span className="text-slate-500">Kênh truyền thông:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{activeScenario.initialPlan.channels}</strong>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-rose-100 dark:border-rose-900/30">
                      <span className="text-slate-500">Mô hình phục vụ:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{activeScenario.initialPlan.operations}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-500">Chính sách giá:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{activeScenario.initialPlan.pricing}</strong>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Phương án sau tranh luận */}
                <div className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border-2 border-emerald-400 dark:border-emerald-600 flex flex-col gap-4 shadow-md">
                  <div className="flex items-center justify-between border-b border-emerald-300 dark:border-emerald-800 pb-3">
                    <h3 className="text-sm font-black uppercase text-emerald-800 dark:text-emerald-300 tracking-wider">
                      2. Phương án chốt (Sau tranh luận)
                    </h3>
                    <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">✓ Đã tối ưu</span>
                  </div>

                  <ul className="space-y-3 text-xs leading-relaxed">
                    <li className="flex justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-900/40">
                      <span className="text-slate-600 dark:text-slate-400">Ngân sách đã khớp:</span>
                      <strong className="text-emerald-800 dark:text-emerald-300 font-black">{activeScenario.finalPlan.budget}</strong>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-900/40">
                      <span className="text-slate-600 dark:text-slate-400">Kênh truyền thông:</span>
                      <strong className="text-slate-800 dark:text-slate-100 font-bold">{activeScenario.finalPlan.channels}</strong>
                    </li>
                    <li className="flex justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-900/40">
                      <span className="text-slate-600 dark:text-slate-400">Mô hình phục vụ:</span>
                      <strong className="text-slate-800 dark:text-slate-100 font-bold">{activeScenario.finalPlan.operations}</strong>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Chính sách ưu đãi:</span>
                      <strong className="text-slate-800 dark:text-slate-100 font-bold">{activeScenario.finalPlan.pricing}</strong>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Key Highlights list */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                  Các điểm mấu chốt được giải quyết:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeScenario.finalPlan.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 gap-4 flex-wrap">
              <button
                onClick={handleResetLoop}
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Xem lại phiên tranh luận
              </button>

              {onNext && (
                <button
                  onClick={() => {
                    setIsTransitioningNext(true);
                    setTimeout(() => {
                      if (onNext) onNext();
                    }, 1000);
                  }}
                  disabled={isTransitioningNext}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:opacity-80"
                >
                  {isTransitioningNext ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      Đang đồng bộ hồ sơ Bếp Nhà Mộc sang Kế hoạch hành động...
                    </>
                  ) : (
                    <>
                      Tiến hành lập Lịch trình & Ma trận (Giai đoạn 3) <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── SHOWCASE BOTTOM QR CODE PLACEHOLDER (For Exhibition) ── */}
        {isShowcase && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-1 flex items-center justify-center shadow-sm">
                <QrCode className="w-9 h-9 text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                  Quét mã để xem Hồ sơ chiến lược trên di động
                </span>
                <span className="text-[10px] text-slate-500">
                  Hệ thống AI BrandFlow · ĐHBK Hà Nội 70 Năm
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono text-[11px] text-slate-400">
                Tự động khôi phục sau 60s không chạm
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
