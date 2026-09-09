"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { LocalLink, useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { publicQueries, type PublicCabinsBundle } from "@/lib/platform";
import { cabinUi, type CabinUi } from "@/lib/i18n/ui-cabins";
import { pageText, toCabinView, type CabinView } from "./cabin-view";

export function CabinsPage({ bundle }: { bundle: PublicCabinsBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = cabinUi(lang);
  const { data } = useSuspenseQuery({ ...publicQueries.cabinsBundle(href("/cabins")), initialData: bundle });
  const b = data ?? bundle;
  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const cabins = perLang.cabins.map(toCabinView);
  const page = perLang.page;
  const copy = (key: string) => pageText(page, key, b.ship.ship.totalCabins);
  const quoteLink = b.ship.settings.bookingUrl ?? b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? "#";
  const [activeSlug, setActiveSlug] = useState(cabins[0]?.slug ?? "");
  const [compareCabin, setCompareCabin] = useState<CabinView | null>(null);
  const active = cabins.find((cabin) => cabin.slug === activeSlug) ?? cabins[0] ?? null;

  useEffect(() => {
    if (active && !cabins.some((cabin) => cabin.slug === activeSlug)) setActiveSlug(active.slug);
  }, [active, activeSlug, cabins]);

  const heroImage = cabins[0]?.cover ?? null;

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />
      <main>
        <section className="relative h-[64vh] min-h-[440px] w-full overflow-hidden">
          {heroImage ? <img src={heroImage.url} alt={copy("hero_alt") || heroImage.alt || b.ship.ship.displayName} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-chronos-ink/20" />}
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/90 via-chronos-ink/25 to-chronos-ink/35" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-14 lg:px-8 lg:pb-20">
              <p className="eyebrow mb-5 text-chronos-gold">{ui.eyebrowCabins}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">{copy("hero_title")}</h1>
              <p className="mt-4 max-w-xl text-chronos-ivory/85">{copy("hero_subtitle")}</p>
              <a href="#cabin-explorer" className="mt-7 inline-flex items-center gap-2 border-b border-chronos-gold pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ivory">
                {ui.explorer}<ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="cabin-explorer" className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <Reveal className="mb-10 max-w-2xl">
            <p className="eyebrow mb-4 text-chronos-gold">{ui.explorer}</p>
            <h2 className="text-3xl tracking-[0.02em] text-chronos-ink sm:text-4xl">{copy("list_title")}</h2>
            <p className="mt-4 text-chronos-stone/85">{copy("list_subtitle")}</p>
          </Reveal>

          {active ? (
            <Reveal>
              <div className="mb-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label={ui.explorer}>
                {cabins.map((cabin, index) => (
                  <Button key={cabin.slug} type="button" role="tab" aria-selected={cabin.slug === active.slug} variant="ghost" onClick={() => setActiveSlug(cabin.slug)} className={`shrink-0 rounded-none border-b px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] ${cabin.slug === active.slug ? "border-chronos-gold text-chronos-ink" : "border-transparent text-chronos-stone/70 hover:border-chronos-ink/20 hover:bg-transparent"}`}>
                    <span className="mr-2 text-chronos-gold/70">{String(index + 1).padStart(2, "0")}</span>{cabin.name}
                  </Button>
                ))}
              </div>

              <article className="grid overflow-hidden border border-chronos-ink/10 bg-card lg:min-h-[620px] lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.75fr)]">
                <div className="relative min-h-[360px] overflow-hidden bg-chronos-ink/10 lg:min-h-full">
                  {active.cover ? <img key={active.cover.id} src={active.cover.url} alt={active.cover.alt ?? active.name} className="absolute inset-0 h-full w-full animate-in fade-in object-cover duration-500 motion-reduce:animate-none" /> : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/55 via-transparent to-transparent lg:hidden" />
                </div>
                <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
                  <div key={active.slug} className="animate-in fade-in slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
                    {active.code ? <p className="mb-3 text-xs uppercase tracking-[0.24em] text-chronos-gold">{active.code}</p> : null}
                    <h3 className="text-3xl tracking-[0.02em] text-card-foreground sm:text-4xl">{active.name}</h3>
                    {active.summary ? <p className="mt-4 text-sm leading-relaxed text-chronos-stone/85">{active.summary}</p> : null}
                    <dl className="mt-8 grid grid-cols-2 gap-x-7 gap-y-5 border-y border-chronos-ink/10 py-6">
                      {active.areaValue ? <Spec label={active.vip ? ui.totalPrivateArea : ui.area} value={active.areaValue} /> : null}
                      {active.maxGuests !== null ? <Spec label={ui.maxOccupancy} value={ui.guests(active.maxGuests)} /> : active.capacity ? <Spec label={ui.maxOccupancy} value={active.capacity} /> : null}
                      {active.bed ? <Spec label={ui.bed} value={active.bed} /> : null}
                      {active.deck ? <Spec label={ui.location} value={active.deck} /> : null}
                      {active.view ? <Spec label={ui.view} value={active.view} /> : null}
                    </dl>
                    {active.highlights.length ? <ul className="mt-7 space-y-3">{active.highlights.slice(0, 3).map((highlight) => <li key={highlight} className="flex items-start gap-3 text-sm text-chronos-stone/85"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-gold" />{highlight}</li>)}</ul> : null}
                  </div>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <Button asChild className="btn-sheen rounded-none bg-chronos-gold px-6 text-xs font-semibold uppercase tracking-[0.16em] text-chronos-ink hover:bg-chronos-gold/90"><LocalLink path={`/cabins/${active.slug}`}>{ui.exploreSuite}<ArrowRight className="ml-2 h-4 w-4" /></LocalLink></Button>
                    <Button type="button" variant="outline" onClick={() => setCompareCabin(active)} className="rounded-none border-chronos-ink/20 px-6 text-xs font-semibold uppercase tracking-[0.16em]">{ui.compareSuites}</Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ) : null}
        </section>

        <section className="border-y border-chronos-ink/10 bg-card">
          <Reveal className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8 lg:py-20">
            <div><p className="eyebrow mb-3 text-chronos-gold">{ui.findSuite}</p><h2 className="text-3xl tracking-[0.02em] text-card-foreground">{copy("cta_title") || ui.findSuite}</h2><p className="mt-3 max-w-xl text-chronos-stone/85">{copy("cta_subtitle") || ui.findSuiteCopy}</p></div>
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" disabled={!active} onClick={() => active && setCompareCabin(active)} className="rounded-none border-chronos-ink/20 px-6 text-xs font-semibold uppercase tracking-[0.16em]">{ui.compareSuites}</Button>
              <Button asChild className="btn-sheen rounded-none bg-chronos-gold px-6 text-xs font-semibold uppercase tracking-[0.16em] text-chronos-ink hover:bg-chronos-gold/90"><a href={quoteLink} target="_blank" rel="noopener noreferrer">{ui.requestRecommendation}</a></Button>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer t={t} />
      <CabinCompareDialog cabin={compareCabin} open={!!compareCabin} onClose={() => setCompareCabin(null)} ui={ui} quoteLink={quoteLink} />
    </div>
  );
}

export function CabinCompareDialog({ cabin, open, onClose, ui, quoteLink }: { cabin: CabinView | null; open: boolean; onClose: () => void; ui: CabinUi; quoteLink: string }) {
  if (!cabin) return null;
  const rows = [
    ...(cabin.areaValue ? [{ label: cabin.vip ? ui.totalPrivateArea : ui.area, value: cabin.areaValue }] : []),
    ...(cabin.maxGuests !== null ? [{ label: ui.maxOccupancy, value: ui.guests(cabin.maxGuests) }] : cabin.capacity ? [{ label: ui.maxOccupancy, value: cabin.capacity }] : []),
    ...(cabin.bed ? [{ label: ui.bed, value: cabin.bed }] : []),
    ...(cabin.deck ? [{ label: ui.location, value: cabin.deck }] : []),
    ...(cabin.view ? [{ label: ui.view, value: cabin.view }] : []),
  ];
  return <Dialog open={open} onOpenChange={(value) => !value && onClose()}><DialogContent className="max-h-[90vh] max-w-md overflow-y-auto rounded-sm border-chronos-ink/10 bg-card p-0 sm:max-w-lg">
    <div className="relative h-48 overflow-hidden bg-chronos-ink/10">{cabin.cover ? <img src={cabin.cover.url} alt={cabin.cover.alt ?? cabin.name} className="h-full w-full object-cover" /> : null}<div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 to-transparent" /><p className="absolute bottom-5 left-5 right-5 text-2xl text-chronos-ivory">{cabin.name}</p></div>
    <div className="p-6"><DialogHeader className="mb-5"><DialogTitle className="text-left text-xl text-card-foreground">{ui.compareDetails}</DialogTitle><DialogDescription className="text-left">{ui.compareIntro}</DialogDescription></DialogHeader>
      <dl className="divide-y divide-chronos-ink/10 border-y border-chronos-ink/10">{rows.map((row) => <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 py-3 text-sm"><dt className="min-w-0 text-chronos-stone/70">{row.label}</dt><dd className="max-w-[12rem] text-right text-card-foreground">{row.value}</dd></div>)}</dl>
      <div className="mt-6 grid gap-3 sm:grid-cols-2"><Button asChild className="rounded-none bg-chronos-gold text-xs font-semibold uppercase tracking-[0.16em] text-chronos-ink hover:bg-chronos-gold/90"><LocalLink path={`/cabins/${cabin.slug}`}>{ui.exploreSuite}</LocalLink></Button><Button asChild variant="outline" className="rounded-none text-xs font-semibold uppercase tracking-[0.16em]"><a href={quoteLink} target="_blank" rel="noopener noreferrer">{ui.requestQuote}</a></Button></div>
    </div>
  </DialogContent></Dialog>;
}

function Spec({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><dt className="text-[11px] uppercase tracking-[0.18em] text-chronos-stone/65">{label}</dt><dd className="mt-1 break-words text-sm text-card-foreground">{value}</dd></div>;
}
