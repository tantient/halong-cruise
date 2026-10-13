import type { Json } from "@/integrations/supabase/types";

/**
 * Two-layer cache for public reads.
 *
 * Layer 1 — in-memory per server instance (60s): zero latency for warm
 * instances; this is the pre-existing behaviour.
 *
 * Layer 2 — shared `content_cache` table (60s TTL): a cold serverless
 * instance restores the previous instance's computed result with a single
 * database round-trip instead of re-running the full query fan-out, which is
 * what made the first visitor after a cold start wait seconds.
 *
 * The shared layer is best-effort: any database error silently falls back to
 * computing the value, so it can never make reads fail or serve stale
 * failures. Values are the same JSON payloads server functions already
 * serialize over RPC, so jsonb round-trips are lossless.
 *
 * CMS edits remain visible within the 60s TTL on every layer.
 */

const MEMORY_TTL_MS = 60_000;
const SHARED_TTL_SECONDS = 60;
const MAX_ENTRIES = 500;

const store = new Map<string, { at: number; value: Promise<unknown> }>();

// `expires_at` marks when a shared row stops being FRESH. Stale rows are
// still served instantly (stale-while-revalidate) while a background refresh
// recomputes them, so a low-traffic site never makes a visitor wait for the
// full query fan-out just because the previous visit was over a minute ago.
async function readShared(key: string): Promise<{ value: unknown; stale: boolean } | undefined> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("content_cache")
      .select("value,expires_at")
      .eq("cache_key", key)
      .maybeSingle();
    if (error || !data || data.value === null) return undefined;
    return { value: data.value, stale: new Date(data.expires_at).getTime() <= Date.now() };
  } catch {
    return undefined;
  }
}

async function writeShared(key: string, payload: unknown): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const expiresAt = new Date(Date.now() + SHARED_TTL_SECONDS * 1000).toISOString();
    await supabaseAdmin
      .from("content_cache")
      .upsert({ cache_key: key, value: payload as Json, expires_at: expiresAt }, { onConflict: "cache_key" });
  } catch {
    // Best-effort only — the in-memory layer still serves this instance.
  }
}

export function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && now - hit.at < MEMORY_TTL_MS) return hit.value as Promise<T>;

  const value: Promise<T> = (async () => {
    const shared = await readShared(key);
    if (shared && !shared.stale) return shared.value as T;
    if (shared) {
      // Serve stale immediately; refresh in the background (best-effort).
      void fn().then((fresh) => writeShared(key, fresh)).catch(() => {});
      return shared.value as T;
    }
    const computed = await fn();
    // Fire-and-forget: persist so sibling instances skip the recompute.
    void writeShared(key, computed);
    return computed;
  })();

  store.set(key, { at: now, value });
  value.catch(() => store.delete(key));
  if (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  return value;
}
