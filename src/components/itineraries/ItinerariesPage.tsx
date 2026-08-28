"use client";

import { useState } from "react";
import { Clock, Check, X, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { itineraries, type Itinerary } from "./itineraries-data";

const BOOKING_LINK = "https://zalo.me/";

export function ItinerariesPage() {
  const { lang, setLang, t } = useLanguage();
  const vi = lang === "vi";
  const [openId, setOpenId] = useState<string | null>(itineraries[0]?.id ?? null);

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          <img
            src={itineraries[0]?.hero}
            alt={vi ? "Hải trình Chronos Cruise" : "Chronos Cruise itineraries"}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{t.itineraries.label}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {t.itineraries.title}
              </h1>
              <p className="mt-4 max-w-xl text-chronos-ivory/85">{t.itineraries.subtitle}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-16 px-6 py-24 lg:px-8 lg:py-32">
          {itineraries.map((it, index) => (
            <ItineraryCard
              key={it.id}
              it={it}
              index={index}
              vi={vi}
              open={openId === it.id}
              onToggle={() => setOpenId((prev) => (prev === it.id ? null : it.id))}
              t={t}
            />
          ))}

          <Reveal className="border-t border-chronos-ink/10 pt-16 text-center">
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">
              {vi ? "Cần hải trình riêng?" : "Need a private itinerary?"}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-chronos-stone/85">
              {vi
                ? "Đội ngũ Chronos sẽ thiết kế hành trình theo yêu cầu của bạn: thời gian, điểm đến, ẩm thực và dịch vụ đi kèm."
                : "The Chronos team will design a voyage around your schedule, destinations, dining and service preferences."}
            </p>
            <Button
              asChild
              className="btn-sheen rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
                {t.itineraries.cta}
              </a>
            </Button>
          </Reveal>
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}

function ItineraryCard({
  it,
  index,
  vi,
  open,
  onToggle,
  t,
}: {
  it: Itinerary;
  index: number;
  vi: boolean;
  open: boolean;
  onToggle: () => void;
  t: ReturnType<typeof import("@/lib/translations").getT>;
}) {
  const name = vi ? it.nameVi : it.nameEn;
  const desc = vi ? it.descVi : it.descEn;
  const duration = vi ? it.durationVi : it.durationEn;
  const includes = vi ? it.includesVi : it.includesEn;
  const excludes = vi ? it.excludesVi : it.excludesEn;
  const highlights = vi ? it.highlightsVi : it.highlightsEn;
  const timeline = vi ? it.timelineVi : it.timelineEn;

  return (
    <Reveal>
      <div className="overflow-hidden rounded-sm border border-chronos-ink/10 bg-white">
        <div className="grid lg:grid-cols-[1.2fr_1fr]">
          <div className="relative h-64 lg:h-auto">
            <img
              src={it.hero}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute left-5 top-5 rounded-sm bg-chronos-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink">
              {duration}
            </div>
          </div>

          <div className="p-8 lg:p-10">
            <p className="eyebrow mb-4 text-chronos-gold">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">{name}</h2>
            <p className="mb-6 text-chronos-stone/85">{desc}</p>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">
                  <Check className="h-3.5 w-3.5 text-chronos-gold" /> {t.itineraries.includes}
                </p>
                <ul className="space-y-1.5 text-sm text-chronos-stone/85">
                  {includes.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">
                  <X className="h-3.5 w-3.5 text-chronos-stone/50" /> {t.itineraries.excludes}
                </p>
                <ul className="space-y-1.5 text-sm text-chronos-stone/70">
                  {excludes.map((e) => (
                    <li key={e} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-stone/50" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:text-chronos-gold"
            >
              {open ? (vi ? "Thu gọn" : "Collapse") : vi ? "Lịch trình chi tiết" : "Detailed timeline"}
              {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-chronos-ink/10 bg-chronos-warm/20 p-8 lg:p-10">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">
                  <Clock className="h-3.5 w-3.5 text-chronos-gold" /> {t.itineraries.duration}
                </p>
                <div className="space-y-4">
                  {timeline.map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <span className="w-14 shrink-0 text-sm font-semibold text-chronos-gold">{item.time}</span>
                      <span className="text-sm text-chronos-stone/85">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">
                  <Sparkles className="h-3.5 w-3.5 text-chronos-gold" /> {t.itineraries.highlights}
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-chronos-stone/85">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {it.images.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt={name}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-sm object-cover"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
