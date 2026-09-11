"use client";

import { useState } from "react";

import { AmbientStage } from "@/lib/experience/AmbientStage";
import { useTimeState } from "@/lib/experience/time-context";
import { experienceUi } from "@/lib/i18n/ui-experience";
import { textOf, type PublicCabin, type PublicHomepageSection } from "@/lib/platform";

import { SceneReveal } from "../motion";
import { AmbientLink, Body, Eyebrow, stateText } from "./parts";

/**
 * Chapter — Suites. A dedicated accommodation chapter: one editorial stage on
 * the left that follows the suite in focus, and a quiet index of the ship's real
 * commercial categories on the right. Every figure (size, guests, view) comes
 * from the `cabins` rows; nothing is written here.
 */
export function ChapterSuites({
  section,
  cabins,
  lang,
}: {
  section: PublicHomepageSection | undefined;
  cabins: PublicCabin[];
  lang: string;
}) {
  const ui = experienceUi(lang);
  const state = useTimeState();
  const [focus, setFocus] = useState(0);
  if (!section || cabins.length === 0) return null;

  const list = cabins.slice(0, 6);
  const index = Math.min(focus, list.length - 1);
  const current = list[index]!;
  const meta = (c: PublicCabin) =>
    [c.sizeSqm ? `${c.sizeSqm} m²` : null, c.maxGuests ? `${c.maxGuests} ${ui.guests}` : null, c.viewType]
      .filter(Boolean)
      .join(" · ");

  return (
    <section className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SceneReveal variant="up">
          <Eyebrow index={textOf(section, "chapter")} label={stateText(section, state, "time_label")} />
        </SceneReveal>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
          <SceneReveal variant="up" delay={120}>
            <h2 className="font-display text-4xl leading-[1.04] font-normal text-[color:var(--amb-fg)] sm:text-5xl lg:text-[3.9rem]">
              {textOf(section, "title")}{" "}
              <span className="italic opacity-70">{textOf(section, "title_accent")}</span>
            </h2>
          </SceneReveal>
          <SceneReveal variant="up" delay={220}>
            <Body>{stateText(section, state, "body")}</Body>
          </SceneReveal>
        </div>

        <div className="mt-10 grid gap-8 sm:mt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-16">
          <SceneReveal variant="mask">
            <div className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-[4/3]">
              {list.map((c, i) => (
                <div
                  key={c.id}
                  aria-hidden={i === index ? undefined : true}
                  className="absolute inset-0 transition-opacity duration-[1000ms] ease-out"
                  style={{ opacity: i === index ? 1 : 0 }}
                >
                  {i === index || i === 0 ? <AmbientStage media={c.media} alt={c.name} scrim={false} /> : null}
                </div>
              ))}
            </div>
            <p className="mt-4 text-[0.66rem] uppercase tracking-[0.34em] text-[color:var(--amb-muted)]">
              {current.name}
            </p>
          </SceneReveal>

          <div className="lg:pt-2">
            <ol className="border-t" style={{ borderColor: "var(--amb-line)" }}>
              {list.map((c, i) => (
                <SceneReveal as="li" key={c.id} variant="up" delay={i * 90}>
                  <button
                    type="button"
                    onMouseEnter={() => setFocus(i)}
                    onFocus={() => setFocus(i)}
                    onClick={() => setFocus(i)}
                    aria-current={i === index}
                    className="block w-full border-b py-6 text-left transition-opacity duration-500 sm:py-7"
                    style={{ borderColor: "var(--amb-line)", opacity: i === index ? 1 : 0.6 }}
                  >
                    <span className="flex items-baseline gap-5">
                      <span className="font-display text-sm italic text-[color:var(--amb-muted)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-xl leading-snug font-normal text-[color:var(--amb-fg)] sm:text-2xl">
                          {c.name}
                        </span>
                        {meta(c) ? (
                          <span className="mt-2 block text-[0.64rem] uppercase tracking-[0.32em] text-[color:var(--amb-muted)]">
                            {meta(c)}
                          </span>
                        ) : null}
                      </span>
                    </span>
                  </button>
                </SceneReveal>
              ))}
            </ol>

            <SceneReveal variant="fade" delay={200} className="mt-10">
              <AmbientLink path="/cabins">{textOf(section, "cta") || ui.viewAll}</AmbientLink>
            </SceneReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
