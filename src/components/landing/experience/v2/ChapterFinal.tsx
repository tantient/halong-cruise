"use client";

import { AmbientStage } from "@/lib/experience/AmbientStage";
import { textOf, type PublicHomepageSection } from "@/lib/platform";

import { SceneReveal } from "../motion";
import { AmbientLink } from "./parts";

/**
 * Chapter 5 — Your time begins here. The closing moment: two ways forward and
 * nothing after it but the footer.
 */
export function ChapterFinal({
  section,
  shipName,
  primaryPath,
  secondaryPath,
}: {
  section: PublicHomepageSection | undefined;
  shipName: string;
  primaryPath: string;
  secondaryPath: string;
}) {
  if (!section) return null;
  const cta = textOf(section, "cta");
  const ctaSecondary = textOf(section, "cta_secondary");

  return (
    <section className="relative flex h-[88svh] min-h-[500px] w-full items-center justify-center overflow-hidden text-center">
      <AmbientStage media={section.media} alt={shipName} />
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 lg:px-8">
        <SceneReveal variant="up" duration={1400}>
          <h2 className="font-display text-[2.7rem] leading-[0.98] font-normal text-white sm:text-6xl lg:text-[6rem]">
            {textOf(section, "title")}
            <br />
            <span className="italic text-white/85">{textOf(section, "title_accent")}</span>
          </h2>
        </SceneReveal>
        {textOf(section, "body") ? (
          <SceneReveal variant="fade" delay={300}>
            <p className="mx-auto mt-7 max-w-md text-[0.68rem] uppercase tracking-[0.4em] text-white/70">
              {textOf(section, "body")}
            </p>
          </SceneReveal>
        ) : null}
        <SceneReveal variant="up" delay={460}>
          <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            {cta ? (
              <AmbientLink path={primaryPath} tone="onImage" variant="solid">
                {cta}
              </AmbientLink>
            ) : null}
            {ctaSecondary ? (
              <AmbientLink path={secondaryPath} tone="onImage" variant="outline">
                {ctaSecondary}
              </AmbientLink>
            ) : null}
          </div>
        </SceneReveal>
      </div>
    </section>
  );
}
