/**
 * CMS service layer — cabins (+ details) and itineraries (+ day plan).
 *
 *   Admin UI → these server functions → database
 *
 * Rules kept here, never in components:
 *  - every row is scoped by `ship_id`, taken from the validated input and
 *    re-asserted in every query (`.eq("ship_id", …)`);
 *  - `status` is only `draft` or `published`; `published_at` is stamped on the
 *    transition and cleared when returning to draft;
 *  - base columns hold the ship's default language, `translations` holds the
 *    other enabled languages;
 *  - nothing is hardcoded per brand: no slug, name or record count.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "./admin-auth";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";

export const CONTENT_STATUSES = ["draft", "published"] as const;

const statusEnum = z.enum(CONTENT_STATUSES);
const languageEnum = z.enum(SUPPORTED_LANGUAGES);

const nullableText = z
  .string()
  .trim()
  .max(20000)
  .optional()
  .transform((v) => (v && v.length > 0 ? v : null));

const nullableNumber = z
  .union([z.number(), z.null()])
  .optional()
  .transform((v) => (typeof v === "number" && Number.isFinite(v) ? v : null));

const nullableInt = z
  .union([z.number().int(), z.null()])
  .optional()
  .transform((v) => (typeof v === "number" && Number.isFinite(v) ? Math.trunc(v) : null));

const translationMap = z
  .record(languageEnum, z.record(z.string(), z.union([z.string(), z.array(z.string())])))
  .optional()
  .transform((v) => v ?? {});

type TranslationInput = Record<string, Record<string, string | string[]>>;

function cleanTranslations(input: TranslationInput) {
  const out: Record<string, Record<string, string | string[]>> = {};
  for (const [lang, fields] of Object.entries(input)) {
    const kept: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (Array.isArray(value)) {
        const list = value.map((v) => v.trim()).filter((v) => v.length > 0);
        if (list.length > 0) kept[key] = list;
      } else if (typeof value === "string" && value.trim().length > 0) {
        kept[key] = value.trim();
      }
    }
    if (Object.keys(kept).length > 0) out[lang] = kept;
  }
  return out;
}

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9][a-z0-9-]*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang")
  .max(120);

function publishFields(status: string, currentPublishedAt: string | null | undefined) {
  if (status === "published") return { published_at: currentPublishedAt ?? new Date().toISOString() };
  return { published_at: null };
}

function friendly(error: { code?: string | undefined; message: string }): Error {
  if (error.code === "23505" || /duplicate key|unique constraint/i.test(error.message)) {
    return new Error("Giá trị này đã tồn tại (slug hoặc số ngày bị trùng)");
  }
  return new Error(error.message);
}

/* --------------------------------------------------------------- cabins */

const CABIN_COLUMNS =
  "id,ship_id,slug,name,category,size_sqm,max_guests,bed_config,view_type,deck,summary,description,price_from,currency,status,published_at,sort_order,translations";

const CABIN_DETAIL_COLUMNS =
  "id,ship_id,cabin_id,group_name,label,value,content_type,sort_order,translations";

export const listCabinsAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => z.object({ shipId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const [cabins, details] = await Promise.all([
      context.supabase
        .from("cabins")
        .select(CABIN_COLUMNS)
        .eq("ship_id", data.shipId)
        .order("sort_order", { ascending: true }),
      context.supabase.from("cabin_details").select("cabin_id").eq("ship_id", data.shipId),
    ]);
    if (cabins.error) throw friendly(cabins.error);
    if (details.error) throw friendly(details.error);

    const counts = new Map<string, number>();
    for (const d of details.data ?? []) counts.set(d.cabin_id, (counts.get(d.cabin_id) ?? 0) + 1);

    return {
      cabins: (cabins.data ?? []).map((c) => ({ ...c, detailCount: counts.get(c.id) ?? 0 })),
    };
  });

export const getCabinAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z.object({ shipId: z.string().uuid(), cabinId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const [cabin, details] = await Promise.all([
      context.supabase
        .from("cabins")
        .select(CABIN_COLUMNS)
        .eq("id", data.cabinId)
        .eq("ship_id", data.shipId)
        .maybeSingle(),
      context.supabase
        .from("cabin_details")
        .select(CABIN_DETAIL_COLUMNS)
        .eq("ship_id", data.shipId)
        .eq("cabin_id", data.cabinId)
        .order("sort_order", { ascending: true }),
    ]);
    if (cabin.error) throw friendly(cabin.error);
    if (!cabin.data) throw new Error("Không tìm thấy phòng");
    if (details.error) throw friendly(details.error);
    return { cabin: cabin.data, details: details.data ?? [] };
  });

const cabinSchema = z.object({
  shipId: z.string().uuid(),
  cabinId: z.string().uuid().optional(),
  slug: slugSchema,
  name: z.string().trim().min(1).max(200),
  category: nullableText,
  sizeSqm: nullableNumber,
  maxGuests: nullableInt,
  bedConfig: nullableText,
  viewType: nullableText,
  deck: nullableText,
  summary: nullableText,
  description: nullableText,
  priceFrom: nullableNumber,
  currency: nullableText,
  status: statusEnum,
  sortOrder: z.number().int().min(0).max(9999),
  translations: translationMap,
});

export const saveCabinAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => cabinSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    let currentPublishedAt: string | null = null;
    if (data.cabinId) {
      const existing = await supabase
        .from("cabins")
        .select("published_at")
        .eq("id", data.cabinId)
        .eq("ship_id", data.shipId)
        .maybeSingle();
      if (existing.error) throw friendly(existing.error);
      if (!existing.data) throw new Error("Không tìm thấy phòng");
      currentPublishedAt = existing.data.published_at;
    }

    const payload = {
      ship_id: data.shipId,
      slug: data.slug,
      name: data.name,
      category: data.category,
      size_sqm: data.sizeSqm,
      max_guests: data.maxGuests,
      bed_config: data.bedConfig,
      view_type: data.viewType,
      deck: data.deck,
      summary: data.summary,
      description: data.description,
      price_from: data.priceFrom,
      currency: data.currency,
      status: data.status,
      sort_order: data.sortOrder,
      translations: cleanTranslations(data.translations),
      updated_by: userId,
      ...publishFields(data.status, currentPublishedAt),
    };

    if (data.cabinId) {
      const { error } = await supabase
        .from("cabins")
        .update(payload)
        .eq("id", data.cabinId)
        .eq("ship_id", data.shipId);
      if (error) throw friendly(error);
      return { cabinId: data.cabinId };
    }

    const { data: row, error } = await supabase
      .from("cabins")
      .insert({ ...payload, created_by: userId })
      .select("id")
      .single();
    if (error) throw friendly(error);
    return { cabinId: row.id };
  });

export const deleteCabinAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z.object({ shipId: z.string().uuid(), cabinId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    // Details cascade with the cabin; media attachments are removed explicitly
    // so no orphan `entity_media` row can point at a deleted cabin.
    const detach = await context.supabase
      .from("entity_media")
      .delete()
      .eq("ship_id", data.shipId)
      .eq("entity_type", "cabin")
      .eq("entity_id", data.cabinId);
    if (detach.error) throw friendly(detach.error);

    const { error } = await context.supabase
      .from("cabins")
      .delete()
      .eq("id", data.cabinId)
      .eq("ship_id", data.shipId);
    if (error) throw friendly(error);
    return { ok: true };
  });

const cabinDetailSchema = z.object({
  shipId: z.string().uuid(),
  cabinId: z.string().uuid(),
  detailId: z.string().uuid().optional(),
  groupName: nullableText,
  label: z.string().trim().min(1).max(300),
  value: nullableText,
  contentType: z.string().trim().min(1).max(60),
  sortOrder: z.number().int().min(0).max(9999),
  translations: translationMap,
});

export const saveCabinDetailAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => cabinDetailSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const payload = {
      ship_id: data.shipId,
      cabin_id: data.cabinId,
      group_name: data.groupName,
      label: data.label,
      value: data.value,
      content_type: data.contentType,
      sort_order: data.sortOrder,
      translations: cleanTranslations(data.translations),
    };
    if (data.detailId) {
      const { error } = await context.supabase
        .from("cabin_details")
        .update(payload)
        .eq("id", data.detailId)
        .eq("ship_id", data.shipId);
      if (error) throw friendly(error);
      return { detailId: data.detailId };
    }
    const { data: row, error } = await context.supabase
      .from("cabin_details")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw friendly(error);
    return { detailId: row.id };
  });

export const deleteCabinDetailAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z.object({ shipId: z.string().uuid(), detailId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("cabin_details")
      .delete()
      .eq("id", data.detailId)
      .eq("ship_id", data.shipId);
    if (error) throw friendly(error);
    return { ok: true };
  });

/* ---------------------------------------------------------- itineraries */

const ITIN_COLUMNS =
  "id,ship_id,slug,name,days,nights,departure_point,summary,description,highlights,price_from,currency,status,published_at,sort_order,translations";

const ITIN_DAY_COLUMNS =
  "id,ship_id,itinerary_id,day_number,title,description,timeline,meals,sort_order,translations";

export const listItinerariesAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => z.object({ shipId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const [itineraries, days] = await Promise.all([
      context.supabase
        .from("itineraries")
        .select(ITIN_COLUMNS)
        .eq("ship_id", data.shipId)
        .order("sort_order", { ascending: true }),
      context.supabase.from("itinerary_days").select("itinerary_id").eq("ship_id", data.shipId),
    ]);
    if (itineraries.error) throw friendly(itineraries.error);
    if (days.error) throw friendly(days.error);

    const counts = new Map<string, number>();
    for (const d of days.data ?? []) counts.set(d.itinerary_id, (counts.get(d.itinerary_id) ?? 0) + 1);

    return {
      itineraries: (itineraries.data ?? []).map((i) => ({ ...i, dayCount: counts.get(i.id) ?? 0 })),
    };
  });

export const getItineraryAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z.object({ shipId: z.string().uuid(), itineraryId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const [itinerary, days] = await Promise.all([
      context.supabase
        .from("itineraries")
        .select(ITIN_COLUMNS)
        .eq("id", data.itineraryId)
        .eq("ship_id", data.shipId)
        .maybeSingle(),
      context.supabase
        .from("itinerary_days")
        .select(ITIN_DAY_COLUMNS)
        .eq("ship_id", data.shipId)
        .eq("itinerary_id", data.itineraryId)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true }),
    ]);
    if (itinerary.error) throw friendly(itinerary.error);
    if (!itinerary.data) throw new Error("Không tìm thấy hải trình");
    if (days.error) throw friendly(days.error);
    return { itinerary: itinerary.data, days: days.data ?? [] };
  });

/** Stored `highlights` bag: display duration plus three editorial lists. */
const highlightsSchema = z
  .object({
    duration: z.string().trim().max(200).optional(),
    highlights: z.array(z.string()).optional(),
    includes: z.array(z.string()).optional(),
    excludes: z.array(z.string()).optional(),
  })
  .optional()
  .transform((v) => {
    const out: Record<string, string | string[]> = {};
    if (v?.duration && v.duration.length > 0) out['duration'] = v.duration;
    for (const key of ["highlights", "includes", "excludes"] as const) {
      const list = (v?.[key] ?? []).map((s) => s.trim()).filter((s) => s.length > 0);
      if (list.length > 0) out[key] = list;
    }
    return out;
  });

const itinerarySchema = z.object({
  shipId: z.string().uuid(),
  itineraryId: z.string().uuid().optional(),
  slug: slugSchema,
  name: z.string().trim().min(1).max(200),
  days: nullableInt,
  nights: nullableInt,
  departurePoint: nullableText,
  summary: nullableText,
  description: nullableText,
  highlights: highlightsSchema,
  priceFrom: nullableNumber,
  currency: nullableText,
  status: statusEnum,
  sortOrder: z.number().int().min(0).max(9999),
  translations: translationMap,
});

export const saveItineraryAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => itinerarySchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    let currentPublishedAt: string | null = null;
    if (data.itineraryId) {
      const existing = await supabase
        .from("itineraries")
        .select("published_at")
        .eq("id", data.itineraryId)
        .eq("ship_id", data.shipId)
        .maybeSingle();
      if (existing.error) throw friendly(existing.error);
      if (!existing.data) throw new Error("Không tìm thấy hải trình");
      currentPublishedAt = existing.data.published_at;
    }

    const payload = {
      ship_id: data.shipId,
      slug: data.slug,
      name: data.name,
      days: data.days,
      nights: data.nights,
      departure_point: data.departurePoint,
      summary: data.summary,
      description: data.description,
      highlights: data.highlights,
      price_from: data.priceFrom,
      currency: data.currency,
      status: data.status,
      sort_order: data.sortOrder,
      translations: cleanTranslations(data.translations),
      updated_by: userId,
      ...publishFields(data.status, currentPublishedAt),
    };

    if (data.itineraryId) {
      const { error } = await supabase
        .from("itineraries")
        .update(payload)
        .eq("id", data.itineraryId)
        .eq("ship_id", data.shipId);
      if (error) throw friendly(error);
      return { itineraryId: data.itineraryId };
    }

    const { data: row, error } = await supabase
      .from("itineraries")
      .insert({ ...payload, created_by: userId })
      .select("id")
      .single();
    if (error) throw friendly(error);
    return { itineraryId: row.id };
  });

export const deleteItineraryAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z.object({ shipId: z.string().uuid(), itineraryId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const detach = await context.supabase
      .from("entity_media")
      .delete()
      .eq("ship_id", data.shipId)
      .eq("entity_type", "itinerary")
      .eq("entity_id", data.itineraryId);
    if (detach.error) throw friendly(detach.error);

    const { error } = await context.supabase
      .from("itineraries")
      .delete()
      .eq("id", data.itineraryId)
      .eq("ship_id", data.shipId);
    if (error) throw friendly(error);
    return { ok: true };
  });

/** Timeline entries are `{ time, label }` objects, same shape the site reads. */
const timelineSchema = z
  .array(z.object({ time: z.string().trim().max(60).optional(), label: z.string().trim().max(500) }))
  .optional()
  .transform((v) =>
    (v ?? [])
      .filter((e) => e.label.length > 0)
      .map((e) => ({ time: e.time ?? "", label: e.label })),
  );

const itineraryDaySchema = z.object({
  shipId: z.string().uuid(),
  itineraryId: z.string().uuid(),
  dayId: z.string().uuid().optional(),
  dayNumber: z.number().int().min(1).max(60),
  title: nullableText,
  description: nullableText,
  timeline: timelineSchema,
  meals: nullableText,
  sortOrder: z.number().int().min(0).max(9999),
  translations: translationMap,
});

export const saveItineraryDayAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => itineraryDaySchema.parse(raw))
  .handler(async ({ data, context }) => {
    const payload = {
      ship_id: data.shipId,
      itinerary_id: data.itineraryId,
      day_number: data.dayNumber,
      title: data.title,
      description: data.description,
      timeline: data.timeline,
      meals: data.meals,
      sort_order: data.sortOrder,
      translations: cleanTranslations(data.translations),
    };
    if (data.dayId) {
      const { error } = await context.supabase
        .from("itinerary_days")
        .update(payload)
        .eq("id", data.dayId)
        .eq("ship_id", data.shipId);
      if (error) throw friendly(error);
      return { dayId: data.dayId };
    }
    const { data: row, error } = await context.supabase
      .from("itinerary_days")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw friendly(error);
    return { dayId: row.id };
  });

export const deleteItineraryDayAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z.object({ shipId: z.string().uuid(), dayId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("itinerary_days")
      .delete()
      .eq("id", data.dayId)
      .eq("ship_id", data.shipId);
    if (error) throw friendly(error);
    return { ok: true };
  });
