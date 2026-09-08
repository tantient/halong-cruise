import { createFileRoute } from "@tanstack/react-router";

import { ItinerariesPage } from "@/components/itineraries/ItinerariesPage";
import { Route as EnRoute } from "./itineraries";

/** Language-prefixed variant of `/itineraries`. */
export const Route = createFileRoute("/$lang/itineraries")({
  // Same metadata as the unprefixed route (canonical points at the English URL).
  head: () => (EnRoute.options.head as unknown as () => object)(),
  component: ItinerariesPage,
});
