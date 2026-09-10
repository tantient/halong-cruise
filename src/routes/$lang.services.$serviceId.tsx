import { createFileRoute } from "@tanstack/react-router";

import { notFoundHead, redirectServiceSlug } from "@/lib/routes/public-pages";

/** Retired URL under a language prefix: `/vi/services/<slug>` → Experiences (301). */
export const Route = createFileRoute("/$lang/services/$serviceId")({
  loader: ({ location, params }) => redirectServiceSlug(location.pathname, params.serviceId),
  head: () => notFoundHead,
  component: () => null,
});
