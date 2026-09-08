"use client";

/**
 * Language for the current URL. Kept at this path for existing imports; the
 * implementation lives in the platform language context.
 */
export { useLanguage, LocalLink, LanguageProvider } from "@/lib/i18n/language-context";
export type { LanguageContextValue } from "@/lib/i18n/language-context";
