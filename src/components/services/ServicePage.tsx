"use client";

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/gallery/Lightbox";
import { services, serviceImages, type Service } from "./services-data";

const QUOTE_LINK = "https://zalo.me/";

export function ServicePage({ service }: { service: Service }) {
  const { lang, setLang, t } = useLanguage();
  const vi = lang === "vi";
  const [active, setActive] = useState<number | null>(null);

  const images = useMemo(() => serviceImages(service), [service]);
  const hero = images[0];
  const rest = images.slice(1);
  const others = services.filter((s) => s.id !== service.id);

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
          {hero ? (
            <img
              src={hero.src}
              alt={vi ? service.nameVi : service.nameEn}
              className="h-full w-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">
                {vi ? service.eyebrowVi : service.eyebrowEn}
              </p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {vi ? service.nameVi : service.nameEn}
              </h1>
              <p className="mt-4 max-w-xl text-chronos-ivory/85">
                {vi ? service.taglineVi : service.taglineEn}
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-20 px-6 py-20 lg:px-8 lg:py-28">
          <Reveal className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <p className="text-lg leading-relaxed text-chronos-stone/90">
              {vi ? service.introVi : service.introEn}
            </p>
            <div className="border-l border-chronos-ink/10 pl-8">
              <p className="eyebrow mb-4 text-chronos-gold">
                {vi ? "ĐIỂM NỔI BẬT" : "HIGHLIGHTS"}
              </p>
              <ul className="space-y-5">
                {service.highlights.map((h) => (
                  <li key={h.titleEn}>
                    <p className="text-sm font-semibold tracking-wide text-chronos-ink">
                      {vi ? h.titleVi : h.titleEn}
                    </p>
                    <p className="mt-1 text-sm text-chronos-stone/80">
                      {vi ? h.descVi : h.descEn}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {rest.length > 0 ? (
            <Reveal>
              <p className="eyebrow mb-6 text-chronos-gold">
                {vi ? "HÌNH ẢNH" : "GALLERY"}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActive(i)}
                    className="group relative overflow-hidden rounded-sm bg-chronos-ink/5 text-left"
                  >
                    <img
                      src={img.src}
                      alt={vi ? img.titleVi : img.titleEn}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chronos-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal className="flex flex-col items-start gap-6 border-t border-chronos-ink/10 pt-12 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg text-chronos-ink">
                {vi ? "Quan tâm đến dịch vụ này?" : "Interested in this experience?"}
              </p>
              <p className="mt-1 text-sm text-chronos-stone/80">
                {vi
                  ? "Đội ngũ Chronos sẽ tư vấn hành trình phù hợp trong 24 giờ."
                  : "The Chronos team will tailor an itinerary within 24 hours."}
              </p>
            </div>
            <Button
              asChild
              className="btn-sheen rounded-none bg-chronos-gold text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              <a href={QUOTE_LINK} target="_blank" rel="noopener noreferrer">
                {t.nav.quote}
              </a>
            </Button>
          </Reveal>

          <Reveal>
            <p className="eyebrow mb-6 text-chronos-gold">
              {vi ? "DỊCH VỤ KHÁC" : "OTHER SERVICES"}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((s) => {
                const img = serviceImages(s)[0];
                return (
                  <Link
                    key={s.id}
                    to="/services/$serviceId"
                    params={{ serviceId: s.id }}
                    className="group relative overflow-hidden rounded-sm bg-chronos-ink/5"
                  >
                    {img ? (
                      <img
                        src={img.src}
                        alt={vi ? s.nameVi : s.nameEn}
                        loading="lazy"
                        className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                      />
                    ) : null}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chronos-ink/80 via-chronos-ink/10 to-transparent" />
                    <span className="absolute bottom-4 left-5 text-sm tracking-wide text-chronos-ivory">
                      {vi ? s.nameVi : s.nameEn}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Reveal>
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
