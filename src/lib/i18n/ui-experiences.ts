/**
 * Generic interface labels for the Experiences and The Ship areas.
 * All editorial/factual copy lives in the database (`services`, `ship_pages`);
 * only reusable words live here so every ship on the platform shares them.
 */

import type { Lang } from "@/lib/translations";

export interface ExperienceUi {
  /** Landing + detail */
  discover: string;
  explore: string;
  highlights: string;
  gallery: string;
  openingHours: string;
  priceNote: string;
  continueAboard: string;
  partOfVoyage: string;
  viewVoyages: string;
  chooseCabin: string;
  requestJourney: string;
  /** The Ship */
  architecture: string;
  publicSpaces: string;
  aboveWater: string;
  exploreCabins: string;
  exploreExperiences: string;
}

const EN: ExperienceUi = {
  discover: "Discover",
  explore: "Explore",
  highlights: "Highlights",
  gallery: "Gallery",
  openingHours: "Opening hours",
  priceNote: "Pricing",
  continueAboard: "Continue aboard",
  partOfVoyage: "Part of your voyage",
  viewVoyages: "View voyages",
  chooseCabin: "Choose your cabin",
  requestJourney: "Request your journey",
  architecture: "Architecture",
  publicSpaces: "Public spaces",
  aboveWater: "Life above the water",
  exploreCabins: "Explore cabins",
  exploreExperiences: "Explore experiences",
};

const DICT: Partial<Record<string, ExperienceUi>> = {
  en: EN,
  vi: {
    discover: "Khám phá",
    explore: "Xem thêm",
    highlights: "Điểm nổi bật",
    gallery: "Hình ảnh",
    openingHours: "Giờ mở cửa",
    priceNote: "Giá",
    continueAboard: "Tiếp tục trên tàu",
    partOfVoyage: "Một phần của hành trình",
    viewVoyages: "Xem hành trình",
    chooseCabin: "Chọn phòng nghỉ",
    requestJourney: "Yêu cầu hành trình",
    architecture: "Kiến trúc",
    publicSpaces: "Không gian chung",
    aboveWater: "Đời sống trên mặt nước",
    exploreCabins: "Xem phòng nghỉ",
    exploreExperiences: "Xem trải nghiệm",
  },
};

export function experienceUi(language: Lang | string): ExperienceUi {
  return DICT[language] ?? EN;
}
