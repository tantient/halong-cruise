/**
 * Ambient art direction per time state.
 *
 * Only atmosphere lives here: surface colour, text tone, hairlines, scrims and
 * image treatment. Structure, navigation, typography and product data are
 * identical in every state — the state is felt, never announced.
 */

import type { TimeState } from "./time-of-day";

export interface AmbientTheme {
  /** Page surface. */
  bg: string;
  /** Atmospheric wash painted over the surface (crossfaded between states). */
  wash: string;
  /** Body / heading colours. */
  fg: string;
  muted: string;
  line: string;
  accent: string;
  /** Scrim over full-bleed photography so oversized type stays readable. */
  scrim: string;
  /** Light grading applied to photography to match the hour. */
  imageFilter: string;
  /** Tone of type placed on top of photography. */
  onImage: "light" | "dark";
}

export const AMBIENT: Record<TimeState, AmbientTheme> = {
  morning: {
    bg: "oklch(0.975 0.006 220)",
    wash:
      "radial-gradient(120% 80% at 50% 0%, oklch(0.99 0.012 210 / 0.95) 0%, oklch(0.965 0.008 215 / 0.6) 45%, transparent 100%)",
    fg: "oklch(0.30 0.02 240)",
    muted: "oklch(0.52 0.02 235)",
    line: "oklch(0.30 0.02 240 / 0.16)",
    accent: "oklch(0.62 0.05 225)",
    scrim:
      "linear-gradient(to top, oklch(0.20 0.02 240 / 0.82) 0%, oklch(0.22 0.02 240 / 0.42) 48%, oklch(0.28 0.02 240 / 0.40) 100%), linear-gradient(to right, oklch(0.20 0.02 240 / 0.48) 0%, oklch(0.20 0.02 240 / 0.10) 62%, transparent 100%)",
    imageFilter: "saturate(0.92) brightness(1.05) contrast(0.97)",
    onImage: "light",
  },
  day: {
    bg: "oklch(0.985 0.003 200)",
    wash:
      "radial-gradient(120% 90% at 70% 0%, oklch(1 0 0 / 0.9) 0%, oklch(0.96 0.012 205 / 0.55) 50%, transparent 100%)",
    fg: "oklch(0.24 0.02 250)",
    muted: "oklch(0.48 0.02 245)",
    line: "oklch(0.24 0.02 250 / 0.16)",
    accent: "oklch(0.55 0.08 235)",
    scrim:
      "linear-gradient(to top, oklch(0.16 0.02 250 / 0.80) 0%, oklch(0.18 0.02 250 / 0.36) 52%, oklch(0.20 0.02 250 / 0.34) 100%), linear-gradient(to right, oklch(0.16 0.02 250 / 0.46) 0%, oklch(0.16 0.02 250 / 0.08) 62%, transparent 100%)",
    imageFilter: "saturate(1.05) brightness(1.02) contrast(1.03)",
    onImage: "light",
  },
  golden: {
    bg: "oklch(0.955 0.022 78)",
    wash:
      "radial-gradient(130% 95% at 50% 100%, oklch(0.90 0.075 68 / 0.75) 0%, oklch(0.95 0.03 80 / 0.5) 45%, transparent 100%)",
    fg: "oklch(0.28 0.03 55)",
    muted: "oklch(0.50 0.035 60)",
    line: "oklch(0.28 0.03 55 / 0.18)",
    accent: "oklch(0.66 0.10 62)",
    scrim:
      "linear-gradient(to top, oklch(0.20 0.03 50 / 0.82) 0%, oklch(0.26 0.04 55 / 0.34) 50%, oklch(0.28 0.05 60 / 0.36) 100%), linear-gradient(to right, oklch(0.20 0.03 50 / 0.44) 0%, oklch(0.20 0.03 50 / 0.08) 62%, transparent 100%)",
    imageFilter: "saturate(1.08) brightness(1.02) contrast(1.02)",
    onImage: "light",
  },
  night: {
    bg: "oklch(0.16 0.018 260)",
    wash:
      "radial-gradient(130% 95% at 50% 12%, oklch(0.30 0.03 60 / 0.5) 0%, oklch(0.18 0.02 260 / 0.75) 45%, oklch(0.13 0.015 265 / 0.95) 100%)",
    fg: "oklch(0.94 0.012 90)",
    muted: "oklch(0.74 0.015 90)",
    line: "oklch(0.94 0.012 90 / 0.18)",
    accent: "oklch(0.82 0.075 88)",
    scrim:
      "linear-gradient(to top, oklch(0.10 0.015 265 / 0.90) 0%, oklch(0.12 0.015 265 / 0.56) 50%, oklch(0.12 0.015 265 / 0.66) 100%), linear-gradient(to right, oklch(0.10 0.015 265 / 0.50) 0%, oklch(0.10 0.015 265 / 0.12) 62%, transparent 100%)",
    imageFilter: "saturate(0.95) brightness(0.82) contrast(1.06)",
    onImage: "light",
  },
};

/** CSS custom properties for a state, applied once at the top of the page. */
export function ambientVars(state: TimeState): Record<string, string> {
  const t = AMBIENT[state];
  return {
    "--amb-bg": t.bg,
    "--amb-fg": t.fg,
    "--amb-muted": t.muted,
    "--amb-line": t.line,
    "--amb-accent": t.accent,
    "--amb-scrim": t.scrim,
    "--amb-img": t.imageFilter,
  };
}
