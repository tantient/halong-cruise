import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { SHIP_MEDIA_BUCKET } from "@/lib/platform/media";

/**
 * Same-origin, cacheable delivery of `ship-media` objects.
 *
 * URL: /api/public/media/<ship-slug>/<category>/<file>
 *
 * The bucket only holds public marketing imagery, but the workspace currently
 * blocks public buckets, so objects are streamed through the server. When the
 * bucket is switched to public this route keeps working (URLs stay stable);
 * `mediaUrl()` can then point straight at storage if desired.
 */
const SAFE_PATH = /^[a-z0-9][a-z0-9._-]*(\/[a-z0-9][a-z0-9._-]*)+$/i;
const IMAGE_MIME: Record<string, string> = {
  webp: "image/webp", jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", svg: "image/svg+xml", avif: "image/avif",
};

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        if (!path || path.includes("..") || !SAFE_PATH.test(path)) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from(SHIP_MEDIA_BUCKET).download(path);
        if (error || !data) {
          return new Response("Not found", { status: 404, headers: { "cache-control": "public, max-age=60" } });
        }

        const ext = path.split(".").pop()?.toLowerCase() ?? "";
        const type = IMAGE_MIME[ext] ?? data.type ?? "application/octet-stream";
        return new Response(data.stream(), {
          status: 200,
          headers: {
            "content-type": type,
            "content-length": String(data.size),
            "cache-control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
          },
        });
      },
    },
  },
});
