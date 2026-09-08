/**
 * Adapter: public read-layer itinerary shapes → the props the Heritage
 * itinerary template renders.
 *
 * Rules kept deliberately data-driven so any ship works:
 * - `duration` is the stored display string (`highlights.duration`); it is
 *   never derived from `days`/`nights`, so short voyages (a few hours) and
 *   multi-night voyages both render exactly what the data says.
 * - includes / excludes / highlights come from the stored `highlights` JSON.
 * - The timeline is built from `dayPlan`, ordered by day, and day labels come
 *   from the day rows themselves (no "Day N" strings in code).
 */

import type { Json, MediaItem, PublicItineraryFull, PublicPage } from "@/lib/platform";

export interface TimelineEntry {
  key: string;
  time: string;
  label: string;
}

export interface ItineraryView {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Display duration exactly as stored (e.g. "2 days / 1 night", "4 hours"). */
  duration: string;
  includes: string[];
  excludes: string[];
  highlights: string[];
  timeline: TimelineEntry[];
  cover: MediaItem | null;
  gallery: MediaItem[];
}

function strings(value: Json | undefined): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.trim() !== "") : [];
}

function bag(itinerary: PublicItineraryFull): Record<string, Json> {
  const h = itinerary.highlights;
  return h && typeof h === "object" && !Array.isArray(h) ? (h as Record<string, Json>) : {};
}

function timelineOf(itinerary: PublicItineraryFull): TimelineEntry[] {
  const days = [...itinerary.dayPlan].sort((a, b) => a.dayNumber - b.dayNumber || a.sortOrder - b.sortOrder);
  const multiDay = days.length > 1;
  const out: TimelineEntry[] = [];
  for (const day of days) {
    day.timeline.forEach((raw, index) => {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
      const item = raw as Record<string, Json>;
      const time = typeof item['time'] === "string" ? item['time'] : "";
      const label = typeof item['label'] === "string" ? item['label'] : "";
      if (!label) return;
      // On multi-day voyages the day's own (localized) title introduces its
      // first entry, mirroring how the source content reads.
      const prefix = multiDay && index === 0 && day.title ? `${day.title}: ` : "";
      out.push({ key: `${day.id}-${index}`, time, label: `${prefix}${label}` });
    });
  }
  return out;
}

export function toItineraryView(itinerary: PublicItineraryFull): ItineraryView {
  const h = bag(itinerary);
  const duration = typeof h['duration'] === "string" ? h['duration'] : "";
  return {
    id: itinerary.id,
    slug: itinerary.slug,
    name: itinerary.name,
    description: itinerary.description ?? itinerary.summary ?? "",
    duration,
    includes: strings(h['includes']),
    excludes: strings(h['excludes']),
    highlights: strings(h['highlights']),
    timeline: timelineOf(itinerary),
    cover: itinerary.media.cover ?? itinerary.media.hero[0] ?? itinerary.media.all[0] ?? null,
    gallery: itinerary.media.gallery,
  };
}

/** Editorial copy of the itineraries index page. */
export function itinerariesText(page: PublicPage | null, key: string): string {
  const v = page?.text[key];
  return typeof v === "string" ? v : "";
}
