/**
 * Public content readers. Every reader:
 *  - is scoped by `shipId` (never trusted from the client — callers obtain it
 *    from `resolveShipByHost`);
 *  - runs as anon, so RLS restricts rows to published content of live ships;
 *  - orders by `sort_order`;
 *  - localizes rows (requested language → ship default) before returning;
 *  - attaches media via `entity_media` so components never join tables.
 */

import type { LanguageCode } from "@/lib/i18n/languages";
import { localizeRow, localizeRows } from "@/lib/i18n/localize";
import { buildMediaIndex, emptyEntityMedia, groupMedia, mediaFor, toMediaItem, type EntityMediaRow, type MediaRow } from "./media";
import { getPublicDb } from "./supabase-public.server";
import type {
  EntityMedia,
  Json,
  PublicCabin,
  PublicCabinDetail,
  PublicCabinFull,
  PublicHomepage,
  PublicHomepageSection,
  PublicItinerary,
  PublicItineraryDay,
  PublicItineraryFull,
  PublicJobPosition,
  PublicOffer,
  PublicPage,
  PublicService,
} from "./types";

export interface ReadScope {
  shipId: string;
  language: LanguageCode;
  defaultLanguage: LanguageCode;
}

const MEDIA_COLUMNS = "id,storage_path,alt,caption,width,height,mime_type,category,sort_order,translations";

/* ------------------------------------------------------------------ media */

/** Loads media for many entities of one type in two queries. */
export async function loadEntityMedia(
  scope: ReadScope,
  entityType: string,
  entityIds: string[],
): Promise<Map<string, EntityMedia>> {
  if (entityIds.length === 0) return new Map();
  const db = getPublicDb();
  const { data: links, error } = await db
    .from("entity_media")
    .select("media_id,entity_type,entity_id,usage,sort_order")
    .eq("ship_id", scope.shipId)
    .eq("entity_type", entityType)
    .in("entity_id", entityIds)
    .order("sort_order");
  if (error) throw error;
  const mediaIds = [...new Set((links ?? []).map((l) => l.media_id))];
  if (mediaIds.length === 0) return new Map();
  const { data: media, error: mErr } = await db
    .from("media")
    .select(MEDIA_COLUMNS)
    .eq("ship_id", scope.shipId)
    .in("id", mediaIds);
  if (mErr) throw mErr;
  return buildMediaIndex(links as EntityMediaRow[], (media ?? []) as MediaRow[], scope.language, scope.defaultLanguage);
}

/** Media for a single entity (cover / gallery / floorplan / hero). */
export async function getEntityMedia(scope: ReadScope, entityType: string, entityId: string): Promise<EntityMedia> {
  const index = await loadEntityMedia(scope, entityType, [entityId]);
  return mediaFor(index, entityId);
}

/** All media of a ship in a category (e.g. a gallery page). */
export async function listMediaByCategory(scope: ReadScope, category: string) {
  const db = getPublicDb();
  const { data, error } = await db
    .from("media")
    .select(MEDIA_COLUMNS)
    .eq("ship_id", scope.shipId)
    .eq("category", category)
    .order("sort_order");
  if (error) throw error;
  return ((data ?? []) as MediaRow[]).map((m) => toMediaItem(m, "gallery", m.sort_order, scope.language, scope.defaultLanguage));
}

/* ----------------------------------------------------------------- cabins */

const CABIN_COLUMNS =
  "id,slug,name,category,size_sqm,max_guests,bed_config,view_type,deck,summary,description,price_from,currency,sort_order,translations";

type CabinRow = {
  id: string; slug: string; name: string; category: string | null; size_sqm: number | null; max_guests: number | null;
  bed_config: string | null; view_type: string | null; deck: string | null; summary: string | null; description: string | null;
  price_from: number | null; currency: string | null; sort_order: number; translations: unknown;
};

function toCabin(r: CabinRow, media: EntityMedia): PublicCabin {
  return {
    id: r.id, slug: r.slug, name: r.name, category: r.category, sizeSqm: r.size_sqm, maxGuests: r.max_guests,
    bedConfig: r.bed_config, viewType: r.view_type, deck: r.deck, summary: r.summary, description: r.description,
    priceFrom: r.price_from, currency: r.currency, sortOrder: r.sort_order, media,
  };
}

export async function listCabins(scope: ReadScope): Promise<PublicCabin[]> {
  const db = getPublicDb();
  const { data, error } = await db.from("cabins").select(CABIN_COLUMNS).eq("ship_id", scope.shipId).order("sort_order");
  if (error) throw error;
  const rows = localizeRows((data ?? []) as CabinRow[], scope.language, scope.defaultLanguage);
  const media = await loadEntityMedia(scope, "cabin", rows.map((r) => r.id));
  return rows.map((r) => toCabin(r, mediaFor(media, r.id)));
}

export async function getCabin(scope: ReadScope, slug: string): Promise<PublicCabinFull | null> {
  const db = getPublicDb();
  const { data, error } = await db.from("cabins").select(CABIN_COLUMNS).eq("ship_id", scope.shipId).eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = localizeRow(data as CabinRow, scope.language, scope.defaultLanguage).value;
  const [{ data: details, error: dErr }, media] = await Promise.all([
    db.from("cabin_details").select("id,group_name,label,value,content_type,sort_order,translations").eq("cabin_id", row.id).order("sort_order"),
    getEntityMedia(scope, "cabin", row.id),
  ]);
  if (dErr) throw dErr;
  const list: PublicCabinDetail[] = localizeRows(details ?? [], scope.language, scope.defaultLanguage).map((d) => ({
    id: d.id, group: d.group_name, label: d.label, value: d.value, contentType: d.content_type, sortOrder: d.sort_order,
  }));
  const detailsByType: Record<string, PublicCabinDetail[]> = {};
  for (const d of list) (detailsByType[d.contentType] ??= []).push(d);
  return { ...toCabin(row, media), details: list, detailsByType };
}

/* ------------------------------------------------------------ itineraries */

const ITIN_COLUMNS =
  "id,slug,name,days,nights,departure_point,summary,description,highlights,price_from,currency,sort_order,translations";

type ItinRow = {
  id: string; slug: string; name: string; days: number | null; nights: number | null; departure_point: string | null;
  summary: string | null; description: string | null; highlights: unknown; price_from: number | null; currency: string | null;
  sort_order: number; translations: unknown;
};

function toItinerary(r: ItinRow, media: EntityMedia): PublicItinerary {
  return {
    id: r.id, slug: r.slug, name: r.name, days: r.days, nights: r.nights, departurePoint: r.departure_point,
    summary: r.summary, description: r.description, highlights: r.highlights as Json, priceFrom: r.price_from,
    currency: r.currency, sortOrder: r.sort_order, media,
  };
}

export async function listItineraries(scope: ReadScope): Promise<PublicItinerary[]> {
  const db = getPublicDb();
  const { data, error } = await db.from("itineraries").select(ITIN_COLUMNS).eq("ship_id", scope.shipId).order("sort_order");
  if (error) throw error;
  const rows = localizeRows((data ?? []) as ItinRow[], scope.language, scope.defaultLanguage);
  const media = await loadEntityMedia(scope, "itinerary", rows.map((r) => r.id));
  return rows.map((r) => toItinerary(r, mediaFor(media, r.id)));
}

export async function getItinerary(scope: ReadScope, slug: string): Promise<PublicItineraryFull | null> {
  const db = getPublicDb();
  const { data, error } = await db.from("itineraries").select(ITIN_COLUMNS).eq("ship_id", scope.shipId).eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = localizeRow(data as ItinRow, scope.language, scope.defaultLanguage).value;
  const [{ data: days, error: dErr }, media] = await Promise.all([
    db.from("itinerary_days").select("id,day_number,title,description,timeline,meals,sort_order,translations").eq("itinerary_id", row.id).order("sort_order").order("day_number"),
    getEntityMedia(scope, "itinerary", row.id),
  ]);
  if (dErr) throw dErr;
  const dayPlan: PublicItineraryDay[] = localizeRows(days ?? [], scope.language, scope.defaultLanguage).map((d) => ({
    id: d.id, dayNumber: d.day_number, title: d.title, description: d.description,
    timeline: Array.isArray(d.timeline) ? (d.timeline as Json[]) : [], meals: d.meals, sortOrder: d.sort_order,
  }));
  return { ...toItinerary(row, media), dayPlan };
}

/* --------------------------------------------------------------- services */

const SERVICE_COLUMNS = "id,slug,name,category,summary,description,highlights,opening_hours,price_note,sort_order,translations";
type ServiceRow = {
  id: string; slug: string; name: string; category: string | null; summary: string | null; description: string | null;
  highlights: unknown; opening_hours: string | null; price_note: string | null; sort_order: number; translations: unknown;
};
function toService(r: ServiceRow, media: EntityMedia): PublicService {
  return {
    id: r.id, slug: r.slug, name: r.name, category: r.category, summary: r.summary, description: r.description,
    highlights: r.highlights as Json, openingHours: r.opening_hours, priceNote: r.price_note, sortOrder: r.sort_order, media,
  };
}

export async function listServices(scope: ReadScope): Promise<PublicService[]> {
  const db = getPublicDb();
  const { data, error } = await db.from("services").select(SERVICE_COLUMNS).eq("ship_id", scope.shipId).order("sort_order");
  if (error) throw error;
  const rows = localizeRows((data ?? []) as ServiceRow[], scope.language, scope.defaultLanguage);
  const media = await loadEntityMedia(scope, "service", rows.map((r) => r.id));
  return rows.map((r) => toService(r, mediaFor(media, r.id)));
}

export async function getService(scope: ReadScope, slug: string): Promise<PublicService | null> {
  const db = getPublicDb();
  const { data, error } = await db.from("services").select(SERVICE_COLUMNS).eq("ship_id", scope.shipId).eq("slug", slug).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const row = localizeRow(data as ServiceRow, scope.language, scope.defaultLanguage).value;
  return toService(row, await getEntityMedia(scope, "service", row.id));
}

/* ----------------------------------------------------------------- offers */

const OFFER_COLUMNS =
  "id,slug,name,offer_type,value_text,description,terms,badge,highlights,starts_at,ends_at,sort_order,translations";
type OfferRow = {
  id: string; slug: string; name: string; offer_type: string | null; value_text: string | null; description: string | null;
  terms: string | null; badge: string | null; highlights: unknown; starts_at: string | null; ends_at: string | null;
  sort_order: number; translations: unknown;
};

export async function listOffers(scope: ReadScope, opts: { activeOnly?: boolean } = {}): Promise<PublicOffer[]> {
  const db = getPublicDb();
  let q = db.from("offers").select(OFFER_COLUMNS).eq("ship_id", scope.shipId).order("sort_order");
  if (opts.activeOnly) {
    const today = new Date().toISOString().slice(0, 10);
    q = q.or(`starts_at.is.null,starts_at.lte.${today}`).or(`ends_at.is.null,ends_at.gte.${today}`);
  }
  const { data, error } = await q;
  if (error) throw error;
  const rows = localizeRows((data ?? []) as OfferRow[], scope.language, scope.defaultLanguage);
  const media = await loadEntityMedia(scope, "offer", rows.map((r) => r.id));
  return rows.map((r) => ({
    id: r.id, slug: r.slug, name: r.name, offerType: r.offer_type, valueText: r.value_text, description: r.description,
    terms: r.terms, badge: r.badge, highlights: Array.isArray(r.highlights) ? (r.highlights as Json[]) : [],
    startsAt: r.starts_at, endsAt: r.ends_at, sortOrder: r.sort_order, media: mediaFor(media, r.id),
  }));
}

/* ------------------------------------------------------------------ pages */

type PageRow = {
  id: string; slug: string; title: string; intro: string | null; content: string | null;
  seo_title: string | null; seo_description: string | null; translations: unknown;
};

export async function getPage(scope: ReadScope, slug: string): Promise<PublicPage | null> {
  const db = getPublicDb();
  const { data, error } = await db
    .from("ship_pages")
    .select("id,slug,title,intro,content,seo_title,seo_description,translations")
    .eq("ship_id", scope.shipId)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const r = localizeRow(data as PageRow, scope.language, scope.defaultLanguage).value;
  return {
    id: r.id, slug: r.slug, title: r.title, intro: r.intro, content: r.content,
    seoTitle: r.seo_title, seoDescription: r.seo_description,
    media: await getEntityMedia(scope, "ship_page", r.id),
  };
}

/** Slugs of all published pages (used by the sitemap). */
export async function listPageSlugs(scope: ReadScope): Promise<string[]> {
  const db = getPublicDb();
  const { data, error } = await db.from("ship_pages").select("slug").eq("ship_id", scope.shipId).order("sort_order");
  if (error) throw error;
  return (data ?? []).map((p) => p.slug);
}

/* ---------------------------------------------------------------- careers */

type JobRow = {
  id: string; slug: string; title: string; department: string | null; employment_type: string | null;
  description: string | null; requirements: unknown; benefits: unknown; headcount: number | null; sort_order: number; translations: unknown;
};

export async function listJobPositions(scope: ReadScope): Promise<PublicJobPosition[]> {
  const db = getPublicDb();
  const { data, error } = await db
    .from("job_positions")
    .select("id,slug,title,department,employment_type,description,requirements,benefits,headcount,sort_order,translations")
    .eq("ship_id", scope.shipId)
    .order("sort_order");
  if (error) throw error;
  const rows = (data ?? []) as JobRow[];
  return localizeRows(rows, scope.language, scope.defaultLanguage).map((r) => ({
    id: r.id, slug: r.slug, title: r.title, department: r.department, employmentType: r.employment_type,
    description: r.description, requirements: Array.isArray(r.requirements) ? (r.requirements as Json[]) : [],
    benefits: Array.isArray(r.benefits) ? (r.benefits as Json[]) : [], headcount: r.headcount, sortOrder: r.sort_order,
  }));
}

/* --------------------------------------------------------------- homepage */

type SectionRow = {
  id: string; section_type: string; position: number; configuration: unknown; translations: unknown;
};

export async function getHomepage(scope: ReadScope): Promise<PublicHomepage> {
  const db = getPublicDb();
  const [{ data: sections, error }, shipMedia] = await Promise.all([
    db.from("homepage_sections").select("id,section_type,position,configuration,translations").eq("ship_id", scope.shipId).order("position"),
    getEntityMedia(scope, "ship", scope.shipId),
  ]);
  if (error) throw error;
  const rows = (sections ?? []) as SectionRow[];
  const media = await loadEntityMedia(scope, "homepage_section", rows.map((r) => r.id));
  const out: PublicHomepageSection[] = rows.map((r) => {
    // Section copy lives only in `translations` (all languages incl. default),
    // so read the requested bag with fallback to the default bag.
    const bags = (r.translations ?? {}) as Record<string, Record<string, unknown> | undefined>;
    const text = { ...(bags[scope.defaultLanguage] ?? {}), ...(bags[scope.language] ?? {}) };
    return {
      id: r.id, type: r.section_type, position: r.position,
      configuration: (r.configuration as Record<string, Json>) ?? {}, text: text as Record<string, Json>,
      media: mediaFor(media, r.id),
    };
  });
  return { sections: out, hero: shipMedia.hero.length ? shipMedia.hero : groupMedia(shipMedia.all).hero };
}

/** Slugs needed to enumerate every public URL of a ship (sitemap). */
export async function listPublicSlugs(scope: ReadScope) {
  const db = getPublicDb();
  const pick = (table: "cabins" | "itineraries" | "services" | "offers") =>
    db.from(table).select("slug").eq("ship_id", scope.shipId).order("sort_order");
  const [c, i, s, o, pages] = await Promise.all([pick("cabins"), pick("itineraries"), pick("services"), pick("offers"), listPageSlugs(scope)]);
  for (const r of [c, i, s, o]) if (r.error) throw r.error;
  return {
    cabins: (c.data ?? []).map((r) => r.slug),
    itineraries: (i.data ?? []).map((r) => r.slug),
    services: (s.data ?? []).map((r) => r.slug),
    offers: (o.data ?? []).map((r) => r.slug),
    pages,
  };
}

export { emptyEntityMedia };
