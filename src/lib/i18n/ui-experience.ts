/**
 * Generic UI labels for the cinematic homepage template. Brand/editorial copy
 * lives in the database (`homepage_sections`, cabins, itineraries, services);
 * only reusable interface words belong here so every ship can use them.
 */

export interface ExperienceUi {
  scroll: string;
  guests: string;
  size: string;
  from: string;
  night: string;
  nights: string;
  day: string;
  days: string;
  suites: string;
  categories: string;
  voyages: string;
  experiences: string;
  viewAll: string;
  next: string;
  previous: string;
}

const EN: ExperienceUi = {
  scroll: "Scroll",
  guests: "Guests",
  size: "Size",
  from: "From",
  night: "night",
  nights: "nights",
  day: "day",
  days: "days",
  suites: "Suites",
  categories: "Categories",
  voyages: "Voyages",
  experiences: "Experiences",
  viewAll: "View all",
  next: "Next",
  previous: "Previous",
};

const DICT: Partial<Record<string, ExperienceUi>> = {
  en: EN,
  vi: {
    scroll: "Cuộn",
    guests: "Số khách",
    size: "Diện tích",
    from: "Từ",
    night: "đêm",
    nights: "đêm",
    day: "ngày",
    days: "ngày",
    suites: "Phòng nghỉ",
    categories: "Hạng phòng",
    voyages: "Hải trình",
    experiences: "Trải nghiệm",
    viewAll: "Xem tất cả",
    next: "Tiếp",
    previous: "Trước",
  },
  ko: {
    scroll: "스크롤",
    guests: "인원",
    size: "면적",
    from: "부터",
    night: "박",
    nights: "박",
    day: "일",
    days: "일",
    suites: "스위트",
    categories: "객실 종류",
    voyages: "항해",
    experiences: "경험",
    viewAll: "전체 보기",
    next: "다음",
    previous: "이전",
  },
  ru: {
    scroll: "Прокрутите",
    guests: "Гостей",
    size: "Площадь",
    from: "От",
    night: "ночь",
    nights: "ночей",
    day: "день",
    days: "дней",
    suites: "Каюты",
    categories: "Категории",
    voyages: "Маршруты",
    experiences: "Впечатления",
    viewAll: "Смотреть все",
    next: "Далее",
    previous: "Назад",
  },
  "zh-CN": {
    scroll: "向下滚动",
    guests: "人数",
    size: "面积",
    from: "起",
    night: "晚",
    nights: "晚",
    day: "天",
    days: "天",
    suites: "客房",
    categories: "房型",
    voyages: "航程",
    experiences: "体验",
    viewAll: "查看全部",
    next: "下一个",
    previous: "上一个",
  },
};

export function experienceUi(lang: string): ExperienceUi {
  return DICT[lang] ?? EN;
}
