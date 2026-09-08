/**
 * Generic UI labels for the itineraries template. Brand/editorial copy lives in
 * the database (`ship_pages`, `itineraries`); only reusable interface words
 * belong here so every ship on the platform shares them.
 */

import type { Lang } from "@/lib/translations";

export interface ItineraryUi {
  duration: string;
  includes: string;
  excludes: string;
  highlights: string;
  timeline: string;
  showTimeline: string;
  collapse: string;
}

const EN: ItineraryUi = {
  duration: "Duration",
  includes: "Includes",
  excludes: "Excludes",
  highlights: "Highlights",
  timeline: "Timeline",
  showTimeline: "Detailed timeline",
  collapse: "Collapse",
};

const DICT: Partial<Record<string, ItineraryUi>> = {
  en: EN,
  vi: {
    duration: "Thời lượng",
    includes: "Bao gồm",
    excludes: "Không bao gồm",
    highlights: "Điểm nhấn",
    timeline: "Lịch trình",
    showTimeline: "Lịch trình chi tiết",
    collapse: "Thu gọn",
  },
  ko: {
    duration: "소요 시간",
    includes: "포함 사항",
    excludes: "불포함 사항",
    highlights: "하이라이트",
    timeline: "일정",
    showTimeline: "상세 일정",
    collapse: "접기",
  },
  ru: {
    duration: "Продолжительность",
    includes: "Включено",
    excludes: "Не включено",
    highlights: "Главное",
    timeline: "Расписание",
    showTimeline: "Подробное расписание",
    collapse: "Свернуть",
  },
  "zh-CN": {
    duration: "时长",
    includes: "包含",
    excludes: "不包含",
    highlights: "亮点",
    timeline: "行程",
    showTimeline: "详细行程",
    collapse: "收起",
  },
};

export function itineraryUi(lang: Lang): ItineraryUi {
  return DICT[lang] ?? EN;
}
