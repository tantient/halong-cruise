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
    bg: "oklch(0.985 0.006 210)",
    wash:
      "radial-gradient(120% 75% at 50% 0%, oklch(1 0.006 205 / 0.38) 0%, transparent 66%)",
    fg: "oklch(0.22 0.025 240)",
    muted: "oklch(0.38 0.022 235)",
    line: "oklch(0.30 0.02 240 / 0.16)",
    accent: "oklch(0.62 0.05 225)",
    scrim:
      "linear-gradient(to top, oklch(0.16 0.02 240 / 0.52) 0%, oklch(0.18 0.02 240 / 0.14) 28%, transparent 58%), linear-gradient(to right, oklch(0.16 0.02 240 / 0.16) 0%, transparent 52%)",
    imageFilter: "saturate(1.03) brightness(1.03) contrast(1.01)",
    onImage: "light",
  },
  day: {
    bg: "oklch(0.99 0.003 200)",
    wash:
      "radial-gradient(120% 80% at 70% 0%, oklch(0.97 0.018 205 / 0.35) 0%, transparent 68%)",
    fg: "oklch(0.20 0.025 250)",
    muted: "oklch(0.36 0.022 245)",
    line: "oklch(0.24 0.02 250 / 0.16)",
    accent: "oklch(0.55 0.08 235)",
    scrim:
      "linear-gradient(to top, oklch(0.14 0.02 250 / 0.50) 0%, oklch(0.16 0.02 250 / 0.12) 28%, transparent 58%), linear-gradient(to right, oklch(0.14 0.02 250 / 0.14) 0%, transparent 52%)",
    imageFilter: "saturate(1.04) brightness(1.04) contrast(1.02)",
    onImage: "light",
  },
  golden: {
    bg: "oklch(0.975 0.012 82)",
    wash:
      "radial-gradient(130% 90% at 50% 100%, oklch(0.90 0.06 70 / 0.22) 0%, transparent 62%)",
    fg: "oklch(0.22 0.028 58)",
    muted: "oklch(0.38 0.026 62)",
    line: "oklch(0.28 0.03 55 / 0.18)",
    accent: "oklch(0.66 0.10 62)",
    scrim:
      "linear-gradient(to top, oklch(0.18 0.03 50 / 0.52) 0%, oklch(0.22 0.03 55 / 0.14) 28%, transparent 58%), linear-gradient(to right, oklch(0.18 0.03 50 / 0.14) 0%, transparent 52%)",
    imageFilter: "saturate(1.05) brightness(1.02) contrast(1.01)",
    onImage: "light",
  },
  night: {
    bg: "oklch(0.955 0.010 250)",
    wash:
      "radial-gradient(120% 85% at 75% 0%, oklch(0.78 0.045 75 / 0.16) 0%, transparent 58%), linear-gradient(to bottom, oklch(0.90 0.025 250 / 0.16), transparent 65%)",
    fg: "oklch(0.20 0.028 250)",
    muted: "oklch(0.38 0.025 245)",
    line: "oklch(0.22 0.025 250 / 0.18)",
    accent: "oklch(0.62 0.075 82)",
    scrim:
      "linear-gradient(to top, oklch(0.10 0.018 260 / 0.58) 0%, oklch(0.12 0.018 260 / 0.18) 30%, transparent 60%), linear-gradient(to right, oklch(0.10 0.018 260 / 0.18) 0%, transparent 52%)",
    imageFilter: "saturate(1.04) brightness(1.01) contrast(1.02)",
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
