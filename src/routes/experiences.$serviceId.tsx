import { createFileRoute } from "@tanstack/react-router";

import { notFoundHead, redirectExperienceSlug } from "@/lib/routes/public-pages";

/** Alias of the detail URL: `/experiences/<slug>` → `/services/<slug>` (301). */
export const Route = createFileRoute("/experiences/$serviceId")({
  loader: ({ location, params }) => redirectExperienceSlug(location.pathname, params.serviceId),
  head: () => notFoundHead,
  component: () => null,
});
