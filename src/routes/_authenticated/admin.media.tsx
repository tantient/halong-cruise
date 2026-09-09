import { createFileRoute } from "@tanstack/react-router";

import { MediaLibraryPage } from "@/components/admin/MediaLibraryPage";

export const Route = createFileRoute("/_authenticated/admin/media")({
  head: () => ({
    meta: [
      { title: "Thư viện ảnh — Quản trị" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "description", content: "Quản lý ảnh của từng tàu trong hệ thống quản trị." },
    ],
  }),
  component: MediaLibraryPage,
});
