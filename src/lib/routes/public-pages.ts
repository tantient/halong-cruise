/**
 * Shared loader/head logic for public pages so the unprefixed (default
 * language) and language-prefixed route files use exactly one implementation.
 */

import type { QueryClient } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";

import {
  buildSeo,
  publicQueries,
  type PublicCabinBundle,
  type PublicCabinsBundle,
  type PublicHomepageBundle,
  type PublicItinerariesBundle,
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
    path: `/services/${slug}`,
    title: service?.name ?? null,
    description: service?.summary ?? service?.description ?? null,
    image: cover,
    type: "website",
  });
  return { meta: seo.meta, links: seo.links };
}
