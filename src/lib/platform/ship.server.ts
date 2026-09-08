/**
 * Ship (tenant) resolution and context.
 *
 *   hostname → ship_domains (active, live ship) → ship → branding/settings/seo
 *
 * Nothing here knows about a specific brand. Dev hosts (localhost, preview
 * URLs) are not tenant domains; they fall back to the ship flagged by
 * `PLATFORM_DEV_SHIP_SLUG` or, failing that, the first live ship by sort_order.
 */

import { shipLanguageConfig, type LanguageCode } from "@/lib/i18n/languages";
import { localizeRow } from "@/lib/i18n/localize";
import { hostnameCandidates, isLocalHostname, normalizeHostname } from "./host";
import { getPublicDb } from "./supabase-public.server";
import type { Json, ShipContext, ShipDomainInfo } from "./types";

type ShipRow = {
  id: string;
  slug: string;
  name: string;
  display_name: string | null;
  tagline: string | null;
  status: string;
  layout: string;
  default_language: string;
  enabled_languages: string[];
  currency: string;
  total_cabins: number | null;
  translations: unknown;
};

type DomainRow = {
  domain: string;
  is_primary: boolean;
  is_active: boolean;
  redirect_to: string | null;
  ship_id: string;
};

const SHIP_COLUMNS =
  "id,slug,name,display_name,tagline,status,layout,default_language,enabled_languages,currency,total_cabins,translations";

export interface ResolvedShip {
  ship: ShipRow;
  /** All active domains of the ship. */
  domains: DomainRow[];
  /** The domain row that matched the request host (null on dev hosts). */
  requestDomain: DomainRow | null;
  /** Non-null when the request host is an alias that should redirect. */
  redirectToHost: string | null;
}

/** Resolves which live ship a hostname belongs to. Returns null when unknown. */
export async function resolveShipByHost(hostname: string | null | undefined): Promise<ResolvedShip | null> {
  const db = getPublicDb();
  const host = normalizeHostname(hostname);

  let shipId: string | null = null;
  let requestDomain: DomainRow | null = null;
  const isDevHost = !host || isLocalHostname(host) || isPlatformPreviewHost(host);

  if (!isDevHost) {
    const candidates = hostnameCandidates(host);
    const { data, error } = await db
      .from("ship_domains")
      .select("domain,is_primary,is_active,redirect_to,ship_id")
      .in("domain", candidates)
      .eq("is_active", true);
    if (error) throw error;
    // Prefer the exact host, then www/bare variant.
    const match = candidates.map((c) => data?.find((d) => d.domain === c)).find(Boolean) ?? null;
    if (match) {
      shipId = match.ship_id;
      requestDomain = match;
    }
    // A real hostname that no live ship claims is unknown — never fall back to another brand.
    if (!shipId) return null;
  }

  if (!shipId) {
    // Dev / preview host only: fall back to the configured dev ship or first live ship.
    const devSlug = process.env["PLATFORM_DEV_SHIP_SLUG"];
    let q = db.from("ships").select("id").eq("status", "live").order("sort_order").limit(1);
    if (devSlug) q = q.eq("slug", devSlug);
    const { data, error } = await q.maybeSingle();
    if (error) throw error;
    if (!data) return null;
    shipId = data.id;
  }

  const [{ data: ship, error: shipErr }, { data: domains, error: domErr }] = await Promise.all([
    db.from("ships").select(SHIP_COLUMNS).eq("id", shipId).eq("status", "live").maybeSingle(),
    db.from("ship_domains").select("domain,is_primary,is_active,redirect_to,ship_id").eq("ship_id", shipId).eq("is_active", true).order("is_primary", { ascending: false }),
  ]);
  if (shipErr) throw shipErr;
  if (domErr) throw domErr;
  if (!ship) return null; // RLS hides non-live ships anyway

  const primary = domains?.find((d) => d.is_primary) ?? domains?.[0] ?? null;
  let redirectToHost: string | null = null;
  if (requestDomain) {
    if (requestDomain.redirect_to) redirectToHost = normalizeHostname(requestDomain.redirect_to);
    else if (!requestDomain.is_primary && primary && primary.domain !== requestDomain.domain) {
      redirectToHost = primary.domain;
    }
  }

  return { ship: ship as ShipRow, domains: (domains ?? []) as DomainRow[], requestDomain, redirectToHost };
}

/** Lovable preview/staging hosts are never tenant domains. */
function isPlatformPreviewHost(host: string): boolean {
  return host.endsWith(".lovable.app") || host.endsWith(".lovableproject.com");
}

function toDomainInfo(d: DomainRow): ShipDomainInfo {
  return { domain: d.domain, isPrimary: d.is_primary, redirectTo: d.redirect_to };
}

/**
 * Full tenant context in one call. `language` must already be resolved (it
 * only affects translatable ship-level text such as tagline/address/SEO).
 */
export async function getShipContext(
  resolved: ResolvedShip,
  language?: LanguageCode,
): Promise<ShipContext> {
  const db = getPublicDb();
  const { ship } = resolved;
  const langConfig = shipLanguageConfig(ship);
  const lang = language && langConfig.enabledLanguages.includes(language) ? language : langConfig.defaultLanguage;
  const dl = langConfig.defaultLanguage;

  const [{ data: branding, error: bErr }, { data: settings, error: sErr }, { data: seo, error: seoErr }] =
    await Promise.all([
      db.from("ship_branding").select("*").eq("ship_id", ship.id).maybeSingle(),
      db.from("ship_settings").select("*").eq("ship_id", ship.id).maybeSingle(),
      db.from("ship_seo").select("*").eq("ship_id", ship.id).maybeSingle(),
    ]);
  if (bErr) throw bErr;
  if (sErr) throw sErr;
  if (seoErr) throw seoErr;

  const s = localizeRow(ship, lang, dl).value;
  const st = settings ? localizeRow(settings, lang, dl).value : null;
  const se = seo ? localizeRow(seo, lang, dl).value : null;
  const primary = resolved.domains.find((d) => d.is_primary) ?? resolved.domains[0] ?? null;
  const primaryDomain = primary?.domain ?? "";

  return {
    ship: {
      id: s.id,
      slug: s.slug,
      name: s.name,
      displayName: s.display_name ?? s.name,
      tagline: s.tagline,
      layout: s.layout,
      currency: s.currency,
      totalCabins: s.total_cabins,
    },
    primaryDomain,
    origin: primaryDomain ? `https://${primaryDomain}` : "",
    domains: resolved.domains.map(toDomainInfo),
    requestDomain: resolved.requestDomain ? toDomainInfo(resolved.requestDomain) : null,
    branding: {
      logoLight: branding?.logo_light ?? null,
      logoDark: branding?.logo_dark ?? null,
      logoMark: branding?.logo_mark ?? null,
      favicon: branding?.favicon ?? null,
      primaryColor: branding?.primary_color ?? null,
      secondaryColor: branding?.secondary_color ?? null,
      accentColor: branding?.accent_color ?? null,
      backgroundColor: branding?.background_color ?? null,
      surfaceColor: branding?.surface_color ?? null,
      textColor: branding?.text_color ?? null,
      headingFont: branding?.heading_font ?? null,
      bodyFont: branding?.body_font ?? null,
      themeConfig: (branding?.theme_config as Record<string, Json>) ?? {},
    },
    settings: {
      hotline: st?.hotline ?? null,
      hotlineDisplay: st?.hotline_display ?? null,
      whatsapp: st?.whatsapp ?? null,
      zalo: st?.zalo ?? null,
      email: st?.email ?? null,
      recruitEmail: st?.recruit_email ?? null,
      facebook: st?.facebook ?? null,
      instagram: st?.instagram ?? null,
      tiktok: st?.tiktok ?? null,
      tripadvisor: st?.tripadvisor ?? null,
      youtube: st?.youtube ?? null,
      googleMaps: st?.google_maps ?? null,
      bookingUrl: st?.booking_url ?? null,
      checkinPoint: st?.checkin_point ?? null,
      address: st?.address ?? null,
    },
    seo: {
      siteName: se?.site_name ?? null,
      titleTemplate: se?.title_template ?? null,
      defaultTitle: se?.default_title ?? null,
      defaultDescription: se?.default_description ?? null,
      ogImage: se?.og_image ?? null,
      schemaType: se?.schema_type ?? "Organization",
      schemaName: se?.schema_name ?? null,
      twitterHandle: se?.twitter_handle ?? null,
    },
    defaultLanguage: dl,
    enabledLanguages: langConfig.enabledLanguages,
    language: lang,
  };
}

/** Convenience: hostname → ShipContext (null when no live ship matches). */
export async function getShipContextByHost(
  hostname: string | null | undefined,
  language?: LanguageCode,
): Promise<{ context: ShipContext; resolved: ResolvedShip } | null> {
  const resolved = await resolveShipByHost(hostname);
  if (!resolved) return null;
  return { context: await getShipContext(resolved, language), resolved };
}
