"use client";

import { AmbientStage } from "@/lib/experience/AmbientStage";
import { useTimeState } from "@/lib/experience/time-context";
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

  return (
    <section className="relative flex h-[100svh] min-h-[560px] w-full items-end overflow-hidden">
      <AmbientStage media={section?.media} alt={shipName} priority zoom />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 sm:pb-24 lg:px-8 lg:pb-28">
        <SceneReveal variant="fade" delay={150} duration={1400}>
          <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.5em] text-white/75">
            {tagline}
          </span>
        </SceneReveal>
        <SceneReveal variant="up" delay={350} duration={1500}>
          <h1 className="mt-6 font-display text-[3.4rem] leading-[0.92] font-normal tracking-tight text-white sm:text-7xl lg:text-[8.2rem]">
            {title}
            {accent ? (
              <>
                {" "}
                <span className="italic text-white/85">{accent}</span>
              </>
            ) : null}
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
          {cta ? (
            <SceneReveal variant="fade" delay={820} duration={1200}>
              <a
                href={`#${nextId}`}
                className="inline-flex items-center gap-3 border border-white/45 px-7 py-4 text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-white transition-all duration-500 hover:border-white hover:bg-white/10"
              >
                {cta}
                <span aria-hidden>&darr;</span>
              </a>
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
