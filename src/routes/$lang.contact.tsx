import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/components/contact/ContactPage";
import { Route as EnRoute } from "./contact";

/** Language-prefixed variant of `/contact`. */
export const Route = createFileRoute("/$lang/contact")({
  // Same metadata as the unprefixed route (canonical points at the English URL).
  head: () => (EnRoute.options.head as unknown as () => object)(),
  component: ContactPage,
});
