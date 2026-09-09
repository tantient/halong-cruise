"use client";

import type { MediaItem, PublicHomepageSection } from "@/lib/platform";
import { textOf } from "@/lib/platform";
import { experienceUi } from "@/lib/i18n/ui-experience";

import { HeroMedia } from "../HeroMedia";
import { useAmbienceScene } from "./Ambience";
import { SceneReveal, useIsCompact, usePrefersReducedMotion, useScrollProgress } from "./motion";

/** Scene 1 — Cinematic opening: full screen, almost no words. */
export function SceneOpening({
  section,
  slides,
  shipName,
  lang,
}: {
  section: PublicHomepageSection | undefined;
  slides: MediaItem[];
  shipName: string;
  lang: string;
}) {
  const ui = experienceUi(lang);
  const reduced = usePrefersReducedMotion();
  const compact = useIsCompact();
  const ambienceRef = useAmbienceScene<HTMLElement>("dawn");
  const { ref: progressRef, progress } = useScrollProgress<HTMLDivElement>(!reduced);

  const tagline = textOf(section, "tagline");
  const title = textOf(section, "title") || shipName;
  const accent = textOf(section, "title_accent");
  const subtitle = textOf(section, "subtitle");

  // The headline drifts up and fades as the first scene leaves; toned down on phones.
  const depth = compact ? 0.45 : 1;
  const lift = reduced ? 0 : Math.max(0, progress - 0.5) * 220 * depth;
  const fade = reduced ? 1 : 1 - Math.max(0, progress - 0.55) * 2.2;

  return (
    <section
      ref={ambienceRef}
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden"
    >
      <div ref={progressRef} className="absolute inset-0">
        <HeroMedia
          slides={slides.map((m) => ({ url: m.url, alt: m.alt ?? shipName }))}
          intervalMs={7500}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 hero-overlay-deep" />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: "linear-gradient(to bottom, transparent, var(--chronos-ivory))" }}
      />

      <div
        className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center lg:px-8"
        style={{ transform: `translate3d(0, -${lift.toFixed(1)}px, 0)`, opacity: Math.max(0, Math.min(1, fade)) }}
      >
        <SceneReveal variant="fade" delay={200} duration={1400}>
          <span className="mb-8 inline-block text-[0.68rem] font-semibold uppercase tracking-[0.55em] text-chronos-ivory/80 drop-shadow-[0_1px_10px_rgba(0,0,0,0.8)] sm:text-xs">
            {tagline}
          </span>
        </SceneReveal>
        <SceneReveal variant="up" delay={420} duration={1500}>
          <h1 className="font-display text-[3.1rem] leading-[0.95] font-normal tracking-tight text-chronos-ivory text-glow sm:text-7xl lg:text-[8.5rem]">
            {title}
            {accent ? (
              <>
                <br />
                <span className="italic text-chronos-gold-light">{accent}</span>
              </>
            ) : null}
          </h1>
        </SceneReveal>
        {subtitle ? (
          <SceneReveal variant="up" delay={760} duration={1400}>
            <p className="mx-auto mt-8 max-w-md text-sm font-light leading-relaxed text-chronos-ivory/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)] sm:text-base">
              {subtitle}
            </p>
          </SceneReveal>
        ) : null}
      </div>

      <div className="pointer-events-none absolute bottom-16 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 sm:bottom-20">
        <span className="text-[0.62rem] uppercase tracking-[0.42em] text-chronos-ivory/75 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
          {textOf(section, "cta") || ui.scroll}
        </span>
        <span className="scroll-thread h-14 w-px" />
      </div>
    </section>
  );
}
