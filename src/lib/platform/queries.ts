/**
 * TanStack Query options for the public read layer.
 *
 * Keys always start with `["platform", hostKey, ...]` and include the language
 * whenever the data depends on it, so cached data of one ship/language is
 * never served for another. `hostKey` is the browser hostname (or the SSR
 * request host) — the server still resolves the ship itself from the request;
 * the key only partitions the cache.
 *
 * Typical use in a route:
 *   loader: ({ context, location }) =>
 *     context.queryClient.ensureQueryData(publicQueries.cabins(location.pathname))
 *   component: useSuspenseQuery(publicQueries.cabins(pathname))
 */

import { queryOptions } from "@tanstack/react-query";

import { splitLanguagePath } from "@/lib/i18n/paths";
import {
  getPublicCabin,
  getPublicCabinBundle,
  getPublicCabins,
  getPublicCabinsBundle,
  getPublicHomepage,
  getPublicHomepageBundle,
  getPublicItineraries,
  getPublicItinerariesBundle,
  getPublicItinerary,
  getPublicJobPositions,
  getPublicMediaByCategory,
  getPublicOffers,
  getPublicPage,
  getPublicService,
  getPublicServices,
  getPublicServiceNav,
  getPublicServicesBundle,
  getPublicSiteContext,
} from "./public.functions";

/**
 * Cache namespace. It must be identical on server and client, otherwise SSR
 * dehydrated data does not match the client key and every page refetches (and
 * hydration mismatches). The ship is always resolved server-side from the
 * request host, and a browser only ever talks to one host, so a constant is
 * both safe and correct.
 */
function hostKey(): string {
  return "site";
}

/** Language segment of the URL (or "default") — part of every language-dependent key. */
function langKey(pathname: string): string {
  return splitLanguagePath(pathname).language ?? "default";
}

const STALE = 5 * 60 * 1000;

const base = (pathname: string, ...parts: unknown[]) => ["platform", hostKey(), langKey(pathname), ...parts] as const;

export const publicQueries = {
  siteContext: (pathname: string) =>
    queryOptions({ queryKey: base(pathname, "site-context"), queryFn: () => getPublicSiteContext({ data: { pathname } }), staleTime: STALE }),

  homepage: (pathname: string) =>
    queryOptions({ queryKey: base(pathname, "homepage"), queryFn: () => getPublicHomepage({ data: { pathname } }), staleTime: STALE }),
  /** Homepage for all enabled languages (language-independent key: it contains every language). */
  homepageBundle: (pathname: string) =>
    queryOptions({ queryKey: ["platform", hostKey(), langKey(pathname), "homepage-bundle"] as const, queryFn: () => getPublicHomepageBundle({ data: { pathname } }), staleTime: STALE }),

  cabins: (pathname: string) =>
    queryOptions({ queryKey: base(pathname, "cabins"), queryFn: () => getPublicCabins({ data: { pathname } }), staleTime: STALE }),
  cabin: (pathname: string, slug: string) =>
    queryOptions({ queryKey: base(pathname, "cabin", slug), queryFn: () => getPublicCabin({ data: { pathname, slug } }), staleTime: STALE }),
  /** All enabled languages in one payload (language-independent key). */
  cabinsBundle: (pathname: string) =>
    queryOptions({ queryKey: ["platform", hostKey(), langKey(pathname), "cabins-bundle"] as const, queryFn: () => getPublicCabinsBundle({ data: { pathname } }), staleTime: STALE }),
  cabinBundle: (pathname: string, slug: string) =>
    queryOptions({ queryKey: ["platform", hostKey(), langKey(pathname), "cabin-bundle", slug] as const, queryFn: () => getPublicCabinBundle({ data: { pathname, slug } }), staleTime: STALE }),

  itineraries: (pathname: string) =>
    queryOptions({ queryKey: base(pathname, "itineraries"), queryFn: () => getPublicItineraries({ data: { pathname } }), staleTime: STALE }),
  /** All enabled languages in one payload (language-independent key). */
  itinerariesBundle: (pathname: string) =>
    queryOptions({ queryKey: ["platform", hostKey(), langKey(pathname), "itineraries-bundle"] as const, queryFn: () => getPublicItinerariesBundle({ data: { pathname } }), staleTime: STALE }),
  itinerary: (pathname: string, slug: string) =>
    queryOptions({ queryKey: base(pathname, "itinerary", slug), queryFn: () => getPublicItinerary({ data: { pathname, slug } }), staleTime: STALE }),

  services: (pathname: string) =>
    queryOptions({ queryKey: base(pathname, "services"), queryFn: () => getPublicServices({ data: { pathname } }), staleTime: STALE }),
  service: (pathname: string, slug: string) =>
    queryOptions({ queryKey: base(pathname, "service", slug), queryFn: () => getPublicService({ data: { pathname, slug } }), staleTime: STALE }),

  /** All enabled languages in one payload (language-independent key). */
  servicesBundle: (pathname: string) =>
    queryOptions({ queryKey: ["platform", hostKey(), langKey(pathname), "services-bundle"] as const, queryFn: () => getPublicServicesBundle({ data: { pathname } }), staleTime: STALE }),
  /** Header service menu for all enabled languages. */
  serviceNav: (pathname: string) =>
    queryOptions({ queryKey: ["platform", hostKey(), langKey(pathname), "service-nav"] as const, queryFn: () => getPublicServiceNav({ data: { pathname } }), staleTime: STALE }),

  offers: (pathname: string, activeOnly = false) =>
    queryOptions({ queryKey: base(pathname, "offers", activeOnly), queryFn: () => getPublicOffers({ data: { pathname, activeOnly } }), staleTime: STALE }),

  page: (pathname: string, slug: string) =>
    queryOptions({ queryKey: base(pathname, "page", slug), queryFn: () => getPublicPage({ data: { pathname, slug } }), staleTime: STALE }),

  jobPositions: (pathname: string) =>
    queryOptions({ queryKey: base(pathname, "jobs"), queryFn: () => getPublicJobPositions({ data: { pathname } }), staleTime: STALE }),

  mediaByCategory: (pathname: string, category: string) =>
    queryOptions({ queryKey: base(pathname, "media", category), queryFn: () => getPublicMediaByCategory({ data: { pathname, category } }), staleTime: STALE }),
};
