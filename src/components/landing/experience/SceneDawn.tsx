"use client";

import type { PublicHomepageSection } from "@/lib/platform";
import { textOf } from "@/lib/platform";

import { useAmbienceScene } from "./Ambience";
import { SceneReveal } from "./motion";
import { Chapter, ParallaxImage, SceneBody } from "./parts";

/** Scene 2 — Dawn: the journey begins. Editorial storytelling, large type. */
export function SceneDawn({
  section,
  shipName,
}: {
  section: PublicHomepageSection | undefined;
  shipName: string;
}) {
  const ambienceRef = useAmbienceScene<HTMLElement>("dawn");
  if (!section) return null;

  const media = section.media.cover ? [section.media.cover, ...section.media.gallery] : section.media.all;
  const main = media[0];
  const second = media[1];
  const third = media[2];

  return (
    <section ref={ambienceRef} className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SceneReveal variant="up">
              <Chapter index={textOf(section, "chapter")} label={textOf(section, "time_label")} />
            </SceneReveal>
            <SceneReveal variant="up" delay={140}>
              <h2 className="mt-8 font-display text-4xl leading-[1.05] font-normal text-chronos-sand-900 sm:text-5xl lg:text-6xl">
                {textOf(section, "title")}{" "}
                <span className="italic text-chronos-sand-700">{textOf(section, "title_accent")}</span>
              </h2>
            </SceneReveal>
            <SceneReveal variant="up" delay={280} className="mt-8">
              <SceneBody>{textOf(section, "body")}</SceneBody>
            </SceneReveal>
            {textOf(section, "note") ? (
              <SceneReveal variant="up" delay={400} className="mt-10">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.36em] text-chronos-sand-500">
                  {textOf(section, "note")}
                </p>
              </SceneReveal>
            ) : null}
          </div>

          <div className="lg:col-span-7">
            {main ? (
              <SceneReveal variant="mask" duration={1500}>
                <ParallaxImage
                  src={main.url}
                  alt={main.alt ?? shipName}
                  className="aspect-4/5 w-full sm:aspect-16/10"
                  strength={80}
                />
              </SceneReveal>
            ) : null}
            <div className="mt-6 grid grid-cols-2 gap-6">
              {[second, third].map((m, i) =>
                m ? (
                  <SceneReveal key={m.id} variant="mask" delay={200 + i * 160} duration={1300}>
                    <ParallaxImage src={m.url} alt={m.alt ?? shipName} className="aspect-square w-full" strength={50} />
                  </SceneReveal>
                ) : null,
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
