"use client";

import type { PublicHomepageSection, PublicService } from "@/lib/platform";
import { textOf } from "@/lib/platform";
import { experienceUi } from "@/lib/i18n/ui-experience";
import { LocalLink } from "@/lib/i18n/language-context";

import { useAmbienceScene } from "./Ambience";
import { SceneReveal } from "./motion";
import { Chapter, ParallaxImage, SceneBody } from "./parts";

/**
 * Scene 6 — Golden hour: the ship's experiences (dining, wellness, decks …) in
 * warm light. Services and imagery come from the database.
 */
export function SceneGolden({
  section,
  services,
  shipName,
  lang,
}: {
  section: PublicHomepageSection | undefined;
  services: PublicService[];
  shipName: string;
  lang: string;
}) {
  const ui = experienceUi(lang);
  const ambienceRef = useAmbienceScene<HTMLElement>("golden");
  if (!section || services.length === 0) return null;

  const lead = section.media.cover ?? section.media.all[0] ?? null;

  return (
    <section ref={ambienceRef} className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-16">
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
            <SceneReveal variant="up" delay={260} className="mt-6">
              <SceneBody>{textOf(section, "body")}</SceneBody>
            </SceneReveal>
          </div>

          {lead ? (
            <SceneReveal variant="mask" delay={200} duration={1500} className="lg:col-span-7">
              <ParallaxImage
                src={lead.url}
                alt={lead.alt ?? shipName}
                className="aspect-16/10 w-full"
                strength={80}
              />
            </SceneReveal>
          ) : null}
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const image = s.media.cover ?? s.media.gallery[0] ?? s.media.all[0] ?? null;
            return (
              <SceneReveal key={s.id} variant="up" delay={i * 110} duration={1200}>
                <LocalLink path={`/services/${s.slug}`} className="group block">
                  {image ? (
                    <div className="overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt ?? `${s.name} – ${shipName}`}
                        loading="lazy"
                        decoding="async"
                        className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06] ${
                          i % 3 === 1 ? "aspect-4/5" : "aspect-4/3"
                        }`}
                      />
                    </div>
                  ) : null}
                  <p className="mt-6 text-[0.62rem] font-semibold uppercase tracking-[0.36em] text-chronos-sand-500">
                    {s.category ?? ui.experiences}
                  </p>
                  <h3 className="mt-3 font-display text-2xl leading-tight font-normal text-chronos-sand-900">
                    {s.name}
                  </h3>
                  {s.summary ? (
                    <p className="mt-3 text-sm leading-relaxed font-light text-chronos-sand-700">{s.summary}</p>
                  ) : null}
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.3em] text-chronos-sand-900">
                    {textOf(section, "cta") || ui.viewAll}
                    <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </LocalLink>
              </SceneReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
