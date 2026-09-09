"use client";

import { Check } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { publicQueries, type PublicOffer, type PublicOffersBundle, type PublicPage } from "@/lib/platform";

/** Editorial copy of the offers page. */
function copyOf(page: PublicPage | null, key: string): string {
  const v = page?.text[key];
  return typeof v === "string" ? v : "";
}

function lines(value: string | null): string[] {
  return (value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function highlightsOf(offer: PublicOffer): string[] {
  return offer.highlights.filter((h): h is string => typeof h === "string" && h.trim() !== "");
}

/**
 * Heritage offers template. Offers, badges, terms, highlights, images and
 * page copy all come from the database through the public read layer.
 */
export function OffersPage({ bundle }: { bundle: PublicOffersBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const { data } = useSuspenseQuery({ ...publicQueries.offersBundle(href("/offers")), initialData: bundle });
  const b = data ?? bundle;

  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const { offers, page } = perLang;
  const hero = page?.media.cover ?? offers[0]?.media.cover ?? null;
  const bookingLink = b.ship.settings.bookingUrl ?? b.ship.settings.whatsapp ?? b.ship.settings.zalo ?? "#";

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          {hero ? (
            <img
              src={hero.url}
              alt={copyOf(page, "hero_alt") || hero.alt || b.ship.ship.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-chronos-ink/80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/30 to-chronos-ink/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{copyOf(page, "eyebrow")}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl">
                {page?.title ?? ""}
              </h1>
              <p className="mt-4 max-w-xl text-chronos-ivory/85">{page?.intro ?? ""}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-16 px-6 py-24 lg:px-8 lg:py-32">
          {offers.map((offer, index) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              index={index}
              termsLabel={t.offers.terms}
              cta={t.offers.cta}
              bookingLink={bookingLink}
            />
          ))}

          <Reveal className="border-t border-chronos-ink/10 pt-16 text-center">
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">{copyOf(page, "cta_title")}</h2>
            <p className="mx-auto mb-8 max-w-xl text-chronos-stone/85">{copyOf(page, "cta_body")}</p>
            <Button
              asChild
              className="btn-sheen rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              <a href={bookingLink} target="_blank" rel="noopener noreferrer">
                {t.offers.cta}
              </a>
            </Button>
          </Reveal>
        </div>
      </main>

      <Footer t={t} />
    </div>
  );
}

function OfferCard({
  offer,
  index,
  termsLabel,
  cta,
  bookingLink,
}: {
  offer: PublicOffer;
  index: number;
  termsLabel: string;
  cta: string;
  bookingLink: string;
}) {
  const flip = index % 2 === 1;
  const image = offer.media.cover ?? offer.media.all[0] ?? null;
  const badge = offer.badge ?? offer.valueText;
  const terms = lines(offer.terms);

  return (
    <Reveal>
      <div className="overflow-hidden rounded-sm border border-chronos-ink/10 bg-white">
        <div className={`grid lg:grid-cols-2 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <div className="relative h-72 lg:h-auto">
            {image ? (
              <img src={image.url} alt={image.alt ?? offer.name} loading="lazy" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-chronos-ink/10" />
            )}
            {badge ? (
              <div className="absolute left-5 top-5 rounded-sm bg-chronos-gold px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink">
                {badge}
              </div>
            ) : null}
          </div>

          <div className="p-8 lg:p-10">
            <p className="eyebrow mb-4 text-chronos-gold">{String(index + 1).padStart(2, "0")}</p>
            <h2 className="mb-4 text-3xl tracking-[0.02em] text-chronos-ink">{offer.name}</h2>
            {offer.description ? <p className="mb-6 text-chronos-stone/85">{offer.description}</p> : null}

            <ul className="mb-6 grid gap-2 sm:grid-cols-2">
              {highlightsOf(offer).map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-chronos-stone/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-chronos-gold" />
                  {h}
                </li>
              ))}
            </ul>

            {terms.length > 0 ? (
              <div className="mb-6 border-t border-chronos-ink/10 pt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink">{termsLabel}</p>
                <ul className="space-y-1.5 text-sm text-chronos-stone/70">
                  {terms.map((term) => (
                    <li key={term} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-chronos-stone/50" />
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Button
              asChild
              className="btn-sheen rounded-none bg-chronos-gold px-6 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90"
            >
              <a href={bookingLink} target="_blank" rel="noopener noreferrer">
                {cta}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
