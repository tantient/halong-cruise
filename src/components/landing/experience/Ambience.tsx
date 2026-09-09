"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/** Time-of-day ambience the page is currently in. */
export type Ambience = "dawn" | "day" | "golden" | "night";

const TONES: Record<Ambience, string> = {
  dawn: "color-mix(in oklab, var(--chronos-ivory) 84%, var(--chronos-gold) 16%)",
  day: "var(--chronos-ivory)",
  golden: "color-mix(in oklab, var(--chronos-gold) 34%, var(--chronos-ivory) 66%)",
  night: "color-mix(in oklab, var(--chronos-ink) 92%, var(--chronos-navy) 8%)",
};

const AmbienceContext = createContext<((tone: Ambience) => void) | null>(null);

/**
 * Full-page ambience layer. Scenes announce their time of day while they own the
 * viewport, and the page background crossfades Dawn → Day → Golden → Night.
 */
export function AmbienceProvider({ children }: { children: ReactNode }) {
  const [tone, setTone] = useState<Ambience>("dawn");
  return (
    <AmbienceContext.Provider value={setTone}>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 transition-[background-color] duration-[1800ms] ease-out"
        style={{ backgroundColor: TONES[tone] }}
      />
      {children}
    </AmbienceContext.Provider>
  );
}

/**
 * Marks a scene as owning a time of day. Attach the returned ref to the scene
 * root; the ambience switches when the scene crosses the middle of the screen.
 */
export function useAmbienceScene<T extends HTMLElement>(tone: Ambience) {
  const setTone = useContext(AmbienceContext);
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !setTone || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setTone(tone);
      },
      // A band across the middle of the viewport: only one scene owns it.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [setTone, tone]);

  return ref;
}
