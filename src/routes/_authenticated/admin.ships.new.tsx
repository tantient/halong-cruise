import { createFileRoute } from "@tanstack/react-router";

import { ShipCreatePage } from "@/components/admin/ShipCreatePage";

export const Route = createFileRoute("/_authenticated/admin/ships/new")({
  component: ShipCreatePage,
});
