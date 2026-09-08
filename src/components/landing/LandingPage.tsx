"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { publicQueries, textOf, listOf, sectionOfType, type PublicHomepageBundle } from "@/lib/platform";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { RecruitTeaser } from "./RecruitTeaser";
import { Gallery } from "./Gallery";
import { QuoteForm } from "./QuoteForm";
import { Footer } from "./Footer";
import { useLanguage } from "./use-language";

/**
 * Heritage homepage template. Ship-specific copy and imagery come from the
 * database (`homepage_sections` + media); shared UI labels come from the
 * platform translation files via `useLanguage()`.
 */
export function LandingPage({ bundle }: { bundle: PublicHomepageBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  // Keep the cached bundle live for client navigations / language switches.
  const { data } = useSuspenseQuery({ ...publicQueries.homepageBundle(href("/")), initialData: bundle });
  const b = data ?? bundle;

  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;
  const { homepage, jobs } = perLang;

  const hero = sectionOfType(homepage.sections, "hero");
  const recruit = sectionOfType(homepage.sections, "recruit_teaser");
  const gallery = sectionOfType(homepage.sections, "gallery");
  const quote = sectionOfType(homepage.sections, "quote_form");

  const heroSlides = homepage.hero.map((m) => ({ url: m.url, alt: m.alt ?? b.ship.ship.displayName }));
  const recruitCover = recruit?.media.cover ?? recruit?.media.all[0] ?? null;
  const galleryImages = (gallery?.media.gallery.length ? gallery.media.gallery : gallery?.media.all ?? []).map((m) => ({
    src: m.url,
    alt: m.alt ?? b.ship.ship.displayName,
  }));

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />
      <main>
        {hero && (
          <Hero
            t={t}
            slides={heroSlides}
            content={{
              tagline: textOf(hero, "tagline"),
              title: textOf(hero, "title"),
              titleAccent: textOf(hero, "title_accent"),
              subtitle: textOf(hero, "subtitle"),
              cta: textOf(hero, "cta"),
            }}
          />
        )}
        {recruit && (
          <RecruitTeaser
            lang={lang}
            t={t}
            jobs={jobs}
            image={recruitCover ? { url: recruitCover.url, alt: recruitCover.alt ?? b.ship.ship.displayName } : null}
            content={{
              title: textOf(recruit, "title"),
              titleAccent: textOf(recruit, "title_accent"),
              subtitle: textOf(recruit, "subtitle"),
              cta: textOf(recruit, "cta"),
            }}
          />
        )}
        {gallery && (
          <Gallery
            images={galleryImages}
            content={{ title: textOf(gallery, "title"), subtitle: textOf(gallery, "subtitle"), captions: listOf(gallery, "captions") }}
          />
        )}
        {quote && (
          <QuoteForm t={t} content={{ label: textOf(quote, "label"), title: textOf(quote, "title"), subtitle: textOf(quote, "subtitle") }} />
        )}
      </main>
      <Footer t={t} />
    </div>
  );
}
