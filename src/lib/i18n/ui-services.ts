/**
 * Generic UI labels for the services template. Brand/editorial copy lives in the
 * database (`services`, `ship_pages`); only reusable interface words live here so
 * every ship on the platform shares them.
 */

import type { Lang } from "@/lib/translations";

export interface ServiceUi {
  highlights: string;
  gallery: string;
  openingHours: string;
  priceNote: string;
  interested: string;
  interestedBody: string;
  otherServices: string;
}

const EN: ServiceUi = {
  highlights: "Highlights",
  gallery: "Gallery",
  openingHours: "Opening hours",
  priceNote: "Pricing",
  interested: "Interested in this experience?",
  interestedBody: "Our team will tailor an itinerary for you within 24 hours.",
  otherServices: "Other services",
};

const DICT: Partial<Record<string, ServiceUi>> = {
  en: EN,
  vi: {
    highlights: "Điểm nổi bật",
    gallery: "Hình ảnh",
    openingHours: "Giờ mở cửa",
    priceNote: "Giá",
    interested: "Quan tâm đến dịch vụ này?",
    interestedBody: "Đội ngũ của chúng tôi sẽ tư vấn hành trình phù hợp trong 24 giờ.",
    otherServices: "Dịch vụ khác",
  },
  ko: {
    highlights: "하이라이트",
    gallery: "갤러리",
    openingHours: "운영 시간",
    priceNote: "요금",
    interested: "이 서비스에 관심이 있으신가요?",
    interestedBody: "저희 팀이 24시간 이내에 맞춤 일정을 제안해 드립니다.",
    otherServices: "다른 서비스",
  },
  ru: {
    highlights: "Главное",
    gallery: "Галерея",
    openingHours: "Часы работы",
    priceNote: "Стоимость",
    interested: "Интересует эта услуга?",
    interestedBody: "Наша команда подготовит для вас программу в течение 24 часов.",
    otherServices: "Другие услуги",
  },
  "zh-CN": {
    highlights: "亮点",
    gallery: "图片",
    openingHours: "营业时间",
    priceNote: "价格",
    interested: "对这项服务感兴趣？",
    interestedBody: "我们的团队将在 24 小时内为您定制行程。",
    otherServices: "其他服务",
  },
};

export function serviceUi(language: Lang | string): ServiceUi {
  return DICT[language] ?? EN;
}
