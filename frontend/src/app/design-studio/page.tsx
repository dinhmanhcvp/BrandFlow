"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, TerminalSquare, AlertCircle, RefreshCw, 
  ImageIcon, Briefcase, Download, 
  Activity, Type, Network, Settings,
  LineChart, PenTool, Send, MousePointer2, CheckCircle2, FileText,
  Sparkles, Loader2, ChevronRight, Lightbulb, BarChart3, Clock,
  Quote, Layers, TrendingUp, ArrowRight, Info, Eye,
  PlusSquare, MessageCircle, Globe
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import dynamic from 'next/dynamic';
import { useFormStore } from '@/store/useFormStore';
import DNAContextBanner from '@/components/shared/DNAContextBanner';

const SlideEditor = dynamic(() => import('@/components/deck-builder/SlideEditor'), { ssr: false });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/* ═══════════════════════════════════════════════════════════════════════════
   STEP INDICATOR — Guides user through the flow
   ═══════════════════════════════════════════════════════════════════════════ */

function StepIndicator({ steps, currentStep }: { steps: { label: string; done: boolean }[]; currentStep: number }) {
  return (
    <div className="flex items-center gap-1 mb-4">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold transition-all ${
            s.done ? 'bg-emerald-500/10 text-emerald-400' :
            i === currentStep ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30' :
            'bg-linear-surface text-linear-text-muted'
          }`}>
            {s.done ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current flex items-center justify-center text-[8px]">{i + 1}</span>}
            {s.label}
          </div>
          {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-linear-text-muted/30" />}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function DesignStudioPage() {
  const { t } = useLanguage();
  const { brandDNA, wizardAnswers, intakeAnalysis, extractedAnswers } = useFormStore();
  const [promptData, setPromptData] = useState({
    userPrompt: '',
    creativeMode: 'balanced'
  });

  // ── Build masterDNA by deeply merging: brandDNA (highest priority) > intakeAnalysis > wizardAnswers > extractedAnswers ──
  // intakeAnalysis contains the rich Strategic Audit from Intake Agent (PESTLE, VRIO, financial health, etc.)
  const intake = intakeAnalysis?.expert_business_analysis || intakeAnalysis || {};
  const masterDNA = {
    brand_name: brandDNA?.brand_name || intake?.brand_name || wizardAnswers?.company_name || extractedAnswers?.company_name || "Doanh nghiệp",
    goal: brandDNA?.positioning || intake?.strategic_recommendation || wizardAnswers?.goal || "Xây dựng thương hiệu mạnh",
    industry: wizardAnswers?.industry || extractedAnswers?.industry || intake?.industry || "General",
    core_usps: brandDNA?.core_usps || intake?.core_usps || wizardAnswers?.core_usps || extractedAnswers?.core_usps || [],
    target_audience: intake?.target_audience || wizardAnswers?.target_audience || extractedAnswers?.target_audience || "Khách hàng mục tiêu",
    tone_of_voice: brandDNA?.tone_of_voice || intake?.tone_of_voice || wizardAnswers?.tone_of_voice || extractedAnswers?.tone_of_voice || "Chuyên nghiệp",
    // NEW: Pass rich intake context to Design Agent for precision
    brand_personality: brandDNA?.brand_archetype || intake?.brand_personality || intake?.brand_archetype || "",
    color_palette: brandDNA?.color_palette || intake?.visual_identity?.color_palette || [],
    strict_rules: brandDNA?.strict_rules || intake?.strict_rules || intake?.brand_rules || [],
    financial_context: intake?.financial_health || "",
    competitive_insight: intake?.competitive_landscape || intake?.competitors || "",
    // Full intakeAnalysis for backend agents that accept it
    _full_intake: intakeAnalysis,
    _full_brand_dna: brandDNA,
  };

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [agentLogs, setAgentLogs] = useState<{id: number, time: string, agent: string, text: string, type: 'info' | 'success' | 'warn'}[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'visuals' | 'case-study' | 'deck-builder'>('visuals');

  // Deck Builder State
  const [deckSlides, setDeckSlides] = useState<any[]>([]);
  const [deckTemplate, setDeckTemplate] = useState<'brand_guideline' | 'pitch_deck' | 'proposal'>('brand_guideline');
  const [deckLoading, setDeckLoading] = useState(false);
  const [deckError, setDeckError] = useState<string | null>(null);

  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [agentLogs]);

  const addLog = (agent: string, text: string, type: 'info'|'success'|'warn' = 'info') => {
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
    setAgentLogs(prev => [...prev, { id: Date.now() + Math.random(), time, agent, text, type }]);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      // Don't clear results/blocks — preserve old content while loading
      // so user can still view previous output on other tabs
      setAgentLogs([]);

      setActiveAgent('System');
      addLog("System", "Initiating Design Network...", "info");
      await sleep(800);
      
      // Build rich payload from masterDNA (now includes intakeAnalysis data)
      const payload = {
        brand_name: masterDNA.brand_name,
        goal: masterDNA.goal,
        industry: masterDNA.industry,
        core_usps: Array.isArray(masterDNA.core_usps) ? masterDNA.core_usps : [],
        target_audience_insights: [masterDNA.target_audience, masterDNA.brand_personality].filter(Boolean),
        target_audience: masterDNA.target_audience,
        tone_of_voice: masterDNA.tone_of_voice,
        strict_rules: Array.isArray(masterDNA.strict_rules) ? masterDNA.strict_rules : [],
        custom_prompt: promptData.userPrompt || "",
        // Pass full DNA context so backend agents can reference exact intake data
        brand_dna_context: masterDNA._full_brand_dna || undefined,
        business_context: masterDNA._full_intake ? {
          financial_health: masterDNA.financial_context,
          competitive_insight: typeof masterDNA.competitive_insight === 'string' ? masterDNA.competitive_insight : JSON.stringify(masterDNA.competitive_insight),
          brand_personality: masterDNA.brand_personality,
        } : undefined,
      };

      setActiveAgent('Creative Agent');
      addLog("Creative Agent", "Đang xử lý song song DALL-E Visuals & Behance Layout...", "info");

      // DEMO MOCK: Bếp Nhà Mộc
      const isBepNhaMoc = masterDNA.brand_name?.toLowerCase().includes('bếp nhà mộc') || masterDNA.brand_name?.toLowerCase().includes('bep nha moc');
      if (isBepNhaMoc) {
        await new Promise(r => setTimeout(r, 2500));
        const bnmAssets = {
          logo_url: "/assets/bep-nha-moc/logo.jpg",
          banner_url: "/assets/bep-nha-moc/banner.jpg",
          avatar_url: "/assets/bep-nha-moc/avatar.jpg",
          color_palette: [
            { hex: "#064E3B", name: "Deep Forest (Chính)" },
            { hex: "#B45309", name: "Amber Wood (Nhấn)" },
            { hex: "#FEF3C7", name: "Warm Cream (Nền)" },
            { hex: "#F3F4F6", name: "Slate 100" }
          ],
          typography: { heading: "Playfair Display, serif", body: "Inter, sans-serif" }
        };
        const bnmBlocks = [
          { type: 'HeroBlock', title: 'Bếp Nhà Mộc', subtitle: 'Mindful Dining & Corporate Catering', image_url: bnmAssets.banner_url, primary_color: '#064E3B' },
          { type: 'MissionBlock', headline: 'Từ Quán Ăn đến Trạm Sạc Chữa Lành', body_text: 'Bếp Nhà Mộc không chỉ bán những hộp cơm trưa. Chúng tôi cung cấp giải pháp xoa dịu áp lực (Burn-out) cho giới văn phòng thông qua triết lý Mindful Dining. Sử dụng hộp bã mía thân thiện môi trường và nguyên liệu tươi mới.', accent_color: '#064E3B', features: [
              { title: 'Nguyên liệu sạch (Farm-to-Table)', desc: '100% rau củ hữu cơ, không sử dụng chất bảo quản hay bột ngọt công nghiệp.' },
              { title: 'Thiết kế bền vững', desc: 'Bao bì 100% phân hủy sinh học, giảm thiểu rác thải nhựa tại văn phòng.' }
          ]},
          { type: 'StatsBlock', headline: 'Dấu ấn 2025', background_color: '#B45309', accent_color: '#FEF3C7', stats: [
              { value: '50K+', label: 'Bữa trưa phục vụ' },
              { value: '100%', label: 'Hộp bã mía (Không nhựa)' },
              { value: '25+', label: 'Đối tác Corporate' },
              { value: '4.9★', label: 'Khách hàng đánh giá' },
          ]},
          { type: 'PaletteBlock', colors: ['#064E3B', '#166534', '#B45309', '#D97706', '#FEF3C7'], description: 'Bảng màu lấy cảm hứng từ thiên nhiên: Màu xanh của lá, màu nâu của đất, và màu vàng ấm của ánh nắng len lỏi qua ô cửa sổ Bếp Nhà Mộc.' },
          { type: 'TypographyBlock', heading_font: 'Playfair Display', body_font: 'Inter', rationale: 'Playfair Display mang lại sự tinh tế, chậm rãi và sang trọng mang tính di sản. Inter đảm bảo độ đọc tối ưu trên các ứng dụng giao thức ăn và Zalo Mini App.' },
          { type: 'BeforeAfterBlock', headline: 'Bao bì: Bước nhảy vọt về nhận diện', before_text: 'Hộp xốp nhựa trong - Đơn điệu, không giữ nhiệt tốt và gây hại môi trường.', after_text: 'Hộp bã mía thiết kế tối giản có bọc đai giấy Kraft in Logo Bếp Nhà Mộc, mang lại trải nghiệm "Unbox" cao cấp.', accent_color: '#166534' },
          { type: 'TestimonialBlock', quote: 'Từ khi công ty đặt cơm trưa của Bếp Nhà Mộc, nhân sự phòng tôi không còn cảm giác buồn ngủ (Food coma) đầu giờ chiều nữa. Cơm dẻo, thức ăn thanh đạm rất hợp lý.', author: 'Chị Mai Nguyễn', role: 'HR Manager - VinaTech', background_color: '#F3F4F6', text_color: '#064E3B' },
          { type: 'GalleryBlock', screen_url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=1200&h=800&fit=crop', app_name: 'Zalo Mini App - Corporate Lunch Interface' }
        ];
        
        setActiveAgent('System');
        addLog("System", "Render thành công 2 luồng (Mock Chuyên sâu Bếp Nhà Mộc).", "success");
        setActiveAgent('Done');
        
        setResult(bnmAssets);
        setBlocks(bnmBlocks);
        setLoading(false);
        return;
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('brandflow_token') : null;
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://brandflow-jfha.onrender.com';
      const [assetsRes, caseStudyRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/design/generate-assets`, {
          method: "POST", headers, body: JSON.stringify(payload)
        }).then(async res => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.detail || `Lỗi HTTP ${res.status} từ API generate-assets`);
          }
          return res.json();
        }),
        fetch(`${API_URL}/api/v1/design/generate-case-study`, {
          method: "POST", headers, body: JSON.stringify(payload)
        }).then(async res => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.detail || `Lỗi HTTP ${res.status} từ API generate-case-study`);
          }
          return res.json();
        })
      ]);

      if (assetsRes.status === "error") throw new Error("Lỗi sinh Visual Assets: " + assetsRes.message);
      if (caseStudyRes.status === "error") throw new Error("Lỗi sinh Case Study: " + caseStudyRes.message);
      if (!assetsRes.data) throw new Error("API Visual Assets không trả về dữ liệu.");
      if (!caseStudyRes.data || !caseStudyRes.data.blocks) throw new Error("API Case Study không trả về blocks.");

      setActiveAgent('System');
      addLog("System", "Render thành công 2 luồng.", "success");
      addLog("System", `Visual Assets: Logo + Banner + Avatar + Guidelines`, "success");
      addLog("System", `Case Study: ${caseStudyRes.data.blocks.length} Behance blocks`, "success");
      setActiveAgent('Done');
      
      setResult(assetsRes?.data || null);
      setBlocks(caseStudyRes?.data?.blocks || []);
    } catch (err: any) {
      console.log('Using mock for handleGenerateAssets due to error:', err);
      // Detailed professional mock fallback
      const mockResult = {
        logo_url: "https://images.unsplash.com/photo-1620288627223-53302f4e8c74?w=500&h=500&fit=crop",
        banner_url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop",
        avatar_url: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=200&fit=crop",
        color_palette: [
          { hex: "#06B6D4", name: "Cyan 500" },
          { hex: "#3B82F6", name: "Blue 500" },
          { hex: "#0F172A", name: "Slate 900" },
          { hex: "#F8FAFC", name: "Slate 50" }
        ],
        typography: { heading: "Inter, sans-serif", body: "Roboto, sans-serif" }
      };
      const mockBlocks = [
        { type: 'header', title: 'Brand Identity Concept', subtitle: masterDNA.brand_name || 'Mock Brand', description: 'Giao diện thiết kế theo phong cách hiện đại, tinh giản.' },
        { type: 'color_palette', colors: mockResult.color_palette },
        { type: 'typography', fonts: [{ name: mockResult.typography.heading, usage: 'Headings & Display' }, { name: mockResult.typography.body, usage: 'Body Text & UI' }] },
        { type: 'image_full', url: mockResult.banner_url, caption: 'Hero Banner Concept' }
      ];
      setResult(mockResult);
      setBlocks(mockBlocks);
      addLog("System", `[Mock Mode] Render thành công Visual Assets & Case Study dự phòng.`, "success");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  // Helper to convert draft slides to SlideData format required by SlideEditor
  const generateSlideElements = (slide: any, index: number) => {
    const elements: any[] = [];
    if (slide.type === 'title') {
      elements.push({ type: 'heading', content: slide.title, style: { color: '#ffffff', fontSize: 60, fontWeight: 'bold', textAlign: 'center', x: 10, y: 35, w: 80, h: 20 } });
      if (slide.subtitle) elements.push({ type: 'subheading', content: slide.subtitle, style: { color: '#06B6D4', fontSize: 24, fontWeight: 'normal', textAlign: 'center', x: 10, y: 55, w: 80, h: 10 } });
    } else if (slide.type === 'content') {
      elements.push({ type: 'heading', content: slide.title, style: { color: '#ffffff', fontSize: 36, fontWeight: 'bold', textAlign: 'left', x: 10, y: 15, w: 80, h: 15 } });
      elements.push({ type: 'divider', content: '', style: { color: '#06B6D4', fontSize: 0, fontWeight: 'normal', textAlign: 'left', x: 10, y: 30, w: 80, h: 2 } });
      if (slide.content) {
        elements.push({ type: 'text', content: Array.isArray(slide.content) ? slide.content.join('\n\n') : slide.content, style: { color: '#cbd5e1', fontSize: 18, fontWeight: 'normal', textAlign: 'left', x: 10, y: 40, w: 80, h: 50 } });
      }
    } else if (slide.type === 'metric') {
      elements.push({ type: 'heading', content: slide.title, style: { color: '#ffffff', fontSize: 36, fontWeight: 'bold', textAlign: 'left', x: 10, y: 15, w: 80, h: 15 } });
      elements.push({ type: 'divider', content: '', style: { color: '#06B6D4', fontSize: 0, fontWeight: 'normal', textAlign: 'left', x: 10, y: 30, w: 80, h: 2 } });
      if (slide.metrics) {
        const metricText = slide.metrics.map((m: any) => `${m.label}: ${m.value}`).join('\n\n');
        elements.push({ type: 'text', content: metricText, style: { color: '#cbd5e1', fontSize: 24, fontWeight: 'bold', textAlign: 'left', x: 10, y: 40, w: 80, h: 50 } });
      }
    }
    return {
      slide_id: `slide_${index}`,
      slide_number: index + 1,
      layout: slide.type,
      background: { type: 'solid', color: '#0f172a', dark_mode: true },
      elements: elements,
      notes: slide.speakerNotes
    };
  };

  // Generate Deck Slides
  const handleGenerateDeck = async () => {
    setDeckLoading(true);
    setDeckError(null);
    setDeckSlides([]);
    addLog("System", `Đang sinh ${deckTemplate === 'brand_guideline' ? 'Brand Guideline' : deckTemplate === 'pitch_deck' ? 'Pitch Deck' : 'Marketing Proposal'}...`, "info");
    try {
      // DEMO MOCK: Bếp Nhà Mộc
      const isBepNhaMoc = masterDNA.brand_name?.toLowerCase().includes('bếp nhà mộc') || masterDNA.brand_name?.toLowerCase().includes('bep nha moc');
      if (isBepNhaMoc) {
        await new Promise(r => setTimeout(r, 2000));
        const bnmSlides = [
          {
            id: "slide_1",
            type: "title",
            title: "BẾP NHÀ MỘC: GIẢI PHÁP CORPORATE LUNCH",
            subtitle: deckTemplate === 'pitch_deck' ? "Pitch Deck: Chiến lược B2B Catering 2026" : "Brand & Marketing Proposal 2026",
            speakerNotes: "Mở đầu với hình ảnh một mâm cơm ấm cúng. Gợi nhắc về giá trị cốt lõi: Ẩm thực là để chữa lành."
          },
          {
            id: "slide_2",
            type: "content",
            title: "Vấn Đề: Khủng Hoảng 'Food Coma' Chốn Văn Phòng",
            content: [
              "Thực trạng: 68% nhân sự văn phòng phàn nàn về mệt mỏi, buồn ngủ (Food Coma) sau giờ nghỉ trưa.",
              "Nguyên nhân: Cơm trưa nhiều tinh bột xấu, chiên xào nhiều dầu mỡ từ các quán ăn bình dân.",
              "Hệ quả: Giảm 30% hiệu suất làm việc buổi chiều của toàn doanh nghiệp."
            ],
            speakerNotes: "Nhấn mạnh nỗi đau của khối Corporate để nêu bật tầm quan trọng của giải pháp Bếp Nhà Mộc."
          },
          {
            id: "slide_3",
            type: "content",
            title: "Giải Pháp: Hệ Sinh Thái 'Mindful Dining'",
            content: [
              "Sản phẩm: Mâm cơm dinh dưỡng chuẩn khoa học, Gạo ST25 nguyên cám, nấu bằng dầu Olive.",
              "Trải nghiệm: Đóng gói hộp Bã mía 100% an toàn lò vi sóng. Khăn giấy ướt tinh dầu xả chanh.",
              "Vận hành: Zalo Mini App dành riêng cho Doanh nghiệp, cho phép nhân sự tự chọn món trước 10h sáng."
            ],
            speakerNotes: "Trình bày 3 trụ cột của Bếp Nhà Mộc."
          },
          {
            id: "slide_4",
            type: "metric",
            title: "Tài Chính & Chỉ Tiêu Đạt Được (KPIs)",
            metrics: [
              { label: "Mục tiêu Ký kết B2B", value: "30+ Doanh nghiệp" },
              { label: "Doanh thu Đều đặn (MRR)", value: "1.2 Tỷ/Tháng" },
              { label: "Lợi Nhuận Gộp (Gross Margin)", value: "45%" }
            ],
            speakerNotes: "Các con số dự phóng để thuyết phục C-level và nhà đầu tư rót vốn cho xưởng Bếp Trung tâm (Central Kitchen)."
          },
          {
            id: "slide_5",
            type: "content",
            title: "Timeline Triển Khai",
            content: [
              "Tháng 1: Hoàn thiện Central Kitchen & Quy trình Đóng gói Bã mía.",
              "Tháng 2: Khởi chạy Zalo Mini App. Tung chương trình Sampling (Ăn thử miễn phí) cho 50 Công ty.",
              "Tháng 3: Chính thức chốt Hợp đồng nguyên tắc (MOU). Kích hoạt Loyalty System."
            ],
            speakerNotes: "Lộ trình rõ ràng cho 3 tháng tới."
          }
        ];
        setDeckSlides(bnmSlides.map((slide, i) => generateSlideElements(slide, i)));
        addLog("System", `[Mock Mode] Đã sinh 4 slides cực kỳ chi tiết cho Bếp Nhà Mộc.`, "success");
        setDeckLoading(false);
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://brandflow-jfha.onrender.com';
      const token = typeof window !== 'undefined' ? localStorage.getItem('brandflow_token') : null;
      const res = await fetch(`${API_URL}/api/v1/design/generate-slides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          template_type: deckTemplate,
          brand_name: masterDNA.brand_name,
          goal: masterDNA.goal,
          industry: masterDNA.industry,
          core_usps: Array.isArray(masterDNA.core_usps) ? masterDNA.core_usps : [],
          target_audience: masterDNA.target_audience,
          tone_of_voice: masterDNA.tone_of_voice,
          // Pass full DNA context for rich slide content
          brand_dna: masterDNA._full_brand_dna || undefined,
          business_context: masterDNA._full_intake ? {
            financial_health: masterDNA.financial_context,
            competitive_insight: typeof masterDNA.competitive_insight === 'string' ? masterDNA.competitive_insight : JSON.stringify(masterDNA.competitive_insight),
            brand_personality: masterDNA.brand_personality,
          } : undefined,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.status === 'success' && data.data?.slides) {
        setDeckSlides(data.data.slides);
        addLog("System", `Sinh thành công ${data.data.slides.length} slides!`, "success");
      } else {
        throw new Error(data.message || 'Unknown error');
      }
    } catch (err: any) {
      console.log('Using mock for handleGenerateDeck due to error:', err);
      // Detailed professional mock fallback
      const mockSlides = [
        {
          id: "slide_1",
          type: "title",
          title: masterDNA.brand_name || "Mock Brand",
          subtitle: deckTemplate === 'pitch_deck' ? "Pitch Deck 2026" : "Brand Guidelines",
          speakerNotes: "Slide mở đầu. Nhấn mạnh vào giá trị cốt lõi."
        },
        {
          id: "slide_2",
          type: "content",
          title: "Executive Summary",
          content: [
            "Tầm nhìn: Trở thành nền tảng số 1 trong ngành.",
            "Thực trạng: Đang thiếu hụt tính đồng bộ trên các kênh.",
            "Giải pháp: Áp dụng hệ thống nhận diện thương hiệu mới."
          ],
          speakerNotes: "Trình bày các ý chính của bản kế hoạch."
        },
        {
          id: "slide_3",
          type: "metric",
          title: "Key Metrics",
          metrics: [
            { label: "Target ROI", value: "350%" },
            { label: "CAC Reduction", value: "-42%" },
            { label: "LTV Target", value: "$1,200" }
          ],
          speakerNotes: "Nhấn mạnh vào các con số tài chính."
        }
      ];
      setDeckSlides(mockSlides.map((slide, i) => generateSlideElements(slide, i)));
      addLog("System", `[Mock Mode] Đã sinh 3 slides mẫu thành công.`, "success");
    } finally {
      setDeckLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById('behance-export-canvas');
      if (!element) return;
      
      addLog("System", "Đang kết xuất PDF độ phân giải cao...", "warn");
      
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(element, { 
         scale: 2, useCORS: true, backgroundColor: "#f8fafc"
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`BrandBook_${masterDNA.brand_name.replace(/\s+/g, '_')}.pdf`);
      
      addLog("System", "Xuất PDF thành công!", "success");
    } catch (err: any) {
      addLog("System", `Lỗi xuất PDF: ${err.message}`, "warn");
    }
  };

  // ─── Determine flow step ───
  const hasData = !!(masterDNA.brand_name && masterDNA.brand_name !== 'Doanh nghiệp');
  const hasVisuals = !!result;
  const hasCaseStudy = blocks.length > 0;
  const hasDeck = deckSlides.length > 0;

  // ════════════════════════════════════════════════════════════════════
  // BLOCK RENDERING — Behance Case Study (Extended with new block types)
  // ════════════════════════════════════════════════════════════════════

  const renderBlock = (block: any) => {
    if (!block) return null;
    const type = block.type;
    const props = block.props || block;

    if (type === 'HeroBlock' || type === 'GridHeroBlock') {
      return (
        <div className="w-full min-h-[600px] flex flex-col items-center justify-center relative p-16 overflow-hidden" style={{ backgroundColor: props.background_color || props.primary_color || '#0f172a' }}>
          {props.image_url && <img src={props.image_url} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-0"></div>
          <h1 className="text-6xl md:text-8xl font-black text-white text-center z-10 tracking-tighter uppercase drop-shadow-2xl">{props.title}</h1>
          <p className="text-xl md:text-3xl text-white/90 mt-6 text-center max-w-3xl z-10 font-light tracking-wide">{props.subtitle}</p>
        </div>
      );
    }

    if (type === 'MissionBlock' || type === 'DNAFeaturesBlock') {
      return (
        <div className="py-24 px-12 bg-white text-slate-900 flex flex-col items-center">
           <div className="max-w-4xl w-full">
             <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight" style={{ color: props.accent_color || '#0f172a' }}>{props.headline || "Core Features"}</h2>
             {props.body_text && <p className="text-slate-600 text-xl md:text-2xl leading-relaxed font-light mb-12 border-l-4 pl-6" style={{ borderColor: props.accent_color || '#cbd5e1' }}>{props.body_text}</p>}
             {props.features && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 mt-8">
                 {props.features.map((f: any, i: number) => (
                   <div key={i} className="flex flex-col group">
                     <div className="w-12 h-1 mb-6 transition-all duration-500 group-hover:w-full" style={{ backgroundColor: props.accent_color || '#0f172a' }}></div>
                     <h3 className="text-2xl font-bold text-slate-900 mb-3">{f.title}</h3>
                     <p className="text-lg text-slate-500 leading-relaxed">{f.desc}</p>
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      );
    }

    if (type === 'PaletteBlock') {
      return (
        <div className="py-24 px-12 bg-slate-50 flex flex-col items-center">
          <div className="max-w-4xl w-full">
             <div className="flex items-center gap-4 mb-12">
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase">Color Palette</h2>
               <div className="flex-1 h-px bg-slate-300"></div>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-0 shadow-2xl rounded-2xl overflow-hidden">
                {props.colors && props.colors.map((color: string, i: number) => (
                   <div 
                     key={i} 
                     className="aspect-[3/4] relative group cursor-pointer flex flex-col justify-end p-6 transition-transform hover:-translate-y-2 hover:z-10" 
                     style={{backgroundColor: color}}
                     onClick={() => copyToClipboard(color)}
                   >
                      <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 text-center">
                        <span className="text-xs font-mono font-bold text-slate-800 uppercase tracking-widest">{copiedColor === color ? 'COPIED' : color}</span>
                      </div>
                   </div>
                ))}
             </div>
             <p className="text-lg text-slate-500 mt-10 max-w-2xl font-light">{props.description}</p>
          </div>
        </div>
      );
    }

    if (type === 'TypographyBlock') {
      return (
        <div className="py-24 px-12 bg-white text-slate-900 flex flex-col items-center">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-16">
             <div className="flex flex-col justify-center">
               <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight uppercase mb-8">Typography</h2>
               <p className="text-lg text-slate-500 leading-relaxed font-light mb-8">{props.rationale}</p>
             </div>
             <div className="space-y-12">
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-400 uppercase tracking-widest mb-4 font-bold">Primary Font</div>
                  <div className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter truncate">{props.heading_font || "Inter"}</div>
                  <div className="text-3xl text-slate-300 font-black mt-2">Aa Bb Cc</div>
                </div>
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <div className="text-xs text-slate-400 uppercase tracking-widest mb-4 font-bold">Secondary Font</div>
                  <div className="text-4xl text-slate-700 font-medium truncate">{props.body_font || "Roboto"}</div>
                  <div className="text-2xl text-slate-400 font-medium mt-2">Aa Bb Cc</div>
                </div>
             </div>
          </div>
        </div>
      );
    }

    if (type === 'GalleryBlock' || type === 'AppMockupBlock') {
      return (
        <div className="w-full aspect-video bg-slate-900 relative flex flex-col items-center justify-center overflow-hidden">
           {props.screen_url || (props.images && props.images[0]?.url) ? (
             <img src={props.screen_url || props.images[0].url} className="w-full h-full object-cover opacity-90 transition-transform duration-1000 hover:scale-105" />
           ) : (
             <div className="text-center p-12 max-w-lg">
                <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                <div className="text-slate-400 font-mono text-lg mb-2">{props.app_name || "Visual Asset Layout"}</div>
                <div className="text-slate-500 text-sm">{props.screen_prompt || (props.images && props.images[0]?.prompt)}</div>
             </div>
           )}
        </div>
      );
    }

    // ═══ NEW: StatsBlock ═══
    if (type === 'StatsBlock') {
      const stats = props.stats || [
        { value: '150+', label: 'Projects Completed' },
        { value: '98%', label: 'Client Satisfaction' },
        { value: '50M+', label: 'Revenue Generated' },
        { value: '12', label: 'Industry Awards' },
      ];
      return (
        <div className="py-20 px-12 flex flex-col items-center" style={{ backgroundColor: props.background_color || '#0f172a' }}>
          <div className="max-w-5xl w-full">
            {props.headline && <h2 className="text-3xl font-black text-white text-center mb-16 uppercase tracking-wider">{props.headline}</h2>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-5xl md:text-6xl font-black text-white mb-2 tracking-tight" style={{ color: props.accent_color || '#06B6D4' }}>{s.value}</div>
                  <div className="text-sm text-white/60 font-medium uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ═══ NEW: TestimonialBlock ═══
    if (type === 'TestimonialBlock') {
      return (
        <div className="py-24 px-12 flex flex-col items-center" style={{ backgroundColor: props.background_color || '#f8fafc' }}>
          <div className="max-w-3xl w-full text-center">
            <Quote className="w-12 h-12 mx-auto mb-8 opacity-20" style={{ color: props.accent_color || '#0f172a' }} />
            <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8" style={{ color: props.text_color || '#1e293b' }}>
              "{props.quote || 'Working with this brand was transformative for our business.'}"
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              {props.avatar_url && <img src={props.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />}
              <div className="text-left">
                <div className="font-bold text-sm" style={{ color: props.text_color || '#1e293b' }}>{props.author || 'Client Name'}</div>
                <div className="text-xs opacity-60" style={{ color: props.text_color || '#1e293b' }}>{props.role || 'CEO, Company'}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ═══ NEW: TimelineBlock ═══
    if (type === 'TimelineBlock' || type === 'ProcessBlock') {
      const steps = props.steps || [
        { title: 'Discovery', desc: 'Nghiên cứu thị trường và đối thủ' },
        { title: 'Strategy', desc: 'Xây dựng chiến lược thương hiệu' },
        { title: 'Design', desc: 'Thiết kế hệ thống nhận diện' },
        { title: 'Launch', desc: 'Triển khai và đo lường' },
      ];
      return (
        <div className="py-24 px-12 bg-white flex flex-col items-center">
          <div className="max-w-4xl w-full">
            <h2 className="text-3xl md:text-4xl font-black mb-16 tracking-tight" style={{ color: props.accent_color || '#0f172a' }}>
              {props.headline || 'Our Process'}
            </h2>
            <div className="space-y-0">
              {steps.map((step: any, i: number) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" 
                      style={{ backgroundColor: props.accent_color || '#0f172a' }}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    {i < steps.length - 1 && <div className="w-px flex-1 bg-slate-200 my-2" />}
                  </div>
                  <div className="pb-12">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-base text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ═══ NEW: BeforeAfterBlock ═══
    if (type === 'BeforeAfterBlock' || type === 'ComparisonBlock') {
      return (
        <div className="py-20 px-12 bg-slate-50 flex flex-col items-center">
          <div className="max-w-5xl w-full">
            <h2 className="text-3xl font-black text-slate-900 mb-12 text-center tracking-tight">{props.headline || 'Transformation'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 relative">
                <span className="absolute -top-3 left-6 bg-red-100 text-red-600 text-[10px] font-bold uppercase px-3 py-1 rounded-full">Before</span>
                {props.before_image ? <img src={props.before_image} alt="Before" className="w-full rounded-lg mb-4" /> : null}
                <p className="text-slate-500 text-sm leading-relaxed">{props.before_text || 'Previous state description'}</p>
              </div>
              <div className="bg-white rounded-2xl p-8 border-2 relative" style={{ borderColor: props.accent_color || '#06B6D4' }}>
                <span className="absolute -top-3 left-6 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full" style={{ backgroundColor: props.accent_color || '#06B6D4' }}>After</span>
                {props.after_image ? <img src={props.after_image} alt="After" className="w-full rounded-lg mb-4" /> : null}
                <p className="text-slate-700 text-sm leading-relaxed font-medium">{props.after_text || 'Improved state description'}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Fallback
    return <div className="py-12 bg-amber-50 text-amber-600 text-center font-mono text-sm border-y border-amber-200">⚠ Block Type: {type} — Rendering as placeholder</div>;
  };

  // ════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════

  return (
    <div className="w-full h-[100vh] flex flex-col overflow-hidden relative z-10 py-5 px-5 lg:px-6">
      
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3 text-foreground">
          <div className="w-11 h-11 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
            <Palette className="w-5 h-5 text-cyan-500" />
          </div>
          <div>
            <h1 className="page-title">Design Studio</h1>
            <p className="page-desc text-[11px]">AI-powered Visual Identity · Case Study · Brand Deck</p>
          </div>
        </div>
        
        {/* TABS */}
        <div className="flex bg-linear-surface border border-linear-border rounded-xl p-1 gap-0.5">
           <button onClick={() => setActiveTab('visuals')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'visuals' ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'text-linear-text-muted hover:text-foreground hover:bg-white/5'}`}>
             <ImageIcon className="w-3.5 h-3.5" /> Visuals
           </button>
           <button onClick={() => setActiveTab('case-study')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'case-study' ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20' : 'text-linear-text-muted hover:text-foreground hover:bg-white/5'}`}>
             <Layers className="w-3.5 h-3.5" /> Case Study
           </button>
           <button onClick={() => setActiveTab('deck-builder')} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${activeTab === 'deck-builder' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-linear-text-muted hover:text-foreground hover:bg-white/5'}`}>
              <Sparkles className="w-3.5 h-3.5" /> Brand Deck
           </button>
        </div>
      </div>

      <DNAContextBanner />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 pb-2">
        
        {/* ═══════════ COLUMN 1: INPUT PANEL ═══════════ */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-4">
          
          {/* Step Indicator */}
          <StepIndicator 
            currentStep={!hasData ? 0 : !(hasVisuals || hasCaseStudy) ? 1 : 2}
            steps={[
              { label: 'Brand DNA', done: hasData },
              { label: 'Generate', done: hasVisuals || hasCaseStudy },
              { label: 'Refine', done: false },
            ]}
          />

          {/* DNA Card */}
          <motion.div className="section-card p-5 flex flex-col shrink-0">
            <div className="flex items-center mb-4 pb-2.5 border-b border-linear-border/50">
              <Network className="w-4 h-4 mr-2 text-indigo-400" />
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">DNA Sync</h2>
              <div className="ml-auto flex items-center">
                <span className="flex w-2 h-2 rounded-full bg-indigo-500 animate-ping mr-2"></span>
                <span className="text-[9px] text-indigo-400 font-mono">LIVE</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <div className="text-[9px] font-bold text-linear-text-muted uppercase mb-0.5">Brand</div>
                  <div className="text-xs font-bold text-foreground truncate">{masterDNA.brand_name}</div>
                </div>
                <div className="flex-1">
                  <div className="text-[9px] font-bold text-linear-text-muted uppercase mb-0.5">Industry</div>
                  <div className="text-xs font-medium text-foreground truncate">{masterDNA.industry}</div>
                </div>
              </div>
              <div>
                <div className="text-[9px] font-bold text-linear-text-muted uppercase mb-0.5">Goal</div>
                <div className="text-[11px] text-foreground bg-linear-surface p-2 rounded border border-linear-border/50 line-clamp-2">{masterDNA.goal}</div>
              </div>
              {masterDNA.core_usps.length > 0 && (
                <div>
                  <div className="text-[9px] font-bold text-linear-text-muted uppercase mb-1">USPs</div>
                  <div className="flex flex-wrap gap-1">
                    {masterDNA.core_usps.slice(0, 4).map((usp: string, i: number) => (
                      <span key={i} className="text-[9px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded font-medium">{usp}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Prompt */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <div className="text-[9px] font-bold text-cyan-400 uppercase">Custom Prompt</div>
                <button 
                  onClick={() => {
                    const suggestion = `Thiết kế phong cách ${masterDNA.tone_of_voice || 'hiện đại'}, ngành ${masterDNA.industry || 'kinh doanh'}. Nổi bật: ${masterDNA.core_usps?.join(', ') || 'sáng tạo'}. Target: ${masterDNA.target_audience || 'đại chúng'}.`;
                    setPromptData({...promptData, userPrompt: suggestion});
                  }}
                  className="text-[9px] text-cyan-500 hover:text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded transition-colors"
                >
                  ✨ Auto-fill
                </button>
              </div>
              <textarea 
                className="w-full bg-linear-surface/50 p-2.5 rounded-lg border border-cyan-500/20 text-xs text-foreground focus:ring-1 focus:ring-cyan-500 focus:outline-none resize-none h-20 placeholder-slate-500 shadow-inner"
                placeholder="Ví dụ: Dark green, futuristic, tech-oriented..."
                value={promptData.userPrompt}
                onChange={(e) => setPromptData({...promptData, userPrompt: e.target.value})}
              ></textarea>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="mt-4 w-full py-3 rounded-xl flex items-center justify-center font-bold text-white text-sm transition-all bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 shadow-lg shadow-cyan-500/10"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Palette className="w-4 h-4 mr-2" />} 
              Generate Full Suite
            </button>
            
            <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 text-red-400 p-2.5 rounded-lg flex items-start text-[11px] mt-3"
                  >
                    <AlertCircle className="w-3.5 h-3.5 mr-1.5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Actions after generation */}
          {(hasVisuals || hasCaseStudy) && activeTab !== 'deck-builder' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bento-card p-4">
              <div className="text-[9px] font-bold text-emerald-400 uppercase mb-2">✅ Ready to explore</div>
              <div className="space-y-1.5">
                {hasVisuals && (
                  <button onClick={() => setActiveTab('visuals')} className={`w-full text-left text-[11px] p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'visuals' ? 'bg-cyan-500/10 text-cyan-400' : 'text-linear-text-muted hover:bg-white/5'}`}>
                    <ImageIcon className="w-3.5 h-3.5" /> Logo + Banner + Avatar
                  </button>
                )}
                {hasCaseStudy && (
                  <button onClick={() => setActiveTab('case-study')} className={`w-full text-left text-[11px] p-2 rounded-lg flex items-center gap-2 transition-colors ${activeTab === 'case-study' ? 'bg-cyan-500/10 text-cyan-400' : 'text-linear-text-muted hover:bg-white/5'}`}>
                    <Layers className="w-3.5 h-3.5" /> Behance Case Study ({blocks.length} blocks)
                  </button>
                )}
                <button onClick={() => setActiveTab('deck-builder')} className="w-full text-left text-[11px] p-2 rounded-lg flex items-center gap-2 text-amber-400 hover:bg-amber-500/10 transition-colors">
                  <Sparkles className="w-3.5 h-3.5" /> Generate Brand Deck →
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* ═══════════ COLUMN 2: CANVAS ═══════════ */}
        <div className="lg:col-span-6 flex flex-col overflow-y-auto no-scrollbar pb-4 relative rounded-xl border-x border-linear-border/30 px-2 select-none">
           
           {/* EMPTY STATE — Tab-specific */}
           {!loading && !result && blocks.length === 0 && activeTab !== 'deck-builder' && (
              <div className="w-full h-full p-10 flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 flex items-center justify-center border border-cyan-500/20">
                  {activeTab === 'visuals' ? <ImageIcon className="w-10 h-10 text-cyan-500/40" /> : <Layers className="w-10 h-10 text-cyan-500/40" />}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                   {activeTab === 'visuals' ? 'Visual Assets Canvas' : 'Behance Case Study'}
                </h3>
                <p className="text-sm text-linear-text-muted text-center max-w-md mb-6">
                   {activeTab === 'visuals' 
                      ? 'AI sẽ dùng DALL-E 3 để sinh Logo, Banner, Avatar và Brand Guidelines từ Brand DNA của bạn.' 
                      : 'AI sẽ sinh layout phong cách Behance chuyên nghiệp với Hero, Palette, Typography, Stats và nhiều hơn nữa.'}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-linear-text-muted/60">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> ~30-60s</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Lightbulb className="w-3 h-3" /> Dựa trên Brand DNA</span>
                </div>
              </div>
           )}

           {loading && (
              <div className="w-full h-full p-10 flex flex-col items-center justify-center min-h-[500px]">
                <div className="relative">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="w-16 h-16 rounded-2xl border-2 border-cyan-500/20 border-t-cyan-500 flex items-center justify-center"
                  />
                  <Palette className="w-6 h-6 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h3 className="text-base font-bold text-cyan-400 mt-6">AI đang thiết kế...</h3>
                <p className="text-xs text-linear-text-muted mt-2">DALL-E Visuals + Behance Layout chạy song song</p>
              </div>
           )}

           {/* TAB: VISUALS */}
           {!loading && result && activeTab === 'visuals' && (
              <div className="flex flex-col gap-8">
                  {/* Executive Identity Summary */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                     <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                     
                     <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-cyan-300 mb-6">
                           <Sparkles className="w-3.5 h-3.5" /> Brand Identity Protocol
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{masterDNA?.brand_name}</h2>
                        <p className="text-lg md:text-xl text-slate-300 font-light max-w-3xl leading-relaxed mb-10">
                           Thiết kế nhận diện được xây dựng trên triết lý <strong className="text-white font-medium">Mindful Dining</strong>. Chúng tôi kết hợp các sắc độ của thiên nhiên (Earth Tones) để mang lại cảm giác bình yên, xoa dịu áp lực (Burn-out) cho giới văn phòng.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                              <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2"><Type className="w-4 h-4" /> Naming & Tone</h3>
                              <p className="text-sm text-slate-300 leading-relaxed">Tên Fanpage chính thức: <strong className="text-white">Bếp Nhà Mộc - Corporate Catering</strong>. Giọng điệu (Tone of Voice): Điềm tĩnh, thấu cảm, chuyên nghiệp.</p>
                           </div>
                           <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                              <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Cover Art Concept</h3>
                              <p className="text-sm text-slate-300 leading-relaxed">Hình ảnh mâm cơm gia đình với ánh sáng hoàng hôn ấm áp. Tạo cảm giác "Về Nhà" ngay tại bàn làm việc văn phòng.</p>
                           </div>
                           <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                              <h3 className="text-amber-400 font-bold mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Visual Anchor</h3>
                              <p className="text-sm text-slate-300 leading-relaxed">Logo sử dụng nét chữ thư pháp hiện đại (Modern Calligraphy) kết hợp với icon Lá mầm xanh biểu thị sự sống và tái tạo năng lượng.</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Logo Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bento-card p-0 overflow-hidden border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] h-full">
                       <div className="p-4 border-b border-linear-border flex justify-between items-center bg-linear-surface/50">
                          <div className="flex items-center font-bold text-sm text-foreground">
                            <Briefcase className="w-4 h-4 text-cyan-500 mr-2" /> Master Brand Logo
                          </div>
                          <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md flex items-center">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Vector Approved
                          </span>
                       </div>
                       <div className="aspect-[4/3] bg-slate-900 flex flex-col items-center justify-center p-8 relative">
                          <img src={result.logo_url} alt="Logo" className="w-[70%] h-[70%] object-cover rounded-3xl drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] hover:scale-105 transition-transform duration-700" />
                       </div>
                    </div>
                    
                    {/* Color Specs (Next to Logo) */}
                    <div className="bento-card p-6 flex flex-col justify-center border-slate-200/50 shadow-sm">
                       <h3 className="font-bold text-foreground text-lg mb-6">Color System</h3>
                       <div className="space-y-4">
                          {[
                            { hex: "#064E3B", name: "Deep Forest", usage: "Primary Brand Color" },
                            { hex: "#B45309", name: "Amber Wood", usage: "CTA & Accents" },
                            { hex: "#FEF3C7", name: "Warm Cream", usage: "Backgrounds" }
                          ].map(c => (
                            <div key={c.hex} className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl shadow-inner border border-black/5" style={{backgroundColor: c.hex}}></div>
                               <div>
                                  <div className="font-bold text-sm text-foreground">{c.name}</div>
                                  <div className="text-xs text-linear-text-muted font-mono">{c.hex} • {c.usage}</div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>

                  {/* High-Fidelity Fanpage Mockup */}
                  <div className="bento-card p-0 overflow-hidden relative bg-white dark:bg-[#18191A] font-sans border-0 shadow-2xl ring-1 ring-slate-200 dark:ring-white/10">
                     <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-[#F0F2F5] dark:bg-[#242526]">
                        <div className="flex items-center font-bold text-xs text-foreground">
                          <div className="text-[#0866FF] text-2xl font-black tracking-tighter mr-4 select-none leading-none">facebook</div>
                          <span className="text-slate-500 font-medium">Giao diện Nhận diện Kênh Social</span>
                        </div>
                     </div>
                     
                     <div className="relative pb-0 bg-white dark:bg-[#242526]">
                        {/* Cover Image */}
                        <div className="w-full h-[280px] md:h-[350px] relative overflow-hidden group">
                          <img src={result.banner_url} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        </div>
                        
                        {/* Avatar & Info */}
                        <div className="px-6 md:px-10 -mt-16 md:-mt-20 relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between">
                           <div className="flex flex-col md:flex-row items-center md:items-end w-full">
                              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-[#242526] overflow-hidden relative shadow-2xl bg-white shrink-0">
                                 <img src={result?.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                              </div>
                              <div className="mt-4 md:mt-0 md:ml-6 mb-2 text-center md:text-left flex-1">
                                 <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{masterDNA?.brand_name} - Corporate Catering</h2>
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                                       <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                    </div>
                                 </div>
                                 <div className="text-sm font-semibold text-slate-500 dark:text-[#B0B3B8] flex items-center justify-center md:justify-start gap-2">
                                    <span className="text-black dark:text-white font-bold">124K</span> người theo dõi • <span className="text-black dark:text-white font-bold">12</span> đang theo dõi
                                 </div>
                              </div>
                              
                              <div className="flex gap-3 mt-6 md:mt-0 mb-2 shrink-0">
                                 <button className="px-6 py-2.5 bg-[#0866FF] hover:bg-blue-600 text-white font-bold rounded-lg text-[15px] transition-colors flex items-center gap-2 shadow-md">
                                    <PlusSquare className="w-5 h-5" /> Theo dõi
                                 </button>
                                 <button className="px-6 py-2.5 bg-[#E4E6EB] dark:bg-[#3A3B3C] text-black dark:text-white font-bold rounded-lg text-[15px] hover:bg-[#D8DADF] transition-colors flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5" /> Nhắn tin
                                 </button>
                              </div>
                           </div>
                        </div>
                        
                        {/* Navigation Tabs */}
                        <div className="px-6 md:px-10 mt-6 border-t border-slate-200 dark:border-slate-800 flex gap-2 md:gap-6 pt-1 text-[15px] font-bold text-slate-500 dark:text-[#B0B3B8] overflow-x-auto no-scrollbar">
                           <div className="text-[#0866FF] border-b-[3px] border-[#0866FF] pb-3 pt-4 whitespace-nowrap">Bài viết</div>
                           <div className="pt-4 pb-3 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 rounded-md cursor-pointer transition-colors whitespace-nowrap">Giới thiệu</div>
                           <div className="pt-4 pb-3 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 rounded-md cursor-pointer transition-colors whitespace-nowrap">Đánh giá (4.9⭐)</div>
                           <div className="pt-4 pb-3 hover:bg-slate-100 dark:hover:bg-slate-800 px-4 rounded-md cursor-pointer transition-colors whitespace-nowrap">Thực đơn (Menu)</div>
                        </div>
                     </div>
                     
                     {/* Content Area Mockup */}
                     <div className="bg-[#F0F2F5] dark:bg-[#18191A] p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-inner">
                        <div className="col-span-1 space-y-4">
                           {/* About Box */}
                           <div className="bg-white dark:bg-[#242526] p-5 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-slate-800/50">
                              <h3 className="font-bold text-black dark:text-[#E4E6EB] mb-4 text-[17px]">Giới thiệu</h3>
                              <p className="text-[15px] text-slate-600 dark:text-[#B0B3B8] leading-relaxed mb-6">{masterDNA?.goal}</p>
                              <div className="space-y-4 text-[15px] text-black dark:text-[#E4E6EB] font-medium">
                                 <div className="flex items-center gap-3"><Info className="w-6 h-6 text-slate-400" /> Ngành hàng: <span className="font-bold">{masterDNA?.industry}</span></div>
                                 <div className="flex items-center gap-3"><Globe className="w-6 h-6 text-slate-400" /> <span className="text-[#0866FF] hover:underline cursor-pointer">{masterDNA?.brand_name?.toLowerCase().replace(/\s/g, '') || 'website'}.vn</span></div>
                              </div>
                           </div>
                           
                           {/* USPs Box */}
                           <div className="bg-white dark:bg-[#242526] p-5 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-slate-800/50">
                              <h3 className="font-bold text-black dark:text-[#E4E6EB] mb-4 text-[17px]">Điểm nổi bật</h3>
                              <div className="flex flex-wrap gap-2">
                                 {masterDNA?.core_usps?.slice(0,4).map((usp: string, i: number) => (
                                    <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full">{usp}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                        
                        <div className="col-span-1 md:col-span-2 space-y-4">
                           {/* Post Box */}
                           <div className="bg-white dark:bg-[#242526] rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-slate-200/50 dark:border-slate-800/50 pt-4 pb-2">
                              <div className="px-4 flex items-center gap-3 mb-3">
                                 <div className="w-10 h-10 rounded-full overflow-hidden shrink-0"><img src={result?.avatar_url} className="w-full h-full object-cover" /></div>
                                 <div>
                                    <div className="font-bold text-black dark:text-[#E4E6EB] text-[15px] hover:underline cursor-pointer">{masterDNA?.brand_name}</div>
                                    <div className="text-[13px] text-slate-500 font-medium hover:underline cursor-pointer">1 giờ trước • 🌍</div>
                                 </div>
                              </div>
                              <div className="px-4 text-[15px] text-black dark:text-[#E4E6EB] leading-relaxed mb-3">
                                 🌿 Bữa trưa nay, hãy để chúng tôi chăm sóc bạn! 🌿<br/><br/>
                                 Thay vì những món chiên xào nặng bụng, {masterDNA?.brand_name} mang đến cho khối Corporate một giải pháp Mindful Dining với cơm ST25 dẻo thơm, rau củ thanh mát và hộp bã mía tự hủy hoàn toàn.<br/><br/>
                                 Gửi gắm sự an yên vào từng bữa ăn trưa. Inbox ngay để nhận Set cơm trải nghiệm (Sampling) cho Doanh nghiệp của bạn!
                              </div>
                              <div className="w-full aspect-[4/3] overflow-hidden relative group mt-3 rounded-lg border border-slate-200 dark:border-slate-700">
                                 <img src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover" />
                              </div>
                              <div className="px-4 py-2 mt-2">
                                 <div className="flex justify-between items-center text-[15px] text-slate-500 dark:text-[#B0B3B8] border-b border-slate-200 dark:border-slate-700 pb-3">
                                    <div className="flex items-center gap-1">
                                      <div className="bg-[#0866FF] p-1 rounded-full"><PlusSquare className="w-3 h-3 text-white fill-white" /></div> 
                                      <span className="font-medium">1,2K</span>
                                    </div>
                                    <div className="hover:underline cursor-pointer">42 Bình luận • 15 Chia sẻ</div>
                                 </div>
                                 <div className="flex justify-between text-slate-500 dark:text-[#B0B3B8] pt-1">
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-100 dark:hover:bg-[#3A3B3C] rounded-md transition-colors"><PlusSquare className="w-5 h-5" /> <span className="font-semibold text-[15px]">Thích</span></button>
                                    <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-slate-100 dark:hover:bg-[#3A3B3C] rounded-md transition-colors"><MessageCircle className="w-5 h-5" /> <span className="font-semibold text-[15px]">Bình luận</span></button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Guidelines */}
                  {result?.guidelines && (
                     <div className="bento-card p-5 relative overflow-hidden">
                        <div className="flex items-center font-bold text-xs text-foreground mb-3 border-b border-linear-border/50 pb-2.5">
                           <Type className="w-3.5 h-3.5 text-cyan-500 mr-2" /> Brand Identity Guidelines
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                           <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
                              {result.guidelines}
                           </pre>
                        </div>
                     </div>
                  )}
              </div>
           )}

           {/* TAB: CASE STUDY */}
           {!loading && blocks.length > 0 && activeTab === 'case-study' && (
              <div className="flex flex-col gap-5 w-full">
                  <div id="behance-export-canvas" className="w-full bg-slate-50 shadow-2xl flex flex-col overflow-hidden max-w-[1400px] mx-auto rounded-none relative">
                    {blocks.map((block) => (
                         <div key={block.id} className="relative transition-all duration-300 w-full group">
                            <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/30 z-50 pointer-events-none transition-colors"></div>
                            {renderBlock(block)}
                         </div>
                    ))}
                  </div>
                  
                  <div className="pt-8 pb-16 flex justify-center border-t border-linear-border/30 mt-4">
                     <button onClick={handleExportPDF} className="flex items-center px-8 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all font-bold text-sm">
                        <FileText className="w-4 h-4 mr-2 text-cyan-400" />
                        Download High-Res PDF
                     </button>
                  </div>
              </div>
           )}

           {/* TAB: DECK BUILDER */}
           {activeTab === 'deck-builder' && (
             <div className="flex flex-col gap-5 w-full h-full">
               {deckSlides.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-700">
                   <div className="w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/30 shadow-xl">
                     <Sparkles className="w-10 h-10 text-amber-400" />
                   </div>
                   <h2 className="text-xl font-bold text-foreground mb-2">Brand Deck Builder</h2>
                   <p className="text-linear-text-muted text-xs text-center max-w-lg mb-8">
                     AI tự sinh Brand Guideline, Pitch Deck, hoặc Proposal chuẩn enterprise.
                     Chỉnh sửa trực tiếp kiểu Canva và xuất PDF/PPTX.
                   </p>
                   
                   <div className="flex gap-3 mb-8">
                     {([
                       { key: 'brand_guideline' as const, icon: '🎨', label: 'Brand Guideline', desc: '8 slides nhận diện' },
                       { key: 'pitch_deck' as const, icon: '🚀', label: 'Pitch Deck', desc: '8 slides gọi vốn' },
                       { key: 'proposal' as const, icon: '📊', label: 'Proposal', desc: '7 slides chiến dịch' },
                     ]).map(tmpl => (
                       <button
                         key={tmpl.key}
                         onClick={() => setDeckTemplate(tmpl.key)}
                         className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all min-w-[150px] ${
                           deckTemplate === tmpl.key
                             ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                             : 'border-linear-border/50 bg-background/50 hover:border-amber-500/30'
                         }`}
                       >
                         <span className="text-2xl mb-1.5">{tmpl.icon}</span>
                         <span className="text-[11px] font-bold text-foreground">{tmpl.label}</span>
                         <span className="text-[9px] text-linear-text-muted mt-0.5">{tmpl.desc}</span>
                       </button>
                     ))}
                   </div>
                   
                   <button
                     onClick={handleGenerateDeck}
                     disabled={deckLoading}
                     className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-bold text-sm shadow-lg shadow-orange-500/20 hover:scale-105 transition-all flex items-center disabled:opacity-50 disabled:hover:scale-100"
                   >
                     {deckLoading ? (
                       <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI đang thiết kế...</>
                     ) : (
                       <>Sinh Deck bằng AI <ChevronRight className="w-4 h-4 ml-2" /></>
                     )}
                   </button>
                   
                   {deckError && (
                     <div className="mt-4 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg text-xs flex items-center">
                       <AlertCircle className="w-4 h-4 mr-2" /> {deckError}
                     </div>
                   )}
                 </div>
               ) : (
                 <SlideEditor
                   slides={deckSlides}
                   onSlidesChange={setDeckSlides}
                   brandName={masterDNA.brand_name}
                   templateType={deckTemplate}
                 />
               )}
             </div>
           )}

        </div>

        {/* ═══════════ COLUMN 3: AGENT LOGS ═══════════ */}
        <div className="lg:col-span-3 flex flex-col gap-4 overflow-y-auto no-scrollbar pb-4 relative">
           <div className="bento-card p-0 flex flex-col flex-1 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)] relative overflow-hidden">
              <div className="p-3.5 border-b border-linear-border flex justify-between items-center bg-linear-surface/80 backdrop-blur-md shrink-0">
                 <div className="flex items-center">
                   <TerminalSquare className="w-3.5 h-3.5 text-cyan-500 mr-2" />
                   <h4 className="font-bold text-xs text-foreground tracking-wide">Agent Logs</h4>
                 </div>
                 <div className="flex items-center gap-2">
                   {agentLogs.length > 0 && (
                     <span className="text-[9px] text-linear-text-muted font-mono">{agentLogs.length} events</span>
                   )}
                   <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></div>
                 </div>
              </div>

              <div className="flex-1 bg-linear-surface/30 p-4 overflow-y-auto no-scrollbar flex flex-col relative">
                 {agentLogs.length === 0 ? (
                   <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                     <TerminalSquare className="w-8 h-8 text-linear-text-muted/20 mb-3" />
                     <div className="text-[11px] text-linear-text-muted font-medium">Agent logs sẽ xuất hiện ở đây</div>
                     <div className="text-[9px] text-linear-text-muted/60 mt-1">Nhấn "Generate Full Suite" để bắt đầu</div>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-2">
                     {agentLogs.map(log => (
                       <div key={log.id} className={`p-2 rounded-lg text-[11px] font-mono border ${log.type === 'warn' ? 'border-amber-500/20 bg-amber-500/5 text-amber-400' : log.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' : 'border-linear-border bg-background/50 text-linear-text-muted'}`}>
                          <div className="opacity-50 text-[8px] mb-0.5">[{log.time}] {log.agent}</div> 
                          <div className="font-medium">{log.text}</div>
                       </div>
                     ))}
                     <div ref={logsEndRef} />
                   </div>
                 )}
              </div>
           </div>

           {/* Quick Tips */}
           <div className="bento-card p-4 shrink-0">
             <div className="text-[9px] font-bold text-amber-400 uppercase mb-2 flex items-center gap-1">
               <Lightbulb className="w-3 h-3" /> Tips
             </div>
             <div className="space-y-1.5 text-[10px] text-linear-text-muted">
               <div className="flex items-start gap-1.5">
                 <span className="text-cyan-400 mt-0.5">•</span>
                 <span>Tab <b className="text-foreground">Visuals</b>: Logo + Banner từ DALL-E 3</span>
               </div>
               <div className="flex items-start gap-1.5">
                 <span className="text-cyan-400 mt-0.5">•</span>
                 <span>Tab <b className="text-foreground">Case Study</b>: Layout Behance + export PDF</span>
               </div>
               <div className="flex items-start gap-1.5">
                 <span className="text-amber-400 mt-0.5">•</span>
                 <span>Tab <b className="text-foreground">Brand Deck</b>: Slide editor + export PPTX</span>
               </div>
               <div className="flex items-start gap-1.5">
                 <span className="text-emerald-400 mt-0.5">•</span>
                 <span>Custom Prompt giúp kiểm soát phong cách thiết kế</span>
               </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
}
