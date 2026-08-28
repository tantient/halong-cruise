import { useEffect, useRef, useState } from "react";

export interface HeroSlide {
  url: string;
  alt: string;
}

interface HeroMediaProps {
  slides: HeroSlide[];
  /** Truyền vào để đổi hero thành clip; khi có video, slides chỉ dùng làm poster. */
  video?: { src: string; poster?: string };
  intervalMs?: number;
}

function usePrefersReducedMotion() {
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

export function HeroMedia({ slides, video, intervalMs = 6000 }: HeroMediaProps) {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const count = slides.length;

  useEffect(() => {
    if (video || reduced || count < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [video, reduced, count, intervalMs]);

  if (video) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="h-full w-full object-cover"
          src={video.src}
          poster={video.poster ?? slides[0]?.url}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
    );
  }

  const goTo = (i: number) => setIndex(((i % count) + count) % count);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        const end = e.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start == null || end == null) return;
        const dx = end - start;
        if (Math.abs(dx) > 50) goTo(index + (dx < 0 ? 1 : -1));
      }}
    >
      {slides.map((slide, i) => (
        <img
          key={slide.url}
          src={slide.url}
          alt={slide.alt}
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "low"}
          decoding="async"
          aria-hidden={i !== index}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          } ${reduced ? "" : "hero-kenburns"} ${i === index && !reduced ? "hero-kenburns-active" : ""}`}
        />
      ))}

      {!reduced && count > 1 && (
        <div className="absolute bottom-9 left-0 right-0 z-20 mx-auto flex w-full max-w-7xl justify-start gap-4 px-6 lg:px-8">
          {slides.map((slide, i) => (
            <button
              key={slide.url}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              aria-current={i === index}
              className={`h-px transition-all duration-700 ${
                i === index
                  ? "w-14 bg-chronos-gold"
                  : "w-7 bg-chronos-ivory/40 hover:bg-chronos-ivory/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
