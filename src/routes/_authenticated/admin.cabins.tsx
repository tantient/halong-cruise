import { createFileRoute } from "@tanstack/react-router";

import { CabinsAdminPage } from "@/components/admin/CabinsAdminPage";

export const Route = createFileRoute("/_authenticated/admin/cabins")({
  head: () => ({
    meta: [
      { title: "Phòng nghỉ — Quản trị" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "description", content: "Quản lý phòng nghỉ và thông số của từng tàu." },
    ],
  }),
  component: CabinsAdminPage,
});
