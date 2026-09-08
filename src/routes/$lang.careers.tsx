import { createFileRoute } from "@tanstack/react-router";

import { CareersPage } from "@/components/careers/CareersPage";
import { Route as EnRoute } from "./careers";

/** Language-prefixed variant of `/careers`. */
export const Route = createFileRoute("/$lang/careers")({
  // Same metadata as the unprefixed route (canonical points at the English URL).
  head: () => (EnRoute.options.head as unknown as () => object)(),
  component: CareersPage,
});
