import { createFileRoute } from "@tanstack/react-router";

import { GalleryPage } from "@/components/gallery/GalleryPage";
import { Route as EnRoute } from "./gallery";

/** Language-prefixed variant of `/gallery`. */
export const Route = createFileRoute("/$lang/gallery")({
  // Same metadata as the unprefixed route (canonical points at the English URL).
  head: () => (EnRoute.options.head as unknown as () => object)(),
  component: GalleryPage,
});
