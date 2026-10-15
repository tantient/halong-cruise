"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { journeyCtaUi } from "@/lib/i18n/ui-forms";
import { LocalLink } from "@/lib/i18n/language-context";
import { publicQueries, type PublicPageBundle } from "@/lib/platform";

export const GUIDE_SLUG = "ha-long-bay-guide";
export const GUIDE_PATH = "/ha-long-bay-guide";

/** Editorial travel guide; all copy comes from the `ha-long-bay-guide` page record. */
export function GuidePage({ bundle }: { bundle: PublicPageBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const cta = journeyCtaUi(lang);
  const { data } = useSuspenseQuery({ ...publicQueries.pageBundle(href(GUIDE_PATH), GUIDE_SLUG), initialData: bundle });
  const b = data ?? bundle;
  const page = (b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0])?.page ?? null;
  const eyebrow = typeof page?.text["eyebrow"] === "string" ? (page.text["eyebrow"] as string) : "";
  const raw = page?.text["sections"];
  const sections = Array.isArray(raw)
    ? raw.flatMap((s) => {
        if (!s || typeof s !== "object" || Array.isArray(s)) return [];
        const r = s as Record<string, unknown>;
        return typeof r["title"] === "string" && typeof r["body"] === "string" ? [{ title: r["title"], body: r["body"] }] : [];
      })
    : [];

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} solid />
      <main className="pt-32 pb-20 lg:pt-40">
        <article className="mx-auto max-w-3xl px-6 lg:px-8">
          <p className="eyebrow mb-5 text-chronos-gold">{eyebrow}</p>
          <h1 className="mb-6 text-4xl tracking-[0.02em] text-chronos-ink sm:text-5xl">{page?.title}</h1>
          {page?.intro ? <p className="mb-14 text-lg leading-relaxed text-chronos-stone/90">{page.intro}</p> : null}
          {sections.map((s) => (
            <Reveal key={s.title}>
              <section className="mb-12 border-t border-chronos-gold/30 pt-8">
                <h2 className="mb-4 text-2xl tracking-[0.02em] text-chronos-ink sm:text-3xl">{s.title}</h2>
                <p className="whitespace-pre-line text-base leading-relaxed text-chronos-stone/90 sm:text-lg">{s.body}</p>
              </section>
            </Reveal>
          ))}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild className="btn-sheen rounded-none bg-chronos-gold px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-gold/90">
              <LocalLink path="/itineraries">{cta.exploreVoyages}</LocalLink>
            </Button>
            <Button asChild variant="outline" className="rounded-none border-chronos-ink/20 bg-transparent px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ink hover:bg-chronos-ink/5">
              <LocalLink path="/cabins">{cta.exploreSuites}</LocalLink>
            </Button>
          </div>
        </article>
      </main>
      <Footer t={t} />
    </div>
  );
}
