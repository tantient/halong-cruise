/**
 * Public presentation grouping for the ship's service records.
 *
 * The public information architecture splits them into things guests *do*
 * (Experiences) and the vessel itself (The Ship). The grouping key is stored
 * with each record (`highlights.group`) so it is editable data, never a
 * hardcoded slug list. Legacy keys are mapped for ships that were seeded
 * before the split.
 */

import type { ServiceView } from "@/components/services/service-view";

export const EXPERIENCE_GROUP = "experience";
export const SHIP_GROUP = "ship";

/** Normalizes any stored group key to one of the two public groups. */
export function publicGroup(view: Pick<ServiceView, "group">): string {
  const g = (view.group ?? "").toLowerCase();
  if (g === SHIP_GROUP || g === "space" || g === "spaces") return SHIP_GROUP;
  return EXPERIENCE_GROUP;
}

export interface GroupedServices {
  experiences: ServiceView[];
  shipSpaces: ServiceView[];
}

export function groupServices(views: ServiceView[]): GroupedServices {
  return {
    experiences: views.filter((v) => publicGroup(v) === EXPERIENCE_GROUP),
    shipSpaces: views.filter((v) => publicGroup(v) === SHIP_GROUP),
  };
}

/** Next record in the same group (wraps), for a restrained cross-link. */
export function nextInGroup(views: ServiceView[], slug: string): ServiceView | null {
  const group = views.filter((v) => {
    const current = views.find((x) => x.slug === slug);
    return current ? publicGroup(v) === publicGroup(current) : true;
  });
  if (group.length < 2) return null;
  const i = group.findIndex((v) => v.slug === slug);
  if (i < 0) return group[0] ?? null;
  return group[(i + 1) % group.length] ?? null;
}
