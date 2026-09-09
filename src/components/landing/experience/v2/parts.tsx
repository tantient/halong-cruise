"use client";

import type { ReactNode } from "react";

import { LocalLink } from "@/lib/i18n/language-context";
import { textOf, type PublicHomepageSection } from "@/lib/platform";
import type { TimeState } from "@/lib/experience/time-of-day";

/**
 * Copy for a chapter, with an optional per-state variant. `morning_subtitle`
 * wins over `subtitle` when the page is in the morning state, so editorial
 * microcopy can follow the hour without duplicating a homepage.
 */
export function stateText(
  section: PublicHomepageSection | undefined,
  state: TimeState,
  key: string,
): string {
  return textOf(section, `${state}_${key}`) || textOf(section, key);
}

/** Small uppercase label with a hairline: chapter marker / time note. */
export function Eyebrow({
  index,
  label,
  tone = "ambient",
  className = "",
}: {
  index?: string;
  label?: string;
  tone?: "ambient" | "onImage";
  className?: string;
}) {
  if (!index && !label) return null;
  const color = tone === "onImage" ? "text-white/75" : "text-[color:var(--amb-muted)]";
  const line = tone === "onImage" ? "bg-white/40" : "bg-[color:var(--amb-line)]";
  return (
    <div className={`flex items-center gap-4 ${color} ${className}`}>
      {index ? <span className="font-display text-sm italic">{index}</span> : null}
      <span className={`h-px w-10 ${line}`} />
      {label ? (
        <span className="text-[0.66rem] font-semibold uppercase tracking-[0.42em]">{label}</span>
      ) : null}
    </div>
  );
}

/** Editorial paragraph in the ambient text tone. */
export function Body({
  children,
  tone = "ambient",
  className = "",
}: {
  children: ReactNode;
  tone?: "ambient" | "onImage";
  className?: string;
}) {
  return (
    <p
      className={`max-w-xl text-base leading-[1.85] font-light sm:text-lg ${
        tone === "onImage" ? "text-white/85" : "text-[color:var(--amb-muted)]"
      } ${className}`}
    >
      {children}
    </p>
  );
}

/** Quiet, cinematic link button. */
export function AmbientLink({
  path,
  children,
  tone = "ambient",
  variant = "outline",
}: {
  path: string;
  children: ReactNode;
  tone?: "ambient" | "onImage";
  variant?: "outline" | "solid" | "text";
}) {
  const base =
    "inline-flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.28em] transition-all duration-500";
  const style =
    variant === "text"
      ? tone === "onImage"
        ? "text-white/85 hover:text-white"
        : "text-[color:var(--amb-fg)] hover:opacity-70"
      : variant === "solid"
        ? tone === "onImage"
          ? "bg-white px-7 py-4 text-black hover:bg-white/90"
          : "bg-[color:var(--amb-fg)] px-7 py-4 text-[color:var(--amb-bg)] hover:opacity-85"
        : tone === "onImage"
          ? "border border-white/45 px-7 py-4 text-white hover:border-white hover:bg-white/10"
          : "border border-[color:var(--amb-line)] px-7 py-4 text-[color:var(--amb-fg)] hover:border-[color:var(--amb-fg)]";
  return (
    <LocalLink path={path} className={`${base} ${style}`}>
      {children}
      <span aria-hidden>&rarr;</span>
    </LocalLink>
  );
}
