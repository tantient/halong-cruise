/**
 * Hostname normalisation shared by the ship resolver, SEO layer and sitemap.
 * Pure functions only — safe on both server and client.
 */

/** Hosts that never map to a tenant domain row (local dev / platform previews). */
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

/**
 * `WWW.Example.com:8080` → `example.com`.
 * Strips the port, lowercases, trims trailing dots and a leading `www.`.
 */
export function normalizeHostname(input: string | null | undefined): string {
  if (!input) return "";
  let host = input.trim().toLowerCase();
  // Prefer the first value when a proxy forwarded a comma-separated list.
  host = host.split(",")[0]!.trim();
  // IPv6 literal with port: [::1]:8080
  if (host.startsWith("[")) {
    const end = host.indexOf("]");
    host = end > 0 ? host.slice(1, end) : host;
  } else {
    host = host.replace(/:\d+$/, "");
  }
  host = host.replace(/\.+$/, "");
  return host;
}

/** Same as `normalizeHostname` but also removes a leading `www.`. */
export function canonicalHostname(input: string | null | undefined): string {
  return normalizeHostname(input).replace(/^www\./, "");
}

export function isLocalHostname(host: string): boolean {
  return LOCAL_HOSTS.has(normalizeHostname(host));
}

/** Hostnames tried, in order, when looking up `ship_domains`. */
export function hostnameCandidates(input: string | null | undefined): string[] {
  const exact = normalizeHostname(input);
  if (!exact) return [];
  const bare = exact.replace(/^www\./, "");
  const list = [exact];
  if (bare !== exact) list.push(bare);
  else list.push(`www.${bare}`);
  return list;
}
