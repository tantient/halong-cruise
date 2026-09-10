/**
 * Per-domain sitemap / robots builders.
 *
 *   hostname → ship → enabled languages → published URLs
 *
 * A domain only ever sees the URLs of its own ship. They back the
 * `/sitemap.xml` and `/robots.txt` routes.
 */

import { localizedPath } from "@/lib/i18n/paths";
import { listPublicSlugs, type ReadScope } from "./content.server";
import { resolveShipByHost, getShipContext } from "./ship.server";
import type { ShipContext } from "./types";

export interface SitemapUrl {
  loc: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly" | undefined;
  priority?: string | undefined;
  alternates: Array<{ hrefLang: string; href: string }>;
}

/**
 * Section paths the platform route tree exposes for every ship (unprefixed).
 * Section *copy* lives in `ship_pages`, but the URLs are route-tree paths, so
 * page slugs are not turned into extra URLs.
 */
export const STATIC_PUBLIC_PATHS: Array<{ path: string; changefreq: SitemapUrl["changefreq"]; priority: string }> = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/cabins", changefreq: "weekly", priority: "0.9" },
  { path: "/itineraries", changefreq: "weekly", priority: "0.9" },
  { path: "/offers", changefreq: "weekly", priority: "0.8" },
  { path: "/experiences", changefreq: "monthly", priority: "0.8" },
  { path: "/the-ship", changefreq: "monthly", priority: "0.8" },
  { path: "/gallery", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/careers", changefreq: "weekly", priority: "0.6" },
];

/** Builds every public URL (all enabled languages) for a ship. */
export async function buildSitemapUrls(ctx: ShipContext): Promise<SitemapUrl[]> {
  const scope: ReadScope = { shipId: ctx.ship.id, language: ctx.defaultLanguage, defaultLanguage: ctx.defaultLanguage };
  // Only slugs that have a route in the template are emitted.
  const slugs = await listPublicSlugs(scope);

  const paths: Array<{ path: string; changefreq: SitemapUrl["changefreq"]; priority: string }> = [
    ...STATIC_PUBLIC_PATHS,
    ...slugs.cabins.map((s) => ({ path: `/cabins/${s}`, changefreq: "monthly" as const, priority: "0.7" })),
    ...slugs.itineraries.map((s) => ({ path: `/itineraries/${s}`, changefreq: "monthly" as const, priority: "0.8" })),
    ...slugs.experienceCategories.map((s) => ({ path: `/experiences/${s}`, changefreq: "monthly" as const, priority: "0.6" })),
  ];

  const abs = (p: string) => `${ctx.origin}${p}`;
  return paths.flatMap(({ path, changefreq, priority }) => {
    const alternates = [
      ...ctx.enabledLanguages.map((l) => ({ hrefLang: l === "zh-CN" ? "zh-Hans" : l, href: abs(localizedPath(path, l, ctx.defaultLanguage)) })),
      { hrefLang: "x-default", href: abs(localizedPath(path, ctx.defaultLanguage, ctx.defaultLanguage)) },
    ];
    return ctx.enabledLanguages.map((l) => ({
      loc: abs(localizedPath(path, l, ctx.defaultLanguage)),
      changefreq,
      priority,
      alternates,
    }));
  });
}

export function renderSitemapXml(urls: SitemapUrl[]): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const body = urls.map((u) =>
    [
      "  <url>",
      `    <loc>${esc(u.loc)}</loc>`,
      ...u.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hrefLang}" href="${esc(a.href)}" />`),
      u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>` : null,
      u.priority ? `    <priority>${u.priority}</priority>` : null,
      "  </url>",
    ].filter(Boolean).join("\n"),
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...body,
    `</urlset>`,
  ].join("\n");
}

/** robots.txt for one ship's domain; preview/dev hosts get disallow-all. */
export function renderRobotsTxt(ctx: ShipContext | null, opts: { isPublicHost: boolean }): string {
  if (!ctx || !opts.isPublicHost) return ["User-agent: *", "Disallow: /"].join("\n");
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /auth",
    "Disallow: /admin",
    "Disallow: /dev/sync",
    "Disallow: /preview/",
    "",
    `Sitemap: ${ctx.origin}/sitemap.xml`,
  ].join("\n");
}

/** hostname → sitemap XML for that domain's ship only. */
export async function sitemapForHost(hostname: string): Promise<string | null> {
  const resolved = await resolveShipByHost(hostname);
  if (!resolved) return null;
  const ctx = await getShipContext(resolved);
  return renderSitemapXml(await buildSitemapUrls(ctx));
}

/** hostname → robots.txt for that domain's ship only. */
export async function robotsForHost(hostname: string): Promise<string> {
  const resolved = await resolveShipByHost(hostname);
  const ctx = resolved ? await getShipContext(resolved) : null;
  const isPublicHost = !!resolved?.requestDomain && !resolved.redirectToHost;
  return renderRobotsTxt(ctx, { isPublicHost });
}
