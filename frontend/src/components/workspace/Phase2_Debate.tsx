"use client";

import React, { useState, useEffect } from 'react';
import { useFormStore } from '@/store/useFormStore';
import BoardroomDebate from './debate/BoardroomDebate';

export default function Phase2_Debate({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const { debateLogs, runDebateAndPlanning } = useFormStore();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const initDebate = async () => {
      if (!debateLogs || debateLogs.length === 0) {
        setIsFetching(true);
        try {
          await runDebateAndPlanning();
        } catch (err) {
          console.error("Error running debate and planning:", err);
        } finally {
          if (isMounted) setIsFetching(false);
        }
      }
    };
    initDebate();
    return () => { isMounted = false; };
  }, [debateLogs, runDebateAndPlanning]);

  return (
    <div className="w-full h-full flex flex-col relative bg-transparent overflow-hidden">
      <BoardroomDebate 
        onNext={onNext} 
        onBack={onBack} 
        realLogs={debateLogs}
      />
    </div>
  );
}
