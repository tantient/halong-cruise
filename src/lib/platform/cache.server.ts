import type { Json } from "@supabase/supabase-js";

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

async function readShared(key: string): Promise<unknown> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("content_cache")
      .select("value")
      .eq("cache_key", key)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();
    if (error) return undefined;
    // JSON null means "not cached" — recompute (cached read fns return
    // null only for genuine misses, which are cheap to recompute).
    return data?.value ?? undefined;
  } catch {
    return undefined;
  }
}

async function writeShared(key: string, value: unknown): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const expiresAt = new Date(Date.now() + SHARED_TTL_SECONDS * 1000).toISOString();
    await supabaseAdmin
      .from("content_cache")
      .upsert({ cache_key: key, value: computed as Json, expires_at: expiresAt }, { onConflict: "cache_key" });
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
    if (shared !== undefined) return shared as T;
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
