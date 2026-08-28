import img0 from "@/assets/gallery/chronos-bath-01.webp";
import img1 from "@/assets/gallery/chronos-bath-02.webp";
import img2 from "@/assets/gallery/chronos-corridor.webp";
import img3 from "@/assets/gallery/chronos-deck-sunset-01.webp";
import img4 from "@/assets/gallery/chronos-deck-sunset-02.webp";
import img5 from "@/assets/gallery/chronos-deck-terrace.webp";
import img6 from "@/assets/gallery/chronos-deluxe-01.webp";
import img7 from "@/assets/gallery/chronos-deluxe-02.webp";
import img8 from "@/assets/gallery/chronos-dining-main-01.webp";
import img9 from "@/assets/gallery/chronos-dining-main-02.webp";
import img10 from "@/assets/gallery/chronos-dining-outdoor-01.webp";
import img11 from "@/assets/gallery/chronos-dining-outdoor-02.webp";
import img12 from "@/assets/gallery/chronos-dining-panorama-01.webp";
import img13 from "@/assets/gallery/chronos-dining-panorama-02.webp";
import img14 from "@/assets/gallery/chronos-ent-business.webp";
import img15 from "@/assets/gallery/chronos-ent-cigar-01.webp";
import img16 from "@/assets/gallery/chronos-ent-cigar-02.webp";
import img17 from "@/assets/gallery/chronos-ent-family-01.webp";
import img18 from "@/assets/gallery/chronos-ent-family-02.webp";
import img19 from "@/assets/gallery/chronos-ent-karaoke-01.webp";
import img20 from "@/assets/gallery/chronos-ent-karaoke-02.webp";
import img21 from "@/assets/gallery/chronos-ent-kids-01.webp";
import img22 from "@/assets/gallery/chronos-ent-kids-02.webp";
import img23 from "@/assets/gallery/chronos-ent-lounge.webp";
import img24 from "@/assets/gallery/chronos-ent-poker-01.webp";
import img25 from "@/assets/gallery/chronos-exterior-01.webp";
import img26 from "@/assets/gallery/chronos-exterior-02.webp";
import img27 from "@/assets/gallery/chronos-exterior-03.webp";
import img28 from "@/assets/gallery/chronos-exterior-04.webp";
import img29 from "@/assets/gallery/chronos-exterior-05.webp";
import img30 from "@/assets/gallery/chronos-exterior-06.webp";
import img31 from "@/assets/gallery/chronos-public-jacuzzi.webp";
import img32 from "@/assets/gallery/chronos-public-lobby-01.webp";
import img33 from "@/assets/gallery/chronos-public-lobby-02.webp";
import img34 from "@/assets/gallery/chronos-public-lounge.webp";
import img35 from "@/assets/gallery/chronos-public-pool.webp";
import img36 from "@/assets/gallery/chronos-public-reception.webp";
import img37 from "@/assets/gallery/chronos-public-spa-reception.webp";
import img38 from "@/assets/gallery/chronos-public-stair.webp";
import img39 from "@/assets/gallery/chronos-spa-foot.webp";
import img40 from "@/assets/gallery/chronos-spa-room-01.webp";
import img41 from "@/assets/gallery/chronos-spa-room-02.webp";
import img42 from "@/assets/gallery/chronos-standard-01.webp";
import img43 from "@/assets/gallery/chronos-standard-02.webp";
import img44 from "@/assets/gallery/chronos-standard-03.webp";
import img45 from "@/assets/gallery/chronos-standard-04.webp";
import img46 from "@/assets/gallery/chronos-suite-01.webp";
import img47 from "@/assets/gallery/chronos-suite-02.webp";
import img48 from "@/assets/gallery/chronos-suite-03.webp";

export type GalleryCategory =
  | "exterior"
  | "public"
  | "dining"
  | "entertainment"
  | "wellness"
  | "deck"
  | "cabins";

export interface GalleryImage {
  id: string;
  src: string;
  category: GalleryCategory;
  titleVi: string;
  titleEn: string;
}

export const galleryImages: GalleryImage[] = [
  { id: "chronos-bath-01", src: img0, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
  { id: "chronos-bath-02", src: img1, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
  { id: "chronos-corridor", src: img2, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
  { id: "chronos-deck-sunset-01", src: img3, category: "deck", titleVi: "Boong & sundeck", titleEn: "Decks & sundeck" },
  { id: "chronos-deck-sunset-02", src: img4, category: "deck", titleVi: "Boong & sundeck", titleEn: "Decks & sundeck" },
  { id: "chronos-deck-terrace", src: img5, category: "deck", titleVi: "Boong & sundeck", titleEn: "Decks & sundeck" },
  { id: "chronos-deluxe-01", src: img6, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
  { id: "chronos-deluxe-02", src: img7, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
  { id: "chronos-dining-main-01", src: img8, category: "dining", titleVi: "Nhà hàng & ẩm thực", titleEn: "Dining" },
  { id: "chronos-dining-main-02", src: img9, category: "dining", titleVi: "Nhà hàng & ẩm thực", titleEn: "Dining" },
  { id: "chronos-dining-outdoor-01", src: img10, category: "dining", titleVi: "Nhà hàng & ẩm thực", titleEn: "Dining" },
  { id: "chronos-dining-outdoor-02", src: img11, category: "dining", titleVi: "Nhà hàng & ẩm thực", titleEn: "Dining" },
  { id: "chronos-dining-panorama-01", src: img12, category: "dining", titleVi: "Nhà hàng & ẩm thực", titleEn: "Dining" },
  { id: "chronos-dining-panorama-02", src: img13, category: "dining", titleVi: "Nhà hàng & ẩm thực", titleEn: "Dining" },
  { id: "chronos-ent-business", src: img14, category: "entertainment", titleVi: "Giải trí", titleEn: "Entertainment" },
  { id: "chronos-ent-cigar-01", src: img15, category: "entertainment", titleVi: "Giải trí", titleEn: "Entertainment" },
  { id: "chronos-ent-cigar-02", src: img16, category: "entertainment", titleVi: "Giải trí", titleEn: "Entertainment" },
  { id: "chronos-ent-family-01", src: img17, category: "entertainment", titleVi: "Giải trí", titleEn: "Entertainment" },
  { id: "chronos-ent-family-02", src: img18, category: "entertainment", titleVi: "Giải trí", titleEn: "Entertainment" },
  { id: "chronos-ent-karaoke-01", src: img19, category: "entertainment", titleVi: "Giải trí", titleEn: "Entertainment" },
  { id: "chronos-ent-karaoke-02", src: img20, category: "entertainment", titleVi: "Giải trí", titleEn: "Entertainment" },
  { id: "chronos-ent-kids-01", src: img21, category: "entertainment", titleVi: "Giải trí", titleEn: "Entertainment" },
  { id: "chronos-ent-kids-02", src: img22, category: "entertainment", titleVi: "Giải trí", titleEn: "Entertainment" },
  { id: "chronos-ent-lounge", src: img23, category: "entertainment", titleVi: "Giải trí", titleEn: "Entertainment" },
  { id: "chronos-ent-poker-01", src: img24, category: "entertainment", titleVi: "Giải trí", titleEn: "Entertainment" },
  { id: "chronos-exterior-01", src: img25, category: "exterior", titleVi: "Ngoại thất du thuyền", titleEn: "Cruise exterior" },
  { id: "chronos-exterior-02", src: img26, category: "exterior", titleVi: "Ngoại thất du thuyền", titleEn: "Cruise exterior" },
  { id: "chronos-exterior-03", src: img27, category: "exterior", titleVi: "Ngoại thất du thuyền", titleEn: "Cruise exterior" },
  { id: "chronos-exterior-04", src: img28, category: "exterior", titleVi: "Ngoại thất du thuyền", titleEn: "Cruise exterior" },
  { id: "chronos-exterior-05", src: img29, category: "exterior", titleVi: "Ngoại thất du thuyền", titleEn: "Cruise exterior" },
  { id: "chronos-exterior-06", src: img30, category: "exterior", titleVi: "Ngoại thất du thuyền", titleEn: "Cruise exterior" },
  { id: "chronos-public-jacuzzi", src: img31, category: "public", titleVi: "Không gian chung", titleEn: "Public spaces" },
  { id: "chronos-public-lobby-01", src: img32, category: "public", titleVi: "Không gian chung", titleEn: "Public spaces" },
  { id: "chronos-public-lobby-02", src: img33, category: "public", titleVi: "Không gian chung", titleEn: "Public spaces" },
  { id: "chronos-public-lounge", src: img34, category: "public", titleVi: "Không gian chung", titleEn: "Public spaces" },
  { id: "chronos-public-pool", src: img35, category: "public", titleVi: "Không gian chung", titleEn: "Public spaces" },
  { id: "chronos-public-reception", src: img36, category: "public", titleVi: "Không gian chung", titleEn: "Public spaces" },
  { id: "chronos-public-spa-reception", src: img37, category: "public", titleVi: "Không gian chung", titleEn: "Public spaces" },
  { id: "chronos-public-stair", src: img38, category: "public", titleVi: "Không gian chung", titleEn: "Public spaces" },
  { id: "chronos-spa-foot", src: img39, category: "wellness", titleVi: "Spa & wellness", titleEn: "Spa & wellness" },
  { id: "chronos-spa-room-01", src: img40, category: "wellness", titleVi: "Spa & wellness", titleEn: "Spa & wellness" },
  { id: "chronos-spa-room-02", src: img41, category: "wellness", titleVi: "Spa & wellness", titleEn: "Spa & wellness" },
  { id: "chronos-standard-01", src: img42, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
  { id: "chronos-standard-02", src: img43, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
  { id: "chronos-standard-03", src: img44, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
  { id: "chronos-standard-04", src: img45, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
  { id: "chronos-suite-01", src: img46, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
  { id: "chronos-suite-02", src: img47, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
  { id: "chronos-suite-03", src: img48, category: "cabins", titleVi: "Phòng nghỉ", titleEn: "Cabins" },
];
