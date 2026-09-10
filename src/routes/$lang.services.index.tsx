import { createFileRoute } from "@tanstack/react-router";

import { notFoundHead, redirectServicesBase } from "@/lib/routes/public-pages";

/** Retired area root under a language prefix: `/vi/services` → `/vi/experiences` (301). */
export const Route = createFileRoute("/$lang/services/")({
  loader: ({ location }) => redirectServicesBase(location.pathname),
  head: () => notFoundHead,
  component: () => null,
});
