import { createFileRoute } from "@tanstack/react-router";

import { AdminApplicationsPage } from "@/components/admin/AdminApplicationsPage";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  head: () => ({
    meta: [
      { title: "Hồ sơ ứng tuyển — Quản trị" },
      {
        name: "description",
        content: "Danh sách hồ sơ ứng tuyển gửi từ các website trong hệ thống, dành cho quản trị viên.",
      },
      { property: "og:title", content: "Hồ sơ ứng tuyển — Quản trị" },
      {
        property: "og:description",
        content: "Danh sách hồ sơ ứng tuyển gửi từ các website trong hệ thống.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminApplicationsPage,
});
