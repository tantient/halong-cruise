import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

/**
 * Per-domain sitemap: the request hostname resolves the ship, and only that
 * ship's published URLs (in its enabled languages) are listed.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { sitemapForHost } = await import("@/lib/platform/sitemap.server");
        const url = new URL(request.url);
        const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? url.host;

        const xml = await sitemapForHost(host);
        if (!xml) return new Response("Not found", { status: 404 });

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
