"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { publicQueries, type PublicHomepageBundle } from "@/lib/platform";
import { ExperienceHome } from "./experience/ExperienceHome";
import { useLanguage } from "./use-language";

/**
 * Homepage template ("A Journey Through Time"). Ship-specific copy, imagery,
 * cabins, voyages and experiences come from the database; shared UI labels come
 * from the platform translation files via `useLanguage()`.
 */
export function LandingPage({ bundle }: { bundle: PublicHomepageBundle }) {
  const { uiLang: lang, setLang, t, href } = useLanguage();
  // Keep the cached bundle live for client navigations / language switches.
  const { data } = useSuspenseQuery({ ...publicQueries.homepageBundle(href("/")), initialData: bundle });
  const b = data ?? bundle;

  const perLang = b.languages[lang] ?? b.languages[b.ship.defaultLanguage] ?? Object.values(b.languages)[0]!;

  return <ExperienceHome bundle={b} data={perLang} lang={lang} setLang={setLang} t={t} />;
}
