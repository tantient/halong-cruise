/**
 * Media layer: turns `media` + `entity_media` rows into `EntityMedia` groups and
 * resolves storage paths to URLs.
 *
 * URL strategy: every `media.storage_path` maps to a stable same-origin URL
 * `/api/public/media/<path>` served by `src/routes/api/public/media/$.ts`.
 * That route streams from the `ship-media` bucket regardless of whether the
 * bucket is public or private, so components never depend on the bucket
 * setting. Switching to direct storage URLs later only touches `mediaUrl`.
 */

import type { LanguageCode } from "@/lib/i18n/languages";
import { localizeRow } from "@/lib/i18n/localize";
import type { EntityMedia, MediaItem } from "./types";

export const SHIP_MEDIA_BUCKET = "ship-media";
export const MEDIA_ROUTE_PREFIX = "/api/public/media";

/** Same-origin URL for a `media.storage_path` (`<ship-slug>/<category>/<file>`). */
export function mediaUrl(storagePath: string): string {
  if (/^https?:\/\//.test(storagePath)) return storagePath;
  const clean = storagePath.replace(/^\/+/, "");
  return `${MEDIA_ROUTE_PREFIX}/${clean}`;
}

export interface MediaRow {
  id: string;
  storage_path: string;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  mime_type: string | null;
  category: string;
  sort_order: number;
  translations?: unknown;
}

export interface EntityMediaRow {
  media_id: string;
  entity_type: string;
  entity_id: string;
  usage: string;
  sort_order: number;
}

export function emptyEntityMedia(): EntityMedia {
  return { cover: null, hero: [], gallery: [], floorplan: [], all: [] };
}

export function toMediaItem(
  row: MediaRow,
  usage: string,
  sortOrder: number,
  language: LanguageCode,
  defaultLanguage: LanguageCode,
): MediaItem {
  const m = localizeRow(row, language, defaultLanguage).value;
  return {
    id: m.id,
    url: mediaUrl(m.storage_path),
    storagePath: m.storage_path,
    alt: m.alt,
    caption: m.caption,
    width: m.width,
    height: m.height,
    mimeType: m.mime_type,
    category: m.category,
    usage,
    sortOrder,
  };
}

/** Groups a flat list of items into the `EntityMedia` shape. */
export function groupMedia(items: MediaItem[]): EntityMedia {
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  const by = (u: string) => sorted.filter((i) => i.usage === u);
  return {
    cover: by("cover")[0] ?? null,
    hero: by("hero"),
    gallery: by("gallery"),
    floorplan: by("floorplan"),
    all: sorted,
  };
}

/**
 * Builds a lookup `entity_id → EntityMedia` from joined rows so list readers
 * attach media to many entities with a single query.
 */
export function buildMediaIndex(
  links: EntityMediaRow[],
  media: MediaRow[],
  language: LanguageCode,
  defaultLanguage: LanguageCode,
): Map<string, EntityMedia> {
  const mediaById = new Map(media.map((m) => [m.id, m]));
  const perEntity = new Map<string, MediaItem[]>();
  for (const link of links) {
    const m = mediaById.get(link.media_id);
    if (!m) continue;
    const list = perEntity.get(link.entity_id) ?? [];
    list.push(toMediaItem(m, link.usage, link.sort_order, language, defaultLanguage));
    perEntity.set(link.entity_id, list);
  }
  const out = new Map<string, EntityMedia>();
  for (const [id, items] of perEntity) out.set(id, groupMedia(items));
  return out;
}

export function mediaFor(index: Map<string, EntityMedia>, entityId: string): EntityMedia {
  return index.get(entityId) ?? emptyEntityMedia();
}
