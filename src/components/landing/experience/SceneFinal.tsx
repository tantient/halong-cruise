"use client";

import type { PublicHomepageSection } from "@/lib/platform";
import { textOf } from "@/lib/platform";
import { LocalLink } from "@/lib/i18n/language-context";

import { useAmbienceScene } from "./Ambience";
import { SceneReveal } from "./motion";
import { ParallaxImage } from "./parts";

/** Scene 8 — Final: near full-screen ending with the two calls to action. */
export function SceneFinal({
  section,
  shipName,
  quoteHref,
}: {
  section: PublicHomepageSection | undefined;
  shipName: string;
  quoteHref: string;
}) {
  const ambienceRef = useAmbienceScene<HTMLElement>("night");
  if (!section) return null;

  const image = section.media.cover ?? section.media.all[0] ?? null;
  const primary = textOf(section, "cta_primary") || textOf(section, "cta");
  const secondary = textOf(section, "cta_secondary");

  return (
    <section
      ref={ambienceRef}
      className="relative flex min-h-[86svh] items-center justify-center overflow-hidden bg-chronos-ink"
    >
      {image ? (
        <div className="absolute inset-0">
          <ParallaxImage
            src={image.url}
            alt={image.alt ?? shipName}
            className="h-full w-full"
            strength={70}
            imgClassName="brightness-[0.55]"
          />
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 hero-overlay-deep" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
        {textOf(section, "label") ? (
          <SceneReveal variant="fade">
            <span className="text-[0.66rem] font-semibold uppercase tracking-[0.5em] text-chronos-ivory/75">
              {textOf(section, "label")}
            </span>
          </SceneReveal>
        ) : null}
        <SceneReveal variant="up" delay={180} duration={1400}>
          <h2 className="mt-8 font-display text-[2.6rem] leading-[1.02] font-normal text-chronos-ivory text-glow sm:text-6xl lg:text-[5.5rem]">
            {textOf(section, "title")}{" "}
            <span className="italic text-chronos-gold-light">{textOf(section, "title_accent")}</span>
          </h2>
        </SceneReveal>
        {textOf(section, "body") ? (
          <SceneReveal variant="up" delay={340}>
            <p className="mx-auto mt-7 max-w-xl text-sm font-light leading-relaxed text-chronos-ivory/80 sm:text-base">
              {textOf(section, "body")}
            </p>
          </SceneReveal>
        ) : null}

        <SceneReveal variant="up" delay={480}>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            {primary ? (
              <LocalLink
                path="/itineraries"
                className="w-full border border-chronos-ivory/70 px-10 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-chronos-ivory transition-colors duration-500 hover:border-chronos-gold-light hover:text-chronos-gold-light sm:w-auto"
              >
                {primary}
              </LocalLink>
            ) : null}
            {secondary ? (
              <a
                href={quoteHref}
                className="w-full bg-chronos-gold px-10 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-chronos-ink transition-opacity duration-500 hover:opacity-85 sm:w-auto"
              >
                {secondary}
              </a>
            ) : null}
          </div>
        </SceneReveal>
      </div>
    </section>
  );
}
