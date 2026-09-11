"use client";

import { useState } from "react";

import { AmbientStage } from "@/lib/experience/AmbientStage";
import { useTimeState } from "@/lib/experience/time-context";
import { experienceUi } from "@/lib/i18n/ui-experience";
import { LocalLink } from "@/lib/i18n/language-context";
import { textOf, type EntityMedia, type PublicHomepageSection, type PublicOffer } from "@/lib/platform";

import { SceneReveal } from "../motion";
import { AmbientLink, Body, Eyebrow, stateText } from "./parts";

/** First media group that actually carries an image: section first, then offers. */
function anchorMedia(section: PublicHomepageSection, offers: PublicOffer[]): EntityMedia | undefined {
  if (section.media.all.length > 0) return section.media;
  return offers.find((o) => o.media.all.length > 0)?.media;
}

/**
 * Chapter — Offers. One editorial image anchors the chapter and the ship's
 * active offers read as a quiet index beside it. Names and descriptions come
 * from the `offers` rows; terms stay on the offers page.
 */
export function ChapterOffers({
  section,
  offers,
  lang,
}: {
  section: PublicHomepageSection | undefined;
  offers: PublicOffer[];
  lang: string;
}) {
  const ui = experienceUi(lang);
  const state = useTimeState();
  const [focus, setFocus] = useState(0);
  if (!section || offers.length === 0) return null;

  const list = offers.slice(0, 3);
  const index = Math.min(focus, list.length - 1);
  const media = anchorMedia(section, list);
  const stage = list[index]?.media.all.length ? list[index]!.media : media;

  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
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

        <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-16">
          {stage ? (
            <SceneReveal variant="mask">
              <div className="relative aspect-[4/5] w-full overflow-hidden lg:aspect-[3/4]">
                <AmbientStage media={stage} alt={list[index]?.name ?? textOf(section, "title")} scrim={false} />
              </div>
            </SceneReveal>
          ) : null}

          <div className="lg:pt-2">
            <ol className="border-t" style={{ borderColor: "var(--amb-line)" }}>
              {list.map((o, i) => (
                <SceneReveal as="li" key={o.id} variant="up" delay={i * 100}>
                  <LocalLink
                    path="/offers"
                    onMouseEnter={() => setFocus(i)}
                    onFocus={() => setFocus(i)}
                    aria-current={i === index}
                    className="group block border-b py-7 transition-opacity duration-500 sm:py-8"
                    style={{ borderColor: "var(--amb-line)", opacity: i === index ? 1 : 0.62 }}
                  >
                    <span className="flex items-baseline gap-5">
                      <span className="font-display text-sm italic text-[color:var(--amb-muted)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-2xl leading-snug font-normal text-[color:var(--amb-fg)] sm:text-3xl">
                          {o.name}
                        </span>
                        {o.description ? (
                          <span className="mt-3 block max-w-md text-sm leading-[1.85] font-light text-[color:var(--amb-muted)]">
                            {o.description}
                          </span>
                        ) : null}
                      </span>
                      <span aria-hidden className="text-[color:var(--amb-muted)]">
                        &rarr;
                      </span>
                    </span>
                  </LocalLink>
                </SceneReveal>
              ))}
            </ol>

            <SceneReveal variant="fade" delay={200} className="mt-10">
              <AmbientLink path="/offers">{textOf(section, "cta") || ui.viewAll}</AmbientLink>
            </SceneReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
