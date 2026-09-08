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
