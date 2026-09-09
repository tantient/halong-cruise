/**
 * Generic UI labels for the voyages template. Brand/editorial copy lives in the
 * database (`ship_pages`, `itineraries`); only reusable interface words belong
 * here so every ship on the platform shares them.
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
  /** Voyages experience. */
  destination: string;
  days: string;
  nights: string;
  dayOne: string;
  nightOne: string;
  departure: string;
  exploreVoyage: string;
  compareTitle: string;
  whatsDifferent: string;
  journeyOverview: string;
  dayByDay: string;
  day: string;
  chooseCabinTitle: string;
  chooseCabinBody: string;
  exploreCabins: string;
  requestJourneyTitle: string;
  requestJourney: string;
  journeyStartsTitle: string;
  requestAdvice: string;
  backToVoyages: string;
}

const EN: ItineraryUi = {
  duration: "Duration",
  includes: "Includes",
  excludes: "Excludes",
  highlights: "Highlights",
  timeline: "Timeline",
  showTimeline: "Detailed timeline",
  collapse: "Collapse",
  destination: "Destination",
  days: "Days",
  nights: "Nights",
  dayOne: "Day",
  nightOne: "Night",
  departure: "Departure",
  exploreVoyage: "Explore voyage",
  compareTitle: "Compare the voyages",
  whatsDifferent: "What's different",
  journeyOverview: "Journey overview",
  dayByDay: "Day by day",
  day: "Day",
  chooseCabinTitle: "Choose your cabin",
  chooseCabinBody: "Every cabin aboard is turned toward the water. Find the space that fits your journey.",
  exploreCabins: "Explore cabins",
  requestJourneyTitle: "Request your journey",
  requestJourney: "Request your journey",
  journeyStartsTitle: "Your journey starts here",
  requestAdvice: "Request advice",
  backToVoyages: "All voyages",
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
    destination: "Vùng hành trình",
    days: "Ngày",
    nights: "Đêm",
    dayOne: "Ngày",
    nightOne: "Đêm",
    departure: "Điểm khởi hành",
    exploreVoyage: "Xem hành trình",
    compareTitle: "So sánh hai hành trình",
    whatsDifferent: "Khác nhau ở đâu",
    journeyOverview: "Tổng quan hành trình",
    dayByDay: "Từng ngày",
    day: "Ngày",
    chooseCabinTitle: "Chọn phòng của bạn",
    chooseCabinBody: "Mọi phòng trên tàu đều hướng ra mặt nước. Chọn không gian phù hợp với hành trình của bạn.",
    exploreCabins: "Xem phòng nghỉ",
    requestJourneyTitle: "Đăng ký hành trình",
    requestJourney: "Đăng ký hành trình",
    journeyStartsTitle: "Hành trình của bạn bắt đầu từ đây",
    requestAdvice: "Nhận tư vấn",
    backToVoyages: "Tất cả hành trình",
  },
  ko: {
    duration: "소요 시간",
    includes: "포함 사항",
    excludes: "불포함 사항",
    highlights: "하이라이트",
    timeline: "일정",
    showTimeline: "상세 일정",
    collapse: "접기",
    destination: "여행 지역",
    days: "일",
    nights: "박",
    dayOne: "일",
    nightOne: "박",
    departure: "출발지",
    exploreVoyage: "항해 보기",
    compareTitle: "항해 비교",
    whatsDifferent: "차이점",
    journeyOverview: "항해 개요",
    dayByDay: "일자별 일정",
    day: "일차",
    chooseCabinTitle: "객실 선택",
    chooseCabinBody: "모든 객실은 바다를 향합니다. 여행에 맞는 공간을 찾아보세요.",
    exploreCabins: "객실 보기",
    requestJourneyTitle: "여행 문의",
    requestJourney: "여행 문의",
    journeyStartsTitle: "여행은 여기에서 시작됩니다",
    requestAdvice: "상담 요청",
    backToVoyages: "전체 항해",
  },
  ru: {
    duration: "Продолжительность",
    includes: "Включено",
    excludes: "Не включено",
    highlights: "Главное",
    timeline: "Расписание",
    showTimeline: "Подробное расписание",
    collapse: "Свернуть",
    destination: "Регион маршрута",
    days: "Дней",
    nights: "Ночей",
    dayOne: "День",
    nightOne: "Ночь",
    departure: "Место отправления",
    exploreVoyage: "Смотреть маршрут",
    compareTitle: "Сравнить маршруты",
    whatsDifferent: "В чём разница",
    journeyOverview: "О маршруте",
    dayByDay: "По дням",
    day: "День",
    chooseCabinTitle: "Выберите каюту",
    chooseCabinBody: "Каждая каюта обращена к воде. Выберите пространство под ваш маршрут.",
    exploreCabins: "Смотреть каюты",
    requestJourneyTitle: "Запросить маршрут",
    requestJourney: "Запросить маршрут",
    journeyStartsTitle: "Ваше путешествие начинается здесь",
    requestAdvice: "Получить консультацию",
    backToVoyages: "Все маршруты",
  },
  "zh-CN": {
    duration: "时长",
    includes: "包含",
    excludes: "不包含",
    highlights: "亮点",
    timeline: "行程",
    showTimeline: "详细行程",
    collapse: "收起",
    destination: "航行区域",
    days: "天",
    nights: "晚",
    dayOne: "天",
    nightOne: "晚",
    departure: "出发地",
    exploreVoyage: "查看航程",
    compareTitle: "航程对比",
    whatsDifferent: "区别在哪里",
    journeyOverview: "航程概览",
    dayByDay: "每日行程",
    day: "第",
    chooseCabinTitle: "选择您的客房",
    chooseCabinBody: "船上每间客房都面向水面，选择适合此次航程的空间。",
    exploreCabins: "查看客房",
    requestJourneyTitle: "预约此航程",
    requestJourney: "预约此航程",
    journeyStartsTitle: "旅程从这里开始",
    requestAdvice: "获取建议",
    backToVoyages: "全部航程",
  },
};

export function itineraryUi(lang: Lang): ItineraryUi {
  return DICT[lang] ?? EN;
}
