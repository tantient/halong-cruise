"use client";

/**
 * Platform language context.
 *
 * The served language is derived from the URL (`/` = ship default language,
 * `/vi/...`, `/ko/...` = prefixed languages) and validated against the ship's
 * `enabled_languages`, which are read from the resolved tenant — never from a
 * hardcoded brand. Every consumer (switcher, nav links) goes through here so
 * language routing rules exist in exactly one place.
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";

import { getT, type Lang } from "@/lib/translations";
import {
  LANGUAGE_LABELS,
  PLATFORM_DEFAULT_LANGUAGE,
  normalizeLanguage,
  type LanguageCode,
  type ShipLanguageConfig,
} from "./languages";
import { localizedPath, splitLanguagePath } from "./paths";

export interface LanguageContextValue {
  /** Language served for the current URL. */
  lang: LanguageCode;
  /** Language used for shared UI label files (which currently cover en/vi). */
  uiLang: Lang;
  /** Languages the current ship enabled (public + indexable). */
  languages: LanguageCode[];
  defaultLanguage: LanguageCode;
  /** Navigates to the same content in another language. */
  setLang: (language: LanguageCode) => void;
  /** Localized href for an unprefixed app path, e.g. `/cabins` → `/vi/cabins`. */
  href: (path: string) => string;
  label: (language: LanguageCode) => string;
  t: ReturnType<typeof getT>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function toUiLang(language: LanguageCode): Lang {
  return language === "vi" ? "vi" : "en";
}

/** Single place where the language rules turn into a context value. */
function useLanguageValue(config: ShipLanguageConfig | null): LanguageContextValue {
  const router = useRouter();
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;

  return useMemo<LanguageContextValue>(() => {
    const defaultLanguage = config?.defaultLanguage ?? PLATFORM_DEFAULT_LANGUAGE;
    const languages = config?.enabledLanguages ?? [defaultLanguage];
    const requested = normalizeLanguage(splitLanguagePath(pathname).language);
    const lang = requested && languages.includes(requested) ? requested : defaultLanguage;
    const href = (path: string) => localizedPath(path, lang, defaultLanguage);

    return {
      lang,
      uiLang: toUiLang(lang),
      languages,
      defaultLanguage,
      setLang: (next: LanguageCode) => {
        const target = `${localizedPath(pathname, next, defaultLanguage)}${location.searchStr ?? ""}`;
        void router.navigate({ href: target });
      },
      href,
      label: (language: LanguageCode) => LANGUAGE_LABELS[language].native,
      t: getT(toUiLang(lang)),
    };
  }, [config, pathname, location.searchStr, router]);
}

export function LanguageProvider({
  config,
  children,
}: {
  /** Language config of the resolved ship (from the root loader). */
  config: ShipLanguageConfig | null;
  children: ReactNode;
}) {
  const value = useLanguageValue(config);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

/**
 * Language for the current URL. Falls back to the URL-derived language when no
 * provider is above the consumer (e.g. a transient dev reload) instead of
 * throwing and blanking the page.
 */
export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  const fallback = useLanguageValue(null);
  return ctx ?? fallback;
}


/**
 * Language-aware internal link. `path` is always the unprefixed app path;
 * the current language prefix is added automatically.
 */
export function LocalLink({
  path,
  children,
  ...rest
}: { path: string; children: ReactNode } & Omit<
  React.ComponentProps<"a">,
  "href" | "children"
>) {
  const { href } = useLanguage();
  // `to` is a runtime-built path; the language-prefixed routes exist in the tree.
  const AnyLink = Link as unknown as (props: Record<string, unknown>) => ReactNode;
  return <AnyLink to={href(path)} {...rest}>{children}</AnyLink>;
}
