/**
 * CMS service layer — ships (tenants).
 *
 *   Admin UI → these server functions → database
 *
 * Admin components never mutate Supabase directly. Every function validates its
 * input with Zod on the server, requires the `admin` role, and returns plain
 * serializable data.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "./admin-auth";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n/languages";

const SHIP_STATUSES = ["draft", "staging", "live", "disabled"] as const;
const SHIP_LAYOUTS = ["heritage", "editorial", "panorama", "grid"] as const;
/** Layouts with a finished template; others save fine but never go public yet. */
export const IMPLEMENTED_LAYOUTS: readonly string[] = ["heritage"];

export type ShipStatus = (typeof SHIP_STATUSES)[number];
export type ShipLayoutValue = (typeof SHIP_LAYOUTS)[number];

export const SHIP_STATUS_VALUES = SHIP_STATUSES;
export const SHIP_LAYOUT_VALUES = SHIP_LAYOUTS;

const languageEnum = z.enum(SUPPORTED_LANGUAGES);
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

const shipCoreSchema = z.object({
  name: z.string().trim().min(1).max(200),
  displayName: nullableText,
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9][a-z0-9-]*$/, "Slug chỉ gồm chữ thường, số và dấu gạch ngang"),
  tagline: nullableText,
  status: z.enum(SHIP_STATUSES),
  layout: z.enum(SHIP_LAYOUTS),
  defaultLanguage: languageEnum,
  enabledLanguages: z.array(languageEnum).min(1),
  currency: z.string().trim().min(1).max(10),
  sortOrder: z.number().int().min(0).max(9999),
  totalCabins: z.number().int().min(0).max(10000).nullable().optional(),
  translations: translationMap,
});

function assertLanguageConsistency(input: {
  defaultLanguage: string;
  enabledLanguages: string[];
}) {
  if (!input.enabledLanguages.includes(input.defaultLanguage)) {
    throw new Error("Ngôn ngữ mặc định phải nằm trong danh sách ngôn ngữ đã bật");
  }
}

/** Drops empty strings so `translations` never stores blank overrides. */
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

export interface AdminShipListItem {
  id: string;
  slug: string;
  name: string;
  displayName: string | null;
  tagline: string | null;
  status: string;
  layout: string;
  defaultLanguage: string;
  enabledLanguages: string[];
  currency: string;
  sortOrder: number;
  totalCabins: number | null;
  primaryDomain: string | null;
  domainCount: number;
}

const SHIP_COLUMNS =
  "id,slug,name,display_name,tagline,status,layout,default_language,enabled_languages,currency,sort_order,total_cabins,translations";

/** Ships list + status counts for the dashboard. Nothing brand-specific here. */
export const listShipsAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => {
    const { data: ships, error } = await context.supabase
      .from("ships")
      .select(SHIP_COLUMNS)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);

    const { data: domains, error: domainError } = await context.supabase
      .from("ship_domains")
      .select("ship_id,domain,is_primary,is_active");
    if (domainError) throw new Error(domainError.message);

    const items: AdminShipListItem[] = (ships ?? []).map((s) => {
      const own = (domains ?? []).filter((d) => d.ship_id === s.id);
      const primary = own.find((d) => d.is_primary) ?? own[0] ?? null;
      return {
        id: s.id,
        slug: s.slug,
        name: s.name,
        displayName: s.display_name,
        tagline: s.tagline,
        status: s.status,
        layout: s.layout,
        defaultLanguage: s.default_language,
        enabledLanguages: s.enabled_languages ?? [],
        currency: s.currency,
        sortOrder: s.sort_order,
        totalCabins: s.total_cabins,
        primaryDomain: primary ? primary.domain : null,
        domainCount: own.length,
      };
    });

    const counts = {
      total: items.length,
      draft: items.filter((s) => s.status === "draft").length,
      staging: items.filter((s) => s.status === "staging").length,
      live: items.filter((s) => s.status === "live").length,
      disabled: items.filter((s) => s.status === "disabled").length,
    };

    return { ships: items, counts };
  });

/** Full editing payload for one ship: general + branding + settings + seo + domains. */
export const getShipAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => z.object({ shipId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const [ship, branding, settings, seo, domains] = await Promise.all([
      supabase.from("ships").select(SHIP_COLUMNS).eq("id", data.shipId).maybeSingle(),
      supabase.from("ship_branding").select("*").eq("ship_id", data.shipId).maybeSingle(),
      supabase.from("ship_settings").select("*").eq("ship_id", data.shipId).maybeSingle(),
      supabase.from("ship_seo").select("*").eq("ship_id", data.shipId).maybeSingle(),
      supabase
        .from("ship_domains")
        .select("id,domain,is_primary,is_active,redirect_to")
        .eq("ship_id", data.shipId)
        .order("is_primary", { ascending: false })
        .order("domain", { ascending: true }),
    ]);

    if (ship.error) throw new Error(ship.error.message);
    if (!ship.data) throw new Error("Không tìm thấy tàu");

    return {
      ship: ship.data,
      branding: branding.data ?? null,
      settings: settings.data ?? null,
      seo: seo.data ?? null,
      domains: domains.data ?? [],
    };
  });

export const createShipAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => shipCoreSchema.parse(raw))
  .handler(async ({ data, context }) => {
    assertLanguageConsistency(data);
    const { data: row, error } = await context.supabase
      .from("ships")
      .insert({
        name: data.name,
        display_name: data.displayName,
        slug: data.slug,
        tagline: data.tagline,
        status: data.status,
        layout: data.layout,
        default_language: data.defaultLanguage,
        enabled_languages: data.enabledLanguages,
        currency: data.currency,
        sort_order: data.sortOrder,
        total_cabins: data.totalCabins ?? null,
        translations: cleanTranslations(data.translations),
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505" || error.code === "23514" || /duplicate|unique/i.test(error.message)) {
        throw new Error("Slug đã tồn tại hoặc dữ liệu không hợp lệ");
      }
      throw new Error(error.message);
    }

    // Empty 1-1 rows so branding/settings/SEO editors always have a row to update.
    await Promise.all([
      context.supabase.from("ship_branding").insert({ ship_id: row.id }),
      context.supabase.from("ship_settings").insert({ ship_id: row.id }),
      context.supabase.from("ship_seo").insert({ ship_id: row.id }),
    ]);

    return { shipId: row.id };
  });

export const updateShipAdmin = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    shipCoreSchema.extend({ shipId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    assertLanguageConsistency(data);
    const { error } = await context.supabase
      .from("ships")
      .update({
        name: data.name,
        display_name: data.displayName,
        slug: data.slug,
        tagline: data.tagline,
        status: data.status,
        layout: data.layout,
        default_language: data.defaultLanguage,
        enabled_languages: data.enabledLanguages,
        currency: data.currency,
        sort_order: data.sortOrder,
        total_cabins: data.totalCabins ?? null,
        translations: cleanTranslations(data.translations),
      })
      .eq("id", data.shipId);

    if (error) {
      if (/duplicate|unique/i.test(error.message)) throw new Error("Slug đã tồn tại");
      throw new Error(error.message);
    }
    return { ok: true };
  });

const brandingSchema = z.object({
  shipId: z.string().uuid(),
  logoLight: nullableText,
  logoDark: nullableText,
  logoMark: nullableText,
  favicon: nullableText,
  primaryColor: nullableText,
  secondaryColor: nullableText,
  accentColor: nullableText,
  backgroundColor: nullableText,
  surfaceColor: nullableText,
  textColor: nullableText,
  headingFont: nullableText,
  bodyFont: nullableText,
});

export const saveShipBranding = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => brandingSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("ship_branding").upsert(
      {
        ship_id: data.shipId,
        logo_light: data.logoLight,
        logo_dark: data.logoDark,
        logo_mark: data.logoMark,
        favicon: data.favicon,
        primary_color: data.primaryColor,
        secondary_color: data.secondaryColor,
        accent_color: data.accentColor,
        background_color: data.backgroundColor,
        surface_color: data.surfaceColor,
        text_color: data.textColor,
        heading_font: data.headingFont,
        body_font: data.bodyFont,
      },
      { onConflict: "ship_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const settingsSchema = z.object({
  shipId: z.string().uuid(),
  hotline: nullableText,
  hotlineDisplay: nullableText,
  whatsapp: nullableText,
  zalo: nullableText,
  email: nullableText,
  recruitEmail: nullableText,
  facebook: nullableText,
  instagram: nullableText,
  tiktok: nullableText,
  tripadvisor: nullableText,
  youtube: nullableText,
  googleMaps: nullableText,
  bookingUrl: nullableText,
  checkinPoint: nullableText,
  address: nullableText,
  translations: translationMap,
});

export const saveShipSettings = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => settingsSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("ship_settings").upsert(
      {
        ship_id: data.shipId,
        hotline: data.hotline,
        hotline_display: data.hotlineDisplay,
        whatsapp: data.whatsapp,
        zalo: data.zalo,
        email: data.email,
        recruit_email: data.recruitEmail,
        facebook: data.facebook,
        instagram: data.instagram,
        tiktok: data.tiktok,
        tripadvisor: data.tripadvisor,
        youtube: data.youtube,
        google_maps: data.googleMaps,
        booking_url: data.bookingUrl,
        checkin_point: data.checkinPoint,
        address: data.address,
        translations: cleanTranslations(data.translations),
      },
      { onConflict: "ship_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const seoSchema = z.object({
  shipId: z.string().uuid(),
  siteName: nullableText,
  titleTemplate: nullableText,
  defaultTitle: nullableText,
  defaultDescription: nullableText,
  ogImage: nullableText,
  schemaType: z.string().trim().min(1).max(80),
  schemaName: nullableText,
  twitterHandle: nullableText,
  translations: translationMap,
});

export const saveShipSeo = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => seoSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("ship_seo").upsert(
      {
        ship_id: data.shipId,
        site_name: data.siteName,
        title_template: data.titleTemplate,
        default_title: data.defaultTitle,
        default_description: data.defaultDescription,
        og_image: data.ogImage,
        schema_type: data.schemaType,
        schema_name: data.schemaName,
        twitter_handle: data.twitterHandle,
        translations: cleanTranslations(data.translations),
      },
      { onConflict: "ship_id" },
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const hostnameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .transform((v) => v.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/\.$/, ""))
  .refine((v) => /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(v), {
    message: "Tên miền không hợp lệ",
  });

const domainSchema = z.object({
  shipId: z.string().uuid(),
  domainId: z.string().uuid().optional(),
  domain: hostnameSchema,
  isPrimary: z.boolean(),
  isActive: z.boolean(),
  redirectTo: nullableText,
});

/** Only one primary domain per ship: demote the others in the same operation. */
async function clearOtherPrimaries(
  supabase: { from: (t: string) => any },
  shipId: string,
  keepId: string | null,
) {
  let query = supabase.from("ship_domains").update({ is_primary: false }).eq("ship_id", shipId);
  if (keepId) query = query.neq("id", keepId);
  const { error } = await query;
  if (error) throw new Error(error.message);
}

export const saveShipDomain = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => domainSchema.parse(raw))
  .handler(async ({ data, context }) => {
    const supabase = context.supabase as unknown as { from: (t: string) => any };

    // A domain can never belong to two ships.
    const { data: existing, error: lookupError } = await context.supabase
      .from("ship_domains")
      .select("id,ship_id")
      .eq("domain", data.domain)
      .maybeSingle();
    if (lookupError) throw new Error(lookupError.message);
    if (existing && existing.id !== data.domainId) {
      throw new Error(
        existing.ship_id === data.shipId
          ? "Tên miền này đã có trong danh sách"
          : "Tên miền đã được dùng cho một tàu khác",
      );
    }

    if (data.isPrimary && !data.isActive) {
      throw new Error("Tên miền chính phải đang bật");
    }

    const payload = {
      ship_id: data.shipId,
      domain: data.domain,
      is_primary: data.isPrimary,
      is_active: data.isActive,
      redirect_to: data.redirectTo,
    };

    let domainId = data.domainId ?? null;
    if (domainId) {
      const { error } = await context.supabase
        .from("ship_domains")
        .update(payload)
        .eq("id", domainId)
        .eq("ship_id", data.shipId);
      if (error) throw new Error(error.message);
    } else {
      const { data: inserted, error } = await context.supabase
        .from("ship_domains")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      domainId = inserted.id;
    }

    if (data.isPrimary) await clearOtherPrimaries(supabase, data.shipId, domainId);
    return { domainId };
  });

export const deleteShipDomain = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) =>
    z.object({ shipId: z.string().uuid(), domainId: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("ship_domains")
      .select("id,is_primary")
      .eq("id", data.domainId)
      .eq("ship_id", data.shipId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Không tìm thấy tên miền");
    if (row.is_primary) {
      throw new Error("Không thể xoá tên miền chính. Hãy đặt tên miền chính khác trước.");
    }
    const { error: deleteError } = await context.supabase
      .from("ship_domains")
      .delete()
      .eq("id", data.domainId)
      .eq("ship_id", data.shipId);
    if (deleteError) throw new Error(deleteError.message);
    return { ok: true };
  });

/** Whether the signed-in user is an admin (used by the admin route gate). */
export const checkAdminAccess = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async ({ context }) => ({ userId: context.userId, isAdmin: true }));
