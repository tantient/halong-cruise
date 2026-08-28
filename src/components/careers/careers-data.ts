import type { Lang } from "@/lib/translations";
import heroImg from "@/assets/gallery/chronos-exterior-01.webp";

export interface JobPosition {
  id: string;
  titleVi: string;
  titleEn: string;
  departmentVi: string;
  departmentEn: string;
  typeVi: string;
  typeEn: string;
  descVi: string;
  descEn: string;
}

export const ZALO_PHONE = "0979768969";
export const RECRUIT_EMAIL = "hr@chronoscruise.com";
export const CAREER_HERO = heroImg;

export const jobPositions: JobPosition[] = [
  {
    id: "housekeeping",
    titleVi: "Nhân viên buồng phòng",
    titleEn: "Housekeeping Steward",
    departmentVi: "Vận hành phòng",
    departmentEn: "Housekeeping",
    typeVi: "Toàn thời gian",
    typeEn: "Full-time",
    descVi: "Đảm bảo vệ sinh, sắp xếp và chuẩn bị các suite theo tiêu chuẩn 6 sao của Chronos.",
    descEn: "Maintain cleanliness, order, and preparation of suites to Chronos's six-star standards.",
  },
  {
    id: "fb-server",
    titleVi: "Nhân viên nhà hàng",
    titleEn: "F&B Server",
    departmentVi: "Ẩm thực & Đồ uống",
    departmentEn: "Food & Beverage",
    typeVi: "Toàn thời gian",
    typeEn: "Full-time",
    descVi: "Phục vụ bữa ăn fine-dining, đồ uống và sự kiện riêng với phong cách chuyên nghiệp.",
    descEn: "Serve fine-dining meals, beverages, and private events with a professional manner.",
  },
  {
    id: "receptionist",
    titleVi: "Lễ tân",
    titleEn: "Receptionist",
    departmentVi: "Lễ tân",
    departmentEn: "Front Office",
    typeVi: "Toàn thời gian",
    typeEn: "Full-time",
    descVi: "Đón tiếp khách, hỗ trợ check-in/out và giải đáp thắc mắc trong suốt hải trình.",
    descEn: "Greet guests, assist check-in/out, and answer inquiries throughout the voyage.",
  },
  {
    id: "cruise-guide",
    titleVi: "Hướng dẫn viên du lịch",
    titleEn: "Cruise Guide",
    departmentVi: "Trải nghiệm khách",
    departmentEn: "Guest Experience",
    typeVi: "Toàn thời gian",
    typeEn: "Full-time",
    descVi: "Dẫn chương trình tham quan, giới thiệu văn hóa địa phương và đảm bảo an toàn cho khách.",
    descEn: "Lead excursions, introduce local culture, and ensure guest safety during activities.",
  },
];

export function buildZaloLink(phone: string): string {
  return `https://zalo.me/${phone}`;
}

export function buildEmailLink(email: string, lang: Lang = "en"): string {
  const subject = lang === "vi" ? "Ứng tuyển Chronos" : "Application to Chronos";
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
