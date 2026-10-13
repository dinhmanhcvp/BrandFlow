/**
 * NỘI DUNG LỄ KỶ NIỆM 70 NĂM ĐẠI HỌC BÁCH KHOA HÀ NỘI (1956 - 2026)
 * VÀ LỄ KHÁNH THÀNH KHÔNG GIAN ĐỔI MỚI SÁNG TẠO LIÊN NGÀNH
 * 
 * Toàn bộ chữ trên trang Lễ kỷ niệm nằm tại tệp này, không viết cứng trong component.
 * Quy tắc ngôn ngữ:
 * - "trí tuệ nhân tạo" thay cho "AI"
 * - "tiếp thị" thay cho "marketing"
 * - "công ty dịch vụ" thay cho "agency"
 * - "trợ lý" thay cho "agent"
 * - Không dùng từ khoa trương: "đột phá", "cách mạng", "hàng đầu", "số 1", "tối ưu nhất"
 * - Các trường chưa có thông tin chính thức được điền đúng chuỗi "[CẦN ĐIỀN]"
 */

export interface Milestone {
  year: number;
  label?: string;
  isKey?: boolean;
}

export interface DepartmentNode {
  id: string;
  name: string;
  contribution: string;
  highlightYear?: number;
}

export interface MetricItem {
  id: string;
  value: number;
  unit?: string;
  title: string;
  description: string;
  source: string;
  timestamp: string;
  isSample?: boolean;
}

export interface TeamMember {
  name: string;
  role: string;
  department: string;
}

export interface Advisor {
  name: string;
  title: string;
  department: string;
}

export interface Partner {
  name: string;
  role: string;
  logoSrc?: string | null;
}

export interface AnniversaryContent {
  meta: {
    title: string;
    description: string;
    websiteUrl: string;
    websiteDomain: string;
  };
  header: {
    universityLogoSrc: string;
    anniversaryLogoSrc: string;
    innovationSpaceLogoSrc: string | null;
    innovationSpacePlaceholder: string;
  };
  hero: {
    anniversaryGreeting: string;
    inaugurationGreeting: string;
    innovationSpaceName: string;
    brandflowIntroduction: string;
    yearNumber: string;
    yearSpan: string;
  };
  timeline: {
    startYear: number;
    endYear: number;
    title: string;
    subtitle: string;
    milestones: Milestone[];
    brandflowNodeLabel: string;
  };
  interdisciplinary: {
    title: string;
    subtitle: string;
    narrative: string;
    departments: DepartmentNode[];
    convergencePoint: string;
  };
  outcomes: {
    title: string;
    subtitle: string;
    allowNamingPartners: boolean;
    metrics: MetricItem[];
    partnerNames: {
      partnerA: string;
      partnerB: string;
      anonymousDescription: string;
    };
  };
  rulers: {
    title: string;
    subtitle: string;
    traditional: {
      duration: string;
      label: string;
      details: string;
    };
    brandflow: {
      duration: string;
      label: string;
      details: string;
    };
  };
  actions: {
    title: string;
    subtitle: string;
    primaryButtons: {
      debate: {
        label: string;
        description: string;
        href: string;
      };
      trial: {
        label: string;
        description: string;
        href: string;
      };
      samplePlan: {
        label: string;
        description: string;
        href: string;
      };
    };
    loginButton: {
      label: string;
      href: string;
    };
  };
  acknowledgements: {
    title: string;
    teamTitle: string;
    members: TeamMember[];
    advisorTitle: string;
    advisors: Advisor[];
    partnerTitle: string;
    partners: Partner[];
    gratitudeText: string;
  };
  footer: {
    qrNotice: string;
    qrUrl: string;
    websiteLabel: string;
    sampleDataNotice: string;
    copyright: string;
  };
}

export const lekyniemContent: AnniversaryContent = {
  meta: {
    title: "BrandFlow — Chào mừng Kỷ niệm 70 năm Đại học Bách khoa Hà Nội",
    description: "Phòng tiếp thị trí tuệ nhân tạo cho doanh nghiệp nhỏ, sản phẩm của sinh viên Bách khoa trưng bày tại Không gian Đổi mới sáng tạo liên ngành.",
    websiteUrl: "https://brand-flow-hust.vercel.app/",
    websiteDomain: "brand-flow-hust.vercel.app"
  },

  header: {
    universityLogoSrc: "/assets/official/inspect/top_left.jpg",
    anniversaryLogoSrc: "/assets/official/logo-ky-niem-70-nam.svg",
    innovationSpaceLogoSrc: null, // Chưa có file chính thức
    innovationSpacePlaceholder: "[Biểu trưng Không gian Đổi mới sáng tạo liên ngành - CẦN ĐIỀN]"
  },

  hero: {
    anniversaryGreeting: "Chào mừng kỷ niệm 70 năm thành lập Trường Đại học Bách khoa Hà Nội (1956 đến 2026)",
    inaugurationGreeting: "và lễ khánh thành",
    innovationSpaceName: "[CẦN ĐIỀN]",
    brandflowIntroduction: "BrandFlow, phòng tiếp thị trí tuệ nhân tạo cho doanh nghiệp nhỏ, sản phẩm của sinh viên Bách khoa.",
    yearNumber: "70",
    yearSpan: "1956 — 2026"
  },

  timeline: {
    startYear: 1956,
    endYear: 2026,
    title: "Bảy mươi năm, bảy mươi nút",
    subtitle: "Mạng lưới kết nối tri thức từ ngày thành lập trường đến điểm hội tụ công nghệ hiện tại.",
    milestones: [
      { year: 1956, label: "Thành lập Trường Đại học Bách khoa Hà Nội", isKey: true },
      { year: 1975, label: "Giai đoạn thống nhất và mở rộng đào tạo đa ngành", isKey: true },
      { year: 2006, label: "Kỷ niệm 50 năm, đón nhận Huân chương Sao Vàng", isKey: true },
      { year: 2022, label: "Chuyển đổi mô hình thành Đại học Bách khoa Hà Nội", isKey: true },
      { year: 2026, label: "Kỷ niệm 70 năm và khánh thành không gian đổi mới sáng tạo", isKey: true }
    ],
    brandflowNodeLabel: "BrandFlow (2026)"
  },

  interdisciplinary: {
    title: "Không gian kết nối liên ngành",
    subtitle: "Một sản phẩm do nhiều ngành cùng làm, hội tụ trong không gian đổi mới sáng tạo.",
    narrative: "BrandFlow không hình thành từ một ngành đơn lẻ. Các sợi kết nối mảnh từ từng chuyên ngành kỹ thuật và quản trị kéo về cùng một điểm, tạo nên phòng tiếp thị trí tuệ nhân tạo hoàn chỉnh.",
    convergencePoint: "Điểm hội tụ BrandFlow",
    departments: [
      {
        id: "cntt",
        name: "Công nghệ thông tin & Khoa học máy tính",
        contribution: "Kiến trúc hệ thống đa trợ lý, điều phối quy trình và xử lý ngôn ngữ tự nhiên tiếng Việt.",
        highlightYear: 2026
      },
      {
        id: "httt",
        name: "Hệ thống thông tin & Khoa học dữ liệu",
        contribution: "Thu thập cấu trúc dữ liệu thị trường, phân tích xu hướng ngành và đối thủ cạnh tranh.",
        highlightYear: 2026
      },
      {
        id: "qtkd",
        name: "Quản trị kinh doanh & Tiếp thị số",
        contribution: "Mô hình hóa chiến lược tiếp thị thực tiễn và khung kế hoạch cho doanh nghiệp vừa và nhỏ.",
        highlightYear: 2026
      },
      {
        id: "tkcn",
        name: "Thiết kế & Truyền thông thị giác",
        contribution: "Thiết kế trải nghiệm người dùng theo ngôn ngữ bản vẽ kỹ thuật và nhận diện thương hiệu nhất quán.",
        highlightYear: 2026
      }
    ]
  },

  outcomes: {
    title: "Kết quả bước đầu qua kiểm chứng",
    subtitle: "Số liệu thực tế ghi nhận trong giai đoạn thử nghiệm với các doanh nghiệp nhỏ.",
    allowNamingPartners: false, // Bật true để hiện tên Ameka và Kite Lab khi hai bên đã đồng ý
    partnerNames: {
      partnerA: "Ameka",
      partnerB: "Kite Lab",
      anonymousDescription: "công ty dịch vụ truyền thông tiếp thị"
    },
    metrics: [
      {
        id: "metric-1",
        value: 112,
        title: "Doanh nghiệp dùng thử",
        description: "Tiếp cận và khởi tạo dự án thực tế trên hệ thống",
        source: "Nhật ký hệ thống BrandFlow",
        timestamp: "Tháng 10/2026",
        isSample: false
      },
      {
        id: "metric-2",
        value: 54,
        title: "Doanh nghiệp trải nghiệm tròn một tháng",
        description: "Duy trì sử dụng và tạo kế hoạch tiếp thị định kỳ",
        source: "Nhật ký hệ thống BrandFlow",
        timestamp: "Tháng 10/2026",
        isSample: false
      },
      {
        id: "metric-3",
        value: 5,
        title: "Doanh nghiệp rời đi",
        description: "Chưa phù hợp với quy trình tiếp thị tự động hóa",
        source: "Khảo sát ý kiến người dùng BrandFlow",
        timestamp: "Tháng 10/2026",
        isSample: false
      },
      {
        id: "metric-4",
        value: 2,
        title: "Đề nghị đưa vào phòng tiếp thị 30 nhân sự",
        description: "Đề xuất tích hợp giải pháp vào vận hành thường nhật",
        source: "Biên bản làm việc hợp tác",
        timestamp: "Tháng 10/2026",
        isSample: false
      }
    ]
  },

  rulers: {
    title: "Thước đo thời gian hoàn thành kế hoạch",
    subtitle: "So sánh thời gian xây dựng một kế hoạch tiếp thị đầy đủ cho doanh nghiệp nhỏ.",
    traditional: {
      duration: "2 đến 4 tuần",
      label: "Cách làm truyền thống",
      details: "Thuê công ty dịch vụ ngoài hoặc đội ngũ nội bộ tự phân tích thủ công qua nhiều phiên họp."
    },
    brandflow: {
      duration: "khoảng 8 phút",
      label: "BrandFlow (Đa trợ lý trí tuệ nhân tạo)",
      details: "Các trợ lý chuyên trách cùng phản biện và đồng bộ kế hoạch hành động toàn diện."
    }
  },

  actions: {
    title: "Cửa vào sản phẩm đang hoạt động",
    subtitle: "Trải nghiệm quy trình làm việc thực tế cùng các trợ lý trí tuệ nhân tạo.",
    primaryButtons: {
      debate: {
        label: "Xem các trợ lý tranh luận",
        description: "Theo dõi phòng họp ảo: các trợ lý phản biện trực tiếp trên tờ kế hoạch tiếp thị.",
        href: "/workspace?stage=1"
      },
      trial: {
        label: "Thử với doanh nghiệp của bạn",
        description: "Khởi tạo thông tin thương hiệu với dữ liệu mẫu (ví dụ: Bếp Nhà Mộc).",
        href: "/onboarding"
      },
      samplePlan: {
        label: "Xem bản kế hoạch mẫu",
        description: "Khảo sát bản chiến lược hành động chi tiết 3 giai đoạn đã hoàn thiện.",
        href: "/workspace?stage=2"
      }
    },
    loginButton: {
      label: "Đăng nhập tài khoản",
      href: "/login"
    }
  },

  acknowledgements: {
    title: "Ghi nhận và tri ân",
    teamTitle: "Nhóm sinh viên thực hiện",
    members: [
      { name: "[CẦN ĐIỀN]", role: "Trưởng nhóm & Kiến trúc hệ thống", department: "Công nghệ thông tin" },
      { name: "[CẦN ĐIỀN]", role: "Kỹ sư trí tuệ nhân tạo", department: "Khoa học máy tính" },
      { name: "[CẦN ĐIỀN]", role: "Chuyên viên phân tích thị trường", department: "Quản trị kinh doanh" },
      { name: "[CẦN ĐIỀN]", role: "Thiết kế giao diện & Trải nghiệm", department: "Truyền thông thị giác" }
    ],
    advisorTitle: "Giảng viên hướng dẫn",
    advisors: [
      { name: "[CẦN ĐIỀN]", title: "Giảng viên hướng dẫn khoa học", department: "Đại học Bách khoa Hà Nội" }
    ],
    partnerTitle: "Đơn vị đồng hành",
    partners: [
      { name: "[CẦN ĐIỀN]", role: "Doanh nghiệp cố vấn thử nghiệm", logoSrc: null }
    ],
    gratitudeText: "Trân trọng cảm ơn Đảng ủy, Ban Giám hiệu Trường Đại học Bách khoa Hà Nội cùng quý Thầy Cô đã tạo dựng môi trường đổi mới sáng tạo, bồi dưỡng thế hệ kỹ sư tận tâm và bản lĩnh."
  },

  footer: {
    qrNotice: "Quét mã để truy cập ứng dụng trên thiết bị di động",
    qrUrl: "https://brand-flow-hust.vercel.app/",
    websiteLabel: "brand-flow-hust.vercel.app",
    sampleDataNotice: "Dữ liệu minh họa",
    copyright: "© 2026 BrandFlow — Sản phẩm của sinh viên Đại học Bách khoa Hà Nội"
  }
};
