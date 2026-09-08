/**
 * Server functions exposing the public read layer to routes/components.
 *
 * Security model: the client never sends `ship_id`. Each function reads the
 * request hostname on the server, resolves the ship, resolves the language
 * from the (client-supplied) pathname against the ship's enabled languages,
 * and only then reads data scoped to that ship.
 */

import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

import { shipLanguageConfig, type LanguageCode } from "@/lib/i18n/languages";
import { resolveLanguage, type LanguageResolution } from "./language";
import type {
  MediaItem,
  PublicCabin,
  PublicCabinFull,
  PublicHomepage,
  PublicItineraryFull,
  PublicJobPosition,
  PublicOffer,
  PublicService,
  PublicPage,
  ShipContext,
} from "./types";

const pathInput = z.object({ pathname: z.string().default("/") });
const slugInput = pathInput.extend({ slug: z.string().min(1).max(200) });
const categoryInput = pathInput.extend({ category: z.string().min(1).max(60) });

function requestHost(): string {
  return getRequestHeader("x-forwarded-host") ?? getRequestHeader("host") ?? "";
}

/** Shared bootstrap: host → ship → language → scope. */
async function publicScope(pathname: string) {
  const { resolveShipByHost, getShipContext } = await import("./ship.server");
  const resolved = await resolveShipByHost(requestHost());
  if (!resolved) return null;
  const lang = resolveLanguage(shipLanguageConfig(resolved.ship), pathname);
  const context = await getShipContext(resolved, lang.language);
  return {
    context,
    lang,
    scope: { shipId: context.ship.id, language: lang.language, defaultLanguage: context.defaultLanguage },
    redirectToHost: resolved.redirectToHost,
  };
}

export interface PublicSiteContext {
  ship: ShipContext;
  language: LanguageResolution;
  /** Host to redirect to when the request came through an alias domain. */
  redirectToHost: string | null;
}

export const getPublicSiteContext = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }): Promise<PublicSiteContext | null> => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    return { ship: s.context, language: s.lang, redirectToHost: s.redirectToHost };
  });

export const getPublicHomepage = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { getHomepage } = await import("./content.server");
    return getHomepage(s.scope);
  });

export interface PublicHomepageLanguageData {
  homepage: PublicHomepage;
  /** Published job positions (slug + localized title) for homepage recruit widgets. */
  jobs: Pick<PublicJobPosition, "id" | "slug" | "title">[];
}

export interface PublicHomepageBundle {
  ship: ShipContext;
  language: LanguageResolution;
  /** Homepage data resolved per enabled language (each already fallback-resolved). */
  languages: Partial<Record<LanguageCode, PublicHomepageLanguageData>>;
}

/**
 * Homepage for every enabled language of the ship in one call. Used while the
 * homepage language switch is client-side (no URL prefix yet) so switching
 * languages needs no extra round-trip.
 */
export const getPublicHomepageBundle = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }): Promise<PublicHomepageBundle | null> => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { getHomepage, listJobPositions } = await import("./content.server");
    const entries = await Promise.all(
      s.context.enabledLanguages.map(async (language) => {
        const scope = { ...s.scope, language };
        const [homepage, jobs] = await Promise.all([getHomepage(scope), listJobPositions(scope)]);
        return [language, { homepage, jobs: jobs.map((j) => ({ id: j.id, slug: j.slug, title: j.title })) }] as const;
      }),
    );
    return { ship: s.context, language: s.lang, languages: Object.fromEntries(entries) };
  });

export const getPublicCabins = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return [];
    const { listCabins } = await import("./content.server");
    return listCabins(s.scope);
  });

export const getPublicCabin = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugInput.parse(d))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { getCabin } = await import("./content.server");
    return getCabin(s.scope, data.slug);
  });

export interface PublicCabinsLanguageData {
  cabins: PublicCabinFull[];
  /** Editorial copy of the cabins index page (`ship_pages.slug = 'cabins'`). */
  page: PublicPage | null;
}

export interface PublicCabinsBundle {
  ship: ShipContext;
  language: LanguageResolution;
  languages: Partial<Record<LanguageCode, PublicCabinsLanguageData>>;
}

/** Cabins list + page copy for every enabled language (client-side language switch). */
export const getPublicCabinsBundle = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }): Promise<PublicCabinsBundle | null> => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { listCabinsFull, getPage } = await import("./content.server");
    const entries = await Promise.all(
      s.context.enabledLanguages.map(async (language) => {
        const scope = { ...s.scope, language };
        const [cabins, page] = await Promise.all([listCabinsFull(scope), getPage(scope, "cabins")]);
        return [language, { cabins, page }] as const;
      }),
    );
    return { ship: s.context, language: s.lang, languages: Object.fromEntries(entries) };
  });

export interface PublicCabinLanguageData {
  cabin: PublicCabinFull;
  /** Other cabins of the ship (for the "other cabins" links). */
  others: PublicCabinFull[];
  page: PublicPage | null;
}

export interface PublicCabinBundle {
  ship: ShipContext;
  language: LanguageResolution;
  languages: Partial<Record<LanguageCode, PublicCabinLanguageData>>;
}

/** One cabin (+ siblings and page copy) for every enabled language. */
export const getPublicCabinBundle = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugInput.parse(d))
  .handler(async ({ data }): Promise<PublicCabinBundle | null> => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { getCabin, listCabinsFull, getPage } = await import("./content.server");
    // Tenant + published scoping happens in the reader; a miss is a real 404.
    const exists = await getCabin(s.scope, data.slug);
    if (!exists) return null;
    const entries = await Promise.all(
      s.context.enabledLanguages.map(async (language) => {
        const scope = { ...s.scope, language };
        const [all, page] = await Promise.all([listCabinsFull(scope), getPage(scope, "cabins")]);
        const cabin = all.find((c) => c.slug === data.slug);
        if (!cabin) return null;
        return [language, { cabin, others: all.filter((c) => c.slug !== data.slug), page }] as const;
      }),
    );
    return {
      ship: s.context,
      language: s.lang,
      languages: Object.fromEntries(entries.filter((e): e is NonNullable<typeof e> => e !== null)),
    };
  });

export const getPublicItineraries = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return [];
    const { listItineraries } = await import("./content.server");
    return listItineraries(s.scope);
  });

export interface PublicItinerariesLanguageData {
  itineraries: PublicItineraryFull[];
  /** Editorial copy of the itineraries index page (`ship_pages.slug = 'itineraries'`). */
  page: PublicPage | null;
}

export interface PublicItinerariesBundle {
  ship: ShipContext;
  language: LanguageResolution;
  languages: Partial<Record<LanguageCode, PublicItinerariesLanguageData>>;
}

/** Itineraries (with day plan) + page copy for every enabled language. */
export const getPublicItinerariesBundle = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }): Promise<PublicItinerariesBundle | null> => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { listItinerariesFull, getPage } = await import("./content.server");
    const entries = await Promise.all(
      s.context.enabledLanguages.map(async (language) => {
        const scope = { ...s.scope, language };
        const [itineraries, page] = await Promise.all([listItinerariesFull(scope), getPage(scope, "itineraries")]);
        return [language, { itineraries, page }] as const;
      }),
    );
    return { ship: s.context, language: s.lang, languages: Object.fromEntries(entries) };
  });

export const getPublicItinerary = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugInput.parse(d))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { getItinerary } = await import("./content.server");
    return getItinerary(s.scope, data.slug);
  });

export const getPublicServices = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return [];
    const { listServices } = await import("./content.server");
    return listServices(s.scope);
  });

export const getPublicService = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugInput.parse(d))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { getService } = await import("./content.server");
    return getService(s.scope, data.slug);
  });

export interface PublicServicesLanguageData {
  services: PublicService[];
}

export interface PublicServicesBundle {
  ship: ShipContext;
  language: LanguageResolution;
  languages: Partial<Record<LanguageCode, PublicServicesLanguageData>>;
}

/** All published services of the ship, for every enabled language. */
export const getPublicServicesBundle = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }): Promise<PublicServicesBundle | null> => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { listServices } = await import("./content.server");
    const entries = await Promise.all(
      s.context.enabledLanguages.map(async (language) => {
        const services = await listServices({ ...s.scope, language });
        return [language, { services }] as const;
      }),
    );
    return { ship: s.context, language: s.lang, languages: Object.fromEntries(entries) };
  });

/** Navigation entry for one service (used by the shared header menu). */
export interface ServiceNavItem {
  slug: string;
  /** Menu grouping key stored with the service data (e.g. "service", "space"). */
  group: string | null;
  label: string;
  description: string | null;
}

export interface ServiceNav {
  languages: Partial<Record<LanguageCode, ServiceNavItem[]>>;
}

/** Lightweight service menu for every enabled language (loaded once per request). */
export const getPublicServiceNav = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }): Promise<ServiceNav | null> => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { listServices } = await import("./content.server");
    const entries = await Promise.all(
      s.context.enabledLanguages.map(async (language) => {
        const services = await listServices({ ...s.scope, language });
        return [
          language,
          services.map((svc) => {
            const bag = svc.highlights && typeof svc.highlights === "object" && !Array.isArray(svc.highlights)
              ? (svc.highlights as Record<string, unknown>)
              : {};
            return {
              slug: svc.slug,
              group: typeof bag["group"] === "string" ? (bag["group"] as string) : null,
              label: typeof bag["menuName"] === "string" ? (bag["menuName"] as string) : svc.name,
              description: svc.summary,
            } satisfies ServiceNavItem;
          }),
        ] as const;
      }),
    );
    return { languages: Object.fromEntries(entries) };
  });

export const getPublicOffers = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.extend({ activeOnly: z.boolean().optional() }).parse(d ?? {}))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return [];
    const { listOffers } = await import("./content.server");
    return listOffers(s.scope, { activeOnly: data.activeOnly ?? false });
  });

export const getPublicPage = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugInput.parse(d))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { getPage } = await import("./content.server");
    return getPage(s.scope, data.slug);
  });

export const getPublicJobPositions = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return [];
    const { listJobPositions } = await import("./content.server");
    return listJobPositions(s.scope);
  });

export const getPublicMediaByCategory = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => categoryInput.parse(d))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return [];
    const { listMediaByCategory } = await import("./content.server");
    return listMediaByCategory(s.scope, data.category);
  });

/* ----------------------------------------------------------------- offers */

export interface PublicOffersLanguageData {
  offers: PublicOffer[];
  /** Editorial copy of the offers page (`ship_pages.slug = 'offers'`). */
  page: PublicPage | null;
}

export interface PublicOffersBundle {
  ship: ShipContext;
  language: LanguageResolution;
  languages: Partial<Record<LanguageCode, PublicOffersLanguageData>>;
}

/** Offers + page copy for every enabled language. */
export const getPublicOffersBundle = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.extend({ activeOnly: z.boolean().optional() }).parse(d ?? {}))
  .handler(async ({ data }): Promise<PublicOffersBundle | null> => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { listOffers, getPage } = await import("./content.server");
    const entries = await Promise.all(
      s.context.enabledLanguages.map(async (language) => {
        const scope = { ...s.scope, language };
        const [offers, page] = await Promise.all([
          listOffers(scope, { activeOnly: data.activeOnly ?? true }),
          getPage(scope, "offers"),
        ]);
        return [language, { offers, page }] as const;
      }),
    );
    return { ship: s.context, language: s.lang, languages: Object.fromEntries(entries) };
  });

/* ------------------------------------------------------------ static pages */

export interface PublicPageLanguageData {
  page: PublicPage | null;
}

export interface PublicPageBundle {
  ship: ShipContext;
  language: LanguageResolution;
  languages: Partial<Record<LanguageCode, PublicPageLanguageData>>;
}

/** One editorial page (about, contact, …) for every enabled language. */
export const getPublicPageBundle = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => slugInput.parse(d))
  .handler(async ({ data }): Promise<PublicPageBundle | null> => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { getPage } = await import("./content.server");
    const entries = await Promise.all(
      s.context.enabledLanguages.map(async (language) => {
        const page = await getPage({ ...s.scope, language }, data.slug);
        return [language, { page }] as const;
      }),
    );
    return { ship: s.context, language: s.lang, languages: Object.fromEntries(entries) };
  });

/* ---------------------------------------------------------------- careers */

export interface PublicCareersLanguageData {
  jobs: PublicJobPosition[];
  page: PublicPage | null;
}

export interface PublicCareersBundle {
  ship: ShipContext;
  language: LanguageResolution;
  languages: Partial<Record<LanguageCode, PublicCareersLanguageData>>;
}

/** Published job positions + careers page copy for every enabled language. */
export const getPublicCareersBundle = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }): Promise<PublicCareersBundle | null> => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { listJobPositions, getPage } = await import("./content.server");
    const entries = await Promise.all(
      s.context.enabledLanguages.map(async (language) => {
        const scope = { ...s.scope, language };
        const [jobs, page] = await Promise.all([listJobPositions(scope), getPage(scope, "careers")]);
        return [language, { jobs, page }] as const;
      }),
    );
    return { ship: s.context, language: s.lang, languages: Object.fromEntries(entries) };
  });

/* ---------------------------------------------------------------- gallery */

export interface GalleryCategoryView {
  id: string;
  label: string;
}

export interface PublicGalleryLanguageData {
  page: PublicPage | null;
  /** Filter groups, in display order, taken from the page copy (data-driven). */
  categories: GalleryCategoryView[];
  images: MediaItem[];
}

export interface PublicGalleryBundle {
  ship: ShipContext;
  language: LanguageResolution;
  languages: Partial<Record<LanguageCode, PublicGalleryLanguageData>>;
}

function galleryCategories(page: PublicPage | null): GalleryCategoryView[] {
  const raw = page?.text["categories"];
  if (!Array.isArray(raw)) return [];
  const out: GalleryCategoryView[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const row = item as Record<string, unknown>;
    const id = typeof row["id"] === "string" ? row["id"] : null;
    if (!id) continue;
    out.push({ id, label: typeof row["label"] === "string" ? row["label"] : id });
  }
  return out;
}

/** Gallery page copy + its images (grouped by the page's own categories). */
export const getPublicGalleryBundle = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }): Promise<PublicGalleryBundle | null> => {
    const s = await publicScope(data.pathname);
    if (!s) return null;
    const { getPage, listMediaInCategories } = await import("./content.server");
    const entries = await Promise.all(
      s.context.enabledLanguages.map(async (language) => {
        const scope = { ...s.scope, language };
        const page = await getPage(scope, "gallery");
        const categories = galleryCategories(page);
        const images = await listMediaInCategories(
          scope,
          categories.map((c) => c.id),
        );
        return [language, { page, categories, images }] as const;
      }),
    );
    return { ship: s.context, language: s.lang, languages: Object.fromEntries(entries) };
  });
