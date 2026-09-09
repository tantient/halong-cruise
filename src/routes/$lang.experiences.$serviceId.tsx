import { createFileRoute } from "@tanstack/react-router";

import { notFoundHead, redirectExperienceSlug } from "@/lib/routes/public-pages";

/** Alias under a language prefix: `/vi/experiences/<slug>` → `/vi/services/<slug>`. */
export const Route = createFileRoute("/$lang/experiences/$serviceId")({
  loader: ({ location, params }) => redirectExperienceSlug(location.pathname, params.serviceId),
  head: () => notFoundHead,
  component: () => null,
});
