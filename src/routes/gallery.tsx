import { createFileRoute } from "@tanstack/react-router";

import { pageSeo } from "@/lib/seo";

import { GalleryPage } from "@/components/gallery/GalleryPage";
import heroAsset from "@/assets/gallery/chronos-exterior-01.webp";

const TITLE = "Thư viện ảnh Chronos Cruise | Không gian du thuyền 6 sao";
const DESC =
  "Khám phá toàn bộ không gian Chronos Cruise: ngoại thất, nhà hàng, khu giải trí, spa và phòng nghỉ hướng vịnh Hạ Long - Lan Hạ.";

export const Route = createFileRoute("/gallery")({
  head: () => pageSeo({ title: TITLE, description: DESC, path: "/gallery", image: heroAsset }),
  component: GalleryPage,
});
