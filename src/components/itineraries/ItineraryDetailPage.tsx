"use client";

import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { LocalLink, useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { publicQueries, type MediaItem, type PublicItinerariesBundle } from "@/lib/platform";
import { itineraryUi, type ItineraryUi } from "@/lib/i18n/ui-itineraries";
import { toItineraryView, type DayView, type ItineraryView } from "./itinerary-view";

/**
 * Voyage detail: Hero → Journey overview → Visual day-by-day journey →
 * Highlights → Includes/Excludes → Choose your cabin → Request your journey.
 * Every factual value is read from the database; a missing field hides its
 * section instead of being filled with invented copy.
 */
export function ItineraryDetailPage({ bundle, slug }: { bundle: PublicItinerariesBundle; slug: string }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = itineraryUi(lang);
  const { data } = useSuspenseQuery({
    ...publicQueries.itinerariesBundle(href(`/itineraries/${slug}`)),
    initialData: bundle,
  });
  const b = data ?? bundle;

  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const views = useMemo(() => perLang.itineraries.map(toItineraryView), [perLang]);
  const it: ItineraryView = views.find((v) => v.slug === slug) ?? views[0]!;

  const enquiryLink = b.ship.settings.bookingUrl ?? b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? "#";
  const hero = it.cover;

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        {/* A — Hero */}
        <section className="relative h-[72vh] min-h-[460px] w-full overflow-hidden">
          {hero ? (
            <img src={hero.url} alt={hero.alt || it.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-chronos-ink/80" />
          )}
          <div className="hero-local-scrim absolute inset-0" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <LocalLink
                path="/itineraries"
                className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ivory/70 hover:text-chronos-gold"
              >
                <ArrowLeft className="h-4 w-4" /> {ui.backToVoyages}
              </LocalLink>
              {it.destination ? <p className="eyebrow mb-4 text-chronos-gold">{it.destination}</p> : null}
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl lg:text-6xl">
                {it.name}
              </h1>
              {it.duration ? (
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-chronos-ivory/80">
                  {it.duration}
                </p>
              ) : null}
              {it.description ? (
                <p className="mt-5 max-w-2xl text-chronos-ivory/85">{it.description}</p>
              ) : null}
            </div>
          </div>
        </section>

        {/* B — Journey overview */}
        <OverviewSection it={it} ui={ui} />

        {/* C — Visual day-by-day journey */}
        {it.dayPlan.some((d) => d.entries.length > 0) ? (
          <section className="border-t border-chronos-ink/10 bg-chronos-sand-50">
            <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-28">
              <Reveal>
                <p className="eyebrow mb-5 text-chronos-gold">{ui.dayByDay}</p>
                <h2 className="mb-14 text-3xl tracking-[0.02em] text-chronos-ink sm:text-4xl">
                  {it.duration || it.name}
                </h2>
              </Reveal>

              <div className="relative">
                {/* Journey progression line */}
                <span
                  aria-hidden
                  className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-chronos-gold/60 via-chronos-ink/15 to-transparent sm:left-[9px]"
                />
                <div className="space-y-16 lg:space-y-24">
                  {it.dayPlan.map((day, index) => (
                    <DayBlock
                      key={day.id}
                      day={day}
                      ui={ui}
                      voyageName={it.name}
                      fallback={it.gallery[index % Math.max(it.gallery.length, 1)] ?? null}
                      flip={index % 2 === 1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* D — Highlights */}
        {it.highlights.length > 0 ? (
          <section className="border-t border-chronos-ink/10">
            <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
              <Reveal>
                <p className="eyebrow mb-8 text-chronos-gold">{ui.highlights}</p>
                <ul className="grid gap-x-12 gap-y-5 sm:grid-cols-2">
                  {it.highlights.map((h) => (
                    <li
                      key={h}
                      className="border-b border-chronos-ink/10 pb-4 text-lg tracking-[0.01em] text-chronos-ink"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        ) : null}

        {/* E — Included / not included */}
        {it.includes.length > 0 || it.excludes.length > 0 ? (
          <section className="border-t border-chronos-ink/10 bg-chronos-warm/25">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">
              {it.includes.length > 0 ? (
                <Reveal>
                  <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">
                    <Check className="h-3.5 w-3.5 text-chronos-gold" /> {ui.includes}
                  </p>
                  <ul className="space-y-2.5 text-chronos-stone/85">
                    {it.includes.map((i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />
                        {i}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
              {it.excludes.length > 0 ? (
                <Reveal delay={80}>
                  <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">
                    <X className="h-3.5 w-3.5 text-chronos-stone/50" /> {ui.excludes}
                  </p>
                  <ul className="space-y-2.5 text-chronos-stone/70">
                    {it.excludes.map((e) => (
                      <li key={e} className="flex items-start gap-2">
                        <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-chronos-stone/40" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* F — Choose your cabin */}
        <section className="border-t border-chronos-ink/10">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
            <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="mb-3 text-3xl tracking-[0.02em] text-chronos-ink">{ui.chooseCabinTitle}</h2>
                <p className="max-w-xl text-chronos-stone/85">{ui.chooseCabinBody}</p>
              </div>
              <LocalLink
                path="/cabins"
                className="inline-flex shrink-0 items-center gap-2 border-b border-chronos-ink pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:border-chronos-gold hover:text-chronos-gold"
              >
                {ui.exploreCabins} <ArrowRight className="h-4 w-4" />
              </LocalLink>
            </Reveal>
          </div>
        </section>

        {/* G — Final CTA */}
        <section className="bg-chronos-ink">
          <Reveal className="mx-auto max-w-3xl px-6 py-20 text-center lg:py-24">
            <h2 className="mb-8 text-3xl tracking-[0.02em] text-chronos-ivory sm:text-4xl">
              {ui.requestJourneyTitle}
            </h2>
            <Button
              asChild
              className="btn-sheen rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              <a href={enquiryLink} target="_blank" rel="noopener noreferrer">
                {ui.requestJourney}
              </a>
            </Button>
          </Reveal>
        </section>
      </main>

      <Footer t={t} />
    </div>
  );
}

function OverviewSection({ it, ui }: { it: ItineraryView; ui: ItineraryUi }) {
  const facts: Array<{ label: string; value: string }> = [];
  if (it.duration) facts.push({ label: ui.duration, value: it.duration });
  if (it.days) facts.push({ label: ui.days, value: String(it.days) });
  if (it.nights) facts.push({ label: ui.nights, value: String(it.nights) });
  if (it.destination) facts.push({ label: ui.destination, value: it.destination });
  if (it.departurePoint) facts.push({ label: ui.departure, value: it.departurePoint });
  if (facts.length === 0) return null;

  return (
    <section className="border-b border-chronos-ink/10">
      <Reveal className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <p className="eyebrow mb-8 text-chronos-gold">{ui.journeyOverview}</p>
        <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-chronos-ink/55">
                {f.label}
              </dt>
              <dd className="text-lg tracking-[0.01em] text-chronos-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}

function DayBlock({
  day,
  ui,
  voyageName,
  fallback,
  flip,
}: {
  day: DayView;
  ui: ItineraryUi;
  voyageName: string;
  fallback: MediaItem | null;
  flip: boolean;
}) {
  if (day.entries.length === 0) return null;
  const heading = day.title || `${ui.day} ${day.dayNumber}`;

  return (
    <Reveal className="relative pl-8 sm:pl-14">
      <span
        aria-hidden
        className="absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-chronos-gold bg-chronos-ivory"
      />
      <div className="mb-8 flex flex-wrap items-baseline gap-4">
        <span className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-chronos-gold">
          {String(day.dayNumber).padStart(2, "0")}
        </span>
        <h3 className="text-2xl tracking-[0.02em] text-chronos-ink sm:text-3xl">{heading}</h3>
      </div>
      {day.description ? (
        <p className="mb-8 max-w-2xl text-chronos-stone/85">{day.description}</p>
      ) : null}

      <div className={`grid gap-10 ${fallback ? "lg:grid-cols-[1fr_0.85fr]" : ""}`}>
        <ol className="space-y-8">
          {day.entries.map((entry) => (
            <li key={entry.key} className="grid gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-6">
              {entry.time ? (
                <span className="pt-1 text-sm font-semibold tracking-[0.08em] text-chronos-gold">{entry.time}</span>
              ) : (
                <span aria-hidden />
              )}
              <div>
                <p className="text-lg leading-snug tracking-[0.01em] text-chronos-ink">{entry.label}</p>
                {entry.description ? (
                  <p className="mt-2 text-sm text-chronos-stone/80">{entry.description}</p>
                ) : null}
                {entry.image ? (
                  <img
                    src={entry.image}
                    alt={entry.label}
                    loading="lazy"
                    className="mt-4 aspect-[16/10] w-full object-cover"
                  />
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        {fallback ? (
          <figure className={`${flip ? "lg:order-first" : ""} self-start`}>
            <img
              src={fallback.url}
              alt={fallback.alt || voyageName}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
            />
          </figure>
        ) : null}
      </div>
    </Reveal>
  );
}
