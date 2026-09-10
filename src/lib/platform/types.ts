/**
 * Stable public shapes returned by the platform read layer.
 * Templates/components consume these; they never see raw rows or `translations`.
 */

import type { LanguageCode } from "@/lib/i18n/languages";

/** JSON-serializable value (server function results must be serializable). */
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export type ShipLayout = "heritage" | "editorial" | "panorama" | "grid" | (string & {});

export interface ShipDomainInfo {
  domain: string;
  isPrimary: boolean;
  redirectTo: string | null;
}

export interface ShipBranding {
  logoLight: string | null;
  logoDark: string | null;
  logoMark: string | null;
  favicon: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  backgroundColor: string | null;
  surfaceColor: string | null;
  textColor: string | null;
  headingFont: string | null;
  bodyFont: string | null;
  themeConfig: Record<string, Json>;
}

export interface ShipSettings {
  hotline: string | null;
  hotlineDisplay: string | null;
  whatsapp: string | null;
  zalo: string | null;
  email: string | null;
  recruitEmail: string | null;
  recruitZalo: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  tripadvisor: string | null;
  youtube: string | null;
  googleMaps: string | null;
  bookingUrl: string | null;
  checkinPoint: string | null;
  address: string | null;
}

export interface ShipSeoDefaults {
  siteName: string | null;
  titleTemplate: string | null;
  defaultTitle: string | null;
  defaultDescription: string | null;
  ogImage: string | null;
  schemaType: string;
  schemaName: string | null;
  twitterHandle: string | null;
}

/** Everything the public site needs to know about the current tenant. */
export interface ShipContext {
  ship: {
    id: string;
    slug: string;
    name: string;
    displayName: string;
    tagline: string | null;
    layout: ShipLayout;
    currency: string;
    totalCabins: number | null;
  };
  /** Primary public domain of the ship, e.g. `example-cruise.com`. */
  primaryDomain: string;
  origin: string;
  domains: ShipDomainInfo[];
  /** Matched domain row for the request, with redirect info if it is an alias. */
  requestDomain: ShipDomainInfo | null;
  branding: ShipBranding;
  settings: ShipSettings;
  seo: ShipSeoDefaults;
  defaultLanguage: LanguageCode;
  enabledLanguages: LanguageCode[];
  /** Language the context text (tagline, address, SEO defaults) was resolved in. */
  language: LanguageCode;
}

export type MediaUsage = "cover" | "gallery" | "floorplan" | "hero" | (string & {});

export interface MediaItem {
  id: string;
  /** Public URL, resolved by the media layer. */
  url: string;
  storagePath: string;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  mimeType: string | null;
  category: string;
  usage: MediaUsage;
  sortOrder: number;
}

/** Media grouped by usage, ready for a component. */
export interface EntityMedia {
  cover: MediaItem | null;
  hero: MediaItem[];
  gallery: MediaItem[];
  floorplan: MediaItem[];
  all: MediaItem[];
}

export interface PublicCabinDetail {
  id: string;
  group: string | null;
  label: string;
  value: string | null;
  contentType: string;
  sortOrder: number;
}

export interface PublicCabin {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  sizeSqm: number | null;
  maxGuests: number | null;
  bedConfig: string | null;
  viewType: string | null;
  deck: string | null;
  summary: string | null;
  description: string | null;
  priceFrom: number | null;
  currency: string | null;
  sortOrder: number;
  media: EntityMedia;
}

export interface PublicCabinFull extends PublicCabin {
  details: PublicCabinDetail[];
  /** Details grouped by `content_type` (spec / amenity / highlight / layout …). */
  detailsByType: Record<string, PublicCabinDetail[]>;
}

export interface PublicItineraryDay {
  id: string;
  dayNumber: number;
  title: string | null;
  description: string | null;
  timeline: Json[];
  meals: string | null;
  sortOrder: number;
}

export interface PublicItinerary {
  id: string;
  slug: string;
  name: string;
  days: number | null;
  nights: number | null;
  departurePoint: string | null;
  summary: string | null;
  description: string | null;
  highlights: Json;
  priceFrom: number | null;
  currency: string | null;
  sortOrder: number;
  media: EntityMedia;
}

export interface PublicItineraryFull extends PublicItinerary {
  dayPlan: PublicItineraryDay[];
}

export interface PublicService {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  summary: string | null;
  description: string | null;
  highlights: Json;
  openingHours: string | null;
  priceNote: string | null;
  sortOrder: number;
  media: EntityMedia;
}

/**
 * A real, named place aboard the ship (restaurant, bar, pool, treatment room,
 * function room …). Venues belong to an experience category and carry their own
 * factual data; `showPublic` / `showArea` / `showCapacity` decide what the
 * public site is allowed to state, so figures can be stored without publishing.
 */
export interface PublicVenue {
  id: string;
  /** Stable identity, never renamed when the commercial name changes. */
  key: string;
  /** Experience category the venue belongs to (matches a service slug/category). */
  category: string;
  /** Key of the venue this one sits inside (e.g. treatment rooms inside the spa). */
  parentKey: string | null;
  functionalName: string;
  commercialName: string | null;
  location: string | null;
  areaSqm: number | null;
  capacity: number | null;
  capacityUnit: string;
  specNote: string | null;
  functionText: string | null;
  accessType: string | null;
  summary: string | null;
  description: string | null;
  showPublic: boolean;
  showArea: boolean;
  showCapacity: boolean;
  sortOrder: number;
  media: EntityMedia;
}

export interface PublicOffer {
  id: string;
  slug: string;
  name: string;
  offerType: string | null;
  valueText: string | null;
  description: string | null;
  terms: string | null;
  badge: string | null;
  highlights: Json[];
  startsAt: string | null;
  endsAt: string | null;
  sortOrder: number;
  media: EntityMedia;
}

export interface PublicPage {
  id: string;
  slug: string;
  title: string;
  intro: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  /** Extra per-page editorial copy from `translations` (requested language, default-language fallback). */
  text: Record<string, Json>;
  media: EntityMedia;
}

export interface PublicJobPosition {
  id: string;
  slug: string;
  title: string;
  department: string | null;
  employmentType: string | null;
  description: string | null;
  requirements: Json[];
  benefits: Json[];
  headcount: number | null;
  sortOrder: number;
}

export interface PublicHomepageSection {
  id: string;
  type: string;
  position: number;
  configuration: Record<string, Json>;
  /** Translated copy for the section (title, subtitle, cta …). */
  text: Record<string, Json>;
  media: EntityMedia;
}

export interface PublicHomepage {
  sections: PublicHomepageSection[];
  /** Ship-level hero media (`entity_type = 'ship'`, `usage = 'hero'`). */
  hero: MediaItem[];
}
