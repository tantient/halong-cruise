import imgExterior1 from "@/assets/gallery/chronos-exterior-01.webp";
import imgExterior2 from "@/assets/gallery/chronos-exterior-02.webp";
import imgDeck from "@/assets/gallery/chronos-deck-sunset-01.webp";
import imgDining from "@/assets/gallery/chronos-dining-panorama-01.webp";
import imgSpa from "@/assets/gallery/chronos-spa-room-01.webp";
import imgCabin from "@/assets/gallery/chronos-suite-01.webp";

export interface Itinerary {
  id: string;
  nameVi: string;
  nameEn: string;
  durationVi: string;
  durationEn: string;
  descVi: string;
  descEn: string;
  hero: string;
  images: string[];
  includesVi: string[];
  includesEn: string[];
  excludesVi: string[];
  excludesEn: string[];
  highlightsVi: string[];
  highlightsEn: string[];
  timelineVi: { time: string; label: string }[];
  timelineEn: { time: string; label: string }[];
}

export const itineraries: Itinerary[] = [
  {
    id: "2d1n-ha-long",
    nameVi: "Hạ Long 2 ngày 1 đêm",
    nameEn: "Ha Long 2-Day / 1-Night",
    durationVi: "2 ngày 1 đêm",
    durationEn: "2 days / 1 night",
    descVi:
      "Hành trình giới thiệu đầy đủ về Chronos: chiêm ngưỡng vịnh Hạ Long từ boong tàu, tham quan hang động và ăn tối dưới ánh nến giữa vịnh.",
    descEn:
      "A complete introduction to Chronos: take in Ha Long Bay from the decks, explore a cave and enjoy dinner by candlelight on the water.",
    hero: imgExterior1,
    images: [imgDining, imgCabin, imgDeck],
    includesVi: [
      "1 đêm phòng hướng vịnh",
      "Các bữa ăn chính trên tàu",
      "Thuyền tham quan hang động",
      "Hoạt động chèo thuyền kayak",
      "Trà chiều & welcome drink",
    ],
    includesEn: [
      "1 night in a bay-view cabin",
      "All main meals aboard",
      "Cave excursion by tender",
      "Kayaking activity",
      "Afternoon tea & welcome drink",
    ],
    excludesVi: [
      "Đồ uống có cồn",
      "Spa & trị liệu",
      "Vé máy bay / xe đưa đón",
      "Tip cho nhân viên",
    ],
    excludesEn: [
      "Alcoholic beverages",
      "Spa & treatments",
      "Flights / transfers",
      "Gratuities",
    ],
    highlightsVi: [
      "Ngắm hoàng hôn trên sundeck",
      "Thăm hang Sửng Sốt hoặc Thiên Cung",
      "Bữa tối fine-dining",
      "Chèo kayak buổi sáng",
    ],
    highlightsEn: [
      "Sunset viewing on the sundeck",
      "Visit Sung Sot or Thien Cung cave",
      "Fine-dining dinner",
      "Morning kayaking",
    ],
    timelineVi: [
      { time: "12:00", label: "Đón khách tại cảng, welcome drink & nhận phòng" },
      { time: "13:00", label: "Bữa trưa trong khi tàu di chuyển vào vịnh" },
      { time: "15:30", label: "Thăm hang động và chèo kayak" },
      { time: "18:00", label: "Hoàng hôn & đồ uống trên sundeck" },
      { time: "19:30", label: "Bữa tối fine-dining" },
      { time: "06:30", label: "Ngày 2: yoga & bữa sáng trên tàu" },
      { time: "09:30", label: "Trả phòng, tàu quay về cảng" },
    ],
    timelineEn: [
      { time: "12:00", label: "Embarkation, welcome drink & cabin check-in" },
      { time: "13:00", label: "Lunch while cruising into the bay" },
      { time: "15:30", label: "Cave visit and kayaking" },
      { time: "18:00", label: "Sundeck sunset & drinks" },
      { time: "19:30", label: "Fine-dining dinner" },
      { time: "06:30", label: "Day 2: yoga & breakfast aboard" },
      { time: "09:30", label: "Disembarkation and return to port" },
    ],
  },
  {
    id: "3d2n-ha-long-lan-ha",
    nameVi: "Hạ Long - Lan Hạ 3 ngày 2 đêm",
    nameEn: "Ha Long - Lan Ha 3-Day / 2-Night",
    durationVi: "3 ngày 2 đêm",
    durationEn: "3 days / 2 nights",
    descVi:
      "Hành trình sâu hơn, kết hợp vịnh Hạ Long và Lan Hạ yên tĩnh với hoạt động tắm biển, đạp xe đảo nhỏ và tắm hoàng hôn.",
    descEn:
      "A deeper journey combining Ha Long Bay with the quieter Lan Ha Bay, including beach swimming, light cycling on a small island and sunset bathing.",
    hero: imgExterior2,
    images: [imgDeck, imgSpa, imgCabin],
    includesVi: [
      "2 đêm phòng hướng vịnh",
      "Tất cả bữa ăn chính",
      "Thuyền tham quan hang & đảo",
      "Xe đạp đảo nhỏ",
      "1 buổi spa foot ritual 30 phút",
    ],
    includesEn: [
      "2 nights in a bay-view cabin",
      "All main meals",
      "Tender to caves & islands",
      "Island cycling",
      "30-minute spa foot ritual",
    ],
    excludesVi: [
      "Đồ uống có cồn",
      "Liệu trình spa dài",
      "Vé máy bay / xe đưa đón",
      "Tip",
    ],
    excludesEn: [
      "Alcoholic beverages",
      "Extended spa treatments",
      "Flights / transfers",
      "Gratuities",
    ],
    highlightsVi: [
      "Khám phá Lan Hạ ít khách du lịch",
      "Tắm biển bãi cát riêng",
      "Đạp xe đảo Cat Ba",
      "Massage chân thảo dược",
    ],
    highlightsEn: [
      "Explore less-visited Lan Ha Bay",
      "Swim at a private beach",
      "Cycle on Cat Ba island",
      "Herbal foot massage",
    ],
    timelineVi: [
      { time: "12:00", label: "Ngày 1: nhận phòng, ăn trưa, thăm hang & hoàng hôn" },
      { time: "06:30", label: "Ngày 2: yoga, bữa sáng, di chuyển sang Lan Hạ" },
      { time: "10:00", label: "Tắm biển & chèo kayak vùng nước trong" },
      { time: "14:00", label: "Đạp xe đảo nhỏ, giao lưu làng chài" },
      { time: "18:00", label: "Hoàng hôn trên boong, bữa tối BBQ" },
      { time: "08:30", label: "Ngày 3: spa foot ritual, brunch, trả phòng" },
    ],
    timelineEn: [
      { time: "12:00", label: "Day 1: check-in, lunch, cave visit & sunset" },
      { time: "06:30", label: "Day 2: yoga, breakfast, cruise to Lan Ha Bay" },
      { time: "10:00", label: "Swimming & kayaking in clear water" },
      { time: "14:00", label: "Island cycling & fishing village visit" },
      { time: "18:00", label: "Deck sunset & BBQ dinner" },
      { time: "08:30", label: "Day 3: spa foot ritual, brunch, disembarkation" },
    ],
  },
  {
    id: "sunset-cruise",
    nameVi: "Du thuyền hoàng hôn",
    nameEn: "Sunset Cruise",
    durationVi: "4 giờ",
    durationEn: "4 hours",
    descVi:
      "Chuyến đi ngắn chiều tối để ngắm hoàng hôn, thưởng thức cocktail và điểm tâm nhẹ giữa vịnh Hạ Long.",
    descEn:
      "A short evening escape to watch the sunset, sip cocktails and enjoy light bites in the heart of Ha Long Bay.",
    hero: imgDeck,
    images: [imgExterior1, imgDining],
    includesVi: [
      "Welcome drink & cocktail hoàng hôn",
      "Điểm tâm nhẹ",
      "Nhạc acoustic trên sundeck",
      "Thuyền tham quan ngắm cảnh",
    ],
    includesEn: [
      "Welcome drink & sunset cocktail",
      "Light bites",
      "Acoustic music on the sundeck",
      "Scenic tender ride",
    ],
    excludesVi: [
      "Phòng nghỉ qua đêm",
      "Bữa ăn chính",
      "Đưa đón",
    ],
    excludesEn: [
      "Overnight cabin",
      "Main meals",
      "Transfers",
    ],
    highlightsVi: [
      "Hoàng hôn toàn cảnh trên sundeck",
      "Cocktail chào đón",
      "Nhạc acoustic",
      "Phù hợp cho nhóm bạn & cặp đôi",
    ],
    highlightsEn: [
      "Panoramic sunset from the sundeck",
      "Welcome cocktail",
      "Acoustic music",
      "Perfect for friends & couples",
    ],
    timelineVi: [
      { time: "16:30", label: "Lên tàu, welcome drink & nhạc nhẹ" },
      { time: "17:30", label: "Tàu di chuyển qua các đảo đá vôi" },
      { time: "18:15", label: "Hoàng hôn, cocktail & điểm tâm" },
      { time: "19:00", label: "Nhạc acoustic, thuyền quay về cảng" },
    ],
    timelineEn: [
      { time: "16:30", label: "Boarding, welcome drink & music" },
      { time: "17:30", label: "Cruise among limestone islands" },
      { time: "18:15", label: "Sunset, cocktail & light bites" },
      { time: "19:00", label: "Acoustic music, return to port" },
    ],
  },
];
