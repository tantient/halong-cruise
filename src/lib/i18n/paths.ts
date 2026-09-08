/**
 * URL helpers for language-prefixed routing (`/en/...`, `/vi/...`, `/ko/...`,
 * `/ru/...`, `/zh-CN/...`).
 *
 * Route files are refactored in a later task; these helpers define the single
 * canonical way to build and read those paths so link building and the language
 * switcher never re-implement the rules.
 */

import { SUPPORTED_LANGUAGES, normalizeLanguage, type LanguageCode } from "./languages";

/** Splits a pathname into its language prefix (if any) and the rest. */
export function splitLanguagePath(pathname: string): {
  language: LanguageCode | null;
  path: string;
} {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const [, first = "", ...rest] = clean.split("/");
  const exact = SUPPORTED_LANGUAGES.find((l) => l === first || l.toLowerCase() === first.toLowerCase());
  if (!exact) return { language: null, path: clean };
  const remainder = `/${rest.join("/")}`.replace(/\/+$/, "");
  return { language: normalizeLanguage(exact), path: remainder === "" ? "/" : remainder };
}

/** Path without any language prefix, e.g. `/vi/cabins/grand-suite` → `/cabins/grand-suite`. */
export function stripLanguagePrefix(pathname: string): string {
  return splitLanguagePath(pathname).path;
}

/**
 * Builds the localized URL for a path.
 * The ship's default language is served without a prefix so existing URLs stay valid.
 */
export function localizedPath(
  pathname: string,
  language: LanguageCode,
  defaultLanguage: LanguageCode,
): string {
  const path = stripLanguagePrefix(pathname);
  if (language === defaultLanguage) return path;
  return path === "/" ? `/${language}` : `/${language}${path}`;
}

/**
 * Language switcher target: keeps the guest on the same content.
 * `/en/cabins/grand-suite` + `vi` → `/vi/cabins/grand-suite`.
 */
export function switchLanguagePath(
  currentPathname: string,
  language: LanguageCode,
  defaultLanguage: LanguageCode,
  search = "",
): string {
  return `${localizedPath(currentPathname, language, defaultLanguage)}${search}`;
}
