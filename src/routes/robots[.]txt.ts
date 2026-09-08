import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * Per-domain robots.txt. Real ship domains allow crawling and point at their
 * own sitemap; dev/preview hosts return disallow-all so previews stay unindexed.
 */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { robotsForHost } = await import("@/lib/platform/sitemap.server");
        const url = new URL(request.url);
        const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;

        return new Response(await robotsForHost(host), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
