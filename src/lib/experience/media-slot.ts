/**
 * Media slots for the experience layer.
 *
 * Every visual slot on the homepage can be fed, independently, with:
 *   - a desktop image and a mobile image
 *   - a desktop video and a mobile video
 *   - a poster / fallback image
 *   - an optional variant per time state (morning | day | golden | night)
 *
 * Which asset plays where is decided in the database through the media usage
 * tag, never in code, so production photography/video can replace temporary
 * assets later without touching a single component:
 *
 *   state_<state>_video_<viewport>   e.g. state_night_video_mobile
 *   state_<state>_video
 *   state_<state>_<viewport>         e.g. state_golden_desktop
 *   state_<state>
 *   video_<viewport> | video
 *   hero_<viewport> | <viewport>
 *   poster
 *
 * Anything missing falls back down the list and finally to the section's
 * regular cover / hero / gallery media, so a slot is never empty.
 */

import type { EntityMedia, MediaItem } from "@/lib/platform";
import type { TimeState } from "./time-of-day";

export type Viewport = "desktop" | "mobile";

export interface MediaSlot {
  /** Still image for this state + viewport. */
  image: MediaItem | null;
  /** Optional motion asset; when present it plays over the image. */
  video: MediaItem | null;
  /** Poster shown while a video loads, and when motion is suppressed. */
  poster: MediaItem | null;
}

export const stateUsage = (state: TimeState) => `state_${state}`;

export function isVideo(item: MediaItem | null | undefined): boolean {
  if (!item) return false;
  if (item.mimeType?.startsWith("video/")) return true;
  return /\.(mp4|webm|mov|m4v)$/i.test(item.storagePath || item.url);
}

function byUsage(media: EntityMedia | undefined, usages: string[]): MediaItem | null {
  if (!media) return null;
  for (const usage of usages) {
    const hit = media.all.find((m) => m.usage === usage);
    if (hit) return hit;
  }
  return null;
}

function genericFallback(media: EntityMedia | undefined): MediaItem[] {
  if (!media) return [];
  const list = [media.cover, ...media.hero, ...media.gallery].filter((m): m is MediaItem => Boolean(m));
  return (list.length ? list : media.all).filter((m) => !isVideo(m));
}

/** Everything this slot can show for a state, for prefetch/crossfade purposes. */
export function stateMedia(media: EntityMedia | undefined, state: TimeState): MediaItem[] {
  if (!media) return [];
  const tagged = media.all.filter((m) => m.usage.startsWith(stateUsage(state)) && !isVideo(m));
  return tagged.length ? tagged : genericFallback(media);
}

export function stateImage(media: EntityMedia | undefined, state: TimeState): MediaItem | null {
  return stateMedia(media, state)[0] ?? null;
}

/** Resolve the full slot for a state and viewport. */
export function resolveMediaSlot(
  media: EntityMedia | undefined,
  state: TimeState,
  viewport: Viewport,
): MediaSlot {
  const s = stateUsage(state);
  const video = byUsage(media, [
    `${s}_video_${viewport}`,
    `${s}_video`,
    `video_${viewport}`,
    "video",
  ]);
  const image =
    byUsage(media, [
      `${s}_${viewport}`,
      s,
      `hero_${viewport}`,
      viewport,
      `${s}_poster`,
      "poster",
    ]) ?? stateImage(media, state);
  const poster = byUsage(media, [`${s}_poster`, "poster"]) ?? image;
  return { image, video: isVideo(video) ? video : null, poster };
}
