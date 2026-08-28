"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import type { GalleryImage } from "./gallery-data";

interface LightboxProps {
  images: GalleryImage[];
  index: number | null;
  setIndex: (updater: (i: number | null) => number | null) => void;
  close: () => void;
  lang: "vi" | "en";
}

export function Lightbox({ images, index, setIndex, close, lang }: LightboxProps) {
  const count = images.length;

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, close, setIndex]);

  if (index === null) return null;
  const current = images[index];
  if (!current) return null;

  const label = lang === "vi" ? current.titleVi : current.titleEn;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-chronos-ink/95 p-4"
      onClick={close}
    >
      <button
        className="absolute right-5 top-5 text-chronos-ivory/80 hover:text-chronos-ivory"
        onClick={close}
        aria-label="Close"
      >
        <X className="h-7 w-7" />
      </button>
      <button
        className="absolute left-4 text-chronos-ivory/70 hover:text-chronos-ivory"
        onClick={(e) => {
          e.stopPropagation();
          setIndex((i) => (i === null ? i : (i - 1 + count) % count));
        }}
        aria-label="Previous"
      >
        <ChevronLeft className="h-9 w-9" />
      </button>
      <figure onClick={(e) => e.stopPropagation()} className="max-h-full">
        <img
          src={current.src}
          alt={label}
          className="max-h-[80vh] w-auto rounded-sm object-contain"
        />
        <figcaption className="mt-3 text-center text-xs uppercase tracking-[0.24em] text-chronos-ivory/70">
          {label} · {index + 1}/{count}
        </figcaption>
      </figure>
      <button
        className="absolute right-4 text-chronos-ivory/70 hover:text-chronos-ivory"
        onClick={(e) => {
          e.stopPropagation();
          setIndex((i) => (i === null ? i : (i + 1) % count));
        }}
        aria-label="Next"
      >
        <ChevronRight className="h-9 w-9" />
      </button>
    </div>
  );
}
