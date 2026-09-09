/**
 * Picks photography for a time state out of database media.
 *
 * Assets are chosen in the database, not in code: each ambient asset is
 * attached to its section with the usage `state_morning | state_day |
 * state_golden | state_night`. Any ship can do the same; no filenames or
 * brand names appear here.
 */

import type { EntityMedia, MediaItem } from "@/lib/platform";
import type { TimeState } from "./time-of-day";

export const stateUsage = (state: TimeState) => `state_${state}`;

/** All assets a section offers for a state, falling back to its regular media. */
export function stateMedia(media: EntityMedia | undefined, state: TimeState): MediaItem[] {
  if (!media) return [];
  const tagged = media.all.filter((m) => m.usage === stateUsage(state));
  if (tagged.length) return tagged;
  const fallback = [media.cover, ...media.hero, ...media.gallery].filter((m): m is MediaItem => Boolean(m));
  return fallback.length ? fallback : media.all;
}

export function stateImage(media: EntityMedia | undefined, state: TimeState): MediaItem | null {
  return stateMedia(media, state)[0] ?? null;
}
