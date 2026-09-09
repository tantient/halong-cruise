"use client";

import { ArrowRight } from "lucide-react";
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
 * Voyage listing — an editorial presentation, not a comparison.
 *
 * Narrative: Hero → primary (signature) voyage → editorial transition →
 * extended voyage → closing CTA. The primary voyage is the shortest published
 * voyage (the default choice); every other published voyage reads as an
 * extension of it. All factual copy, duration, region and imagery come from the
 * database, so replacing photography or renaming a voyage needs no code change.
 */
export function ItinerariesPage({ bundle }: { bundle: PublicItinerariesBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = itineraryUi(lang);
  const { data } = useSuspenseQuery({ ...publicQueries.itinerariesBundle(href("/itineraries")), initialData: bundle });
  const b = data ?? bundle;

  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const all = perLang.itineraries.map(toItineraryView);
  const page = perLang.page;
  const copy = (key: string) => itinerariesText(page, key);

  // Shortest published voyage is the signature default; the rest are extensions.
  const ordered = [...all].sort((a, b2) => (a.days ?? 99) - (b2.days ?? 99));
  const primary = ordered[0] ?? null;
  const extended = ordered.slice(1);

  // Hero must not repeat the signature voyage image; prefer distinct page media.
  const pageMedia = [...(page?.media?.hero ?? []), page?.media?.cover, ...(page?.media?.gallery ?? [])].filter(
    (m): m is NonNullable<typeof m> => Boolean(m),
  );
  const heroImage =
    pageMedia.find((m) => m.id !== primary?.cover?.id) ??
    primary?.gallery.find((m) => m.id !== primary?.cover?.id) ??
    pageMedia[0] ??
    primary?.cover ??
    null;
  const adviceLink = b.ship.settings.bookingUrl ?? b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? "#";

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        {/* Hero — opening only. */}
        <section className="relative h-[58vh] min-h-[380px] w-full overflow-hidden">
          {heroImage ? (
            <img
              src={heroImage.url}
              alt={copy("heroAlt") || heroImage.alt || b.ship.ship.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-chronos-ink/80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/25 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-14 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{copy("eyebrow")}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {page?.title ?? ""}
              </h1>
            </div>
          </div>
        </section>

        {primary ? <PrimaryVoyage it={primary} ui={ui} /> : null}

        {primary && extended.length > 0 ? (
          <Reveal className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-28">
            <span className="mx-auto mb-6 block h-px w-16 bg-chronos-gold/60" />
            <p className="eyebrow text-chronos-stone/70">{ui.moreTime}</p>
          </Reveal>
        ) : null}

        {extended.map((it) => (
          <ExtendedVoyage key={it.id} it={it} ui={ui} />
        ))}

        {/* Closing */}
        <Reveal className="px-6 py-24 text-center lg:py-32">
          <h2 className="mx-auto max-w-2xl text-3xl tracking-[0.02em] text-chronos-ink sm:text-4xl">
            {copy("ctaTitle") || ui.journeyStartsTitle}
          </h2>
          {copy("ctaBody") ? (
            <p className="mx-auto mt-5 max-w-xl text-chronos-stone/85">{copy("ctaBody")}</p>
          ) : null}
          <Button
            asChild
            className="btn-sheen mt-9 rounded-none bg-chronos-gold px-10 py-6 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
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

/** Highlights read as one restrained editorial line, never a bullet list. */
function HighlightLine({ items, className = "" }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <p className={`text-sm leading-relaxed text-chronos-stone/70 ${className}`}>{items.slice(0, 3).join("  ·  ")}</p>
  );
}

/**
 * Signature voyage — a near full-width visual stage with the title intersecting
 * the lower edge of the image, then an offset editorial column.
 */
function PrimaryVoyage({ it, ui }: { it: ItineraryView; ui: ItineraryUi }) {
  const title = it.duration || it.name;
  return (
    <section className="relative">
      <Reveal>
        <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden sm:h-[68vh] lg:h-[74vh]">
          {it.cover ? (
            <img
              src={it.cover.url}
              alt={it.cover.alt || it.name}
              className="h-full w-full object-cover"
              style={{ objectPosition: "center 45%" }}
            />
          ) : (
            <div className="h-full w-full bg-chronos-warm/50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/80 via-chronos-ink/10 to-transparent" />
        </div>
      </Reveal>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal delay={80}>
          <div className="relative -mt-28 lg:-mt-40">
            <p className="eyebrow mb-4 text-chronos-gold">{ui.signatureEyebrow}</p>
            <h2 className="max-w-4xl text-4xl leading-[1.05] tracking-[0.02em] text-chronos-ivory sm:text-5xl lg:text-[4.25rem]">
              {title}
            </h2>
            {it.destination ? (
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-chronos-ivory/80">
                {it.destination}
              </p>
            ) : null}
          </div>
        </Reveal>

        <div className="grid pb-6 pt-14 lg:grid-cols-12 lg:pt-20">
          <Reveal delay={140} className="lg:col-span-6 lg:col-start-6">
            {it.description ? (
              <p className="max-w-xl text-lg leading-relaxed text-chronos-stone/90">{it.description}</p>
            ) : null}
            <HighlightLine items={it.highlights} className="mt-7 max-w-lg" />
            <LocalLink
              path={`/itineraries/${it.slug}`}
              className="group mt-10 inline-flex items-center gap-3 border-b border-chronos-ink/25 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-chronos-ink transition-colors hover:border-chronos-gold hover:text-chronos-gold"
            >
              {ui.exploreJourney}
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
            </LocalLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/**
 * Extended voyage — an offset panorama with the typography block sitting into
 * the image edge. Deliberately a different composition to the signature stage
 * and visually secondary to it.
 */
function ExtendedVoyage({ it, ui }: { it: ItineraryView; ui: ItineraryUi }) {
  const title = it.duration || it.name;
  const image = it.cover ?? it.gallery[0] ?? null;
  return (
    <section className="pb-8">
      <div className="mx-auto max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-8">
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[21/10]">
              {image ? (
                <img
                  src={image.url}
                  alt={image.alt || it.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-chronos-warm/50" />
              )}
            </div>
          </Reveal>

          <Reveal
            delay={120}
            className="relative z-10 px-6 lg:col-span-5 lg:col-start-8 lg:translate-y-10 lg:px-0"
          >
            <div className="bg-chronos-ivory pt-10 lg:py-12 lg:pl-12">
              <p className="eyebrow mb-4 text-chronos-gold">{ui.stayLonger}</p>
              <h2 className="text-3xl leading-tight tracking-[0.02em] text-chronos-ink sm:text-4xl">{title}</h2>
              {it.destination ? (
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-chronos-stone/70">
                  {it.destination}
                </p>
              ) : null}
              {it.description ? (
                <p className="mt-6 max-w-md leading-relaxed text-chronos-stone/85">{it.description}</p>
              ) : null}
              <HighlightLine items={it.highlights} className="mt-6 max-w-md" />
              <LocalLink
                path={`/itineraries/${it.slug}`}
                className="group mt-9 inline-flex items-center gap-3 border-b border-chronos-ink/25 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-chronos-ink transition-colors hover:border-chronos-gold hover:text-chronos-gold"
              >
                {ui.discoverExtended}
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5" />
              </LocalLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
