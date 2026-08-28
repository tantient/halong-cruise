import { createFileRoute } from "@tanstack/react-router";

import { pageSeo } from "@/lib/seo";

import { CabinsPage } from "@/components/cabins/CabinsPage";
import heroAsset from "@/assets/gallery/chronos-suite-01.webp";

const TITLE = "Phòng nghỉ Chronos Cruise | Suite & cabin hướng vịnh";
const DESC =
  "44 phòng nghỉ hướng biển trên Chronos Cruise: Owner's Suite, Grand Suite và Junior Suite - thiết kế hướng vịnh, tiện nghi 6 sao trên vịnh Hạ Long.";

export const Route = createFileRoute("/cabins/")({
  head: () => pageSeo({ title: TITLE, description: DESC, path: "/cabins", image: heroAsset }),
  component: CabinsPage,
});
