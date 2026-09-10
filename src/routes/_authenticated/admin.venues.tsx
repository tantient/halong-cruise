import { createFileRoute } from "@tanstack/react-router";

import { VenuesAdminPage } from "@/components/admin/VenuesAdminPage";

export const Route = createFileRoute("/_authenticated/admin/venues")({
  head: () => ({
    meta: [
      { title: "Địa điểm trên tàu — Quản trị" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "description", content: "Quản lý các địa điểm, nhà hàng, bar và không gian của từng tàu." },
    ],
  }),
  component: VenuesAdminPage,
});
