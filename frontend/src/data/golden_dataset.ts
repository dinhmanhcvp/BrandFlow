export const goldenDataset = [
  {
    task_id: "MKT-2026-0492",
    task_type: "Campaign Planning & Content",
    industry: "F&B (Chuỗi Cà Phê)",
    difficulty: "Hard",
    brand_dna: {
      tone_of_voice: "Trẻ trung, thân thiện, truyền cảm hứng",
      key_message: "Cà phê Việt nguyên bản, không pha trộn",
      target_audience: "Sinh viên và nhân viên văn phòng 18-35 tuổi",
      forbidden_words: ["rẻ tiền", "công nghiệp", "hóa chất"]
    },
    input_prompt: "Lên kế hoạch ra mắt sản phẩm Cà phê Muối mới trong tháng 7 với ngân sách 20 triệu VNĐ. Yêu cầu chi tiết phân bổ ngân sách và 1 mẫu bài đăng Facebook.",
    golden_output: {
      budget_allocation: [
        { channel: "Facebook Ads (10M)", rationale: "Target tệp nhân viên văn phòng bán kính 5km" },
        { channel: "TikTok Reviewers (6M)", rationale: "Tạo độ viral và xu hướng trong giới trẻ sinh viên" },
        { channel: "In-store POSM (4M)", rationale: "Kích thích dùng thử trực tiếp tại cửa hàng" }
      ],
      content_sample: "🌊 BẠN ĐÃ THỬ CÀ PHÊ MUỐI ĐẬM ĐÀ CHUẨN VỊ CHƯA?\n\nChút vị mặn mòi tinh tế hòa quyện cùng vị đắng đậm của cà phê Việt nguyên bản, thêm lớp kem macchiato béo ngậy...\n\n👉 Tất cả tạo nên siêu phẩm 'Cà Phê Muối' mới nhất! Ghé ngay hôm nay để nhận ưu đãi Mua 1 Tặng 1 tuần đầu ra mắt nhé!\n\n#CaPheMuoi #CaPheVietNguyenBan #TruyenCamHung"
    },
    score: "9.5/10"
  },
  {
    task_id: "MKT-2026-1105",
    task_type: "Crisis Management & PR",
    industry: "Cosmetics (Mỹ phẩm)",
    difficulty: "Expert",
    brand_dna: {
      tone_of_voice: "Chân thành, minh bạch, chuyên môn cao",
      key_message: "Đẹp từ thiên nhiên, an toàn tuyệt đối",
      target_audience: "Phụ nữ 25-45 tuổi, da nhạy cảm",
      forbidden_words: ["cam kết 100%", "trắng cấp tốc", "thần dược"]
    },
    input_prompt: "Khách hàng phàn nàn trên group bóc phốt rằng serum bị đổi màu sau 2 tháng sử dụng. Hãy viết bài đính chính chính thức trên Fanpage.",
    golden_output: {
      budget_allocation: [
        { channel: "Fanpage PR (0đ)", rationale: "Bài đăng công khai thể hiện sự minh bạch" },
        { channel: "CSKH 1-1 (Chi phí đổi trả)", rationale: "Chính sách đền bù 1-đổi-1 cho các batch lỗi do vận chuyển" }
      ],
      content_sample: "Kính gửi quý khách hàng,\n\nChúng tôi vừa nhận thông tin về việc Serum Vitamin C ngả màu. Với tinh thần minh bạch, chúng tôi xin giải thích:\n\nDo thành phần 100% thiên nhiên và KHÔNG chất bảo quản, Vitamin C hữu cơ rất dễ oxy hóa. Đây là hiện tượng vật lý bình thường chứng minh độ nguyên chất. Tuy nhiên, để đảm bảo trải nghiệm, chúng tôi hỗ trợ đổi mới miễn phí cho sản phẩm mua trong 1 tháng đầu.\n\nSự an toàn của làn da bạn luôn là ưu tiên cao nhất."
    },
    score: "9.8/10"
  },
  {
    task_id: "MKT-2026-0822",
    task_type: "SEO Blog Generation",
    industry: "EdTech (Giáo dục)",
    difficulty: "Medium",
    brand_dna: {
      tone_of_voice: "Động viên, thực tế, năng động",
      key_message: "Giao tiếp tự tin chỉ sau 3 tháng",
      target_audience: "Người đi làm bận rộn",
      forbidden_words: ["khó khăn", "nhồi nhét", "học vẹt"]
    },
    input_prompt: "Viết dàn ý chuẩn SEO: 'Cách luyện nghe tiếng Anh cho người đi làm bận rộn'.",
    golden_output: {
      budget_allocation: [
        { channel: "SEO Content (In-house)", rationale: "Tập trung ranking keyword 'luyện nghe tiếng anh'" }
      ],
      content_sample: "H1: 5 Bí Quyết Luyện Nghe Tiếng Anh Hiệu Quả Cho Người Bận Rộn\n\nH2: 1. Tận dụng 'thời gian chết' để luyện nghe\n- Nghe podcast khi đi xe bus/ô tô.\n\nH2: 2. Phương pháp nghe thụ động (Passive Listening)\n- Tại sao cần nghe thụ động?\n\nH2: Kết luận\nGiao tiếp tự tin không đòi hỏi học ngày đêm, chỉ cần 15 phút đều đặn mỗi ngày."
    },
    score: "9.0/10"
  },
  {
    task_id: "MKT-2026-3019",
    task_type: "Performance Marketing",
    industry: "Real Estate (Bất động sản)",
    difficulty: "Expert",
    brand_dna: {
      tone_of_voice: "Sang trọng, đẳng cấp, đáng tin cậy",
      key_message: "Tuyệt tác sống giữa lòng đô thị",
      target_audience: "Doanh nhân, nhà đầu tư VVIP thu nhập >100M/tháng",
      forbidden_words: ["giá rẻ", "chiết khấu khủng", "cắt lỗ"]
    },
    input_prompt: "Thiết lập kịch bản chạy Ads Facebook thu thập Lead cho dự án Penthouse siêu sang giá 40 tỷ. Ngân sách 50 triệu.",
    golden_output: {
      budget_allocation: [
        { channel: "FB Lead Gen Ads (35M)", rationale: "Lookalike Audience 1% từ tệp khách hàng mua xe sang (Mercedes, Porsche)" },
        { channel: "Retargeting Ads (15M)", rationale: "Bám đuổi tệp đã xem video 75% bằng kịch bản khan hiếm" }
      ],
      content_sample: "🎩 KHÔNG GIAN SỐNG TÔN VINH ĐẲNG CẤP CHỦ NHÂN\n\nChỉ 5 căn Penthouse giới hạn sở hữu tầm nhìn Panorama bao quát toàn thành phố. Nơi sự riêng tư và đặc quyền hòa quyện làm một.\n\n▪️ Sảnh thang máy cá nhân\n▪️ Hồ bơi vô cực trên không\n▪️ Quản gia chuẩn quốc tế 24/7\n\nĐăng ký nhận đặc quyền tham quan không gian mẫu dành riêng cho các vị khách quý."
    },
    score: "9.9/10"
  },
  {
    task_id: "MKT-2026-5102",
    task_type: "Product Launch Strategy",
    industry: "Tech B2B (SaaS)",
    difficulty: "Hard",
    brand_dna: {
      tone_of_voice: "Chuyên nghiệp, dữ liệu, đột phá",
      key_message: "Chuyển đổi số toàn diện cho doanh nghiệp",
      target_audience: "CEO, CTO, Giám đốc vận hành (C-level)",
      forbidden_words: ["chậm trễ", "phức tạp", "thử nghiệm"]
    },
    input_prompt: "Viết kịch bản email drip campaign 3 bước để mời các CEO tham gia Webinar ra mắt tính năng AI mới.",
    golden_output: {
      budget_allocation: [
        { channel: "Email Marketing (Auto-drip)", rationale: "Dùng Apollo.io để gửi mail lạnh đến tệp 1000 CTO" },
        { channel: "LinkedIn InMail (10M)", rationale: "Tiếp cận trực tiếp các C-level khó tính qua tin nhắn riêng" }
      ],
      content_sample: "Email 1 (Teaser): 'Cách đối thủ của bạn đang giảm 40% chi phí vận hành'.\nEmail 2 (Value): '[Case Study] X tự động hóa quy trình với hệ thống AI như thế nào?'\nEmail 3 (Urgency): 'Chỉ còn 24h: Webinar độc quyền dành riêng cho C-level về Tương lai của Tự động hóa.'\n\nNội dung Email 1: Chào [Tên],\nTrong bối cảnh tối ưu hóa chi phí, các doanh nghiệp hàng đầu đang ứng dụng AI để giải quyết bài toán nhân sự... Mời anh tham dự buổi chia sẻ chiến lược kín..."
    },
    score: "9.6/10"
  }
];
