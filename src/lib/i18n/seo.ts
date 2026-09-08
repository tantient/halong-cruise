/**
 * Multilingual SEO helpers: per-language title/description, self-referencing
 * canonical, hreflang alternates and sitemap entries.
 *
 * Route `head()` functions and the sitemap consume these so no page has to know
 * which languages a ship enabled.
 */

import { LANGUAGE_BCP47, type LanguageCode, type ShipLanguageConfig } from "./languages";
import { localizedField } from "./localize";
import { localizedPath } from "./paths";

export interface SeoText {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

/**
 * Resolves SEO text for a page in one language, falling back through:
 * page translation → page default language → ship SEO defaults.
 */
export function resolveSeoText(args: {
  page?: ({ translations?: unknown } & Record<string, unknown>) | null;
  shipSeo?: ({ translations?: unknown } & Record<string, unknown>) | null;
  language: LanguageCode;
  defaultLanguage: LanguageCode;
}): SeoText {
  const { page, shipSeo, language, defaultLanguage } = args;
  const pick = (
    row: (({ translations?: unknown } & Record<string, unknown>) | null | undefined),
    field: string,
  ) => (row ? localizedField<string>(row, field, language, defaultLanguage) : null);

  const template = pick(shipSeo, "title_template");
  const pageTitle = pick(page, "seo_title") ?? pick(page, "title");
  const defaultTitle = pick(shipSeo, "default_title") ?? pick(shipSeo, "site_name") ?? "";
  const title = pageTitle
    ? template && template.includes("%s")
      ? template.replace("%s", pageTitle)
      : pageTitle
    : defaultTitle;

  const description =
    pick(page, "seo_description") ?? pick(page, "intro") ?? pick(shipSeo, "default_description") ?? "";

  return { title, description, ogTitle: title, ogDescription: description };
}

/** Self-referencing canonical for the current language. */
export function canonicalPath(
  pathname: string,
  language: LanguageCode,
  config: ShipLanguageConfig,
): string {
  return localizedPath(pathname, language, config.defaultLanguage);
}

export interface AlternateLink {
  rel: "alternate";
  hrefLang: string;
  href: string;
}

/** hreflang alternates for every language the ship enabled, plus x-default. */
export function hreflangLinks(pathname: string, config: ShipLanguageConfig): AlternateLink[] {
  const links: AlternateLink[] = config.enabledLanguages.map((language) => ({
    rel: "alternate",
    hrefLang: LANGUAGE_BCP47[language],
    href: localizedPath(pathname, language, config.defaultLanguage),
  }));
  links.push({
    rel: "alternate",
    hrefLang: "x-default",
    href: localizedPath(pathname, config.defaultLanguage, config.defaultLanguage),
  });
  return links;
}

/** One sitemap URL per enabled language for each public path. */
export function sitemapEntries(paths: string[], config: ShipLanguageConfig): string[] {
  return paths.flatMap((path) =>
    config.enabledLanguages.map((language) => localizedPath(path, language, config.defaultLanguage)),
  );
}
