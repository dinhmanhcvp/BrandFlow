export const BEP_NHA_MOC_FORMS_MOCK: Record<string, any> = {
  "a1-mission": {
    role: "Thương hiệu cơm gia đình và văn phòng đáng tin cậy tại Hà Nội, cung cấp bữa ăn sạch, chuẩn vị truyền thống.",
    business_def: "Bếp Nhà Mộc không chạy đua theo mô hình cơm bình dân giá rẻ hay thức ăn nhanh, mà định vị là 'Bếp nhà của người bận rộn'. Chúng tôi phục vụ những bữa ăn không ngập dầu mỡ, không lạm dụng gia vị, mang lại cảm giác thân thuộc và an tâm cho khách hàng.",
    purpose: "Giải quyết nỗi lo bữa trưa công nghiệp của dân văn phòng và nỗi vất vả nấu nướng của các gia đình nhỏ, thông qua những suất cơm 'sạch, tiện, và đáng tin' với giá cả hợp lý.",
    competency: "Kinh nghiệm nấu ăn chuẩn vị gia đình, nguồn nguyên liệu ổn định, dịch vụ chăm sóc khách hàng cá nhân hóa qua Zalo và năng lực vận hành song song cả Dine-in lẫn Delivery với 2 chi nhánh tại Cầu Giấy và Hà Đông.",
    directions: [
      { type: 'will_do', text: 'Tập trung chuyển đổi khách hàng từ các nền tảng giao đồ ăn (GrabFood, ShopeeFood) sang kênh đặt trực tiếp (Zalo/Hotline) để tối ưu biên lợi nhuận.' },
      { type: 'will_do', text: 'Chuẩn hóa 3-5 món chủ lực (Signature dishes) để tăng độ nhận diện thương hiệu, thoát khỏi cái mác "quán cơm sạch vô danh".' },
      { type: 'will_do', text: 'Phát triển các gói cơm văn phòng theo tháng (Subscription) cho tệp khách hàng doanh nghiệp SME quanh khu vực.' },
      { type: 'never_do', text: 'Tuyệt đối không tham gia các cuộc chiến giảm giá sâu (Deep Discount) hay Flash Sale ảo để bảo vệ định vị chất lượng.' },
      { type: 'never_do', text: 'Không mở rộng ồ ạt nếu quy trình bếp và chất lượng đồng đều giữa các chi nhánh chưa được chuẩn hóa hoàn toàn.' }
    ]
  },
  "a2-performance": {
    items: [
      { metric: 'Doanh thu trung bình/tháng', y3: '450 triệu', y2: '580 triệu', y1: '685 triệu', reason: 'Tăng trưởng nhờ mở thêm chi nhánh Hà Đông nhưng tốc độ chững lại do cạnh tranh khốc liệt trên app.' },
      { metric: 'Biên lợi nhuận ròng (Net Margin)', y3: '15%', y2: '12%', y1: '9% (Báo động)', reason: 'Chiết khấu nền tảng giao đồ ăn (Grab/Shopee) quá cao (lên tới 25%) cắn sâu vào lợi nhuận cuối.' },
      { metric: 'Tỷ lệ khách đặt qua App / Direct', y3: '60/40', y2: '75/25', y1: '80/20 (Rủi ro)', reason: 'Phụ thuộc quá lớn vào traffic của App. Khách hàng lười đặt qua Zalo vì thiếu ưu đãi và thói quen.' },
      { metric: 'Tỷ lệ khách hàng quay lại (Retention)', y3: '35%', y2: '30%', y1: '25%', reason: 'Nhiều đối thủ cạnh tranh mới liên tục tung combo khuyến mãi. Bếp Nhà Mộc thiếu các chương trình chăm sóc khách quen.' },
      { metric: 'Điểm đánh giá Google Maps', y3: '4.2/5', y2: '4.5/5', y1: '4.1/5', reason: 'Thời gian giao hàng (TAT) giờ cao điểm trưa bị chậm, dẫn đến feedback tiêu cực chưa được xử lý triệt để.' }
    ]
  },
  "a3-revenue": {
    items: [
      { metric: 'Doanh thu App Giao hàng', t0: '548 triệu', t1: '520 triệu', t2: '480 triệu', t3: '400 triệu', source: 'Kế hoạch chủ động giảm tỷ trọng doanh thu từ App để giảm chi phí hoa hồng (Commission).' },
      { metric: 'Doanh thu Đặt trực tiếp (Zalo)', t0: '137 triệu', t1: '215 triệu', t2: '320 triệu', t3: '450 triệu', source: 'Chiến dịch Remarketing, tặng mã freeship và tích điểm khi khách đặt qua Zalo OA.' },
      { metric: 'Doanh thu Dine-in (Tại quán)', t0: '0 triệu', t1: '50 triệu', t2: '80 triệu', t3: '120 triệu', source: 'Kích cầu ăn tối tại quán với không gian ấm cúng, dành cho khách hàng gia đình.' },
      { metric: 'Gói Cơm Doanh nghiệp (B2B)', t0: '0 triệu', t1: '45 triệu', t2: '90 triệu', t3: '150 triệu', source: 'Khai thác tệp công ty SME, cung cấp suất ăn trưa định kỳ thanh toán theo tuần/tháng.' },
      { metric: 'Tổng Doanh Thu (Gross Rev)', t0: '685 triệu', t1: '830 triệu', t2: '970 triệu', t3: '1.12 tỷ', source: 'Mục tiêu tăng trưởng bền vững 15-20%/năm bằng việc tối ưu hóa kênh Direct.' }
    ]
  },
  "a4-market": {
    items: [
      { role: 'Minh - Người Tối Ưu Ngày Thường', pain_points: 'Cần bữa trưa nhanh, tiện, đủ no để kịp làm việc. Sợ quán đông đúc, chờ lâu.', decision_drivers: 'Tốc độ giao hàng, giá cả hợp lý (40-55k), phần cơm đầy đặn.', opportunism_risk: 'Dễ dàng chuyển sang quán khác nếu có mã freeship hoặc giảm giá sâu trên app.', icon: "Zap", color: 'indigo' },
      { role: 'Lan - Người Tổ Chức Chu Đáo', pain_points: 'Áp lực khi phải đặt cơm trưa cho cả phòng ban. Sợ đồ ăn kém vệ sinh, sai order.', decision_drivers: 'Đóng gói sạch sẽ, giao đúng giờ, có xuất hóa đơn, dịch vụ hỗ trợ (Zalo) phản hồi nhanh.', opportunism_risk: 'Nếu quán quên món hoặc giao trễ làm ảnh hưởng uy tín của cô ấy với sếp, sẽ không bao giờ đặt lại.', icon: "Users", color: 'amber' },
      { role: 'Thảo - Người Sống Lành Mạnh', pain_points: 'Chán ngấy cơm văn phòng ngập dầu mỡ, nhiều bột ngọt (MSG). Cần đồ ăn thanh đạm.', decision_drivers: 'Hình ảnh thực đơn có rau xanh tươi, cảm giác "như nhà nấu", nguyên liệu rõ ràng.', opportunism_risk: 'Khó tính với chất lượng món ăn, sẵn sàng review 1 sao nếu thấy đồ ăn cũ hoặc nhiều mỡ.', icon: "Leaf", color: 'emerald' }
    ]
  },
  "a5-swot": {
    items: [
      { ksf: 'Chất lượng đồ ăn (Vị nhà nấu, ít dầu mỡ)', weight: '30%', our_score: 8, comp_score: 6, issue: 'Điểm mạnh lõi nhưng chưa truyền thông đúng mức. Khách chỉ nhận ra sau khi đã ăn thử.' },
      { ksf: 'Nhận diện thương hiệu & Định vị', weight: '20%', our_score: 4, comp_score: 7, issue: 'Điểm yếu lớn (Tử huyệt): Khách chỉ nhớ là "quán cơm sạch ở Cầu Giấy" thay vì tên Bếp Nhà Mộc.' },
      { ksf: 'Tối ưu Vận hành Kênh Giao hàng', weight: '25%', our_score: 7, comp_score: 8, issue: 'Chi phí nền tảng ăn mòn lợi nhuận. Cần gấp rút dịch chuyển khách hàng sang kênh sở hữu (Zalo).' },
      { ksf: 'Đa dạng hóa Luồng Doanh Thu', weight: '15%', our_score: 3, comp_score: 6, issue: 'Quá tập trung vào buổi trưa. Khung giờ tối và cuối tuần lãng phí mặt bằng và nhân sự.' },
      { ksf: 'Chăm sóc Khách hàng (CRM)', weight: '10%', our_score: 5, comp_score: 6, issue: 'Chăm sóc Zalo thủ công khá tốt, nhưng chưa hệ thống hóa thành chương trình Khách hàng thân thiết rõ ràng.' }
    ]
  },
  "a6-portfolio": {
    items: [
      { segment: 'Cơm Văn Phòng (Đĩa/Hộp)', attr: 'Rất Cao (Cash Cow)', pos: 'Mạnh', decision: 'Duy trì chất lượng. Chèn tờ rơi (Flyer) vào hộp cơm App để mời khách qua Zalo nhận ưu đãi lần sau.' },
      { segment: 'Món Chủ Lực (Signature Dishes)', attr: 'Cao (Star)', pos: 'Trung bình', decision: 'Lựa chọn 3 món ngon nhất (VD: Thịt kho tàu niêu đất) để đẩy mạnh quảng cáo, tạo Top of Mind.' },
      { segment: 'Catering Doanh Nghiệp (Subscription)', attr: 'Trung bình (Question Mark)', pos: 'Mới', decision: 'Đóng gói quy trình, làm menu riêng. Giao sales tiếp cận trực tiếp HR/Admin các công ty quanh bán kính 2km.' },
      { segment: 'Các món chiên/xào dầu mỡ cao', attr: 'Thấp (Dog)', pos: 'Yếu', decision: 'Loại bỏ khỏi thực đơn để nhất quán với định vị "Cơm sạch, healthy, như nhà nấu".' }
    ]
  },
  "a7-assumptions": {
    items: [
      { core: 'Khách hàng văn phòng sẵn sàng đặt qua Zalo nếu được lợi ích tương đương App.', logic: 'Mã giảm giá App bị cắt giảm dần. Nếu Zalo có Freeship và giao nhanh, khách sẽ chuyển dịch do thói quen nhắn tin hàng ngày.', action: 'Xây dựng Zalo OA chuyên nghiệp, có chatbot hỗ trợ chọn món và chốt đơn nhanh.' },
      { core: 'Ngân sách Marketing cực kỳ hạn hẹp (<5% doanh thu).', logic: 'Biên lợi nhuận ròng chỉ 8-12%, không cho phép vung tiền chạy Ads Facebook ồ ạt hay thuê KOLs đắt đỏ.', action: 'Tập trung 100% vào Marketing 0 đồng (Content Organic), Remarketing tệp khách cũ và Local SEO (Google Maps).' },
      { core: 'Vận hành bếp có thể chịu tải thêm 30% vào giờ trưa.', logic: 'Hệ thống bếp tại Cầu Giấy và Hà Đông vẫn còn dư công suất (Idle capacity) nếu quy trình chuẩn bị sơ chế làm tốt từ sáng.', action: 'Chỉ triển khai chiến dịch đẩy sale mạnh khi đã chuẩn bị xong nhân sự đóng gói, tránh vỡ trận giờ cao điểm (11h-12h30).' }
    ]
  },
  "a8-strategies": {
    items: [
      { level: 'Total Revenue (Doanh thu)', past: '685 triệu', now: '685 triệu', target: '900 triệu', note: 'Mục tiêu tăng 30% sau 12 tháng bằng cách đẩy mạnh kênh Zalo & Catering' },
      { level: 'Net Profit Margin (Biên LN Ròng)', past: '9%', now: '9%', target: '15%', note: 'Cắt giảm 30% lượng đơn phụ thuộc App (Grab/Shopee) để tiết kiệm hoa hồng' },
      { level: 'Zalo Direct Orders (Tỷ trọng đơn Zalo)', past: '20%', now: '20%', target: '45%', note: 'Sử dụng Zalo ZNS và Miniapp để remarketing' },
      { level: 'Google Maps Rating', past: '4.1', now: '4.1', target: '4.6', note: 'Chủ động xin review và xử lý complain theo quy tắc 3 bước' }
    ],
    campaign_phasing: [
      { phase: 'GĐ1: Củng Cố Móng (Tối ưu Local & Zalo)', description: 'Thiết lập chuẩn hóa hình ảnh món ăn (chụp ánh sáng tự nhiên). Cập nhật Google Maps. Xây dựng Zalo OA và in Flyer/Sticker dán hộp cơm để kéo khách từ App về Zalo.', time: 'Tháng 1 - Tháng 2' },
      { phase: 'GĐ2: Nhận Diện Món Lõi (Hero Product)', description: 'Ra mắt 3 món Signature. Triển khai nội dung Storytelling về nguồn gốc nguyên liệu, cách nấu. Bắt đầu đăng bài đều đặn trên Fanpage/Zalo lúc 10h sáng hàng ngày.', time: 'Tháng 3 - Tháng 4' },
      { phase: 'GĐ3: Mở Rộng B2B (Catering Office)', description: 'Khởi chạy gói Cơm Tháng cho Doanh nghiệp SME. Phát tờ rơi tại các sảnh văn phòng Cầu Giấy. Chạy chiến dịch "Bữa Cơm Cuối Năm, Đừng Để Bếp Nhà Lạnh".', time: 'Tháng 5 - Tháng 8' }
    ]
  },
  "a9-budget": {
    items: [
      { item: 'Doanh thu thuần mục tiêu', t0: '685 tr', t1: '750 tr', t2: '820 tr', t3: '900 tr' },
      { item: 'Phí hoa hồng App (Giảm dần)', t0: '137 tr', t1: '110 tr', t2: '85 tr', t3: '65 tr' },
      { item: 'Chi phí NVL (Food Cost - 35%)', t0: '239 tr', t1: '262 tr', t2: '287 tr', t3: '315 tr' },
      { item: 'Chi phí Vận hành (Mặt bằng, Lương)', t0: '215 tr', t1: '215 tr', t2: '220 tr', t3: '225 tr' },
      { item: 'Ngân sách Marketing (Khoảng 4%)', t0: '27 tr', t1: '30 tr', t2: '32 tr', t3: '36 tr' },
      { item: 'Lợi Nhuận Ròng (Net Profit)', t0: '67 tr', t1: '133 tr', t2: '196 tr', t3: '259 tr' }
    ]
  },
  "b1-objectives": {
    items: [
      { pair: 'Dân VP tối ưu chi phí / Zalo OA', vol: '150 đơn/ngày', margin: '45%', strategy: 'Kẹp tờ rơi vào đơn Grab/Shopee tặng mã giảm 15% cho lần đặt tiếp theo qua Zalo.', budget: '5 tr' },
      { pair: 'Nhân sự Admin/HR / Gói Cơm Tháng', vol: '10 Hợp đồng', margin: '35%', strategy: 'Direct sales, phát hộp cơm ăn thử (Sampling) cho HR các công ty quy mô 20-50 người.', budget: '8 tr' },
      { pair: 'Khách gia đình lười nấu / Ăn tối', vol: '30 bàn/tuần', margin: '55%', strategy: 'Đăng Facebook/Zalo bài viết kể chuyện ẩm thực gia đình, combo 3-4 người.', budget: '7 tr' }
    ]
  },
  "b2-action": {
    items: [
      { obj: 'Chuyển đổi App -> Zalo', tactic: 'Thiết kế & in 5000 tờ rơi, sticker dán kèm hộp cơm có mã QR kết nối Zalo OA. Tặng Freeship/Nước ép.', owner: 'Quản lý cửa hàng', deadline: 'Tuần 1, Tháng 1', cost: '3,500,000' },
      { obj: 'Content Hàng Ngày', tactic: 'Lên lịch đăng bài Facebook/Zalo lúc 10h00 sáng. Chuẩn hóa hình ảnh (ánh sáng tự nhiên, nền mây/gỗ). Không dùng ảnh AI.', owner: 'Admin/Thu ngân', deadline: 'Hàng ngày', cost: '0' },
      { obj: 'Cải thiện Google Maps', tactic: 'Nhân viên mời khách ăn tại quán review Google Maps để nhận mã giảm giá. Phản hồi 100% review trong 48h.', owner: 'Quản lý cửa hàng', deadline: 'Hàng tuần', cost: '1,000,000' },
      { obj: 'B2B Cơm Văn Phòng', tactic: 'Lập danh sách 50 công ty quanh bán kính 2km. Gọi điện và gửi 20 suất ăn dùng thử (Sampling).', owner: 'Chủ cửa hàng', deadline: 'Tuần 2, Tháng 3', cost: '5,000,000' },
      { obj: 'Chiến dịch Tết: Bữa Cơm Cuối Năm', tactic: 'Bán Set lẩu/Mâm cơm tất niên cho công ty nhỏ không tổ chức tiệc lớn. Thiết kế menu riêng, nhận Pre-order.', owner: 'Bếp trưởng', deadline: 'Tuần 3, Tháng 12', cost: '8,000,000' }
    ]
  },
  "b3-budget": {
    items: [
      { item: 'In ấn Trade MKT (Tờ rơi, Sticker, Menu)', past: '1 tr', now: '5 tr', next: '6 tr' },
      { item: 'Chi phí Sampling (Mời ăn thử B2B, HR)', past: '0 tr', now: '4 tr', next: '6 tr' },
      { item: 'Quảng cáo Facebook Ads (Bán kính 3km)', past: '15 tr', now: '10 tr', next: '12 tr' },
      { item: 'Quản lý Zalo OA & SMS Chăm sóc KH', past: '0 tr', now: '2 tr', next: '3 tr' },
      { item: 'Gói chụp ảnh sản phẩm (Nhiếp ảnh gia Freelance)', past: '0 tr', now: '5 tr', next: '0 tr' }
    ]
  },
  "b4-contingency": {
    items: [
      { risk: 'Quá tải giờ trưa (11:30 - 12:30)', level: 'Cao', impact: 'Giao trễ, khách complain, tài xế Grab hủy đơn, rate 1 sao.', trigger: 'Số đơn dồn ứ > 50 đơn cùng lúc tại bếp.', action: 'Dừng nhận đơn App ngay lập tức. Ưu tiên xử lý đơn Zalo và đơn khách quen. Báo trước khách thời gian chờ.' },
      { risk: 'Khách phàn nàn đồ ăn (Sâu rau, nguội)', level: 'Trung bình', impact: 'Mất khách vĩnh viễn nếu xử lý tồi.', trigger: 'Khách nhắn tin Zalo hoặc review mắng quán.', action: 'Áp dụng quy tắc 3 bước: Nhận lỗi (không biện hộ) -> Chuyển qua kênh riêng -> Đền hoàn tiền hoặc tặng voucher.' },
      { risk: 'Khách không quét mã QR Zalo', level: 'Trung bình', impact: 'Tỷ lệ chuyển đổi thấp, lãng phí chi phí in ấn.', trigger: 'Sau 2 tuần, lượng follow Zalo OA tăng < 5%.', action: 'Thay đổi offer trên tờ rơi (Từ tặng món phụ sang Giảm trực tiếp 15k). Yêu cầu NV giao hàng nhắc trực tiếp.' }
    ]
  },
  "b5-pnl": {
    items: [
      { item: 'Doanh thu trung bình/Tháng (Current)', val: '685 tr', ratio: '100%' },
      { item: 'Chi phí Giá vốn (Food Cost - 35%)', val: '239 tr', ratio: '35.0%' },
      { item: 'Chiết khấu App (TB 15% trên tổng DT)', val: '102 tr', ratio: '15.0% (Pain point)' },
      { item: 'Chi phí Vận hành (Mặt bằng, Lương, Điện)', val: '250 tr', ratio: '36.5%' },
      { item: 'Chi phí Marketing', val: '27 tr', ratio: '3.9%' },
      { item: 'Lợi Nhuận Ròng Trước Thuế', val: '67 tr', ratio: '9.8% (Cần cải thiện)' }
    ]
  },
  "b6-gantt": {
    items: [
      { name: 'Chuẩn hóa Menu ảnh & Set up Zalo OA', t8: true, t9: false, t10: false, t11: false, t12: false },
      { name: 'Kẹp tờ rơi chuyển đổi App -> Zalo', t8: true, t9: true, t10: true, t11: true, t12: true },
      { name: 'Content Thực Đơn Hàng Ngày (10h Sáng)', t8: true, t9: true, t10: true, t11: true, t12: true },
      { name: 'Sampling Cơm Văn Phòng (B2B Sales)', t8: false, t9: true, t10: true, t11: false, t12: false },
      { name: 'Chiến dịch Tết "Bữa Cơm Cuối Năm"', t8: false, t9: false, t10: false, t11: true, t12: true }
    ]
  },
  "c1-direction": {
    items: [
      { item: 'Định vị Kênh (Channel Strategy)', content: 'Biến Zalo thành trụ cột mang lại lợi nhuận cốt lõi (Core Profit Engine). Các App giao đồ ăn chỉ đóng vai trò kênh thu hút khách hàng mới (Acquisition Channel).' },
      { item: 'Lợi thế Khác biệt (Differentiator)', content: 'Sự tỉ mỉ, cá nhân hóa. Nhớ khẩu vị khách quen (VD: Không hành, ít cơm). Định vị là nhà hàng có dịch vụ chu đáo chứ không phải xưởng nấu công nghiệp.' },
      { item: 'Quy tắc Content', content: 'Chụp ảnh thật, ánh sáng tự nhiên. Font chữ đơn giản (Playfair Display). Tuyệt đối không dùng từ phóng đại (Ngon nhất, rẻ nhất), không áp lực giả (Flash sale).' }
    ]
  },
  "c2-history": {
    items: [
      { bcg: 'Ngôi sao (Star)', sbu: 'Đơn hàng Zalo trực tiếp & Cơm B2B', rev: '137 tr', target: '450 tr' },
      { bcg: 'Bò sữa (Cash Cow)', sbu: 'Đơn hàng App (Grab/Shopee)', rev: '548 tr', target: '400 tr' },
      { bcg: 'Dấu hỏi (Question)', sbu: 'Dine-in (Ăn tối tại quán)', rev: '0 tr', target: '120 tr' }
    ]
  },
  "c3-issues": {
    items: [
      { sbu: 'Vận hành Bếp Giờ Trưa', market: 'Rất đông đúc', comp: 'Cloud Kitchen tốc độ nhanh', issue: 'Đóng gói chậm, hay nhầm món khi vội. Cần chia rõ Line nhặt đồ: 1 cho App, 1 cho Zalo.' },
      { sbu: 'Marketing Nội Bộ', market: 'Không có nhân sự chuyên MKT', comp: 'Các chuỗi có MKT In-house', issue: 'Bài đăng Fanpage lộn xộn, hay quên đăng. Cần bộ Template Canva thiết kế sẵn và đặt lịch tự động hóa.' },
      { sbu: 'Định giá trên App', market: 'Nhạy cảm về giá', comp: 'Cơm bình dân 35k', issue: 'Bán giá gốc trên App sẽ lỗ do phí 25%. Phải tạo Combo riêng cho App (Tăng giá bán + Tặng kèm nước) để bù đắp.' }
    ]
  },
  "c4-dashboard": {
    items: [
      { sbu: 'Hiệu quả Chuyển đổi', kpi: 'Tỷ trọng Doanh thu Zalo / Tổng DT', now: '20%', next: '45%' },
      { sbu: 'Vận hành Bếp', kpi: 'Tỷ lệ đơn trễ / Phàn nàn', now: '5%', next: '< 1%' },
      { sbu: 'Tài chính', kpi: 'Biên Lợi Nhuận Ròng (Net Margin)', now: '9.8%', next: '15.0%' },
      { sbu: 'Khách hàng', kpi: 'Tỷ lệ khách quay lại lần 2 (Retention)', now: '25%', next: '45%' },
      { sbu: 'Thương hiệu', kpi: 'Lượt đánh giá 5 sao Google Maps/Tháng', now: '10 review', next: '50 review' }
    ]
  }
};
