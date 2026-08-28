import { createFileRoute } from "@tanstack/react-router";

import { pageSeo } from "@/lib/seo";

import { OffersPage } from "@/components/offers/OffersPage";
import heroAsset from "@/assets/gallery/chronos-public-pool.webp";

const TITLE = "Ưu đãi Chronos Cruise | Gói nghỉ dưỡng & khuyến mãi du thuyền Hạ Long";
const DESC =
  "Các ưu đãi và gói đặc biệt trên Chronos Cruise: giảm giá mùa thấp điểm, ưu đãi gia đình, gói trăng mật và combo nghỉ dưỡng giữa vịnh Hạ Long.";

export const Route = createFileRoute("/offers")({
  head: () => pageSeo({ title: TITLE, description: DESC, path: "/offers", image: heroAsset }),
  component: OffersPage,
});
