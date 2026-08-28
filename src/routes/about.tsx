import { createFileRoute } from "@tanstack/react-router";

import { pageSeo } from "@/lib/seo";

import { AboutPage } from "@/components/about/AboutPage";
import heroAsset from "@/assets/gallery/chronos-exterior-01.webp";

const TITLE = "Giới thiệu Chronos Cruise | Du thuyền 6 sao Hạ Long - Lan Hạ";
const DESC =
  "Tìm hiểu về Chronos Cruise: tinh thần phục vụ, giá trị cốt lõi và trải nghiệm nghỉ dưỡng 6 sao giữa vịnh Hạ Long - Lan Hạ.";

export const Route = createFileRoute("/about")({
  head: () => pageSeo({ title: TITLE, description: DESC, path: "/about", image: heroAsset }),
  component: AboutPage,
});
