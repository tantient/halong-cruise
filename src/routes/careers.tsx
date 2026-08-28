import { createFileRoute } from "@tanstack/react-router";

import { pageSeo } from "@/lib/seo";
import { CareersPage } from "@/components/careers/CareersPage";

export const Route = createFileRoute("/careers")({
  head: () =>
    pageSeo({
      title: "Tuyển dụng | Chronos Cruise - Cơ hội nghề nghiệp trên du thuyền 6 sao",
      description:
        "Gia nhập đội ngũ Chronos Cruise. Xem các vị trí đang tuyển và ứng tuyển trực tiếp qua Zalo hoặc email.",
      path: "/careers",
    }),
  component: CareersPage,
});
