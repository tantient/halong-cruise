"use client";

import type { PublicHomepageSection } from "@/lib/platform";
import { listOf, textOf } from "@/lib/platform";

import { useAmbienceScene } from "./Ambience";
import { SceneReveal } from "./motion";
import { Chapter, ParallaxImage, SceneBody } from "./parts";

/** Scene 7 — Night: the day closes. Dark photography, quiet type. */
export function SceneNight({
  section,
  shipName,
}: {
  section: PublicHomepageSection | undefined;
  shipName: string;
}) {
  const ambienceRef = useAmbienceScene<HTMLElement>("night");
  if (!section) return null;

  const media = section.media.cover ? [section.media.cover, ...section.media.gallery] : section.media.all;
  const lines = listOf(section, "lines");

  return (
    <section ref={ambienceRef} className="relative overflow-hidden bg-chronos-ink py-20 text-chronos-ivory sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SceneReveal variant="up">
            <Chapter index={textOf(section, "chapter")} label={textOf(section, "time_label")} tone="light" />
          </SceneReveal>
          <SceneReveal variant="up" delay={140}>
            <h2 className="mt-8 font-display text-4xl leading-[1.05] font-normal text-chronos-ivory sm:text-5xl lg:text-[3.6rem]">
              {textOf(section, "title")}{" "}
              <span className="italic text-chronos-gold-light">{textOf(section, "title_accent")}</span>
            </h2>
          </SceneReveal>
          <SceneReveal variant="up" delay={260} className="mt-6">
            <SceneBody tone="light">{textOf(section, "body")}</SceneBody>
          </SceneReveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {media[0] ? (
            <SceneReveal variant="mask" duration={1500} className="lg:col-span-8">
              <ParallaxImage
                src={media[0].url}
                alt={media[0].alt ?? shipName}
                className="aspect-4/5 w-full sm:aspect-16/10 lg:h-full"
                strength={85}
                imgClassName="brightness-[0.82]"
              />
            </SceneReveal>
          ) : null}

          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {media.slice(1, 3).map((m, i) => (
              <SceneReveal key={m.id} variant="mask" delay={180 + i * 160} duration={1300}>
                <ParallaxImage
                  src={m.url}
                  alt={m.alt ?? shipName}
                  className="aspect-4/3 w-full"
                  strength={45}
                  imgClassName="brightness-[0.82]"
                />
              </SceneReveal>
            ))}
          </div>
        </div>

        {lines.length ? (
          <ul className="mt-14 grid gap-6 sm:grid-cols-3">
            {lines.map((line, i) => (
              <SceneReveal key={line} as="li" variant="up" delay={i * 130}>
                <span className="block h-px w-8 bg-chronos-gold/60" />
                <p className="mt-4 text-sm leading-relaxed font-light text-chronos-ivory/75">{line}</p>
              </SceneReveal>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
