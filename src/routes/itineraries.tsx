import { createFileRoute } from "@tanstack/react-router";

import { pageSeo } from "@/lib/seo";

import { ItinerariesPage } from "@/components/itineraries/ItinerariesPage";
import heroAsset from "@/assets/gallery/chronos-exterior-02.webp";

const TITLE = "Hải trình Chronos Cruise | 2N1Đ & 3N2Đ Hạ Long - Lan Hạ";
const DESC =
  "Các hải trình du thuyền 6 sao Chronos: 2 ngày 1 đêm, 3 ngày 2 đêm và chuyến đi ngắn ngắm hoàng hôn giữa vịnh Hạ Long - Lan Hạ.";

export const Route = createFileRoute("/itineraries")({
  head: () => pageSeo({ title: TITLE, description: DESC, path: "/itineraries", image: heroAsset }),
  component: ItinerariesPage,
});
