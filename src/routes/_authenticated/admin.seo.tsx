import { createFileRoute } from "@tanstack/react-router";

import { SeoInsightsPage } from "@/components/admin/SeoInsightsPage";

export const Route = createFileRoute("/_authenticated/admin/seo")({
  head: () => ({
    meta: [
      { title: "Phân tích SEO — Quản trị" },
      { name: "robots", content: "noindex,nofollow" },
      { name: "description", content: "Phân tích dữ liệu Google Search Console và đề xuất cải thiện thứ hạng từng trang." },
    ],
  }),
  component: SeoInsightsPage,
});
