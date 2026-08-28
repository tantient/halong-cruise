export type Lang = "vi" | "en";

export interface Translations {
  nav: {
    about: string;
    cabins: string;
    services: string;
    gallery: string;
    itineraries: string;
    offers: string;
    careers: string;
    quote: string;
    book: string;
    contact: string;
    more: string;
    spaces: string;
  };
  hero: {
    tagline: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    cta: string;
    scroll: string;
  };
  earlyAccess: {
    name: string;
    contact: string;
    contactPlaceholder: string;
    submit: string;
    success: string;
    helper: string;
  };
  about: {
    label: string;
    title: string;
    body: string;
    features: { title: string; desc: string }[];
    values: {
      label: string;
      title: string;
      items: { title: string; desc: string }[];
    };
  };
  gallery: {
    label: string;
    title: string;
    subtitle: string;
    captions: string[];
  };
  teaserGallery: {
    label: string;
    title: string;
    subtitle: string;
    captions: string[];
    asideTitle: string;
    asideBody: string;
    asideCta: string;
  };
  form: {
    label: string;
    title: string;
    subtitle: string;
    name: string;
    phone: string;
    email: string;
    date: string;
    message: string;
    submit: string;
    success: string;
  };
  teaserForm: {
    label: string;
    title: string;
    subtitle: string;
    name: string;
    phone: string;
    email: string;
    date: string;
    message: string;
    submit: string;
    success: string;
  };
  recruitTeaser: {
    label: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    name: string;
    contact: string;
    position: string;
    positionPlaceholder: string;
    submit: string;
    success: string;
    viewAll: string;
  };
  itineraries: {
    label: string;
    title: string;
    subtitle: string;
    duration: string;
    includes: string;
    excludes: string;
    highlights: string;
    cta: string;
  };
  offers: {
    label: string;
    title: string;
    subtitle: string;
    terms: string;
    cta: string;
  };
  careers: {
    label: string;
    title: string;
    subtitle: string;
    openingsLabel: string;
    openingsTitle: string;
    openingsSubtitle: string;
    contactZalo: string;
    sendEmail: string;
    ctaLabel: string;
    ctaTitle: string;
    ctaSubtitle: string;
    processLabel: string;
    processText: string;
    locationLabel: string;
    locationText: string;
  };
  contact: {
    label: string;
    title: string;
    subtitle: string;
    phone: string;
    zalo: string;
    email: string;
    address: string;
    addressValue: string;
    hours: string;
    hoursValue: string;
    chatZalo: string;
    call: string;
    mapTitle: string;
    formTitle: string;
    formSubtitle: string;
    name: string;
    phoneField: string;
    subject: string;
    message: string;
    submit: string;
    success: string;
  };
  footer: {
    rights: string;
    tagline: string;
    quickLinks: string;
    contact: string[];
  };
}

const translations: Record<Lang, Translations> = {
  vi: {
    nav: {
      about: "Giới thiệu",
      cabins: "Phòng nghỉ",
      services: "Dịch vụ",
      gallery: "Thư viện ảnh",
      itineraries: "Hải trình",
      offers: "Ưu đãi",
      careers: "Tuyển dụng",
      quote: "Nhận báo giá",
      book: "Đặt phòng",
      contact: "Liên hệ",
      more: "Khác",
      spaces: "Không gian trên tàu",
    },
    hero: {
      tagline: "SẮP RA MẮT",
      title: "CHRONOS",
      titleAccent: "CRUISE",
      subtitle:
        "Một trải nghiệm 6 sao đang được chuẩn bị giữa vịnh Hạ Long và Lan Hạ. Đăng ký để là người đầu tiên khám phá.",
      cta: "Nhận thông báo đầu tiên",
      scroll: "Cuộn xuống",
    },
    earlyAccess: {
      name: "Họ tên",
      contact: "Email hoặc Số điện thoại",
      contactPlaceholder: "email@example.com",
      submit: "Đăng ký nhận tin",
      success: "Cảm ơn bạn. Chronos sẽ liên hệ sớm.",
      helper: "Thông tin của bạn được bảo mật.",
    },
    about: {
      label: "VỀ CHRONOS",
      title: "Tinh hoa nghỉ dưỡng trên vịnh",
      body: "Chronos Cruise mang đến không gian riêng tư, dịch vụ cá nhân hóa và hành trình khám phá vịnh Hạ Long – Lan Hạ theo phong cách 6 sao. Mỗi khoảnh khắc trên tàu đều được thiết kế để bạn tìm lại sự cân bằng và phiêu lưu theo cách của riêng mình.",
      features: [
        { title: "44 suite hướng biển", desc: "Ban công riêng, tầm nhìn 270°" },
        { title: "Ẩm thực 5 sao", desc: "Thực đơn fusion theo ngày" },
        { title: "Spa & wellness", desc: "Liệu trình chăm sóc toàn diện" },
        { title: "Dịch vụ 24/7", desc: "Quản gia riêng trên tàu" },
      ],
      values: {
        label: "GIÁ TRỊ CỐT LÕI",
        title: "Lấy khách làm trung tâm",
        items: [
          { title: "Yên tĩnh", desc: "Không gian và nhịp điệu được thiết kế để bạn thực sự thư giãn." },
          { title: "Chu đáo", desc: "Mỗi yêu cầu nhỏ đều được ghi nhận và đáp ứng kịp thời." },
          { title: "Bản địa", desc: "Ẩm thực, trị liệu và trải nghiệm gắn liền với văn hóa vịnh." },
          { title: "Bền vững", desc: "Vận hành thân thiện với hệ sinh thái biển đảo." },
        ],
      },
    },
    gallery: {
      label: "KHÔNG GIAN",
      title: "Chronos qua từng góc nhìn",
      subtitle: "Từng chi tiết được chuẩn bị cho kỳ nghỉ hoàn hảo.",
      captions: ["Suite hướng biển", "Nhà hàng fine-dining", "Sundeck & hồ bơi"],
    },
    teaserGallery: {
      label: "HÉ LỘ",
      title: "Những góc nhìn đầu tiên",
      subtitle: "Những hình ảnh đầu tiên từ hành trình sắp ra mắt.",
      captions: ["Suite hướng biển", "Nhà hàng Panorama", "Sundeck & hồ bơi"],
      asideTitle: "Gia nhập đội ngũ",
      asideBody: "Tàu sắp ra mắt và chúng tôi đang tìm những con người tận tâm cho đội ngũ vận hành.",
      asideCta: "Xem vị trí",
    },
    form: {
      label: "ĐĂNG KÝ",
      title: "Nhận báo giá nhanh",
      subtitle: "Để lại thông tin, đội ngũ tư vấn sẽ liên hệ trong 24 giờ.",
      name: "Họ tên",
      phone: "Số điện thoại",
      email: "Email",
      date: "Ngày dự kiến",
      message: "Ghi chú / Yêu cầu đặc biệt",
      submit: "Gửi yêu cầu",
      success: "Đã gửi yêu cầu! Chronos sẽ liên hệ bạn sớm.",
    },
    teaserForm: {
      label: "BÁO GIÁ SỚM",
      title: "Muốn nhận báo giá sớm?",
      subtitle: "Để lại thông tin, đội ngũ Chronos sẽ gửi ưu đãi đầu tiên khi tàu chính thức khai trương.",
      name: "Họ tên",
      phone: "Số điện thoại",
      email: "Email",
      date: "Ngày dự kiến",
      message: "Ghi chú / Yêu cầu đặc biệt",
      submit: "Gửi yêu cầu",
      success: "Đã gửi yêu cầu! Chronos sẽ liên hệ bạn sớm.",
    },
    recruitTeaser: {
      label: "TUYỂN DỤNG",
      title: "Kiến tạo",
      titleAccent: "Hành trình di sản",
      subtitle: "Tàu sắp ra mắt và chúng tôi đang tìm những con người tận tâm cho đội ngũ vận hành.",
      name: "Họ tên",
      contact: "Số điện thoại / Email",
      position: "Vị trí ứng tuyển",
      positionPlaceholder: "Chọn vị trí",
      submit: "Gửi hồ sơ",
      success: "Đã nhận hồ sơ! Chronos sẽ liên hệ bạn sớm.",
      viewAll: "Xem tất cả vị trí",
    },
    itineraries: {
      label: "HẢI TRÌNH",
      title: "Chọn hành trình của bạn",
      subtitle: "Từ chuyến đi ngắn ngày đến hành trình khám phá sâu hơn giữa vịnh Hạ Long – Lan Hạ.",
      duration: "Thời lượng",
      includes: "Bao gồm",
      excludes: "Không bao gồm",
      highlights: "Điểm nhấn",
      cta: "Tư vấn hải trình",
    },
    offers: {
      label: "ƯU ĐÃI",
      title: "Các gói đặc biệt đang mở",
      subtitle: "Những ưu đãi được cập nhật theo mùa, giúp bạn tận hưởng Chronos với giá trị tốt nhất.",
      terms: "Điều kiện",
      cta: "Nhận ưu đãi",
    },
    careers: {
      label: "TUYỂN DỤNG",
      title: "Gia nhập Chronos",
      subtitle: "Cơ hội làm việc trên du thuyền 6 sao tại vịnh Hạ Long – Lan Hạ. Liên hệ trực tiếp qua Zalo hoặc email.",
      openingsLabel: "VỊ TRÍ MỞ",
      openingsTitle: "Đang tuyển dụng",
      openingsSubtitle: "Xem các vị trí đang tuyển và liên hệ bộ phận nhân sự Chronos qua Zalo hoặc email bên dưới.",
      contactZalo: "Liên hệ Zalo",
      sendEmail: "Gửi Email",
      ctaLabel: "LIÊN HỆ",
      ctaTitle: "Bạn chưa tìm thấy vị trí phù hợp?",
      ctaSubtitle: "Gửi hồ sơ hoặc nhắn tin Zalo, đội ngũ Chronos sẽ phản hồi trong 24 giờ.",
      processLabel: "Quy trình",
      processText: "Liên hệ qua Zalo/Email → Gửi CV → Phỏng vấn → Nhận offer.",
      locationLabel: "Địa điểm làm việc",
      locationText: "Cảng tàu khách quốc tế Hạ Long, TP. Hạ Long, Quảng Ninh.",
    },
    contact: {
      label: "LIÊN HỆ",
      title: "Kết nối cùng Chronos",
      subtitle: "Đội ngũ tư vấn sẵn sàng hỗ trợ bạn 24/7 qua điện thoại, Zalo hoặc email.",
      phone: "Hotline",
      zalo: "Zalo",
      email: "Email",
      address: "Địa chỉ",
      addressValue: "Cảng tàu khách quốc tế Hạ Long, TP. Hạ Long, Quảng Ninh",
      hours: "Giờ làm việc",
      hoursValue: "Hàng ngày · 08:00 – 21:00",
      chatZalo: "Nhắn tin Zalo",
      call: "Gọi ngay",
      mapTitle: "Vị trí bến tàu",
      formTitle: "Gửi tin nhắn cho chúng tôi",
      formSubtitle: "Điền thông tin bên dưới, Chronos sẽ phản hồi trong vòng 24 giờ.",
      name: "Họ tên",
      phoneField: "Số điện thoại",
      subject: "Chủ đề",
      message: "Nội dung tin nhắn",
      submit: "Gửi tin nhắn",
      success: "Đã gửi tin nhắn! Chronos sẽ liên hệ bạn sớm.",
    },
    footer: {
      rights: "© 2026 Chronos Cruise. All rights reserved.",
      tagline: "HA LONG BAY · LAN HA BAY",
      quickLinks: "Liên kết nhanh",
      contact: ["+84 902 000 000", "booking@chronoscruise.com", "Vịnh Hạ Long · Lan Hạ, Việt Nam"],
    },
  },
  en: {
    nav: {
      about: "About",
      cabins: "Cabins",
      services: "Services",
      gallery: "Gallery",
      itineraries: "Itineraries",
      offers: "Offers",
      careers: "Careers",
      quote: "Get a quote",
      book: "Book now",
      contact: "Contact",
      more: "More",
      spaces: "Onboard Spaces",
    },
    hero: {
      tagline: "COMING SOON",
      title: "CHRONOS",
      titleAccent: "CRUISE",
      subtitle:
        "A six-star experience is being prepared between Ha Long Bay and Lan Ha Bay. Register to be the first to discover it.",
      cta: "Be the first to know",
      scroll: "Scroll",
    },
    earlyAccess: {
      name: "Full name",
      contact: "Email or Phone number",
      contactPlaceholder: "email@example.com",
      submit: "Notify me",
      success: "Thank you. Chronos will reach out soon.",
      helper: "Your information is kept private.",
    },
    about: {
      label: "ABOUT CHRONOS",
      title: "The essence of bay-side luxury",
      body: "Chronos Cruise offers private spaces, personalized service and curated voyages across Ha Long Bay and Lan Ha Bay in true six-star style. Every moment aboard is designed to help you rediscover balance and adventure on your own terms.",
      features: [
        { title: "44 ocean-view suites", desc: "Private balcony, 270° vistas" },
        { title: "Five-star dining", desc: "Daily fusion menus" },
        { title: "Spa & wellness", desc: "Holistic treatments" },
        { title: "24/7 service", desc: "Dedicated onboard butler" },
      ],
      values: {
        label: "CORE VALUES",
        title: "Centered on our guests",
        items: [
          { title: "Quiet", desc: "Spaces and rhythms designed for genuine relaxation." },
          { title: "Attentive", desc: "Every small request is noticed and handled promptly." },
          { title: "Local", desc: "Dining, therapies and experiences rooted in bay culture." },
          { title: "Sustainable", desc: "Operations that respect the sea-and-island ecosystem." },
        ],
      },
    },
    gallery: {
      label: "SPACES",
      title: "Chronos in every view",
      subtitle: "Every detail is prepared for a perfect stay.",
      captions: ["Ocean-view suite", "Fine-dining restaurant", "Sundeck & pool"],
    },
    teaserGallery: {
      label: "FIRST GLIMPSES",
      title: "First glimpses",
      subtitle: "The first images from the upcoming voyage.",
      captions: ["Ocean-view suite", "Panorama restaurant", "Sundeck & pool"],
      asideTitle: "Join the crew",
      asideBody: "The cruise is launching soon and we are looking for dedicated people to join our operations team.",
      asideCta: "View openings",
    },
    form: {
      label: "QUOTE",
      title: "Request a quick quote",
      subtitle: "Leave your details and our concierge will reach out within 24 hours.",
      name: "Full name",
      phone: "Phone number",
      email: "Email",
      date: "Expected date",
      message: "Notes / Special requests",
      submit: "Send request",
      success: "Request sent! Chronos will contact you soon.",
    },
    teaserForm: {
      label: "EARLY QUOTE",
      title: "Want an early quote?",
      subtitle: "Leave your details and Chronos will send the first offers when the cruise officially launches.",
      name: "Full name",
      phone: "Phone number",
      email: "Email",
      date: "Expected date",
      message: "Notes / Special requests",
      submit: "Send request",
      success: "Request sent! Chronos will contact you soon.",
    },
    recruitTeaser: {
      label: "CAREERS",
      title: "Craft",
      titleAccent: "Heritage Journeys",
      subtitle: "The cruise is launching soon and we are looking for dedicated people to join our operations team.",
      name: "Full name",
      contact: "Phone / Email",
      position: "Position",
      positionPlaceholder: "Select a position",
      submit: "Apply now",
      success: "Application received! Chronos will contact you soon.",
      viewAll: "View all positions",
    },
    itineraries: {
      label: "ITINERARIES",
      title: "Choose your voyage",
      subtitle: "From a short escape to a deeper exploration of Ha Long Bay and Lan Ha Bay.",
      duration: "Duration",
      includes: "Includes",
      excludes: "Excludes",
      highlights: "Highlights",
      cta: "Tailor an itinerary",
    },
    offers: {
      label: "OFFERS",
      title: "Special packages now open",
      subtitle: "Seasonal offers updated regularly so you can experience Chronos at the best value.",
      terms: "Terms",
      cta: "Claim offer",
    },
    careers: {
      label: "CAREERS",
      title: "Join Chronos",
      subtitle: "Career opportunities aboard a six-star cruise in Ha Long Bay and Lan Ha Bay. Contact us directly via Zalo or email.",
      openingsLabel: "OPEN POSITIONS",
      openingsTitle: "Now hiring",
      openingsSubtitle: "Review the open roles and contact the Chronos HR team via Zalo or email below.",
      contactZalo: "Contact via Zalo",
      sendEmail: "Send Email",
      ctaLabel: "GET IN TOUCH",
      ctaTitle: "Can't find the right role?",
      ctaSubtitle: "Send your CV or message us on Zalo — the Chronos team will reply within 24 hours.",
      processLabel: "Process",
      processText: "Contact via Zalo/Email → Submit CV → Interview → Receive offer.",
      locationLabel: "Work location",
      locationText: "Ha Long International Cruise Port, Ha Long City, Quang Ninh.",
    },
    contact: {
      label: "CONTACT",
      title: "Get in touch with Chronos",
      subtitle: "Our concierge team is available 24/7 by phone, Zalo or email.",
      phone: "Hotline",
      zalo: "Zalo",
      email: "Email",
      address: "Address",
      addressValue: "Ha Long International Cruise Port, Ha Long City, Quang Ninh",
      hours: "Opening hours",
      hoursValue: "Daily · 08:00 – 21:00",
      chatZalo: "Chat on Zalo",
      call: "Call now",
      mapTitle: "Port location",
      formTitle: "Send us a message",
      formSubtitle: "Fill in the form below and Chronos will reply within 24 hours.",
      name: "Full name",
      phoneField: "Phone number",
      subject: "Subject",
      message: "Message",
      submit: "Send message",
      success: "Message sent! Chronos will contact you soon.",
    },
    footer: {
      rights: "© 2026 Chronos Cruise. All rights reserved.",
      tagline: "HA LONG BAY · LAN HA BAY",
      quickLinks: "Quick links",
      contact: ["+84 902 000 000", "booking@chronoscruise.com", "Ha Long Bay · Lan Ha, Vietnam"],
    },
  },
};

export function getT(lang: Lang) {
  return translations[lang] ?? translations.vi;
}
