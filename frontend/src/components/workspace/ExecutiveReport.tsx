import React from 'react';
import { useFormStore } from '@/store/useFormStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Target, Briefcase, Zap, TrendingUp, ShieldAlert, BarChart3, Layers, MessageSquare, AlertTriangle, CheckCircle2, Globe, Crosshair, ArrowUpRight, Flame, Cpu, Compass } from 'lucide-react';

const COLORS = ['#0f766e', '#0369a1', '#b45309', '#4338ca', '#be185d', '#0f172a', '#3f6212', '#9f1239'];

const DEMO_EXPERT_DATA = {
  "goal_setting": {
    "mission_statement": "Kiến tạo Bếp Nhà Mộc thành 'Thánh địa Mindful Dining' (Ẩm thực chánh niệm) tiên phong tại Sài Gòn phồn hoa. Không chỉ bán một bữa ăn, chúng ta trao đi 'Liệu pháp Chữa Lành' qua mâm cơm di sản và không gian 100+ năm tuổi để giải tỏa hội chứng Burnout của giới trẻ thành thị, đồng thời bảo tồn hệ giá trị văn hóa bản địa đang dần mai một.",
    "core_competencies": [
      { "competency": "Lợi thế Độc quyền (VRIO): Kiến trúc nhà cổ Bắc Bộ nguyên bản 120 năm tuổi giữa lòng Sài Gòn tạo ra 'Môi trường trị liệu' tĩnh lặng tuyệt đối, rào cản gia nhập thị trường (Barrier to Entry) gần như tuyệt đối do tính khan hiếm của bất động sản.", "is_vrio": true },
      { "competency": "Chuỗi cung ứng Vertical Integration: Nguồn cung 100% Organic khép kín từ 3 Farm vệ tinh tại Đà Lạt và Củ Chi. Khẳng định triết lý 'Farm to Table', công thức di sản 3 đời hoàn toàn không sử dụng bột ngọt (No MSG), không chất bảo quản.", "is_vrio": true },
      { "competency": "Intellectual Property (IP): Bộ nhận diện 'Mộc' đã đăng ký bảo hộ độc quyền. Quy trình chuẩn hóa (SOPs) dịch vụ khách hàng 'Từ Tâm' đã được hệ thống hóa, sẵn sàng cho lộ trình nhượng quyền (Franchise) hoặc gọi vốn (Series A).", "is_vrio": false },
      { "competency": "First-Mover Advantage: Khai phá đại dương xanh trong ngách 'Wellness Dining', kết hợp hoàn hảo giữa ẩm thực hoài niệm và mô hình O2O Loyalty hiện đại, đi trước đối thủ ít nhất 18 tháng.", "is_vrio": true },
      { "competency": "Talent Acquisition: Đội ngũ Bếp trưởng xuất thân từ nghệ nhân ẩm thực Hoàng gia Huế, kết hợp cùng đội ngũ R&D trẻ am hiểu sâu sắc về dinh dưỡng hiện đại (Macro/Micro Nutrients).", "is_vrio": false }
    ],
    "objectives": {
      "financial_goals": [
        "Vượt đỉnh trì trệ (1.2 tỷ/tháng). Tăng trưởng Net Revenue lên mốc 2.5 tỷ VNĐ/tháng (+108%) trong Quý 1, hướng tới 3.8 tỷ vào Quý 3/2026.",
        "Tối ưu hóa Food Cost (Giá vốn) xuống dưới 26.5% bằng cách bao tiêu nông sản, đẩy Gross Margin lên mức 73.5%.",
        "EBITDA dự phóng đạt 28.4% (Mức xuất sắc trong ngành F&B) tương đương 1.07 tỷ VNĐ/tháng thông qua tối ưu hóa vận hành khung giờ thấp điểm (Idle Time Optimization)."
      ],
      "marketing_goals": [
        "Thống lĩnh Share of Voice (SOV) ngách 'Ẩm thực chữa lành'. Lọt Top 3 điểm check-in Cinematic nhất do các tạp chí Lifestyle bình chọn trong 2 quý liên tiếp.",
        "Xây dựng tệp khách hàng trung thành: Thu thập 35,000+ First-Party Data qua Zalo Mini App. Nâng Retention Rate từ 15% lên 55%.",
        "Tối ưu hóa phễu chuyển đổi (Funnel): Giảm CAC (Chi phí thu hút 1 khách mới) từ 250,000đ xuống dưới 35,000đ bằng chiến lược Referral Marketing và UGC (User Generated Content)."
      ],
      "cac_ltv_analysis": "Chiến lược Unit Economics: Tối đa hóa LTV (Life-Time Value) bằng mô hình thẻ thành viên 'Hạt Gạo'. Tỷ lệ LTV:CAC kỳ vọng đạt ngưỡng > 8:1 (Khách hàng quay lại trung bình 4 lần/tháng)."
    },
    "red_lines": [
      "Brand Equity Protection: Tuyệt đối KHÔNG chạy đua 'Deep Discounting' (Giảm giá sâu, Flash Sale) hay cạnh tranh về giá trên các nền tảng Food Delivery (GrabFood, ShopeeFood).",
      "Service Quality Ceiling: Giới hạn tối đa 60 khách/tối để bảo toàn tính độc quyền (Exclusivity), sự tĩnh lặng của không gian và chất lượng phục vụ 1:1.",
      "Authenticity First: Không thỏa hiệp với chất lượng nguyên liệu. Mọi chiến dịch quảng cáo phải dựa trên sự thật (Truth in Advertising). Tuyệt đối không seeding đánh giá giả mạo.",
      "Acoustic Integrity: Không phát nhạc trẻ, nhạc EDM, chỉ sử dụng âm thanh trị liệu (Tiếng nước chảy, đàn tranh, tiếng chuông gió) được đo lường dưới 45dB."
    ]
  },
  "situation_audit": {
    "target_segments": [
      {
        "segment_name": "Core: Urban Healers (Gen Z/Y, 22-35T, Thu nhập Khá+)",
        "dmu_profiles": [
          {
            "role": "Decider (Người quyết định)",
            "pain_points": ["Hội chứng Burnout do KPI/Deadline kéo dài", "Ám ảnh thực phẩm bẩn, chán ngán Fastfood", "Cần không gian trốn áp lực MXH, detox tâm trí"],
            "decision_drivers": ["Kiến trúc Cinematic để check-in chữa lành", "Cam kết 100% Organic, No MSG", "Storytelling thương hiệu chân thật, chạm đến cảm xúc"]
          }
        ],
        "value_proposition": "Food Therapy: Mâm cơm nhà chuẩn vị di sản trong không gian nhà gỗ mộc mạc, giúp xoa dịu áp lực phố thị và tái tạo năng lượng từ gốc.",
        "data_sources": ["Phân tích 500+ Google Reviews", "Báo cáo nội bộ AI Intake Agent"]
      },
      {
        "segment_name": "Secondary: Corporate Executives (35-50T, Thu nhập Cao)",
        "dmu_profiles": [
          {
            "role": "Buyer (Người mua - Thư ký/Trợ lý) / User (Giám đốc)",
            "pain_points": ["Cần không gian riêng tư, đẳng cấp để tiếp khách", "Yêu cầu khắt khe về an toàn vệ sinh thực phẩm", "Chế độ ăn kiêng đặc biệt (Vegan, Keto)"],
            "decision_drivers": ["Phòng VIP cách âm hoàn toàn", "Dịch vụ Butler (Quản gia) phục vụ riêng", "Menu thiết kế cá nhân hóa theo khẩu vị"]
          }
        ],
        "value_proposition": "Executive Mindfulness: Đẳng cấp ẩm thực di sản kết hợp với không gian bảo mật, nâng tầm vị thế chủ nhà trong mọi cuộc gặp gỡ đối tác.",
        "data_sources": ["CRM Data Analysis", "Phỏng vấn sâu 20 khách hàng B2B"]
      },
      {
        "segment_name": "Niche: Expatriates & Tourists (Người nước ngoài)",
        "dmu_profiles": [
          {
            "role": "Initiator (Người khởi xướng)",
            "pain_points": ["Khó tìm kiếm trải nghiệm văn hóa Việt Nam nguyên bản", "Sợ các bẫy du lịch (Tourist traps)", "Rào cản ngôn ngữ trong việc hiểu nguyên liệu"],
            "decision_drivers": ["Menu song ngữ chi tiết câu chuyện nguyên liệu", "Review từ các cộng đồng Expat uy tín", "Trải nghiệm văn hóa đa giác quan"]
          }
        ],
        "value_proposition": "Authentic Vietnam: Hành trình xuyên không gian và thời gian, nếm trọn tinh hoa văn hóa Việt qua từng nguyên liệu bản địa được kể chuyện tinh tế.",
        "data_sources": ["TripAdvisor Trends", "Vietnam Tourism Report 2025"]
      }
    ],
    "directional_policy": {
      "market_attractiveness": "Rất Cao (9.2/10) — Xu hướng Mindful Dining và Wellness đang tăng trưởng 45% YoY toàn cầu, đặc biệt bùng nổ sau đại dịch.",
      "business_strength": "Mạnh (8.5/10) — Sở hữu 'Concept lõi' cực mạnh, kiến trúc độc bản. Tuy nhiên cần hệ thống hóa công nghệ quản trị (ERP/CRM).",
      "investment_decision": "Invest & Expand (Ô Star) — Rót vốn mạnh vào Digital Transformation, O2O và mở rộng sang phân khúc Corporate B2B."
    }
  },
  "strategy": {
    "ansoff_matrix_choice": "Chiến lược Tái định vị (Market Penetration) & Khai phá Sản phẩm mới (Product Development - Corporate Eco Lunch, Wellness Gift Box).",
    "positioning_statement": "Blue Ocean Strategy: Bếp Nhà Mộc không chỉ là nhà hàng, mà là 'Điểm trú ẩn tâm lý' duy nhất kết hợp Ẩm thực di sản, Trị liệu không gian và Công nghệ cá nhân hóa tại trung tâm Sài Gòn.",
    "expected_roi_justification": "Ngân sách đầu tư Phase 1: 1.5 Tỷ VNĐ. Incremental Revenue dự kiến: +1.8 Tỷ VNĐ/tháng. Break-even point (Điểm hòa vốn) của chiến dịch: 45 ngày. ROI ước tính 214% sau 6 tháng triển khai."
  },
  "tactics": {
    "tactics_7ps": [
      { "p_name": "Product", "action_bullet": "Quy hoạch Menu: Giữ Cơm Niêu làm Core, Launch 'Corporate Eco Lunch' & 'Mindful Omakase'.", "kpi": "Tăng 45% doanh thu 11h-14h.", "budget_vnd": 120000000, "budget_allocation_percent": 8.0, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Price", "action_bullet": "Áp dụng Premium Value Pricing (+25%) tương xứng định vị mới. Không giảm giá, chỉ Add-on giá trị.", "kpi": "Gross Margin > 73.5%.", "budget_vnd": 0, "budget_allocation_percent": 0.0, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Promotion", "action_bullet": "Cinematic Brand Film 'Về nhà ăn cơm' & Phủ sóng 50+ Micro-Influencers Lifestyle/Wellness.", "kpi": "5M+ Views, 4000+ Bookings.", "budget_vnd": 450000000, "budget_allocation_percent": 30.0, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Place", "action_bullet": "O2O Lead Gen: Chạy Performance Ads đa kênh (TikTok, FB, Zalo) điều hướng về Booking Engine riêng.", "kpi": "CAC < 35K VNĐ.", "budget_vnd": 350000000, "budget_allocation_percent": 23.3, "moscow_tag": "MUST_HAVE" },
      { "p_name": "Physical Evid.", "action_bullet": "Rebranding Visuals: Nâng cấp Ánh sáng Art-lighting, Bao bì Eco bã mía 100%, Đồng phục Linen thêu tay.", "kpi": "Tăng 60% UGC Check-in.", "budget_vnd": 280000000, "budget_allocation_percent": 18.7, "moscow_tag": "SHOULD_HAVE" },
      { "p_name": "Process", "action_bullet": "Launch Zalo Mini App 'Hạt Gạo' tích hợp AI CRM (Loyalty, Real-time Booking, Habit Tracking).", "kpi": "Retention > 55%.", "budget_vnd": 200000000, "budget_allocation_percent": 13.3, "moscow_tag": "MUST_HAVE" },
      { "p_name": "People", "action_bullet": "Chương trình 'Mindful Host': Đào tạo nhân viên kỹ năng thiền trà và nghệ thuật kể chuyện (Storytelling).", "kpi": "Customer CSAT > 4.8/5.", "budget_vnd": 100000000, "budget_allocation_percent": 6.7, "moscow_tag": "COULD_HAVE" }
    ],
    "total_budget_used": 1500000000,
    "task_ready_checklist": ["Duyệt Storyboard 'Về nhà ăn cơm'", "Chốt Hợp đồng 3 Farm vệ tinh Độc quyền", "Launch Zalo Mini App Phase 1 (Core CRM)", "Sản xuất bao bì Eco & Đồng phục mới", "Thi công hệ thống Art-lighting không gian"]
  },
  "cfo_risk": {
    "cfo_comment": "Từ góc nhìn Tài chính & Quản trị Rủi ro (CFO/CRO): Đòn bẩy 1.5 tỷ VNĐ (chiếm 15% dòng tiền thặng dư dự phóng) là mức đầu tư hoàn toàn nằm trong vùng an toàn (Safe Zone). Cơ cấu phân bổ ngân sách rất hợp lý khi dồn 53.3% vào Growth (Promotion + Place) để tạo lực đẩy doanh thu ngắn hạn, trong khi vẫn dành 46.7% cho Capability Building (Process, People, Physical) tạo hào nước bảo vệ dài hạn.",
    "risk_assessment": [
      { "risk_scenario": "Rủi ro Vận hành (Operational Risk): Quá tải công suất bếp & dịch vụ (Overload) do Marketing tạo hiệu ứng Viral vượt dự kiến.", "trigger_point_metric": "Thời gian lên món (TAT) vượt quá 22 phút (Chuẩn là 15p) & Tỷ lệ hủy bàn > 5%.", "contingency_plan_b": "Kích hoạt Scarcity Mode ngay lập tức: 100% Booking qua Zalo App, đóng hoàn toàn tính năng Walk-in khách vãng lai, tăng giá Surge Pricing 15% vào giờ cao điểm." },
      { "risk_scenario": "Rủi ro Chuỗi cung ứng (Supply Chain Risk): Đứt gãy nguồn nguyên liệu hữu cơ (do thời tiết, logistics), giá nông sản leo thang ảnh hưởng biên lợi nhuận.", "trigger_point_metric": "Food Cost (COGS) vượt trần 29% trong 2 tuần liên tiếp (Chuẩn mục tiêu là 26.5%).", "contingency_plan_b": "Kích hoạt hợp đồng bao tiêu rủi ro (Hedging Contracts) với 3 Farm vệ tinh, đồng thời có sẵn menu linh hoạt (Dynamic Menu) chuyển đổi món dựa trên nguyên liệu dồi dào." },
      { "risk_scenario": "Rủi ro Truyền thông (Reputation Risk): Đối thủ cạnh tranh tung tin đồn thất thiệt về nguồn gốc nguyên liệu thực phẩm, khủng hoảng mạng xã hội.", "trigger_point_metric": "Sentiment Score trên Social Media rớt xuống dưới mức trung lập (< 50) trong 24h.", "contingency_plan_b": "Kích hoạt giao thức Crisis Management: Công bố minh bạch (Real-time Live Camera) toàn bộ quá trình thu hoạch tại Farm và quy trình Bếp mở. Kêu gọi báo chí uy tín đính chính." }
    ]
  }
};

export default function ExecutiveReport() {
  const { wizardAnswers, tacticsPlan, debateLogs, brandDNA } = useFormStore();
  const { t, language } = useLanguage();

  const planData = (tacticsPlan && Object.keys(tacticsPlan).length > 0) ? tacticsPlan : DEMO_EXPERT_DATA;
  
  const goal = planData.goal_setting || DEMO_EXPERT_DATA.goal_setting;
  const audit = planData.situation_audit || DEMO_EXPERT_DATA.situation_audit;
  const strategy = planData.strategy || DEMO_EXPERT_DATA.strategy;
  const tactics = planData.tactics || DEMO_EXPERT_DATA.tactics;
  const cfo = planData.cfo_risk || DEMO_EXPERT_DATA.cfo_risk;
  const brandName = brandDNA?.brand_name || wizardAnswers?.company_name || wizardAnswers?.industry || 'BrandFlow Client';

  const budgetPieData = React.useMemo(() => {
    if (!tactics || !tactics.tactics_7ps) return [];
    return tactics.tactics_7ps.map((act: any) => ({
      name: act.p_name,
      value: act.budget_vnd
    }));
  }, [tactics]);

  const barChartData = [
    { name: 'Tháng 1', Rev: 1200, Margin: 60 },
    { name: 'Tháng 2', Rev: 1800, Margin: 65 },
    { name: 'Tháng 3', Rev: 2500, Margin: 70 },
    { name: 'Tháng 4', Rev: 2900, Margin: 72 },
    { name: 'Tháng 5', Rev: 3400, Margin: 73 },
    { name: 'Tháng 6', Rev: 3800, Margin: 73.5 },
  ];

  // Modern McKinsey/BCG aesthetic report class
  const pageClass = "w-full sm:w-[210mm] mx-auto bg-white text-slate-900 shadow-2xl print:shadow-none print:m-0 relative overflow-hidden font-inter mb-12 print:mb-0 print:break-after-page rounded-sm border border-slate-200/60";
  const innerPageClass = "p-[15mm] sm:p-[20mm] flex flex-col h-full";
  
  const LoraFont = 'font-lora';
  const InterFont = 'font-inter';

  return (
    <div className="flex flex-col items-center pb-8 print:pb-0 bg-slate-100/50 py-12">
      
      {/* ── FONT INJECTION ── */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-lora { font-family: 'Lora', serif; }
        .report-gradient { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
        .glass-panel { background: rgba(255,255,255,0.8); backdrop-filter: blur(12px); border: 1px solid rgba(0,0,0,0.05); }
      `}} />

      {/* ════════════════════════════════════════════════
          PAGE 1: COVER
      ════════════════════════════════════════════════ */}
      <div className={`${pageClass} min-h-[100vh] sm:min-h-[297mm] flex flex-col report-gradient text-white`}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        
        <div className="relative z-10 p-[20mm] flex flex-col h-full flex-1">
          <div className="flex justify-between items-start mb-24">
            <div className="font-inter font-black text-3xl tracking-tighter flex items-center text-white">
              <Zap className="w-8 h-8 mr-2 text-teal-400" />
              BRANDFLOW
            </div>
            <div className="text-right">
              <div className="text-[10px] font-inter font-bold text-teal-400 uppercase tracking-widest border border-teal-400/30 bg-teal-400/10 px-3 py-1.5 inline-block rounded-full">
                Strictly Confidential
              </div>
            </div>
          </div>
          
          <div className="mt-auto mb-32 max-w-[85%]">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-teal-400"></div>
              <h2 className="text-teal-400 font-inter font-bold uppercase tracking-[0.2em] text-xs">Strategic Marketing Plan & Growth Thesis</h2>
            </div>
            <h1 className={`${LoraFont} text-5xl sm:text-[64px] font-bold text-white tracking-tight leading-[1.05] mb-8`}>
              Bản Cáo Bạch<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">Kế Hoạch Chiến Lược</span>
            </h1>
            <p className={`${InterFont} text-slate-300 text-lg leading-relaxed max-w-xl font-light`}>
              Tài liệu hoạch định chiến lược kinh doanh và Marketing tổng thể, được sinh tự động bởi hệ thống Multi-Agent AI (CEO, CMO, CFO, COO) dựa trên nguồn lực lõi của doanh nghiệp.
            </p>
          </div>
          
          <div className="flex justify-between items-end border-t border-slate-700/50 pt-8 mt-auto">
            <div>
              <div className={`${InterFont} text-[10px] text-slate-400 uppercase font-bold mb-2 tracking-[0.15em]`}>Prepared for</div>
              <div className={`${LoraFont} font-bold text-white text-2xl mb-1`}>{brandName}</div>
              <div className={`${InterFont} text-xs text-teal-400 font-medium`}>{wizardAnswers.industry || 'Food & Beverage / Wellness'}</div>
            </div>
            <div className="text-right">
              <div className={`${InterFont} text-[10px] text-slate-400 uppercase font-bold mb-2 tracking-[0.15em]`}>Date Published</div>
              <div className={`${InterFont} font-bold text-white text-lg`}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          PAGE 2: EXECUTIVE SUMMARY & STRATEGIC FOUNDATION
      ════════════════════════════════════════════════ */}
      <div className={`${pageClass}`}>
        <div className={innerPageClass}>
          {/* Header */}
          <header className="border-b border-slate-200 pb-4 mb-8 flex justify-between items-end shrink-0">
            <div className={`${InterFont} text-lg font-black text-slate-900 uppercase tracking-tighter`}>BRANDFLOW</div>
            <div className={`${InterFont} text-slate-400 font-bold text-[9px] tracking-[0.2em] uppercase`}>01 / Strategic Foundation & Objectives</div>
          </header>

          <div className="flex-1">
            {/* Mission Statement */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <Target className="w-5 h-5 text-teal-600 mr-3" />
                <h2 className={`${InterFont} text-sm font-black text-slate-900 uppercase tracking-widest`}>Sứ mệnh & Định vị cốt lõi</h2>
              </div>
              <div className="bg-slate-50 border-l-4 border-teal-600 p-6 rounded-r-lg">
                <p className={`${LoraFont} text-slate-800 text-lg sm:text-xl leading-[1.7] italic`}>
                  "{goal.mission_statement}"
                </p>
              </div>
            </section>

            {/* Core Competencies (VRIO) */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <ShieldAlert className="w-5 h-5 text-teal-600 mr-3" />
                <h2 className={`${InterFont} text-sm font-black text-slate-900 uppercase tracking-widest`}>Phân tích Năng lực Lõi (VRIO Framework)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goal.core_competencies.map((c: any, i: number) => (
                  <div key={i} className="glass-panel p-5 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`${InterFont} text-[10px] font-black uppercase tracking-widest text-teal-600`}>Năng lực {i+1}</span>
                          {c.is_vrio && <span className={`${InterFont} ml-3 text-[8px] bg-slate-900 text-white px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest`}>Lợi thế Bền vững (VRIO)</span>}
                        </div>
                        <p className={`${InterFont} text-sm text-slate-700 leading-[1.6]`}>{c.competency}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Objectives */}
            <section>
              <div className="flex items-center mb-6">
                <TrendingUp className="w-5 h-5 text-teal-600 mr-3" />
                <h2 className={`${InterFont} text-sm font-black text-slate-900 uppercase tracking-widest`}>Tuyên ngôn Mục tiêu (Business Objectives)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
                  <h3 className={`${InterFont} font-black text-slate-900 mb-4 text-xs uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center`}>
                    <BarChart3 className="w-4 h-4 mr-2 text-blue-600" /> Mục tiêu Tài chính (Financial)
                  </h3>
                  <ul className="space-y-3">
                    {goal.objectives.financial_goals.map((g: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mr-3 mt-0.5 shrink-0" />
                        <span className={`${InterFont} text-sm text-slate-600 leading-relaxed`}>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm">
                  <h3 className={`${InterFont} font-black text-slate-900 mb-4 text-xs uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center`}>
                    <Globe className="w-4 h-4 mr-2 text-teal-600" /> Mục tiêu Marketing & Thị phần
                  </h3>
                  <ul className="space-y-3">
                    {goal.objectives.marketing_goals.map((g: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="w-4 h-4 text-teal-500 mr-3 mt-0.5 shrink-0" />
                        <span className={`${InterFont} text-sm text-slate-600 leading-relaxed`}>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CAC LTV & Red Lines */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 border border-slate-200 rounded-lg p-5 bg-slate-50">
                  <div className={`${InterFont} text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2`}>Unit Economics (CAC:LTV)</div>
                  <p className={`${InterFont} text-sm text-slate-700 leading-relaxed font-medium`}>{goal.objectives.cac_ltv_analysis}</p>
                </div>
                <div className="lg:col-span-2 border border-red-200 rounded-lg p-5 bg-red-50/30">
                  <div className={`${InterFont} text-[10px] font-black text-red-600 uppercase tracking-widest mb-3 flex items-center`}>
                    <AlertTriangle className="w-3 h-3 mr-1.5" /> Lằn Ranh Đỏ (Red Lines)
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {goal.red_lines.map((g: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 mt-1.5 shrink-0" />
                        <span className={`${InterFont} text-[11px] text-slate-700 leading-relaxed`}>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
          
          <footer className="border-t border-slate-200 pt-4 mt-12 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <span>BrandFlow Strategic Report</span>
            <span>Page 1</span>
          </footer>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          PAGE 3: AUDIENCE & POSITIONING
      ════════════════════════════════════════════════ */}
      <div className={`${pageClass}`}>
        <div className={innerPageClass}>
          <header className="border-b border-slate-200 pb-4 mb-8 flex justify-between items-end shrink-0">
            <div className={`${InterFont} text-lg font-black text-slate-900 uppercase tracking-tighter`}>BRANDFLOW</div>
            <div className={`${InterFont} text-slate-400 font-bold text-[9px] tracking-[0.2em] uppercase`}>02 / Market Analysis & Positioning</div>
          </header>

          <div className="flex-1">
            {/* Directional Policy */}
            <section className="mb-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-900 text-white p-6">
                  <div className={`${InterFont} text-[9px] text-teal-400 font-black uppercase tracking-widest mb-3 flex items-center`}><Flame className="w-3 h-3 mr-2"/> Market Attractiveness</div>
                  <p className={`${InterFont} text-sm leading-relaxed`}>{audit.directional_policy.market_attractiveness}</p>
                </div>
                <div className="bg-slate-800 text-white p-6 border-l border-slate-700">
                  <div className={`${InterFont} text-[9px] text-teal-400 font-black uppercase tracking-widest mb-3 flex items-center`}><Cpu className="w-3 h-3 mr-2"/> Business Strength</div>
                  <p className={`${InterFont} text-sm leading-relaxed`}>{audit.directional_policy.business_strength}</p>
                </div>
                <div className="bg-teal-600 text-white p-6">
                  <div className={`${InterFont} text-[9px] text-teal-100 font-black uppercase tracking-widest mb-3 flex items-center`}><ArrowUpRight className="w-3 h-3 mr-2"/> Investment Decision</div>
                  <p className={`${InterFont} text-sm font-bold leading-relaxed`}>{audit.directional_policy.investment_decision}</p>
                </div>
              </div>
            </section>

            {/* Target Audience */}
            <section>
              <div className="flex items-center mb-6">
                <Briefcase className="w-5 h-5 text-teal-600 mr-3" />
                <h2 className={`${InterFont} text-sm font-black text-slate-900 uppercase tracking-widest`}>Chân dung Khách hàng Mục tiêu (Target Audience)</h2>
              </div>
              
              <div className="space-y-6">
                {audit.target_segments.map((seg: any, i: number) => (
                  <div key={i} className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                    <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex justify-between items-center">
                      <div className={`${InterFont} font-black text-slate-900 text-xs uppercase tracking-widest`}>
                        {seg.segment_name}
                      </div>
                      <div className={`${InterFont} text-[9px] text-slate-500 font-bold uppercase`}>Segment {i+1}</div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">
                        {seg.dmu_profiles.map((dmu: any, j: number) => (
                          <React.Fragment key={j}>
                            <div>
                              <div className={`${InterFont} text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 border-b border-slate-100 pb-1 flex items-center`}>
                                <AlertTriangle className="w-3 h-3 mr-1.5 text-orange-500"/> Pain Points (Nỗi đau)
                              </div>
                              <ul className="space-y-2">
                                {dmu.pain_points.map((p: string, k: number) => (
                                  <li key={k} className="flex items-start">
                                    <span className="w-1 h-1 rounded-full bg-orange-400 mr-2 mt-1.5 shrink-0" />
                                    <span className={`${InterFont} text-xs text-slate-600 leading-relaxed`}>{p}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <div className={`${InterFont} text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 border-b border-slate-100 pb-1 flex items-center`}>
                                <Target className="w-3 h-3 mr-1.5 text-teal-500"/> Decision Drivers (Động lực)
                              </div>
                              <ul className="space-y-2">
                                {dmu.decision_drivers.map((d: string, k: number) => (
                                  <li key={k} className="flex items-start">
                                    <span className="w-1 h-1 rounded-full bg-teal-500 mr-2 mt-1.5 shrink-0" />
                                    <span className={`${InterFont} text-xs text-slate-600 leading-relaxed`}>{d}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="bg-slate-900 text-white p-4 rounded-md">
                        <div className={`${InterFont} text-[9px] text-teal-400 font-black uppercase tracking-widest mb-1`}>Value Proposition (Tuyên ngôn giá trị)</div>
                        <div className={`${LoraFont} text-sm leading-relaxed italic`}>{seg.value_proposition}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          <footer className="border-t border-slate-200 pt-4 mt-12 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <span>BrandFlow Strategic Report</span>
            <span>Page 2</span>
          </footer>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          PAGE 4: TACTICS, BUDGET & RISK
      ════════════════════════════════════════════════ */}
      <div className={`${pageClass}`}>
        <div className={innerPageClass}>
          <header className="border-b border-slate-200 pb-4 mb-8 flex justify-between items-end shrink-0">
            <div className={`${InterFont} text-lg font-black text-slate-900 uppercase tracking-tighter`}>BRANDFLOW</div>
            <div className={`${InterFont} text-slate-400 font-bold text-[9px] tracking-[0.2em] uppercase`}>03 / Execution, Budget & Risk</div>
          </header>

          <div className="flex-1">
            {/* Budget & Data Visualization */}
            <section className="mb-10">
              <div className="flex items-center mb-6">
                <Layers className="w-5 h-5 text-teal-600 mr-3" />
                <h2 className={`${InterFont} text-sm font-black text-slate-900 uppercase tracking-widest`}>Phân bổ Ngân sách 7Ps (Zero-Based Budgeting)</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="flex flex-col justify-center">
                  <div className={`${InterFont} text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1`}>Total Investment Budget</div>
                  <div className={`${InterFont} text-4xl font-black text-slate-900 mb-6 tracking-tight`}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tactics.total_budget_used)}
                  </div>
                  
                  <div className="w-full h-3 flex bg-slate-100 rounded-full overflow-hidden mb-6 border border-slate-200">
                    {tactics.tactics_7ps.map((t: any, i: number) => (
                      <div key={i} style={{ width: `${t.budget_allocation_percent}%`, background: COLORS[i % COLORS.length] }} className="h-full border-r border-white/20" />
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                    {tactics.tactics_7ps.map((t: any, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className={`${InterFont} text-[11px] text-slate-600 uppercase font-bold truncate`}>{t.p_name}</span>
                        <span className={`${InterFont} ml-auto font-black text-slate-900 text-xs`}>{t.budget_allocation_percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="h-[250px] border border-slate-100 rounded-lg bg-slate-50/50 p-4 flex flex-col">
                  <div className={`${InterFont} text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center mb-2`}>Dự phóng Tăng trưởng Doanh thu (6 Tháng)</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontFamily: 'Inter'}} />
                      <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontFamily: 'Inter'}} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar yAxisId="left" dataKey="Rev" name="Revenue (Triệu VNĐ)" fill="#0f766e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tactics Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-900">
                      <th className={`${InterFont} py-3 px-4 font-black text-[10px] uppercase tracking-widest border-r border-slate-200 w-[15%]`}>Initiative</th>
                      <th className={`${InterFont} py-3 px-4 font-black text-[10px] uppercase tracking-widest border-r border-slate-200 w-[55%]`}>Action Plan & KPIs</th>
                      <th className={`${InterFont} py-3 px-4 font-black text-[10px] uppercase tracking-widest border-r border-slate-200 text-center w-[15%]`}>Priority</th>
                      <th className={`${InterFont} py-3 px-4 font-black text-[10px] uppercase tracking-widest text-right w-[15%]`}>Budget</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tactics.tactics_7ps.map((task: any, idx: number) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                        <td className={`${InterFont} py-3 px-4 font-bold text-slate-900 text-xs border-r border-slate-100 uppercase`}>
                          <span className="px-2 py-1 bg-slate-100 rounded text-[10px]">{task.p_name}</span>
                        </td>
                        <td className={`${InterFont} py-3 px-4 text-xs text-slate-700 leading-relaxed border-r border-slate-100`}>
                          <span className="font-medium">{task.action_bullet}</span>
                          <div className="mt-1.5 flex items-center text-teal-600 font-bold bg-teal-50 inline-block px-2 py-0.5 rounded-sm text-[10px]">
                            <Compass className="w-3 h-3 mr-1" /> KPI: {task.kpi}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center border-r border-slate-100">
                          <span className={`${InterFont} font-black text-[9px] uppercase tracking-widest px-2 py-1 rounded-sm ${
                            task.moscow_tag === 'MUST_HAVE' ? 'bg-slate-900 text-white' : 
                            task.moscow_tag === 'SHOULD_HAVE' ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {task.moscow_tag?.replace('_',' ')}
                          </span>
                        </td>
                        <td className={`${InterFont} py-3 px-4 text-right font-black text-slate-900 text-xs`}>
                          {new Intl.NumberFormat('vi-VN').format(task.budget_vnd)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* CFO Risk Assessment */}
            <section>
              <div className="flex items-center mb-6">
                <ShieldAlert className="w-5 h-5 text-teal-600 mr-3" />
                <h2 className={`${InterFont} text-sm font-black text-slate-900 uppercase tracking-widest`}>Quản trị Rủi ro & Báo cáo CFO (Risk Management)</h2>
              </div>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-900 p-5">
                  <div className={`${InterFont} text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2 flex items-center`}>
                    <MessageSquare className="w-3 h-3 mr-1.5" /> CFO Executive Memo
                  </div>
                  <div className={`${LoraFont} text-sm text-slate-300 italic leading-relaxed`}>" {cfo.cfo_comment} "</div>
                </div>
                <div className="p-5 grid grid-cols-1 gap-5 bg-white">
                  {cfo.risk_assessment.map((risk: any, i: number) => (
                    <div key={i} className="border border-slate-100 rounded-lg p-4 bg-slate-50/50">
                      <div className={`${InterFont} font-black text-slate-900 mb-1 text-[11px] uppercase tracking-wider`}>Risk {i+1}: {risk.risk_scenario.split(':')[0]}</div>
                      <div className={`${InterFont} text-xs text-slate-600 mb-4 leading-relaxed`}>{risk.risk_scenario.split(':')[1] || risk.risk_scenario}</div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-200 rounded overflow-hidden">
                        <div className="bg-white p-3">
                          <span className={`${InterFont} text-[9px] text-red-500 font-black uppercase tracking-widest block mb-1`}>Trigger Point (Ngưỡng báo động)</span>
                          <span className={`${InterFont} text-[11px] text-slate-800 font-medium`}>{risk.trigger_point_metric}</span>
                        </div>
                        <div className="bg-teal-50 p-3">
                          <span className={`${InterFont} text-[9px] text-teal-700 font-black uppercase tracking-widest block mb-1`}>Contingency (Kế hoạch Plan B)</span>
                          <span className={`${InterFont} text-[11px] text-teal-900 font-bold leading-relaxed`}>{risk.contingency_plan_b}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
          
          <footer className="border-t border-slate-200 pt-4 mt-12 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            <span>BrandFlow Strategic Report</span>
            <span>Page 3</span>
          </footer>
        </div>
      </div>

    </div>
  );
}
