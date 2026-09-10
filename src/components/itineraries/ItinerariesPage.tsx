"use client";

import { useState } from "react";
import { Clock, Check, X, Sparkles, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { LocalLink, useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { publicQueries, type PublicItinerariesBundle } from "@/lib/platform";
import { itineraryUi, type ItineraryUi } from "@/lib/i18n/ui-itineraries";
import { itinerariesText, toItineraryView, type ItineraryView } from "./itinerary-view";

/**
 * Heritage itineraries template. Every itinerary, day plan, image and piece of
 * editorial copy comes from the database through the public read layer.
 */
export function ItinerariesPage({ bundle }: { bundle: PublicItinerariesBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = itineraryUi(lang);
  const { data } = useSuspenseQuery({ ...publicQueries.itinerariesBundle(href("/itineraries")), initialData: bundle });
  const b = data ?? bundle;

  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const itineraries = perLang.itineraries.map(toItineraryView);
  const page = perLang.page;
  const copy = (key: string) => itinerariesText(page, key);

  const hero = itineraries[0]?.cover ?? null;
  const bookingLink = b.ship.settings.bookingUrl ?? b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? "#";
  const [openId, setOpenId] = useState<string | null>(itineraries[0]?.id ?? null);

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          {hero ? (
            <img
              src={hero.url}
              alt={copy("heroAlt") || hero.alt || b.ship.ship.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-chronos-ink/80" />
          )}
          <div className="hero-local-scrim absolute inset-0" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{copy("eyebrow")}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {page?.title ?? ""}
              </h1>
              <p className="mt-4 max-w-xl text-chronos-ivory/85">{page?.intro ?? ""}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-16 px-6 py-24 lg:px-8 lg:py-32">
          {itineraries.map((it, index) => (
            <ItineraryCard
              key={it.id}
              it={it}
              index={index}
              ui={ui}
              open={openId === it.id}
              onToggle={() => setOpenId((prev) => (prev === it.id ? null : it.id))}
            />
          ))}

          <Reveal className="border-t border-chronos-ink/10 pt-16 text-center">
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">{copy("ctaTitle")}</h2>
            <p className="mx-auto mb-8 max-w-xl text-chronos-stone/85">{copy("ctaBody")}</p>
            <Button
              asChild
              className="btn-sheen rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              <a href={bookingLink} target="_blank" rel="noopener noreferrer">
                {copy("ctaLabel") || t.itineraries.cta}
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
  ui,
  open,
  onToggle,
}: {
  it: ItineraryView;
  index: number;
  ui: ItineraryUi;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Reveal>
      <div className="overflow-hidden rounded-sm border border-chronos-ink/10 bg-white">
        <div className="grid lg:grid-cols-[1.2fr_1fr]">
          <div className="relative h-64 lg:h-auto">
            {it.cover ? (
              <img
                src={it.cover.url}
                alt={it.cover.alt || it.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-chronos-warm/40" />
            )}
            {it.duration ? (
              <div className="absolute left-5 top-5 rounded-sm bg-chronos-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink">
                {it.duration}
              </div>
            ) : null}
          </div>

          <div className="p-8 lg:p-10">
            <p className="eyebrow mb-4 text-chronos-gold">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">{it.name}</h2>
            <p className="mb-6 text-chronos-stone/85">{it.description}</p>

            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">
                  <Check className="h-3.5 w-3.5 text-chronos-gold" /> {ui.includes}
                </p>
                <ul className="space-y-1.5 text-sm text-chronos-stone/85">
                  {it.includes.map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">
                  <X className="h-3.5 w-3.5 text-chronos-stone/50" /> {ui.excludes}
                </p>
                <ul className="space-y-1.5 text-sm text-chronos-stone/70">
                  {it.excludes.map((e) => (
                    <li key={e} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-stone/50" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              {it.timeline.length > 0 || it.highlights.length > 0 ? (
                <button
                  onClick={onToggle}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:text-chronos-gold"
                >
                  {open ? ui.collapse : ui.showTimeline}
                  {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              ) : null}
              <LocalLink
                path={`/itineraries/${it.slug}`}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-gold hover:text-chronos-ink"
              >
                {ui.exploreJourney} <ArrowRight className="h-4 w-4" />
              </LocalLink>
            </div>
          </div>
        </div>

        {open ? (
          <div className="border-t border-chronos-ink/10 bg-chronos-warm/20 p-8 lg:p-10">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">
                  <Clock className="h-3.5 w-3.5 text-chronos-gold" /> {ui.duration}
                </p>
                <div className="space-y-4">
                  {it.timeline.map((item) => (
                    <div key={item.key} className="flex gap-4">
                      <span className="w-14 shrink-0 text-sm font-semibold text-chronos-gold">{item.time}</span>
                      <span className="text-sm text-chronos-stone/85">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">
                  <Sparkles className="h-3.5 w-3.5 text-chronos-gold" /> {ui.highlights}
                </p>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {it.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-chronos-stone/85">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />
                      {h}
                    </li>
                  ))}
                </ul>
                {it.gallery.length > 0 ? (
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {it.gallery.map((img) => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt={img.alt || it.name}
                        loading="lazy"
                        className="aspect-[4/3] w-full rounded-sm object-cover"
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
