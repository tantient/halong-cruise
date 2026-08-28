import suite01 from "@/assets/gallery/chronos-suite-01.webp";
import suite02 from "@/assets/gallery/chronos-suite-02.webp";
import suite03 from "@/assets/gallery/chronos-suite-03.webp";
import deluxe01 from "@/assets/gallery/chronos-deluxe-01.webp";
import deluxe02 from "@/assets/gallery/chronos-deluxe-02.webp";
import standard01 from "@/assets/gallery/chronos-standard-01.webp";
import standard02 from "@/assets/gallery/chronos-standard-02.webp";
import standard03 from "@/assets/gallery/chronos-standard-03.webp";
import standard04 from "@/assets/gallery/chronos-standard-04.webp";
import bath01 from "@/assets/gallery/chronos-bath-01.webp";
import bath02 from "@/assets/gallery/chronos-bath-02.webp";
import corridor from "@/assets/gallery/chronos-corridor.webp";

export const TOTAL_CABINS = 44;

export const AREA_LABEL_VI = "TỔNG DIỆN TÍCH RIÊNG";
export const AREA_LABEL_EN = "TOTAL PRIVATE AREA";
export const AREA_NOTE_VI =
  "Diện tích công bố là tổng diện tích riêng của suite, bao gồm không gian trong nhà và khu vực ngoài trời riêng.";
export const AREA_NOTE_EN =
  "Area shown is the total private area, including indoor accommodation and private outdoor space.";

export interface CabinType {
  id: string;
  /** Mã kỹ thuật (chỉ áp dụng cho các hạng VIP) */
  code?: string;
  /** Hạng VIP: diện tích công bố là tổng diện tích riêng */
  vip?: boolean;
  nameVi: string;
  nameEn: string;
  descVi: string;
  descEn: string;
  area: string;
  view: string;
  /** Số phòng thuộc hạng này trên tàu */
  roomCount: number;
  /** Sức chứa tối đa (khách) */
  maxGuests: number;
  bedVi: string;
  bedEn: string;
  hero: string;
  gallery: string[];
  amenitiesVi: string[];
  amenitiesEn: string[];
}

const BED_VI = "1 giường đôi hoặc 2 giường đơn";
const BED_EN = "1 double bed or 2 twin beds";

export const cabinTypes: CabinType[] = [
  {
    id: "owners-suite",
    code: "Type 1.1A/1.1B",
    vip: true,
    nameVi: "Owner's Suite",
    nameEn: "Owner's Suite",
    descVi:
      "Không gian nghỉ dưỡng kết hợp phòng ngủ, khu tiếp khách, sân riêng lớn phía đuôi tàu và hồ sục ngoài trời.",
    descEn:
      "Combining an elegant bedroom and lounge with an expansive private aft terrace and outdoor whirlpool.",
    area: "80 m²",
    view: "Panorama 180°",
    roomCount: 2,
    maxGuests: 4,
    bedVi: BED_VI,
    bedEn: BED_EN,
    hero: suite01,
    gallery: [suite02, bath02],
    amenitiesVi: [
      "Giường King",
      "Phòng ngủ và khu tiếp khách",
      "Sân riêng lớn phía đuôi tàu",
      "Hồ sục ngoài trời",
      "Tầm nhìn panorama ra vịnh",
    ],
    amenitiesEn: [
      "King bed",
      "Bedroom and lounge",
      "Expansive private aft terrace",
      "Outdoor whirlpool",
      "Panoramic bay views",
    ],
  },
  {
    id: "grand-suite",
    code: "Type 1A/1B",
    vip: true,
    nameVi: "Grand Suite",
    nameEn: "Grand Suite",
    descVi:
      "Phòng ngủ sang trọng với khu tiếp khách, sân riêng phía đuôi tàu và hồ sục ngoài trời.",
    descEn:
      "Featuring a refined bedroom and lounge, a private aft terrace, and an outdoor whirlpool.",
    area: "62 m²",
    view: "Hướng vịnh / Bay view",
    roomCount: 2,
    maxGuests: 4,
    bedVi: BED_VI,
    bedEn: BED_EN,
    hero: suite03,
    gallery: [suite02, bath02],
    amenitiesVi: [
      "Giường King",
      "Phòng ngủ và khu tiếp khách",
      "Sân riêng phía đuôi tàu",
      "Hồ sục ngoài trời",
      "Tầm nhìn panorama ra vịnh",
    ],
    amenitiesEn: [
      "King bed",
      "Bedroom and seating area",
      "Private aft terrace",
      "Outdoor whirlpool",
      "Panoramic bay views",
    ],
  },
  {
    id: "grand-suite-corner",
    code: "Type 1.2A/1.2B",
    vip: true,
    nameVi: "Grand Suite",
    nameEn: "Grand Suite",
    descVi:
      "Không gian nghỉ dưỡng riêng tư tại góc tàu, gồm phòng ngủ, khu tiếp khách, sân riêng và hồ sục ngoài trời.",
    descEn:
      "A private corner retreat featuring a comfortable bedroom and lounge, an aft terrace, and an outdoor whirlpool.",
    area: "58 m²",
    view: "Hướng vịnh / Bay view",
    roomCount: 2,
    maxGuests: 4,
    bedVi: BED_VI,
    bedEn: BED_EN,
    hero: suite02,
    gallery: [suite03, bath02],
    amenitiesVi: [
      "Giường King",
      "Phòng ngủ và khu tiếp khách",
      "Sân riêng tại góc tàu",
      "Hồ sục ngoài trời",
      "Tầm nhìn panorama ra vịnh",
    ],
    amenitiesEn: [
      "King bed",
      "Bedroom and seating area",
      "Private corner terrace",
      "Outdoor whirlpool",
      "Panoramic bay views",
    ],
  },
  {
    id: "junior-suite-a",
    nameVi: "Junior Suite (loại A)",
    nameEn: "Junior Suite (type A)",
    descVi:
      "Bố cục mở với vách kính lớn hướng biển, tông gỗ ấm và ánh sáng dịu. Phù hợp cho gia đình nhỏ hoặc nhóm bạn trong hành trình 2–3 ngày.",
    descEn:
      "An open layout with a large sea-facing window, warm timber tones and soft lighting. Ideal for small families or groups of friends on two- to three-day voyages.",
    area: "30 – 33 m²",
    view: "Hướng biển / Sea view",
    roomCount: 13,
    maxGuests: 4,
    bedVi: BED_VI,
    bedEn: BED_EN,
    hero: deluxe01,
    gallery: [deluxe02, bath01],
    amenitiesVi: [
      "Cửa sổ lớn hướng biển",
      "Góc làm việc riêng",
      "Vòi sen áp lực cao",
      "Smart TV & loa bluetooth",
    ],
    amenitiesEn: [
      "Large sea-facing window",
      "Dedicated work nook",
      "Rain shower",
      "Smart TV & bluetooth speaker",
    ],
  },
  {
    id: "junior-suite-b",
    nameVi: "Junior Suite (loại B)",
    nameEn: "Junior Suite (type B)",
    descVi:
      "Thiết kế tối giản, tận dụng tối đa ánh sáng tự nhiên với đầy đủ tiện nghi tiêu chuẩn Chronos. Lựa chọn phổ biến nhất trên tàu.",
    descEn:
      "A minimal design that makes the most of natural light, with the full set of Chronos standard amenities. The most common cabin aboard.",
    area: "30 – 35 m²",
    view: "Hướng biển / Sea view",
    roomCount: 25,
    maxGuests: 3,
    bedVi: BED_VI,
    bedEn: BED_EN,
    hero: standard01,
    gallery: [standard02, standard03, standard04, corridor],
    amenitiesVi: [
      "Cửa sổ hướng biển",
      "Smart TV & loa bluetooth",
      "Vòi sen áp lực cao",
      "Két an toàn điện tử",
    ],
    amenitiesEn: [
      "Sea-facing window",
      "Smart TV & bluetooth speaker",
      "Rain shower",
      "Electronic safe",
    ],
  },
];

export interface LayoutZone {
  labelVi: string;
  labelEn: string;
  /** Toạ độ % trong sơ đồ bố trí */
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CabinDetail {
  capacityVi: string;
  capacityEn: string;
  bedVi: string;
  bedEn: string;
  deckVi: string;
  deckEn: string;
  highlightsVi: string[];
  highlightsEn: string[];
  layout: LayoutZone[];
}

export const cabinDetails: Record<string, CabinDetail> = {
  "owners-suite": {
    capacityVi: "Tối đa 4 khách",
    capacityEn: "Up to 4 guests",
    bedVi: BED_VI,
    bedEn: BED_EN,
    deckVi: "Phía đuôi tàu – khu vực riêng tư",
    deckEn: "Aft – private wing",
    highlightsVi: [
      "Phòng ngủ và khu tiếp khách tách biệt, phù hợp nghỉ ngơi lẫn tiếp khách.",
      "Sân riêng lớn phía đuôi tàu với hồ sục ngoài trời.",
      "Tầm nhìn panorama ra vịnh suốt cả ngày.",
    ],
    highlightsEn: [
      "A bedroom and lounge set apart, suited to both resting and hosting.",
      "An expansive private aft terrace with an outdoor whirlpool.",
      "Panoramic bay views throughout the day.",
    ],
    layout: [
      { labelVi: "Sân riêng & hồ sục", labelEn: "Private aft terrace & whirlpool", x: 2, y: 2, w: 96, h: 22 },
      { labelVi: "Khu tiếp khách", labelEn: "Lounge", x: 2, y: 26, w: 54, h: 38 },
      { labelVi: "Phòng ngủ", labelEn: "Bedroom", x: 58, y: 26, w: 40, h: 38 },
      { labelVi: "Phòng tắm", labelEn: "Bathroom", x: 2, y: 68, w: 40, h: 30 },
      { labelVi: "Tủ đồ & lối vào", labelEn: "Wardrobe & entry", x: 44, y: 68, w: 54, h: 30 },
    ],
  },
  "grand-suite": {
    capacityVi: "Tối đa 4 khách",
    capacityEn: "Up to 4 guests",
    bedVi: BED_VI,
    bedEn: BED_EN,
    deckVi: "Phía đuôi tàu – hướng vịnh",
    deckEn: "Aft – bay facing",
    highlightsVi: [
      "Phòng ngủ và khu tiếp khách liền mạch, mở thẳng ra sân riêng.",
      "Sân riêng phía đuôi tàu với hồ sục ngoài trời.",
      "Tầm nhìn panorama ra vịnh từ trong phòng và ngoài sân.",
    ],
    highlightsEn: [
      "A bedroom and seating area flowing straight onto the private terrace.",
      "Private aft terrace with an outdoor whirlpool.",
      "Panoramic bay views from both indoors and the terrace.",
    ],
    layout: [
      { labelVi: "Sân riêng & hồ sục", labelEn: "Private terrace & whirlpool", x: 2, y: 2, w: 96, h: 24 },
      { labelVi: "Khu ngủ", labelEn: "Sleeping area", x: 2, y: 30, w: 60, h: 38 },
      { labelVi: "Khu tiếp khách", labelEn: "Seating area", x: 64, y: 30, w: 34, h: 38 },
      { labelVi: "Phòng tắm", labelEn: "Bathroom", x: 2, y: 72, w: 46, h: 26 },
      { labelVi: "Lối vào", labelEn: "Entry", x: 50, y: 72, w: 48, h: 26 },
    ],
  },
  "grand-suite-corner": {
    capacityVi: "Tối đa 4 khách",
    capacityEn: "Up to 4 guests",
    bedVi: BED_VI,
    bedEn: BED_EN,
    deckVi: "Góc tàu – hướng vịnh",
    deckEn: "Corner position – bay facing",
    highlightsVi: [
      "Vị trí góc tàu mang lại sự riêng tư và tầm nhìn hai hướng.",
      "Sân riêng với hồ sục ngoài trời.",
      "Phòng ngủ liền khu tiếp khách, bố cục thoáng và ấm cúng.",
    ],
    highlightsEn: [
      "A corner position offering privacy and dual-aspect views.",
      "Private terrace with an outdoor whirlpool.",
      "Bedroom adjoining a seating area in an open, intimate layout.",
    ],
    layout: [
      { labelVi: "Sân riêng & hồ sục", labelEn: "Private terrace & whirlpool", x: 2, y: 2, w: 96, h: 22 },
      { labelVi: "Khu ngủ", labelEn: "Sleeping area", x: 2, y: 28, w: 58, h: 40 },
      { labelVi: "Khu tiếp khách", labelEn: "Seating area", x: 62, y: 28, w: 36, h: 40 },
      { labelVi: "Phòng tắm", labelEn: "Bathroom", x: 2, y: 72, w: 46, h: 26 },
      { labelVi: "Lối vào", labelEn: "Entry", x: 50, y: 72, w: 48, h: 26 },
    ],
  },
  "junior-suite-a": {
    capacityVi: "Tối đa 4 khách",
    capacityEn: "Up to 4 guests",
    bedVi: BED_VI,
    bedEn: BED_EN,
    deckVi: "Hướng biển",
    deckEn: "Sea facing",
    highlightsVi: [
      "Cửa sổ lớn hướng biển ngay cạnh khu ngủ.",
      "Góc làm việc riêng bên cửa sổ, đủ yên tĩnh cho một buổi sáng dài.",
      "Bố cục mở, tối ưu diện tích cho gia đình nhỏ.",
    ],
    highlightsEn: [
      "A large sea-facing window right beside the sleeping area.",
      "A dedicated work nook by the window, quiet enough for a long morning.",
      "An open layout that makes the most of the space for small families.",
    ],
    layout: [
      { labelVi: "Cửa sổ hướng biển", labelEn: "Sea-view window", x: 2, y: 2, w: 96, h: 12 },
      { labelVi: "Khu ngủ", labelEn: "Sleeping area", x: 2, y: 18, w: 62, h: 48 },
      { labelVi: "Góc làm việc", labelEn: "Work nook", x: 66, y: 18, w: 32, h: 48 },
      { labelVi: "Phòng tắm", labelEn: "Bathroom", x: 2, y: 70, w: 44, h: 28 },
      { labelVi: "Tủ đồ & lối vào", labelEn: "Wardrobe & entry", x: 48, y: 70, w: 50, h: 28 },
    ],
  },
  "junior-suite-b": {
    capacityVi: "Tối đa 3 khách",
    capacityEn: "Up to 3 guests",
    bedVi: BED_VI,
    bedEn: BED_EN,
    deckVi: "Hướng biển",
    deckEn: "Sea facing",
    highlightsVi: [
      "Thiết kế tối giản, tối ưu ánh sáng tự nhiên suốt cả ngày.",
      "Cửa sổ lớn hướng biển ngay cạnh đầu giường.",
      "Đầy đủ tiện nghi cho khách lẻ và nhóm bạn đi cùng nhau.",
    ],
    highlightsEn: [
      "A minimal design that maximises natural light all day long.",
      "A large sea-facing window right beside the bed.",
      "Fully equipped for solo travellers and groups of friends.",
    ],
    layout: [
      { labelVi: "Cửa sổ hướng biển", labelEn: "Sea-view window", x: 2, y: 2, w: 96, h: 12 },
      { labelVi: "Khu ngủ", labelEn: "Sleeping area", x: 2, y: 18, w: 96, h: 48 },
      { labelVi: "Phòng tắm", labelEn: "Bathroom", x: 2, y: 70, w: 44, h: 28 },
      { labelVi: "Tủ đồ & lối vào", labelEn: "Wardrobe & entry", x: 48, y: 70, w: 50, h: 28 },
    ],
  },
};
