"use client";

import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { LocalLink, useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/gallery/Lightbox";
import { publicQueries, type PublicServicesBundle } from "@/lib/platform";
import { serviceUi } from "@/lib/i18n/ui-services";
import { toServiceView } from "./service-view";

/**
 * Heritage service detail template. Every service field and image comes from the
 * database for the resolved ship; only shared labels come from UI translations.
 */
export function ServicePage({ bundle, slug }: { bundle: PublicServicesBundle; slug: string }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const ui = serviceUi(lang);
  const [active, setActive] = useState<number | null>(null);

  const { data } = useSuspenseQuery({
    ...publicQueries.servicesBundle(href(`/services/${slug}`)),
    initialData: bundle,
  });
  const b = data ?? bundle;

  const perLang =
    b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;

  const views = useMemo(() => perLang.services.map(toServiceView), [perLang]);
  const service = views.find((s) => s.slug === slug) ?? views[0]!;
  const others = views.filter((s) => s.slug !== service.slug);

  const images = useMemo(
    () => [...(service.cover ? [service.cover] : []), ...service.gallery.filter((g) => g.id !== service.cover?.id)],
    [service],
  );
  const hero = images[0];
  const quoteLink = b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? b.ship.settings.bookingUrl ?? "#";

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
          {hero ? (
            <img src={hero.url} alt={hero.alt ?? service.name} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-chronos-ink/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              {service.eyebrow ? (
                <p className="eyebrow mb-5 text-chronos-gold">{service.eyebrow}</p>
              ) : null}
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {service.name}
              </h1>
              {service.tagline ? (
                <p className="mt-4 max-w-xl text-chronos-ivory/85">{service.tagline}</p>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-20 px-6 py-20 lg:px-8 lg:py-28">
          <Reveal className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-chronos-stone/90">{service.intro}</p>
              {service.openingHours || service.priceNote ? (
                <dl className="space-y-2 text-sm text-chronos-stone/80">
                  {service.openingHours ? (
                    <div className="flex gap-2">
                      <dt className="font-semibold text-chronos-ink">{ui.openingHours}:</dt>
                      <dd>{service.openingHours}</dd>
                    </div>
                  ) : null}
                  {service.priceNote ? (
                    <div className="flex gap-2">
                      <dt className="font-semibold text-chronos-ink">{ui.priceNote}:</dt>
                      <dd>{service.priceNote}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
            </div>
            {service.highlights.length > 0 ? (
              <div className="border-l border-chronos-ink/10 pl-8">
                <p className="eyebrow mb-4 text-chronos-gold">{ui.highlights}</p>
                <ul className="space-y-5">
                  {service.highlights.map((h) => (
                    <li key={h.title}>
                      <p className="text-sm font-semibold tracking-wide text-chronos-ink">{h.title}</p>
                      {h.description ? (
                        <p className="mt-1 text-sm text-chronos-stone/80">{h.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Reveal>

          {images.length > 1 ? (
            <Reveal>
              <p className="eyebrow mb-6 text-chronos-gold">{ui.gallery}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActive(i)}
                    className="group relative overflow-hidden rounded-sm bg-chronos-ink/5 text-left"
                  >
                    <img
                      src={img.url}
                      alt={img.alt ?? service.name}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chronos-ink/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal className="flex flex-col items-start gap-6 border-t border-chronos-ink/10 pt-12 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg text-chronos-ink">{ui.interested}</p>
              <p className="mt-1 text-sm text-chronos-stone/80">{ui.interestedBody}</p>
            </div>
            <Button
              asChild
              className="btn-sheen rounded-none bg-chronos-gold text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              <a href={quoteLink} target="_blank" rel="noopener noreferrer">
                {t.nav.quote}
              </a>
            </Button>
          </Reveal>

          {others.length > 0 ? (
            <Reveal>
              <p className="eyebrow mb-6 text-chronos-gold">{ui.otherServices}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((s) => {
                  const img = s.cover ?? s.gallery[0] ?? null;
                  return (
                    <LocalLink
                      key={s.slug}
                      path={`/services/${s.slug}`}
                      className="group relative overflow-hidden rounded-sm bg-chronos-ink/5"
                    >
                      {img ? (
                        <img
                          src={img.url}
                          alt={img.alt ?? s.name}
                          loading="lazy"
                          className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="aspect-[16/10] w-full bg-chronos-ink/10" />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chronos-ink/80 via-chronos-ink/10 to-transparent" />
                      <span className="absolute bottom-4 left-5 text-sm tracking-wide text-chronos-ivory">
                        {s.name}
                      </span>
                    </LocalLink>
                  );
                })}
              </div>
            </Reveal>
          ) : null}
        </div>
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
