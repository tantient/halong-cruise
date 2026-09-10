"use client";

/**
 * Experiences landing — "Life aboard".
 *
 * An editorial sequence, not a catalogue: every experience category of the
 * resolved ship is rendered with the composition stored on its own record, and
 * each chapter names the real venues that belong to that category. All copy,
 * figures and media come from the database.
 */

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/Reveal";
import { LocalLink, useLanguage } from "@/components/landing/use-language";
import { Button } from "@/components/ui/button";
import { pageText } from "@/components/cabins/cabin-view";
import { toServiceView, type ServiceView } from "@/components/services/service-view";
import { groupServices } from "./grouping";
import { venueListItems, venuesInCategory, type VenueView } from "./venue-view";
import { CuratedGallery, EditorialPair, FeatureList, HeroMedia, Img, PanoramaBand, SectionHeading } from "./media";
import { experienceUi } from "@/lib/i18n/ui-experiences";
import { publicQueries, type PublicPageBundle, type PublicServicesBundle, type PublicVenue } from "@/lib/platform";

export function ExperiencesPage({
  bundle,
  pageBundle,
}: {
  bundle: PublicServicesBundle;
  pageBundle: PublicPageBundle | null;
}) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = experienceUi(lang);

  const { data } = useSuspenseQuery({
    ...publicQueries.servicesBundle(href("/experiences")),
    initialData: bundle,
  });
  const b = data ?? bundle;
  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const views = useMemo(() => perLang.services.map(toServiceView), [perLang]);
  const venues: PublicVenue[] = perLang.venues ?? [];
  const { experiences } = groupServices(views);

  const page =
    pageBundle?.languages[lang]?.page ??
    pageBundle?.languages[pageBundle.ship.defaultLanguage]?.page ??
    null;
  const copy = (key: string) => pageText(page, key, b.ship.ship.totalCabins);

  const hero = experiences[0]?.cover ?? views[0]?.cover ?? null;
  const requestLink =
    b.ship.settings.bookingUrl ?? b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? "#";

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <HeroMedia
          image={hero}
          eyebrow={copy("heroEyebrow") || null}
          title={page?.title ?? ""}
          tagline={page?.intro ?? null}
        />

        {experiences.map((exp, i) => (
          <ExperienceChapter
            key={exp.slug}
            view={exp}
            index={i}
            ui={ui}
            venues={venuesInCategory(venues, exp.category)}
          />
        ))}

        <Reveal className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="border-t border-chronos-ink/10 pt-12">
            <h2 className="max-w-2xl text-2xl leading-tight tracking-[0.02em] text-chronos-ink sm:text-4xl">
              {copy("closingTitle")}
            </h2>
            {copy("closingBody") ? (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-chronos-stone/90">
                {copy("closingBody")}
              </p>
            ) : null}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="btn-sheen rounded-none bg-chronos-gold text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
              >
                <LocalLink path="/itineraries">{ui.viewVoyages}</LocalLink>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-chronos-ink/25 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-ink/5"
              >
                <a href={requestLink} target="_blank" rel="noopener noreferrer">
                  {ui.requestJourney}
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </main>

      <Footer t={t} />
    </div>
  );
}


/** One experience category, composed according to the layout key on its record. */
function ExperienceChapter({
  view,
  index,
  ui,
  venues,
}: {
  view: ServiceView;
  index: number;
  ui: ReturnType<typeof experienceUi>;
  venues: VenueView[];
}) {
  const composition = view.composition ?? (index % 2 === 0 ? "editorial" : "panorama");
  const items = venues.length > 0 ? venueListItems(venues, ui) : view.highlights;
  const link = (
    <LocalLink
      path={`/experiences/${view.slug}`}
      className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-chronos-gold transition-opacity hover:opacity-80"
    >
      {ui.discover} — {view.name}
      <span aria-hidden="true">→</span>
    </LocalLink>
  );
  const venueImages = venues.map((v) => v.cover).filter((m): m is NonNullable<typeof m> => m !== null);

  if (composition === "panorama") {
    return (
      <section className="py-16 lg:py-24">
        <PanoramaBand image={view.cover} alt={view.name}>
          <div className="max-w-xl">
            {view.eyebrow ? <p className="eyebrow mb-3 text-chronos-gold">{view.eyebrow}</p> : null}
            <h2 className="text-2xl leading-tight text-chronos-ivory sm:text-4xl">{view.name}</h2>
            {view.tagline ? (
              <p className="mt-3 text-sm text-chronos-ivory/85 sm:text-base">{view.tagline}</p>
            ) : null}
          </div>
        </PanoramaBand>
        <div className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
          <Reveal className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <p className="text-base leading-relaxed text-chronos-stone/90 sm:text-lg">{view.intro}</p>
            <div>
              <FeatureList items={items.slice(0, 3)} columns={1} />
              {link}
            </div>
          </Reveal>
        </div>
      </section>
    );
  }

  if (composition === "intimate") {
    return (
      <section className="bg-chronos-ivory py-16 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <SectionHeading eyebrow={view.eyebrow} title={view.name} lead={view.intro} align="center" />
          <div className="mt-12 grid gap-3 sm:grid-cols-2">
            {(venueImages.length > 1
              ? venueImages.slice(0, 2)
              : [view.cover, view.gallery.find((g) => g.id !== view.cover?.id) ?? null]
            ).map((img, i) => (
              <div key={img?.id ?? i} className="overflow-hidden">
                <Img image={img} alt={view.name} className="h-[38vh] w-full sm:h-[46vh]" />
              </div>
            ))}
          </div>
          {items.length > 0 ? (
            <div className="mt-12 text-left">
              <FeatureList items={items} columns={2} />
            </div>
          ) : null}
          {link}
        </div>
      </section>
    );
  }

  if (composition === "nocturne") {
    return (
      <section className="bg-chronos-ink py-16 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <SectionHeading eyebrow={view.eyebrow} title={view.name} lead={view.intro} tone="dark" />
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(venueImages.length > 0
              ? venueImages
              : [view.cover, ...view.gallery.filter((g) => g.id !== view.cover?.id)]
            )
              .slice(0, 4)
              .map((img, i) => (
                <div key={img?.id ?? i} className="overflow-hidden">
                  <Img
                    image={img}
                    alt={view.name}
                    className={`w-full ${i % 2 === 0 ? "h-[30vh] sm:h-[42vh]" : "h-[24vh] sm:h-[34vh] sm:self-end"}`}
                  />
                </div>
              ))}
          </div>
          {items.length > 0 ? (
            <div className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
              {items.map((item, i) => (
                <div key={item.title} className="border-t border-chronos-ivory/15 pt-5">
                  <p className="mb-2 text-xs tracking-[0.28em] text-chronos-gold">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-base tracking-wide text-chronos-ivory">{item.title}</p>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-chronos-ivory/75">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          <LocalLink
            path={`/experiences/${view.slug}`}
            className="mt-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-chronos-gold transition-opacity hover:opacity-80"
          >
            {ui.discover} — {view.name}
            <span aria-hidden="true">→</span>
          </LocalLink>
        </div>
      </section>
    );
  }

  // editorial (default): dominant image with copy beside it
  return (
    <section className="py-16 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <EditorialPair image={view.cover} alt={view.name} ratio="aspect-[4/5] lg:aspect-[3/4]">
          {view.eyebrow ? <p className="eyebrow mb-4 text-chronos-gold">{view.eyebrow}</p> : null}
          <h2 className="text-2xl leading-tight tracking-[0.02em] text-chronos-ink sm:text-4xl">
            {view.name}
          </h2>
          {view.tagline ? (
            <p className="mt-4 text-base text-chronos-stone/85 sm:text-lg">{view.tagline}</p>
          ) : null}
          <p className="mt-6 text-base leading-relaxed text-chronos-stone/90">{view.intro}</p>
          {items.length > 0 ? (
            <div className="mt-8">
              <FeatureList items={items} columns={1} />
            </div>
          ) : null}
          {link}
        </EditorialPair>
        {venueImages.length > 1 || view.gallery.length > 1 ? (
          <div className="mt-10">
            <CuratedGallery
              images={
                venueImages.length > 1
                  ? venueImages.slice(0, 3)
                  : view.gallery.filter((g) => g.id !== view.cover?.id).slice(0, 3)
              }
              alt={view.name}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
