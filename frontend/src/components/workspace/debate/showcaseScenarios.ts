import { IndustryScenario } from './debateTypes';

export const SHOWCASE_SCENARIOS: Record<string, IndustryScenario> = {
  bep_nha_moc: {
    id: 'bep_nha_moc',
    name: 'Ẩm thực & Nhà hàng',
    businessName: 'Bếp Nhà Mộc',
    industryLabel: 'F&B · Cơm niêu gia đình & Suất ăn văn phòng',
    tagline: 'Chiến dịch: Chuyển dịch dòng tiền từ App giao đồ ăn sang Zalo O2O & Suất ăn Doanh nghiệp B2B',
    initialPlan: {
      budget: '50.000.000đ',
      channels: 'Meta Broad Ads & Book 3 Mega-TikTokers',
      timeline: '2 tháng cao điểm',
      operations: 'Bán lẻ đa kênh không giới hạn',
      pricing: 'Giảm giá 30% kích cầu ứng dụng bên thứ 3'
    },
    finalPlan: {
      budget: '35.000.000đ',
      channels: 'Zalo Mini App OA, Sampling B2B & 10 Micro-KOLs văn phòng',
      timeline: '3 tháng (3 giai đoạn cuốn chiếu)',
      operations: 'Ưu tiên đơn nhóm B2B toà nhà bán kính 2km',
      pricing: 'Thẻ thành viên trả trước (Prepaid) & Combo cơm trưa tuần',
      highlights: [
        'Cắt giảm 15.000.000đ ngân sách quảng cáo dàn trải, dồn vào kênh sở hữu Zalo',
        'Khống chế công suất bếp 120 suất/khung giờ, ngăn ngừa vỡ trận vận hành',
        'Tỷ suất lợi nhuận gộp bảo toàn tối thiểu 22% nhờ cắt bớt chiết khấu app 25%'
      ]
    },
    turns: [
      {
        id: 'turn-1',
        round: 1,
        totalRounds: 3,
        speaker: 'strategy',
        speakerName: 'Trợ lý chiến lược',
        speakerTitle: 'Phân tích & Tăng trưởng thị trường',
        stance: 'proposal',
        message: 'Dựa trên mật độ 15.000 nhân sự văn phòng bán kính 2km Duy Tân - Cầu Giấy, đề xuất phân bổ 50.000.000đ chạy Meta Broad Ads và hợp tác 3 Mega-TikTokers ẩm thực để tạo cú hích nhận diện cho thực đơn Cơm Niêu Mùa Hè. Kỳ vọng đạt 25.000 lượt tiếp cận và lấp đầy 80% công suất chỗ ngồi.',
        targetField: 'budget',
        targetFieldLabel: 'Tổng ngân sách Marketing',
        oldValue: 'Chưa xác định',
        newValue: '50.000.000đ',
        consensusLevel: 25,
        financialCheck: {
          revenue: 120000000,
          expense: 145000000,
          budgetLimit: 35000000,
          balance: -15000000,
          status: 'exceeded',
          diffAmount: 15000000,
          verificationMessage: 'Chưa khớp: Chi phí 50.000.000đ vượt 15.000.000đ so với định mức dòng tiền an toàn (Trần 35 triệu)',
          isAudited: false
        },
        decisionSaved: {
          id: 'dec-1',
          title: 'Khởi tạo đề xuất ban đầu',
          detail: 'Ghi nhận mục tiêu mở rộng thị phần khu vực Cầu Giấy - Hà Đông.',
          turnIndex: 1,
          agentRole: 'Trợ lý chiến lược',
          timestamp: 'Vòng 1 · 00:04'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-2',
        round: 1,
        totalRounds: 3,
        speaker: 'finance',
        speakerName: 'Trợ lý tài chính',
        speakerTitle: 'Kiểm soát dòng tiền & Biên lợi nhuận',
        stance: 'disagree',
        message: 'Bác bỏ kịch bản 50 triệu! Báo cáo tài chính cho thấy Net Margin của Bếp Nhà Mộc chỉ đạt 8.4% do chiết khấu App giao hàng (Grab/Shopee) ngốn tới 25%. Đốt 50 triệu vào Ads đại trà sẽ lập tức làm âm dòng tiền tháng đầu 15.000.000đ. Yêu cầu thiết lập trần chi phí tối đa 25.000.000đ để bảo toàn vốn lưu động.',
        targetField: 'budget',
        targetFieldLabel: 'Tổng ngân sách Marketing',
        oldValue: '50.000.000đ',
        newValue: '25.000.000đ',
        consensusLevel: 40,
        financialCheck: {
          revenue: 120000000,
          expense: 115000000,
          budgetLimit: 35000000,
          balance: 10000000,
          status: 'checking',
          diffAmount: 0,
          verificationMessage: 'Đang kiểm tra: Mức 25.000.000đ an toàn tài chính nhưng có rủi ro thiếu lực tiếp cận thị trường',
          isAudited: false
        },
        decisionSaved: {
          id: 'dec-2',
          title: 'Áp đặt trần ngân sách',
          detail: 'Yêu cầu không vượt quá 8% tổng doanh thu tháng dự phóng.',
          turnIndex: 2,
          agentRole: 'Trợ lý tài chính',
          timestamp: 'Vòng 1 · 00:09'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-3',
        round: 2,
        totalRounds: 3,
        speaker: 'customer',
        speakerName: 'Trợ lý góc nhìn khách hàng',
        speakerTitle: 'Chân dung khách hàng & Trải nghiệm thực tế',
        stance: 'proposal',
        message: 'Dữ liệu hành vi chứng minh: Tệp văn phòng (Minh & Lan) chốt đơn nhóm qua Zalo lúc 10h30 để tránh phí ship app đắt đỏ. Cắt giảm Ads mà không có kênh thay thế sẽ mất khách vào tay các Cloud Kitchen giá rẻ. Đề xuất: Dịch chuyển phễu bán sang Zalo Mini App, in Flyer QR kẹp hộp cơm và triển khai gói cơm ăn thử Sampling B2B cho các toà nhà.',
        targetField: 'channels',
        targetFieldLabel: 'Kênh truyền thông & Tiếp cận',
        oldValue: 'Meta Ads & Mega-TikTokers',
        newValue: 'Zalo Mini App & Sampling B2B',
        consensusLevel: 65,
        financialCheck: {
          revenue: 130000000,
          expense: 125000000,
          budgetLimit: 35000000,
          balance: 5000000,
          status: 'checking',
          diffAmount: 0,
          verificationMessage: 'Đang phân tích: Chuyển đổi kênh 0 đồng Zalo kết hợp quà tặng kích cầu nhóm B2B',
          isAudited: false
        },
        decisionSaved: {
          id: 'dec-3',
          title: 'Đổi kênh tiếp cận trọng tâm',
          detail: 'Khai thác tệp khách hàng văn phòng qua hội nhóm doanh nghiệp địa phương.',
          turnIndex: 3,
          agentRole: 'Trợ lý góc nhìn khách hàng',
          timestamp: 'Vòng 2 · 00:15'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-4',
        round: 2,
        totalRounds: 3,
        speaker: 'operations',
        speakerName: 'Trợ lý vận hành',
        speakerTitle: 'Năng lực cung ứng & Hiệu suất bếp',
        stance: 'disagree',
        message: 'Cảnh báo rủi ro tắc nghẽn bếp: Đội ngũ 28 nhân sự tại 2 cơ sở chỉ đạt công suất tối đa 120 suất/khung giờ cao điểm (11h30 - 12h30). Nếu nhận đơn lẻ rải rác từ TikTok, thời gian ra món (TAT) sẽ vượt quá 25 phút dẫn tới khiếu nại đổ vỡ. Yêu cầu bắt buộc: Ưu tiên đơn đặt trước theo bàn qua Zalo và giới hạn 120 suất/khung giờ để giữ vững chuẩn vị món niêu.',
        targetField: 'operations',
        targetFieldLabel: 'Mô hình phục vụ & Giờ cao điểm',
        oldValue: 'Bán lẻ đa kênh không giới hạn',
        newValue: 'Giới hạn 120 suất/khung giờ qua Zalo',
        consensusLevel: 80,
        financialCheck: {
          revenue: 135000000,
          expense: 128000000,
          budgetLimit: 35000000,
          balance: 7000000,
          status: 'checking',
          diffAmount: 0,
          verificationMessage: 'Đang tính toán: Giảm tải tỷ lệ hủy đơn dưới 1.5%, tiết kiệm 8.000.000đ hao hụt nguyên liệu',
          isAudited: false
        },
        decisionSaved: {
          id: 'dec-4',
          title: 'Chốt ngưỡng tải phục vụ',
          detail: 'Đặt hạn ngạch nhận đơn giờ trưa (11h30 - 12h30) để giữ chất lượng món.',
          turnIndex: 4,
          agentRole: 'Trợ lý vận hành',
          timestamp: 'Vòng 2 · 00:21'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-5',
        round: 3,
        totalRounds: 3,
        speaker: 'strategy',
        speakerName: 'Trợ lý chiến lược',
        speakerTitle: 'Phân tích & Tăng trưởng thị trường',
        stance: 'proposal',
        message: 'Đề xuất phương án dung hòa tối ưu: Ngân sách chốt ở 35.000.000đ (dưới 5% doanh thu dự phóng). Cấu trúc: 10 triệu in ấn Sticker QR & Sampling B2B; 15 triệu Zalo ZNS Re-engagement chăm sóc khách quen; 10 triệu cho 10 Micro-KOLs văn phòng thực tế. Bếp tiếp nhận đơn B2B từ 10h00 để phân tải ca trưa.',
        targetField: 'budget',
        targetFieldLabel: 'Tổng ngân sách Marketing',
        oldValue: '25.000.000đ',
        newValue: '35.000.000đ',
        consensusLevel: 92,
        financialCheck: {
          revenue: 140000000,
          expense: 135000000,
          budgetLimit: 35000000,
          balance: 5000000,
          status: 'matched',
          diffAmount: 0,
          verificationMessage: 'Đã khớp: Điểm cân bằng tài chính đạt chuẩn, hệ số ROI dự phóng 2.8x, Net Margin đạt 14.5%',
          isAudited: true
        },
        decisionSaved: {
          id: 'dec-5',
          title: 'Đồng thuận ngân sách cân bằng',
          detail: 'Dung hòa giữa mục tiêu tăng trưởng doanh thu và an toàn dòng tiền.',
          turnIndex: 5,
          agentRole: 'Trợ lý chiến lược',
          timestamp: 'Vòng 3 · 00:27'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-6',
        round: 3,
        totalRounds: 3,
        speaker: 'decider',
        speakerName: 'Người quyết định',
        speakerTitle: 'Hội đồng quản trị & Chủ doanh nghiệp',
        stance: 'agree',
        message: 'Chính thức thông qua nghị quyết! Chốt ngân sách Marketing 35.000.000đ, tập trung toàn lực vào kênh Zalo O2O và hợp đồng suất ăn B2B. Triển khai Thẻ thành viên trả trước (Prepaid) và Combo tuần để khóa dòng tiền trước. Công cụ tài chính đã xác nhận an toàn tuyệt đối với ROI 2.8x. Lưu hồ sơ và chuyển giao sang lập kế hoạch thực thi!',
        targetField: 'pricing',
        targetFieldLabel: 'Chính sách ưu đãi & Giữ chân',
        oldValue: 'Giảm giá 30% kích cầu app ngoài',
        newValue: 'Thẻ thành viên trả trước & Combo tuần',
        consensusLevel: 100,
        financialCheck: {
          revenue: 140000000,
          expense: 135000000,
          budgetLimit: 35000000,
          balance: 5000000,
          status: 'matched',
          diffAmount: 0,
          verificationMessage: 'Đã kiểm toán: Toàn bộ chỉ số tài chính đã được công cụ kiểm chứng, sẵn sàng giải ngân',
          isAudited: true
        },
        decisionSaved: {
          id: 'dec-6',
          title: 'Phê duyệt kế hoạch triển khai',
          detail: 'Đã lưu vào hồ sơ doanh nghiệp. Sẵn sàng tạo biểu đồ Gantt và bản kế hoạch chi tiết.',
          turnIndex: 6,
          agentRole: 'Người quyết định',
          timestamp: 'Vòng 3 · 00:33'
        },
        durationSeconds: 5
      }
    ]
  },

  spa_clinic: {
    id: 'spa_clinic',
    name: 'Làm đẹp & Trị liệu da',
    businessName: 'Seoul Glow Clinic & Spa',
    industryLabel: 'Thẩm mỹ công nghệ cao & Chăm sóc da chuyên sâu',
    tagline: 'Chiến dịch: Chuyển dịch từ chạy quảng cáo liệu trình đơn lẻ sang gói Hội viên Bác sĩ đồng hành',
    initialPlan: {
      budget: '120.000.000đ',
      channels: 'Meta Ads chuyển đổi & Tặng voucher 99k',
      timeline: '1 tháng đánh dồn dập',
      operations: 'Nhận khách vãng lai tối đa công suất',
      pricing: 'Giảm giá 70% buổi trải nghiệm đầu tiên'
    },
    finalPlan: {
      budget: '85.000.000đ',
      channels: 'Tư vấn da chuyên sâu 1-1 & Referral từ khách hàng cũ',
      timeline: '3 tháng duy trì liệu trình',
      operations: 'Khám theo khung giờ đặt hẹn trước với bác sĩ',
      pricing: 'Gói Hội viên năm cam kết kết quả điều trị',
      highlights: [
        'Tiết kiệm 35.000.000đ ngân sách quảng cáo khách vãng lai tỷ lệ bùng lịch cao',
        'Nâng tỷ lệ khách hàng quay lại mua gói năm từ 18% lên 42%',
        'Kiểm soát thời gian tư vấn của bác sĩ da liễu đạt chuẩn 45 phút/ca'
      ]
    },
    turns: [
      {
        id: 'turn-spa-1',
        round: 1,
        totalRounds: 3,
        speaker: 'strategy',
        speakerName: 'Trợ lý chiến lược',
        speakerTitle: 'Phân tích & Tăng trưởng thị trường',
        stance: 'proposal',
        message: 'Đề xuất chi 120.000.000đ chạy quảng cáo đẩy mạnh gói triệt lông và chăm sóc da 99k để thu hút 1.500 khách mới trong tháng.',
        targetField: 'budget',
        targetFieldLabel: 'Tổng ngân sách Marketing',
        oldValue: 'Chưa xác định',
        newValue: '120.000.000đ',
        consensusLevel: 20,
        financialCheck: {
          revenue: 250000000,
          expense: 280000000,
          budgetLimit: 85000000,
          balance: -30000000,
          status: 'exceeded',
          diffAmount: 35000000,
          verificationMessage: 'Chưa khớp: Chi phí vượt 35.000.000đ so với dự phóng dòng tiền an toàn',
          isAudited: false
        },
        decisionSaved: {
          id: 'dec-spa-1',
          title: 'Đề xuất phủ sóng diện rộng',
          detail: 'Thu hút phễu khách hàng trải nghiệm dịch vụ giá thấp ban đầu.',
          turnIndex: 1,
          agentRole: 'Trợ lý chiến lược',
          timestamp: 'Vòng 1 · 00:04'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-spa-2',
        round: 1,
        totalRounds: 3,
        speaker: 'finance',
        speakerName: 'Trợ lý tài chính',
        speakerTitle: 'Kiểm soát dòng tiền & Biên lợi nhuận',
        stance: 'disagree',
        message: 'Chi phí mua khách (CAC) gói 99k quá đắt đỏ, khách săn sale không mua tiếp! Ngân sách trần tối đa chỉ được phép 80 triệu.',
        targetField: 'budget',
        targetFieldLabel: 'Tổng ngân sách Marketing',
        oldValue: '120.000.000đ',
        newValue: '80.000.000đ',
        consensusLevel: 45,
        financialCheck: {
          revenue: 250000000,
          expense: 245000000,
          budgetLimit: 85000000,
          balance: 5000000,
          status: 'checking',
          diffAmount: 0,
          verificationMessage: 'Đang kiểm tra: Cắt giảm chi phí acquisition để tập trung vào giá trị trọn đời (LTV)',
          isAudited: false
        },
        decisionSaved: {
          id: 'dec-spa-2',
          title: 'Khống chế trần ngân sách',
          detail: 'Yêu cầu không phụ thuộc vào tệp khách hàng săn mã giảm giá.',
          turnIndex: 2,
          agentRole: 'Trợ lý tài chính',
          timestamp: 'Vòng 1 · 00:09'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-spa-3',
        round: 2,
        totalRounds: 3,
        speaker: 'operations',
        speakerName: 'Trợ lý vận hành',
        speakerTitle: 'Năng lực cung ứng & Lịch hẹn bác sĩ',
        stance: 'disagree',
        message: 'Phòng khám chỉ có 3 bác sĩ và 12 giường điều trị. Khách ồ ạt kéo đến sẽ làm giảm thời gian khám 1-1, dẫn tới đánh giá 1 sao.',
        targetField: 'operations',
        targetFieldLabel: 'Quy trình tiếp đón & Công suất giường',
        oldValue: 'Nhận khách vãng lai tối đa công suất',
        newValue: 'Giới hạn 24 ca điều trị đặt hẹn/ngày',
        consensusLevel: 70,
        financialCheck: {
          revenue: 260000000,
          expense: 250000000,
          budgetLimit: 85000000,
          balance: 10000000,
          status: 'checking',
          diffAmount: 0,
          verificationMessage: 'Đang tính toán: Giữ tỷ lệ chuyển đổi dịch vụ cao cấp thông qua tư vấn chuẩn y khoa',
          isAudited: false
        },
        decisionSaved: {
          id: 'dec-spa-3',
          title: 'Chuẩn hóa quy trình đặt hẹn',
          detail: 'Chuyển 100% khách sang lịch hẹn số để bác sĩ thăm khám kỹ lưỡng.',
          turnIndex: 3,
          agentRole: 'Trợ lý vận hành',
          timestamp: 'Vòng 2 · 00:15'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-spa-4',
        round: 3,
        totalRounds: 3,
        speaker: 'strategy',
        speakerName: 'Trợ lý chiến lược',
        speakerTitle: 'Phân tích & Tăng trưởng thị trường',
        stance: 'proposal',
        message: 'Thống nhất tái phân bổ 85 triệu: 35 triệu soi da miễn phí theo hẹn, 30 triệu chăm sóc khách hàng VIP và 20 triệu giới thiệu bạn bè.',
        targetField: 'budget',
        targetFieldLabel: 'Tổng ngân sách Marketing',
        oldValue: '80.000.000đ',
        newValue: '85.000.000đ',
        consensusLevel: 90,
        financialCheck: {
          revenue: 275000000,
          expense: 265000000,
          budgetLimit: 85000000,
          balance: 10000000,
          status: 'matched',
          diffAmount: 0,
          verificationMessage: 'Đã khớp: Mô hình tài chính an toàn, doanh thu định kỳ bù đắp chi phí vận hành',
          isAudited: true
        },
        decisionSaved: {
          id: 'dec-spa-4',
          title: 'Tối ưu cơ cấu chi phí',
          detail: 'Chuyển ngân sách từ quảng cáo mù quáng sang tri ân khách hàng thân thiết.',
          turnIndex: 4,
          agentRole: 'Trợ lý chiến lược',
          timestamp: 'Vòng 3 · 00:22'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-spa-5',
        round: 3,
        totalRounds: 3,
        speaker: 'decider',
        speakerName: 'Người quyết định',
        speakerTitle: 'Hội đồng quản trị & Chủ doanh nghiệp',
        stance: 'agree',
        message: 'Phê duyệt phương án 85 triệu. Uy tín chuyên môn y khoa là cốt lõi thương hiệu, không hạ giá chạy theo số lượng.',
        targetField: 'pricing',
        targetFieldLabel: 'Chính sách dịch vụ & Định vị',
        oldValue: 'Giảm giá 70% buổi đầu',
        newValue: 'Gói thẻ Hội viên năm cam kết kết quả',
        consensusLevel: 100,
        financialCheck: {
          revenue: 275000000,
          expense: 265000000,
          budgetLimit: 85000000,
          balance: 10000000,
          status: 'matched',
          diffAmount: 0,
          verificationMessage: 'Đã khớp: Toàn bộ chỉ số tài chính đã được công cụ kiểm toán xác nhận',
          isAudited: true
        },
        decisionSaved: {
          id: 'dec-spa-5',
          title: 'Phê duyệt chiến lược dài hạn',
          detail: 'Đã lưu vào hồ sơ doanh nghiệp. Định vị vững chắc phân khúc thẩm mỹ chuẩn y khoa.',
          turnIndex: 5,
          agentRole: 'Người quyết định',
          timestamp: 'Vòng 3 · 00:30'
        },
        durationSeconds: 5
      }
    ]
  },

  edtech_hub: {
    id: 'edtech_hub',
    name: 'Giáo dục & Kỹ năng số',
    businessName: 'EdTech Master Hub',
    industryLabel: 'Đào tạo công nghệ & Kỹ năng thực chiến cho người đi làm',
    tagline: 'Chiến dịch: Tối ưu phễu chuyển đổi từ Hội thảo trực tuyến (Webinar) sang Khóa học chuyên sâu',
    initialPlan: {
      budget: '80.000.000đ',
      channels: 'Chạy form đăng ký Facebook Ads diện rộng',
      timeline: 'Chạy liên tục không nghỉ',
      operations: 'Mỗi lớp nhận 80 học viên',
      pricing: 'Khóa học đóng phí trọn gói một lần'
    },
    finalPlan: {
      budget: '60.000.000đ',
      channels: 'Workshop chuyên đề trực tiếp & Cộng đồng cựu học viên',
      timeline: 'Cuốn chiếu 6 tuần theo kỳ tuyển sinh',
      operations: 'Lớp nhỏ 25 học viên kèm 1-1 với trợ giảng',
      pricing: 'Học bổng cam kết đầu ra & Trả góp học phí 0%',
      highlights: [
        'Tiết kiệm 20.000.000đ nhờ giảm chi phí số điện thoại rác qua form quảng cáo',
        'Tỷ lệ hoàn thành khóa học tăng từ 35% lên 78% nhờ mô hình kèm 1-1',
        '40% học viên mới đến từ sự giới thiệu của cựu học viên khóa trước'
      ]
    },
    turns: [
      {
        id: 'turn-edu-1',
        round: 1,
        totalRounds: 3,
        speaker: 'strategy',
        speakerName: 'Trợ lý chiến lược',
        speakerTitle: 'Phân tích & Tăng trưởng thị trường',
        stance: 'proposal',
        message: 'Đề xuất chi 80.000.000đ chạy Lead Form Facebook để thu về 2.000 data người đi làm quan tâm đến AI và Phân tích dữ liệu.',
        targetField: 'budget',
        targetFieldLabel: 'Tổng ngân sách Marketing',
        oldValue: 'Chưa xác định',
        newValue: '80.000.000đ',
        consensusLevel: 25,
        financialCheck: {
          revenue: 180000000,
          expense: 200000000,
          budgetLimit: 60000000,
          balance: -20000000,
          status: 'exceeded',
          diffAmount: 20000000,
          verificationMessage: 'Chưa khớp: Chi phí vượt 20.000.000đ so với trần ngân sách cho phép',
          isAudited: false
        },
        decisionSaved: {
          id: 'dec-edu-1',
          title: 'Thu thập dữ liệu học viên tiềm năng',
          detail: 'Triển khai chiến dịch hứng trọn nhu cầu học chuyển đổi số.',
          turnIndex: 1,
          agentRole: 'Trợ lý chiến lược',
          timestamp: 'Vòng 1 · 00:04'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-edu-2',
        round: 1,
        totalRounds: 3,
        speaker: 'finance',
        speakerName: 'Trợ lý tài chính',
        speakerTitle: 'Kiểm soát dòng tiền & Biên lợi nhuận',
        stance: 'disagree',
        message: 'Tỷ lệ nghe máy từ Lead Ads rất thấp (chưa tới 30%). Lãng phí đội ngũ telesale! Yêu cầu hạ ngân sách xuống 50 triệu.',
        targetField: 'budget',
        targetFieldLabel: 'Tổng ngân sách Marketing',
        oldValue: '80.000.000đ',
        newValue: '50.000.000đ',
        consensusLevel: 45,
        financialCheck: {
          revenue: 180000000,
          expense: 170000000,
          budgetLimit: 60000000,
          balance: 10000000,
          status: 'checking',
          diffAmount: 0,
          verificationMessage: 'Đang kiểm tra: Lọc bỏ chi phí cho tệp data ảo không chuyển đổi',
          isAudited: false
        },
        decisionSaved: {
          id: 'dec-edu-2',
          title: 'Cắt giảm chi phí dữ liệu rác',
          detail: 'Hạn chế chạy form tự động không có bước xác thực danh tính.',
          turnIndex: 2,
          agentRole: 'Trợ lý tài chính',
          timestamp: 'Vòng 1 · 00:09'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-edu-3',
        round: 2,
        totalRounds: 3,
        speaker: 'operations',
        speakerName: 'Trợ lý vận hành',
        speakerTitle: 'Năng lực giảng dạy & Cơ sở vật chất',
        stance: 'disagree',
        message: 'Lớp 80 người học viên sẽ không theo kịp bài thực hành. Yêu cầu khống chế tối đa 25 học viên/lớp để giữ tỷ lệ tốt nghiệp cam kết.',
        targetField: 'operations',
        targetFieldLabel: 'Quy mô lớp học & Chất lượng đào tạo',
        oldValue: 'Mỗi lớp nhận 80 học viên',
        newValue: 'Lớp nhỏ 25 học viên kèm 1-1',
        consensusLevel: 75,
        financialCheck: {
          revenue: 195000000,
          expense: 180000000,
          budgetLimit: 60000000,
          balance: 15000000,
          status: 'checking',
          diffAmount: 0,
          verificationMessage: 'Đang phân tích: Tối ưu chất lượng đầu ra để biến học viên thành kênh truyền miệng',
          isAudited: false
        },
        decisionSaved: {
          id: 'dec-edu-3',
          title: 'Nâng chuẩn quy mô lớp học',
          detail: 'Cam kết chất lượng thực hành trên dự án thực tế của doanh nghiệp.',
          turnIndex: 3,
          agentRole: 'Trợ lý vận hành',
          timestamp: 'Vòng 2 · 00:15'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-edu-4',
        round: 3,
        totalRounds: 3,
        speaker: 'strategy',
        speakerName: 'Trợ lý chiến lược',
        speakerTitle: 'Phân tích & Tăng trưởng thị trường',
        stance: 'proposal',
        message: 'Chốt ngân sách 60 triệu: Tổ chức 2 buổi Workshop chuyên đề thu hút đúng người học thật, sau đó tư vấn chuyên sâu vào lớp nhỏ.',
        targetField: 'budget',
        targetFieldLabel: 'Tổng ngân sách Marketing',
        oldValue: '50.000.000đ',
        newValue: '60.000.000đ',
        consensusLevel: 92,
        financialCheck: {
          revenue: 200000000,
          expense: 190000000,
          budgetLimit: 60000000,
          balance: 10000000,
          status: 'matched',
          diffAmount: 0,
          verificationMessage: 'Đã khớp: Chi phí tuyển sinh trên mỗi học viên giảm 42%, dòng tiền thặng dư',
          isAudited: true
        },
        decisionSaved: {
          id: 'dec-edu-4',
          title: 'Chốt phương án tuyển sinh tinh gọn',
          detail: 'Kết hợp giữa hội thảo chuyên đề tạo giá trị thực và tư vấn lộ trình học.',
          turnIndex: 4,
          agentRole: 'Trợ lý chiến lược',
          timestamp: 'Vòng 3 · 00:22'
        },
        durationSeconds: 5
      },
      {
        id: 'turn-edu-5',
        round: 3,
        totalRounds: 3,
        speaker: 'decider',
        speakerName: 'Người quyết định',
        speakerTitle: 'Hội đồng quản trị & Chủ doanh nghiệp',
        stance: 'agree',
        message: 'Duyệt phương án 60 triệu! Trong đào tạo, chất lượng đầu ra của học viên chính là chiến dịch marketing bền vững nhất.',
        targetField: 'pricing',
        targetFieldLabel: 'Chính sách học phí & Cam kết',
        oldValue: 'Đóng học phí trọn gói 1 lần',
        newValue: 'Học bổng cam kết việc làm & Trả góp 0%',
        consensusLevel: 100,
        financialCheck: {
          revenue: 200000000,
          expense: 190000000,
          budgetLimit: 60000000,
          balance: 10000000,
          status: 'matched',
          diffAmount: 0,
          verificationMessage: 'Đã khớp: Chỉ số tài chính đã được công cụ tính toán chứng thực',
          isAudited: true
        },
        decisionSaved: {
          id: 'dec-edu-5',
          title: 'Ký duyệt kế hoạch tuyển sinh',
          detail: 'Đã lưu vào hồ sơ doanh nghiệp. Triển khai kế hoạch đào tạo thực chiến.',
          turnIndex: 5,
          agentRole: 'Người quyết định',
          timestamp: 'Vòng 3 · 00:30'
        },
        durationSeconds: 5
      }
    ]
  }
};
