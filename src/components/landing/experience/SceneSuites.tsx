"use client";

import type { PublicCabin, PublicHomepageSection } from "@/lib/platform";
import { textOf } from "@/lib/platform";
import { experienceUi } from "@/lib/i18n/ui-experience";
import { LocalLink } from "@/lib/i18n/language-context";

import { useAmbienceScene } from "./Ambience";
import { SceneReveal } from "./motion";
import { Chapter, ParallaxImage, SceneBody } from "./parts";

/**
 * Scene 4 — Day / Suites: immersive, image-led showcase. Every value comes from
 * the cabin records of the current ship.
 */
export function SceneSuites({
  section,
  cabins,
  shipName,
  lang,
}: {
  section: PublicHomepageSection | undefined;
  cabins: PublicCabin[];
  shipName: string;
  lang: string;
}) {
  const ui = experienceUi(lang);
  const ambienceRef = useAmbienceScene<HTMLElement>("day");
  if (!section || cabins.length === 0) return null;

  const fallback = section.media.cover ?? section.media.all[0] ?? null;

  return (
    <section ref={ambienceRef} className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <SceneReveal variant="up">
            <Chapter index={textOf(section, "chapter")} label={textOf(section, "time_label")} />
          </SceneReveal>
          <SceneReveal variant="up" delay={140}>
            <h2 className="mt-8 font-display text-4xl leading-[1.05] font-normal text-chronos-sand-900 sm:text-5xl lg:text-[3.6rem]">
              {textOf(section, "title")}{" "}
              <span className="italic text-chronos-sand-700">{textOf(section, "title_accent")}</span>
            </h2>
          </SceneReveal>
          <SceneReveal variant="up" delay={260} className="mt-6">
            <SceneBody>{textOf(section, "body")}</SceneBody>
          </SceneReveal>
        </div>
      </div>

      <div className="mt-14 space-y-6 sm:space-y-10">
        {cabins.map((cabin, i) => {
          const image = cabin.media.cover ?? cabin.media.gallery[0] ?? cabin.media.all[0] ?? fallback;
          const alignRight = i % 2 === 1;
          const specs = [
            cabin.sizeSqm ? { label: ui.size, value: `${cabin.sizeSqm} m²` } : null,
            cabin.maxGuests ? { label: ui.guests, value: String(cabin.maxGuests) } : null,
          ].filter((x): x is { label: string; value: string } => x !== null);

          return (
            <SceneReveal key={cabin.id} variant="fade" duration={1200}>
              <article className="relative">
                {image ? (
                  <ParallaxImage
                    src={image.url}
                    alt={image.alt ?? `${cabin.name} – ${shipName}`}
                    className="h-[70svh] w-full sm:h-[86svh]"
                    strength={90}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-chronos-ink/92 via-chronos-ink/35 to-chronos-ink/30" />
                  </ParallaxImage>
                ) : null}

                <div
                  className={`absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl px-6 pb-10 lg:px-8 ${
                    alignRight ? "sm:justify-end" : ""
                  }`}
                >
                  <div className="max-w-lg">
                    <SceneReveal variant="up" delay={120}>
                      <p className="text-[0.64rem] font-semibold uppercase tracking-[0.38em] text-chronos-gold-light">
                        {cabin.category ?? ui.suites}
                      </p>
                      <h3 className="mt-4 font-display text-3xl leading-tight font-normal text-chronos-ivory sm:text-4xl lg:text-5xl">
                        {cabin.name}
                      </h3>
                      {cabin.summary ? (
                        <p className="mt-4 max-w-md text-sm font-light leading-relaxed text-chronos-ivory/80">
                          {cabin.summary}
                        </p>
                      ) : null}
                      {specs.length ? (
                        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
                          {specs.map((s) => (
                            <div key={s.label}>
                              <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-chronos-ivory/55">
                                {s.label}
                              </dt>
                              <dd className="mt-1 text-base font-light text-chronos-ivory">{s.value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                      <LocalLink
                        path={`/cabins/${cabin.slug}`}
                        className="group mt-8 inline-flex items-center gap-3 border-b border-chronos-ivory/40 pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-chronos-ivory transition-colors duration-500 hover:border-chronos-gold-light hover:text-chronos-gold-light"
                      >
                        {textOf(section, "cta") || ui.viewAll}
                        <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                      </LocalLink>
                    </SceneReveal>
                  </div>
                </div>
              </article>
            </SceneReveal>
          );
        })}
      </div>
    </section>
  );
}
