/**
 * CMS service layer — venues (real named places aboard a ship).
 *
 *   Admin UI → these server functions → database
 *
 * Same rules as the other content modules: every row is scoped by `ship_id`
 * taken from validated input and re-asserted in the query, `status` is only
 * `draft` or `published`, base columns hold the ship's default language and
 * `translations` holds the other enabled languages. Nothing is brand-specific.
 *
 * `stable_key` is the venue's identity and never changes when the commercial
 * name does, so links and media stay attached through a rename.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "./admin-auth";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";

export const VENUE_STATUSES = ["draft", "published"] as const;

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
  .record(languageEnum, z.record(z.string(), z.string()))
  .optional()
  .transform((v) => v ?? {});

function cleanTranslations(input: Record<string, Record<string, string>>) {
  const out: Record<string, Record<string, string>> = {};
  for (const [lang, fields] of Object.entries(input)) {
    const kept: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === "string" && value.trim().length > 0) kept[key] = value.trim();
    }
    if (Object.keys(kept).length > 0) out[lang] = kept;
  }
  return out;
}

const keySchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9][a-z0-9_-]*$/, "Mã chỉ gồm chữ thường, số, gạch ngang và gạch dưới")
  .max(120);

function friendly(error: { code?: string | undefined; message: string }): Error {
  if (error.code === "23505" || /duplicate key|unique constraint/i.test(error.message)) {
    return new Error("Mã địa điểm này đã tồn tại trên tàu");
  }
  return new Error(error.message);
}

const VENUE_COLUMNS =
  "id,ship_id,stable_key,category,parent_key,functional_name,commercial_name,location,area_sqm,capacity,capacity_unit,spec_note,function_text,access_type,summary,description,show_public,show_area,show_capacity,status,published_at,sort_order,translations";

/** Every venue of one ship, drafts included, for the admin table. */
export const listVenuesAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => z.object({ shipId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("venues")
      .select(VENUE_COLUMNS)
      .eq("ship_id", data.shipId)
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true });
    if (error) throw friendly(error);
    return { venues: rows ?? [] };
  });

const venueInput = z.object({
  shipId: z.string().uuid(),
  venueId: z.string().uuid().optional(),
  stableKey: keySchema,
  category: keySchema,
  parentKey: z
    .string()
    .trim()
    .max(120)
    .optional()
    .transform((v) => (v && v.length > 0 ? v.toLowerCase() : null)),
  functionalName: z.string().trim().min(1, "Cần tên chức năng").max(200),
  commercialName: nullableText,
  location: nullableText,
  areaSqm: nullableNumber,
  capacity: nullableInt,
  capacityUnit: z.string().trim().min(1).max(40).default("guests"),
  specNote: nullableText,
  functionText: nullableText,
  accessType: nullableText,
  summary: nullableText,
  description: nullableText,
  showPublic: z.boolean().default(true),
  showArea: z.boolean().default(false),
  showCapacity: z.boolean().default(false),
  status: z.enum(VENUE_STATUSES),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  translations: translationMap,
});

/** Creates or updates one venue of the given ship. */
export const saveVenueAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => venueInput.parse(raw))
  .handler(async ({ data, context }) => {
    const row = {
      ship_id: data.shipId,
      stable_key: data.stableKey,
      category: data.category,
      parent_key: data.parentKey,
      functional_name: data.functionalName,
      commercial_name: data.commercialName,
      location: data.location,
      area_sqm: data.areaSqm,
      capacity: data.capacity,
      capacity_unit: data.capacityUnit,
      spec_note: data.specNote,
      function_text: data.functionText,
      access_type: data.accessType,
      summary: data.summary,
      description: data.description,
      show_public: data.showPublic,
      show_area: data.showArea,
      show_capacity: data.showCapacity,
      status: data.status,
      published_at: data.status === "published" ? new Date().toISOString() : null,
      sort_order: data.sortOrder,
      translations: cleanTranslations(data.translations as Record<string, Record<string, string>>),
      updated_by: context.userId,
    };

    if (data.venueId) {
      const { error } = await context.supabase
        .from("venues")
        .update(row)
        .eq("id", data.venueId)
        .eq("ship_id", data.shipId);
      if (error) throw friendly(error);
      return { id: data.venueId };
    }

    const { data: created, error } = await context.supabase
      .from("venues")
      .insert({ ...row, created_by: context.userId })
      .select("id")
      .single();
    if (error) throw friendly(error);
    return { id: created.id };
  });

/** Removes a venue and detaches its media so no orphan attachment remains. */
export const deleteVenueAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z.object({ shipId: z.string().uuid(), venueId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const detach = await context.supabase
      .from("entity_media")
      .delete()
      .eq("ship_id", data.shipId)
      .eq("entity_type", "venue")
      .eq("entity_id", data.venueId);
    if (detach.error) throw friendly(detach.error);

    const { error } = await context.supabase
      .from("venues")
      .delete()
      .eq("id", data.venueId)
      .eq("ship_id", data.shipId);
    if (error) throw friendly(error);
    return { ok: true };
  });
