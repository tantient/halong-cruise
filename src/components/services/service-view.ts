/**
 * Adapter: public read-layer service shapes → the props the Heritage service
 * template renders.
 *
 * Editorial fields the migration stored inside `services.highlights`
 * (`group`, `menuName`, `menuDesc`, `eyebrow`, `tagline`, `highlights[]`) are
 * read through stable keys only — never by brand name or slug — so any ship can
 * add, rename or remove services without a code change.
 */

import type { MediaItem, PublicService } from "@/lib/platform";

export interface ServiceHighlight {
  title: string;
  description: string | null;
}

export interface ServiceView {
  slug: string;
  name: string;
  eyebrow: string | null;
  tagline: string | null;
  intro: string;
  summary: string | null;
  group: string | null;
  openingHours: string | null;
  priceNote: string | null;
  highlights: ServiceHighlight[];
  cover: MediaItem | null;
  gallery: MediaItem[];
}

function bag(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function highlightList(source: Record<string, unknown>): ServiceHighlight[] {
  // Accept both the current `highlights` key and the legacy `items` key.
  const raw = Array.isArray(source["highlights"])
    ? source["highlights"]
    : Array.isArray(source["items"])
      ? source["items"]
      : [];
  return raw
    .map((entry) => {
      const item = bag(entry);
      const title = str(item["title"]);
      if (!title) return null;
      return { title, description: str(item["description"]) ?? str(item["desc"]) };
    })
    .filter((h): h is ServiceHighlight => h !== null);
}

export function toServiceView(service: PublicService): ServiceView {
  const meta = bag(service.highlights);
  const gallery = service.media.gallery.length > 0 ? service.media.gallery : service.media.all;
  const cover = service.media.cover ?? gallery[0] ?? null;
  return {
    slug: service.slug,
    name: service.name,
    eyebrow: str(meta["eyebrow"]),
    tagline: str(meta["tagline"]),
    intro: service.description ?? service.summary ?? "",
    summary: service.summary,
    group: str(meta["group"]),
    openingHours: service.openingHours,
    priceNote: service.priceNote,
    highlights: highlightList(meta),
    cover,
    gallery,
  };
}

/** Media items rendered by the shared lightbox component. */
