"use client";

/**
 * Experience detail. Shared primitives, adaptive composition: the layout key
 * stored on each record decides how the page is built, so Dining, Sundeck, Spa
 * and Entertainment never read as the same template. Sections render only when
 * the database actually holds their data.
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
import { CuratedGallery, FeatureList, HeroMedia, Img, PanoramaBand, SectionHeading } from "./media";
import { experienceUi } from "@/lib/i18n/ui-experiences";
import { publicQueries, type PublicServicesBundle } from "@/lib/platform";

export function ExperienceDetailPage({ bundle, slug }: { bundle: PublicServicesBundle; slug: string }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = experienceUi(lang);
  const [active, setActive] = useState<number | null>(null);

  const { data } = useSuspenseQuery({
    ...publicQueries.servicesBundle(href(`/services/${slug}`)),
    initialData: bundle,
  });
  const b = data ?? bundle;
  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;

  const views = useMemo(() => perLang.services.map(toServiceView), [perLang]);
  const view = views.find((s) => s.slug === slug) ?? views[0]!;
  const next = nextInGroup(views, view.slug);
  const isShipSpace = publicGroup(view) === SHIP_GROUP;

  const images = useMemo(
    () => [
      ...(view.cover ? [view.cover] : []),
      ...view.gallery.filter((g) => g.id !== view.cover?.id),
    ],
    [view],
  );
  const galleryImages = images.slice(1);
  const requestLink =
    b.ship.settings.bookingUrl ?? b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? "#";
  const composition = view.composition ?? "editorial";

  return (
    <div className={`min-h-screen ${composition === "nocturne" ? "bg-chronos-ink" : "bg-chronos-ivory"}`}>
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <HeroMedia
          image={images[0] ?? null}
          eyebrow={view.eyebrow}
          title={view.name}
          tagline={view.tagline}
          height={composition === "intimate" ? "short" : "tall"}
        />

        {composition === "intimate" ? (
          <IntimateBody view={view} ui={ui} images={galleryImages} onOpen={(i) => setActive(i + 1)} />
        ) : composition === "panorama" ? (
          <PanoramaBody view={view} ui={ui} images={galleryImages} onOpen={(i) => setActive(i + 1)} />
        ) : composition === "nocturne" ? (
          <NocturneBody view={view} ui={ui} images={galleryImages} onOpen={(i) => setActive(i + 1)} />
        ) : (
          <EditorialBody view={view} ui={ui} images={galleryImages} onOpen={(i) => setActive(i + 1)} />
        )}

        <section
          className={`${composition === "nocturne" ? "bg-chronos-ink" : "bg-chronos-ivory"} pb-20 lg:pb-28`}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Reveal
              className={`flex flex-col gap-8 border-t pt-12 sm:flex-row sm:items-end sm:justify-between ${
                composition === "nocturne" ? "border-chronos-ivory/15" : "border-chronos-ink/10"
              }`}
            >
              <div>
                <p
                  className={`eyebrow mb-3 ${composition === "nocturne" ? "text-chronos-gold" : "text-chronos-gold"}`}
                >
                  {ui.partOfVoyage}
                </p>
                <h2
                  className={`max-w-xl text-xl leading-tight sm:text-3xl ${
                    composition === "nocturne" ? "text-chronos-ivory" : "text-chronos-ink"
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
                    composition === "nocturne"
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
                  path={isShipSpace ? "/the-ship" : `/services/${next.slug}`}
                  className="group flex items-center justify-between gap-6 border-t border-chronos-ink/10 pt-8"
                >
                  <div>
                    <p className="eyebrow mb-2 text-chronos-gold">{ui.continueAboard}</p>
                    <p
                      className={`text-lg tracking-wide sm:text-2xl ${
                        composition === "nocturne" ? "text-chronos-ivory" : "text-chronos-ink"
                      }`}
                    >
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

interface BodyProps {
  view: ServiceView;
  ui: ReturnType<typeof experienceUi>;
  images: Array<import("@/lib/platform").MediaItem>;
  onOpen: (index: number) => void;
}

function Facts({ view, ui }: { view: ServiceView; ui: BodyProps["ui"] }) {
  if (!view.openingHours && !view.priceNote) return null;
  return (
    <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-3 text-sm text-chronos-stone/85">
      {view.openingHours ? (
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-chronos-gold">{ui.openingHours}</dt>
          <dd className="mt-1 text-chronos-ink">{view.openingHours}</dd>
        </div>
      ) : null}
      {view.priceNote ? (
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-chronos-gold">{ui.priceNote}</dt>
          <dd className="mt-1 text-chronos-ink">{view.priceNote}</dd>
        </div>
      ) : null}
    </dl>
  );
}

/** Dining-style: statement, then the experience broken down, then a curated gallery. */
function EditorialBody({ view, ui, images, onOpen }: BodyProps) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <Reveal className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <h2 className="text-2xl leading-tight tracking-[0.02em] text-chronos-ink sm:text-4xl">
              {view.tagline ?? view.name}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-chronos-stone/90 sm:text-lg">
              {view.intro}
            </p>
            <Facts view={view} ui={ui} />
          </div>
          <div className="overflow-hidden">
            <Img image={images[0] ?? view.cover} alt={view.name} className="aspect-[3/4] w-full" />
          </div>
        </Reveal>
      </section>

      {view.highlights.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
          <SectionHeading title={ui.highlights} />
          <div className="mt-10">
            <FeatureList items={view.highlights} columns={2} />
          </div>
        </section>
      ) : null}

      {images.length > 1 ? (
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
          <CuratedGallery images={images.slice(1)} alt={view.name} onOpen={(i) => onOpen(i + 1)} label={ui.gallery} />
        </section>
      ) : null}
    </>
  );
}

/** Sundeck-style: horizon-first, wide bands, minimal text columns. */
function PanoramaBody({ view, ui, images, onOpen }: BodyProps) {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-16 text-center lg:py-24">
        <SectionHeading title={view.tagline ?? view.name} lead={view.intro} align="center" />
      </section>

      {images[0] ? <PanoramaBand image={images[0]} alt={view.name} /> : null}

      {view.highlights.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
          <FeatureList items={view.highlights} columns={view.highlights.length > 3 ? 3 : 2} />
          <Facts view={view} ui={ui} />
        </section>
      ) : null}

      {images.length > 1 ? (
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
          <CuratedGallery images={images.slice(1)} alt={view.name} onOpen={(i) => onOpen(i + 1)} label={ui.gallery} />
        </section>
      ) : null}
    </>
  );
}

/** Spa-style: narrow, quiet, deliberately short. */
function IntimateBody({ view, ui, images, onOpen }: BodyProps) {
  return (
    <>
      <section className="mx-auto max-w-2xl px-6 py-16 text-center lg:py-24">
        <SectionHeading title={view.tagline ?? view.name} lead={view.intro} align="center" />
        <Facts view={view} ui={ui} />
      </section>

      {images.length > 0 ? (
        <section className="mx-auto max-w-5xl px-6 pb-16 lg:pb-24">
          <div className="grid gap-3 sm:grid-cols-2">
            {images.slice(0, 2).map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => onOpen(i)}
                className="group overflow-hidden"
              >
                <Img
                  image={img}
                  alt={view.name}
                  className="h-[42vh] w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04] sm:h-[56vh]"
                />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {view.highlights.length > 0 ? (
        <section className="mx-auto max-w-3xl px-6 pb-16 lg:pb-24">
          <FeatureList items={view.highlights} columns={1} />
        </section>
      ) : null}
    </>
  );
}

/** Entertainment-style: darker, denser, more visual energy. */
function NocturneBody({ view, ui, images, onOpen }: BodyProps) {
  return (
    <div className="bg-chronos-ink">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <SectionHeading title={view.tagline ?? view.name} lead={view.intro} tone="dark" />
      </section>

      {images.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
          <div className="grid gap-3 sm:grid-cols-6">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => onOpen(i)}
                className={`group overflow-hidden ${i === 0 ? "sm:col-span-4" : "sm:col-span-2"}`}
              >
                <Img
                  image={img}
                  alt={view.name}
                  className={`w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05] ${
                    i === 0 ? "h-[38vh] sm:h-[58vh]" : "h-[24vh] sm:h-[28vh]"
                  }`}
                />
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {view.highlights.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {view.highlights.map((h, i) => (
              <Reveal key={h.title} className="border-t border-chronos-ivory/15 pt-5">
                <p className="mb-2 text-xs tracking-[0.28em] text-chronos-gold">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-base tracking-wide text-chronos-ivory">{h.title}</p>
                {h.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-chronos-ivory/75">{h.description}</p>
                ) : null}
              </Reveal>
            ))}
          </div>
          {view.openingHours || view.priceNote ? (
            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-3 text-sm text-chronos-ivory/80">
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
      ) : null}
    </div>
  );
}
