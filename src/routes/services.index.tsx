import { createFileRoute } from "@tanstack/react-router";

import { notFoundHead, redirectServicesBase } from "@/lib/routes/public-pages";

/** Retired area root: `/services` → `/experiences` (301). */
export const Route = createFileRoute("/services/")({
  loader: ({ location }) => redirectServicesBase(location.pathname),
  head: () => notFoundHead,
  component: () => null,
});
