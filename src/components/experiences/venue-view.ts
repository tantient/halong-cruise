/**
 * Adapter: venue records → what a public page may state about a place aboard.
 *
 * Rules encoded here (data-driven, no ship-specific names in code):
 *  - the displayed name is the commercial name when the ship has one, otherwise
 *    the functional name — never an invented brand;
 *  - area and capacity are only shown when the record allows it, so figures can
 *    be stored for internal use without being published;
 *  - sub-spaces (rooms inside a venue) and non-public venues never become cards.
 */

import type { MediaItem, PublicVenue } from "@/lib/platform";

export interface VenueView {
  key: string;
  category: string;
  /** Name to display: commercial name when set, otherwise the functional name. */
  name: string;
  functionalName: string;
  location: string | null;
  summary: string | null;
  /** Area in m², only when the record allows publishing it. */
  area: number | null;
  /** Guest capacity, only when the record allows publishing it. */
  capacity: number | null;
  capacityUnit: string;
  specNote: string | null;
  cover: MediaItem | null;
  gallery: MediaItem[];
}

export function toVenueView(v: PublicVenue): VenueView {
  const gallery = v.media.gallery.length > 0 ? v.media.gallery : v.media.all;
  return {
    key: v.key,
    category: v.category,
    name: v.commercialName?.trim() || v.functionalName,
    functionalName: v.functionalName,
    location: v.location,
    summary: v.summary,
    area: v.showArea ? v.areaSqm : null,
    capacity: v.showCapacity ? v.capacity : null,
    capacityUnit: v.capacityUnit,
    specNote: v.specNote,
    cover: v.media.cover ?? gallery[0] ?? null,
    gallery,
  };
}

/** Public, top-level venues of one category, in record order. */
export function venuesInCategory(venues: PublicVenue[], category: string): VenueView[] {
  return venues
    .filter((v) => v.category === category && v.showPublic && !v.parentKey)
    .map(toVenueView);
}

/** Factual one-line detail under a venue name (location and allowed figures). */
export function venueFacts(
  venue: VenueView,
  labels: { area: string; upTo: string; guests: string },
): string | null {
  const parts: string[] = [];
  if (venue.location) parts.push(venue.location);
  if (venue.area) parts.push(`${venue.area} m² ${labels.area}`.trim());
  if (venue.capacity) parts.push(`${labels.upTo} ${venue.capacity} ${labels.guests}`);
  if (venue.specNote) parts.push(venue.specNote);
  return parts.length > 0 ? parts.join(" · ") : null;
}

/** Venue names + factual line, ready for the shared editorial list block. */
export function venueListItems(
  venues: VenueView[],
  labels: { area: string; upTo: string; guests: string },
): Array<{ title: string; description: string | null }> {
  return venues.map((v) => {
    const facts = venueFacts(v, labels);
    const summary = v.summary?.trim() ?? "";
    return {
      title: v.name,
      description: [facts, summary].filter(Boolean).join(" — ") || null,
    };
  });
}
