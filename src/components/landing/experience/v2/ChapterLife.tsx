"use client";

import { useMemo, useState } from "react";

import { AmbientStage } from "@/lib/experience/AmbientStage";
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
import { Body, Eyebrow, stateText } from "./parts";

/** One slot of the explorer: a single visual stage plus its editorial copy. */
interface ExplorerSlot {
  key: string;
  /** Short label in the slot rail (Suites, Dining, Sundeck, Wellness, …). */
  label: string;
  kind: string;
  title: string;
  meta: string;
  body: string;
  href: string;
  media: EntityMedia;
}

const MAX_SLOTS = 5;

interface SlotConfig {
  label: string;
  cabin: string;
  service: string;
}

function readSlots(section: PublicHomepageSection): SlotConfig[] {
  const raw = section.configuration["slots"] as unknown;
  if (!Array.isArray(raw)) return [];
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  return (raw as unknown[])
    .filter((s): s is Record<string, unknown> => Boolean(s) && typeof s === "object" && !Array.isArray(s))
    .map((s) => ({ label: str(s["label"]), cabin: str(s["cabin"]), service: str(s["service"]) }));
}

/**
 * Chapter 3 — Life on Chronos, as an Experience Explorer.
 *
 * Not a card grid: one visual stage carries the chapter, and the content
 * transitions inside the same experience as the visitor moves along the slot
 * rail (Suites → Dining → Sundeck → Wellness → Activities). Which slots exist,
 * in which order, is declared in the section's own `configuration.slots`
 * (each slot points at a cabin or a service); with none declared it falls back
 * to the ship's leading suite and experiences. Ordering per time state comes
 * from `configuration.emphasis`. Every slot's visual is an ambient media slot,
 * so a single slot can later be replaced with production photography or a short
 * film — desktop, mobile, poster and per-time-state variants included — without
 * changing this component.
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

  const slots = useMemo<ExplorerSlot[]>(() => {
    if (!section) return [];

    const cabinSlot = (c: PublicCabin, label?: string): ExplorerSlot => ({
      key: `cabin-${c.id}`,
      label: label || c.name,
      kind: ui.suites,
      title: c.name,
      meta: [c.sizeSqm ? `${c.sizeSqm} m²` : null, c.maxGuests ? `${c.maxGuests} ${ui.guests}` : null, c.viewType]
        .filter(Boolean)
        .join(" · "),
      body: c.summary ?? c.description ?? "",
      href: `/cabins/${c.slug}`,
      media: c.media,
    });
    const serviceSlot = (s: PublicService, label?: string): ExplorerSlot => ({
      key: `service-${s.id}`,
      label: label || s.name,
      kind: s.category || ui.experiences,
      title: s.name,
      meta: [s.category, s.openingHours].filter(Boolean).join(" · "),
      body: s.summary ?? s.description ?? "",
      href: `/experiences/${s.slug}`,
      media: s.media,
    });

    // 1. Declared slots win: they define the narrative order of the explorer.
    const declared = readSlots(section)
      .map((slot) => {
        if (slot.cabin) {
          const cabin = cabins.find((c) => c.slug === slot.cabin);
          return cabin ? cabinSlot(cabin, slot.label) : null;
        }
        if (slot.service) {
          const service = services.find((s) => s.slug === slot.service);
          return service ? serviceSlot(service, slot.label) : null;
        }
        return null;
      })
      .filter((s): s is ExplorerSlot => s !== null);
    if (declared.length) return declared.slice(0, MAX_SLOTS);

    // 2. Fallback: the leading suite plus the experiences this hour favours.
    const emphasis = section.configuration["emphasis"] as Record<string, unknown> | undefined;
    const preferred = Array.isArray(emphasis?.[state])
      ? (emphasis?.[state] as unknown[]).filter((s): s is string => typeof s === "string")
      : [];
    const rank = (slug: string) => {
      const i = preferred.indexOf(slug);
      return i === -1 ? preferred.length + 1 : i;
    };
    const suiteSlots = cabins.slice(0, 2).map((c) => cabinSlot(c));
    const experienceSlots = [...services]
      .sort((a, b) => rank(a.slug) - rank(b.slug) || a.sortOrder - b.sortOrder)
      .slice(0, MAX_SLOTS - suiteSlots.length)
      .map((s) => serviceSlot(s));
    return [...suiteSlots, ...experienceSlots].slice(0, MAX_SLOTS);
  }, [cabins, section, services, state, ui]);

  const [active, setActive] = useState(0);
  if (!section || slots.length === 0) return null;
  const index = Math.min(active, slots.length - 1);
  const current = slots[index]!;

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

      {/* One stage; the slot changes inside it, never leaving the viewport. */}
      <SceneReveal variant="mask" delay={200} className="mt-12 sm:mt-16">
        <div className="relative h-[78svh] min-h-[460px] w-full overflow-hidden">
          {slots.map((slot, i) => (
            <div
              key={slot.key}
              aria-hidden={i === index ? undefined : true}
              className="absolute inset-0 transition-opacity duration-[1100ms] ease-out"
              style={{ opacity: i === index ? 1 : 0 }}
            >
              {/* Mounted lazily: a slot only loads once it has been opened. */}
              {i === index || i === 0 ? <AmbientStage media={slot.media} alt={slot.title} /> : null}
            </div>
          ))}

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
              {slots.map((slot, i) => (
                <button
                  key={slot.key}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={i === index}
                  className={`text-[0.66rem] uppercase tracking-[0.3em] transition-colors duration-300 ${
                    i === index ? "text-white" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SceneReveal>
    </section>
  );
}
