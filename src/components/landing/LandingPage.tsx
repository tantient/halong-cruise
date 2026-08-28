"use client";

import { Header } from "./Header";
import { Hero } from "./Hero";
import { RecruitTeaser } from "./RecruitTeaser";
import { Gallery } from "./Gallery";
import { QuoteForm } from "./QuoteForm";
import { Footer } from "./Footer";
import { useLanguage } from "./use-language";

export function LandingPage() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-chronos-ivory">
      <Header lang={lang} setLang={setLang} t={t} />
      <main>
        <Hero t={t} />
        <RecruitTeaser lang={lang} t={t} />
        <Gallery t={t} />
        <QuoteForm t={t} />
      </main>
      <Footer t={t} />
    </div>
  );
}
