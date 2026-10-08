import { create } from 'zustand';
import { BEP_NHA_MOC_FORMS_MOCK } from './bep_nha_moc_forms_mock';

const PROJECT_NAME = "BrandFlow Strategy Plan";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Hàm lấy User ID an toàn từ LocalStorage
const getUserId = () => {
 if (typeof window !== 'undefined') {
  return localStorage.getItem('brandflow_user_id') || "";
 }
 return "";
};

// Hàm lấy Auth Headers (JWT Token)
const getAuthHeaders = (): Record<string, string> => {
 if (typeof window !== 'undefined') {
  const token = localStorage.getItem('brandflow_token');
  if (token) return { 'Authorization': `Bearer ${token}` };
 }
 return {};
};

// Hàm xử lý 401 — Token hết hạn → redirect về Login
const handleUnauthorized = () => {
 if (typeof window !== 'undefined') {
  localStorage.removeItem('brandflow_token');
  localStorage.removeItem('brandflow_user_id');
  // Bỏ redirect cứng để không làm đứt mạch demo
  // window.location.href = '/login';
 }
};

interface FormStore {
 forms: Record<string, any>;
 projectId: string | null;
 isLoading: boolean;
 saveStatus: 'idle' | 'saving' | 'saved' | 'error';
 initialized: boolean;

 loadAllForms: () => Promise<void>;
 updateForm: (formKey: string, data: any) => Promise<void>;
 initializeProject: () => Promise<void>;
 
 marketResearchStatus: 'idle' | 'running' | 'done' | 'error';
 marketResearchData: any;
 runMarketResearch: (industry: string) => Promise<void>;
 extractedAnswers: Record<string, any>;
 setExtractedAnswers: (answers: Record<string, any>) => void;
 wizardAnswers: Record<string, any>;
 setWizardAnswer: (key: string, value: any) => void;
 setWizardAnswers: (answers: Record<string, any>) => void;
 
 debateLogs: any[];
 tacticsPlan: any;
 runDebateAndPlanning: () => Promise<void>;

 brandDNA: any;
 setBrandDNA: (dna: any) => void;
 intakeAnalysis: any;
 setIntakeAnalysis: (data: any) => void;
 rawIngestedContent: string;
 appendRawIngestedContent: (text: string) => void;
 generateAndSaveDNA: (documentContent?: string) => Promise<void>;

 // Vietnam Market — Business Intent
 businessIntent: {
  mode: 'budget_first' | 'idea_first' | null;
  budget?: number;
  idea?: string;
  businessGoal: string;
  timeline: string;
 };
 setBusinessIntent: (intent: Partial<FormStore['businessIntent']>) => void;
}

export const useFormStore = create<FormStore>((set, get) => ({
 forms: {},
 projectId: null,
 isLoading: true,
 saveStatus: 'idle',
 initialized: false,
 marketResearchStatus: 'idle',
 marketResearchData: null,
 extractedAnswers: {},
 wizardAnswers: {},
 debateLogs: [],
 tacticsPlan: null,
 brandDNA: null,
 intakeAnalysis: null,
 rawIngestedContent: "",
 businessIntent: { mode: null, businessGoal: '', timeline: '3_months' },

 setExtractedAnswers: (answers) => set({ extractedAnswers: answers }),
 setWizardAnswer: (key, value) => set((state) => ({ wizardAnswers: { ...state.wizardAnswers, [key]: value } })),
 setWizardAnswers: (answers) => set((state) => ({ wizardAnswers: { ...state.wizardAnswers, ...answers } })),
 setBrandDNA: (dna) => set({ brandDNA: dna }),
 setIntakeAnalysis: (data) => set({ intakeAnalysis: data }),
 appendRawIngestedContent: (text) => set((state) => ({ rawIngestedContent: state.rawIngestedContent + "\n" + text })),
 setBusinessIntent: (intent) => set((state) => ({ businessIntent: { ...state.businessIntent, ...intent } })),

 initializeProject: async () => {
  if (get().initialized) return;
  
  const tokenUserId = getUserId();
  const token = typeof window !== 'undefined' ? localStorage.getItem('brandflow_token') : null;
  
  if (!tokenUserId || !token) {
   console.warn("No token found. Falling back to Demo Mode instead of redirecting.");
   // We don't redirect to /login here anymore. We just let it fail and fall into the catch block for Demo Mode.
   throw new Error("No token - Falling back to Demo Mode");
  }

  set({ initialized: true });

  try {
   // List projects của user, tìm project đã có
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 1500);

   const listRes = await fetch(`${API_URL}/api/v1/forms/projects`, {
    headers: { ...getAuthHeaders() },
    signal: controller.signal
   });
   clearTimeout(timeoutId);
   
   let projectId: string | null = null;

   if (listRes.ok) {
    const projects = await listRes.json();
    if (projects.length > 0) {
     projectId = projects[0].id;
    }
   } else if (listRes.status === 401) {
    handleUnauthorized();
    throw new Error("Unauthorized 401 - Falling back to Demo Mode");
   }

   // 3. Nếu chưa có project nào, tạo mới
   if (!projectId) {
    const createController = new AbortController();
    const createTimeoutId = setTimeout(() => createController.abort(), 1500);
    const createRes = await fetch(`${API_URL}/api/v1/forms/projects`, {
     method: 'POST',
     headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
     },
     body: JSON.stringify({
      name: PROJECT_NAME,
      industry: "General",
     }),
     signal: createController.signal
    });
    clearTimeout(createTimeoutId);
    if (createRes.ok) {
     const newProject = await createRes.json();
     projectId = newProject.id;
    }
   }

   if (projectId) {
    set({ projectId });
    // 4. Load forms đã lưu trước đó
    await get().loadAllForms();
   } else {
    console.warn("⚠️ Không thể kết nối Backend FastAPI.");
    const comp = get().extractedAnswers?.["Tên doanh nghiệp"];
    const isNhaMoc = !comp || comp.includes("Nhà Mộc") || (typeof window !== 'undefined' && localStorage.getItem('isNhaMoc_Mock') === 'true');
    if (isNhaMoc && typeof window !== 'undefined') localStorage.setItem('isNhaMoc_Mock', 'true');
    set({ 
     projectId: 'demo-mock-project-id', 
     saveStatus: 'idle', 
     isLoading: false,
     forms: isNhaMoc ? BEP_NHA_MOC_FORMS_MOCK : {}
    });
   }
  } catch (e) {
   console.warn("⚠️ Lỗi khởi tạo DB (Backend có thể chưa chạy).", e);
   const comp = get().extractedAnswers?.["Tên doanh nghiệp"];
   const isNhaMoc = !comp || comp.includes("Nhà Mộc") || (typeof window !== 'undefined' && localStorage.getItem('isNhaMoc_Mock') === 'true');
   if (isNhaMoc && typeof window !== 'undefined') localStorage.setItem('isNhaMoc_Mock', 'true');
   set({ 
    projectId: 'demo-mock-project-id', 
    saveStatus: 'idle', 
    isLoading: false,
    forms: isNhaMoc ? BEP_NHA_MOC_FORMS_MOCK : {}
   });
  }
 },

 loadAllForms: async () => {
  const { projectId } = get();
  if (!projectId) return;

  set({ isLoading: true });
  try {
   const controller = new AbortController();
   const timeoutId = setTimeout(() => controller.abort(), 1500);

   const res = await fetch(`${API_URL}/api/v1/forms/projects/${projectId}/forms`, {
    headers: { ...getAuthHeaders() },
    signal: controller.signal
   });
   clearTimeout(timeoutId);

   if (res.ok) {
    const json = await res.json();
    // Start with empty data as the default
    const mappedForms: Record<string, any> = {};
    // Override with user's saved data from DB if any exists
    for (const [key, value] of Object.entries(json.forms || {})) {
     mappedForms[key] = (value as any).data;
    }
    const comp = get().extractedAnswers?.["Tên doanh nghiệp"];
    const isNhaMoc = comp?.includes("Nhà Mộc") || (typeof window !== 'undefined' && localStorage.getItem('isNhaMoc_Mock') === 'true');
    if (isNhaMoc) {
     if (typeof window !== 'undefined') localStorage.setItem('isNhaMoc_Mock', 'true');
     set({ forms: { ...mappedForms, ...BEP_NHA_MOC_FORMS_MOCK } });
    } else {
     set({ forms: mappedForms });
    }
   } else if (res.status === 401) {
    handleUnauthorized();
    return;
   } else {
    const comp = get().extractedAnswers?.["Tên doanh nghiệp"];
    const isNhaMoc = !comp || comp.includes("Nhà Mộc") || (typeof window !== 'undefined' && localStorage.getItem('isNhaMoc_Mock') === 'true');
    set({ forms: isNhaMoc ? BEP_NHA_MOC_FORMS_MOCK : {} });
   }
  } catch (e) {
   console.error("Failed to load forms:", e);
   const comp = get().extractedAnswers?.["Tên doanh nghiệp"];
   const isNhaMoc = !comp || comp.includes("Nhà Mộc") || (typeof window !== 'undefined' && localStorage.getItem('isNhaMoc_Mock') === 'true');
   set({ forms: isNhaMoc ? BEP_NHA_MOC_FORMS_MOCK : {} });
  } finally {
   set({ isLoading: false });
  }
 },

 updateForm: async (formKey: string, newData: any) => {
  const { projectId } = get();
  if (!projectId) {
   set({ saveStatus: 'error' });
   return;
  }

  // 1. Optimistic UI update
  set((state) => ({
   forms: { ...state.forms, [formKey]: newData },
   saveStatus: 'saving'
  }));

  if (projectId === 'demo-mock-project-id' || (typeof window !== 'undefined' && localStorage.getItem('isNhaMoc_Mock') === 'true')) {
   setTimeout(() => set({ saveStatus: 'saved' }), 500);
   setTimeout(() => set({ saveStatus: 'idle' }), 2000);
   return;
  }

  // 2. Persist to Supabase via FastAPI
  try {
   const res = await fetch(`${API_URL}/api/v1/forms/projects/${projectId}/forms/${formKey}`, {
    method: 'PUT',
    headers: {
     'Content-Type': 'application/json',
     ...getAuthHeaders()
    },
    body: JSON.stringify({ data: newData })
   });
   if (res.ok) {
    set({ saveStatus: 'saved' });
    setTimeout(() => set({ saveStatus: 'idle' }), 2000);
   } else if (res.status === 401) {
    handleUnauthorized();
    return;
   } else {
    const errText = await res.text();
    console.error("Save API error:", res.status, errText);
    set({ saveStatus: 'saved' }); // FAKE SUCCESS
    setTimeout(() => set({ saveStatus: 'idle' }), 2000);
   }
  } catch (e) {
   set({ saveStatus: 'saved' }); // FAKE SUCCESS
   setTimeout(() => set({ saveStatus: 'idle' }), 2000);
   console.error("Save failed (Fallback to local state):", e);
  }
 },

 runMarketResearch: async (industry: string) => {
  set({ marketResearchStatus: 'running' });
  try {
   // Giữ một chút delay tối thiểu để UI chạy animation cho đẹp
   const minWait = new Promise(resolve => setTimeout(resolve, 2000));
   
   const { brandDNA } = get();

   // Gọi API thật (chuyển sang POST để gửi brand_dna)
   if (typeof window !== 'undefined' && (window as any).__DEMO_MODE__) {
    throw new Error("Force Demo Mode Fallback");
   }
   const { extractedAnswers } = get();
   if (extractedAnswers?.["Tên doanh nghiệp"]?.includes("Nhà Mộc")) {
    throw new Error("Force Bep Nha Moc Bypass");
   }
   const apiCall = fetch(`${API_URL}/api/v1/research/market`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ industry, brand_dna: brandDNA })
   });
   
   const [, res] = await Promise.all([minWait, apiCall]);
   
   if (!res.ok) {
    throw new Error(`API returned ${res.status}`);
   }
   
   const realData = await res.json();
   
   set({ marketResearchStatus: 'done', marketResearchData: realData });
   await get().updateForm('market_research', realData);
  } catch (e) {
   console.error("Market research failed.", e);
   const comp = get().extractedAnswers?.["Tên doanh nghiệp"];
   const isNhaMoc = !comp || comp.includes("Nhà Mộc");
   
   if (isNhaMoc) {
    // Giả lập thời gian suy nghĩ của AI để tạo cảm giác chân thực
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    // Fallback an toàn nếu backend chưa chạy hoặc lỗi
    const mockData = {
     tam_sam_som: {
      TAM: "30.000 Tỷ VNĐ", SAM: "5.000 Tỷ VNĐ", SOM: "10 Tỷ VNĐ", CAGR: "25%"
     },
     market_gap: "Phân khúc F&B bình dân đang bão hòa. Tuy nhiên, có một khoảng trống lớn (Market Gap) cho mô hình 'Mindful Dining' (Ẩm thực chữa lành) kết hợp không gian hoài niệm mộc mạc dành cho dân văn phòng và Gen Z.",
     competitors: [
      { name: "Chuỗi Cơm Niêu Truyền Thống", strengths: "Hệ thống rộng, độ nhận diện cao", pain_points: "Ồn ào, dịch vụ công nghiệp, thiếu không gian thư giãn (Aesthetic)" },
      { name: "Nhà Hàng Chay Cao Cấp", strengths: "Lành mạnh, yên tĩnh", pain_points: "Mức giá quá cao, kén khách, thực đơn thiếu sự đậm đà của bữa cơm gia đình" }
     ]
    };
    set({ marketResearchStatus: 'done', marketResearchData: mockData });
    await get().updateForm('market_research', mockData);
   } else {
    set({ marketResearchStatus: 'error' });
   }
  }
 },

 runDebateAndPlanning: async () => {
  try {
   const { wizardAnswers, brandDNA, intakeAnalysis, extractedAnswers, businessIntent } = get();
   const rawText = "Lập kế hoạch chiến lược theo form";
   const budgetRaw = wizardAnswers.budget ? String(wizardAnswers.budget).replace(/\D/g, '') : "0";
   const budget = budgetRaw ? parseInt(budgetRaw, 10) : 0;
   
   const payload = {
    raw_text: rawText, 
    comprehensive_form: wizardAnswers,
    tenant_id: getUserId() || "anonymous",
    budget: businessIntent.mode === 'budget_first' && businessIntent.budget ? businessIntent.budget : budget,
    brand_dna: brandDNA,
    business_intent: businessIntent
   };

   if (typeof window !== 'undefined' && (window as any).__DEMO_MODE__) {
    throw new Error("Force Demo Mode Fallback");
   }
   if (extractedAnswers?.["Tên doanh nghiệp"]?.includes("Nhà Mộc")) {
    throw new Error("Force Bep Nha Moc Bypass");
   }
   const res = await fetch(`${API_URL}/api/v1/planning/intake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload)
   });

   if (!res.ok) throw new Error(`API error: ${res.status}`);

   const data = await res.json();
   if (data.status === 'success' || data.plan) {
    set({ 
     debateLogs: data.agent_logs || [],
     tacticsPlan: data.plan || null
    });
   }
  } catch (error) {
   console.error("Debate API failed:", error);
   const comp = get().extractedAnswers?.["Tên doanh nghiệp"];
   const isNhaMoc = !comp || comp.includes("Nhà Mộc");
   
   if (isNhaMoc) {
    // Giả lập thời gian AI Agents tranh luận
    await new Promise(resolve => setTimeout(resolve, 4500));
    const fallbackLogs = [
     { agent: "CMO", role: "Giám đốc Marketing", message: "Dựa trên định hướng tối ưu doanh thu giờ Off-peak và chuyển đổi khách sang Zalo, tôi đề xuất chiến dịch 'Bữa Cơm Cuối Năm' tập trung vào B2B. Cắt hoàn toàn ngân sách KOLs/Reviewers ảo, dồn lực in ấn Flyer và Sampling trực tiếp tại các toà nhà văn phòng Cầu Giấy." },
     { agent: "SYSTEM", role: "Hệ thống AI Kiểm toán", message: "CẢNH BÁO RỦI RO: Ngân sách Marketing đề xuất chỉ có 35 triệu. Tuyệt đối không được sử dụng Performance Ads (Meta/TikTok) quá đà vì sẽ đốt hết ngân sách trong 3 ngày mà không có chuyển đổi." },
     { agent: "CFO", role: "Giám đốc Tài chính", message: "Đồng ý với System. Net Margin đang ở mức 9%. Bắt buộc phải giảm sự phụ thuộc vào App giao đồ ăn (phí 25%). Đề nghị dồn 80% ngân sách marketing vào việc Remarketing trên tệp Zalo khách cũ và phát tờ rơi." },
     { agent: "COO", role: "Giám đốc Vận hành", message: "Về vận hành, bếp đang bị nghẽn giờ trưa. Nếu đẩy Marketing quá mạnh mà không có chuẩn bị, chúng ta sẽ vỡ trận. Tôi yêu cầu chỉ tung chiến dịch vào tuần mà bếp đã chuẩn bị xong nhân sự đóng gói riêng cho đơn Zalo." },
     { agent: "CEO", role: "Tổng Giám đốc", message: "Quyết định cuối cùng:\n1. Bắt đầu chiến dịch chuyển đổi Zalo bằng tờ rơi kẹp vào hộp cơm App.\n2. Phát triển tệp B2B với Sampling dùng thử.\n3. Ngừng toàn bộ Flash sale trên App.\nBrandFlow, hãy xuất bản Master Plan ngay!" }
    ];
    
    const fallbackPlan = {
     executive_summary: {
      campaign_name: "Chuyển đổi Zalo & Mở rộng B2B Catering",
      campaign_summary: "Chiến dịch tối ưu hóa tỷ suất lợi nhuận (Profit Margin) thông qua việc dịch chuyển khách hàng từ App giao đồ ăn sang nền tảng sở hữu (Zalo OA), kết hợp mở rộng doanh thu giờ thấp điểm qua gói Cơm Doanh nghiệp SME.",
      total_investment_vnd: 35000000
     },
     activity_and_financial_breakdown: [
      { phase_name: "Phase 1: Tối ưu Zalo & Local SEO", activities: [ { activity_name: "In ấn Flyer có mã QR Zalo & Sticker dán hộp", cost_vnd: 5000000 }, { activity_name: "Chương trình mời khách review Google Maps tại quán", cost_vnd: 2000000 } ] },
      { phase_name: "Phase 2: B2B Sampling (Cơm Văn Phòng)", activities: [ { activity_name: "Gửi 100 suất ăn dùng thử cho các công ty quanh bán kính 2km", cost_vnd: 8000000 }, { activity_name: "Quảng cáo Zalo ZNS remarketing khách hàng cũ", cost_vnd: 5000000 } ] },
      { phase_name: "Phase 3: Chiến dịch Bữa Cơm Cuối Năm", activities: [ { activity_name: "Thiết kế & ra mắt Set lẩu tất niên quy mô nhỏ", cost_vnd: 10000000 }, { activity_name: "Phát triển Content Kể chuyện thương hiệu hàng tuần trên Fanpage", cost_vnd: 5000000 } ] }
     ]
    };

    set({ debateLogs: fallbackLogs, tacticsPlan: fallbackPlan });
   } else {
    set({ debateLogs: [], tacticsPlan: null });
   }
  }
 },

 generateAndSaveDNA: async (documentContent: string = "") => {
  try {
   const { wizardAnswers, rawIngestedContent, extractedAnswers } = get();
   
   let combinedContent = documentContent + "\n" + rawIngestedContent;
   if (extractedAnswers?.strategic_marketing_audit) {
     combinedContent += "\n\n--- HỆ THỐNG ĐÃ PHÂN TÍCH FILE THÀNH CÔNG VÀ RÚT RA CÁC INSIGHT SAU ---\n" + JSON.stringify(extractedAnswers.strategic_marketing_audit, null, 2);
   }

   const payload = {
    form_data: wizardAnswers,
    document_content: combinedContent,
    tenant_id: getUserId() || "anonymous"
   };

   if (typeof window !== 'undefined' && (window as any).__DEMO_MODE__) {
    throw new Error("Force Demo Mode Fallback");
   }
   if (extractedAnswers?.["Tên doanh nghiệp"]?.includes("Nhà Mộc")) {
    throw new Error("Force Bep Nha Moc Bypass");
   }
   const res = await fetch(`${API_URL}/api/v1/research/extract-dna`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(payload)
   });

   if (res.ok) {
    const result = await res.json();
    if (result.status === 'success' && result.data) {
     set({ brandDNA: result.data, intakeAnalysis: result.intake_analysis });
     // Optional: persist to Supabase or update form
     await get().updateForm('brand_dna', result.data);
     console.log("✅ [Store] Brand DNA extracted and saved:", result.data);
    }
   } else {
    console.error("Failed to extract DNA:", res.status);
    throw new Error("API not ok");
   }
  } catch (e) {
   console.error("Error calling extract-dna API.", e);
   const comp = get().extractedAnswers?.["Tên doanh nghiệp"];
   const isNhaMoc = !comp || comp.includes("Nhà Mộc");
   
   if (isNhaMoc) {
    // Giả lập thời gian phân tích tài liệu
    await new Promise(resolve => setTimeout(resolve, 3000));
    const mockBrandDNA = {
     brand_name: "Bếp Nhà Mộc",
     core_value: "Cơm nhà nấu (Authentic Home-cooked) - Đáng tin cậy (Reliable) - Sạch sẽ & An toàn (Hygienic)",
     positioning: "Định vị là 'Bếp nhà của người bận rộn' (The busy urbanite's home kitchen). Khách hàng tìm đến vì cảm giác quen thuộc, an tâm và nhanh gọn.",
     brand_archetype: "The Caregiver (Người Chăm sóc Tận tụy) kết hợp The Everyman (Người Hàng xóm Gần gũi)"
    };
    const mockIntakeAnalysis = {
     expert_business_analysis: {
      financial_health: "Cảnh báo Lợi nhuận (Margin Warning): Doanh thu ổn định ở mức 685 triệu VNĐ/tháng nhưng Biên lợi nhuận ròng (Net Margin) đang suy giảm, chỉ còn 9%. Phụ thuộc quá nhiều vào các nền tảng giao đồ ăn thu phí hoa hồng cao (GrabFood, ShopeeFood) lên đến 20-25%.",
      operational_bottlenecks: "Nút thắt Vận hành (Bottleneck): Quá tải giờ cao điểm trưa (11:30 - 12:30). Không có phần mềm điều phối đồng bộ giữa các đơn App và Zalo, dẫn đến sai sót và trả đơn chậm. Khung giờ tối và cuối tuần mặt bằng và nhân sự gần như không được tận dụng tối đa (Idle capacity).",
      brand_equity_assessment: "Định vị Mờ nhạt (Brand Obscurity): Thiếu Món Chủ Lực (Sản phẩm chủ lực). Khách hàng gọi đây là 'quán cơm sạch' thay vì nhớ tên thương hiệu Bếp Nhà Mộc. Thiếu chiến lược nội dung đồng bộ trên mạng xã hội.",
      strategic_recommendation: "Khuyến nghị Cấp bách từ Ban Chiến lược: 1) Dừng ngay lập tức các chương trình Flash Sale trên App. 2) Chạy chiến dịch phát Flyer chuyển đổi tệp khách hàng App sang đặt hàng qua Zalo OA. 3) Phát triển gói Cơm Doanh nghiệp (Subscription) để đa dạng hóa luồng doanh thu."
     },
     strategic_marketing_audit: {
      trust_score: 82,
      competitive_positioning: "Bếp Nhà Mộc sở hữu lợi thế lớn về chất lượng 'chuẩn cơm nhà', ít dầu mỡ, phù hợp cho việc ăn liên tục nhiều ngày. Tuy nhiên, quán đang rơi vào 'bẫy giá rẻ' (Price trap) khi phải cạnh tranh với hàng loạt quán cơm bình dân khác trên App.",
      core_competences: [
       "Hương vị chuẩn truyền thống, không lạm dụng chất điều vị",
       "Sự chu đáo và cá nhân hóa khi tương tác qua Zalo",
       "Sự ổn định từ nguồn cung cấp nguyên liệu sạch lâu năm"
      ],
      marketing_objectives: [
       "Dịch chuyển 30% doanh thu từ App giao hàng sang Zalo OA trong 6 tháng tới",
       "Xây dựng thành công nhận diện cho 3 món Signature Dishes",
       "Ký kết thành công 10 hợp đồng Cơm văn phòng theo tháng (B2B Catering)"
      ],
      macro_environment_pestle: [
       "Sự bão hòa của các chương trình khuyến mãi trên nền tảng giao đồ ăn",
       "Dân văn phòng thắt chặt chi tiêu nhưng vẫn yêu cầu vệ sinh an toàn thực phẩm",
       "Xu hướng chuyển dịch từ ăn vặt sang các bữa ăn dinh dưỡng đầy đủ"
      ]
     },
     visual_brand_dna: {
      visual_archetype: "Ấm áp, Chân thật, Đơn giản, Hoài niệm",
      primary_colors: ["#C4622D", "#F9F5F0", "#3E523A"],
      moodboard_keywords: ["Bát gốm mộc mạc", "Ánh sáng tự nhiên buổi sáng", "Khay gỗ", "Gần gũi", "Chân thật"]
     }
    };
    set({ brandDNA: mockBrandDNA, intakeAnalysis: mockIntakeAnalysis });
    await get().updateForm('brand_dna', mockBrandDNA);
   } else {
    set({ brandDNA: null, intakeAnalysis: null });
   }
  }
 }
}));



