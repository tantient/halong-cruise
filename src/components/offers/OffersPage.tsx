"use client";

import { Check } from "lucide-react";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { offers, type Offer } from "./offers-data";

const BOOKING_LINK = "https://zalo.me/";

export function OffersPage() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          <img
            src={offers[0]?.hero}
            alt={lang === "vi" ? "Ưu đãi Chronos Cruise" : "Chronos Cruise offers"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{t.offers.label}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {t.offers.title}
              </h1>
              <p className="mt-4 max-w-xl text-chronos-ivory/85">{t.offers.subtitle}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-16 px-6 py-24 lg:px-8 lg:py-32">
          {offers.map((offer, index) => (
            <OfferCard key={offer.id} offer={offer} index={index} lang={lang} t={t} />
          ))}

          <Reveal className="border-t border-chronos-ink/10 pt-16 text-center">
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">
              {lang === "vi" ? "Cần tư vấn ưu đãi phù hợp?" : "Need help choosing an offer?"}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-chronos-stone/85">
              {lang === "vi"
                ? "Đội ngũ Chronos sẽ tư vấn gói phù hợp nhất với lịch trình và nhóm của bạn."
                : "The Chronos team will recommend the best package for your schedule and group."}
            </p>
            <Button
              asChild
              className="btn-sheen rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
                {t.offers.cta}
              </a>
            </Button>
          </Reveal>
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}

function OfferCard({
  offer,
  index,
  lang,
  t,
}: {
  offer: Offer;
  index: number;
  lang: "vi" | "en";
  t: ReturnType<typeof import("@/lib/translations").getT>;
}) {
  const vi = lang === "vi";
  const name = vi ? offer.nameVi : offer.nameEn;
  const desc = vi ? offer.descVi : offer.descEn;
  const badge = vi ? offer.badgeVi : offer.badgeEn;
  const terms = vi ? offer.termsVi : offer.termsEn;
  const highlights = vi ? offer.highlightsVi : offer.highlightsEn;
  const flip = index % 2 === 1;

  return (
    <Reveal>
      <div className="overflow-hidden rounded-sm border border-chronos-ink/10 bg-white">
        <div className={`grid lg:grid-cols-2 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <div className="relative h-72 lg:h-auto">
            <img
              src={offer.hero}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-5 top-5 rounded-sm bg-chronos-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink">
              {badge}
            </div>
          </div>

          <div className="p-8 lg:p-10">
            <p className="eyebrow mb-4 text-chronos-gold">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">{name}</h2>
            <p className="mb-6 text-chronos-stone/85">{desc}</p>

            <ul className="mb-6 grid gap-2 sm:grid-cols-2">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-chronos-stone/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-chronos-gold" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mb-6 border-t border-chronos-ink/10 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">
                {t.offers.terms}
              </p>
              <ul className="space-y-1.5 text-sm text-chronos-stone/70">
                {terms.map((term) => (
                  <li key={term} className="flex items-start gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-stone/50" />
                    {term}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              asChild
              className="btn-sheen rounded-none bg-chronos-gold px-6 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
                {t.offers.cta}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
