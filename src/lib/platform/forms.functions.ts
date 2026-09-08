/**
 * Public form writes (leads + job applications).
 *
 * Security model:
 *  - The browser never sends `ship_id`, a ship slug or a domain. The server
 *    reads the request hostname, resolves the tenant and attaches `ship_id`.
 *  - Input is validated server-side with zod, independent of client validation.
 *  - Rows are written with the service-role client *after* validation, because
 *    anonymous visitors have no INSERT privilege on `leads` /
 *    `job_applications` (RLS + grants keep those tables server-write only).
 */

import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);

const leadInput = z.object({
  pathname: z.string().max(300).default("/"),
  /** Which public form produced the lead. */
  type: z.enum(["quote", "contact"]),
  name: text(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().max(160).email().optional().or(z.literal("")),
  subject: z.string().trim().max(160).optional().or(z.literal("")),
  date: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

const applicationInput = z.object({
  pathname: z.string().max(300).default("/"),
  fullName: text(120),
  contact: text(160),
  /** Slug of a published job position of the resolved ship. */
  position: text(200),
});

export interface FormResult {
  ok: boolean;
  /** Machine-readable reason, never a raw database error. */
  error?: "unavailable" | "invalid" | "failed";
}

function requestHost(): string {
  return getRequestHeader("x-forwarded-host") ?? getRequestHeader("host") ?? "";
}

/** Tenant for the current request, resolved from the hostname only. */
async function resolveShip() {
  const { resolveShipByHost } = await import("./ship.server");
  return resolveShipByHost(requestHost());
}

function blank(value: string | undefined): string | null {
  const v = (value ?? "").trim();
  return v === "" ? null : v;
}

export const submitPublicLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => leadInput.parse(d))
  .handler(async ({ data }): Promise<FormResult> => {
    const resolved = await resolveShip();
    if (!resolved) return { ok: false, error: "unavailable" };

    // Extra fields the form collects but `leads` has no column for are kept in
    // the message so nothing the guest typed is lost.
    const extras = [
      data.subject ? `Subject: ${data.subject.trim()}` : null,
      data.date ? `Preferred date: ${data.date.trim()}` : null,
    ].filter(Boolean);
    const message = [blank(data.message), ...extras].filter(Boolean).join("\n") || null;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert({
      ship_id: resolved.ship.id,
      type: data.type,
      name: data.name.trim(),
      phone: blank(data.phone),
      email: blank(data.email),
      message,
      source: data.type === "quote" ? "quote_form" : "contact_form",
    });
    if (error) {
      console.error("submitPublicLead failed", error.message);
      return { ok: false, error: "failed" };
    }
    return { ok: true };
  });

export const submitJobApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => applicationInput.parse(d))
  .handler(async ({ data }): Promise<FormResult> => {
    const resolved = await resolveShip();
    if (!resolved) return { ok: false, error: "unavailable" };

    // The position must be a published position of *this* ship.
    const { listJobPositions } = await import("./content.server");
    const { normalizeLanguage, PLATFORM_DEFAULT_LANGUAGE } = await import("@/lib/i18n/languages");
    const language = normalizeLanguage(resolved.ship.default_language) ?? PLATFORM_DEFAULT_LANGUAGE;
    const jobs = await listJobPositions({ shipId: resolved.ship.id, language, defaultLanguage: language });
    const job = jobs.find((j) => j.slug === data.position);
    if (!job) return { ok: false, error: "invalid" };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("job_applications").insert({
      ship_id: resolved.ship.id,
      full_name: data.fullName.trim(),
      contact: data.contact.trim(),
      position_id: job.slug,
    });
    if (error) {
      console.error("submitJobApplication failed", error.message);
      return { ok: false, error: "failed" };
    }
    return { ok: true };
  });
