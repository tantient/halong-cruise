"use client";

/**
 * The Ship — an editorial presentation of the vessel itself.
 *
 * Ship-group records of the resolved ship (architecture/exterior, lobby and
 * public spaces) supply the sections; the page copy comes from the `the-ship`
 * page record. Nothing is invented: a section is skipped when the database has
 * no record for it, and cabin figures come from ship data.
 */

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/landing/Reveal";
import { LocalLink, useLanguage } from "@/components/landing/use-language";
import { Button } from "@/components/ui/button";
import { pageText } from "@/components/cabins/cabin-view";
import { toServiceView } from "@/components/services/service-view";
import { groupServices } from "@/components/experiences/grouping";
import {
  CuratedGallery,
  EditorialPair,
  FeatureList,
  HeroMedia,
  PanoramaBand,
  SectionHeading,
} from "@/components/experiences/media";
import { experienceUi } from "@/lib/i18n/ui-experiences";
import { publicQueries, type PublicPageBundle, type PublicServicesBundle } from "@/lib/platform";

export function TheShipPage({
  bundle,
  pageBundle,
}: {
  bundle: PublicServicesBundle;
  pageBundle: PublicPageBundle | null;
}) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = experienceUi(lang);

  const { data } = useSuspenseQuery({
    ...publicQueries.servicesBundle(href("/the-ship")),
    initialData: bundle,
  });
  const b = data ?? bundle;
  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const views = useMemo(() => perLang.services.map(toServiceView), [perLang]);
  const { experiences, shipSpaces } = groupServices(views);

  const page =
    pageBundle?.languages[lang]?.page ??
    pageBundle?.languages[pageBundle.ship.defaultLanguage]?.page ??
    null;
  const copy = (key: string) => pageText(page, key, b.ship.ship.totalCabins);

  // Architecture / exterior first, then interior public spaces (record order).
  const [architecture, ...interiors] = shipSpaces;
  // Open-deck life is cross-referenced from the experiences group, not duplicated.
  const deck = experiences.find((e) => e.composition === "panorama") ?? null;

  const hero = page?.media.cover ?? architecture?.cover ?? views[0]?.cover ?? null;
  const totalCabins = b.ship.ship.totalCabins;

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <HeroMedia
          image={hero}
          eyebrow={copy("heroEyebrow") || null}
          title={page?.title ?? b.ship.ship.displayName}
          tagline={page?.intro ?? b.ship.ship.tagline}
        />

        {copy("meetBody") ? (
          <section className="mx-auto max-w-3xl px-6 py-16 text-center lg:py-24">
            <SectionHeading
              title={copy("meetTitle") || (page?.title ?? b.ship.ship.displayName)}
              lead={copy("meetBody")}
              align="center"
            />
          </section>
        ) : null}

        {architecture ? (
          <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
            <EditorialPair image={architecture.cover} alt={architecture.name} ratio="aspect-[4/3]">
              <p className="eyebrow mb-4 text-chronos-gold">{architecture.eyebrow ?? ui.architecture}</p>
              <h2 className="text-2xl leading-tight tracking-[0.02em] text-chronos-ink sm:text-4xl">
                {architecture.name}
              </h2>
              {architecture.tagline ? (
                <p className="mt-4 text-base text-chronos-stone/85 sm:text-lg">{architecture.tagline}</p>
              ) : null}
              <p className="mt-6 text-base leading-relaxed text-chronos-stone/90">{architecture.intro}</p>
            </EditorialPair>
            {architecture.highlights.length > 0 ? (
              <div className="mt-12">
                <FeatureList items={architecture.highlights} columns={3} />
              </div>
            ) : null}
          </section>
        ) : null}

        {interiors.map((space) => (
          <section key={space.slug} className="pb-16 lg:pb-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <SectionHeading
                eyebrow={space.eyebrow ?? ui.publicSpaces}
                title={space.name}
                lead={space.intro}
              />
            </div>
            <div className="mx-auto mt-10 max-w-7xl px-6 lg:px-8">
              <CuratedGallery
                images={[...(space.cover ? [space.cover] : []), ...space.gallery.filter((g) => g.id !== space.cover?.id)]}
                alt={space.name}
              />
              {space.highlights.length > 0 ? (
                <div className="mt-12">
                  <FeatureList items={space.highlights} columns={2} />
                </div>
              ) : null}
            </div>
          </section>
        ))}

        {deck ? (
          <section className="pb-16 lg:pb-24">
            <PanoramaBand image={deck.cover} alt={deck.name}>
              <div className="max-w-xl">
                <p className="eyebrow mb-3 text-chronos-gold">{ui.aboveWater}</p>
                <h2 className="text-2xl leading-tight text-chronos-ivory sm:text-4xl">{deck.name}</h2>
                {deck.tagline ? (
                  <p className="mt-3 text-sm text-chronos-ivory/85 sm:text-base">{deck.tagline}</p>
                ) : null}
                <LocalLink
                  path={`/services/${deck.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-chronos-gold"
                >
                  {ui.discover}
                  <span aria-hidden="true">→</span>
                </LocalLink>
              </div>
            </PanoramaBand>
          </section>
        ) : null}

        {totalCabins ? (
          <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
            <Reveal className="flex flex-col gap-8 border-t border-chronos-ink/10 pt-12 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl leading-tight tracking-[0.02em] text-chronos-ink sm:text-4xl">
                  {copy("cabinsTitle") || String(totalCabins)}
                </h2>
                {copy("cabinsBody") ? (
                  <p className="mt-5 text-base leading-relaxed text-chronos-stone/90">{copy("cabinsBody")}</p>
                ) : null}
              </div>
              <Button
                asChild
                className="btn-sheen rounded-none bg-chronos-gold text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
              >
                <LocalLink path="/cabins">{ui.exploreCabins}</LocalLink>
              </Button>
            </Reveal>
          </section>
        ) : null}

        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28">
          <Reveal className="border-t border-chronos-ink/10 pt-12">
            <h2 className="max-w-2xl text-2xl leading-tight tracking-[0.02em] text-chronos-ink sm:text-4xl">
              {copy("closingTitle") || ui.explore}
            </h2>
            {copy("closingBody") ? (
              <p className="mt-5 max-w-xl text-base leading-relaxed text-chronos-stone/90">
                {copy("closingBody")}
              </p>
            ) : null}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="rounded-none border-chronos-ink/25 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-ink/5"
              >
                <LocalLink path="/experiences">{ui.exploreExperiences}</LocalLink>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-chronos-ink/25 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-ink/5"
              >
                <LocalLink path="/itineraries">{ui.viewVoyages}</LocalLink>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer t={t} />
    </div>
  );
}
