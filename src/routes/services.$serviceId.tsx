import { createFileRoute } from "@tanstack/react-router";

import { notFoundHead, redirectServiceSlug } from "@/lib/routes/public-pages";

/** Retired URL: `/services/<slug>` → its Experiences (or The Ship) home (301). */
export const Route = createFileRoute("/services/$serviceId")({
  loader: ({ location, params }) => redirectServiceSlug(location.pathname, params.serviceId),
  head: () => notFoundHead,
  component: () => null,
});
