"use client";

/**
 * Experience category page (`/experiences/<category>`).
 *
 * The page states what the category is, then presents every real venue aboard
 * that belongs to it — name, location and only the figures the record allows to
 * be published. Sections render only when the database holds their data, and the
 * layout key on the record decides the tone, so no two categories read alike.
 */

import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/Reveal";
import { LocalLink, useLanguage } from "@/components/landing/use-language";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/gallery/Lightbox";
import { toServiceView, type ServiceView } from "@/components/services/service-view";
import { nextInGroup, publicGroup, SHIP_GROUP } from "./grouping";
import { venueFacts, venuesInCategory, type VenueView } from "./venue-view";
import { CuratedGallery, HeroMedia, Img, SectionHeading } from "./media";
import { experienceUi } from "@/lib/i18n/ui-experiences";
import { publicQueries, type MediaItem, type PublicServicesBundle } from "@/lib/platform";

export function ExperienceDetailPage({ bundle, slug }: { bundle: PublicServicesBundle; slug: string }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = experienceUi(lang);
  const [active, setActive] = useState<number | null>(null);

  const { data } = useSuspenseQuery({
    ...publicQueries.servicesBundle(href(`/experiences/${slug}`)),
    initialData: bundle,
  });
  const b = data ?? bundle;
  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;

  const views = useMemo(() => perLang.services.map(toServiceView), [perLang]);
  const view = views.find((s) => s.slug === slug) ?? views[0]!;
  const venues = useMemo(() => venuesInCategory(perLang.venues ?? [], view.category), [perLang, view.category]);
  const next = nextInGroup(views, view.slug);
  const isShipSpace = publicGroup(view) === SHIP_GROUP;
  const dark = view.composition === "nocturne";

  // Lightbox order: the category cover, then each venue's own photography.
  const images = useMemo<MediaItem[]>(() => {
    const out: MediaItem[] = [];
    const push = (m: MediaItem | null | undefined) => {
      if (m && !out.some((x) => x.id === m.id)) out.push(m);
    };
    push(view.cover);
    for (const v of venues) {
      push(v.cover);
      v.gallery.forEach(push);
    }
    view.gallery.forEach(push);
    return out;
  }, [view, venues]);

  const requestLink =
    b.ship.settings.bookingUrl ?? b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? "#";
  const extraImages = images.filter((m) => !venues.some((v) => v.cover?.id === m.id) && m.id !== view.cover?.id);

  return (
    <div className={`min-h-screen ${dark ? "bg-chronos-ink" : "bg-chronos-ivory"}`}>
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <HeroMedia
          image={view.cover ?? images[0] ?? null}
          eyebrow={view.eyebrow}
          title={view.name}
          tagline={view.tagline}
          height={view.composition === "intimate" ? "short" : "tall"}
        />

        <section className={`mx-auto max-w-3xl px-6 py-16 text-center lg:py-24`}>
          <SectionHeading
            title={view.tagline ?? view.name}
            lead={view.intro}
            align="center"
            tone={dark ? "dark" : "light"}
          />
          {view.openingHours || view.priceNote ? (
            <dl
              className={`mt-8 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm ${
                dark ? "text-chronos-ivory/80" : "text-chronos-stone/85"
              }`}
            >
              {view.openingHours ? (
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-chronos-gold">{ui.openingHours}</dt>
                  <dd className="mt-1">{view.openingHours}</dd>
                </div>
              ) : null}
              {view.priceNote ? (
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-chronos-gold">{ui.priceNote}</dt>
                  <dd className="mt-1">{view.priceNote}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </section>

        {venues.length > 0 ? (
          <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-8 lg:pb-16">
            <p className="eyebrow mb-10 text-chronos-gold">{ui.venues}</p>
            <div className="flex flex-col gap-14 lg:gap-20">
              {venues.map((venue, i) => (
                <VenueBlock
                  key={venue.key}
                  venue={venue}
                  ui={ui}
                  reverse={i % 2 === 1}
                  dark={dark}
                  onOpen={() => {
                    const index = images.findIndex((m) => m.id === venue.cover?.id);
                    if (index >= 0) setActive(index);
                  }}
                />
              ))}
            </div>
          </section>
        ) : view.highlights.length > 0 ? (
          <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
            <SectionHeading title={ui.highlights} tone={dark ? "dark" : "light"} />
          </section>
        ) : null}

        {extraImages.length > 1 ? (
          <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            <CuratedGallery
              images={extraImages.slice(0, 4)}
              alt={view.name}
              label={ui.gallery}
              onOpen={(i) => {
                const target = extraImages[i];
                const index = target ? images.findIndex((m) => m.id === target.id) : -1;
                setActive(index >= 0 ? index : 0);
              }}
            />
          </section>
        ) : null}

        <section className={`${dark ? "bg-chronos-ink" : "bg-chronos-ivory"} pb-20 lg:pb-28`}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal
              className={`flex flex-col gap-8 border-t pt-12 sm:flex-row sm:items-end sm:justify-between ${
                dark ? "border-chronos-ivory/15" : "border-chronos-ink/10"
              }`}
            >
              <div>
                <p className="eyebrow mb-3 text-chronos-gold">{ui.partOfVoyage}</p>
                <h2
                  className={`max-w-xl text-xl leading-tight sm:text-3xl ${
                    dark ? "text-chronos-ivory" : "text-chronos-ink"
                  }`}
                >
                  {view.summary ?? view.tagline ?? view.name}
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="btn-sheen rounded-none bg-chronos-gold text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
                >
                  <LocalLink path="/itineraries">{ui.viewVoyages}</LocalLink>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className={`rounded-none text-xs font-semibold uppercase tracking-[0.18em] ${
                    dark
                      ? "border-chronos-ivory/30 text-chronos-ivory hover:bg-chronos-ivory/10"
                      : "border-chronos-ink/25 text-chronos-ink hover:bg-chronos-ink/5"
                  }`}
                >
                  <a href={requestLink} target="_blank" rel="noopener noreferrer">
                    {ui.requestJourney}
                  </a>
                </Button>
              </div>
            </Reveal>

            {next ? (
              <Reveal className="mt-14">
                <LocalLink
                  path={isShipSpace ? "/the-ship" : `/experiences/${next.slug}`}
                  className={`group flex items-center justify-between gap-6 border-t pt-8 ${
                    dark ? "border-chronos-ivory/15" : "border-chronos-ink/10"
                  }`}
                >
                  <div>
                    <p className="eyebrow mb-2 text-chronos-gold">{ui.continueAboard}</p>
                    <p className={`text-lg tracking-wide sm:text-2xl ${dark ? "text-chronos-ivory" : "text-chronos-ink"}`}>
                      {isShipSpace ? ui.exploreExperiences : next.name}
                    </p>
                  </div>
                  <div className="h-20 w-28 shrink-0 overflow-hidden sm:h-24 sm:w-40">
                    <Img
                      image={next.cover}
                      alt={next.name}
                      className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                </LocalLink>
              </Reveal>
            ) : null}
          </div>
        </section>
      </main>

      <Lightbox
        images={images}
        index={active}
        setIndex={(fn) => setActive((i) => fn(i))}
        close={() => setActive(null)}
      />

      <Footer t={t} />
    </div>
  );
}

/** One real venue: its own photography, name, location and permitted figures. */
function VenueBlock({
  venue,
  ui,
  reverse,
  dark,
  onOpen,
}: {
  venue: VenueView;
  ui: ReturnType<typeof experienceUi>;
  reverse: boolean;
  dark: boolean;
  onOpen: () => void;
}) {
  const facts = venueFacts(venue, ui);
  return (
    <Reveal className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <button
        type="button"
        onClick={onOpen}
        className={`group overflow-hidden ${reverse ? "lg:order-2" : ""}`}
        aria-label={venue.name}
      >
        <Img
          image={venue.cover}
          alt={venue.name}
          className="aspect-[4/3] w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
        />
      </button>
      <div className={reverse ? "lg:order-1" : ""}>
        <h3 className={`text-xl leading-tight tracking-[0.02em] sm:text-3xl ${dark ? "text-chronos-ivory" : "text-chronos-ink"}`}>
          {venue.name}
        </h3>
        {facts ? (
          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-chronos-gold">{facts}</p>
        ) : null}
        {venue.summary ? (
          <p
            className={`mt-5 text-base leading-relaxed ${
              dark ? "text-chronos-ivory/80" : "text-chronos-stone/90"
            }`}
          >
            {venue.summary}
          </p>
        ) : null}
      </div>
    </Reveal>
  );
}

export type { ServiceView };
