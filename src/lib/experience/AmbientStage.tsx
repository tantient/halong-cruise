"use client";

import { useEffect, useRef, useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import type { EntityMedia } from "@/lib/platform";

import { resolveMediaSlot, type Viewport } from "./media-slot";
import { useTimeState } from "./time-context";
import { TIME_STATES, type TimeState } from "./time-of-day";

/**
 * The one visual stage of the experience layer.
 *
 * It takes a media slot (desktop/mobile image, desktop/mobile video, poster,
 * optional per-time-state variant) and renders whatever the database provides,
 * crossfading between the time states the visitor has actually seen. Video is
 * used only when the slot has one, the viewport matches and motion is allowed;
 * otherwise the poster/still image is shown. Swapping temporary assets for
 * production photography or film needs no change here.
 */
export function AmbientStage({
  media,
  alt,
  priority = false,
  className = "",
  scrim = true,
  zoom = false,
  raw = false,
}: {
  media: EntityMedia | undefined;
  alt: string;
  priority?: boolean;
  className?: string;
  scrim?: boolean;
  zoom?: boolean;
  /** Render source media without time-of-day colour grading. */
  raw?: boolean;
}) {
  const state = useTimeState();
  const visited = useVisitedStates(state);
  const isMobile = useIsMobile();
  const viewport: Viewport = isMobile ? "mobile" : "desktop";
  const allowMotion = usePrefersMotion();

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {TIME_STATES.filter((s) => visited.has(s)).map((s) => {
        const slot = resolveMediaSlot(media, s, viewport);
        const active = s === state;
        const still = slot.image ?? slot.poster;
        const useVideo = Boolean(slot.video) && allowMotion;
        if (!still && !useVideo) return null;
        return (
          <div
            key={s}
            aria-hidden={active ? undefined : true}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-out"
            style={{ opacity: active ? 1 : 0 }}
          >
            {still ? (
              <img
                src={still.url}
                alt={active && !useVideo ? (still.alt ?? alt) : ""}
                aria-hidden={active && !useVideo ? undefined : true}
                loading={priority && active ? "eager" : "lazy"}
                fetchPriority={priority && active ? "high" : "auto"}
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover ${zoom && !useVideo ? "ambient-zoom" : ""}`}
                style={{ opacity: 1, filter: raw ? "none" : "var(--amb-img)" }}
              />
            ) : null}
            {useVideo && slot.video ? (
              <video
                src={slot.video.url}
                poster={slot.poster?.url}
                muted
                loop
                playsInline
                autoPlay={active}
                preload={active && priority ? "auto" : "metadata"}
                aria-label={active ? (slot.video.alt ?? alt) : undefined}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ opacity: 1, filter: raw ? "none" : "var(--amb-img)" }}
              />
            ) : null}
          </div>
        );
      })}
      {scrim && !raw ? (
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[1600ms]"
          style={{ background: "var(--amb-scrim)" }}
        />
      ) : null}
    </div>
  );
}

/** Remembers which states have been rendered, so crossfades have both layers. */
export function useVisitedStates(state: TimeState) {
  const [visited, setVisited] = useState<Set<TimeState>>(() => new Set([state]));
  const ref = useRef(visited);
  useEffect(() => {
    if (ref.current.has(state)) return;
    const next = new Set(ref.current);
    next.add(state);
    ref.current = next;
    setVisited(next);
  }, [state]);
  return visited;
}

/** False when the visitor asked for reduced motion. */
export function usePrefersMotion() {
  const [allow, setAllow] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAllow(!mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);
  return allow;
}
