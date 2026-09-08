import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/components/about/AboutPage";
import { Route as EnRoute } from "./about";

/** Language-prefixed variant of `/about` (same component, canonical stays unprefixed). */
export const Route = createFileRoute("/$lang/about")({
  // Same metadata as the unprefixed route (canonical points at the English URL).
  head: () => (EnRoute.options.head as unknown as () => object)(),
  component: AboutPage,
});
