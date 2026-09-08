/**
 * Language resolution for a request: `pathname` + ship language config →
 * the language served, the content path without prefix and whether the URL
 * is allowed to exist publicly.
 *
 * Rules
 *  - the ship's default language has no prefix (`/cabins`);
 *  - other enabled languages are prefixed (`/vi/cabins`);
 *  - a prefix for a language the ship did not enable is NOT public: callers
 *    must not render an indexable page for it (`isPublic === false`).
 *  - `/en/...` for a ship whose default is `en` is redundant: `isCanonical`
 *    is false so callers can redirect to the unprefixed URL.
 */

import { type LanguageCode, type ShipLanguageConfig } from "@/lib/i18n/languages";
import { localizedPath, splitLanguagePath } from "@/lib/i18n/paths";

export interface LanguageResolution {
  /** Language that will be served. Always one of `enabledLanguages`. */
  language: LanguageCode;
  /** Language literally requested in the URL prefix, if any (may be disabled). */
  requested: LanguageCode | null;
  /** Content path without language prefix, e.g. `/cabins/grand-suite`. */
  path: string;
  /** True when the URL is a valid public URL for this ship. */
  isPublic: boolean;
  /** True when the URL is already the canonical form for `language`. */
  isCanonical: boolean;
  /** Canonical URL for the served language (redirect target when !isCanonical). */
  canonicalPath: string;
  defaultLanguage: LanguageCode;
  enabledLanguages: LanguageCode[];
}

export function resolveLanguage(config: ShipLanguageConfig, pathname: string): LanguageResolution {
  const { language: requested, path } = splitLanguagePath(pathname);
  const { defaultLanguage, enabledLanguages } = config;

  const enabled = requested !== null && enabledLanguages.includes(requested);
  const language: LanguageCode = enabled ? requested! : defaultLanguage;
  const canonical = localizedPath(path, language, defaultLanguage);
  const normalizedInput = pathname.replace(/\/+$/, "") || "/";

  return {
    language,
    requested,
    path,
    // A prefix for a non-enabled language is never a public page.
    isPublic: requested === null || enabled,
    isCanonical: normalizedInput === canonical,
    canonicalPath: canonical,
    defaultLanguage,
    enabledLanguages,
  };
}

/** Localized URL for `path` in `language` for this ship. */
export function pathFor(config: ShipLanguageConfig, path: string, language: LanguageCode): string {
  return localizedPath(path, language, config.defaultLanguage);
}
