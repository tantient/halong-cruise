"use client";

import { useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { PlanZone } from "./cabin-view";

interface DeckPlanProps {
  /** Zones already localized by the read layer. */
  zones: PlanZone[];
  /** Shared UI labels for the plan. */
  labels: { area: string; tapHint: string };
  /** Ghi chú chung hiển thị khi chưa chọn khu vực nào */
  hint: string;
}

export function DeckPlan({ zones, labels, hint }: DeckPlanProps) {
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? zones[activeIndex] : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
      <div>
        <div className="relative aspect-[4/3] w-full touch-manipulation rounded-sm border border-chronos-ink/15 bg-chronos-ink/[0.04] p-2">
          {zones.map((z, i) => {
            const isActive = activeIndex === i;
            const button = (
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveIndex(isActive ? null : i)}
                className={cn(
                  "absolute flex select-none items-center justify-center rounded-sm border p-2 text-center transition-colors",
                  isActive
                    ? "border-chronos-gold bg-chronos-gold/25"
                    : "border-chronos-gold/40 bg-chronos-gold/10 hover:bg-chronos-gold/20",
                )}
                style={{
                  left: `${z.x}%`,
                  top: `${z.y}%`,
                  width: `${z.w}%`,
                  height: `${z.h}%`,
                }}
              >
                <span className="line-clamp-3 text-xs uppercase leading-tight tracking-[0.18em] text-chronos-ink">
                  {z.label}
                </span>
              </button>
            );

            // Trên mobile không dùng tooltip nổi (dễ che nội dung) — thông tin
            // hiển thị ở khối bên dưới sơ đồ.
            if (isMobile) return <span key={`${z.label}-${i}`}>{button}</span>;

            return (
              <Tooltip key={`${z.label}-${i}`}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent
                  side="top"
                  collisionPadding={16}
                  className="max-w-[min(18rem,calc(100vw-2rem))]"
                >
                  {z.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div
          aria-live="polite"
          className="mt-3 min-h-14 rounded-sm border border-chronos-ink/10 bg-chronos-ink/[0.03] px-4 py-3"
        >
          {active ? (
            <>
              <p className="text-xs uppercase tracking-[0.24em] text-chronos-gold">{labels.area}</p>
              <p className="mt-1 text-sm text-chronos-ink">{active.label}</p>
            </>
          ) : (
            <p className="text-sm text-chronos-stone/75">{labels.tapHint}</p>
          )}
        </div>
      </div>

      <p className="text-sm text-chronos-stone/80">{hint}</p>
    </div>
  );
}

export function DeckPlanProvider({ children }: { children: React.ReactNode }) {
  return <TooltipProvider delayDuration={150}>{children}</TooltipProvider>;
}
