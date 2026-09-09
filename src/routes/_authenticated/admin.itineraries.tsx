import { createFileRoute } from "@tanstack/react-router";

import { ItinerariesAdminPage } from "@/components/admin/ItinerariesAdminPage";

export const Route = createFileRoute("/_authenticated/admin/itineraries")({
  head: () => ({
    meta: [
      { title: "Hải trình — Quản trị" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "description", content: "Quản lý hải trình và lịch trình từng ngày của từng tàu." },
    ],
  }),
  component: ItinerariesAdminPage,
});
