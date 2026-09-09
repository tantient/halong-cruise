"use client";

import { useEffect, useRef, useState } from "react";

import type { EntityMedia } from "@/lib/platform";
import { stateImage } from "./ambient-media";
import { useTimeState } from "./time-context";
import { TIME_STATES, type TimeState } from "./time-of-day";

/**
 * Full-bleed photography that changes with the hour. Only the states the
 * visitor has actually seen are mounted, so a page load fetches one image and
 * a boundary (or a preview switch) crossfades instead of cutting.
 */
export function AmbientImage({
  media,
  alt,
  priority = false,
  className = "",
  scrim = true,
  zoom = false,
}: {
  media: EntityMedia | undefined;
  alt: string;
  priority?: boolean;
  className?: string;
  scrim?: boolean;
  zoom?: boolean;
}) {
  const state = useTimeState();
  const visited = useVisitedStates(state);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {TIME_STATES.filter((s) => visited.has(s)).map((s) => {
        const image = stateImage(media, s);
        if (!image) return null;
        return (
          <img
            key={s}
            src={image.url}
            alt={s === state ? (image.alt ?? alt) : ""}
            aria-hidden={s === state ? undefined : true}
            loading={priority && s === state ? "eager" : "lazy"}
            fetchPriority={priority && s === state ? "high" : "auto"}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-out ${
              zoom ? "ambient-zoom" : ""
            }`}
            style={{ opacity: s === state ? 1 : 0, filter: "var(--amb-img)" }}
          />
        );
      })}
      {scrim ? (
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
