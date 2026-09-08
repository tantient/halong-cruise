import { createFileRoute } from "@tanstack/react-router";

import { OffersPage } from "@/components/offers/OffersPage";
import { Route as EnRoute } from "./offers";

/** Language-prefixed variant of `/offers`. */
export const Route = createFileRoute("/$lang/offers")({
  // Same metadata as the unprefixed route (canonical points at the English URL).
  head: () => (EnRoute.options.head as unknown as () => object)(),
  component: OffersPage,
});
