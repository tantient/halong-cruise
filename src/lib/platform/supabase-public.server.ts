/**
 * Server-only, session-free Supabase client using the publishable key.
 * Runs as `anon`, so every public read is filtered by the RLS policies
 * (`status = 'published'` content of `status = 'live'` ships). No writes.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PublicDb = SupabaseClient<Database>;

let cached: PublicDb | undefined;

export function getPublicDb(): PublicDb {
  if (cached) return cached;
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY for the public read layer.");
  }
  cached = createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
