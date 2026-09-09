/**
 * Shared UI labels for the cabins template.
 *
 * Platform-level wording only (labels, units, buttons). Ship-specific copy —
 * cabin names, descriptions, specs, notes, page headlines — comes from the
 * database through the public read layer.
 */

import type { Lang } from "@/lib/translations";

export interface CabinUi {
  eyebrowCabins: string;
  eyebrowCategories: string;
  eyebrowComparison: string;
  eyebrowOverview: string;
  eyebrowAmenities: string;
  eyebrowFloorPlan: string;
  eyebrowGallery: string;
  area: string;
  totalPrivateArea: string;
  totalPrivateAreaSuffix: string;
  cabinsCount: string;
  bed: string;
  maxOccupancy: string;
  view: string;
  location: string;
  technicalCode: string;
  cabinType: string;
  privateTerrace: string;
  outdoorWhirlpool: string;
  included: string;
  king: string;
  viewDetails: string;
  requestQuote: string;
  compareDetails: string;
  close: string;
  compareLoading: string;
  compareIntro: string;
  explorer: string;
  exploreSuite: string;
  findSuite: string;
  findSuiteCopy: string;
  compareSuites: string;
  requestRecommendation: string;
  whySuite: string;
  theSpace: string;
  keyDetails: string;
  compareOtherSuites: string;
  categoriesHeading: string;
  suitableVoyages: string;
  suitableVoyagesCopy: string;
  exploreVoyages: string;
  finalJourney: string;
  otherCabin: string;
  planArea: string;
  planTapHint: string;
  rooms: (n: number | string) => string;
  guests: (n: number | string) => string;
}

const UI: Record<Lang, CabinUi> = {
  en: {
    eyebrowCabins: "CABINS",
    eyebrowCategories: "CABIN CATEGORIES",
    eyebrowComparison: "SUITE COMPARISON",
    eyebrowOverview: "OVERVIEW",
    eyebrowAmenities: "AMENITIES",
    eyebrowFloorPlan: "FLOOR PLAN",
    eyebrowGallery: "GALLERY",
    area: "Area",
    totalPrivateArea: "TOTAL PRIVATE AREA",
    totalPrivateAreaSuffix: "Total Private Area",
    cabinsCount: "Cabins",
    bed: "Bed",
    maxOccupancy: "Max occupancy",
    view: "View",
    location: "Location",
    technicalCode: "Technical code",
    cabinType: "Cabin type",
    privateTerrace: "Private terrace",
    outdoorWhirlpool: "Outdoor whirlpool",
    included: "Included",
    king: "King",
    viewDetails: "View details",
    requestQuote: "Request a quote",
    compareDetails: "Compare details",
    close: "Close",
    compareLoading: "Loading comparison data…",
    compareIntro: "Quick overview for this cabin category.",
    explorer: "CABIN EXPLORER",
    exploreSuite: "Explore this suite",
    findSuite: "FIND YOUR SUITE",
    findSuiteCopy: "Compare the details that matter, or let our team help you choose your space on board.",
    compareSuites: "Compare suites",
    requestRecommendation: "Request recommendation",
    whySuite: "WHY THIS SUITE",
    theSpace: "THE SPACE",
    keyDetails: "KEY DETAILS",
    compareOtherSuites: "COMPARE WITH OTHER SUITES",
    suitableVoyages: "YOUR VOYAGE",
    suitableVoyagesCopy: "Explore our published voyages and choose the journey that suits your time in Ha Long Bay.",
    exploreVoyages: "Explore voyages",
    finalJourney: "REQUEST YOUR JOURNEY",
    otherCabin: "Other cabin",
    planArea: "AREA",
    planTapHint: "Tap any area on the plan to see its name.",
    rooms: (n) => `${n} cabins`,
    guests: (n) => `${n} guests`,
  },
  vi: {
    eyebrowCabins: "PHÒNG NGHỈ",
    eyebrowCategories: "HẠNG PHÒNG",
    eyebrowComparison: "BẢNG SO SÁNH SUITE",
    eyebrowOverview: "MÔ TẢ",
    eyebrowAmenities: "TIỆN NGHI",
    eyebrowFloorPlan: "SƠ ĐỒ BỐ TRÍ",
    eyebrowGallery: "HÌNH ẢNH",
    area: "Diện tích",
    totalPrivateArea: "TỔNG DIỆN TÍCH RIÊNG",
    totalPrivateAreaSuffix: "tổng diện tích riêng",
    cabinsCount: "Số phòng",
    bed: "Giường",
    maxOccupancy: "Sức chứa tối đa",
    view: "Tầm nhìn",
    location: "Vị trí",
    technicalCode: "Mã kỹ thuật",
    cabinType: "Hạng phòng",
    privateTerrace: "Sân riêng",
    outdoorWhirlpool: "Hồ sục ngoài trời",
    included: "Có",
    king: "King",
    viewDetails: "Xem chi tiết",
    requestQuote: "Liên hệ báo giá",
    compareDetails: "So sánh chi tiết",
    close: "Đóng",
    compareLoading: "Đang tải dữ liệu so sánh…",
    compareIntro: "Thông tin nhanh về hạng phòng này.",
    explorer: "KHÁM PHÁ HẠNG PHÒNG",
    exploreSuite: "Khám phá hạng phòng",
    findSuite: "CHỌN HẠNG PHÒNG CỦA BẠN",
    findSuiteCopy: "So sánh những thông tin quan trọng hoặc để đội ngũ của chúng tôi tư vấn không gian phù hợp.",
    compareSuites: "So sánh hạng phòng",
    requestRecommendation: "Nhận tư vấn",
    whySuite: "ĐIỂM KHÁC BIỆT",
    theSpace: "KHÔNG GIAN",
    keyDetails: "THÔNG TIN CHÍNH",
    compareOtherSuites: "SO SÁNH VỚI HẠNG PHÒNG KHÁC",
    suitableVoyages: "HẢI TRÌNH CỦA BẠN",
    suitableVoyagesCopy: "Khám phá các hải trình đang mở và chọn hành trình phù hợp với thời gian của bạn trên vịnh Hạ Long.",
    exploreVoyages: "Khám phá hải trình",
    finalJourney: "ĐỀ XUẤT HÀNH TRÌNH",
    otherCabin: "Hạng phòng khác",
    planArea: "KHU VỰC",
    planTapHint: "Chạm vào từng khu vực trên sơ đồ để xem tên khu vực.",
    rooms: (n) => `${n} phòng`,
    guests: (n) => `${n} khách`,
  },
};

export function cabinUi(lang: Lang): CabinUi {
  return UI[lang] ?? UI.en;
}
