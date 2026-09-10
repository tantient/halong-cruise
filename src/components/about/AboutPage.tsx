"use client";

import { Anchor, ChefHat, ConciergeBell, Heart, Leaf, ShieldCheck, Waves, type LucideIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { publicQueries, type PublicPage, type PublicPageBundle } from "@/lib/platform";

const featureIcons: LucideIcon[] = [Waves, ChefHat, ConciergeBell, Anchor];
const valueIcons: LucideIcon[] = [Heart, ShieldCheck, Leaf, Anchor];

interface Item {
  title: string;
  desc: string;
}

function str(page: PublicPage | null, key: string): string {
  const v = page?.text[key];
  return typeof v === "string" ? v : "";
}

/** `[{ title, desc }]` lists stored in the page copy. */
function items(page: PublicPage | null, key: string): Item[] {
  const raw = page?.text[key];
  if (!Array.isArray(raw)) return [];
  const out: Item[] = [];
  for (const entry of raw) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
    const row = entry as Record<string, unknown>;
    const title = typeof row["title"] === "string" ? row["title"] : "";
    if (!title) continue;
    out.push({ title, desc: typeof row["desc"] === "string" ? row["desc"] : "" });
  }
  return out;
}

/** Heritage about template — all copy and imagery come from the database. */
export function AboutPage({ bundle }: { bundle: PublicPageBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const { data } = useSuspenseQuery({
    ...publicQueries.pageBundle(href("/about"), "about"),
    initialData: bundle,
  });
  const b = data ?? bundle;

  const page = (b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0])?.page ?? null;
  const hero = page?.media.cover ?? null;
  const supporting = page?.media.gallery ?? [];
  const features = items(page, "features");
  const values = items(page, "values");

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main>
        <section className="relative h-[65vh] min-h-[420px] w-full overflow-hidden">
          {hero ? (
            <img
              src={hero.url}
              alt={str(page, "hero_alt") || hero.alt || b.ship.ship.displayName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-chronos-ink/80" />
          )}
          <div className="hero-local-scrim absolute inset-0" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8">
              <p className="eyebrow mb-5 text-chronos-gold">{str(page, "eyebrow")}</p>
              <h1 className="max-w-3xl text-4xl tracking-[0.02em] text-chronos-ivory sm:text-5xl lg:text-6xl">
                {page?.title ?? ""}
              </h1>
            </div>
          </div>
        </section>

        <section className="relative py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <Reveal>
                <p className="mb-6 text-lg leading-relaxed text-chronos-stone/90">{page?.intro ?? ""}</p>
              </Reveal>

              <div className="grid gap-5 sm:grid-cols-2">
                {features.map((feature, idx) => {
                  const Icon = featureIcons[idx % featureIcons.length]!;
                  return (
                    <Reveal key={feature.title} delay={120 * idx}>
                      <div className="group h-full border border-chronos-ink/10 bg-chronos-warm/25 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-chronos-gold/60 hover:bg-chronos-ivory">
                        <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-chronos-gold/50 transition-colors duration-500 group-hover:border-chronos-gold">
                          <Icon className="h-5 w-5 text-chronos-gold" strokeWidth={1.25} />
                        </span>
                        <h3 className="mb-2 text-xl tracking-[0.02em] text-chronos-ink">{feature.title}</h3>
                        <p className="text-sm leading-relaxed text-chronos-stone/80">{feature.desc}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-28 h-px max-w-7xl bg-gradient-to-r from-transparent via-chronos-gold/45 to-transparent" />
        </section>

        {values.length > 0 ? (
          <section className="bg-chronos-warm/20 py-28 lg:py-36">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <Reveal className="mb-14 max-w-2xl">
                <p className="eyebrow mb-6 text-chronos-gold">{str(page, "values_label")}</p>
                <h2 className="mb-4 text-4xl tracking-[0.02em] text-chronos-ink sm:text-5xl">
                  {str(page, "values_title")}
                </h2>
              </Reveal>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((v, idx) => {
                  const Icon = valueIcons[idx % valueIcons.length]!;
                  return (
                    <Reveal key={v.title} delay={120 * idx}>
                      <div className="h-full border-t border-chronos-gold/40 pt-6">
                        <Icon className="mb-4 h-6 w-6 text-chronos-gold" strokeWidth={1.25} />
                        <h3 className="mb-2 text-xl tracking-[0.02em] text-chronos-ink">{v.title}</h3>
                        <p className="text-sm leading-relaxed text-chronos-stone/80">{v.desc}</p>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {page?.content ? (
          <section className="py-28 lg:py-36">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <Reveal>
                  <div className="grid gap-5">
                    {supporting.slice(0, 2).map((img) => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt={img.alt ?? page.title}
                        loading="lazy"
                        className="aspect-[16/10] w-full rounded-sm object-cover"
                      />
                    ))}
                  </div>
                </Reveal>
                <Reveal delay={160}>
                  <p className="eyebrow mb-6 text-chronos-gold">{str(page, "vision_label")}</p>
                  <h2 className="mb-6 text-4xl tracking-[0.02em] text-chronos-ink sm:text-5xl">
                    {str(page, "vision_title")}
                  </h2>
                  <p className="whitespace-pre-line text-lg leading-relaxed text-chronos-stone/90">{page.content}</p>
                </Reveal>
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <Footer t={t} />
    </div>
  );
}
