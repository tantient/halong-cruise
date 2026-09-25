/**
 * Pre-publish checks for homepage sections.
 *
 * Homepage chapters reference other content by slug (`configuration.slots` and
 * `configuration.emphasis`). Nothing in the database enforces those slugs, so a
 * renamed or unpublished cabin/experience silently disappears from the homepage.
 * These checks surface such dangling references in the admin BEFORE the content
 * goes live, and block a ship from being switched to `live` while they exist.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireAdmin } from "./admin-auth";

export interface HomepageReferenceIssue {
  sectionType: string;
  /** `service` or `cabin`. */
  kind: string;
  slug: string;
  /** `missing` = no such row, `unpublished` = row exists but is a draft. */
  reason: "missing" | "unpublished";
  /** Where inside the section configuration the slug came from. */
  where: string;
}

type SupabaseLike = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => Promise<{ data: unknown; error: { message: string } | null }>;
    };
  };
};

type Ref = { kind: "service" | "cabin"; slug: string; where: string };

function refsFromConfiguration(configuration: unknown): Ref[] {
  if (!configuration || typeof configuration !== "object") return [];
  const config = configuration as Record<string, unknown>;
  const refs: Ref[] = [];

  const slots = config["slots"];
  if (Array.isArray(slots)) {
    slots.forEach((slot, index) => {
      if (!slot || typeof slot !== "object") return;
      const entry = slot as Record<string, unknown>;
      if (typeof entry["service"] === "string" && entry["service"]) {
        refs.push({ kind: "service", slug: entry["service"], where: `slots[${index}]` });
      }
      if (typeof entry["cabin"] === "string" && entry["cabin"]) {
        refs.push({ kind: "cabin", slug: entry["cabin"], where: `slots[${index}]` });
      }
    });
  }

  // `emphasis` maps a time state ("morning", "night", …) to service slugs.
  const emphasis = config["emphasis"];
  if (emphasis && typeof emphasis === "object" && !Array.isArray(emphasis)) {
    for (const [state, value] of Object.entries(emphasis as Record<string, unknown>)) {
      if (!Array.isArray(value)) continue;
      value.forEach((slug) => {
        if (typeof slug === "string" && slug) {
          refs.push({ kind: "service", slug, where: `emphasis.${state}` });
        }
      });
    }
  }

  return refs;
}

type SlugRow = { slug: string; status: string };

async function slugStatuses(db: SupabaseLike, table: string, shipId: string) {
  const { data, error } = await db.from(table).select("slug,status").eq("ship_id", shipId);
  if (error) throw new Error(error.message);
  const map = new Map<string, string>();
  for (const row of (data ?? []) as SlugRow[]) map.set(row.slug, row.status);
  return map;
}

/**
 * Every homepage slot/emphasis slug of the ship that does not resolve to a
 * published cabin or experience. Empty array means the homepage is safe.
 */
export async function findHomepageReferenceIssues(
  db: SupabaseLike,
  shipId: string,
): Promise<HomepageReferenceIssue[]> {
  const { data, error } = await db
    .from("homepage_sections")
    .select("section_type,configuration,enabled,status")
    .eq("ship_id", shipId);
  if (error) throw new Error(error.message);

  const sections = (data ?? []) as {
    section_type: string;
    configuration: unknown;
    enabled: boolean;
    status: string;
  }[];
  const relevant = sections.filter((s) => s.enabled);
  if (relevant.length === 0) return [];

  const [services, cabins] = await Promise.all([
    slugStatuses(db, "services", shipId),
    slugStatuses(db, "cabins", shipId),
  ]);

  const issues: HomepageReferenceIssue[] = [];
  for (const section of relevant) {
    for (const ref of refsFromConfiguration(section.configuration)) {
      const status = (ref.kind === "service" ? services : cabins).get(ref.slug);
      if (status === undefined) {
        issues.push({ sectionType: section.section_type, kind: ref.kind, slug: ref.slug, reason: "missing", where: ref.where });
      } else if (status !== "published") {
        issues.push({ sectionType: section.section_type, kind: ref.kind, slug: ref.slug, reason: "unpublished", where: ref.where });
      }
    }
  }
  return issues;
}

/** Human-readable Vietnamese summary used in admin warnings and errors. */
export function describeHomepageIssues(issues: HomepageReferenceIssue[]): string {
  return issues
    .map((i) => {
      const kind = i.kind === "cabin" ? "hạng phòng" : "trải nghiệm";
      const reason = i.reason === "missing" ? "không tồn tại" : "chưa được xuất bản";
      return `Mục trang chủ “${i.sectionType}” (${i.where}) đang trỏ tới ${kind} “${i.slug}” ${reason}.`;
    })
    .join("\n");
}

export const checkHomepageReferences = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((raw: unknown) => z.object({ shipId: z.string().uuid() }).parse(raw))
  .handler(async ({ data, context }) => {
    const issues = await findHomepageReferenceIssues(context.supabase as unknown as SupabaseLike, data.shipId);
    return { issues };
  });
