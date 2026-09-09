"use client";

import { useMemo, useState } from "react";

import { useTimeState } from "@/lib/experience/time-context";
import { LocalLink } from "@/lib/i18n/language-context";
import { experienceUi } from "@/lib/i18n/ui-experience";
import {
  textOf,
  type EntityMedia,
  type PublicCabin,
  type PublicHomepageSection,
  type PublicService,
} from "@/lib/platform";

import { SceneReveal } from "../motion";
import { AmbientLink, Body, Eyebrow, stateText } from "./parts";

interface LifeItem {
  key: string;
  label: string;
  kind: string;
  title: string;
  meta: string;
  body: string;
  href: string;
  media: EntityMedia;
}

/**
 * Chapter 3 — Life on Chronos. A teaser, not a catalogue: one full-bleed image
 * that changes inside the same viewport as the visitor moves between a few
 * suites and experiences. Which experiences lead is decided per time state in
 * the section's own configuration (`emphasis`), never in code.
 */
export function ChapterLife({
  section,
  cabins,
  services,
  lang,
}: {
  section: PublicHomepageSection | undefined;
  cabins: PublicCabin[];
  services: PublicService[];
  lang: string;
}) {
  const ui = experienceUi(lang);
  const state = useTimeState();

  const items = useMemo<LifeItem[]>(() => {
    if (!section) return [];
    const emphasis = section.configuration["emphasis"] as Record<string, unknown> | undefined;
    const preferred = Array.isArray(emphasis?.[state])
      ? (emphasis?.[state] as unknown[]).filter((s): s is string => typeof s === "string")
      : [];
    const rank = (slug: string) => {
      const i = preferred.indexOf(slug);
      return i === -1 ? preferred.length + 1 : i;
    };
    const suiteItems: LifeItem[] = cabins.slice(0, 2).map((c) => ({
      key: `cabin-${c.id}`,
      label: c.name,
      kind: ui.suites,
      title: c.name,
      meta: [c.sizeSqm ? `${c.sizeSqm} m²` : null, c.maxGuests ? `${c.maxGuests} ${ui.guests}` : null, c.viewType]
        .filter(Boolean)
        .join(" · "),
      body: c.summary ?? c.description ?? "",
      href: `/cabins/${c.slug}`,
      media: c.media,
    }));
    const serviceItems: LifeItem[] = [...services]
      .sort((a, b) => rank(a.slug) - rank(b.slug) || a.sortOrder - b.sortOrder)
      .slice(0, 3)
      .map((s) => ({
        key: `service-${s.id}`,
        label: s.name,
        kind: ui.experiences,
        title: s.name,
        meta: [s.category, s.openingHours].filter(Boolean).join(" · "),
        body: s.summary ?? s.description ?? "",
        href: `/services/${s.slug}`,
        media: s.media,
      }));
    return [...suiteItems, ...serviceItems];
  }, [cabins, section, services, state, ui]);

  const [active, setActive] = useState(0);
  if (!section || items.length === 0) return null;
  const current = items[Math.min(active, items.length - 1)]!;

  return (
    <section className="relative py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SceneReveal variant="up">
          <Eyebrow index={textOf(section, "chapter")} label={stateText(section, state, "time_label")} />
        </SceneReveal>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
          <SceneReveal variant="up" delay={120}>
            <h2 className="font-display text-4xl leading-[1.04] font-normal text-[color:var(--amb-fg)] sm:text-5xl lg:text-[3.9rem]">
              {textOf(section, "title")}{" "}
              <span className="italic opacity-70">{textOf(section, "title_accent")}</span>
            </h2>
          </SceneReveal>
          <SceneReveal variant="up" delay={220}>
            <Body>{stateText(section, state, "body")}</Body>
          </SceneReveal>
        </div>
      </div>

      {/* Full-bleed stage: content changes without leaving the viewport. */}
      <SceneReveal variant="mask" delay={200} className="mt-12 sm:mt-16">
        <div className="relative h-[78svh] min-h-[460px] w-full overflow-hidden">
          {items.map((item, i) => {
            const image = item.media.cover ?? item.media.gallery[0] ?? item.media.all[0] ?? null;
            if (!image) return null;
            return (
              <img
                key={item.key}
                src={image.url}
                alt={i === active ? (image.alt ?? item.title) : ""}
                aria-hidden={i === active ? undefined : true}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1100ms] ease-out"
                style={{ opacity: i === active ? 1 : 0, filter: "var(--amb-img)" }}
              />
            );
          })}
          <div aria-hidden className="absolute inset-0" style={{ background: "var(--amb-scrim)" }} />

          <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-10 lg:p-14">
            <div className="max-w-2xl">
              <span className="text-[0.62rem] uppercase tracking-[0.42em] text-white/70">{current.kind}</span>
              <h3 className="mt-4 font-display text-3xl leading-[1.05] font-normal text-white sm:text-5xl lg:text-6xl">
                {current.title}
              </h3>
              {current.meta ? (
                <p className="mt-3 text-[0.68rem] uppercase tracking-[0.3em] text-white/70">{current.meta}</p>
              ) : null}
              {current.body ? (
                <p className="mt-5 max-w-xl text-sm leading-[1.85] font-light text-white/85 sm:text-base">
                  {current.body}
                </p>
              ) : null}
              <div className="mt-7">
                <LocalLink
                  path={current.href}
                  className="inline-flex items-center gap-3 border border-white/45 px-6 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-white transition-all duration-500 hover:border-white hover:bg-white/10"
                >
                  {textOf(section, "cta") || ui.viewAll}
                  <span aria-hidden>&rarr;</span>
                </LocalLink>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-5">
              {items.map((item, i) => (
                <button
                  key={item.key}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={i === active}
                  className={`text-[0.66rem] uppercase tracking-[0.3em] transition-colors duration-300 ${
                    i === active ? "text-white" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SceneReveal>
    </section>
  );
}
