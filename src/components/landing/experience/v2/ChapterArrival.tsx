"use client";

import { AmbientStage } from "@/lib/experience/AmbientStage";
import { useTimeState } from "@/lib/experience/time-context";
import { LocalLink } from "@/lib/i18n/language-context";
import { textOf, type PublicHomepageSection } from "@/lib/platform";
import { experienceUi } from "@/lib/i18n/ui-experience";

import { SceneReveal } from "../motion";
import { stateText } from "./parts";

/**
 * Chapter 1 — Arrival. Full-screen cinematic hero and the strongest expression
 * of the hour: the photography, the light and the line under the name all
 * follow the current ambient state.
 */
export function ChapterArrival({
  section,
  shipName,
  lang,
  nextId,
}: {
  section: PublicHomepageSection | undefined;
  shipName: string;
  lang: string;
  nextId: string;
}) {
  const ui = experienceUi(lang);
  const state = useTimeState();
  const title = textOf(section, "title") || shipName;
  const accent = textOf(section, "title_accent");
  const tagline = textOf(section, "tagline");
  const subtitle = stateText(section, state, "subtitle");
  const cta = textOf(section, "cta");
  const ctaSecondary = textOf(section, "cta_secondary");

  return (
    <section className="relative flex h-[100svh] min-h-[560px] w-full items-end overflow-hidden">
      <AmbientStage media={section?.media} alt={shipName} priority zoom raw scrim={false} />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 sm:pb-24 lg:px-8 lg:pb-28">
        {tagline ? (
          <SceneReveal variant="fade" delay={150} duration={1400}>
            <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.5em] text-white/75">
              {tagline}
            </span>
          </SceneReveal>
        ) : null}
        <SceneReveal variant="up" delay={350} duration={1500}>
          <h1 className="mt-8 font-display text-2xl font-normal uppercase leading-[1.25] tracking-[0.1em] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] sm:text-3xl sm:tracking-[0.18em] lg:text-5xl">
            <span className="block whitespace-nowrap">{title}</span>
            {accent ? <span className="block whitespace-nowrap">{accent}</span> : null}
          </h1>
        </SceneReveal>
        <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          {subtitle ? (
            <SceneReveal variant="up" delay={620} duration={1400}>
              <p className="max-w-md text-sm font-light leading-relaxed text-white/85 sm:text-base">
                {subtitle}
              </p>
            </SceneReveal>
          ) : (
            <span />
          )}
          {cta || ctaSecondary ? (
            <SceneReveal variant="fade" delay={820} duration={1200}>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
                {cta ? (
                  <a
                    href={`#${nextId}`}
                    className="inline-flex items-center gap-3 border border-white/45 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white transition-all duration-500 hover:border-white hover:bg-white/10"
                  >
                    {cta}
                    <span aria-hidden>&darr;</span>
                  </a>
                ) : null}
                {ctaSecondary ? (
                  <LocalLink
                    path="/itineraries"
                    className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/80 underline decoration-white/30 underline-offset-8 transition-colors duration-500 hover:text-white hover:decoration-white/70"
                  >
                    {ctaSecondary}
                    <span aria-hidden>&rarr;</span>
                  </LocalLink>
                ) : null}
              </div>
            </SceneReveal>
          ) : null}

        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="text-[0.58rem] uppercase tracking-[0.4em] text-white/60">{ui.scroll}</span>
        <span className="scroll-thread h-10 w-px" />
      </div>
    </section>
  );
}
