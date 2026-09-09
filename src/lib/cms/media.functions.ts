/**
 * CMS service layer — media library and entity attachments.
 *
 *   Admin UI → these server functions → storage + database
 *
 * Every function requires the `admin` role, validates input with Zod on the
 * server and stays tenant-generic (no brand, slug or count is hardcoded).
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "./admin-auth";
import { SHIP_MEDIA_BUCKET, mediaUrl } from "@/lib/platform/media";

export const MEDIA_USAGES = ["cover", "hero", "gallery", "floorplan", "other"] as const;
export const MEDIA_ENTITY_TYPES = [
  "ship",
  "cabin",
  "itinerary",
  "service",
  "offer",
  "ship_page",
  "job_position",
  "homepage_section",
] as const;

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

const nullableText = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .transform((v) => (v && v.length > 0 ? v : null));

const translationMap = z
  .record(z.string(), z.record(z.string(), z.string()))
  .optional()
  .transform((v) => v ?? {});

function cleanTranslations(input: Record<string, Record<string, string>>) {
  const out: Record<string, Record<string, string>> = {};
  for (const [lang, fields] of Object.entries(input)) {
    const kept: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields)) {
      const trimmed = typeof value === "string" ? value.trim() : "";
      if (trimmed.length > 0) kept[key] = trimmed;
    }
    if (Object.keys(kept).length > 0) out[lang] = kept;
  }
  return out;
}

/** Storage-safe segment: lowercase, alphanumeric plus dash/dot/underscore. */
function safeSegment(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
}

const MEDIA_COLUMNS =
  "id,ship_id,storage_path,alt,caption,width,height,mime_type,category,sort_order,is_featured,translations,created_at";

export interface AdminMediaItem {
  id: string;
  shipId: string;
  storagePath: string;
  url: string;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  mimeType: string | null;
  category: string;
  sortOrder: number;
  isFeatured: boolean;
  translations: Record<string, Record<string, string>>;
  usedBy: number;
}

/** Whole media library of one ship, with how many places each asset is used. */
export const listMediaAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => z.object({ shipId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const [media, links] = await Promise.all([
      context.supabase
        .from("media")
        .select(MEDIA_COLUMNS)
        .eq("ship_id", data.shipId)
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true }),
      context.supabase.from("entity_media").select("media_id").eq("ship_id", data.shipId),
    ]);
    if (media.error) throw new Error(media.error.message);
    if (links.error) throw new Error(links.error.message);

    const uses = new Map<string, number>();
    for (const l of links.data ?? []) uses.set(l.media_id, (uses.get(l.media_id) ?? 0) + 1);

    const items: AdminMediaItem[] = (media.data ?? []).map((m) => ({
      id: m.id,
      shipId: m.ship_id,
      storagePath: m.storage_path,
      url: mediaUrl(m.storage_path),
      alt: m.alt,
      caption: m.caption,
      width: m.width,
      height: m.height,
      mimeType: m.mime_type,
      category: m.category,
      sortOrder: m.sort_order,
      isFeatured: m.is_featured,
      translations: (m.translations ?? {}) as Record<string, Record<string, string>>,
      usedBy: uses.get(m.id) ?? 0,
    }));

    const categories = [...new Set(items.map((i) => i.category))].sort();
    return { items, categories };
  });

const uploadSchema = z.object({
  shipId: z.string().uuid(),
  category: z.string().trim().min(1).max(60),
  fileName: z.string().trim().min(1).max(200),
  mimeType: z.string().trim().min(1).max(120),
  contentBase64: z.string().min(1),
  alt: nullableText,
  caption: nullableText,
  width: z.number().int().min(0).max(20000).nullable().optional(),
  height: z.number().int().min(0).max(20000).nullable().optional(),
  sortOrder: z.number().int().min(0).max(9999).optional(),
});

/** Uploads one image into `ship-media/<ship-slug>/<category>/<file>` and records it. */
export const uploadMediaAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => uploadSchema.parse(raw))
  .handler(async ({ data, context }) => {
    if (!/^image\//.test(data.mimeType)) throw new Error("Chỉ hỗ trợ tệp ảnh");

    const { data: ship, error: shipError } = await context.supabase
      .from("ships")
      .select("slug")
      .eq("id", data.shipId)
      .maybeSingle();
    if (shipError) throw new Error(shipError.message);
    if (!ship) throw new Error("Không tìm thấy tàu");

    const bytes = Buffer.from(data.contentBase64, "base64");
    if (bytes.byteLength === 0) throw new Error("Tệp trống");
    if (bytes.byteLength > MAX_UPLOAD_BYTES) throw new Error("Tệp vượt quá 20MB");

    const category = safeSegment(data.category) || "misc";
    const base = safeSegment(data.fileName) || `image-${Date.now()}`;
    const withExt = /\.[a-z0-9]{2,5}$/.test(base) ? base : `${base}.webp`;
    const unique = withExt.replace(/(\.[a-z0-9]{2,5})$/, `-${Date.now().toString(36)}$1`);
    const storagePath = `${safeSegment(ship.slug)}/${category}/${unique}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: uploadError } = await supabaseAdmin.storage
      .from(SHIP_MEDIA_BUCKET)
      .upload(storagePath, bytes, { contentType: data.mimeType, upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    const { data: row, error } = await context.supabase
      .from("media")
      .insert({
        ship_id: data.shipId,
        storage_path: storagePath,
        alt: data.alt,
        caption: data.caption,
        width: data.width ?? null,
        height: data.height ?? null,
        mime_type: data.mimeType,
        category,
        sort_order: data.sortOrder ?? 0,
      })
      .select("id")
      .single();
    if (error) {
      await supabaseAdmin.storage.from(SHIP_MEDIA_BUCKET).remove([storagePath]);
      throw new Error(error.message);
    }
    return { mediaId: row.id, storagePath };
  });

export const updateMediaAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z
      .object({
        shipId: z.string().uuid(),
        mediaId: z.string().uuid(),
        alt: nullableText,
        caption: nullableText,
        category: z.string().trim().min(1).max(60),
        sortOrder: z.number().int().min(0).max(9999),
        isFeatured: z.boolean().optional(),
        translations: translationMap,
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("media")
      .update({
        alt: data.alt,
        caption: data.caption,
        category: safeSegment(data.category) || "misc",
        sort_order: data.sortOrder,
        is_featured: data.isFeatured ?? false,
        translations: cleanTranslations(data.translations),
      })
      .eq("id", data.mediaId)
      .eq("ship_id", data.shipId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Removes an asset: attachments first, then the row, then the stored object. */
export const deleteMediaAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z.object({ shipId: z.string().uuid(), mediaId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("media")
      .select("id,storage_path")
      .eq("id", data.mediaId)
      .eq("ship_id", data.shipId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Không tìm thấy ảnh");

    const detach = await context.supabase
      .from("entity_media")
      .delete()
      .eq("ship_id", data.shipId)
      .eq("media_id", data.mediaId);
    if (detach.error) throw new Error(detach.error.message);

    const del = await context.supabase
      .from("media")
      .delete()
      .eq("id", data.mediaId)
      .eq("ship_id", data.shipId);
    if (del.error) throw new Error(del.error.message);

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.storage.from(SHIP_MEDIA_BUCKET).remove([row.storage_path]);
    return { ok: true };
  });

export interface AdminAttachment {
  linkId: string;
  mediaId: string;
  usage: string;
  sortOrder: number;
  url: string;
  storagePath: string;
  alt: string | null;
  category: string;
}

/** Attachments of one entity, ready to render as thumbnails. */
export const listAttachmentsAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z
      .object({
        shipId: z.string().uuid(),
        entityType: z.enum(MEDIA_ENTITY_TYPES),
        entityId: z.string().uuid(),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const links = await context.supabase
      .from("entity_media")
      .select("id,media_id,usage,sort_order")
      .eq("ship_id", data.shipId)
      .eq("entity_type", data.entityType)
      .eq("entity_id", data.entityId)
      .order("sort_order", { ascending: true });
    if (links.error) throw new Error(links.error.message);
    const ids = [...new Set((links.data ?? []).map((l) => l.media_id))];
    if (ids.length === 0) return { attachments: [] as AdminAttachment[] };

    const media = await context.supabase
      .from("media")
      .select("id,storage_path,alt,category")
      .eq("ship_id", data.shipId)
      .in("id", ids);
    if (media.error) throw new Error(media.error.message);
    const byId = new Map((media.data ?? []).map((m) => [m.id, m]));

    const attachments: AdminAttachment[] = [];
    for (const l of links.data ?? []) {
      const m = byId.get(l.media_id);
      if (!m) continue;
      attachments.push({
        linkId: l.id,
        mediaId: l.media_id,
        usage: l.usage,
        sortOrder: l.sort_order,
        url: mediaUrl(m.storage_path),
        storagePath: m.storage_path,
        alt: m.alt,
        category: m.category,
      });
    }
    return { attachments };
  });

export const attachMediaAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z
      .object({
        shipId: z.string().uuid(),
        mediaId: z.string().uuid(),
        entityType: z.enum(MEDIA_ENTITY_TYPES),
        entityId: z.string().uuid(),
        usage: z.enum(MEDIA_USAGES),
        sortOrder: z.number().int().min(0).max(9999).optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    // A cover is single: replace any existing cover of the same entity.
    if (data.usage === "cover") {
      const clear = await context.supabase
        .from("entity_media")
        .delete()
        .eq("ship_id", data.shipId)
        .eq("entity_type", data.entityType)
        .eq("entity_id", data.entityId)
        .eq("usage", "cover");
      if (clear.error) throw new Error(clear.error.message);
    }

    const { error } = await context.supabase.from("entity_media").insert({
      ship_id: data.shipId,
      media_id: data.mediaId,
      entity_type: data.entityType,
      entity_id: data.entityId,
      usage: data.usage,
      sort_order: data.sortOrder ?? 0,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateAttachmentAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z
      .object({
        shipId: z.string().uuid(),
        linkId: z.string().uuid(),
        usage: z.enum(MEDIA_USAGES),
        sortOrder: z.number().int().min(0).max(9999),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("entity_media")
      .update({ usage: data.usage, sort_order: data.sortOrder })
      .eq("id", data.linkId)
      .eq("ship_id", data.shipId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const detachMediaAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z.object({ shipId: z.string().uuid(), linkId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("entity_media")
      .delete()
      .eq("id", data.linkId)
      .eq("ship_id", data.shipId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
