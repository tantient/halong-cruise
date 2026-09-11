"use client";

import { useState } from "react";

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
