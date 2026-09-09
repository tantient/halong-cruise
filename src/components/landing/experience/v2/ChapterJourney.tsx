"use client";

import { useState } from "react";

import { AmbientStage } from "@/lib/experience/AmbientStage";
import { useTimeState } from "@/lib/experience/time-context";
import { experienceUi } from "@/lib/i18n/ui-experience";
import { textOf, type PublicHomepageSection, type PublicItinerary } from "@/lib/platform";

import { SceneReveal } from "../motion";
import { AmbientLink, Body, Eyebrow, stateText } from "./parts";

/**
 * Chapter 2 — The Journey. Deliberately condensed: not an itinerary listing but
 * a progression. The editorial column stays with the visitor while the voyages
 * advance beside it, and the chapter's visual stage follows the step in focus.
 *
 * Upgrade path: the step in focus is the single source of truth for the stage,
 * so a real route map, a day-by-day timeline or per-voyage film can replace the
 * stage later without changing the chapter structure. Nothing here invents a
 * map, a location or product information — every step is real itinerary data.
 */
export function ChapterJourney({
  id,
  section,
  itineraries,
  shipName,
  lang,
}: {
  id: string;
  section: PublicHomepageSection | undefined;
  itineraries: PublicItinerary[];
  shipName: string;
  lang: string;
}) {
  const ui = experienceUi(lang);
  const state = useTimeState();
  const [step, setStep] = useState(0);
  if (!section) return null;

  const list = itineraries.slice(0, 3);
  const active = Math.min(step, Math.max(list.length - 1, 0));
  const stageMedia = list[active]?.media.all.length ? list[active]!.media : section.media;
  const duration = (it: PublicItinerary) => {
    const parts: string[] = [];
    if (it.days) parts.push(`${it.days} ${it.days > 1 ? ui.days : ui.day}`);
    if (it.nights) parts.push(`${it.nights} ${it.nights > 1 ? ui.nights : ui.night}`);
    return parts.join(" · ");
  };

  return (
    <section id={id} className="relative scroll-mt-24 py-24 sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24 lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SceneReveal variant="up">
            <Eyebrow index={textOf(section, "chapter")} label={stateText(section, state, "time_label")} />
          </SceneReveal>
          <SceneReveal variant="up" delay={120}>
            <h2 className="mt-8 font-display text-4xl leading-[1.04] font-normal text-[color:var(--amb-fg)] sm:text-5xl lg:text-[3.9rem]">
              {textOf(section, "title")}{" "}
              <span className="italic opacity-70">{textOf(section, "title_accent")}</span>
            </h2>
          </SceneReveal>
          <SceneReveal variant="up" delay={240} className="mt-7">
            <Body>{stateText(section, state, "body")}</Body>
          </SceneReveal>

          <SceneReveal variant="mask" delay={320} className="mt-10 hidden lg:block">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <AmbientStage media={stageMedia} alt={shipName} scrim={false} />
            </div>
          </SceneReveal>

          {textOf(section, "note") ? (
            <SceneReveal variant="fade" delay={420} className="mt-8">
              <p className="text-[0.66rem] uppercase tracking-[0.4em] text-[color:var(--amb-muted)]">
                {textOf(section, "note")}
              </p>
            </SceneReveal>
          ) : null}
        </div>

        <ol className="relative space-y-14 sm:space-y-16">
          <span
            aria-hidden
            className="absolute top-2 bottom-2 left-[7px] w-px"
            style={{ background: "var(--amb-line)" }}
          />
          {list.map((it, i) => (
            <SceneReveal
              as="li"
              key={it.id}
              variant="up"
              delay={i * 110}
              className="relative pl-12"
            >
              <div
                onMouseEnter={() => setStep(i)}
                onFocus={() => setStep(i)}
                className="transition-opacity duration-700"
                style={{ opacity: i === active ? 1 : 0.62 }}
              >
                <span
                  aria-hidden
                  className="absolute top-2 left-0 h-4 w-4 rounded-full border transition-colors duration-700"
                  style={{
                    borderColor: "var(--amb-accent)",
                    background: i === active ? "var(--amb-accent)" : "var(--amb-bg)",
                  }}
                />
                <span className="text-[0.62rem] uppercase tracking-[0.4em] text-[color:var(--amb-muted)]">
                  {duration(it)}
                  {it.departurePoint ? ` · ${it.departurePoint}` : ""}
                </span>
                <h3 className="mt-3 font-display text-2xl leading-snug font-normal text-[color:var(--amb-fg)] sm:text-3xl">
                  {it.name}
                </h3>
                {it.summary ? (
                  <p className="mt-3 max-w-lg text-sm leading-[1.85] font-light text-[color:var(--amb-muted)] sm:text-base">
                    {it.summary}
                  </p>
                ) : null}
                <div className="mt-5">
                  <AmbientLink path={`/itineraries`} variant="text">
                    {textOf(section, "cta") || ui.viewAll}
                  </AmbientLink>
                </div>
              </div>
            </SceneReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
