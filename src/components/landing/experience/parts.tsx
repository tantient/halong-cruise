"use client";

import type { ReactNode } from "react";

import { useIsCompact, useParallax, usePrefersReducedMotion } from "./motion";

/** Chapter marker: a hairline, the chapter number and the time of day. */
export function Chapter({
  index,
  label,
  tone = "dark",
  className = "",
}: {
  index?: string;
  label?: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  if (!index && !label) return null;
  const color = tone === "light" ? "text-chronos-ivory/70" : "text-chronos-sand-700";
  const line = tone === "light" ? "bg-chronos-ivory/40" : "bg-chronos-sand-500/50";
  return (
    <div className={`flex items-center gap-4 ${color} ${className}`}>
      {index ? <span className="font-display text-sm italic">{index}</span> : null}
      <span className={`h-px w-10 ${line}`} />
      {label ? <span className="text-[0.7rem] font-semibold uppercase tracking-[0.42em]">{label}</span> : null}
    </div>
  );
}

/**
 * Image with a subtle vertical parallax driven by scroll position. Parallax is
 * dropped on phones and whenever reduced motion is requested.
 */
export function ParallaxImage({
  src,
  alt,
  strength = 60,
  className = "",
  imgClassName = "",
  priority = false,
  children,
}: {
  src: string;
  alt: string;
  strength?: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  children?: ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const compact = useIsCompact();
  const active = !reduced;
  const shift = compact ? strength * 0.35 : strength;
  const { wrapRef, targetRef } = useParallax<HTMLDivElement, HTMLImageElement>(shift, active);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <img
        ref={targetRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName}`}
        style={active ? { transform: "scale(1.08)", willChange: "transform" } : undefined}
      />
      {children}
    </div>
  );
}

/** Editorial paragraph with a comfortable measure. */
export function SceneBody({ children, tone = "dark" }: { children: ReactNode; tone?: "dark" | "light" }) {
  return (
    <p
      className={`max-w-xl text-base leading-[1.9] font-light sm:text-lg ${
        tone === "light" ? "text-chronos-ivory/80" : "text-chronos-sand-700"
      }`}
    >
      {children}
    </p>
  );
}
