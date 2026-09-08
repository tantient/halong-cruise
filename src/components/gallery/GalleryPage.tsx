"use client";

import { useEffect, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useLanguage } from "@/components/landing/use-language";
import { Reveal } from "@/components/landing/Reveal";
import { galleryAllLabel } from "@/lib/i18n/ui-forms";
import { publicQueries, type PublicGalleryBundle, type PublicPage } from "@/lib/platform";
import { Lightbox } from "./Lightbox";

function str(page: PublicPage | null, key: string): string {
  const v = page?.text[key];
  return typeof v === "string" ? v : "";
}

/**
 * Heritage gallery template. Images, filter groups and copy come from the
 * database, so the categories are per-ship data rather than code.
 */
export function GalleryPage({ bundle }: { bundle: PublicGalleryBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  const { data } = useSuspenseQuery({ ...publicQueries.galleryBundle(href("/gallery")), initialData: bundle });
  const b = data ?? bundle;

  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const { page, categories, images: allImages } = perLang;

  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<number | null>(null);
  // Fallback: once the page settles, load every image so fast scrolling
  // never leaves empty tiles behind.
  const [loadAll, setLoadAll] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setLoadAll(true), 1200);
    return () => window.clearTimeout(id);
  }, []);

  const images = useMemo(
    () => (filter === "all" ? allImages : allImages.filter((i) => i.category === filter)),
    [filter, allImages],
  );

  const filters = [{ id: "all", label: galleryAllLabel(lang) }, ...categories];

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />

      <main className="pt-32 pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal className="mb-12 max-w-2xl">
            <p className="eyebrow mb-6 text-chronos-gold">{str(page, "eyebrow")}</p>
            <h1 className="mb-4 text-4xl tracking-[0.02em] text-chronos-ink sm:text-5xl">{page?.title ?? ""}</h1>
            <p className="text-chronos-stone/85">{page?.intro ?? ""}</p>
          </Reveal>

          <div className="mb-10 flex flex-wrap gap-2">
            {filters.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setFilter(c.id);
                  setActive(null);
                }}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                  filter === c.id
                    ? "border-chronos-ink bg-chronos-ink text-chronos-ivory"
                    : "border-chronos-ink/15 text-chronos-ink/70 hover:border-chronos-ink/40 hover:text-chronos-ink"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActive(i)}
                className="group relative overflow-hidden rounded-sm bg-chronos-ink/5 text-left"
              >
                <img
                  src={img.url}
                  alt={img.alt ?? page?.title ?? ""}
                  loading={i < 9 || loadAll ? "eager" : "lazy"}
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chronos-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {img.caption ?? img.alt ? (
                  <span className="pointer-events-none absolute bottom-4 left-5 text-xs uppercase tracking-[0.24em] text-chronos-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {img.caption ?? img.alt}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
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
