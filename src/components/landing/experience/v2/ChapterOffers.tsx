"use client";

import { useTimeState } from "@/lib/experience/time-context";
import { experienceUi } from "@/lib/i18n/ui-experience";
import { LocalLink } from "@/lib/i18n/language-context";
import { textOf, type PublicHomepageSection, type PublicOffer } from "@/lib/platform";

import { SceneReveal } from "../motion";
import { AmbientLink, Body, Eyebrow, stateText } from "./parts";

/**
 * Chapter — Offers. A restrained editorial preview of the ship's active offers.
 * Copy, badge and value text come from the `offers` rows; terms stay on the
 * offers page, so nothing commercial is restated or invented here.
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
  if (!section || offers.length === 0) return null;
  const list = offers.slice(0, 3);

  return (
    <section className="relative py-20 sm:py-28 lg:py-32">
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

        <ul className="mt-12 border-t sm:mt-16" style={{ borderColor: "var(--amb-line)" }}>
          {list.map((o, i) => (
            <SceneReveal as="li" key={o.id} variant="up" delay={i * 100}>
              <LocalLink
                path="/offers"
                className="group grid gap-3 border-b py-7 transition-opacity duration-500 hover:opacity-70 sm:grid-cols-[minmax(0,0.32fr)_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8 sm:py-8"
                style={{ borderColor: "var(--amb-line)" }}
              >
                <span className="text-[0.64rem] uppercase tracking-[0.34em] text-[color:var(--amb-muted)]">
                  {o.badge || o.valueText || o.offerType}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-2xl leading-snug font-normal text-[color:var(--amb-fg)] sm:text-3xl">
                    {o.name}
                  </span>
                  {o.description ? (
                    <span className="mt-3 block max-w-xl text-sm leading-[1.85] font-light text-[color:var(--amb-muted)]">
                      {o.description}
                    </span>
                  ) : null}
                </span>
                <span aria-hidden className="text-[color:var(--amb-muted)] sm:pl-6">
                  &rarr;
                </span>
              </LocalLink>
            </SceneReveal>
          ))}
        </ul>

        <SceneReveal variant="fade" delay={200} className="mt-10">
          <AmbientLink path="/offers">{textOf(section, "cta") || ui.viewAll}</AmbientLink>
        </SceneReveal>
      </div>
    </section>
  );
}
