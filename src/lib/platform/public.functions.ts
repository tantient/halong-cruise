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
import type { PublicHomepage, PublicJobPosition, ShipContext } from "./types";

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

export const getPublicItineraries = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => pathInput.parse(d ?? {}))
  .handler(async ({ data }) => {
    const s = await publicScope(data.pathname);
    if (!s) return [];
    const { listItineraries } = await import("./content.server");
    return listItineraries(s.scope);
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
