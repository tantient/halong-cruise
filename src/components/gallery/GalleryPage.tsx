"use client";

import { useMemo, useState } from "react";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { galleryImages, type GalleryCategory } from "./gallery-data";
import { Lightbox } from "./Lightbox";

const CATEGORIES: { id: GalleryCategory | "all"; vi: string; en: string }[] = [
  { id: "all", vi: "Tất cả", en: "All" },
  { id: "exterior", vi: "Ngoại thất", en: "Exterior" },
  { id: "public", vi: "Không gian chung", en: "Public spaces" },
  { id: "dining", vi: "Nhà hàng", en: "Dining" },
  { id: "entertainment", vi: "Giải trí", en: "Entertainment" },
  { id: "wellness", vi: "Spa", en: "Spa" },
  { id: "deck", vi: "Sundeck", en: "Sundeck" },
  { id: "cabins", vi: "Phòng nghỉ", en: "Cabins" },
];

export function GalleryPage() {
  const { lang, setLang, t } = useLanguage();
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const [active, setActive] = useState<number | null>(null);

  const images = useMemo(
    () => (filter === "all" ? galleryImages : galleryImages.filter((i) => i.category === filter)),
    [filter],
  );

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main className="pt-32 pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow mb-6 text-chronos-gold">
              {lang === "vi" ? "THƯ VIỆN" : "GALLERY"}
            </p>
            <h1 className="mb-4 text-4xl tracking-[0.02em] text-chronos-ink sm:text-5xl">
              {lang === "vi" ? "Chronos qua từng góc nhìn" : "Chronos in every view"}
            </h1>
            <p className="text-chronos-stone/85">
              {lang === "vi"
                ? "Toàn bộ không gian trên du thuyền: ngoại thất, nhà hàng, giải trí, spa và phòng nghỉ."
                : "Every space aboard: exterior, dining, entertainment, spa and cabins."}
            </p>
          </Reveal>

          <div className="mb-10 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setFilter(c.id);
                  setActive(null);
                }}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                  filter === c.id
                    ? "border-chronos-ink bg-chronos-ink text-chronos-ivory"
                    : "border-chronos-ink/15 text-chronos-ink/70 hover:border-chronos-ink/40 hover:text-chronos-ink"
                }`}
              >
                {lang === "vi" ? c.vi : c.en}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActive(i)}
                className="group relative overflow-hidden rounded-sm bg-chronos-ink/5 text-left"
              >
                <img
                  src={img.src}
                  alt={lang === "vi" ? img.titleVi : img.titleEn}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chronos-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="pointer-events-none absolute bottom-4 left-5 text-xs uppercase tracking-[0.24em] text-chronos-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {lang === "vi" ? img.titleVi : img.titleEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <Lightbox
        images={images}
        index={active}
        setIndex={(fn) => setActive((i) => fn(i))}
        close={() => setActive(null)}
        lang={lang}
      />

      <Footer t={t} />
    </div>
  );
}
