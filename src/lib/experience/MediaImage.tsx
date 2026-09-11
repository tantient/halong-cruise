"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shared image renderer for database media.
 *
 * Lifecycle: placeholder (ambient-tone surface) → fade the image in on `load`
 * → on `error` keep a clean placeholder instead of the browser's broken-image
 * UI. The `alt` attribute always stays in the DOM for accessibility and SEO;
 * the flash of alt text while loading is avoided by keeping the image element
 * at opacity 0 until it has decoded, with the placeholder painted on top of it.
 */
export function MediaImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  style,
}: {
  src: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const imgRef = useRef<HTMLImageElement>(null);

  // Images streamed during SSR can finish loading before hydration attaches the
  // handlers, so `load` never fires. Reconcile the real element state on mount
  // (and whenever `src` changes) to avoid images staying invisible.
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete) {
      setStatus(el.naturalWidth > 0 ? "loaded" : "error");
    } else {
      setStatus("loading");
    }
  }, [src]);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-out"
        style={{
          background: "var(--amb-placeholder, color-mix(in oklab, var(--amb-bg) 88%, var(--amb-fg)))",
          opacity: status === "loaded" ? 0 : 1,
        }}
      />
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width ?? undefined}
        height={height ?? undefined}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ease-out ${className}`}
        style={{ ...style, opacity: status === "loaded" ? (style?.opacity ?? 1) : 0 }}
      />
    </>
  );
}
