import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboardPage } from "@/components/admin/AdminDashboardPage";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboardPage,
});
