import imgSuite from "@/assets/gallery/chronos-suite-01.webp";
import imgDining from "@/assets/gallery/chronos-dining-panorama-01.webp";
import imgDeck from "@/assets/gallery/chronos-deck-sunset-02.webp";

export interface Offer {
  id: string;
  nameVi: string;
  nameEn: string;
  badgeVi: string;
  badgeEn: string;
  descVi: string;
  descEn: string;
  hero: string;
  termsVi: string[];
  termsEn: string[];
  highlightsVi: string[];
  highlightsEn: string[];
}

export const offers: Offer[] = [
  {
    id: "early-bird",
    nameVi: "Ưu đãi đặt sớm",
    nameEn: "Early Bird Offer",
    badgeVi: "Giảm 15%",
    badgeEn: "15% off",
    descVi:
      "Đặt phòng trước 45 ngày để nhận mức giá tốt nhất cùng nâng hạng phòng miễn phí khi có phòng trống.",
    descEn:
      "Book 45 days in advance for the best rate and a complimentary room upgrade when available.",
    hero: imgSuite,
    termsVi: [
      "Áp dụng cho hải trình 2N1Đ và 3N2Đ",
      "Đặt trước tối thiểu 45 ngày",
      "Không áp dụng dịp lễ Tết",
      "Nâng hạng phòng tùy tình trạng",
    ],
    termsEn: [
      "Valid for 2D1N and 3D2N voyages",
      "Book at least 45 days ahead",
      "Not valid during Tet and public holidays",
      "Upgrade subject to availability",
    ],
    highlightsVi: ["Giảm 15% giá phòng", "Nâng hạng phòng miễn phí", "Hủy linh hoạt đến 30 ngày"],
    highlightsEn: ["15% off room rate", "Free upgrade", "Flexible cancellation up to 30 days"],
  },
  {
    id: "family",
    nameVi: "Gói gia đình",
    nameEn: "Family Package",
    badgeVi: "Trẻ em miễn phí",
    badgeEn: "Kids stay free",
    descVi:
      "Gói lý tưởng cho gia đình: trẻ em dưới 12 tuổi ở miễn phí, bữa tối BBQ trên boong và hoạt động dành riêng cho các bé.",
    descEn:
      "A family-friendly package: kids under 12 stay free, deck BBQ dinner and dedicated kids' activities.",
    hero: imgDining,
    termsVi: [
      "Tối thiểu 2 người lớn + 1 trẻ em",
      "Trẻ em dưới 12 tuổi ở cùng phòng miễn phí",
      "BBQ boong áp dụng cho hải trình 3N2Đ",
      "Đặt trước 14 ngày",
    ],
    termsEn: [
      "Minimum 2 adults + 1 child",
      "Kids under 12 stay free in same cabin",
      "Deck BBQ valid for 3D2N voyages",
      "Book at least 14 days ahead",
    ],
    highlightsVi: [
      "Trẻ em dưới 12 tuổi miễn phí",
      "Bữa tối BBQ trên boong",
      "Khu vui chơi & trông trẻ",
    ],
    highlightsEn: [
      "Kids under 12 stay free",
      "Deck BBQ dinner",
      "Kids' club & supervised play",
    ],
  },
  {
    id: "honeymoon",
    nameVi: "Gói trăng mật",
    nameEn: "Honeymoon Package",
    badgeVi: "Quà tặng",
    badgeEn: "Perks included",
    descVi:
      "Gói dành cho cặp đôi: trang trí phòng, bữa tối riêng, massage đôi và champagne chào đón.",
    descEn:
      "Designed for couples: cabin decoration, private dinner, couple's massage and welcome champagne.",
    hero: imgDeck,
    termsVi: [
      "Áp dụng cho Owner's Suite hoặc Grand Suite",
      "Tối thiểu 2 ngày 1 đêm",
      "Đặt trước 7 ngày",
      "Xuất trình giấy đăng ký kết hôn trong 12 tháng",
    ],
    termsEn: [
      "Valid for Owner's Suite or Grand Suite",
      "Minimum 2 days / 1 night",
      "Book at least 7 days ahead",
      "Marriage certificate within 12 months",
    ],
    highlightsVi: [
      "Trang trí phòng hoa hồng",
      "Bữa tối riêng trên ban công",
      "Massage đôi 60 phút",
      "Champagne welcome",
    ],
    highlightsEn: [
      "Rose petal cabin decoration",
      "Private balcony dinner",
      "60-minute couple's massage",
      "Welcome champagne",
    ],
  },
];
