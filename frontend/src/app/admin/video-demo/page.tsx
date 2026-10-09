"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

export default function VideoDemoPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto flex flex-col items-center">
      <div className="w-full mb-10">
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">Platform Demo</h1>
        <p className="text-linear-text-muted">High-fidelity demonstration of BrandFlow AI Multi-Trợ lý AI architecture.</p>
      </div>

      <div className="w-full flex flex-col gap-4">
        {/* VIDEO CONTAINER */}
        <div className="w-full aspect-video bg-[#050505] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl flex items-center justify-center group">
          <video 
            ref={videoRef}
            src="/videos/Brandflow_Final.mp4" 
            loop
            className="w-full h-full object-cover"
            onClick={togglePlay}
          />
          
          {/* Play/Pause Overlay for Touch */}
          {!isPlaying && (
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer transition-opacity"
              onClick={togglePlay}
            >
              <div className="w-24 h-24 bg-cyan-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-cyan-400 transition-colors shadow-2xl">
                <Play className="w-12 h-12 ml-2" fill="currentColor" />
              </div>
            </div>
          )}
        </div>

        {/* CUSTOM TOUCH CONTROLS */}
        <div className="w-full bg-[#0B1120] border border-white/10 rounded-xl p-4 md:p-6 flex items-center gap-6 shadow-lg">
          {/* Play/Pause */}
          <button 
            onClick={togglePlay}
            className="w-14 h-14 shrink-0 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/40 active:bg-cyan-500/60 transition"
          >
            {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-1" fill="currentColor" />}
          </button>

          {/* Volume Control - Touch Friendly */}
          <div className="flex items-center gap-4 flex-1">
            <button onClick={toggleMute} className="text-slate-400 hover:text-white p-2">
              {isMuted || volume === 0 ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Full Screen */}
          <button 
            onClick={toggleFullScreen}
            className="w-14 h-14 shrink-0 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center hover:bg-white/10 active:bg-white/20 transition"
          >
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
        {[
          { title: 'Intake & Strategy', time: '02:15', desc: 'Trợ lý AI phân tích thị trường & định vị' },
          { title: 'CFO Cross-Audit', time: '05:30', desc: 'Tranh biện tài chính và tối ưu ROI' },
          { title: 'Export Blueprint', time: '08:45', desc: 'Xuất báo cáo PDF & Dashboard GTM' }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-xl bg-[#0B1120]/50 border border-white/5 hover:border-cyan-500/30 hover:bg-[#0B1120] transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-bold text-white tracking-tight">{item.title}</h4>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">{item.time}</span>
            </div>
            <p className="text-sm text-linear-text-muted leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
