"use client";

import { sectionOfType, textOf, type PublicHomepageBundle } from "@/lib/platform";
import type { PublicHomepageLanguageData } from "@/lib/platform";

import { Header } from "../Header";
import { Footer } from "../Footer";
import { QuoteForm } from "../QuoteForm";
import { RecruitTeaser } from "../RecruitTeaser";
import type { Lang, Translations } from "@/lib/translations";

import { AmbienceProvider } from "./Ambience";
import { SceneOpening } from "./SceneOpening";
import { SceneDawn } from "./SceneDawn";
import { SceneShip } from "./SceneShip";
import { SceneSuites } from "./SceneSuites";
import { SceneVoyage } from "./SceneVoyage";
import { SceneGolden } from "./SceneGolden";
import { SceneNight } from "./SceneNight";
import { SceneFinal } from "./SceneFinal";

/**
 * "A Journey Through Time" homepage template: one day aboard the ship told as
 * eight scenes. All copy, imagery, cabins, voyages and experiences come from the
 * ship's own records; only generic interface words come from translation files.
 */
export function ExperienceHome({
  bundle,
  data,
  lang,
  setLang,
  t,
}: {
  bundle: PublicHomepageBundle;
  data: PublicHomepageLanguageData;
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}) {
  const shipName = bundle.ship.ship.displayName;
  const { homepage, jobs, cabins, itineraries, services } = data;
  const s = homepage.sections;

  const opening = sectionOfType(s, "exp_opening") ?? sectionOfType(s, "hero");
  const recruit = sectionOfType(s, "recruit_teaser");
  const recruitCover = recruit?.media.cover ?? recruit?.media.all[0] ?? null;
  const quote = sectionOfType(s, "quote_form");

  return (
    <AmbienceProvider>
      <div className="min-h-screen">
        <Header lang={lang} setLang={setLang} t={t} />
        <main>
          <SceneOpening
            section={opening}
            slides={homepage.hero}
            shipName={shipName}
            lang={lang}
          />
          <SceneDawn section={sectionOfType(s, "exp_dawn")} shipName={shipName} />
          <SceneShip
            section={sectionOfType(s, "exp_ship")}
            shipName={shipName}
            lang={lang}
            facts={{
              suites: bundle.ship.ship.totalCabins ?? null,
              categories: cabins.length,
              voyages: itineraries.length,
              experiences: services.length,
            }}
          />
          <SceneSuites section={sectionOfType(s, "exp_suites")} cabins={cabins} shipName={shipName} lang={lang} />
          <SceneVoyage
            section={sectionOfType(s, "exp_voyage")}
            itineraries={itineraries}
            shipName={shipName}
            lang={lang}
          />
          <SceneGolden
            section={sectionOfType(s, "exp_golden")}
            services={services}
            shipName={shipName}
            lang={lang}
          />
          <SceneNight section={sectionOfType(s, "exp_night")} shipName={shipName} />
          <SceneFinal section={sectionOfType(s, "exp_final")} shipName={shipName} quoteHref="#quote" />

          {recruit ? (
            <RecruitTeaser
              lang={lang}
              t={t}
              jobs={jobs}
              image={recruitCover ? { url: recruitCover.url, alt: recruitCover.alt ?? shipName } : null}
              content={{
                title: textOf(recruit, "title"),
                titleAccent: textOf(recruit, "title_accent"),
                subtitle: textOf(recruit, "subtitle"),
                cta: textOf(recruit, "cta"),
              }}
            />
          ) : null}

          {quote ? (
            <QuoteForm
              t={t}
              content={{
                label: textOf(quote, "label"),
                title: textOf(quote, "title"),
                subtitle: textOf(quote, "subtitle"),
              }}
            />
          ) : null}
        </main>
        <Footer t={t} />
      </div>
    </AmbienceProvider>
  );
}
