/**
 * Adapter: public read-layer shapes → the props the Heritage cabin template
 * renders. Keeps display strings exactly as stored in the database (e.g.
 * "30 – 33 m²" is never derived from the numeric `size_sqm`).
 *
 * Cabin details are matched on the stable `group` key, never on the label,
 * because labels are localized.
 */

import type { MediaItem, PublicCabinFull, PublicPage } from "@/lib/platform";

export interface PlanZone {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CabinView {
  slug: string;
  name: string;
  summary: string;
  description: string;
  code: string | null;
  /** Area shown is a total private area (suite classes) — data-driven, no brand logic. */
  vip: boolean;
  areaValue: string;
  areaNote: string | null;
  view: string | null;
  roomCount: string | null;
  capacity: string | null;
  bed: string | null;
  deck: string | null;
  maxGuests: number | null;
  cover: MediaItem | null;
  gallery: MediaItem[];
  highlights: string[];
  amenities: string[];
  plan: PlanZone[];
}

function groupValue(cabin: PublicCabinFull, group: string): string | null {
  const d = cabin.details.find((x) => x.group === group);
  return d?.value?.trim() ? d.value : null;
}

function listOfType(cabin: PublicCabinFull, contentType: string): string[] {
  return (cabin.detailsByType[contentType] ?? []).map((d) => d.label).filter(Boolean);
}

function parsePlan(cabin: PublicCabinFull): PlanZone[] {
  const raw = groupValue(cabin, "layout");
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((z) => {
      if (!z || typeof z !== "object") return [];
      const o = z as Record<string, unknown>;
      if (typeof o["label"] !== "string") return [];
      const num = (k: string) => (typeof o[k] === "number" ? (o[k] as number) : 0);
      return [{ label: o["label"], x: num("x"), y: num("y"), w: num("w"), h: num("h") }];
    });
  } catch {
    return [];
  }
}

export function toCabinView(cabin: PublicCabinFull): CabinView {
  const areaNote = groupValue(cabin, "area_note");
  return {
    slug: cabin.slug,
    name: cabin.name,
    summary: cabin.summary ?? "",
    description: cabin.description ?? cabin.summary ?? "",
    code: groupValue(cabin, "code"),
    vip: areaNote !== null,
    areaValue: groupValue(cabin, "area") ?? (cabin.sizeSqm !== null ? `${cabin.sizeSqm} m²` : ""),
    areaNote,
    view: groupValue(cabin, "view") ?? cabin.viewType,
    roomCount: groupValue(cabin, "room_count"),
    capacity: groupValue(cabin, "capacity"),
    bed: groupValue(cabin, "bed") ?? cabin.bedConfig,
    deck: groupValue(cabin, "deck") ?? cabin.deck,
    maxGuests: cabin.maxGuests,
    cover: cabin.media.cover ?? cabin.media.all[0] ?? null,
    gallery: cabin.media.gallery.length ? cabin.media.gallery : cabin.media.all.slice(1),
    highlights: listOfType(cabin, "highlight"),
    amenities: listOfType(cabin, "amenity"),
    plan: parsePlan(cabin),
  };
}

/** Compact shape for the "other cabins" links. */
export interface CabinLink {
  slug: string;
  name: string;
  cover: MediaItem | null;
  /** "code · area · view" summary line, built from stored values only. */
  meta: string;
}

export function toCabinLink(cabin: PublicCabinFull): CabinLink {
  const v = toCabinView(cabin);
  return {
    slug: v.slug,
    name: v.name,
    cover: v.cover,
    meta: [v.code, v.areaValue, v.view].filter(Boolean).join(" · "),
  };
}

/** Page copy accessor with `{total}` substitution for the ship's cabin count. */
export function pageText(page: PublicPage | null, key: string, totalCabins: number | null): string {
  const v = page?.text[key];
  const s = typeof v === "string" ? v : "";
  return totalCabins === null ? s : s.replace(/\{total\}/g, String(totalCabins));
}
