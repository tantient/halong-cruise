"use client";

import { ArrowRight, Check, ChevronLeft } from "lucide-react";
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

export function CabinDetailPage({ bundle, slug }: { bundle: PublicCabinBundle; slug: string }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = cabinUi(lang);
  const { data } = useSuspenseQuery({ ...publicQueries.cabinBundle(href(`/cabins/${slug}`), slug), initialData: bundle });
  const b = data ?? bundle;
  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const cabin = toCabinView(perLang.cabin);
  const others = perLang.others.map(toCabinLink);
  const page = perLang.page;
  const quoteLink = b.ship.settings.bookingUrl ?? b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? "#";
  const areaDisplay = cabin.areaValue ? (cabin.vip ? `${cabin.areaValue} ${ui.totalPrivateAreaSuffix}` : cabin.areaValue) : "";
  const specs = [
    ...(areaDisplay ? [{ label: cabin.vip ? ui.totalPrivateArea : ui.area, value: areaDisplay }] : []),
    ...(cabin.capacity ? [{ label: ui.maxOccupancy, value: cabin.capacity }] : cabin.maxGuests !== null ? [{ label: ui.maxOccupancy, value: ui.guests(cabin.maxGuests) }] : []),
    ...(cabin.bed ? [{ label: ui.bed, value: cabin.bed }] : []),
    ...(cabin.deck ? [{ label: ui.location, value: cabin.deck }] : []),
    ...(cabin.view ? [{ label: ui.view, value: cabin.view }] : []),
    ...(cabin.roomCount ? [{ label: ui.cabinsCount, value: ui.rooms(cabin.roomCount) }] : []),
  ];
  const heroImage = cabin.cover;
  const gallery = cabin.gallery.filter((media, index, all) => all.findIndex((item) => item.id === media.id) === index);
  const spaceImages = gallery.slice(0, 3);
  const galleryImages = gallery.slice(3).length ? gallery.slice(3) : gallery;

  return <div className="min-h-screen bg-chronos-ivory">
    <Header lang={lang} setLang={setLang} t={t} />
    <main>
      <section className="relative h-[72vh] min-h-[520px] overflow-hidden">
        {heroImage ? <img src={heroImage.url} alt={heroImage.alt ?? cabin.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-chronos-ink/20" />}
        <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/90 via-chronos-ink/25 to-chronos-ink/35" />
        <div className="absolute inset-0 flex items-end"><div className="mx-auto w-full max-w-7xl px-6 pb-12 lg:px-8 lg:pb-16">
          <LocalLink path="/cabins" className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-gold"><ChevronLeft className="h-4 w-4" />{ui.eyebrowCabins}</LocalLink>
          {cabin.code ? <p className="mb-3 text-xs uppercase tracking-[0.24em] text-chronos-gold">{cabin.code}</p> : null}
          <h1 className="max-w-4xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl lg:text-6xl">{cabin.name}</h1>
          {cabin.summary ? <p className="mt-4 max-w-2xl text-chronos-ivory/85">{cabin.summary}</p> : null}
          <dl className="mt-7 flex max-w-3xl flex-wrap gap-x-8 gap-y-4 border-t border-chronos-ivory/25 pt-5">{specs.slice(0, 4).map((spec) => <div key={spec.label} className="min-w-[120px]"><dt className="text-[10px] uppercase tracking-[0.18em] text-chronos-ivory/60">{spec.label}</dt><dd className="mt-1 text-sm text-chronos-ivory">{spec.value}</dd></div>)}</dl>
        </div></div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-28">
        <Reveal><p className="eyebrow text-chronos-gold">{ui.whySuite}</p><h2 className="mt-4 text-3xl tracking-[0.02em] text-chronos-ink sm:text-4xl">{cabin.name}</h2></Reveal>
        <Reveal><p className="text-lg leading-relaxed text-chronos-stone/85">{cabin.description}</p>{cabin.highlights.length ? <ul className="mt-8 grid gap-4 sm:grid-cols-2">{cabin.highlights.slice(0, 3).map((highlight) => <li key={highlight} className="flex items-start gap-3 border-t border-chronos-ink/10 pt-4 text-sm text-chronos-stone/85"><Check className="mt-0.5 h-4 w-4 shrink-0 text-chronos-gold" />{highlight}</li>)}</ul> : null}</Reveal>
      </section>

      {spaceImages.length ? <section className="bg-chronos-ink py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-8"><Reveal className="mb-10"><p className="eyebrow text-chronos-gold">{ui.theSpace}</p></Reveal><div className="grid gap-4 lg:grid-cols-[1.45fr_0.75fr] lg:grid-rows-2">{spaceImages.map((media, index) => <Reveal key={media.id} className={index === 0 ? "lg:row-span-2" : ""}><img src={media.url} alt={media.alt ?? `${cabin.name} ${index + 1}`} loading="lazy" className={`w-full object-cover ${index === 0 ? "aspect-[4/3] h-full lg:aspect-auto" : "aspect-[16/10]"}`} /></Reveal>)}</div></div></section> : null}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28"><div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal><p className="eyebrow mb-5 text-chronos-gold">{ui.keyDetails}</p><dl className="divide-y divide-chronos-ink/10 border-y border-chronos-ink/10">{specs.map((spec) => <div key={spec.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-5 py-4"><dt className="min-w-0 text-xs uppercase tracking-[0.16em] text-chronos-stone/65">{spec.label}</dt><dd className="max-w-[14rem] text-right text-chronos-ink">{spec.value}</dd></div>)}</dl>{cabin.areaNote ? <p className="mt-4 text-xs leading-relaxed text-chronos-stone/65">{cabin.areaNote}</p> : null}</Reveal>
        {cabin.amenities.length ? <Reveal><p className="eyebrow mb-5 text-chronos-gold">{ui.eyebrowAmenities}</p><ul className="grid gap-x-8 sm:grid-cols-2">{cabin.amenities.map((amenity) => <li key={amenity} className="flex items-start gap-3 border-b border-chronos-ink/10 py-4 text-sm text-chronos-stone/85"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />{amenity}</li>)}</ul></Reveal> : null}
      </div></section>

      {cabin.plan.length ? <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28"><Reveal><p className="eyebrow mb-5 text-chronos-gold">{ui.eyebrowFloorPlan}</p><DeckPlanProvider><DeckPlan zones={cabin.plan} labels={{ area: ui.planArea, tapHint: ui.planTapHint }} hint={pageText(page, "plan_hint", b.ship.ship.totalCabins)} /></DeckPlanProvider></Reveal></section> : null}

      {galleryImages.length ? <section className="border-y border-chronos-ink/10 py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-8"><Reveal><p className="eyebrow mb-8 text-chronos-gold">{ui.eyebrowGallery}</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">{galleryImages.map((media, index) => <img key={`${media.id}-${index}`} src={media.url} alt={media.alt ?? `${cabin.name} ${index + 1}`} loading="lazy" className={`w-full object-cover ${index % 3 === 0 ? "aspect-[16/10] lg:col-span-8" : "aspect-[4/3] lg:col-span-4"}`} />)}</div></Reveal></div></section> : null}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        {others.length ? <Reveal><div className="mb-8 flex items-end justify-between gap-5"><div><p className="eyebrow text-chronos-gold">{ui.compareOtherSuites}</p></div><LocalLink path="/cabins" className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-chronos-ink">{ui.compareSuites}</LocalLink></div><div className="flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{others.map((other) => <LocalLink key={other.slug} path={`/cabins/${other.slug}`} className="group min-w-[78vw] snap-start border border-chronos-ink/10 bg-card sm:min-w-[330px] lg:min-w-[380px]">{other.cover ? <img src={other.cover.url} alt={other.cover.alt ?? other.name} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] motion-reduce:transition-none" /> : <div className="aspect-[16/10] bg-chronos-ink/10" />}<div className="p-5"><p className="text-xl text-card-foreground">{other.name}</p>{other.meta ? <p className="mt-2 text-sm text-chronos-stone/70">{other.meta}</p> : null}</div></LocalLink>)}</div></Reveal> : null}

        <Reveal className="mt-20 grid gap-7 border-y border-chronos-ink/10 py-12 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="eyebrow text-chronos-gold">{ui.suitableVoyages}</p><p className="mt-3 max-w-2xl text-chronos-stone/85">{ui.suitableVoyagesCopy}</p></div><Button asChild variant="outline" className="w-fit rounded-none border-chronos-ink/20 px-6 text-xs font-semibold uppercase tracking-[0.16em]"><LocalLink path="/itineraries">{ui.exploreVoyages}<ArrowRight className="ml-2 h-4 w-4" /></LocalLink></Button></Reveal>

        <Reveal className="mt-20 text-center"><p className="eyebrow text-chronos-gold">{ui.finalJourney}</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl tracking-[0.02em] text-chronos-ink sm:text-4xl">{pageText(page, "detail_cta_title", b.ship.ship.totalCabins)}</h2><p className="mx-auto mt-4 max-w-xl text-chronos-stone/85">{pageText(page, "detail_cta_subtitle", b.ship.ship.totalCabins)}</p><Button asChild className="btn-sheen mt-8 rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"><a href={quoteLink} target="_blank" rel="noopener noreferrer">{ui.requestQuote}</a></Button></Reveal>
      </section>
    </main>
    <Footer t={t} />
  </div>;
}
