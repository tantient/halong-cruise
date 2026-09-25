/**
 * Short-lived in-memory cache for public reads (per server instance).
 * Public content changes rarely; a short TTL removes repeated database
 * round-trips on every page view while CMS edits still appear within a minute.
 */

const TTL_MS = 60_000;
const MAX_ENTRIES = 500;
const store = new Map<string, { at: number; value: Promise<unknown> }>();

export function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = store.get(key);
  if (hit && now - hit.at < TTL_MS) return hit.value as Promise<T>;
  const value = fn();
  store.set(key, { at: now, value });
  value.catch(() => store.delete(key));
  if (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  return value;
}
