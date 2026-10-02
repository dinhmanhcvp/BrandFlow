"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * HƯỚNG DẪN SỬ DỤNG CHO NGƯỜI EDIT:
 * 1. Chép các file video quay màn hình (hoặc webp) vào thư mục `frontend/public/videos/`
 * 2. Đổi tên link src ở dưới cho khớp (VD: src="/videos/01_workspace_phase3.mp4")
 * 3. Mở trang http://localhost:3000/demo-video-final
 * 4. Bấm phím SPACE (khoảng trắng) hoặc Click chuột để chuyển qua lại giữa các cảnh (giống như slide thuyết trình).
 * 5. Bật phần mềm quay màn hình (OBS / QuickTime) ở chế độ Fullscreen và vừa bấm SPACE vừa nghe nhạc để khớp beat!
 */

const SCENES = [
  { id: 'start', type: 'intro', text: 'Bấm SPACE để bắt đầu Video Demo' },
  { id: 'hook1', type: 'text', text: 'MARKETING.' },
  { id: 'hook2', type: 'text', text: 'AUTOMATED.' },
  { id: 'hook3', type: 'text', text: 'REIMAGINED.' },
  { id: 'logo', type: 'logo', text: 'BRANDFLOW' },
  { 
    id: 'scene1', 
    type: 'video', 
    src: '/docs/01_workspace_phase3.webp', // THAY LINK VIDEO VÀO ĐÂY (Nên chép file vào public/docs/)
    title: 'SỨC MẠNH CỦA MỘT TẬP ĐOÀN.', 
    subtitle: 'Nằm gọn trong một hệ thống.',
    animation: '3d-tilt'
  },
  { 
    id: 'scene2', 
    type: 'video', 
    src: '/docs/02_workspace_phase5.webp', // THAY LINK VIDEO VÀO ĐÂY
    title: 'SÁNG TẠO VÔ HẠN.', 
    subtitle: 'Zero độ trễ. Thiết kế Multi-modal.',
    animation: 'slide-scale'
  },
  { 
    id: 'scene3', 
    type: 'video', 
    src: '/docs/03_workspace_phase6.webp', // THAY LINK VIDEO VÀO ĐÂY
    title: 'TRÍ TUỆ NHÂN TẠO.', 
    subtitle: 'Dành riêng cho B2B.',
    animation: 'macro-zoom'
  },
  { 
    id: 'scene4', 
    type: 'video', 
    src: '/docs/04_planning_gantt.webp', // THAY LINK VIDEO VÀO ĐÂY
    title: 'MỌI NGÂN SÁCH.', 
    subtitle: 'Dưới tầm kiểm soát tuyệt đối.',
    animation: 'zoom-out'
  },
  { id: 'outro', type: 'outro', text: 'BRANDFLOW' },
];

export default function EpicVideoComposer() {
  const [step, setStep] = useState(0);

  // Điều khiển bằng phím SPACE
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setStep(s => Math.min(s + 1, SCENES.length - 1));
      }
      if (e.code === 'ArrowLeft') {
        setStep(s => Math.max(s - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentScene = SCENES[step];

  return (
    <div 
      className="w-screen h-screen bg-[#050505] overflow-hidden flex items-center justify-center relative cursor-pointer"
      onClick={() => setStep(s => Math.min(s + 1, SCENES.length - 1))}
      style={{ perspective: '2000px' }} // Phục vụ hiệu ứng 3D của ElevenLabs
    >
      
      <AnimatePresence mode="wait">
        
        {/* --- DẠNG 1: HOOK TEXT (Apple Style) --- */}
        {currentScene.type === 'text' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <h1 className="text-7xl md:text-[120px] font-black text-white tracking-tighter uppercase">
              {currentScene.text}
            </h1>
          </motion.div>
        )}

        {/* --- DẠNG 2: LOGO GLOW --- */}
        {currentScene.type === 'logo' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center flex-col"
          >
            <div className="absolute w-[60vw] h-[60vw] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse"></div>
            <h1 className="text-7xl md:text-[150px] font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600 z-10 tracking-tight">
              {currentScene.text}
            </h1>
          </motion.div>
        )}

        {/* --- DẠNG 3: VIDEO SHOWCASE (ElevenLabs Style) --- */}
        {currentScene.type === 'video' && (
          <motion.div
            key={currentScene.id}
            className="absolute inset-0 flex items-center justify-center w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background Glow */}
            <div className="absolute w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[120px]"></div>

            {/* Chữ nổi bật (Apple Punchy Text) */}
            <div className="absolute top-[10%] left-0 right-0 text-center z-20">
              <motion.h2 
                initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-2xl"
              >
                {currentScene.title}
              </motion.h2>
              <motion.p 
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl text-slate-400 font-medium mt-2"
              >
                {currentScene.subtitle}
              </motion.p>
            </div>

            {/* Khung Video (ElevenLabs Floating UI) */}
            <motion.div
              className="relative w-[85vw] max-w-[1400px] aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
              // Các kiểu hiệu ứng Camera khác nhau tùy scene
              initial={
                currentScene.animation === '3d-tilt' ? { rotateX: 20, rotateY: -15, scale: 0.8, y: 100, opacity: 0 } :
                currentScene.animation === 'slide-scale' ? { x: 300, scale: 0.7, opacity: 0 } :
                currentScene.animation === 'macro-zoom' ? { scale: 1.5, opacity: 0 } :
                { scale: 1.2, opacity: 0 }
              }
              animate={
                currentScene.animation === '3d-tilt' ? { rotateX: 5, rotateY: -5, scale: 0.9, y: 20, opacity: 1 } :
                currentScene.animation === 'slide-scale' ? { x: 0, scale: 0.9, opacity: 1 } :
                currentScene.animation === 'macro-zoom' ? { scale: 1.1, x: '-10%', y: '10%', opacity: 1 } :
                { scale: 0.85, opacity: 1 }
              }
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Fake Glass Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-10 pointer-events-none mix-blend-overlay"></div>
              
              {/* Source Video của bạn thay vào đây */}
              {/* Hỗ trợ cả thẻ img (cho webp) hoặc video (cho mp4) */}
              <img 
                src={currentScene.src} 
                className="w-full h-full object-cover"
                alt="Demo Scene"
              />
            </motion.div>
          </motion.div>
        )}

        {/* --- DẠNG 4: OUTRO --- */}
        {currentScene.type === 'outro' && (
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black"
          >
            <div className="absolute w-[40vw] h-[40vw] bg-blue-600/20 rounded-full blur-[100px]"></div>
            <img src="/img/hust-logo.png" alt="HUST" className="w-20 h-20 mb-6 opacity-80" onError={(e) => e.currentTarget.style.display='none'} />
            <h1 className="text-5xl md:text-[100px] font-black text-white tracking-tight z-10">
              {currentScene.text}
            </h1>
            <p className="text-xl text-slate-400 mt-4 tracking-widest uppercase font-semibold">Đại học Bách Khoa Hà Nội</p>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Nút Help (Chỉ hiện lúc đầu) */}
      {step === 0 && (
        <div className="absolute bottom-10 text-slate-500 font-mono text-sm animate-pulse">
          {currentScene.text}
        </div>
      )}

      {/* Cục Progress góc dưới */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        {SCENES.map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-white scale-125' : 'bg-white/20'}`} />
        ))}
      </div>

    </div>
  );
}
