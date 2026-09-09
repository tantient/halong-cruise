"use client";

import { sectionOfType, type EntityMedia, type MediaItem, type PublicHomepageBundle } from "@/lib/platform";
import type { PublicHomepageLanguageData } from "@/lib/platform";
import type { Lang, Translations } from "@/lib/translations";
import { AmbientPreviewBar } from "@/lib/experience/AmbientPreviewBar";
import { AmbientSurface, TimeOfDayProvider } from "@/lib/experience/time-context";

import { Header } from "../../Header";
import { Footer } from "../../Footer";

import { ChapterArrival } from "./ChapterArrival";
import { ChapterJourney } from "./ChapterJourney";
import { ChapterLife } from "./ChapterLife";
import { ChapterSignature } from "./ChapterSignature";
import { ChapterFinal } from "./ChapterFinal";

const JOURNEY_ID = "journey";

function heroFallback(items: MediaItem[]): EntityMedia {
  return { cover: items[0] ?? null, hero: items, gallery: [], floorplan: [], all: items };
}

/**
 * "Living with time" homepage: five chapters wrapped in an ambient time layer.
 * Time of day sets the atmosphere, scroll tells the story. Structure,
 * navigation and product data are identical in every state.
 */
export function ExperienceHomeV2({
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
  const { homepage, cabins, itineraries, services } = data;
  const s = homepage.sections;

  const arrival = sectionOfType(s, "v2_arrival") ?? sectionOfType(s, "exp_opening") ?? sectionOfType(s, "hero");
  const journey = sectionOfType(s, "v2_journey");
  const life = sectionOfType(s, "v2_life");
  const signature = sectionOfType(s, "v2_signature");
  const final = sectionOfType(s, "v2_final") ?? sectionOfType(s, "exp_final");

  const arrivalSection =
    arrival && arrival.media.all.length > 0
      ? arrival
      : arrival
        ? { ...arrival, media: heroFallback(homepage.hero) }
        : undefined;

  return (
    <TimeOfDayProvider>
      <AmbientSurface>
        <Header lang={lang} setLang={setLang} t={t} />
        <main>
          <ChapterArrival section={arrivalSection} shipName={shipName} lang={lang} nextId={JOURNEY_ID} />
          <ChapterJourney
            id={JOURNEY_ID}
            section={journey}
            itineraries={itineraries}
            shipName={shipName}
            lang={lang}
          />
          <ChapterLife section={life} cabins={cabins} services={services} lang={lang} />
          <ChapterSignature section={signature} shipName={shipName} />
          <ChapterFinal
            section={final}
            shipName={shipName}
            primaryPath="/itineraries"
            secondaryPath="/contact"
          />
        </main>
        <Footer t={t} />
        <AmbientPreviewBar />
      </AmbientSurface>
    </TimeOfDayProvider>
  );
}
