/**
 * Time-of-day configuration for the ambient experience layer.
 *
 * One central place decides which ambient state the site is in. Components
 * never contain hour numbers or timezone names; they ask for the resolved
 * state. Seasonal / sunset-driven bands (and, later, season or campaign
 * layers) can be introduced by producing a different `TimeOfDayConfig`
 * without touching a single component.
 */

export const TIME_STATES = ["morning", "day", "golden", "night"] as const;

export type TimeState = (typeof TIME_STATES)[number];

/** A band starts at `start` (local `HH:MM` in the config timezone) and runs to the next band. */
export interface TimeBand {
  state: TimeState;
  start: string;
}

export interface TimeOfDayConfig {
  /** IANA timezone the experience lives in (the bay, not the visitor). */
  timeZone: string;
  /** Bands in ascending order of start time; the last band wraps past midnight. */
  bands: TimeBand[];
}

/** Default configuration: Ha Long Bay local time. */
export const TIME_OF_DAY: TimeOfDayConfig = {
  timeZone: "Asia/Ho_Chi_Minh",
  bands: [
    { state: "morning", start: "05:00" },
    { state: "day", start: "11:00" },
    { state: "golden", start: "16:30" },
    { state: "night", start: "19:00" },
  ],
};

export function isTimeState(value: unknown): value is TimeState {
  return typeof value === "string" && (TIME_STATES as readonly string[]).includes(value);
}

function toMinutes(hhmm: string): number {
  const [h = "0", m = "0"] = hhmm.split(":");
  return Number(h) * 60 + Number(m);
}

/** Minutes since midnight in the configured timezone. */
export function minutesInZone(date: Date, config: TimeOfDayConfig = TIME_OF_DAY): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: config.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const hour = get("hour") % 24;
  return hour * 60 + get("minute") + get("second") / 60;
}

function sortedBands(config: TimeOfDayConfig) {
  return [...config.bands]
    .map((b) => ({ ...b, minutes: toMinutes(b.start) }))
    .sort((a, b) => a.minutes - b.minutes);
}

/** Ambient state for a moment in time (defaults to now). */
export function resolveTimeState(date: Date = new Date(), config: TimeOfDayConfig = TIME_OF_DAY): TimeState {
  const bands = sortedBands(config);
  if (bands.length === 0) return "day";
  const now = minutesInZone(date, config);
  let current = bands[bands.length - 1]!.state; // before the first band: the wrapping band
  for (const band of bands) if (now >= band.minutes) current = band.state;
  return current;
}

/** Milliseconds until the next band boundary, so the page can crossfade in place. */
export function msUntilNextBand(date: Date = new Date(), config: TimeOfDayConfig = TIME_OF_DAY): number {
  const bands = sortedBands(config);
  if (bands.length === 0) return 60 * 60 * 1000;
  const now = minutesInZone(date, config);
  const next = bands.find((b) => b.minutes > now)?.minutes ?? bands[0]!.minutes + 24 * 60;
  return Math.max(1000, Math.round((next - now) * 60 * 1000) + 1000);
}
