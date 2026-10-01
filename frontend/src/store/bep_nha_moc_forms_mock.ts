export const BEP_NHA_MOC_FORMS_MOCK: Record<string, any> = {
  "a1-mission": {
    role: "Thương hiệu cơm gia đình và văn phòng đáng tin cậy tại Hà Nội, cung cấp bữa ăn sạch, chuẩn vị truyền thống.",
    role_rationale: "Theo dữ liệu thu thập, khách hàng hiện tại chủ yếu nhớ đến doanh nghiệp qua cụm từ 'quán cơm sạch ở Cầu Giấy'. Định vị 'đáng tin cậy' và 'chuẩn vị truyền thống' giúp chuyển hóa cảm nhận mơ hồ này thành một bản sắc thương hiệu rõ ràng, tạo niềm tin cho dân văn phòng và gia đình khi lựa chọn bữa ăn hàng ngày mà không lo ngại về an toàn thực phẩm.",
    business_def: "Bếp Nhà Mộc không chạy đua theo mô hình cơm bình dân giá rẻ hay thức ăn nhanh. Chúng tôi định vị là 'Bếp nhà của người bận rộn'. Bếp phục vụ bữa ăn không ngập dầu mỡ, không lạm dụng bột ngọt, mang lại cảm giác an tâm và dinh dưỡng cân bằng.",
    business_def_rationale: "Phân tích điểm chuẩn (Benchmarking) cho thấy cạnh tranh về giá trên App giao đồ ăn là cuộc chiến 'đáy'. Bằng cách định vị 'Bếp nhà của người bận rộn', chúng ta tạo ra rào cản phân khúc, nhắm trực tiếp vào khách hàng sẵn sàng trả thêm 10-15% để đổi lấy sức khỏe. Điều này phù hợp với xu hướng 'Mindful Dining'.",
    purpose: "Giải quyết nỗi lo bữa trưa công nghiệp đầy dầu mỡ của dân văn phòng, cũng như nỗi vất vả nấu nướng của gia đình nhỏ sau ngày dài làm việc, thông qua những suất cơm 'sạch, tiện, đáng tin'.",
    purpose_rationale: "Mục tiêu cốt lõi này được thiết kế để giải quyết chính xác Pain Point lớn nhất của 3 tệp khách hàng chính (Minh - cần tiện, Lan - cần an tâm cho nhóm, Thảo - cần sạch). Sự kết hợp này tối đa hóa Lifetime Value (LTV) từ tệp khách hàng lặp lại.",
    competency: "Kinh nghiệm nấu ăn chuẩn vị gia đình, nguồn nguyên liệu sạch ổn định, dịch vụ chăm sóc khách hàng cá nhân hóa qua Zalo và năng lực vận hành song song Dine-in lẫn Delivery với 2 chi nhánh tại Cầu Giấy và Hà Đông.",
    competency_rationale: "Việc nhấn mạnh 'cá nhân hóa qua Zalo' tận dụng điểm mạnh mà các chuỗi Cloud Kitchen công nghiệp không làm được. Nhớ được khẩu vị khách quen (ví dụ: không hành, ăn ít cơm) chính là lợi thế cạnh tranh cốt lõi bảo vệ tỷ lệ Retention.",
    directions: [
      { type: 'will_do', text: 'Tập trung chuyển đổi khách hàng từ nền tảng giao đồ ăn trung gian (Grab/Shopee) sang Zalo/Hotline.', rationale: 'Biên lợi nhuận ròng hiện chỉ ở mức 8-12% do bị bào mòn bởi phí hoa hồng lên tới 25%. Chuyển đổi O2O sang Zalo là chiến lược sinh tồn bắt buộc để bảo vệ dòng tiền.' },
      { type: 'will_do', text: 'Chuẩn hóa 3-5 món chủ lực (Signature dishes) để tăng độ nhận diện thương hiệu.', rationale: 'Khách hàng không nhớ tên thương hiệu vì thực đơn đang quá dàn trải. Món Signature sẽ đóng vai trò Hero Product, tạo điểm neo trí nhớ cực mạnh.' },
      { type: 'will_do', text: 'Phát triển gói cơm văn phòng theo tháng (Subscription) cho tệp B2B quanh bán kính 2km.', rationale: 'Tận dụng công suất bếp dư thừa vào buổi sáng, đảm bảo dòng tiền (Cashflow) ổn định trước nhờ các hợp đồng trả trước của HR công ty.' },
      { type: 'never_do', text: 'Tuyệt đối không tham gia cuộc chiến giảm giá sâu (Deep Discount) hay Flash Sale ảo.', rationale: 'Lạm dụng giảm giá làm suy giảm tài sản thương hiệu và thu hút tệp khách hàng cơ hội (Cherry-pickers), làm hỏng tỷ lệ LTV:CAC.' },
      { type: 'never_do', text: 'Không mở rộng ồ ạt chi nhánh mới nếu quy trình QC chưa đồng bộ.', rationale: 'Rủi ro lớn nhất là hiệu ứng pha loãng chất lượng (Quality Dilution). Hệ thống kiểm soát chất lượng phải đi trước tốc độ mở rộng.' }
    ]
  },
  "a2-performance": {
    items: [
      { metric: 'Doanh thu thuần (Net Rev)', y3: '4.5 tỷ', y2: '6.96 tỷ', y1: '8.22 tỷ', reason: 'Tốc độ tăng trưởng năm gần nhất (YoY) sụt giảm chỉ còn 18% so với 54% của năm trước đó. Nguyên nhân chính do mô hình Cloud Kitchen giá rẻ bùng nổ xung quanh khu vực Duy Tân, hút mất 20% lượng khách nhạy cảm về giá (Price-sensitive).', rationale: 'Báo cáo cảnh báo đỏ (Red Flag): Doanh nghiệp đang chạm trần (Ceiling) của mô hình B2C bán lẻ. Khuyến nghị chiến lược Market Penetration sâu hơn thông qua các hợp đồng B2B Catering dài hạn để tạo lực đẩy mới.' },
      { metric: 'Biên lợi nhuận ròng (Net Margin)', y3: '16.5%', y2: '11.2%', y1: '8.4% (Nguy hiểm)', reason: 'Cấu trúc chi phí bị bóp nghẹt. Phí chiết khấu từ Grab/ShopeeFood tăng trung bình từ 20% lên 25%, cộng thêm chi phí chạy quảng cáo nội sàn (In-app Ads) để duy trì vị trí hiển thị khiến giá vốn hàng bán (COGS) thực tế bị đội lên rất cao.', rationale: 'Chỉ số ROE và Dòng tiền tự do (FCF) đang suy kiệt. Cấp thiết phải tái cấu trúc phễu bán hàng (Sales Funnel). Chuyển dịch ít nhất 30% lượng truy cập sang Kênh Sở Hữu (Owned Media) như Zalo OA để cắt giảm 15-20% chi phí trung gian.' },
      { metric: 'Chi phí thu hút KH (CAC) vs LTV', y3: 'CAC: 12k | LTV: 250k', y2: 'CAC: 25k | LTV: 210k', y1: 'CAC: 45k | LTV: 185k', reason: 'Hiệu quả quảng cáo suy giảm mạnh. Khách hàng ngày càng kém trung thành do bị bủa vây bởi các mã khuyến mãi ảo (Flash Sale).', rationale: 'Tỷ lệ LTV:CAC rơi từ 20:1 xuống còn 4:1. Khi tỷ lệ này tiệm cận mức 3:1, doanh nghiệp bắt đầu đốt tiền vô ích. Cần dừng ngay các chiến dịch Mass Ads và chuyển sang Remarketing cá nhân hóa.' },
      { metric: 'Tỷ lệ khách hàng quay lại (Retention)', y3: '42%', y2: '35%', y1: '28%', reason: 'Không có hệ thống lưu trữ dữ liệu (CRM) và chăm sóc sau mua. Trải nghiệm dịch vụ không đồng đều vào các giờ cao điểm.', rationale: 'Customer Churn Rate 72% là lỗ hổng chí mạng. Mọi ngân sách Marketing hiện tại giống như đổ nước vào thùng không đáy. Khởi tạo ngay Loyalty Program tích điểm.' },
      { metric: 'Điểm CSAT & Local SEO', y3: '4.5/5.0 (210 re)', y2: '4.3/5.0 (540 re)', y1: '4.1/5.0 (890 re)', reason: 'Quá tải vận hành khung giờ 11:30 - 12:30. Khách hàng phàn nàn nhiều về việc shipper giao muộn, canh bị đổ và thức ăn nguội lạnh.', rationale: 'Thuật toán Local SEO của Google trừng phạt nặng nề các doanh nghiệp có Rating dưới 4.2. Cần tái thiết kế quy trình đóng gói (Packaging) và ra quy trình xử lý khủng hoảng (Crisis Management) 3 bước.' }
    ]
  },
  "a3-revenue": {
    items: [
      { metric: 'Kênh Food App (Grab/Shopee)', t0: '6.5 tỷ', t1: '5.2 tỷ', t2: '4.1 tỷ', t3: '3.0 tỷ', source: 'Chiến lược thoái lui có chủ đích. Chủ động tắt các gói quảng cáo hiển thị đắt đỏ trên App, chỉ duy trì hiện diện tự nhiên để hứng traffic mới.', rationale: 'Growth Hacking không có nghĩa là tăng doanh thu bằng mọi giá. Việc cắt giảm doanh thu kênh này giúp giải phóng nguồn lực bếp và cải thiện tỷ suất lợi nhuận gộp toàn hệ thống.' },
      { metric: 'Kênh Trực tiếp (Zalo/Hotline)', t0: '1.7 tỷ', t1: '4.5 tỷ', t2: '7.2 tỷ', t3: '9.5 tỷ', source: 'Động cơ tăng trưởng chính (Core Engine). Đạt được qua chuỗi chiến dịch Zalo ZNS remarketing tự động và chính sách thẻ thành viên thân thiết.', rationale: 'Với biên lợi nhuận cao hơn 25% so với kênh App, dòng tiền từ Zalo sẽ là nguồn sữa nuôi dưỡng các hoạt động R&D và mở rộng chi nhánh mới.' },
      { metric: 'Kênh Phục vụ tại chỗ (Dine-in)', t0: '0 tỷ', t1: '1.2 tỷ', t2: '2.5 tỷ', t3: '4.0 tỷ', source: 'Khai thác tối đa công suất mặt bằng vào buổi tối và cuối tuần với Menu "Mâm Cơm Đoàn Viên" nhắm đến gia đình trẻ.', rationale: 'Chiến lược tối ưu hóa tài sản (Asset Utilization). Chi phí cố định (Mặt bằng, khấu hao) đã được gánh bởi buổi trưa, doanh thu Dine-in sẽ đổ thẳng vào Lợi nhuận ròng.' },
      { metric: 'Kênh B2B (Catering/Cơm)', t0: '0 tỷ', t1: '1.5 tỷ', t2: '3.8 tỷ', t3: '6.5 tỷ', source: 'Tiếp cận các công ty công nghệ/startup quy mô 30-50 nhân sự bằng các gói hợp đồng trả trước hàng tháng.', rationale: 'Bảo chứng dòng tiền (Cashflow Hedge). Mô hình B2B mang lại dòng tiền dự báo được (Predictable Revenue), giúp phòng thu mua đàm phán giá sỉ nguyên liệu tốt hơn 15%.' },
      { metric: 'Tổng Doanh Thu (Gross Rev)', t0: '8.2 tỷ', t1: '12.4 tỷ', t2: '17.6 tỷ', t3: '23.0 tỷ', source: 'Tăng trưởng kép hằng năm (CAGR) mục tiêu đạt 41%.', rationale: 'Đây không phải tăng trưởng ảo bằng cách đốt tiền. Cấu trúc doanh thu đã được xoay trục (Pivot) sang các kênh mang lại biên lợi nhuận cao, đảm bảo tăng trưởng bền vững.' }
    ]
  },
  "a4-market": {
    items: [
      { role: 'Minh - Người Tối Ưu Ngày Thường', pain_points: 'Áp lực KPI cao, chỉ có 45 phút nghỉ trưa. Sợ quán đông, phục vụ chậm.', decision_drivers: 'Tốc độ giao nhanh (TAT < 20p), giá 40-55k, phần cơm đầy đặn.', opportunism_risk: 'Lòng trung thành cực thấp. Dễ đổi quán nếu đối thủ có mã Freeship.', icon: 'Zap', color: 'indigo', rationale: 'Tệp Minh là Volume Driver. Cần giữ chân bằng Subscription để khóa chặt lựa chọn mỗi trưa.' },
      { role: 'Lan - Người Tổ Chức Chu Đáo', pain_points: 'Áp lực khi đặt cơm cho cả phòng ban. Sợ đồ dở, giao nhầm, cần hóa đơn đỏ (VAT).', decision_drivers: 'Giao hàng đúng giờ, đóng gói sạch, hỗ trợ Zalo tức thì, xuất hóa đơn.', opportunism_risk: 'Giao trễ làm ảnh hưởng uy tín sếp là cô ấy cạch mặt vĩnh viễn.', icon: 'Users', color: 'amber', rationale: 'Tệp Lan là High-Ticket Client. Ít nhạy cảm giá nhưng cần dịch vụ hoàn hảo. Phản hồi Zalo < 1 phút.' },
      { role: 'Thảo - Người Sống Lành Mạnh', pain_points: 'Ám ảnh cân nặng. Chán đồ ăn dầu mỡ bột ngọt gây buồn ngủ.', decision_drivers: 'Rau xanh tươi mát, chuẩn cơm mẹ nấu, hộp bã mía bảo vệ môi trường.', opportunism_risk: 'Khó tính, sẵn sàng bóc phốt MXH nếu phát hiện thực phẩm ôi thiu.', icon: 'Leaf', color: 'emerald', rationale: 'Tệp Thảo là Brand Advocate. Thích chia sẻ đồ ăn đẹp, giúp định vị "Cơm Sạch" được lan tỏa.' }
    ]
  },
  "a5-swot": {
    items: [
      { ksf: 'Chất lượng lõi (Core Product Quality)', weight: '30%', our_score: 8, comp_score: 5, issue: '[S] Điểm mạnh (Strength) tuyệt đối. Triết lý "Không bột ngọt, ít dầu mỡ, nấu từ tâm" được khách hàng thực tế công nhận mạnh mẽ nhưng lại cực kỳ thiếu Storytelling để truyền thông.', rationale: 'Trong F&B, đồ ăn ngon chưa đủ, bạn phải cho khách hàng biết TẠI SAO nó ngon. Lập tức triển khai chiến dịch "Chuyện Bếp Nhà" để mã hóa chất lượng thành ngôn từ tiếp thị.' },
      { ksf: 'Định vị Thương hiệu (Brand Equity)', weight: '20%', our_score: 4, comp_score: 8, issue: '[W] Điểm yếu tử huyệt. Tính nhận diện thương hiệu gần như bằng 0. Bao bì lộn xộn, khách chỉ nhớ đây là một "quán cơm bình dân sạch sẽ ở Cầu Giấy".', rationale: 'Nhận diện yếu tước đi khả năng định giá cao (Premium Pricing). Ngân sách cấp thiết cho Quý 1 là tái thiết kế toàn bộ Visual Identity (Bao bì, Đồng phục, Sticker).' },
      { ksf: 'Vận hành Giao hàng (Delivery Ops)', weight: '25%', our_score: 6, comp_score: 9, issue: '[T] Mối đe dọa. Các chuỗi Cloud Kitchen tối ưu quy trình ra đồ dưới 2 phút. Bếp Nhà Mộc thường xuyên tắc nghẽn ở khâu đóng gói vào lúc 12h15.', rationale: 'Tốc độ là vua trong ngành cơm trưa. Yêu cầu tái thiết kế lay-out bếp, áp dụng triệt để mô hình sơ chế Mise-en-place để đạt KPI ra món < 3 phút/đơn.' },
      { ksf: 'Đa dạng hóa Hệ sinh thái Doanh thu', weight: '15%', our_score: 2, comp_score: 7, issue: '[W] Điểm yếu tài chính. Phụ thuộc 100% vào bữa trưa và kênh App, khiến doanh nghiệp cực kỳ nhạy cảm với các biến động thuật toán hoặc chính sách chiết khấu của nền tảng.', rationale: 'Bài toán kinh điển về đa dạng hóa rủi ro (Risk Diversification). Phải kích hoạt ngay kênh B2B và Dine-in để xây dựng hệ sinh thái doanh thu 3 chân vững chắc.' },
      { ksf: 'Chăm sóc Khách hàng (CRM & Loyalty)', weight: '10%', our_score: 5, comp_score: 4, issue: '[O] Cơ hội vàng. Toàn bộ đối thủ trong phân khúc chỉ tập trung bán hàng (Transaction) mà bỏ quên việc xây dựng quan hệ (Relationship).', rationale: 'Cơ hội chiếm lĩnh tâm trí (Share of Mind). Tiên phong ứng dụng Zalo Mini App để số hóa tập khách hàng, tạo lợi thế người dẫn đầu (First-mover Advantage) trong phân khúc.' }
    ]
  },
  "a6-portfolio": {
    items: [
      { segment: 'Cơm Văn Phòng (Đơn App)', attr: 'Rất Cao (Cash Cow)', pos: 'Mạnh', decision: 'Rút dần ngân sách (Harvest Strategy).', rationale: 'Bò sữa đang cạn kiệt lợi nhuận. Chỉ duy trì chất lượng để hút Dòng tiền (Cash) và Dữ liệu khách hàng (Data). Ngay lập tức dùng tờ rơi chèn vào các đơn này để hút phễu về kênh Owned Media (Zalo).' },
      { segment: 'Thịt kho niêu & Cá kho tộ (Signature)', attr: 'Cao (Star)', pos: 'Trung bình', decision: 'Bơm mạnh ngân sách truyền thông (Build Strategy).', rationale: 'Đây là Ngôi Sao (Hero Product). Nó mang sứ mệnh định vị sự khác biệt của Bếp Nhà Mộc. Chấp nhận hy sinh một phần lợi nhuận ban đầu để biến các món này thành mồi nhử truyền thông (Traffic Magnet).' },
      { segment: 'Gói Cơm B2B Doanh Nghiệp', attr: 'Rất Cao (Question)', pos: 'Mới', decision: 'Đầu tư mạo hiểm nhưng có kiểm soát. Tuyển dụng 1 B2B Sales Key Account.', rationale: 'Thị trường ngách (Niche) vô cùng béo bở chưa bị khai thác. Cần thử nghiệm A/B Testing với 20 công ty đầu tiên, nếu tỷ lệ chốt (Conversion Rate) đạt >15% sẽ dồn toàn lực đánh chiếm.' },
      { segment: 'Các món chiên, xào nhiều dầu', attr: 'Thấp (Dog)', pos: 'Yếu', decision: 'Kiên quyết loại bỏ (Divest Strategy).', rationale: 'Những con "Chó Mực" không chỉ biên lợi nhuận thấp, tốn thời gian chế biến mà còn phá hoại định vị cốt lõi "Cơm Sạch, Ít Dầu Mỡ". Việc cắt bỏ giúp tinh gọn Menu, giảm hao hụt nguyên liệu.' }
    ]
  },
  "a7-assumptions": {
    items: [
      { core: 'Khách sẵn sàng đặt qua Zalo nếu lợi ích tương đương App.', logic: 'Mã giảm giá App đang cạn. Zalo có Freeship + Giao nhanh sẽ thay đổi thói quen.', action: 'Xây dựng Zalo OA chuyên nghiệp, có chatbot hỗ trợ.', rationale: 'Người dùng Việt Nam online Zalo 4h/ngày. Rào cản kỹ thuật là 0 nếu trải nghiệm đủ mượt.' },
      { core: 'Ngân sách Marketing cực hẹp (<4% doanh thu).', logic: 'Biên lợi nhuận ròng chỉ 9%, không được phép đốt Ads diện rộng.', action: '100% Marketing 0 đồng (UGC), Remarketing khách cũ và Local SEO.', rationale: 'Ngân sách nhỏ đòi hỏi Snipper Approach (Bắn tỉa), nhắm trúng tệp khách <2km.' },
      { core: 'Vận hành bếp có thể chịu thêm 30% tải giờ trưa.', logic: 'Công suất thiết kế của chi nhánh vẫn còn dư (Idle Capacity) nếu chuẩn bị trước.', action: 'Chỉ triển khai chiến dịch đẩy số khi bếp đã chuẩn bị quy trình nhặt đồ riêng biệt.', rationale: 'Quality Control quan trọng hơn Sale. Marketing quá đà khi Ops chưa sẵn sàng sẽ giết chết thương hiệu.' }
    ]
  },
  "a8-strategies": {
    items: [
      { level: 'Doanh thu (Total Rev)', past: '685 triệu', now: '685 triệu', target: '900 triệu', note: 'Mục tiêu tăng 30% sau 12 tháng bằng Catering B2B', rationale: 'Tăng trưởng bù đắp lạm phát và chuẩn bị ngân sách mở chi nhánh 3.' },
      { level: 'Biên LN Ròng (Net Margin)', past: '9%', now: '9%', target: '15%', note: 'Cắt 30% đơn phụ thuộc App (Grab/Shopee)', rationale: 'Là KPI sống còn của Ban Giám đốc để duy trì dòng tiền dương.' },
      { level: 'Tỷ trọng đơn Zalo', past: '20%', now: '20%', target: '45%', note: 'Dùng Zalo ZNS và Miniapp để chốt đơn', rationale: 'Xây dựng Economic Moat (hào kinh tế) bằng Data của chính mình.' },
      { level: 'Google Maps Rating', past: '4.1', now: '4.1', target: '4.6', note: 'Chủ động xin review và xử lý complain', rationale: 'Local SEO là kênh Acquisition khách mới miễn phí tốt nhất hiện nay.' }
    ],
    campaign_phasing: [
      { phase: 'GĐ1: Củng Cố Móng (Tối ưu Local & Zalo)', description: 'Thiết lập chuẩn hóa hình ảnh (ánh sáng tự nhiên). Xây dựng Zalo OA, in Flyer/Sticker kéo khách từ App về Zalo.', time: 'Tháng 1 - Tháng 2', rationale: 'Xây nhà từ móng. Fix lỗ hổng thất thoát khách hàng trước khi đổ traffic mới.' },
      { phase: 'GĐ2: Nhận Diện Món Lõi (Hero Product)', description: 'Ra mắt 3 món Signature. Triển khai Storytelling về nguyên liệu. Đăng bài đều đặn trên Fanpage lúc 10h.', time: 'Tháng 3 - Tháng 4', rationale: 'Tạo Top-of-mind Awareness. Khi khách nghĩ đến thịt kho niêu, họ phải nhớ Bếp Nhà Mộc.' },
      { phase: 'GĐ3: Mở Rộng B2B (Catering Office)', description: 'Khởi chạy Cơm Tháng. Phát tờ rơi tại sảnh văn phòng. Chạy chiến dịch "Bữa Cơm Cuối Năm".', time: 'Tháng 5 - Tháng 8', rationale: 'Đa dạng hóa rủi ro, không bỏ trứng vào một rổ B2C.' }
    ]
  },
  "a9-budget": {
    items: [
      { item: 'Doanh thu thuần mục tiêu', t0: '685 tr', t1: '750 tr', t2: '820 tr', t3: '900 tr', rationale: 'Growth rate 10-15%/kỳ là hợp lý với sức chứa hiện tại của 2 bếp.' },
      { item: 'Phí hoa hồng App (Giảm dần)', t0: '137 tr', t1: '110 tr', t2: '85 tr', t3: '65 tr', rationale: 'Kết quả trực tiếp của việc dịch chuyển phễu khách hàng sang Zalo OA.' },
      { item: 'Chi phí NVL (Food Cost - 35%)', t0: '239 tr', t1: '262 tr', t2: '287 tr', t3: '315 tr', rationale: 'Luôn giữ mức chuẩn 35% COGS. Nếu vượt phải review lại quy trình bếp.' },
      { item: 'Chi phí Vận hành (Mặt bằng, Lương)', t0: '215 tr', t1: '215 tr', t2: '220 tr', t3: '225 tr', rationale: 'Chi phí cố định (Fixed Cost) ổn định, càng tăng doanh thu biên lợi nhuận càng cao.' },
      { item: 'Ngân sách Marketing (Khoảng 4%)', t0: '27 tr', t1: '30 tr', t2: '32 tr', t3: '36 tr', rationale: 'Rất thắt lưng buộc bụng. Chỉ tập trung vào Activation trực tiếp (Sampling, in ấn).' },
      { item: 'Lợi Nhuận Ròng (Net Profit)', t0: '67 tr', t1: '133 tr', t2: '196 tr', t3: '259 tr', rationale: 'Sức khỏe tài chính bật tăng gấp 3 lần sau 4 quý nhờ tái cấu trúc kênh bán.' }
    ]
  },
  "b1-objectives": {
    items: [
      { pair: 'Dân VP / Zalo OA', vol: '150 đơn/ngày', margin: '45%', strategy: 'Kẹp tờ rơi vào đơn Grab/Shopee tặng mã giảm 15% qua Zalo.', budget: '5 tr', rationale: 'Cost per Acquisition (CPA) cực thấp vì tận dụng đơn hàng có sẵn làm phương tiện truyền thông.' },
      { pair: 'Admin/HR / Gói Cơm B2B', vol: '10 Hợp đồng', margin: '35%', strategy: 'Direct sales, phát hộp cơm ăn thử (Sampling) cho HR quy mô 20-50 người.', budget: '8 tr', rationale: 'Khách hàng tổ chức (B2B) ra quyết định bằng lý trí. Cho ăn thử là cách chốt sales mạnh nhất.' },
      { pair: 'Gia đình / Ăn tối', vol: '30 bàn/tuần', margin: '55%', strategy: 'Đăng Fanpage bài kể chuyện ẩm thực, bán combo 3-4 người.', budget: '7 tr', rationale: 'Biên lợi nhuận cao nhất (55%). Giải quyết bài toán mặt bằng trống buổi tối.' }
    ]
  },
  "b2-action": {
    items: [
      { obj: 'Chuyển đổi App -> Zalo', tactic: 'In 5000 tờ rơi, sticker dán kèm hộp cơm có mã QR Zalo. Tặng Freeship.', owner: 'Quản lý cửa hàng', deadline: 'Tuần 1, T1', cost: '3.5M', rationale: 'Physical touchpoint (Điểm chạm vật lý) là cách hiệu quả nhất để kéo Digital Traffic trong ngành F&B.' },
      { obj: 'Content Hàng Ngày', tactic: 'Đăng Facebook/Zalo 10h00 sáng. Hình ảnh ánh sáng tự nhiên. Không dùng AI.', owner: 'Thu ngân', deadline: 'Hàng ngày', cost: '0M', rationale: '10h sáng là lúc dân văn phòng bắt đầu đói và nghĩ về bữa trưa (Micro-moment).' },
      { obj: 'Cải thiện Google Maps', tactic: 'Mời khách ăn tại quán review nhận mã giảm giá. Phản hồi 100% trong 48h.', owner: 'Quản lý cửa hàng', deadline: 'Hàng tuần', cost: '1M', rationale: 'Review thực tế có sức nặng gấp 10 lần quảng cáo Ads.' },
      { obj: 'B2B Cơm Văn Phòng', tactic: 'Lập danh sách 50 công ty <2km. Gọi điện và gửi 20 suất Sampling.', owner: 'Chủ cửa hàng', deadline: 'Tuần 2, T3', cost: '5M', rationale: 'Bán kính 2km đảm bảo thức ăn nóng hổi và không tốn phí Ship quá cao.' },
      { obj: 'Bữa Cơm Cuối Năm', tactic: 'Bán Set lẩu tất niên cho công ty nhỏ. Thiết kế menu riêng, nhận Pre-order.', owner: 'Bếp trưởng', deadline: 'Tuần 3, T12', cost: '8M', rationale: 'Capture nhu cầu tiệc tùng cuối năm, tối ưu doanh thu tháng 12.' }
    ]
  },
  "b3-budget": {
    items: [
      { item: 'In ấn Trade MKT (Tờ rơi, Sticker)', past: '1 tr', now: '5 tr', next: '6 tr', rationale: 'Dịch chuyển từ Ads Online sang Offline Activation (Bắn tỉa cục bộ).' },
      { item: 'Chi phí Sampling (Mời B2B ăn thử)', past: '0 tr', now: '4 tr', next: '6 tr', rationale: 'Khoản đầu tư bắt buộc để xuyên thủng màng lọc khó tính của khối Hành chính Nhân sự.' },
      { item: 'Quảng cáo Facebook Ads (<3km)', past: '15 tr', now: '10 tr', next: '12 tr', rationale: 'Giảm 30% ngân sách do Ads không hiệu quả, chỉ dùng để Re-marketing.' },
      { item: 'Quản lý Zalo OA & SMS CSKH', past: '0 tr', now: '2 tr', next: '3 tr', rationale: 'Nuôi dưỡng (Nurture) Data khách hàng cũ tốn phí rất rẻ.' },
      { item: 'Gói chụp ảnh sản phẩm (Freelance)', past: '0 tr', now: '5 tr', next: '0 tr', rationale: 'Đầu tư 1 lần để xây Visual Foundation (Tài sản hình ảnh) dùng cho 1 năm.' }
    ]
  },
  "b4-contingency": {
    items: [
      { risk: 'Quá tải giờ trưa', level: 'Cao', impact: 'Giao trễ, rate 1 sao.', trigger: 'Số đơn dồn > 50 đơn cùng lúc.', action: 'Dừng nhận đơn App ngay. Báo trước khách thời gian chờ.', rationale: 'Bảo vệ khách Zalo (Core loyal) quan trọng hơn húp thêm vài đơn App lẻ tẻ.' },
      { risk: 'Khách phàn nàn (Sâu rau)', level: 'Trung bình', impact: 'Mất khách vĩnh viễn.', trigger: 'Review mắng quán.', action: 'Quy tắc 3 bước: Nhận lỗi -> Chuyển qua kênh riêng -> Hoàn tiền.', rationale: 'Tâm lý học cho thấy xử lý khủng hoảng chân thành tạo ra Super Fan.' },
      { risk: 'Khách không quét QR Zalo', level: 'Trung bình', impact: 'Lãng phí chi phí in ấn.', trigger: 'Sau 2 tuần Zalo tăng < 5%.', action: 'Thay đổi offer từ tặng món sang Giảm tiền 15k. Yêu cầu NV giao hàng nhắc.', rationale: 'Value Proposition (Lợi ích) chưa đủ hấp dẫn, phải điều chỉnh ngay thực tế.' }
    ]
  },
  "b5-pnl": {
    items: [
      { item: 'Doanh thu trung bình/Tháng (Current)', val: '685 tr', ratio: '100%', rationale: 'Base Line vững chắc từ 2 chi nhánh nhưng cần tối ưu chất lượng dòng tiền.' },
      { item: 'Giá vốn (Food Cost - 35%)', val: '239 tr', ratio: '35.0%', rationale: 'Tỷ lệ Vàng của ngành F&B, phải giữ vững dù vật giá leo thang.' },
      { item: 'Chiết khấu App (15% trên tổng DT)', val: '102 tr', ratio: '15.0%', rationale: 'Điểm đau (Pain point) chảy máu lợi nhuận lớn nhất.' },
      { item: 'Vận hành (Mặt bằng, Lương)', val: '250 tr', ratio: '36.5%', rationale: 'Chi phí nặng, phải dùng Dine-in buổi tối để gánh.' },
      { item: 'Chi phí Marketing', val: '27 tr', ratio: '3.9%', rationale: 'Cực kỳ tinh gọn so với Industry Standard (8-10%).' },
      { item: 'Lợi Nhuận Ròng Trước Thuế', val: '67 tr', ratio: '9.8%', rationale: 'Mức rủi ro, cần kéo lên 15% để có quỹ dự phòng.' }
    ]
  },
  "b6-gantt": {
    items: [
      { name: 'Chuẩn hóa Menu ảnh & Set up Zalo OA', t8: true, t9: false, t10: false, t11: false, t12: false, rationale: 'Bước chuẩn bị nền tảng (Foundation) không thể bỏ qua.' },
      { name: 'Kẹp tờ rơi chuyển đổi App -> Zalo', t8: true, t9: true, t10: true, t11: true, t12: true, rationale: 'Chiến dịch Always-on (Chạy liên tục) để vớt data.' },
      { name: 'Content Thực Đơn Hàng Ngày (10h)', t8: true, t9: true, t10: true, t11: true, t12: true, rationale: 'Hình thành thói quen (Habit-forming) cho tệp dân văn phòng.' },
      { name: 'Sampling Cơm Văn Phòng (B2B Sales)', t8: false, t9: true, t10: true, t11: false, t12: false, rationale: 'Thực hiện sau khi hệ thống bếp đã trơn tru.' },
      { name: 'Chiến dịch Tết "Bữa Cơm Cuối Năm"', t8: false, t9: false, t10: false, t11: true, t12: true, rationale: 'Điểm rơi doanh số mảng Tiệc/Catering.' }
    ]
  },
  "c1-direction": {
    items: [
      { item: 'Định vị Kênh (Channel Strategy)', content: 'Biến Zalo thành trụ cột mang lại lợi nhuận cốt lõi (Core Profit Engine). Các App giao đồ ăn chỉ đóng vai trò kênh thu hút khách hàng mới (Acquisition Channel).', rationale: 'Tránh việc phụ thuộc hoàn toàn vào sân chơi của bên thứ 3.' },
      { item: 'Lợi thế Khác biệt (Differentiator)', content: 'Sự tỉ mỉ, cá nhân hóa. Nhớ khẩu vị khách quen (VD: Không hành, ít cơm). Định vị là nhà hàng có dịch vụ chu đáo chứ không phải xưởng nấu công nghiệp.', rationale: 'Tạo hàng rào cảm xúc (Emotional Moat) khó sao chép.' },
      { item: 'Quy tắc Content', content: 'Chụp ảnh thật, ánh sáng tự nhiên. Tuyệt đối không dùng từ phóng đại (Ngon nhất, rẻ nhất), không áp lực giả (Flash sale).', rationale: 'Bảo vệ giá trị cốt lõi "Authentic" (Chân thực) của thương hiệu.' }
    ]
  },
  "c2-history": {
    items: [
      { bcg: 'Ngôi sao (Star)', sbu: 'Đơn hàng Zalo trực tiếp & Cơm B2B', rev: '137 tr', target: '450 tr', rationale: 'Tăng trưởng cực nhanh, sinh lời cao nhất, cần dồn toàn bộ nguồn lực.' },
      { bcg: 'Bò sữa (Cash Cow)', sbu: 'Đơn hàng App (Grab/Shopee)', rev: '548 tr', target: '400 tr', rationale: 'Chỉ vắt sữa (Lấy traffic), không đầu tư thêm thức ăn (Ngân sách Ads).' },
      { bcg: 'Dấu hỏi (Question)', sbu: 'Dine-in (Ăn tối tại quán)', rev: '0 tr', target: '120 tr', rationale: 'Tiềm năng lớn nhưng chưa chứng minh được product-market fit, cần thử nghiệm mâm gia đình.' }
    ]
  },
  "c3-issues": {
    items: [
      { sbu: 'Vận hành Bếp Giờ Trưa', market: 'Rất đông đúc', comp: 'Cloud Kitchen', issue: 'Đóng gói chậm, hay nhầm. Cần chia rõ Line nhặt đồ: 1 cho App, 1 cho Zalo.', rationale: 'Trải nghiệm của khách Zalo (Loyal) không được phép bị ảnh hưởng bởi sự hỗn loạn của khách App.' },
      { sbu: 'Marketing Nội Bộ', market: 'Thiếu nhân sự', comp: 'Chuỗi In-house MKT', issue: 'Bài đăng lộn xộn. Cần bộ Template Canva thiết kế sẵn.', rationale: 'Standardize (Tiêu chuẩn hóa) quy trình MKT giúp thu ngân/bảo vệ cũng có thể đăng bài chuẩn.' },
      { sbu: 'Định giá trên App', market: 'Nhạy cảm giá', comp: 'Cơm bình dân 35k', issue: 'Bán giá gốc trên App sẽ lỗ. Phải tạo Combo riêng cho App.', rationale: 'Giá bán (Pricing Strategy) trên nền tảng trung gian bắt buộc phải gánh được 25% hoa hồng.' }
    ]
  },
  "c4-dashboard": {
    items: [
      { sbu: 'Hiệu quả Chuyển đổi', kpi: 'Tỷ trọng Doanh thu Zalo / Tổng DT', now: '20%', next: '45%', rationale: 'Chỉ báo dẫn dắt (Leading Indicator) cho biên lợi nhuận.' },
      { sbu: 'Vận hành Bếp', kpi: 'Tỷ lệ đơn trễ / Phàn nàn', now: '5%', next: '< 1%', rationale: 'Bảo vệ Retention Rate và uy tín trên Google Maps.' },
      { sbu: 'Tài chính', kpi: 'Biên Lợi Nhuận Ròng', now: '9.8%', next: '15.0%', rationale: 'Mục tiêu tối thượng của ban giám đốc.' },
      { sbu: 'Khách hàng', kpi: 'Tỷ lệ khách quay lại (Retention)', now: '25%', next: '45%', rationale: 'Đo lường sức khỏe thật sự của trải nghiệm món ăn.' },
      { sbu: 'Thương hiệu', kpi: 'Lượt đánh giá 5 sao/Tháng', now: '10', next: '50', rationale: 'Acquisition 0 đồng hoàn hảo nhất cho Local Business.' }
    ]
  }
};
