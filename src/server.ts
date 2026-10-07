import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

/**
 * Edge HTML cache for public pages.
 *
 * Rendering a public page costs several seconds of database work on a cold
 * worker instance, and the per-instance in-memory data cache rarely hits on
 * serverless. Public content changes rarely, so a short-lived edge cache of
 * the rendered HTML absorbs that cost: the first visitor after each TTL
 * window pays it, everyone else gets a fast response. CMS edits still appear
 * within a minute. Browser caches stay disabled (preventStaleDocumentCache
 * below still strips them) — only the edge copy is cached.
 */
const EDGE_HTML_TTL_SECONDS = 60;

const NON_CACHEABLE_PREFIXES = ["/admin", "/auth", "/api", "/dev"];

function edgeCache(): Cache | undefined {
  // Available on Cloudflare Workers; absent in the Node dev server.
  return typeof caches !== "undefined" ? caches.default : undefined;
}

function isCacheableRequest(request: Request): boolean {
  if (request.method !== "GET") return false;
  const url = new URL(request.url);
  // Any query string (version checks, trackers, preview params) bypasses.
  if (url.searchParams.size > 0) return false;
  if (NON_CACHEABLE_PREFIXES.some((p) => url.pathname === p || url.pathname.startsWith(`${p}/`))) return false;
  return true;
}

function isCacheableResponse(response: Response): boolean {
  const contentType = response.headers.get("content-type") ?? "";
  return response.status === 200 && contentType.includes("text/html");
}

/** Browser caches of HTML documents stay disabled (stale-tab protection). */
function preventStaleDocumentCache(request: Request, response: Response): Response {
  const contentType = response.headers.get("content-type") ?? "";
  if (request.method !== "GET" || !contentType.includes("text/html")) return response;

  const headers = new Headers(response.headers);
  headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  headers.set("pragma", "no-cache");
  headers.set("expires", "0");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** Cache-copy headers: public + short TTL so the edge re-renders within a minute. */
function edgeCacheHeaders(response: Response): Headers {
  const headers = new Headers(response.headers);
  headers.set("cache-control", `public, max-age=${EDGE_HTML_TTL_SECONDS}`);
  headers.delete("set-cookie");
  return headers;
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const cache = isCacheableRequest(request) ? edgeCache() : undefined;
    try {
      if (cache) {
        const hit = await cache.match(request);
        if (hit) return preventStaleDocumentCache(request, hit);
      }
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalizedResponse = await normalizeCatastrophicSsrResponse(response);
      if (cache && isCacheableResponse(normalizedResponse)) {
        // waitUntil keeps the put off the critical path; body cloned for the caller.
        ctx?.waitUntil?.(
          cache.put(request, new Response(normalizedResponse.clone().body, {
            status: 200,
            headers: edgeCacheHeaders(normalizedResponse),
          })),
        );
      }
      return preventStaleDocumentCache(request, normalizedResponse);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
