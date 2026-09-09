"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type RefObject,
} from "react";

/** True when the visitor asked the system to reduce motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** True on small viewports; used to tone heavy motion down on phones. */
export function useIsCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setCompact(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCompact(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return compact;
}

/** Fires once when the element enters the viewport (with a safety fallback). */
export function useInView<T extends HTMLElement>(options?: { rootMargin?: string }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) setInView(true);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setInView(true);
      },
      { rootMargin: options?.rootMargin ?? "0px 0px -12% 0px", threshold: 0 },
    );
    io.observe(el);
    const fallback = window.setTimeout(() => setInView(true), 1600);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [options?.rootMargin]);

  return { ref, inView } as const;
}

/**
 * Scroll progress of an element through the viewport, 0 → 1.
 * Written to a CSS variable so the browser can composite it cheaply.
 */
export function useScrollProgress<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const p = total > 0 ? (window.innerHeight - rect.top) / total : 0;
      const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
      setProgress(clamped);
      el.style.setProperty("--p", clamped.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return { ref, progress } as const;
}

type RevealVariant = "up" | "mask" | "fade" | "wipe";

const HIDDEN: Record<RevealVariant, CSSProperties> = {
  up: { opacity: 0, transform: "translate3d(0, 32px, 0)" },
  mask: { opacity: 0, clipPath: "inset(0 0 100% 0)", transform: "scale(1.04)" },
  fade: { opacity: 0 },
  wipe: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
};

const SHOWN: CSSProperties = {
  opacity: 1,
  clipPath: "inset(0 0 0 0)",
  transform: "none",
};

/**
 * Cinematic reveal: typography rises, images unmask. Motion is skipped entirely
 * when the visitor prefers reduced motion.
 */
export function SceneReveal({
  children,
  className = "",
  delay = 0,
  duration = 1100,
  variant = "up",
  as,
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: RevealVariant;
  as?: ElementType;
  id?: string;
}) {
  const Tag = (as ?? "div") as ElementType;
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const active = reduced || inView;

  return (
    <Tag
      ref={ref as RefObject<HTMLDivElement>}
      id={id}
      className={className}
      style={{
        ...(active ? SHOWN : HIDDEN[variant]),
        transitionProperty: "opacity, transform, clip-path",
        transitionDuration: reduced ? "0ms" : `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: reduced ? "0ms" : `${delay}ms`,
        willChange: reduced ? undefined : "opacity, transform, clip-path",
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * Parallax without React re-renders: the scroll handler writes the transform
 * straight onto the target element, and only while it is on screen.
 */
export function useParallax<T extends HTMLElement, U extends HTMLElement>(
  strength: number,
  enabled = true,
) {
  const wrapRef = useRef<T | null>(null);
  const targetRef = useRef<U | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const target = targetRef.current;
    if (!wrap || !target || !enabled) return;

    let visible = true;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const p = total > 0 ? (window.innerHeight - rect.top) / total : 0;
      const clamped = p < 0 ? 0 : p > 1 ? 1 : p;
      target.style.transform = `translate3d(0, ${((clamped - 0.5) * -strength).toFixed(2)}px, 0) scale(1.08)`;
    };
    const onScroll = () => {
      if (visible && !frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) visible = e.isIntersecting;
          if (visible) onScroll();
        },
        { rootMargin: "20% 0px 20% 0px" },
      );
      io.observe(wrap);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled, strength]);

  return { wrapRef, targetRef } as const;
}
