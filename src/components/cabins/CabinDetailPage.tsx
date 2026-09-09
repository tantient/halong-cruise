"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { LocalLink, useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { publicQueries, type PublicCabinBundle } from "@/lib/platform";
import { cabinUi } from "@/lib/i18n/ui-cabins";
import { pageText, toCabinLink, toCabinView } from "./cabin-view";
import { DeckPlan, DeckPlanProvider } from "./DeckPlan";

/**
 * Heritage cabin detail template. All cabin content, specs, notes and imagery
 * come from the database; only shared labels come from the UI translations.
 */
export function CabinDetailPage({ bundle, slug }: { bundle: PublicCabinBundle; slug: string }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = cabinUi(lang);
  const { data } = useSuspenseQuery({ ...publicQueries.cabinBundle(href(`/cabins/${slug}`), slug), initialData: bundle });
  const b = data ?? bundle;

  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const cabin = toCabinView(perLang.cabin);
  const others = perLang.others.map(toCabinLink);
  const page = perLang.page;
  const totalCabins = b.ship.ship.totalCabins;
  const quoteLink = b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? b.ship.settings.bookingUrl ?? "#";

  const areaDisplay = cabin.vip ? `${cabin.areaValue} ${ui.totalPrivateAreaSuffix}` : cabin.areaValue;

  const specs = [
    { label: cabin.vip ? ui.totalPrivateArea : ui.area, value: areaDisplay },
    ...(cabin.view ? [{ label: ui.view, value: cabin.view }] : []),
    ...(cabin.roomCount ? [{ label: ui.cabinsCount, value: ui.rooms(cabin.roomCount) }] : []),
    ...(cabin.capacity ? [{ label: ui.maxOccupancy, value: cabin.capacity }] : []),
    ...(cabin.bed ? [{ label: ui.bed, value: cabin.bed }] : []),
    ...(cabin.deck ? [{ label: ui.location, value: cabin.deck }] : []),
  ];

  const heroImage = cabin.cover;
  const galleryImages = [...(heroImage ? [heroImage] : []), ...cabin.gallery];

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[68vh] min-h-[440px] w-full overflow-hidden">
          {heroImage ? (
            <img src={heroImage.url} alt={heroImage.alt ?? cabin.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-chronos-ink/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <LocalLink
                path="/cabins"
                className="eyebrow mb-5 inline-block text-chronos-gold hover:text-chronos-gold/80"
              >
                ← {ui.eyebrowCabins}
              </LocalLink>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {cabin.name}
              </h1>
              {cabin.code ? (
                <p className="mt-3 text-xs uppercase tracking-[0.24em] text-chronos-gold">
                  {cabin.code}
                </p>
              ) : null}
              <p className="mt-3 max-w-xl text-chronos-ivory/85">
                {areaDisplay}
                {cabin.view ? ` · ${cabin.view}` : ""}
              </p>
              {cabin.areaNote ? (
                <p className="mt-2 max-w-xl text-xs leading-relaxed text-chronos-ivory/65">
                  {cabin.areaNote}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-20 px-6 py-20 lg:px-8 lg:py-28">
          <Reveal className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow mb-5 text-chronos-gold">{ui.eyebrowOverview}</p>
              <p className="mb-6 text-lg leading-relaxed text-chronos-stone/85">{cabin.description}</p>
              <ul className="space-y-3">
                {cabin.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-chronos-stone/85">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="divide-y divide-chronos-ink/10 border-y border-chronos-ink/10">
              {specs.map((s) => (
                <div key={s.label} className="flex items-baseline justify-between gap-6 py-4">
                  <dt className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
                    {s.label}
                  </dt>
                  <dd className="text-right text-chronos-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {cabin.areaNote ? (
            <p className="-mt-14 text-xs leading-relaxed text-chronos-stone/70">{cabin.areaNote}</p>
          ) : null}

          {cabin.amenities.length ? (
            <Reveal>
              <p className="eyebrow mb-5 text-chronos-gold">{ui.eyebrowAmenities}</p>
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {cabin.amenities.map((a) => (
                  <li
                    key={a}
                    className="flex items-start gap-2 border-b border-chronos-ink/10 pb-3 text-sm text-chronos-stone/85"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {cabin.plan.length ? (
            <Reveal>
              <p className="eyebrow mb-5 text-chronos-gold">{ui.eyebrowFloorPlan}</p>
              <DeckPlanProvider>
                <DeckPlan
                  zones={cabin.plan}
                  labels={{ area: ui.planArea, tapHint: ui.planTapHint }}
                  hint={pageText(page, "plan_hint", totalCabins)}
                />
              </DeckPlanProvider>
            </Reveal>
          ) : null}

          {galleryImages.length ? (
            <Reveal>
              <p className="eyebrow mb-5 text-chronos-gold">{ui.eyebrowGallery}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {galleryImages.map((m, i) => (
                  <img
                    key={`${m.id}-${i}`}
                    src={m.url}
                    alt={m.alt ?? `${cabin.name} ${i + 1}`}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-sm object-cover"
                  />
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal className="border-t border-chronos-ink/10 pt-16">
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div>
                <h2 className="mb-3 text-2xl tracking-[0.02em] text-chronos-ink sm:text-3xl">
                  {pageText(page, "detail_cta_title", totalCabins)}
                </h2>
                <p className="max-w-xl text-chronos-stone/85">
                  {pageText(page, "detail_cta_subtitle", totalCabins)}
                </p>
              </div>
              <Button
                asChild
                className="btn-sheen rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
              >
                <a href={quoteLink} target="_blank" rel="noopener noreferrer">
                  {ui.requestQuote}
                </a>
              </Button>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {others.map((o) => (
                <LocalLink
                  key={o.slug}
                  path={`/cabins/${o.slug}`}
                  className="group grid grid-cols-[110px_1fr] items-center gap-4 rounded-sm border border-chronos-ink/10 p-3 transition-colors hover:border-chronos-gold/60"
                >
                  {o.cover ? (
                    <img
                      src={o.cover.url}
                      alt={o.cover.alt ?? o.name}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-sm object-cover"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full rounded-sm bg-chronos-ink/10" />
                  )}
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
                      {ui.otherCabin}
                    </p>
                    <p className="mt-1 text-lg text-chronos-ink group-hover:text-chronos-gold">
                      {o.name}
                    </p>
                    {o.meta ? <p className="text-sm text-chronos-stone/75">{o.meta}</p> : null}
                  </div>
                </LocalLink>
              ))}
            </div>
          </Reveal>
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}
