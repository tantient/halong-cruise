"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeroMedia, type HeroSlide } from "./HeroMedia";
import { Reveal } from "./Reveal";

/** Ship-specific copy (from the database, already localized). */
export interface HeroContent {
  tagline: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  cta: string;
}

interface HeroProps {
  content: HeroContent;
  slides: HeroSlide[];
  /** Shared UI labels (platform translation files). */
  t: {
    hero: {
      scroll: string;
    };
    earlyAccess: {
      contact: string;
      contactPlaceholder: string;
      submit: string;
      success: string;
    };
  };
}

export function Hero({ content, slides, t }: HeroProps) {
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    toast.success(t.earlyAccess.success);
    setSubmitted(true);
    setContact("");
  };

  return (
    <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <HeroMedia slides={slides} intervalMs={7000} />
      <div className="pointer-events-none absolute inset-0 bg-black/30" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, transparent 40%, transparent 60%, var(--color-chronos-ivory) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center lg:px-8">
        <Reveal immediate delay={100}>
          <span className="mb-6 inline-block text-xs font-semibold uppercase tracking-[0.5em] text-chronos-sand-300 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            {content.tagline}
          </span>
        </Reveal>
        <Reveal immediate delay={260}>
          <h1 className="mb-8 text-5xl font-normal tracking-tight text-white drop-shadow-xl sm:text-6xl md:text-7xl lg:text-8xl font-display">
            {content.title} <span className="font-display italic text-chronos-sand-300">{content.titleAccent}</span>
          </h1>
        </Reveal>
        <Reveal immediate delay={420}>
          <p className="mx-auto mb-12 max-w-2xl text-base font-light leading-relaxed text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.75)]">
            {content.subtitle}
          </p>
        </Reveal>

        {!submitted ? (
          <Reveal immediate delay={580} as="form" onSubmit={handleSubmit} className="mx-auto max-w-md">
            <div className="flex flex-col gap-2 rounded-full border border-white/20 bg-white/10 p-1.5 shadow-2xl backdrop-blur-md sm:flex-row">
              <Label htmlFor="early-contact" className="sr-only">
                {t.earlyAccess.contact}
              </Label>
              <Input
                id="early-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={t.earlyAccess.contactPlaceholder}
                required
                className="flex-1 rounded-full border-0 bg-transparent px-6 py-3 text-sm text-white placeholder:text-white/60 focus:bg-white/10 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <button
                type="submit"
                className="rounded-full bg-chronos-sand-500 px-8 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition-all duration-500 hover:bg-chronos-sand-700"
              >
                {content.cta}
              </button>
            </div>
          </Reveal>
        ) : (
          <Reveal
            immediate
            delay={200}
            className="mx-auto max-w-md rounded-full border border-chronos-sand-300/30 bg-white/10 px-8 py-4 backdrop-blur-sm"
          >
            <p className="text-sm text-white">{t.earlyAccess.success}</p>
          </Reveal>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-4">
        <span className="text-xs uppercase tracking-[0.3em] text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
          {t.hero.scroll}
        </span>
        <span className="h-16 w-px bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
