"use client";

import { AmbientImage } from "@/lib/experience/AmbientImage";
import { useTimeState } from "@/lib/experience/time-context";
import { textOf, type PublicHomepageSection } from "@/lib/platform";

import { SceneReveal } from "../motion";
import { Eyebrow, stateText } from "./parts";

/**
 * Chapter 4 — Signature Moment. A near-full-screen moment that belongs to the
 * hour: its photography, headline and note all come from the current time
 * state, so the same page feels like a different moment on the bay.
 */
export function ChapterSignature({
  section,
  shipName,
}: {
  section: PublicHomepageSection | undefined;
  shipName: string;
}) {
  const state = useTimeState();
  if (!section) return null;

  const title = stateText(section, state, "title");
  const accent = stateText(section, state, "title_accent");
  const body = stateText(section, state, "body");
  const label = stateText(section, state, "time_label");

  return (
    <section className="relative flex h-[92svh] min-h-[520px] w-full items-center overflow-hidden">
      <AmbientImage media={section.media} alt={shipName} zoom />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          <SceneReveal variant="fade">
            <Eyebrow index={textOf(section, "chapter")} label={label} tone="onImage" />
          </SceneReveal>
          <SceneReveal variant="up" delay={180} duration={1400}>
            <h2 className="mt-7 font-display text-[2.9rem] leading-[0.98] font-normal text-white sm:text-6xl lg:text-[6.4rem]">
              {title}
              {accent ? (
                <>
                  <br />
                  <span className="italic text-white/80">{accent}</span>
                </>
              ) : null}
            </h2>
          </SceneReveal>
          {body ? (
            <SceneReveal variant="up" delay={420} duration={1300}>
              <p className="mt-7 max-w-lg text-sm leading-[1.9] font-light text-white/85 sm:text-base">{body}</p>
            </SceneReveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
