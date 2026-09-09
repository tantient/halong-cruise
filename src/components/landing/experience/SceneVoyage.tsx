"use client";

import type { PublicHomepageSection, PublicItinerary } from "@/lib/platform";
import { textOf } from "@/lib/platform";
import { experienceUi } from "@/lib/i18n/ui-experience";
import { LocalLink } from "@/lib/i18n/language-context";

import { useAmbienceScene } from "./Ambience";
import { SceneReveal } from "./motion";
import { Chapter, ParallaxImage, SceneBody } from "./parts";

/**
 * Scene 5 — The Voyage: the itineraries of the ship drawn as a journey along a
 * single thread instead of a tour table.
 */
export function SceneVoyage({
  section,
  itineraries,
  shipName,
  lang,
}: {
  section: PublicHomepageSection | undefined;
  itineraries: PublicItinerary[];
  shipName: string;
  lang: string;
}) {
  const ui = experienceUi(lang);
  const ambienceRef = useAmbienceScene<HTMLElement>("day");
  if (!section || itineraries.length === 0) return null;

  const fallback = section.media.cover ?? section.media.all[0] ?? null;

  const duration = (it: PublicItinerary) => {
    const parts: string[] = [];
    if (it.days) parts.push(`${it.days} ${it.days > 1 ? ui.days : ui.day}`);
    if (it.nights) parts.push(`${it.nights} ${it.nights > 1 ? ui.nights : ui.night}`);
    return parts.join(" · ");
  };

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

        <ol className="relative mt-16 space-y-16 sm:space-y-24">
          {/* The thread the voyage travels along. */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-chronos-sand-500/60 via-chronos-sand-500/25 to-transparent sm:left-[9px]"
          />
          {itineraries.map((it, i) => {
            const image = it.media.cover ?? it.media.gallery[0] ?? it.media.all[0] ?? fallback;
            return (
              <li key={it.id} className="relative pl-10 sm:pl-16">
                <SceneReveal variant="fade" delay={60}>
                  <span
                    aria-hidden
                    className="absolute left-0 top-2 grid h-4 w-4 place-items-center rounded-full border border-chronos-sand-500/60 bg-chronos-ivory sm:h-5 sm:w-5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-chronos-gold" />
                  </span>
                </SceneReveal>

                <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
                  <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    {image ? (
                      <SceneReveal variant={i % 2 === 1 ? "wipe" : "mask"} duration={1400}>
                        <ParallaxImage
                          src={image.url}
                          alt={image.alt ?? `${it.name} – ${shipName}`}
                          className="aspect-16/10 w-full"
                          strength={70}
                        />
                      </SceneReveal>
                    ) : null}
                  </div>

                  <div className="lg:col-span-5">
                    <SceneReveal variant="up" delay={140}>
                      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.36em] text-chronos-sand-500">
                        {duration(it)}
                      </p>
                      <h3 className="mt-4 font-display text-2xl leading-tight font-normal text-chronos-sand-900 sm:text-3xl lg:text-4xl">
                        {it.name}
                      </h3>
                      {it.summary ? (
                        <p className="mt-4 text-sm leading-relaxed font-light text-chronos-sand-700">{it.summary}</p>
                      ) : null}
                      {it.departurePoint ? (
                        <p className="mt-5 text-xs tracking-wide text-chronos-sand-500">{it.departurePoint}</p>
                      ) : null}
                      <LocalLink
                        path={`/itineraries/${it.slug}`}
                        className="group mt-7 inline-flex items-center gap-3 border-b border-chronos-sand-500/50 pb-1 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-chronos-sand-900 transition-colors duration-500 hover:border-chronos-sand-900"
                      >
                        {textOf(section, "cta") || ui.viewAll}
                        <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                      </LocalLink>
                    </SceneReveal>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
