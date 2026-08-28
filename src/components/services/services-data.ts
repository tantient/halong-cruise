import { galleryImages, type GalleryCategory, type GalleryImage } from "@/components/gallery/gallery-data";

export interface ServiceHighlight {
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
}

export type ServiceGroup = "service" | "space";

export interface Service {
  id: string;
  category: GalleryCategory;
  group: ServiceGroup;
  menuNameVi: string;
  menuNameEn: string;
  menuDescVi: string;
  menuDescEn: string;
  nameVi: string;
  nameEn: string;
  eyebrowVi: string;
  eyebrowEn: string;
  taglineVi: string;
  taglineEn: string;
  introVi: string;
  introEn: string;
  highlights: ServiceHighlight[];
}

export const services: Service[] = [
  {
    id: "dining",
    group: "service",
    menuNameVi: "Ẩm thực",
    menuNameEn: "Dining",
    menuDescVi: "Nhà hàng Panorama, fine-dining tầm nhìn 270°",
    menuDescEn: "Panorama Restaurant, fine dining with 270° views",
    category: "dining",
    nameVi: "Nhà hàng Panorama",
    nameEn: "Panorama Restaurant",
    eyebrowVi: "ẨM THỰC",
    eyebrowEn: "DINING",
    taglineVi: "Fine-dining giữa vịnh, tầm nhìn 270 độ",
    taglineEn: "Fine dining on the bay with 270° views",
    introVi:
      "Nhà hàng Panorama trải dài theo vách kính toàn cảnh, nơi mỗi bữa ăn diễn ra cùng chuyển động của ánh sáng trên mặt vịnh. Thực đơn fusion Á – Âu được bếp trưởng thiết kế theo ngày, ưu tiên hải sản tươi và nguyên liệu bản địa. Khách có thể chọn khoang trong nhà, hiên ngoài trời hay một bàn riêng biệt cho dịp đặc biệt.",
    introEn:
      "Panorama Restaurant runs along a full wall of glass, so every meal moves with the light on the bay. The chef designs a daily Asian–European fusion menu built on fresh seafood and local produce. Guests can choose the indoor dining room, the open-air terrace, or a private table for special occasions.",
    highlights: [
      {
        titleVi: "Thực đơn theo ngày",
        titleEn: "Daily tasting menu",
        descVi: "Bếp trưởng thay đổi thực đơn mỗi hành trình theo nguyên liệu tươi trong ngày.",
        descEn: "The chef rewrites the menu each voyage around the day's freshest catch.",
      },
      {
        titleVi: "Hiên ăn ngoài trời",
        titleEn: "Open-air terrace",
        descVi: "Bàn ăn sát mép nước cho bữa tối hoàng hôn và tiệc riêng.",
        descEn: "Waterside tables for sunset dinners and private celebrations.",
      },
      {
        titleVi: "Bàn riêng theo yêu cầu",
        titleEn: "Private dining",
        descVi: "Khoang riêng phục vụ nhóm gia đình, kỷ niệm hoặc tiệc doanh nghiệp.",
        descEn: "Secluded settings for families, anniversaries or corporate dinners.",
      },
      {
        titleVi: "Phục vụ tận phòng 24/7",
        titleEn: "24/7 in-cabin service",
        descVi: "Thực đơn rút gọn phục vụ tại ban công phòng bất kỳ giờ nào.",
        descEn: "A curated menu served on your cabin balcony at any hour.",
      },
    ],
  },
  {
    id: "entertainment",
    group: "service",
    menuNameVi: "Giải trí",
    menuNameEn: "Entertainment",
    menuDescVi: "Sky Lounge, karaoke, cigar và khu trẻ em",
    menuDescEn: "Sky Lounge, karaoke, cigar room and kids’ club",
    category: "entertainment",
    nameVi: "Giải trí & Sky Lounge",
    nameEn: "Sky Lounge & Entertainment",
    eyebrowVi: "GIẢI TRÍ",
    eyebrowEn: "ENTERTAINMENT",
    taglineVi: "Từ lounge nhạc sống đến không gian riêng cho cả gia đình",
    taglineEn: "From live-music lounge to private family spaces",
    introVi:
      "Buổi tối trên Chronos bắt đầu ở Sky Lounge với cocktail và nhạc sống, rồi mở rộng ra nhiều không gian riêng: phòng karaoke cách âm, phòng cigar, khu trò chơi bàn và phòng sinh hoạt cho trẻ em. Mỗi khu vực được bố trí tách biệt để nhóm khách khác nhau đều có nhịp riêng của mình.",
    introEn:
      "Evenings aboard Chronos start at the Sky Lounge with cocktails and live music, then spread into a set of private rooms: a sound-proof karaoke suite, a cigar room, a games salon and a dedicated kids' room. Each space sits apart so every group keeps its own rhythm.",
    highlights: [
      {
        titleVi: "Sky Lounge & bar",
        titleEn: "Sky Lounge & bar",
        descVi: "Cocktail signature, nhạc sống mỗi tối và tầm nhìn trọn vịnh.",
        descEn: "Signature cocktails, nightly live music and full bay views.",
      },
      {
        titleVi: "Karaoke cách âm",
        titleEn: "Sound-proof karaoke",
        descVi: "Hai phòng riêng, hệ thống âm thanh cao cấp, phục vụ đồ uống tại chỗ.",
        descEn: "Two private rooms with premium audio and in-room drinks service.",
      },
      {
        titleVi: "Cigar & games room",
        titleEn: "Cigar & games room",
        descVi: "Không gian hút cigar thông gió riêng và bàn chơi bài, board game.",
        descEn: "A separately ventilated cigar lounge plus card and board-game tables.",
      },
      {
        titleVi: "Khu trẻ em",
        titleEn: "Kids' club",
        descVi: "Phòng chơi an toàn với nhân viên trông trẻ theo khung giờ.",
        descEn: "A safe playroom with supervised sessions through the day.",
      },
      {
        titleVi: "Phòng họp",
        titleEn: "Meeting room",
        descVi: "Trang bị trình chiếu cho hội thảo nhỏ và sự kiện doanh nghiệp.",
        descEn: "Presentation-ready for small seminars and corporate events.",
      },
    ],
  },
  {
    id: "spa",
    group: "service",
    menuNameVi: "Spa & Wellness",
    menuNameEn: "Spa & Wellness",
    menuDescVi: "Trị liệu, massage và khu nghỉ yên tĩnh",
    menuDescEn: "Treatments, massage and a quiet relaxation lounge",
    category: "wellness",
    nameVi: "Spa & Chăm sóc sức khoẻ",
    nameEn: "Serenity Spa & Wellness",
    eyebrowVi: "WELLNESS",
    eyebrowEn: "WELLNESS",
    taglineVi: "Liệu trình trị liệu giữa nhịp sóng tĩnh",
    taglineEn: "Treatments paced to the quiet of the bay",
    introVi:
      "Serenity Spa nằm ở khu vực yên tĩnh nhất của tàu, với phòng trị liệu đơn và đôi, khu ngâm chân và không gian nghỉ sau liệu trình. Kỹ thuật viên kết hợp trị liệu truyền thống Việt Nam với kỹ thuật thư giãn hiện đại, sử dụng tinh dầu thiên nhiên.",
    introEn:
      "Serenity Spa occupies the quietest part of the ship, with single and couple treatment rooms, a foot-therapy area and a post-treatment relaxation space. Therapists blend traditional Vietnamese techniques with contemporary bodywork, using natural essential oils.",
    highlights: [
      {
        titleVi: "Phòng trị liệu đôi",
        titleEn: "Couple treatment room",
        descVi: "Liệu trình song song cho hai người trong cùng không gian riêng.",
        descEn: "Side-by-side treatments in one private suite.",
      },
      {
        titleVi: "Ngâm chân thảo dược",
        titleEn: "Herbal foot ritual",
        descVi: "Nghi thức ngâm chân với thảo mộc bản địa trước mỗi liệu trình.",
        descEn: "A local-herb foot soak opens every treatment.",
      },
      {
        titleVi: "Massage trị liệu",
        titleEn: "Therapeutic massage",
        descVi: "Từ massage đá nóng đến trị liệu vai gáy cho hành trình dài.",
        descEn: "From hot-stone work to neck and shoulder relief after long travel.",
      },
      {
        titleVi: "Khu nghỉ sau liệu trình",
        titleEn: "Relaxation lounge",
        descVi: "Trà thảo mộc và ghế nghỉ hướng vịnh sau khi kết thúc liệu trình.",
        descEn: "Herbal tea and bay-facing loungers to close each session.",
      },
    ],
  },
  {
    id: "public-spaces",
    group: "space",
    menuNameVi: "Sảnh & Lounge",
    menuNameEn: "Lobby & Lounge",
    menuDescVi: "Sảnh đón hai tầng, lễ tân và hồ bơi trong nhà",
    menuDescEn: "Double-height lobby, reception and indoor pool",
    category: "public",
    nameVi: "Sảnh chính & Không gian chung",
    nameEn: "Grand Lobby & Public Spaces",
    eyebrowVi: "KHÔNG GIAN CHUNG",
    eyebrowEn: "PUBLIC SPACES",
    taglineVi: "Trái tim của con tàu, nơi mọi hành trình bắt đầu",
    taglineEn: "The heart of the ship, where every voyage begins",
    introVi:
      "Sảnh chính hai tầng với cầu thang trung tâm là điểm đón khách đầu tiên trên Chronos. Từ đây, quầy lễ tân, lounge chờ, hồ bơi trong nhà và khu jacuzzi kết nối liền mạch, tạo nên trục sinh hoạt chung của toàn tàu.",
    introEn:
      "A double-height lobby with a sculptural central staircase welcomes guests aboard Chronos. Reception, the waiting lounge, the indoor pool and the jacuzzi area flow from it, forming the social spine of the ship.",
    highlights: [
      {
        titleVi: "Sảnh đón hai tầng",
        titleEn: "Double-height lobby",
        descVi: "Cầu thang trung tâm và ánh sáng tự nhiên xuyên suốt ban ngày.",
        descEn: "A central staircase under natural light through the day.",
      },
      {
        titleVi: "Lễ tân & quản gia",
        titleEn: "Reception & butler desk",
        descVi: "Hỗ trợ đặt dịch vụ, hành trình và yêu cầu riêng suốt 24 giờ.",
        descEn: "Bookings, itineraries and personal requests, around the clock.",
      },
      {
        titleVi: "Hồ bơi & jacuzzi",
        titleEn: "Pool & jacuzzi",
        descVi: "Khu bơi có mái che dùng được cả khi thời tiết thay đổi.",
        descEn: "A sheltered pool that stays usable when the weather turns.",
      },
      {
        titleVi: "Lounge chung",
        titleEn: "Guest lounge",
        descVi: "Không gian đọc sách, trà chiều và gặp gỡ giữa các hành trình.",
        descEn: "Reading, afternoon tea and easy meeting space between excursions.",
      },
    ],
  },
  {
    id: "sundeck",
    group: "space",
    menuNameVi: "Sundeck & Hồ bơi",
    menuNameEn: "Sundeck & Pool",
    menuDescVi: "Boong cao nhất với hồ bơi vô cực và bar ngoài trời",
    menuDescEn: "Top deck with infinity pool and open-air bar",
    category: "deck",
    nameVi: "Boong tắm nắng & Hồ bơi",
    nameEn: "Sundeck & Infinity Pool",
    eyebrowVi: "BOONG TÀU",
    eyebrowEn: "DECKS",
    taglineVi: "Tầng cao nhất, tầm nhìn không giới hạn",
    taglineEn: "The highest deck, the widest horizon",
    introVi:
      "Sundeck trải rộng trên tầng cao nhất với hồ bơi vô cực, ghế tắm nắng và quầy bar ngoài trời. Đây là nơi ngắm hoàng hôn đẹp nhất trên tàu, cũng là không gian tổ chức tiệc ngoài trời và các buổi yoga sáng sớm.",
    introEn:
      "The sundeck spans the top of the ship with an infinity pool, sun loungers and an open-air bar. It offers the best sunset on board and doubles as the venue for deck parties and early-morning yoga.",
    highlights: [
      {
        titleVi: "Hồ bơi vô cực",
        titleEn: "Infinity pool",
        descVi: "Mép hồ hoà vào đường chân trời của vịnh.",
        descEn: "A pool edge that dissolves into the bay horizon.",
      },
      {
        titleVi: "Bar ngoài trời",
        titleEn: "Open-air bar",
        descVi: "Cocktail hoàng hôn phục vụ ngay tại ghế tắm nắng.",
        descEn: "Sunset cocktails served straight to your lounger.",
      },
      {
        titleVi: "Tiệc trên boong",
        titleEn: "Deck events",
        descVi: "Không gian mở cho tiệc BBQ, sinh nhật và sự kiện riêng.",
        descEn: "Open space for BBQ nights, birthdays and private events.",
      },
      {
        titleVi: "Yoga buổi sáng",
        titleEn: "Morning yoga",
        descVi: "Lớp yoga đón bình minh trên khu boong phía mũi tàu.",
        descEn: "Sunrise yoga sessions on the forward deck.",
      },
    ],
  },
  {
    id: "exterior",
    group: "space",
    menuNameVi: "Ngoại thất tàu",
    menuNameEn: "Ship Exterior",
    menuDescVi: "Thiết kế thân tàu, boong nhiều tầng, 44 phòng hướng biển",
    menuDescEn: "Hull design, stepped decks, 44 sea-facing cabins",
    category: "exterior",
    nameVi: "Ngoại thất du thuyền",
    nameEn: "Yacht Exterior",
    eyebrowVi: "THIẾT KẾ",
    eyebrowEn: "DESIGN",
    taglineVi: "Đường nét du thuyền hiện đại trên vịnh di sản",
    taglineEn: "A modern yacht silhouette on a heritage bay",
    introVi:
      "Chronos được thiết kế theo ngôn ngữ du thuyền hiện đại: thân tàu thanh mảnh, dải kính liên tục và các tầng boong lùi dần tạo nhịp thị giác. Toàn bộ 44 phòng đều hướng biển, mỗi tầng đều có khu vực ngoài trời riêng.",
    introEn:
      "Chronos is drawn in a contemporary yacht language: a slender hull, continuous glazing and stepped decks that give the profile its rhythm. All 44 cabins face the sea, and every deck keeps its own outdoor terrace.",
    highlights: [
      {
        titleVi: "44 phòng hướng biển",
        titleEn: "44 sea-facing cabins",
        descVi: "Mọi phòng đều có tầm nhìn ra vịnh, phần lớn có ban công riêng.",
        descEn: "Every cabin looks onto the bay, most with a private balcony.",
      },
      {
        titleVi: "Boong nhiều tầng",
        titleEn: "Stepped decks",
        descVi: "Các tầng boong lùi dần tạo khu vực ngoài trời riêng cho từng tầng.",
        descEn: "Stepped levels give each deck its own outdoor area.",
      },
      {
        titleVi: "Chiếu sáng ban đêm",
        titleEn: "Night lighting",
        descVi: "Hệ chiếu sáng viền thân tàu làm nổi khối dáng khi neo đậu.",
        descEn: "Hull lighting that draws the silhouette at anchor.",
      },
    ],
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function serviceImages(service: Service): GalleryImage[] {
  return galleryImages.filter((img) => img.category === service.category);
}
