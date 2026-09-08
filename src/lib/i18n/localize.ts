/**
 * Single read layer for multilingual content.
 *
 * Every content table stores its default-language text in ordinary columns and
 * all other languages in a `translations jsonb` column keyed by language code:
 *
 *   { "vi": { "name": "...", "summary": "..." }, "ko": { ... } }
 *
 * `localizeRow` merges the requested language over the base row, field by
 * field, and falls back to the ship's default language whenever a translated
 * value is missing or empty. Components never read `translations` directly.
 */

import type { LanguageCode } from "./languages";

export type TranslationsMap = Record<string, Record<string, unknown> | null | undefined>;

export interface LocalizedRow<T> {
  /** Row with translated values merged in. */
  value: T;
  /** Language actually used for the row's main text. */
  language: LanguageCode;
  /** True when at least one field fell back to the default language. */
  fallbackUsed: boolean;
}

const isEmpty = (v: unknown) =>
  v === null ||
  v === undefined ||
  (typeof v === "string" && v.trim() === "") ||
  (Array.isArray(v) && v.length === 0);

function translationsFor(
  translations: unknown,
  language: LanguageCode,
): Record<string, unknown> {
  if (!translations || typeof translations !== "object") return {};
  const bag = (translations as TranslationsMap)[language];
  return bag && typeof bag === "object" ? (bag as Record<string, unknown>) : {};
}

/**
 * Merges `row.translations[language]` over `row`.
 * Missing or empty translated fields keep the default-language value.
 */
export function localizeRow<T extends { translations?: unknown }>(
  row: T,
  language: LanguageCode,
  defaultLanguage: LanguageCode,
): LocalizedRow<T> {
  if (language === defaultLanguage) {
    return { value: row, language: defaultLanguage, fallbackUsed: false };
  }
  const bag = translationsFor(row.translations, language);
  const merged: Record<string, unknown> = { ...row };
  let translatedAny = false;
  let fallbackUsed = false;

  for (const key of Object.keys(row as Record<string, unknown>)) {
    if (key === "translations") continue;
    const translated = bag[key];
    if (!isEmpty(translated)) {
      merged[key] = translated;
      translatedAny = true;
    } else if (!isEmpty((row as Record<string, unknown>)[key])) {
      fallbackUsed = true;
    }
  }

  return {
    value: merged as T,
    language: translatedAny ? language : defaultLanguage,
    fallbackUsed,
  };
}

/** `localizeRow` over a list; order is preserved. */
export function localizeRows<T extends { translations?: unknown }>(
  rows: T[],
  language: LanguageCode,
  defaultLanguage: LanguageCode,
): T[] {
  return rows.map((row) => localizeRow(row, language, defaultLanguage).value);
}

/**
 * Reads one field with fallback, for cases where only a single value is needed
 * (e.g. a SEO title) instead of a whole row.
 */
export function localizedField<T = string>(
  row: { translations?: unknown } & Record<string, unknown>,
  field: string,
  language: LanguageCode,
  defaultLanguage: LanguageCode,
): T | null {
  if (language !== defaultLanguage) {
    const translated = translationsFor(row.translations, language)[field];
    if (!isEmpty(translated)) return translated as T;
  }
  const base = row[field];
  return isEmpty(base) ? null : (base as T);
}

/** Reads a nested JSON blob (e.g. `highlights`) with per-language fallback. */
export function localizedJson<T>(
  row: { translations?: unknown } & Record<string, unknown>,
  field: string,
  language: LanguageCode,
  defaultLanguage: LanguageCode,
  fallback: T,
): T {
  return (localizedField<T>(row, field, language, defaultLanguage) ?? fallback) as T;
}
