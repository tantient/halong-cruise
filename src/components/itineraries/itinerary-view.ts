/**
 * Adapter: public read-layer itinerary shapes → the props the voyage templates
 * render.
 *
 * Rules kept deliberately data-driven so any ship works:
 * - `duration` is the stored display string (`highlights.duration`); it is
 *   never derived from `days`/`nights`.
 * - `destination` is the stored region (`highlights.destination`); missing →
 *   empty string and the label simply is not rendered.
 * - includes / excludes / highlights come from the stored `highlights` JSON.
 * - Day plan / timeline entries come from the day rows themselves (no "Day N"
 *   strings in code); an entry may carry its own optional media URL so the
 *   presentation is media-ready without any schema change.
 */

import type { Json, MediaItem, PublicItineraryFull, PublicPage } from "@/lib/platform";

export interface TimelineEntry {
  key: string;
  time: string;
  label: string;
  description: string;
  /** Optional activity media stored on the timeline entry itself. */
  image: string | null;
}

export interface DayView {
  id: string;
  dayNumber: number;
  /** Localized day title exactly as stored (may be empty). */
  title: string;
  description: string;
  entries: TimelineEntry[];
}

export interface ItineraryView {
  id: string;
  slug: string;
  name: string;
  description: string;
  /** Display duration exactly as stored (e.g. "2 days / 1 night"). */
  duration: string;
  /** Stored operating region, e.g. "Lan Ha Bay". */
  destination: string;
  days: number | null;
  nights: number | null;
  departurePoint: string;
  includes: string[];
  excludes: string[];
  highlights: string[];
  /** Flat timeline, kept for compact presentations. */
  timeline: TimelineEntry[];
  /** Grouped day plan, ordered by day number. */
  dayPlan: DayView[];
  cover: MediaItem | null;
  gallery: MediaItem[];
}

function strings(value: Json | undefined): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.trim() !== "") : [];
}

function str(value: Json | undefined): string {
  return typeof value === "string" ? value : "";
}

function bag(itinerary: PublicItineraryFull): Record<string, Json> {
  const h = itinerary.highlights;
  return h && typeof h === "object" && !Array.isArray(h) ? (h as Record<string, Json>) : {};
}

function dayViews(itinerary: PublicItineraryFull): DayView[] {
  const days = [...itinerary.dayPlan].sort((a, b) => a.dayNumber - b.dayNumber || a.sortOrder - b.sortOrder);
  return days.map((day) => {
    const entries: TimelineEntry[] = [];
    day.timeline.forEach((raw, index) => {
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
      const item = raw as Record<string, Json>;
      const label = str(item['label']);
      if (!label) return;
      entries.push({
        key: `${day.id}-${index}`,
        time: str(item['time']),
        label,
        description: str(item['description']),
        image: str(item['image']) || str(item['media']) || null,
      });
    });
    return {
      id: day.id,
      dayNumber: day.dayNumber,
      title: day.title ?? "",
      description: day.description ?? "",
      entries,
    };
  });
}

export function toItineraryView(itinerary: PublicItineraryFull): ItineraryView {
  const h = bag(itinerary);
  const plan = dayViews(itinerary);
  const multiDay = plan.length > 1;
  return {
    id: itinerary.id,
    slug: itinerary.slug,
    name: itinerary.name,
    description: itinerary.description ?? itinerary.summary ?? "",
    duration: str(h['duration']),
    destination: str(h['destination']),
    days: itinerary.days,
    nights: itinerary.nights,
    departurePoint: itinerary.departurePoint ?? "",
    includes: strings(h['includes']),
    excludes: strings(h['excludes']),
    highlights: strings(h['highlights']),
    timeline: plan.flatMap((day) =>
      day.entries.map((entry, index) => ({
        ...entry,
        label: multiDay && index === 0 && day.title ? `${day.title}: ${entry.label}` : entry.label,
      })),
    ),
    dayPlan: plan,
    cover: itinerary.media.cover ?? itinerary.media.hero[0] ?? itinerary.media.all[0] ?? null,
    gallery: itinerary.media.gallery,
  };
}

/** Editorial copy of the itineraries index page. */
export function itinerariesText(page: PublicPage | null, key: string): string {
  const v = page?.text[key];
  return typeof v === "string" ? v : "";
}
