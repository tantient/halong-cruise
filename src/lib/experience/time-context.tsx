"use client";

/**
 * Ambient time layer: resolves the current time state, keeps it live while the
 * page is open, and exposes a development-only override so all four states can
 * be reviewed without waiting for the hour.
 *
 * Architecture: Time State → Ambient Layer → Experience Components. Nothing
 * here knows which ship or brand it is rendering, so any tenant can adopt it,
 * and a future season/campaign layer can wrap or replace the resolver.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "@tanstack/react-router";

import { ambientVars, AMBIENT } from "./ambient-theme";
import {
  isTimeState,
  msUntilNextBand,
  resolveTimeState,
  TIME_OF_DAY,
  TIME_STATES,
  type TimeOfDayConfig,
  type TimeState,
} from "./time-of-day";

interface TimeContextValue {
  state: TimeState;
  /** True when the state follows the real clock. */
  auto: boolean;
  /** Development/preview only: force a state, or `null` to follow the clock. */
  setOverride: (state: TimeState | null) => void;
  /** True only in development/preview environments. */
  previewEnabled: boolean;
  config: TimeOfDayConfig;
}

const TimeContext = createContext<TimeContextValue | null>(null);

const STORAGE_KEY = "experience.timeState";
const PARAM = "time";

/**
 * The query string as the page was opened. Captured at module load because the
 * router may normalise the URL before our effect runs, which would otherwise
 * drop `?time=…` intermittently.
 */
const INITIAL_SEARCH = typeof window === "undefined" ? "" : window.location.search;

function previewAllowed(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host.includes("-preview--");
}

export function TimeOfDayProvider({
  children,
  config = TIME_OF_DAY,
}: {
  children: ReactNode;
  config?: TimeOfDayConfig;
}) {
  // Server and client both resolve from the real clock, so first paint matches.
  const [clockState, setClockState] = useState<TimeState>(() => resolveTimeState(new Date(), config));
  const [override, setOverrideState] = useState<TimeState | null>(null);
  const [previewEnabled, setPreviewEnabled] = useState(false);

  // Override is read after hydration only (URL ?time=… or the last choice).
  // Reacting to the router's own search string avoids racing URL normalisation.
  const searchStr = useLocation({ select: (l) => l.searchStr ?? "" });
  useEffect(() => {
    const allowed = previewAllowed();
    setPreviewEnabled(allowed);
    if (!allowed) return;
    const param =
      new URLSearchParams(searchStr).get(PARAM) ??
      new URLSearchParams(window.location.search).get(PARAM) ??
      new URLSearchParams(INITIAL_SEARCH).get(PARAM);
    if (isTimeState(param)) {
      setOverrideState(param);
      window.localStorage.setItem(STORAGE_KEY, param);
      return;
    }
    if (param === "auto") {
      setOverrideState(null);
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isTimeState(stored)) setOverrideState(stored);
  }, [searchStr]);

  // Keep the clock state live: re-check exactly at the next band boundary.
  useEffect(() => {
    let timer: number | undefined;
    const tick = () => {
      setClockState(resolveTimeState(new Date(), config));
      timer = window.setTimeout(tick, msUntilNextBand(new Date(), config));
    };
    setClockState(resolveTimeState(new Date(), config));
    timer = window.setTimeout(tick, msUntilNextBand(new Date(), config));
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [config]);

  const setOverride = useCallback((next: TimeState | null) => {
    setOverrideState(next);
    if (typeof window === "undefined") return;
    if (next) window.localStorage.setItem(STORAGE_KEY, next);
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const state = override ?? clockState;
  const value = useMemo<TimeContextValue>(
    () => ({ state, auto: override === null, setOverride, previewEnabled, config }),
    [state, override, setOverride, previewEnabled, config],
  );

  return <TimeContext.Provider value={value}>{children}</TimeContext.Provider>;
}

export function useTimeOfDay(): TimeContextValue {
  const ctx = useContext(TimeContext);
  if (!ctx) throw new Error("useTimeOfDay must be used inside <TimeOfDayProvider>");
  return ctx;
}

/** Just the state, for components that only need the art direction. */
export function useTimeState(): TimeState {
  return useTimeOfDay().state;
}

/**
 * Surface + atmosphere for the current state. The washes are stacked and
 * crossfaded so a boundary crossed while reading is a slow change of light,
 * never a reload.
 */
export function AmbientSurface({ children }: { children: ReactNode }) {
  const { state } = useTimeOfDay();
  return (
    <div
      className="relative min-h-screen transition-[background-color] duration-[2000ms] ease-out"
      style={{ ...ambientVars(state), backgroundColor: "var(--amb-bg)", color: "var(--amb-fg)" }}
      data-ambient={state}
    >
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        {TIME_STATES.map((s) => (
          <div
            key={s}
            className="absolute inset-0 transition-opacity duration-[2000ms] ease-out"
            style={{ background: AMBIENT[s].wash, opacity: s === state ? 1 : 0 }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}
