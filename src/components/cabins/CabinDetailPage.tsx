"use client";

import { Link } from "@tanstack/react-router";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import {
  cabinTypes,
  cabinDetails,
  AREA_LABEL_VI,
  AREA_LABEL_EN,
  AREA_NOTE_VI,
  AREA_NOTE_EN,
  type CabinType,
} from "./cabins-data";
import { DeckPlan, DeckPlanProvider } from "./DeckPlan";

const QUOTE_LINK = "https://zalo.me/";

export function CabinDetailPage({ cabin }: { cabin: CabinType }) {
  const { lang, setLang, t } = useLanguage();
  const vi = lang === "vi";
  const detail = cabinDetails[cabin.id]!;
  const others = cabinTypes.filter((c) => c.id !== cabin.id);

  const specs = [
    {
      label: cabin.vip ? (vi ? AREA_LABEL_VI : AREA_LABEL_EN) : vi ? "Diện tích" : "Area",
      value: cabin.vip
        ? vi
          ? `${cabin.area} tổng diện tích riêng`
          : `${cabin.area} Total Private Area`
        : cabin.area,
    },
    { label: vi ? "Tầm nhìn" : "View", value: cabin.view },
    {
      label: vi ? "Số phòng" : "Cabins",
      value: vi ? `${cabin.roomCount} phòng` : `${cabin.roomCount} cabins`,
    },
    { label: vi ? "Sức chứa tối đa" : "Max occupancy", value: vi ? detail.capacityVi : detail.capacityEn },
    { label: vi ? "Giường" : "Bed", value: vi ? cabin.bedVi : cabin.bedEn },
    { label: vi ? "Vị trí" : "Location", value: vi ? detail.deckVi : detail.deckEn },
  ];

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[68vh] min-h-[440px] w-full overflow-hidden">
          <img
            src={cabin.hero}
            alt={vi ? cabin.nameVi : cabin.nameEn}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <Link
                to="/cabins"
                className="eyebrow mb-5 inline-block text-chronos-gold hover:text-chronos-gold/80"
              >
                ← {vi ? "PHÒNG NGHỈ" : "CABINS"}
              </Link>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {vi ? cabin.nameVi : cabin.nameEn}
              </h1>
              {cabin.code ? (
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-chronos-gold">
                  {cabin.code}
                </p>
              ) : null}
              <p className="mt-3 max-w-xl text-chronos-ivory/85">
                {cabin.vip
                  ? vi
                    ? `${cabin.area} tổng diện tích riêng`
                    : `${cabin.area} Total Private Area`
                  : cabin.area}{" "}
                · {cabin.view}
              </p>
              {cabin.vip ? (
                <p className="mt-2 max-w-xl text-xs leading-relaxed text-chronos-ivory/65">
                  {vi ? AREA_NOTE_VI : AREA_NOTE_EN}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-20 px-6 py-20 lg:px-8 lg:py-28">
          <Reveal className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-5 text-chronos-gold">{vi ? "MÔ TẢ" : "OVERVIEW"}</p>
              <p className="mb-6 text-lg leading-relaxed text-chronos-stone/85">
                {vi ? cabin.descVi : cabin.descEn}
              </p>
              <ul className="space-y-3">
                {(vi ? detail.highlightsVi : detail.highlightsEn).map((h) => (
                  <li key={h} className="flex items-start gap-3 text-chronos-stone/85">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="divide-y divide-chronos-ink/10 border-y border-chronos-ink/10">
              {specs.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
                    {s.label}
                  </dt>
                  <dd className="text-right text-chronos-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {cabin.vip ? (
            <p className="-mt-14 text-xs leading-relaxed text-chronos-stone/70">
              {vi ? AREA_NOTE_VI : AREA_NOTE_EN}
            </p>
          ) : null}

          <Reveal>
            <p className="eyebrow mb-5 text-chronos-gold">{vi ? "TIỆN NGHI" : "AMENITIES"}</p>
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {(vi ? cabin.amenitiesVi : cabin.amenitiesEn).map((a) => (
                <li
                  key={a}
                  className="flex items-start gap-2 border-b border-chronos-ink/10 pb-3 text-sm text-chronos-stone/85"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />
                  {a}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <p className="eyebrow mb-5 text-chronos-gold">{vi ? "SƠ ĐỒ BỐ TRÍ" : "FLOOR PLAN"}</p>
            <DeckPlanProvider>
              <DeckPlan
                zones={detail.layout}
                vi={vi}
                hint={
                  vi
                    ? "Sơ đồ mang tính minh hoạ tỷ lệ tương đối giữa các khu vực trong phòng; bố trí thực tế có thể thay đổi theo vị trí phòng trên tàu."
                    : "The plan illustrates the relative proportions of each area; the actual layout may vary depending on the cabin's position aboard."
                }
              />
            </DeckPlanProvider>
          </Reveal>

          <Reveal>
            <p className="eyebrow mb-5 text-chronos-gold">{vi ? "HÌNH ẢNH" : "GALLERY"}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[cabin.hero, ...cabin.gallery].map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${vi ? cabin.nameVi : cabin.nameEn} ${i + 1}`}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-sm object-cover"
                />
              ))}
            </div>
          </Reveal>

          <Reveal className="border-t border-chronos-ink/10 pt-16">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <h2 className="mb-3 text-2xl tracking-[0.02em] text-chronos-ink sm:text-3xl">
                  {vi ? "Quan tâm hạng phòng này?" : "Interested in this cabin?"}
                </h2>
                <p className="max-w-xl text-chronos-stone/85">
                  {vi
                    ? "Để lại thông tin, đội ngũ Chronos sẽ tư vấn và báo giá trong 24 giờ."
                    : "Leave your details and our team will advise and quote within 24 hours."}
                </p>
              </div>
              <Button
                asChild
                className="btn-sheen rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
              >
                <a href={QUOTE_LINK} target="_blank" rel="noopener noreferrer">
                  {vi ? "Liên hệ báo giá" : "Request a quote"}
                </a>
              </Button>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {others.map((o) => (
                <Link
                  key={o.id}
                  to="/cabins/$cabinId"
                  params={{ cabinId: o.id }}
                  className="group grid grid-cols-[110px_1fr] items-center gap-4 rounded-sm border border-chronos-ink/10 p-3 transition-colors hover:border-chronos-gold/60"
                >
                  <img
                    src={o.hero}
                    alt={vi ? o.nameVi : o.nameEn}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-sm object-cover"
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
                      {vi ? "Hạng phòng khác" : "Other cabin"}
                    </p>
                    <p className="mt-1 text-lg text-chronos-ink group-hover:text-chronos-gold">
                      {vi ? o.nameVi : o.nameEn}
                    </p>
                    <p className="text-sm text-chronos-stone/75">
                      {o.code ? `${o.code} · ` : ""}
                      {o.area} · {o.view}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}
