/**
 * Platform-wide language configuration.
 *
 * Every tenant (ship) stores its own `default_language` and `enabled_languages`
 * in the database; this module only describes the languages the platform can
 * serve and how to normalise incoming language codes.
 */

export const SUPPORTED_LANGUAGES = ["en", "vi", "ko", "ru", "zh-CN"] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<LanguageCode, { native: string; english: string }> = {
  en: { native: "English", english: "English" },
  vi: { native: "Tiếng Việt", english: "Vietnamese" },
  ko: { native: "한국어", english: "Korean" },
  ru: { native: "Русский", english: "Russian" },
  "zh-CN": { native: "简体中文", english: "Simplified Chinese" },
};

/** BCP-47 value used in `lang` attributes, hreflang and Open Graph locale. */
export const LANGUAGE_BCP47: Record<LanguageCode, string> = {
  en: "en",
  vi: "vi",
  ko: "ko",
  ru: "ru",
  "zh-CN": "zh-Hans",
};

export const PLATFORM_DEFAULT_LANGUAGE: LanguageCode = "en";

export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === "string" && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

/**
 * Accepts anything (URL segment, cookie, Accept-Language token) and returns a
 * supported code, or null when nothing matches.
 */
export function normalizeLanguage(value: string | null | undefined): LanguageCode | null {
  if (!value) return null;
  const raw = value.trim();
  if (isLanguageCode(raw)) return raw;
  const lower = raw.toLowerCase();
  const direct = SUPPORTED_LANGUAGES.find((l) => l.toLowerCase() === lower);
  if (direct) return direct;
  if (lower.startsWith("zh")) return "zh-CN";
  const base = lower.split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.find((l) => l.toLowerCase().split("-")[0] === base) ?? null;
}

export interface ShipLanguageConfig {
  defaultLanguage: LanguageCode;
  enabledLanguages: LanguageCode[];
}

/** Reads a ship row (or any object with those columns) into a language config. */
export function shipLanguageConfig(ship: {
  default_language?: string | null;
  enabled_languages?: string[] | null;
}): ShipLanguageConfig {
  const defaultLanguage = normalizeLanguage(ship.default_language) ?? PLATFORM_DEFAULT_LANGUAGE;
  const enabled = (ship.enabled_languages ?? [])
    .map(normalizeLanguage)
    .filter((l): l is LanguageCode => l !== null);
  const enabledLanguages = enabled.length > 0 ? enabled : [defaultLanguage];
  return {
    defaultLanguage,
    enabledLanguages: enabledLanguages.includes(defaultLanguage)
      ? enabledLanguages
      : [defaultLanguage, ...enabledLanguages],
  };
}

/**
 * Picks the language actually served for a request: the requested one when the
 * ship enabled it, otherwise the ship's default language.
 */
export function resolveLanguage(
  requested: string | null | undefined,
  config: ShipLanguageConfig,
): LanguageCode {
  const wanted = normalizeLanguage(requested);
  return wanted && config.enabledLanguages.includes(wanted) ? wanted : config.defaultLanguage;
}
