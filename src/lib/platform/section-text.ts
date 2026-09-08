/**
 * Small, typed accessors for `PublicHomepageSection.text` — the per-ship
 * editorial copy already resolved to the requested language by the read layer.
 * Templates use these instead of poking into JSON.
 */

import type { Json, PublicHomepageSection } from "./types";

export function textOf(section: PublicHomepageSection | undefined, key: string): string {
  const v = section?.text[key];
  return typeof v === "string" ? v : "";
}

export function listOf(section: PublicHomepageSection | undefined, key: string): string[] {
  const v: Json | undefined = section?.text[key];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export function sectionOfType(sections: PublicHomepageSection[], type: string): PublicHomepageSection | undefined {
  return sections.find((s) => s.type === type);
}
