"use client";

import { useTimeOfDay } from "./time-context";
import { TIME_STATES } from "./time-of-day";

/**
 * Development/preview only control to review every ambient state without
 * waiting for the hour. It never renders on a production domain.
 */
export function AmbientPreviewBar() {
  const { state, auto, setOverride, previewEnabled } = useTimeOfDay();
  if (!previewEnabled) return null;

  const options = [{ key: "auto" as const, label: "Auto" }, ...TIME_STATES.map((s) => ({ key: s, label: s }))];

  return (
    <div className="fixed bottom-4 left-4 z-[60] flex items-center gap-1 rounded-full border border-white/15 bg-black/70 px-1.5 py-1 text-[0.6rem] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
      <span className="px-2 text-white/40">preview</span>
      {options.map((o) => {
        const active = o.key === "auto" ? auto : !auto && state === o.key;
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => setOverride(o.key === "auto" ? null : o.key)}
            className={`rounded-full px-2.5 py-1 transition-colors ${
              active ? "bg-white text-black" : "hover:text-white"
            }`}
          >
            {o.label}
          </button>
        );
      })}
      {auto ? <span className="px-2 text-white/40">{state}</span> : null}
    </div>
  );
}
