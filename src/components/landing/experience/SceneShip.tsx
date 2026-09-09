"use client";

import type { PublicHomepageSection } from "@/lib/platform";
import { textOf } from "@/lib/platform";
import { experienceUi } from "@/lib/i18n/ui-experience";

import { useAmbienceScene } from "./Ambience";
import { SceneReveal } from "./motion";
import { Chapter, ParallaxImage, SceneBody } from "./parts";

/**
 * Scene 3 — The Ship: architecture on water. Visual-first; the only figures
 * shown are real values already stored for the ship.
 */
export function SceneShip({
  section,
  shipName,
  lang,
  facts,
}: {
  section: PublicHomepageSection | undefined;
  shipName: string;
  lang: string;
  facts: { suites: number | null; categories: number; voyages: number; experiences: number };
}) {
  const ui = experienceUi(lang);
  const ambienceRef = useAmbienceScene<HTMLElement>("day");
  if (!section) return null;

  const media = section.media.cover ? [section.media.cover, ...section.media.gallery] : section.media.all;
  const rows: { value: string; label: string }[] = [
    ...(facts.suites ? [{ value: String(facts.suites), label: ui.suites }] : []),
    ...(facts.categories ? [{ value: String(facts.categories), label: ui.categories }] : []),
    ...(facts.voyages ? [{ value: String(facts.voyages), label: ui.voyages }] : []),
    ...(facts.experiences ? [{ value: String(facts.experiences), label: ui.experiences }] : []),
  ];

  return (
    <section ref={ambienceRef} className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      {media[0] ? (
        <SceneReveal variant="mask" duration={1600}>
          <ParallaxImage
            src={media[0].url}
            alt={media[0].alt ?? shipName}
            className="h-[62svh] w-full sm:h-[78svh]"
            strength={110}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chronos-ink/55 via-transparent to-transparent" />
          </ParallaxImage>
        </SceneReveal>
      ) : null}

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SceneReveal variant="up">
              <Chapter index={textOf(section, "chapter")} label={textOf(section, "time_label")} />
            </SceneReveal>
            <SceneReveal variant="up" delay={140}>
              <h2 className="mt-8 font-display text-4xl leading-[1.05] font-normal text-chronos-sand-900 sm:text-5xl lg:text-[3.6rem]">
                {textOf(section, "title")}{" "}
                <span className="italic text-chronos-sand-700">{textOf(section, "title_accent")}</span>
              </h2>
            </SceneReveal>
            <SceneReveal variant="up" delay={260} className="mt-8">
              <SceneBody>{textOf(section, "body")}</SceneBody>
            </SceneReveal>

            {rows.length ? (
              <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4 lg:grid-cols-2">
                {rows.map((r, i) => (
                  <SceneReveal key={r.label} variant="up" delay={340 + i * 110}>
                    <dt className="font-display text-3xl font-normal text-chronos-sand-900 sm:text-4xl">{r.value}</dt>
                    <dd className="mt-2 text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-chronos-sand-500">
                      {r.label}
                    </dd>
                  </SceneReveal>
                ))}
              </dl>
            ) : null}
          </div>

          <div className="grid gap-6 sm:grid-cols-3 lg:col-span-7 lg:mt-10">
            {media.slice(1, 4).map((m, i) => (
              <SceneReveal
                key={m.id}
                variant="mask"
                delay={i * 170}
                duration={1300}
                className={i === 0 ? "sm:col-span-2" : ""}
              >
                <ParallaxImage
                  src={m.url}
                  alt={m.alt ?? shipName}
                  className={`w-full ${i === 0 ? "aspect-16/10" : "aspect-4/5"}`}
                  strength={45}
                />
              </SceneReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
