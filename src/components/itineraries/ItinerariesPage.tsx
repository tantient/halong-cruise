"use client";

import { ArrowRight, Moon, Sun } from "lucide-react";
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
 * Voyage listing: an editorial side-by-side comparison of the ship's published
 * voyages. Every factual field (name, duration, destination, description,
 * highlights, day count, imagery) comes from the database.
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
  const adviceLink = b.ship.settings.bookingUrl ?? b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? "#";

  // Decision support only renders on factual, stored differences.
  const comparable = itineraries.filter((it) => it.duration || it.dayPlan.length > 0);
  const showComparison = comparable.length > 1;

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[58vh] min-h-[380px] w-full overflow-hidden">
          {hero ? (
            <img
              src={hero.url}
              alt={copy("heroAlt") || hero.alt || b.ship.ship.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-chronos-ink/80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/25 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{copy("eyebrow")}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {page?.title ?? ""}
              </h1>
              {page?.intro ? <p className="mt-4 max-w-xl text-chronos-ivory/85">{page.intro}</p> : null}
            </div>
          </div>
        </section>

        {/* Visual voyage comparison — two editorial panels of equal presence. */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-px overflow-hidden border border-chronos-ink/10 bg-chronos-ink/10 lg:grid-cols-2">
            {itineraries.map((it, index) => (
              <VoyagePanel key={it.id} it={it} index={index} ui={ui} />
            ))}
          </div>

          {showComparison ? (
            <Reveal className="mt-20">
              <p className="eyebrow mb-6 text-chronos-gold">{ui.whatsDifferent}</p>
              <h2 className="mb-10 text-3xl tracking-[0.02em] text-chronos-ink">{ui.compareTitle}</h2>
              <div className="overflow-hidden border border-chronos-ink/10">
                {comparable.map((it, index) => (
                  <div
                    key={it.id}
                    className={`grid gap-4 p-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center lg:p-8 ${
                      index % 2 === 1 ? "bg-chronos-warm/25" : "bg-white"
                    }`}
                  >
                    <div>
                      <h3 className="text-xl tracking-[0.02em] text-chronos-ink">{it.name}</h3>
                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-chronos-stone/85">
                        {it.duration ? <Fact label={ui.duration} value={it.duration} /> : null}
                        {it.dayPlan.length > 0 ? (
                          <Fact label={ui.dayByDay} value={String(it.dayPlan.length)} />
                        ) : null}
                        {it.destination ? <Fact label={ui.destination} value={it.destination} /> : null}
                      </div>
                      {it.highlights.length > 0 ? (
                        <p className="mt-3 text-sm text-chronos-stone/75">{it.highlights.join(" · ")}</p>
                      ) : null}
                    </div>
                    <LocalLink
                      path={`/itineraries/${it.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:text-chronos-gold"
                    >
                      {ui.exploreVoyage} <ArrowRight className="h-4 w-4" />
                    </LocalLink>
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}
        </section>

        <Reveal className="border-t border-chronos-ink/10 px-6 py-20 text-center lg:py-24">
          <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">
            {copy("ctaTitle") || ui.journeyStartsTitle}
          </h2>
          {copy("ctaBody") ? (
            <p className="mx-auto mb-8 max-w-xl text-chronos-stone/85">{copy("ctaBody")}</p>
          ) : null}
          <Button
            asChild
            className="btn-sheen rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
          >
            <a href={adviceLink} target="_blank" rel="noopener noreferrer">
              {copy("ctaLabel") || ui.requestAdvice}
            </a>
          </Button>
        </Reveal>
      </main>

      <Footer t={t} />
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-chronos-ink/60">{label}</span>
      <span>{value}</span>
    </span>
  );
}

function VoyagePanel({ it, index, ui }: { it: ItineraryView; index: number; ui: ItineraryUi }) {
  return (
    <Reveal delay={index * 90} className="bg-white">
      <LocalLink path={`/itineraries/${it.slug}`} className="group block h-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {it.cover ? (
            <img
              src={it.cover.url}
              alt={it.cover.alt || it.name}
              loading={index === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="h-full w-full bg-chronos-warm/40" />
          )}
          {it.duration ? (
            <span className="absolute left-6 top-6 bg-chronos-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink">
              {it.duration}
            </span>
          ) : null}
        </div>

        <div className="p-8 lg:p-10">
          {it.destination ? <p className="eyebrow mb-4 text-chronos-gold">{it.destination}</p> : null}
          <h2 className="mb-4 text-2xl tracking-[0.02em] text-chronos-ink sm:text-3xl">{it.name}</h2>

          {it.days || it.nights || it.dayPlan.length > 0 ? (
            <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-chronos-stone/85">
              {it.days ? (
                <span className="flex items-center gap-2">
                  <Sun className="h-3.5 w-3.5 text-chronos-gold" />
                  {it.days} {it.days === 1 ? ui.dayOne : ui.days}
                </span>
              ) : null}
              {it.nights ? (
                <span className="flex items-center gap-2">
                  <Moon className="h-3.5 w-3.5 text-chronos-gold" />
                  {it.nights} {it.nights === 1 ? ui.nightOne : ui.nights}
                </span>
              ) : null}
              {it.departurePoint ? (
                <span>
                  {ui.departure}: {it.departurePoint}
                </span>
              ) : null}
            </div>
          ) : null}

          {it.description ? <p className="mb-6 text-chronos-stone/85">{it.description}</p> : null}

          {it.highlights.length > 0 ? (
            <ul className="mb-8 space-y-2 text-sm text-chronos-stone/85">
              {it.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />
                  {h}
                </li>
              ))}
            </ul>
          ) : null}

          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink group-hover:text-chronos-gold">
            {ui.exploreVoyage}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </LocalLink>
    </Reveal>
  );
}
