"use client";

/**
 * Shared media/typography primitives for the Experiences and The Ship areas.
 *
 * They are composition blocks, not a page template: each page arranges them
 * differently. Every block takes whatever media the database provides and
 * simply renders nothing when an image is missing, so official photography can
 * replace provisional images without a redesign.
 */

import type { ReactNode } from "react";

import { Reveal } from "@/components/landing/Reveal";
import type { MediaItem } from "@/lib/platform";

export function Img({
  image,
  alt,
  className,
  priority = false,
}: {
  image: MediaItem | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (!image) return <div className={`bg-chronos-ink/10 ${className ?? ""}`} />;
  return (
    <img
      src={image.url}
      alt={image.alt ?? alt}
      loading={priority ? "eager" : "lazy"}
      {...(priority ? { fetchPriority: "high" as const } : {})}
      className={`object-cover ${className ?? ""}`}
    />
  );
}

/** Full-bleed opening visual with overlaid editorial copy. */
export function HeroMedia({
  image,
  eyebrow,
  title,
  tagline,
  height = "tall",
}: {
  image: MediaItem | null;
  eyebrow?: string | null;
  title: string;
  tagline?: string | null;
  height?: "tall" | "short";
}) {
  return (
    <section
      className={`relative w-full overflow-hidden ${
        height === "tall"
          ? "h-[78vh] min-h-[460px] sm:h-[88vh]"
          : "h-[58vh] min-h-[380px]"
      }`}
    >
      <Img image={image} alt={title} className="h-full w-full" priority />
      <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/90 via-chronos-ink/35 to-chronos-ink/45" />
      <div className="absolute inset-0 flex items-end">
        <div className="mx-auto w-full max-w-7xl px-6 pb-14 sm:pb-20 lg:px-8">
          {eyebrow ? <p className="eyebrow mb-4 text-chronos-gold">{eyebrow}</p> : null}
          <h1 className="max-w-3xl text-[2rem] leading-[1.1] tracking-[0.02em] text-chronos-ivory sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {tagline ? (
            <p className="mt-5 max-w-xl text-base text-chronos-ivory/85 sm:text-lg">{tagline}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Wide horizontal visual; on mobile it becomes a taller, art-directed crop. */
export function PanoramaBand({
  image,
  alt,
  children,
}: {
  image: MediaItem | null;
  alt: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className="relative w-full overflow-hidden">
      <Img image={image} alt={alt} className="h-[52vh] w-full sm:h-[62vh] lg:h-[72vh]" />
      {children ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-chronos-ink/85 via-chronos-ink/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 lg:px-8">{children}</div>
        </>
      ) : null}
    </Reveal>
  );
}

/** One image beside copy. `reverse` flips the order on large screens only. */
export function EditorialPair({
  image,
  alt,
  reverse = false,
  ratio = "aspect-[4/5]",
  children,
}: {
  image: MediaItem | null;
  alt: string;
  reverse?: boolean;
  ratio?: string;
  children: ReactNode;
}) {
  return (
    <Reveal className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={`${reverse ? "lg:order-2" : ""} overflow-hidden`}>
        <Img image={image} alt={alt} className={`w-full ${ratio}`} />
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{children}</div>
    </Reveal>
  );
}

/**
 * Curated editorial gallery: one dominant image with supporting images at a
 * smaller scale. On mobile it becomes a single vertical column.
 */
export function CuratedGallery({
  images,
  alt,
  onOpen,
  label,
}: {
  images: MediaItem[];
  alt: string;
  onOpen?: (index: number) => void;
  label?: string | null;
}) {
  if (images.length === 0) return null;
  const [dominant, ...rest] = images;
  const supporting = rest.slice(0, 4);

  const Frame = ({ image, index, className }: { image: MediaItem; index: number; className: string }) =>
    onOpen ? (
      <button
        type="button"
        onClick={() => onOpen(index)}
        className={`group relative block overflow-hidden bg-chronos-ink/5 text-left ${className}`}
      >
        <Img image={image} alt={alt} className="h-full w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]" />
      </button>
    ) : (
      <div className={`overflow-hidden bg-chronos-ink/5 ${className}`}>
        <Img image={image} alt={alt} className="h-full w-full" />
      </div>
    );

  return (
    <Reveal>
      {label ? <p className="eyebrow mb-6 text-chronos-gold">{label}</p> : null}
      <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        {dominant ? (
          <Frame image={dominant} index={0} className="h-[46vh] min-h-[280px] lg:col-span-2 lg:h-[64vh]" />
        ) : null}
        {supporting.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:gap-4">
            {supporting.map((img, i) => (
              <Frame
                key={img.id}
                image={img}
                index={i + 1}
                className={`h-[26vh] min-h-[160px] w-full ${supporting.length > 2 ? "lg:h-[calc((64vh-2rem)/3)]" : "lg:h-[calc((64vh-1rem)/2)]"}`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

/** Small numbered editorial list used instead of icon/card grids. */
export function FeatureList({
  items,
  columns = 2,
}: {
  items: Array<{ title: string; description: string | null }>;
  columns?: 1 | 2 | 3;
}) {
  if (items.length === 0) return null;
  const cols = columns === 1 ? "" : columns === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";
  return (
    <Reveal className={`grid gap-x-12 gap-y-8 ${cols}`}>
      {items.map((item, i) => (
        <div key={item.title} className="border-t border-chronos-ink/12 pt-5">
          <p className="mb-2 text-xs tracking-[0.28em] text-chronos-gold">
            {String(i + 1).padStart(2, "0")}
          </p>
          <p className="text-base tracking-wide text-chronos-ink">{item.title}</p>
          {item.description ? (
            <p className="mt-2 text-sm leading-relaxed text-chronos-stone/85">{item.description}</p>
          ) : null}
        </div>
      ))}
    </Reveal>
  );
}

/** Section heading + optional lead paragraph, centered or left aligned. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string | null;
  title: string;
  lead?: string | null;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const heading = tone === "dark" ? "text-chronos-ivory" : "text-chronos-ink";
  const body = tone === "dark" ? "text-chronos-ivory/80" : "text-chronos-stone/90";
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow ? <p className="eyebrow mb-4 text-chronos-gold">{eyebrow}</p> : null}
      <h2 className={`text-2xl leading-tight tracking-[0.02em] sm:text-4xl ${heading}`}>{title}</h2>
      {lead ? <p className={`mt-5 text-base leading-relaxed sm:text-lg ${body}`}>{lead}</p> : null}
    </Reveal>
  );
}
