"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { LocalLink, useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { publicQueries, type PublicCabinsBundle } from "@/lib/platform";
import { cabinUi, type CabinUi } from "@/lib/i18n/ui-cabins";
import { pageText, toCabinView, type CabinView } from "./cabin-view";

/**
 * Heritage cabins index template. Cabin data, specs and page copy come from the
 * database through the public read layer; shared labels come from the UI
 * translations.
 */
export function CabinsPage({ bundle }: { bundle: PublicCabinsBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = cabinUi(lang);
  const { data } = useSuspenseQuery({ ...publicQueries.cabinsBundle(href("/cabins")), initialData: bundle });
  const b = data ?? bundle;

  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const cabins = perLang.cabins.map(toCabinView);
  const page = perLang.page;
  const totalCabins = b.ship.ship.totalCabins;
  const copy = (key: string) => pageText(page, key, totalCabins);

  const vipCabins = cabins.filter((c) => c.vip);
  const areaNote = cabins.find((c) => c.areaNote)?.areaNote ?? null;
  const heroImage = cabins[0]?.cover ?? null;
  const quoteLink = b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? b.ship.settings.bookingUrl ?? "#";
  const [compareCabin, setCompareCabin] = useState<CabinView | null>(null);

  const areaLabel = (c: CabinView) => (c.vip ? ui.totalPrivateArea : ui.area);
  const areaValue = (c: CabinView) => (c.vip ? `${c.areaValue} ${ui.totalPrivateAreaSuffix}` : c.areaValue);

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden">
          {heroImage ? (
            <img
              src={heroImage.url}
              alt={copy("hero_alt") || heroImage.alt || b.ship.ship.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-chronos-ink/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{ui.eyebrowCabins}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {copy("hero_title")}
              </h1>
              <p className="mt-4 max-w-xl text-chronos-ivory/85">{copy("hero_subtitle")}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <Reveal className="mb-14 max-w-2xl">
            <p className="eyebrow mb-5 text-chronos-gold">{ui.eyebrowCategories}</p>
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink sm:text-4xl">
              {copy("list_title")}
            </h2>
            <p className="text-chronos-stone/85">{copy("list_subtitle")}</p>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {cabins.map((cabin, index) => (
              <Reveal key={cabin.slug} delay={80 * index}>
                <article className="flex h-full flex-col overflow-hidden rounded-sm border border-chronos-ink/10 bg-card">
                  <LocalLink
                    path={`/cabins/${cabin.slug}`}
                    className="group block overflow-hidden"
                  >
                    {cabin.cover ? (
                      <img
                        src={cabin.cover.url}
                        alt={cabin.cover.alt ?? cabin.name}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="aspect-[4/3] w-full bg-chronos-ink/10" />
                    )}
                  </LocalLink>

                  <div className="flex flex-1 flex-col p-7">
                    {cabin.code ? (
                      <p className="mb-2 text-xs uppercase tracking-[0.24em] text-chronos-gold">
                        {cabin.code}
                      </p>
                    ) : null}
                    <h3 className="mb-3 text-2xl tracking-[0.02em] text-card-foreground">
                      {cabin.name}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-chronos-stone/85">
                      {cabin.summary}
                    </p>

                    <dl className="mb-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-chronos-ink/10 py-5">
                      <Spec label={areaLabel(cabin)} value={areaValue(cabin)} />
                      {cabin.roomCount ? (
                        <Spec label={ui.cabinsCount} value={ui.rooms(cabin.roomCount)} />
                      ) : null}
                      {cabin.bed ? <Spec label={ui.bed} value={cabin.bed} wide /> : null}
                      {cabin.maxGuests !== null ? (
                        <Spec label={ui.maxOccupancy} value={ui.guests(cabin.maxGuests)} wide />
                      ) : null}
                    </dl>

                    {cabin.areaNote ? (
                      <p className="-mt-3 mb-6 text-xs leading-relaxed text-chronos-stone/70">
                        {cabin.areaNote}
                      </p>
                    ) : null}

                    <div className="mt-auto flex flex-wrap items-center gap-3">
                      <Button
                        asChild
                        className="btn-sheen rounded-none bg-chronos-gold px-5 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
                      >
                        <a href={quoteLink} target="_blank" rel="noopener noreferrer">
                          {ui.requestQuote}
                        </a>
                      </Button>
                      <LocalLink
                        path={`/cabins/${cabin.slug}`}
                        className="border-b border-chronos-gold pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-card-foreground hover:text-chronos-gold"
                      >
                        {ui.viewDetails}
                      </LocalLink>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCompareCabin(cabin)}
                        className="rounded-none border-chronos-gold/50 text-xs font-semibold uppercase tracking-[0.18em] text-card-foreground hover:border-chronos-gold hover:bg-chronos-gold/10 hover:text-chronos-gold"
                      >
                        {ui.compareDetails}
                      </Button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          {vipCabins.length ? (
            <Reveal className="mt-16">
              <p className="eyebrow mb-5 text-chronos-gold">{ui.eyebrowComparison}</p>

              {/* Desktop / tablet: table keeps the requested column structure */}
              <div className="hidden overflow-x-auto rounded-sm border border-chronos-ink/10 sm:block">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-chronos-ink/[0.04] text-xs uppercase tracking-[0.2em] text-chronos-stone/70">
                      <th className="sticky left-0 z-10 bg-chronos-ink/[0.04] px-5 py-4 font-medium shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]">
                        {ui.cabinType}
                      </th>
                      <th className="px-5 py-4 font-medium">{ui.totalPrivateArea}</th>
                      <th className="px-5 py-4 font-medium">{ui.bed}</th>
                      <th className="px-5 py-4 font-medium">{ui.privateTerrace}</th>
                      <th className="px-5 py-4 font-medium">{ui.outdoorWhirlpool}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vipCabins.map((c) => (
                      <tr key={c.slug} className="border-t border-chronos-ink/10 text-chronos-ink">
                        <td className="sticky left-0 z-10 bg-chronos-ivory px-5 py-4 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.08)]">
                          {c.code}
                        </td>
                        <td className="px-5 py-4">{c.areaValue}</td>
                        <td className="px-5 py-4">{ui.king}</td>
                        <td className="px-5 py-4">{ui.included}</td>
                        <td className="px-5 py-4">{ui.included}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile: same 5 data points, no overflow, card layout */}
              <div className="space-y-4 sm:hidden">
                {vipCabins.map((c) => (
                  <article key={c.slug} className="rounded-sm border border-chronos-ink/10 bg-card p-5">
                    <p className="mb-1 text-xs uppercase tracking-[0.2em] text-chronos-stone/70">
                      {ui.cabinType}
                    </p>
                    <p className="mb-4 text-sm font-medium text-card-foreground">{c.code}</p>
                    <dl className="space-y-3 text-xs">
                      <div className="flex items-start justify-between gap-4 border-b border-chronos-ink/10 pb-3">
                        <dt className="text-chronos-stone/70">{ui.totalPrivateArea}</dt>
                        <dd className="font-medium text-card-foreground">{c.areaValue}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4 border-b border-chronos-ink/10 pb-3">
                        <dt className="text-chronos-stone/70">{ui.bed}</dt>
                        <dd className="font-medium text-card-foreground">{ui.king}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4 border-b border-chronos-ink/10 pb-3">
                        <dt className="text-chronos-stone/70">{ui.privateTerrace}</dt>
                        <dd className="font-medium text-card-foreground">{ui.included}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-chronos-stone/70">{ui.outdoorWhirlpool}</dt>
                        <dd className="font-medium text-card-foreground">{ui.included}</dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>

              {areaNote ? (
                <p className="mt-4 text-xs leading-relaxed text-chronos-stone/70">{areaNote}</p>
              ) : null}
            </Reveal>
          ) : null}

          <Reveal className="mt-8 rounded-sm border border-chronos-gold/30 bg-chronos-gold/5 p-6">
            <p className="text-sm leading-relaxed text-chronos-stone/85">{copy("junior_note")}</p>
          </Reveal>

          <Reveal className="mt-24 border-t border-chronos-ink/10 pt-16 text-center">
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">{copy("cta_title")}</h2>
            <p className="mx-auto mb-8 max-w-xl text-chronos-stone/85">{copy("cta_subtitle")}</p>
            <Button
              asChild
              className="btn-sheen rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              <a href={quoteLink} target="_blank" rel="noopener noreferrer">
                {ui.requestQuote}
              </a>
            </Button>
          </Reveal>
        </div>
      </main>

      <Footer t={t} />

      <CabinCompareDialog
        cabin={compareCabin}
        open={!!compareCabin}
        onClose={() => setCompareCabin(null)}
        ui={ui}
        quoteLink={quoteLink}
      />
    </div>
  );
}

function CabinCompareDialog({
  cabin,
  open,
  onClose,
  ui,
  quoteLink,
}: {
  cabin: CabinView | null;
  open: boolean;
  onClose: () => void;
  ui: CabinUi;
  quoteLink: string;
}) {
  // Giữ lại dữ liệu phòng cuối cùng để dialog có animation đóng mượt
  const [shown, setShown] = useState<CabinView | null>(cabin);
  const [loading, setLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    if (cabin) {
      setShown(cabin);
      setImgLoaded(false);
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 420);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [cabin]);

  if (!shown) return null;

  const rows = [
    { label: ui.cabinType, value: shown.name },
    ...(shown.code ? [{ label: ui.technicalCode, value: shown.code }] : []),
    {
      label: shown.vip ? ui.totalPrivateArea : ui.area,
      value: shown.vip ? `${shown.areaValue} ${ui.totalPrivateAreaSuffix}` : shown.areaValue,
    },
    ...(shown.bed ? [{ label: ui.bed, value: shown.bed }] : []),
    ...(shown.maxGuests !== null ? [{ label: ui.maxOccupancy, value: ui.guests(shown.maxGuests) }] : []),
    ...(shown.roomCount ? [{ label: ui.cabinsCount, value: ui.rooms(shown.roomCount) }] : []),
    ...(shown.view ? [{ label: ui.view, value: shown.view }] : []),
    ...(shown.vip
      ? [
          { label: ui.privateTerrace, value: ui.included },
          { label: ui.outdoorWhirlpool, value: ui.included },
        ]
      : []),
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-md overflow-y-auto rounded-sm border-chronos-ink/10 bg-card p-0 duration-300 sm:max-w-lg">
        <div className="relative h-40 w-full overflow-hidden bg-chronos-ink/10 sm:h-48">
          {!imgLoaded ? <Skeleton className="absolute inset-0 h-full w-full rounded-none" /> : null}
          {shown.cover ? (
            <img
              src={shown.cover.url}
              alt={shown.cover.alt ?? shown.name}
              onLoad={() => setImgLoaded(true)}
              className={cn(
                "h-full w-full object-cover transition-all duration-500",
                imgLoaded ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-sm",
              )}
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/80 via-chronos-ink/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            {shown.code ? (
              <p className="mb-1 text-xs uppercase tracking-[0.24em] text-chronos-gold">{shown.code}</p>
            ) : null}
            <p className="text-xl text-chronos-ivory">{shown.name}</p>
          </div>
        </div>

        <div className="px-5 pb-6 pt-2">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-left text-lg tracking-[0.02em] text-card-foreground">
              {ui.compareDetails}
            </DialogTitle>
            <DialogDescription className="text-left text-xs text-muted-foreground">
              {loading ? ui.compareLoading : ui.compareIntro}
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div
              aria-busy="true"
              aria-live="polite"
              className="divide-y divide-chronos-ink/10 border-y border-chronos-ink/10"
            >
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3">
                  <Skeleton className="h-3 w-24 rounded-sm" />
                  <Skeleton className="h-3 w-28 rounded-sm" />
                </div>
              ))}
            </div>
          ) : (
            <dl className="animate-in fade-in slide-in-from-bottom-1 divide-y divide-chronos-ink/10 border-y border-chronos-ink/10 text-sm duration-300">
              {rows.map((r) => (
                <div key={r.label} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-xs uppercase tracking-[0.2em] text-chronos-stone/70">{r.label}</dt>
                  <dd className="text-right text-card-foreground">{r.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {shown.areaNote && !loading ? (
            <p className="animate-in fade-in mt-3 text-xs leading-relaxed text-chronos-stone/70 duration-300">
              {shown.areaNote}
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              asChild
              disabled={loading}
              className="btn-sheen flex-1 rounded-none bg-chronos-gold text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink transition-opacity hover:bg-chronos-gold/90"
            >
              <a href={quoteLink} target="_blank" rel="noopener noreferrer">
                {ui.requestQuote}
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-none border-chronos-ink/20 text-xs font-semibold uppercase tracking-[0.18em] text-card-foreground hover:bg-chronos-ink/5"
            >
              {ui.close}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Spec({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2 sm:col-span-1" : ""}>
      <dt className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">{label}</dt>
      <dd className="mt-1 text-sm text-card-foreground">{value}</dd>
    </div>
  );
}
