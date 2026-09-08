"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChronosLogo } from "./ChronosLogo";
import { services } from "@/components/services/services-data";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocalLink, useLanguage } from "@/lib/i18n/language-context";
import { LANGUAGE_LABELS, type LanguageCode } from "@/lib/i18n/languages";
import type { Lang } from "@/lib/translations";

interface HeaderProps {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: {
    nav: { about: string; cabins: string; gallery: string; services: string; itineraries: string; offers: string; careers: string; quote: string; book: string; contact: string; more: string; spaces: string };
  };
}

const BOOKING_LINK = "https://zalo.me/";

export function Header({ lang, setLang, t }: HeaderProps) {
  // Languages come from the resolved ship, so the switcher works for any tenant.
  const { languages } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/itineraries", label: t.nav.itineraries },
    { href: "/cabins", label: t.nav.cabins },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/careers", label: t.nav.careers },
    { href: "/contact", label: t.nav.contact },
  ];

  const toLink = (s: (typeof services)[number]) => ({
    href: `/services/${s.id}`,
    label: lang === "vi" ? s.menuNameVi : s.menuNameEn,
    desc: lang === "vi" ? s.menuDescVi : s.menuDescEn,
  });

  const serviceGroups = [
    {
      title: t.nav.services,
      links: services.filter((s) => s.group === "service").map(toLink),
    },
    {
      title: t.nav.spaces,
      links: services.filter((s) => s.group === "space").map(toLink),
    },
  ];

  const linkClasses = scrolled
    ? "text-chronos-sand-900/75 hover:text-chronos-sand-900"
    : "text-chronos-ivory/90 hover:text-chronos-ivory";

  const scrolledText = scrolled ? "text-chronos-sand-900" : "text-chronos-ivory";

  const dropdownLinkClasses =
    "block rounded-sm px-3 py-2 transition-colors hover:bg-chronos-ink/5";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-chronos-ivory/95 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <LocalLink path="/" className="flex items-center">
          <ChronosLogo
            showTagline={false}
            size="md"
            tone={scrolled ? "auto" : "onDark"}
            aria-label="Chronos Cruise"
          />
        </LocalLink>

        <nav className="hidden items-center gap-3 xl:gap-4 xl:flex">
          <LocalLink
            path="/itineraries"
            className={`whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] transition-colors ${linkClasses}`}
          >
            {t.nav.itineraries}
          </LocalLink>
          <LocalLink
            path="/cabins"
            className={`whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] transition-colors ${linkClasses}`}
          >
            {t.nav.cabins}
          </LocalLink>

          <div className="group relative">
            <button
              className={`flex items-center gap-1 whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] transition-colors ${linkClasses}`}
            >
              {t.nav.services}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-[34rem] -translate-x-1/2 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <div className="grid grid-cols-2 gap-2 rounded-sm border border-chronos-ink/10 bg-chronos-ivory/98 p-3 shadow-lg backdrop-blur-md">
                {serviceGroups.map((group) => (
                  <div key={group.title}>
                    <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink/70">
                      {group.title}
                    </p>
                    {group.links.map((link) => (
                      <LocalLink
                        key={link.href}
                        path={link.href}
                        title={link.desc}
                        className={dropdownLinkClasses}
                      >
                        <span className="block text-[12px] font-medium tracking-wide text-chronos-ink">
                          {link.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-chronos-ink/75">
                          {link.desc}
                        </span>
                      </LocalLink>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <LocalLink
            path="/gallery"
            className={`whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] transition-colors ${linkClasses}`}
          >
            {t.nav.gallery}
          </LocalLink>
          <LocalLink
            path="/careers"
            className={`whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] transition-colors ${linkClasses}`}
          >
            {t.nav.careers}
          </LocalLink>
          <LocalLink
            path="/contact"
            className={`whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] transition-colors ${linkClasses}`}
          >
            {t.nav.contact}
          </LocalLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div
            className={`flex items-center rounded-full border p-1 ${
              scrolled ? "border-chronos-sand-900/20" : "border-chronos-ivory/30"
            }`}
          >
            {languages.map((code) => (
              <button
                key={code}
                onClick={() => setLang(code as Lang)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  lang === code
                    ? scrolled
                      ? "bg-chronos-sand-900 text-chronos-ivory"
                      : "bg-chronos-ivory text-chronos-sand-900"
                    : scrolled
                      ? "text-chronos-sand-900/70 hover:text-chronos-sand-900"
                      : "text-chronos-ivory/80 hover:text-chronos-ivory"
                }`}
                aria-label={LANGUAGE_LABELS[code as LanguageCode].native}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <ThemeToggle
            className={
              scrolled
                ? "border-chronos-sand-900/20 text-chronos-sand-900 hover:bg-chronos-sand-900/5"
                : "border-chronos-ivory/30 text-chronos-ivory hover:bg-chronos-ivory/10"
            }
          />

          <Button asChild className="btn-sheen rounded-none bg-chronos-sand-500 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ivory hover:bg-chronos-sand-700">
            <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
              {t.nav.book}
            </a>
          </Button>
        </div>

        <button
          className="xl:hidden"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className={`h-6 w-6 ${scrolled ? "text-chronos-sand-900" : "text-chronos-ivory"}`} />
          ) : (
            <Menu className={`h-6 w-6 ${scrolled ? "text-chronos-sand-900" : "text-chronos-ivory"}`} />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-chronos-ink/10 bg-chronos-ivory/98 px-6 pb-6 xl:hidden">
          <nav className="flex flex-col gap-4 pt-4">
            {navLinks.slice(0, 2).map((link) => (
              <LocalLink
                key={link.href}
                path={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium tracking-wide text-chronos-ink/80"
              >
                {link.label}
              </LocalLink>
            ))}
            {serviceGroups.map((group) => (
              <div key={group.title} className="pt-1">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-chronos-ink/70">
                  {group.title}
                </p>
                <div className="flex flex-col gap-3 border-l border-chronos-ink/10 pl-4">
                  {group.links.map((link) => (
                    <LocalLink
                      key={link.href}
                      path={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      <span className="block text-sm tracking-wide text-chronos-ink/85">
                        {link.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-chronos-ink/70">
                        {link.desc}
                      </span>
                    </LocalLink>
                  ))}
                </div>
              </div>
            ))}
            {navLinks.slice(2).map((link) => (
              <LocalLink
                key={link.href}
                path={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium tracking-wide text-chronos-ink/80"
              >
                {link.label}
              </LocalLink>
            ))}
            <div className="flex items-center gap-2 pt-2">
              {languages.map((code) => (
                <button
                  key={code}
                  onClick={() => setLang(code as Lang)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    lang === code ? "bg-chronos-sand-900 text-chronos-ivory" : "text-chronos-sand-900/70"
                  }`}
                  aria-label={LANGUAGE_LABELS[code as LanguageCode].native}
                >
                  {code.toUpperCase()}
                </button>
              ))}
              <ThemeToggle className="border-chronos-sand-900/15 text-chronos-sand-900 hover:bg-chronos-sand-900/5" />
            </div>
            <Button asChild className="btn-sheen rounded-none bg-chronos-sand-500 text-xs font-semibold uppercase tracking-[0.18em] text-chronos-ivory hover:bg-chronos-sand-700">
              <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer">
                {t.nav.book}
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
