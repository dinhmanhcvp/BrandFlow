export const BEP_NHA_MOC_FORMS_MOCK: Record<string, any> = {
  "a1-mission": {
    role: "Tiên phong kiến tạo không gian 'Mindful Dining' (Ẩm thực chánh niệm) chuẩn mực giữa lòng Sài Gòn phồn hoa, thiết lập tiêu chuẩn mới cho F&B cao cấp.",
    business_def: "Vượt lên trên một mô hình nhà hàng vật lý truyền thống, Bếp Nhà Mộc cung cấp 'Therapeutic Dining Experience' (Trải nghiệm trị liệu qua ẩm thực). Khách hàng không chỉ mua một bữa ăn, mà họ đang trả tiền cho sự bình yên, không gian hoài niệm và khả năng tái tạo năng lượng sau chuỗi ngày Burnout.",
    purpose: "Thơm Khói Bếp - Ấm Tình Nhà: Chữa lành những tâm hồn thị dân kiệt sức bằng hương vị nguyên bản của quê hương, nơi thời gian như ngừng trôi sau cánh cửa gỗ.",
    competency: "Sở hữu hệ sinh thái khép kín Farm-to-Table 100% Organic, công thức di sản 3 đời không bột ngọt (No MSG), và một kiến trúc nhà cổ Bắc Bộ nguyên bản tạo ra VRIO (Value, Rare, Inimitable, Organized) không thể sao chép bằng tiền.",
    directions: [
      { type: 'will_do', text: 'Ứng dụng Scarcity Marketing: Giới hạn tối đa 50 khách/tối để bảo toàn tính độc quyền (Exclusivity) và sự tĩnh lặng của không gian chữa lành.' },
      { type: 'will_do', text: 'Triển khai mạnh mẽ O2O (Online-to-Offline) Loyalty thông qua Zalo Mini App nhằm tối đa hóa Customer Lifetime Value (LTV).' },
      { type: 'will_do', text: 'Chuẩn hóa quy trình vận hành (SOPs) đạt tiêu chuẩn Hospitality 5 sao nhằm chuẩn bị cho việc Scale-up chuỗi.' },
      { type: 'never_do', text: 'Tuyệt đối không áp dụng chiến lược Deep Discounting (Giảm giá sâu) hay gia nhập các cuộc chiến giá trên nền tảng Cloud Kitchen để bảo vệ Brand Equity.' },
      { type: 'never_do', text: 'Không sử dụng nguyên liệu công nghiệp, phụ gia thực phẩm, chất bảo quản dưới mọi hình thức để cam kết tính Authentic.' },
      { type: 'might_do', text: 'Thương mại hóa hệ sinh thái sản phẩm Organic đóng gói (trà an thần, gạo lứt hữu cơ, gia vị mộc) dưới dạng quà tặng doanh nghiệp (B2B).' },
      { type: 'might_do', text: 'Phát triển Sub-brand "Bếp Nhà Mộc Express" với suất ăn trưa Eco-friendly giao tận nơi cho giới C-Level tại Quận 1, Quận 3.' }
    ]
  },
  "a2-performance": {
    items: [
      { metric: 'Doanh thu thuần (Net Rev)', y3: '0.8 tỷ', y2: '1.2 tỷ', y1: '1.2 tỷ (Đi ngang)', reason: 'Stagnant (Đi ngang 18 tháng qua) do phụ thuộc tệp khách cũ >45 tuổi, chưa tiếp cận Gen Z/Y.' },
      { metric: 'Biên lợi nhuận gộp (Gross Margin)', y3: '35%', y2: '28%', y1: '21% (Báo động)', reason: 'Thấp hơn mức trung bình ngành F&B (25-30%) do đứt gãy chuỗi cung ứng hữu cơ và lãng phí nguyên liệu (Waste).' },
      { metric: 'Biên lợi nhuận ròng (Net Margin)', y3: '15%', y2: '8%', y1: '2% (Rủi ro)', reason: 'Chi phí khấu hao tài sản cố định (kiến trúc) lớn, trong khi tỷ lệ lấp đầy bàn (Occupancy) chưa đạt 40%.' },
      { metric: 'Tỷ lệ khách quay lại (Retention)', y3: '12%', y2: '14%', y1: '15% (Chậm)', reason: 'Thiếu hệ sinh thái CRM (Zalo/Mini App) để remarketing tự động. Khách đến 1 lần rồi quên.' },
      { metric: 'Chi phí có 1 khách mới (CAC)', y3: '180,000đ', y2: '220,000đ', y1: '250,000đ (Quá cao)', reason: 'Đốt tiền vào các kênh Performance Ads truyền thống nhưng content mờ nhạt, thiếu Brand Story dẫn đến CTR thấp.' },
      { metric: 'Giá trị vòng đời KH (LTV)', y3: '650,000đ', y2: '580,000đ', y1: '450,000đ (Giảm)', reason: 'Mất khách hàng VIP do trải nghiệm không đồng nhất trong những giờ cao điểm.' },
      { metric: 'Năng suất nhân sự (Rev/FTE)', y3: '12tr/ng', y2: '15tr/ng', y1: '13tr/ng (Thấp)', reason: 'Thiếu phần mềm quản lý POS đồng bộ, dẫn đến lãng phí thời gian thao tác thủ công, thừa nhân sự giờ Off-peak.' }
    ]
  },
  "a3-revenue": {
    items: [
      { metric: 'Doanh Thu Thuần Dine-in', t0: '9.4 tỷ', t1: '14.5 tỷ', t2: '19.0 tỷ', t3: '24.0 tỷ', source: 'Tối đa hóa tỷ lệ lấp đầy cuối tuần (75%) qua Booking system & Upsell rượu vang organic.' },
      { metric: 'Doanh Thu Corporate Lunch', t0: '2.0 tỷ', t1: '4.1 tỷ', t2: '6.0 tỷ', t3: '7.5 tỷ', source: 'Ký kết hợp đồng cung cấp suất ăn định kỳ (Subscription) cho các tòa nhà văn phòng hạng A (B2B).' },
      { metric: 'Doanh Thu Bán lẻ (FMCG)', t0: '0.0 tỷ', t1: '1.0 tỷ', t2: '1.5 tỷ', t3: '2.0 tỷ', source: 'Bán chéo (Cross-sell) các dòng sản phẩm đóng gói (Trà an thần, gia vị ướp) tại điểm bán.' },
      { metric: 'Tổng Doanh Thu (Gross Rev)', t0: '11.4 tỷ', t1: '19.6 tỷ', t2: '26.5 tỷ', t3: '33.5 tỷ', source: 'Tổng hợp từ cả 3 luồng doanh thu chiến lược (Tăng trưởng kép CAGR ~35%).' },
      { metric: 'Chi Phí Giá Vốn (COGS)', t0: '3.5 tỷ', t1: '5.5 tỷ', t2: '7.0 tỷ', t3: '8.4 tỷ', source: 'Kiểm soát Food Cost (FC) ở mức lý tưởng 25%-28% thông qua tối ưu Waste Management và khóa hợp đồng Farm.' },
      { metric: 'Lợi Nhuận Gộp (Gross Profit)', t0: '7.9 tỷ', t1: '14.1 tỷ', t2: '19.5 tỷ', t3: '25.1 tỷ', source: 'Biên lợi nhuận gộp duy trì ổn định ở mức 70%-75%.' },
      { metric: 'EBITDA (Lợi nhuận HĐ)', t0: '1.5 tỷ', t1: '4.2 tỷ', t2: '6.8 tỷ', t3: '9.5 tỷ', source: 'Lợi nhuận hoạt động bùng nổ khi Sunk Cost đã được khấu hao xong và tối ưu OPEX.' }
    ]
  },
  "a4-market": {
    items: [
      { role: 'Urban Healers (Gen Z, 22-28T)', pain_points: 'Burnout vì KPI/Deadline, ám ảnh thực phẩm bẩn, thiếu không gian trốn áp lực mạng xã hội.', decision_drivers: 'Kiến trúc Cinematic/Aesthetic dễ làm content chữa lành, cam kết 100% Organic, Storytelling chân thật.', opportunism_risk: 'Đến 1 lần chụp hình lấy KPI rồi không quay lại nếu không có chương trình Loyalty phù hợp.', icon: "Zap", color: 'indigo' },
      { role: 'Mindful Professionals (Gen Y, 29-38T)', pain_points: 'Chán ngán Fastfood công nghiệp mặn chát, cần nơi tiếp đối tác hoặc ăn trưa lịch sự, yên tĩnh.', decision_drivers: 'Chất lượng nguyên liệu chuẩn vị nhà nấu (No MSG), phục vụ chuyên nghiệp, bao bì Eco-friendly.', opportunism_risk: 'Rất nhạy cảm với thời gian lên món (TAT - Turnaround Time) vào buổi trưa. Sẵn sàng rate 1 sao nếu trễ 5 phút.', icon: "Briefcase", color: 'emerald' },
      { role: 'Modern Families (35-50T)', pain_points: 'Khó tìm nhà hàng an toàn vệ sinh 100% cho trẻ nhỏ, muốn tìm lại hương vị ký ức tuổi thơ.', decision_drivers: 'Công thức di sản 3 đời, không gian hoài niệm Nostalgia, dịch vụ ân cần (Caregiver).', opportunism_risk: 'Nếu quán quá đông đúc ồn ào sẽ lập tức phàn nàn và rời đi vĩnh viễn, ảnh hưởng Brand Reputation.', icon: "Users", color: 'amber' },
      { role: 'Corporate HR (B2B Buyers)', pain_points: 'Cần tìm giải pháp bữa trưa chất lượng làm phúc lợi nhân viên, ngân sách tối ưu, hóa đơn minh bạch.', decision_drivers: 'Gói Subscription linh hoạt, chiết khấu tốt, đảm bảo ATVSTP, có app quản lý suất ăn dễ dàng.', opportunism_risk: 'Chu kỳ đàm phán kéo dài, thanh toán công nợ 30-45 ngày gây áp lực dòng tiền.', icon: "Building", color: 'cyan' },
      { role: 'Expat & Tourists (Khách du lịch)', pain_points: 'Tìm kiếm trải nghiệm ẩm thực bản địa (Authentic Local Food) nhưng lo ngại vấn đề vệ sinh đường phố.', decision_drivers: 'Không gian văn hóa đậm chất Việt Nam, menu song ngữ, review tốt trên TripAdvisor/Google Maps.', opportunism_risk: 'Tính thời vụ cao (Seasonality), phụ thuộc vào chu kỳ du lịch, ít trung thành.', icon: "Globe", color: 'pink' }
    ]
  },
  "a5-swot": {
    items: [
      { ksf: 'Kiến trúc Nhà Gỗ Di Sản & Aesthetic', weight: '25%', our_score: 9, comp_score: 6, issue: 'Điểm VRIO lõi: Cần có quy định nghiêm ngặt về "Không gian tĩnh" để bảo vệ trải nghiệm (Limit Noise).' },
      { ksf: 'Chất lượng Nguyên liệu (100% Organic)', weight: '25%', our_score: 9, comp_score: 7, issue: 'Thiếu truyền thông minh bạch (Traceability) - Cần series video Farm-to-Table để educate khách hàng.' },
      { ksf: 'Độ nhận diện thương hiệu (Brand Awareness)', weight: '15%', our_score: 4, comp_score: 8, issue: 'Tử huyệt: Định vị mờ nhạt, bị đánh đồng với "quán cơm bình dân". Cần Rebranding toàn diện gấp.' },
      { ksf: 'Hệ thống CRM & Customer Retention', weight: '15%', our_score: 3, comp_score: 7, issue: 'Tử huyệt: Đang rò rỉ (Churn) 85% khách hàng sau lần đầu. Phải build Zalo Mini App ngay lập tức.' },
      { ksf: 'Tối ưu Vận hành (Operational Efficiency)', weight: '10%', our_score: 5, comp_score: 8, issue: 'Thời gian lên món (TAT) giờ cao điểm chậm. Cần số hóa POS và Kitchen Display System (KDS).' },
      { ksf: 'Đa dạng hóa Luồng Doanh Thu', weight: '10%', our_score: 4, comp_score: 7, issue: 'Phụ thuộc 100% vào Dine-in buổi tối. Cần khai thác mỏ vàng Corporate Lunch giờ Off-peak.' }
    ]
  },
  "a6-portfolio": {
    items: [
      { segment: 'Cơm Niêu Đặc Sản & Món Mặn', attr: 'Rất Cao (Cash Cow)', pos: 'Mạnh', decision: 'Duy trì công thức lõi, tăng giá trị cộng thêm qua cách phục vụ (Theatrical serving) để upsell lên 15%.' },
      { segment: 'Trà Thảo Mộc Trị Liệu (Organic)', attr: 'Cao (Star)', pos: 'Mạnh', decision: 'Đẩy mạnh truyền thông công dụng an thần, thiết kế bao bì mang về (Take-away) chuẩn Eco-friendly.' },
      { segment: 'Combo Trưa Bã Mía (Eco Lunch)', attr: 'Rất Cao (Question Mark)', pos: 'Trượt', decision: 'Bơm mạnh ngân sách Marketing để chiếm lĩnh tệp dân văn phòng, chuyển đổi thành Star trong 2 Quý tới.' },
      { segment: 'Gói Quà Tặng Doanh Nghiệp (B2B)', attr: 'Trung bình (Question Mark)', pos: 'Mới', decision: 'Pilot test vào các dịp Lễ Tết, đóng gói Premium Box để tăng Brand Equity.' },
      { segment: 'Các món xào/chiên ngập dầu', attr: 'Thấp (Dog)', pos: 'Yếu', decision: 'Loại bỏ hoàn toàn khỏi Menu để nhất quán với định vị "Ẩm thực Chữa lành - Healthy".' }
    ]
  },
  "a7-assumptions": {
    items: [
      { core: 'Xu hướng "Mindful Dining & Eat Clean" tăng trưởng 45% YoY.', logic: 'Gen Y/Z thành thị sẵn sàng chi trả Premium (cao hơn 20%) cho thực phẩm minh bạch nguồn gốc và không gian trị liệu để chống lại Burnout.', action: 'Tái định vị thương hiệu thành "Điểm trú ẩn tâm lý", tăng giá bán 15% để tái đầu tư vào chất lượng dịch vụ.' },
      { core: 'Chi phí mặt bằng Q1/Q3 không biến động quá 10% trong 3 năm.', logic: 'Đã ký hợp đồng thuê dài hạn 5 năm (Lock-in price) với điều khoản trượt giá cố định 5%.', action: 'Dồn toàn lực ngân sách (OPEX) vào Marketing O2O và Digital Transformation thay vì phòng ngừa rủi ro mặt bằng.' },
      { core: 'Mạng lưới cung ứng Farm Organic duy trì năng lực cấp hàng ổn định.', logic: 'Ký kết độc quyền bao tiêu với 3 Hợp tác xã Nông nghiệp chuẩn VietGAP/GlobalGAP.', action: 'Xây dựng Buffer Stock (Kho dự trữ) cho các loại gia vị khô và có kế hoạch Plan B sourcing từ đối tác thứ 3.' },
      { core: 'Sự bùng nổ của Zalo như một Super App tại VN.', logic: 'Zalo đạt 75 triệu MAU, thói quen sử dụng Mini App tích điểm đang trở thành chuẩn mực mới.', action: 'Chuyển dịch 100% Loyalty Program sang Zalo Mini App, không xây dựng Native App để tối ưu chi phí.' }
    ]
  },
  "a8-strategies": {
    items: [
      { level: 'Total Revenue (Doanh thu tổng)', past: '14.4 tỷ', now: '21.6 tỷ', target: '28.0 tỷ', note: 'Mục tiêu sau 12 tháng Rebranding (Tăng 50% YoY)' },
      { level: 'Customer Acquisition Cost (CAC)', past: '250,000đ', now: '120,000đ', target: '40,000đ', note: 'Tối ưu hóa bằng Viral Content Tiktok và Referral (Word-of-mouth)' },
      { level: 'Retention Rate (Khách quay lại)', past: '15%', now: '35%', target: '50%', note: 'Khởi chạy hệ sinh thái Loyalty Zalo Mini App (Tích hạt gạo)' },
      { level: 'Tỷ trọng Gen Z & Y (Urban Healers)', past: '20%', now: '55%', target: '70%', note: 'Dịch chuyển tệp khách hàng sang phân khúc High-Value Customers' },
      { level: 'Food Cost (Giá vốn nguyên liệu)', past: '32%', now: '28%', target: '25%', note: 'Tối ưu hóa Waste Management và chốt Farming Contract khối lượng lớn' },
      { level: 'Tỷ lệ Lấp đầy (Off-peak Occupancy)', past: '22%', now: '45%', target: '65%', note: 'Push mạnh gói Corporate Lunch Combo vào khung 11h-14h' }
    ],
    campaign_phasing: [
      { phase: 'GĐ1: Nhen Lửa (Brand Revamp & Teasing)', description: 'Tung Cinematic Brand Film "Về Nhà Ăn Cơm". Tái thiết kế toàn bộ Visual Identity, POSM, và Uniform. Phủ sóng Short-video ASMR (Âm thanh chữa lành) trên TikTok/Reels.', time: 'Tháng 1 - Tháng 2' },
      { phase: 'GĐ2: Bùng Vị (Traffic Gen & Word of Mouth)', description: 'Chiến dịch Earned Media: Mời 30+ Micro-Influencers Lifestyle/Foodie đến trải nghiệm thực tế. Chạy Performance Ads hướng đến Lead Gen đặt bàn trước (Booking) tặng kèm món Tráng miệng độc quyền.', time: 'Tháng 3 - Tháng 4' },
      { phase: 'GĐ3: Giữ Lửa (Loyalty & O2O Optimization)', description: 'Ra mắt siêu ứng dụng thu nhỏ Zalo Mini App "Hạt Gạo" (Tích điểm, Đặt bàn Real-time, E-Voucher). Tung mạnh gói Corporate Eco Lunch thâm nhập các tòa nhà văn phòng hạng A.', time: 'Tháng 5 - Tháng 8' },
      { phase: 'GĐ4: Khẳng Định (Market Expansion & B2B)', description: 'Khởi chạy chiến dịch B2B Corporate Gifting cho dịp Lễ/Tết. Thiết lập chuỗi cung ứng nhượng quyền (Franchise Preparation) thông qua việc đóng gói bộ Standard Operating Procedures (SOPs).', time: 'Tháng 9 - Tháng 12' }
    ]
  },
  "a9-budget": {
    items: [
      { item: 'Doanh thu thuần (Net Rev)', t0: '1.20', t1: '1.80', t2: '2.50', t3: '3.20' },
      { item: 'Chi phí giá vốn (COGS - 28%)', t0: '0.33', t1: '0.50', t2: '0.70', t3: '0.89' },
      { item: 'Lợi nhuận gộp (Gross Profit)', t0: '0.87', t1: '1.30', t2: '1.80', t3: '2.31' },
      { item: 'Chi phí Vận hành (OPEX - Fixed)', t0: '0.30', t1: '0.35', t2: '0.40', t3: '0.45' },
      { item: 'Marketing Budget (Max 15%)', t0: '0.18', t1: '0.27', t2: '0.37', t3: '0.48' },
      { item: 'R&D và Công nghệ (CRM/App)', t0: '0.05', t1: '0.08', t2: '0.10', t3: '0.12' },
      { item: 'Lợi nhuận ròng (Net Profit)', t0: '0.34', t1: '0.60', t2: '0.93', t3: '1.26' }
    ]
  },
  "b1-objectives": {
    items: [
      { pair: 'Ẩm thực Trị liệu / Urban Gen Z', vol: '15,000 pax', margin: '68%', strategy: 'Đẩy mạnh viral video Tiktok (ASMR) & Storytelling "Trốn deadline", kết hợp KOLs Lifestyle.', budget: '220' },
      { pair: 'Eco Lunch / Mindful Professionals', vol: '25,000 pax', margin: '45%', strategy: 'Sampling dùng thử tại các Office building hạng A & Zalo ZNS remarketing tự động.', budget: '150' },
      { pair: 'Gia đình Cuối tuần / Modern Family', vol: '8,000 pax', margin: '72%', strategy: 'Gói Family Set Menu cao cấp, đẩy mạnh quảng cáo Facebook khu vực bán kính 5km.', budget: '90' },
      { pair: 'B2B Gifting / Corporate HR', vol: '5,000 hộp', margin: '55%', strategy: 'Direct Sales qua LinkedIn & Email Marketing nhắm tới C-Level, HR Managers.', budget: '40' }
    ]
  },
  "b2-action": {
    items: [
      { obj: 'Tái định vị (Brand Equity)', tactic: 'Sản xuất Cinematic Brand Film 90s: "Về nhà ăn cơm". Tối ưu định dạng dọc (Vertical) cho Reels/TikTok.', owner: 'Creative Dir', deadline: 'Tuần 2, Tháng 1', cost: '50,000,000' },
      { obj: 'O2O Traffic Generation', tactic: 'KOLs/KOCs Campaign: Booking 30+ Nano & Micro Influencers (Lifestyle/Food) review không gian tĩnh lặng.', owner: 'PR & Media', deadline: 'Tuần 1, Tháng 2', cost: '100,000,000' },
      { obj: 'Customer Retention (LTV)', tactic: 'Triển khai Zalo Mini App Booking & Loyalty (Tích "Hạt Gạo", Tặng quà sinh nhật tự động bằng ZNS).', owner: 'Tech Lead', deadline: 'Tuần 3, Tháng 2', cost: '65,000,000' },
      { obj: 'Off-peak Revenue', tactic: 'Corporate Lunch Activation: Phát Sampling dùng thử (Bento bã mía) tại 5 tòa nhà văn phòng lớn.', owner: 'Growth Hacker', deadline: 'Tuần 4, Tháng 2', cost: '30,000,000' },
      { obj: 'Lead Conversion', tactic: 'Thiết lập phễu Omni-channel Retargeting System bằng Facebook Pixel & GTM bám đuổi tập khách hàng.', owner: 'Performance Lead', deadline: 'Tuần 1, Tháng 3', cost: '45,000,000' },
      { obj: 'B2B Expansion', tactic: 'Xây dựng Pitch Deck và Sales Kit B2B cho gói Quà Tết Doanh Nghiệp (Premium Organic Box).', owner: 'B2B Sales Head', deadline: 'Tuần 2, Tháng 8', cost: '20,000,000' }
    ]
  },
  "b3-budget": {
    items: [
      { item: 'Quảng cáo Performance (Fb/TikTok Lead Gen)', past: '50 triệu', now: '90 triệu', next: '120 triệu' },
      { item: 'KOL/KOC & Booking PR (Earned Media)', past: '10 triệu', now: '100 triệu', next: '150 triệu' },
      { item: 'Sản xuất Content (Brand Film, Photo, ASMR)', past: '15 triệu', now: '80 triệu', next: '95 triệu' },
      { item: 'Phát triển Công nghệ & Martech (Zalo, CRM)', past: '0 triệu', now: '65 triệu', next: '85 triệu' },
      { item: 'Trade Marketing (Sampling, POSM, Packaging)', past: '25 triệu', now: '45 triệu', next: '60 triệu' }
    ]
  },
  "b4-contingency": {
    items: [
      { risk: 'Trend "Chữa Lành" bị bão hòa, copycat', level: 'Cao', impact: 'Giảm 25% lượng khách New User đến vì tò mò.', trigger: 'Lượt Booking New User từ Ads giảm 2 tuần liên tiếp.', action: 'Bổ sung giá trị gia tăng độc quyền: Khởi chạy chuỗi Workshop cuối tuần (Gốm, Trà đạo, Cắm hoa) để tạo điểm nhấn mới.' },
      { risk: 'Khủng hoảng vận hành do quá tải (Overload)', level: 'Nghiêm trọng', impact: 'Trải nghiệm khách hàng sụp đổ, bóc phốt trên MXH.', trigger: 'TAT (Thời gian lên món) vượt ngưỡng 25 phút.', action: 'Kích hoạt Scarcity Mode: Chỉ nhận khách Booking trước qua Zalo, ngưng nhận khách Walk-in giờ cao điểm. Tặng voucher xin lỗi ngay lập tức.' },
      { risk: 'Đứt gãy nguồn cung Organic', level: 'Trung bình', impact: 'Không đủ nguyên liệu chuẩn, phải dùng hàng thường làm hỏng Brand Trust.', trigger: 'Nhà cung cấp báo thiếu hụt >30% sản lượng.', action: 'Kích hoạt Hợp đồng dự phòng (Plan B) với 2 Farm Backup. Tạm thời out-of-stock các món bị ảnh hưởng thay vì đánh tráo nguyên liệu.' },
      { risk: 'Thuật toán Facebook/TikTok thay đổi', level: 'Trung bình', impact: 'CPA tăng vọt, Reach tự nhiên giảm mạnh.', trigger: 'CPA tăng >50% so với Benchmark trong 7 ngày.', action: 'Dịch chuyển ngân sách sang Kênh Earned Media (PR, KOLs) và khai thác sâu tập Database Zalo ZNS hiện có.' }
    ]
  },
  "b5-pnl": {
    items: [
      { item: 'Doanh thu thuần mục tiêu (Q1-Q2)', val: '12.4', ratio: '100%' },
      { item: 'Chi phí Giá vốn (Food Cost - 26%)', val: '3.22', ratio: '26.0%' },
      { item: 'Biên LN Gộp (Gross Margin - 74%)', val: '9.18', ratio: '74.0%' },
      { item: 'Chi phí Marketing & Sales (CAC & Ads)', val: '1.45', ratio: '11.7% (Được kiểm soát)' },
      { item: 'Chi phí Vận hành, Mặt bằng & Nhân sự', val: '4.10', ratio: '33.0%' },
      { item: 'Lợi nhuận hoạt động dự phóng (EBIT)', val: '3.63', ratio: '29.3% (Xuất sắc)' }
    ]
  },
  "b6-gantt": {
    items: [
      { name: 'Sản xuất Brand Film & Rebranding Identity', t8: true, t9: false, t10: false, t11: false, t12: false },
      { name: 'Phát triển Zalo Mini App (Core CRM)', t8: true, t9: true, t10: false, t11: false, t12: false },
      { name: 'KOLs/KOCs Campaign "Taste the Memories"', t8: false, t9: true, t10: true, t11: false, t12: false },
      { name: 'Performance Ads (Booking Lead Gen)', t8: false, t9: true, t10: true, t11: true, t12: true },
      { name: 'Khởi chạy Gói Corporate Lunch (B2B)', t8: false, t9: false, t10: true, t11: true, t12: true },
      { name: 'Mở rộng: Pilot B2B Corporate Gifting', t8: false, t9: false, t10: false, t11: true, t12: true }
    ]
  },
  "c1-direction": {
    items: [
      { item: 'North Star Metric (Chỉ số cốt lõi)', content: 'Tối đa hóa Customer Lifetime Value (LTV) và Tỷ lệ Lấp đầy Bàn (Occupancy Rate) thông qua định vị phân khúc "Mindful Dining" cao cấp.' },
      { item: 'Lợi thế Cạnh tranh Bền vững (MOAT)', content: 'Khóa chặt nguồn cung nguyên liệu (Exclusive Farming Contracts) kết hợp Kiến trúc di sản không thể sao chép bằng vốn đơn thuần. Xây dựng rào cản từ cộng đồng Loyalty Zalo.' },
      { item: 'Chiến lược Rút lui / Mở rộng (Exit/Scale)', content: 'Đóng gói quy trình (SOPs) chuẩn hóa hoàn toàn trong 18 tháng để tiến tới Nhượng quyền (Franchise) mô hình hoặc gọi vốn chuỗi (Series A) định giá $10M.' },
      { item: 'Định vị Thương hiệu Số (Digital Persona)', content: 'Phát ngôn trên MXH như một "Người chữa lành" (The Caregiver): Lắng nghe, thấu cảm, không bao giờ dùng ngôn từ chói gắt hay chiêu trò câu view (Clickbait).' }
    ]
  },
  "c2-history": {
    items: [
      { bcg: 'Ngôi sao (Star)', sbu: 'Trà Thảo Mộc Trị Liệu & Combo Trưa Eco', rev: '0.8 tỷ', target: '6.5 tỷ' },
      { bcg: 'Bò sữa (Cash Cow)', sbu: 'Cơm Niêu Gia Đình & Món Ký Ức', rev: '14.4 tỷ', target: '21.5 tỷ' },
      { bcg: 'Dấu hỏi (Question)', sbu: 'Dịch vụ Đặt tiệc riêng tư (Private Dining)', rev: '0.5 tỷ', target: '3.5 tỷ' },
      { bcg: 'Chó mực (Dog)', sbu: 'Các món xào/chiên ngập dầu (Cắt bỏ)', rev: '1.2 tỷ', target: '0 tỷ' }
    ]
  },
  "c3-issues": {
    items: [
      { sbu: 'Cơm Niêu (Core Product)', market: 'Ngách Casual Dining đang bùng nổ 25% YoY', comp: 'Ít đối thủ có câu chuyện đủ sâu', issue: 'Nút thắt cổ chai Vận Hành (Bottleneck): Tốc độ bếp cực hạn (Capacity) chỉ 120 pax/ca. Nguy cơ phật lòng khách VIP. Cần giải pháp công nghệ KDS (Kitchen Display System) điều phối ngay.' },
      { sbu: 'Combo Trưa Eco (Growth Engine)', market: 'Quy mô đại trà, TAM cực lớn (Dân VP)', comp: 'Đại dương đỏ (Red Ocean) Cloud Kitchen bám đuổi giá', issue: 'Bài toán Đơn giá (Unit Economics): Phải đàm phán giảm 15% giá bao bì bã mía số lượng lớn để giữ biên lợi nhuận > 40% mà không tăng giá bán.' },
      { sbu: 'Trà Thảo Mộc (Cross-sell)', market: 'Nhu cầu Detox & Healthy Drink tăng 40%', comp: 'Chuỗi Cafe lớn (Highlands, TCH) đang lấn sân', issue: 'Packaging hiện tại chưa đủ chuẩn Premium để mang đi làm quà tặng. Khó scale lên mảng FMCG nếu không tái thiết kế bao bì.' },
      { sbu: 'Private Dining (New)', market: 'Nhu cầu tiếp khách VIP kín đáo của giới Doanh nhân', comp: 'Nhà hàng Fine-dining truyền thống', issue: 'Thiếu nhân sự phục vụ chuẩn 5 sao. Việc setup phòng VIP đang ảnh hưởng đến luồng giao thông của khách vãng lai.' }
    ]
  },
  "c4-dashboard": {
    items: [
      { sbu: 'Bếp Nhà Mộc (Master)', kpi: 'Tỷ lệ lấp đầy bàn (Occupancy Rate)', now: '35% (Rất thấp)', next: '85% (Optimal)' },
      { sbu: 'Bếp Nhà Mộc (Master)', kpi: 'Tỷ lệ khách quay lại sau 30 ngày (D30 Retention)', now: '15%', next: '45% (Qua Zalo Mini App)' },
      { sbu: 'Bếp Nhà Mộc (Master)', kpi: 'Lợi nhuận ròng (Net Profit Margin)', now: '2% (Rủi ro)', next: '18% (Chuẩn ngành)' },
      { sbu: 'Eco Lunch Combo', kpi: 'Tốc độ tăng trưởng Đơn/Ngày (Velocity)', now: '30 đơn/ngày', next: '250 đơn/ngày' },
      { sbu: 'Performance Marketing', kpi: 'Chi phí thu hút 1 Booking (CAC)', now: '250,000đ', next: '< 40,000đ' },
      { sbu: 'Brand Awareness', kpi: 'Social Media Engagement (Tương tác)', now: '15K/tháng', next: '150K/tháng' }
    ]
  }
};
