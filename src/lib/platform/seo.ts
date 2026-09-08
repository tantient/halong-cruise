/**
 * Tenant-aware SEO: title/description in the current language, canonical on
 * the ship's primary domain, Open Graph, hreflang for enabled languages and
 * x-default → default language (unprefixed). Pure — safe on client and server.
 */

import { LANGUAGE_BCP47, type LanguageCode } from "@/lib/i18n/languages";
import { localizedPath } from "@/lib/i18n/paths";
import type { ShipContext } from "./types";

export interface SeoPageInput {
  /** Path WITHOUT language prefix, e.g. `/cabins/grand-suite`. */
  path: string;
  /** Page-specific text, already localized by the read layer. */
  title?: string | null;
  seoTitle?: string | null;
  description?: string | null;
  seoDescription?: string | null;
  /** Absolute or storage URL of the page image (already resolved). */
  image?: string | null;
  type?: "website" | "article" | "product";
  /** Set true for preview / disabled-language / non-canonical pages. */
  noindex?: boolean;
}

export interface SeoHead {
  meta: Array<Record<string, string>>;
  links: Array<Record<string, string>>;
  title: string;
  description: string;
  canonical: string;
  alternates: Array<{ hrefLang: string; href: string }>;
}

function absolute(ctx: ShipContext, path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${ctx.origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildSeoTitle(ctx: ShipContext, page: SeoPageInput): string {
  const pageTitle = page.seoTitle?.trim() || page.title?.trim() || "";
  const template = ctx.seo.titleTemplate;
  if (!pageTitle) return ctx.seo.defaultTitle ?? ctx.seo.siteName ?? ctx.ship.displayName;
  // Page-level seo_title is already a complete title; only wrap plain titles.
  if (page.seoTitle?.trim()) return page.seoTitle.trim();
  return template && template.includes("%s") ? template.replace("%s", pageTitle) : pageTitle;
}

export function buildSeoDescription(ctx: ShipContext, page: SeoPageInput): string {
  return page.seoDescription?.trim() || page.description?.trim() || ctx.seo.defaultDescription || "";
}

/** hreflang alternates (enabled languages only) + x-default. */
export function buildAlternates(ctx: ShipContext, path: string) {
  const list = ctx.enabledLanguages.map((l) => ({
    hrefLang: LANGUAGE_BCP47[l],
    href: absolute(ctx, localizedPath(path, l, ctx.defaultLanguage)),
  }));
  list.push({ hrefLang: "x-default", href: absolute(ctx, localizedPath(path, ctx.defaultLanguage, ctx.defaultLanguage)) });
  return list;
}

/** Route `head()` payload for a page of the current ship in `language`. */
export function buildSeo(ctx: ShipContext, language: LanguageCode, page: SeoPageInput): SeoHead {
  const title = buildSeoTitle(ctx, page);
  const description = buildSeoDescription(ctx, page);
  const canonical = absolute(ctx, localizedPath(page.path, language, ctx.defaultLanguage));
  const image = page.image ? absolute(ctx, page.image) : ctx.seo.ogImage ? absolute(ctx, ctx.seo.ogImage) : null;
  const alternates = ctx.enabledLanguages.length > 1 ? buildAlternates(ctx, page.path) : [];
  const siteName = ctx.seo.siteName ?? ctx.ship.displayName;

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: page.type ?? "website" },
    { property: "og:url", content: canonical },
    { property: "og:site_name", content: siteName },
    { property: "og:locale", content: LANGUAGE_BCP47[language].replace("-", "_") },
    ...ctx.enabledLanguages.filter((l) => l !== language).map((l) => ({ property: "og:locale:alternate", content: LANGUAGE_BCP47[l].replace("-", "_") })),
    ...(image ? [{ property: "og:image", content: image }, { property: "og:image:alt", content: title }, { name: "twitter:image", content: image }] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    ...(ctx.seo.twitterHandle ? [{ name: "twitter:site", content: ctx.seo.twitterHandle }] : []),
    ...(page.noindex ? [{ name: "robots", content: "noindex, nofollow" }] : []),
  ];

  const links: Array<Record<string, string>> = page.noindex
    ? []
    : [{ rel: "canonical", href: canonical }, ...alternates.map((a) => ({ rel: "alternate", hrefLang: a.hrefLang, href: a.href }))];

  return { meta, links, title, description, canonical, alternates };
}

/** JSON-LD for the ship (Organization/Hotel/…) using ship_seo.schema_type. */
export function buildShipJsonLd(ctx: ShipContext) {
  return {
    "@context": "https://schema.org",
    "@type": ctx.seo.schemaType,
    name: ctx.seo.schemaName ?? ctx.ship.displayName,
    url: ctx.origin,
    ...(ctx.branding.logoLight ? { logo: absolute(ctx, ctx.branding.logoLight) } : {}),
    ...(ctx.settings.hotline ? { telephone: ctx.settings.hotline } : {}),
    ...(ctx.settings.email ? { email: ctx.settings.email } : {}),
    ...(ctx.settings.address ? { address: ctx.settings.address } : {}),
    sameAs: [ctx.settings.facebook, ctx.settings.instagram, ctx.settings.tiktok, ctx.settings.youtube, ctx.settings.tripadvisor].filter(Boolean),
  };
}
