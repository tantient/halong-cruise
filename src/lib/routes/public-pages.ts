/**
 * Shared loader/head logic for public pages so the unprefixed (default
 * language) and language-prefixed route files use exactly one implementation.
 */

import type { QueryClient } from "@tanstack/react-query";
import { notFound, redirect } from "@tanstack/react-router";

import {
  buildSeo,
  publicQueries,
  type PublicCabinBundle,
  type PublicCareersBundle,
  type PublicGalleryBundle,
  type PublicCabinsBundle,
  type PublicHomepageBundle,
  type PublicItinerariesBundle,
  type PublicOffersBundle,
  type PublicPageBundle,
  type PublicServicesBundle,
} from "@/lib/platform";

export async function loadHomepageBundle(qc: QueryClient, pathname: string) {
  const bundle = await qc.ensureQueryData(publicQueries.homepageBundle(pathname));
  if (!bundle) throw notFound();
  return bundle;
}

export function homepageHead(bundle: PublicHomepageBundle) {
  const { ship, language, languages } = bundle;
  const home = languages[language.language]?.homepage;
  const firstSlide = home?.hero[0]?.url ?? null;
  const seo = buildSeo(ship, language.language, { path: "/", image: firstSlide, type: "website" });
  return {
    meta: seo.meta,
    links: [
      ...seo.links,
      ...(firstSlide ? [{ rel: "preload", as: "image", href: firstSlide, fetchPriority: "high" }] : []),
    ],
  };
}

export async function loadCabinsBundle(qc: QueryClient, pathname: string) {
  const bundle = await qc.ensureQueryData(publicQueries.cabinsBundle(pathname));
  if (!bundle) throw notFound();
  return bundle;
}

export function cabinsHead(bundle: PublicCabinsBundle) {
  const { ship, language, languages } = bundle;
  const data = languages[language.language] ?? languages[ship.defaultLanguage];
  const page = data?.page ?? null;
  const cover = data?.cabins[0]?.media.cover?.url ?? null;
  const seo = buildSeo(ship, language.language, {
    path: "/cabins",
    title: page?.title ?? null,
    seoTitle: page?.seoTitle ?? null,
    description: page?.intro ?? null,
    seoDescription: page?.seoDescription ?? null,
    image: cover,
    type: "website",
  });
  return { meta: seo.meta, links: seo.links };
}

/**
 * Retired cabin slugs → their current commercial slug. Slugs are editable
 * product data, so renames keep old URLs alive with a permanent redirect.
 * Works for any language prefix because only the slug segment is swapped.
 */
const legacyCabinSlugs: Record<string, string> = {
  "owners-suite": "chronos-signature-jacuzzi-suite",
  "junior-suite-a": "premier-double-suite",
  "junior-suite-b": "premier-twin-suite",
  "grand-suite-corner": "grand-suite",
};

export function redirectLegacyCabinSlug(pathname: string, slug: string) {
  const target = legacyCabinSlugs[slug];
  if (!target) return;
  throw redirect({
    href: pathname.replace(`/cabins/${slug}`, `/cabins/${target}`),
    statusCode: 301,
    throw: true,
  });
}

export async function loadCabinBundle(qc: QueryClient, pathname: string, slug: string) {
  const bundle = await qc.ensureQueryData(publicQueries.cabinBundle(pathname, slug));
  // Unknown slug, unpublished cabin or a cabin of another ship → 404.
  if (!bundle) throw notFound();
  return bundle;
}

export function cabinHead(bundle: PublicCabinBundle, slug: string) {
  const { ship, language, languages } = bundle;
  const data = languages[language.language] ?? languages[ship.defaultLanguage];
  const cabin = data?.cabin;
  const cover = cabin?.media.cover?.url ?? cabin?.media.all[0]?.url ?? null;
  const seo = buildSeo(ship, language.language, {
    path: `/cabins/${slug}`,
    title: cabin?.name ?? null,
    description: cabin?.summary ?? cabin?.description ?? null,
    image: cover,
    type: "product",
  });
  return { meta: seo.meta, links: seo.links };
}

export const notFoundHead = { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };

export const publicErrorComponents = {
  domain: "This site is not configured for this domain.",
  cabin: "This cabin is not available.",
  service: "This service is not available.",
  itinerary: "This voyage is not available.",
  generic: "Something went wrong loading this page. Please try again.",
};

export async function loadItinerariesBundle(qc: QueryClient, pathname: string) {
  const bundle = await qc.ensureQueryData(publicQueries.itinerariesBundle(pathname));
  if (!bundle) throw notFound();
  return bundle;
}

export function itinerariesHead(bundle: PublicItinerariesBundle) {
  const { ship, language, languages } = bundle;
  const data = languages[language.language] ?? languages[ship.defaultLanguage];
  const page = data?.page ?? null;
  const cover = data?.itineraries[0]?.media.cover?.url ?? null;
  const seo = buildSeo(ship, language.language, {
    path: "/itineraries",
    title: page?.title ?? null,
    seoTitle: page?.seoTitle ?? null,
    description: page?.intro ?? null,
    seoDescription: page?.seoDescription ?? null,
    image: cover,
    type: "website",
  });
  return { meta: seo.meta, links: seo.links };
}

/** Voyage detail reads the same bundle; an unknown slug 404s (no fallback). */
export async function loadItineraryBundle(qc: QueryClient, pathname: string, slug: string) {
  const bundle = await qc.ensureQueryData(publicQueries.itinerariesBundle(pathname));
  if (!bundle) throw notFound();
  const data = bundle.languages[bundle.language.language] ?? bundle.languages[bundle.ship.defaultLanguage];
  if (!data?.itineraries.some((i) => i.slug === slug)) throw notFound();
  return bundle;
}

export function itineraryHead(bundle: PublicItinerariesBundle, slug: string) {
  const { ship, language, languages } = bundle;
  const data = languages[language.language] ?? languages[ship.defaultLanguage];
  const itinerary = data?.itineraries.find((i) => i.slug === slug) ?? null;
  const cover = itinerary?.media.cover?.url ?? itinerary?.media.all[0]?.url ?? null;
  const seo = buildSeo(ship, language.language, {
    path: `/itineraries/${slug}`,
    title: itinerary?.name ?? null,
    description: itinerary?.summary ?? itinerary?.description ?? null,
    image: cover,
    type: "website",
  });
  return { meta: seo.meta, links: seo.links };
}

export async function loadServiceBundle(qc: QueryClient, pathname: string, slug: string) {
  const bundle = await qc.ensureQueryData(publicQueries.servicesBundle(pathname));
  if (!bundle) throw notFound();
  // Unknown slug, unpublished service or a service of another ship → 404 (no fallback).
  const data =
    bundle.languages[bundle.language.language] ?? bundle.languages[bundle.ship.defaultLanguage];
  if (!data?.services.some((s) => s.slug === slug)) throw notFound();
  return bundle;
}

export function serviceHead(bundle: PublicServicesBundle, slug: string) {
  const { ship, language, languages } = bundle;
  const data = languages[language.language] ?? languages[ship.defaultLanguage];
  const service = data?.services.find((s) => s.slug === slug) ?? null;
  const cover = service?.media.cover?.url ?? service?.media.all[0]?.url ?? null;
  const seo = buildSeo(ship, language.language, {
    path: `/experiences/${slug}`,
    title: service?.name ?? null,
    description: service?.summary ?? service?.description ?? null,
    image: cover,
    type: "website",
  });
  return { meta: seo.meta, links: seo.links };
}

/* ------------------------------------------------- experiences / the ship */

/**
 * The public Experiences and The Ship areas read the same service records
 * (grouped for presentation) plus their own editorial page record.
 */
async function loadServiceArea(qc: QueryClient, pathname: string, pageSlug: string) {
  const [bundle, pageBundle] = await Promise.all([
    qc.ensureQueryData(publicQueries.servicesBundle(pathname)),
    qc.ensureQueryData(publicQueries.pageBundle(pathname, pageSlug)).catch(() => null),
  ]);
  if (!bundle) throw notFound();
  return { bundle, pageBundle };
}

export function loadExperiencesArea(qc: QueryClient, pathname: string) {
  return loadServiceArea(qc, pathname, "experiences");
}

export function loadShipArea(qc: QueryClient, pathname: string) {
  return loadServiceArea(qc, pathname, "the-ship");
}

function serviceAreaHead(
  data: { bundle: PublicServicesBundle; pageBundle: PublicPageBundle | null },
  path: string,
) {
  const { bundle, pageBundle } = data;
  const { ship, language } = bundle;
  const page =
    pageBundle?.languages[language.language]?.page ??
    pageBundle?.languages[ship.defaultLanguage]?.page ??
    null;
  const services = (bundle.languages[language.language] ?? bundle.languages[ship.defaultLanguage])?.services ?? [];
  const cover = page?.media.cover?.url ?? services[0]?.media.cover?.url ?? null;
  const seo = buildSeo(ship, language.language, {
    path,
    title: page?.title ?? null,
    seoTitle: page?.seoTitle ?? null,
    description: page?.intro ?? null,
    seoDescription: page?.seoDescription ?? null,
    image: cover,
    type: "website",
  });
  return { meta: seo.meta, links: seo.links };
}

export function experiencesHead(data: { bundle: PublicServicesBundle; pageBundle: PublicPageBundle | null }) {
  return serviceAreaHead(data, "/experiences");
}

export function shipHead(data: { bundle: PublicServicesBundle; pageBundle: PublicPageBundle | null }) {
  return serviceAreaHead(data, "/the-ship");
}

/**
 * Retired `/services/<slug>` URLs. Experience categories live under
 * `/experiences/<category>`; records that describe the vessel itself belong to
 * the single The Ship page. Only the path segment is swapped, so the redirect
 * works under any language prefix.
 */
const legacyServiceSlugs: Record<string, string> = {
  sundeck: "/experiences/pool",
  spa: "/experiences/spa-wellness",
  "public-spaces": "/the-ship",
  exterior: "/the-ship",
};

export function redirectServiceSlug(pathname: string, slug: string) {
  const target = legacyServiceSlugs[slug] ?? `/experiences/${slug}`;
  throw redirect({
    href: pathname.replace(`/services/${slug}`, target),
    statusCode: 301,
    throw: true,
  });
}

/* ----------------------------------------------------------------- offers */

export async function loadOffersBundle(qc: QueryClient, pathname: string) {
  const bundle = await qc.ensureQueryData(publicQueries.offersBundle(pathname));
  if (!bundle) throw notFound();
  return bundle;
}

export function offersHead(bundle: PublicOffersBundle) {
  const { ship, language, languages } = bundle;
  const data = languages[language.language] ?? languages[ship.defaultLanguage];
  const page = data?.page ?? null;
  const cover = page?.media.cover?.url ?? data?.offers[0]?.media.cover?.url ?? null;
  const seo = buildSeo(ship, language.language, {
    path: "/offers",
    title: page?.title ?? null,
    seoTitle: page?.seoTitle ?? null,
    description: page?.intro ?? null,
    seoDescription: page?.seoDescription ?? null,
    image: cover,
    type: "website",
  });
  return { meta: seo.meta, links: seo.links };
}

/* --------------------------------------------------- single editorial page */

export async function loadPageBundle(qc: QueryClient, pathname: string, slug: string) {
  const bundle = await qc.ensureQueryData(publicQueries.pageBundle(pathname, slug));
  if (!bundle) throw notFound();
  return bundle;
}

/** SEO for a page-backed route (`/about`, `/contact`, …). */
export function pageHead(bundle: PublicPageBundle, path: string) {
  const { ship, language, languages } = bundle;
  const page = (languages[language.language] ?? languages[ship.defaultLanguage])?.page ?? null;
  const seo = buildSeo(ship, language.language, {
    path,
    title: page?.title ?? null,
    seoTitle: page?.seoTitle ?? null,
    description: page?.intro ?? null,
    seoDescription: page?.seoDescription ?? null,
    image: page?.media.cover?.url ?? null,
    type: "website",
  });
  return { meta: seo.meta, links: seo.links };
}

/* ---------------------------------------------------------------- careers */

export async function loadCareersBundle(qc: QueryClient, pathname: string) {
  const bundle = await qc.ensureQueryData(publicQueries.careersBundle(pathname));
  if (!bundle) throw notFound();
  return bundle;
}

export function careersHead(bundle: PublicCareersBundle) {
  const { ship, language, languages } = bundle;
  const page = (languages[language.language] ?? languages[ship.defaultLanguage])?.page ?? null;
  const seo = buildSeo(ship, language.language, {
    path: "/careers",
    title: page?.title ?? null,
    seoTitle: page?.seoTitle ?? null,
    description: page?.intro ?? null,
    seoDescription: page?.seoDescription ?? null,
    image: page?.media.cover?.url ?? null,
    type: "website",
  });
  return { meta: seo.meta, links: seo.links };
}

/* ---------------------------------------------------------------- gallery */

export async function loadGalleryBundle(qc: QueryClient, pathname: string) {
  const bundle = await qc.ensureQueryData(publicQueries.galleryBundle(pathname));
  if (!bundle) throw notFound();
  return bundle;
}

export function galleryHead(bundle: PublicGalleryBundle) {
  const { ship, language, languages } = bundle;
  const data = languages[language.language] ?? languages[ship.defaultLanguage];
  const page = data?.page ?? null;
  const seo = buildSeo(ship, language.language, {
    path: "/gallery",
    title: page?.title ?? null,
    seoTitle: page?.seoTitle ?? null,
    description: page?.intro ?? null,
    seoDescription: page?.seoDescription ?? null,
    image: page?.media.cover?.url ?? data?.images[0]?.url ?? null,
    type: "website",
  });
  return { meta: seo.meta, links: seo.links };
}
