"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, Users, Clock, Award, ChevronRight, Zap, Target } from 'lucide-react';

export default function ShowcaseDisplayPage() {
  // Use state to trigger animations in a loop for the digital signage
  const [key, setKey] = useState(0);

  useEffect(() => {
    // Restart animation every 30 seconds for the digital signage loop
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 50, damping: 20 }
    }
  };

  return (
    <div key={key} className="relative w-full h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500/30 flex flex-col">
      {/* Background Ornaments (Light Theme DNA) */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-100/60 to-transparent pointer-events-none" />
      <div className="absolute -top-[20%] -right-[20%] w-[80%] h-[50%] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] -left-[30%] w-[60%] h-[40%] bg-cyan-400/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex justify-between items-center px-8 py-10 z-10"
      >
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-widest text-red-600 uppercase mb-1">
            Kỷ niệm 70 năm thành lập Đại học Bách Khoa Hà Nội
          </span>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/20">
              HUST
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 border-l-2 border-slate-200 pl-3">
              Chuyển đổi số & AI
            </h1>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 px-8 py-4 flex flex-col z-10 w-full max-w-[1080px] mx-auto">
        
        {/* Main Title */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-cyan-100 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="text-xs font-bold text-cyan-700 tracking-widest uppercase">Dự án công nghệ tiêu biểu</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700">BrandFlow</span>
          </h2>
          <p className="text-2xl text-slate-600 font-medium max-w-2xl mx-auto">
            Nền tảng Phòng Marketing Đa tác vụ AI
            <br /> <span className="text-lg text-slate-500 font-normal">Giải pháp tối ưu hóa dòng tiền cho doanh nghiệp SME Việt Nam.</span>
          </p>
        </motion.div>

        {/* Journey Timeline */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 relative mb-12 flex flex-col justify-center"
        >
          <div className="absolute left-12 top-4 bottom-4 w-1 bg-gradient-to-b from-cyan-200 via-blue-200 to-transparent rounded-full" />
          
          <div className="space-y-10 pl-4">
            {[
              { 
                icon: Target, 
                title: 'Khởi tạo Ý tưởng', 
                desc: 'Nghiên cứu "nỗi đau" lãng phí ngân sách của 98% doanh nghiệp SME. Định hình giải pháp kết hợp AI và Toán học.',
                color: 'text-blue-600',
                bg: 'bg-blue-100'
              },
              { 
                icon: Zap, 
                title: 'Phát triển Thuật toán', 
                desc: 'Xây dựng thành công Deterministic Math Engine (Kiểm toán bằng code) và kiến trúc Multi-Agent DAG.',
                color: 'text-amber-600',
                bg: 'bg-amber-100'
              },
              { 
                icon: ShieldCheck, 
                title: 'Thử nghiệm Thực chiến', 
                desc: 'Triển khai Beta cho 112 doanh nghiệp. Đạt tỷ lệ giữ chân 90% và NPS 59 sau 30 ngày.',
                color: 'text-emerald-600',
                bg: 'bg-emerald-100'
              },
              { 
                icon: TrendingUp, 
                title: 'Trưởng thành & Thương mại', 
                desc: 'Sẵn sàng nhân rộng mô hình SaaS. Định giá LTV:CAC dự phóng đạt mức lý tưởng 3.8:1.',
                color: 'text-cyan-600',
                bg: 'bg-cyan-100'
              }
            ].map((step, idx) => (
              <motion.div key={idx} variants={itemVariants} className="relative flex items-start gap-8 group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 z-10 ${step.bg} border-4 border-white shadow-xl transition-transform duration-500 group-hover:scale-110`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <div className="pt-2">
                  <h4 className="text-2xl font-black text-slate-800 mb-2">{step.title}</h4>
                  <p className="text-xl text-slate-600 leading-relaxed pr-8">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="grid grid-cols-2 gap-6 mb-12"
        >
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 text-emerald-500/30" />
            </div>
            <div className="text-5xl font-black text-slate-900 mb-2 flex items-baseline gap-2">
              8 <span className="text-2xl text-slate-500 font-medium">phút</span>
            </div>
            <p className="text-lg text-slate-600 font-medium">Lập xong chiến lược (Giảm từ 4 tuần)</p>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-6 shadow-xl shadow-cyan-900/20 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-16 h-16 text-white/20" />
            </div>
            <div className="text-5xl font-black text-white mb-2 flex items-baseline gap-2">
              0 <span className="text-2xl text-cyan-200 font-medium">đồng</span>
            </div>
            <p className="text-lg text-cyan-100 font-medium">Vượt ngân sách (Khóa bằng thuật toán)</p>
          </div>
        </motion.div>

      </div>

      {/* Footer / Ticker */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="w-full bg-slate-900 py-6 px-8 flex items-center justify-between z-20"
      >
        <div className="flex items-center gap-4 text-white/80">
          <Award className="w-8 h-8 text-amber-400" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white uppercase tracking-wider">Tự hào Sinh viên Bách Khoa</span>
            <span className="text-sm">Trình diễn công nghệ chào mừng 70 năm thành lập trường</span>
          </div>
        </div>
        
        <div className="text-right flex flex-col">
          <span className="text-cyan-400 font-bold text-xl">BRANDFLOW TEAM</span>
          <span className="text-white/50 text-sm">contact@brandflow.vn</span>
        </div>
      </motion.div>
    </div>
  );
}
