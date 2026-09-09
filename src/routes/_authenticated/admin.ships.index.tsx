import { createFileRoute } from "@tanstack/react-router";

import { ShipsListPage } from "@/components/admin/ShipsListPage";

export const Route = createFileRoute("/_authenticated/admin/ships/")({
  component: ShipsListPage,
});
