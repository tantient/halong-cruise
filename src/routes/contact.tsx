import { createFileRoute } from "@tanstack/react-router";

import { pageSeo } from "@/lib/seo";

import { ContactPage } from "@/components/contact/ContactPage";
import heroAsset from "@/assets/gallery/chronos-exterior-01.webp";

const TITLE = "Liên hệ Chronos Cruise | Hotline, Zalo & bản đồ bến tàu Hạ Long";
const DESC =
  "Liên hệ Chronos Cruise: hotline, Zalo, email đặt phòng và bản đồ vị trí bến tàu tại Cảng tàu khách quốc tế Hạ Long. Gửi tin nhắn để được tư vấn trong 24 giờ.";

export const Route = createFileRoute("/contact")({
  head: () => pageSeo({ title: TITLE, description: DESC, path: "/contact", image: heroAsset }),
  component: ContactPage,
});
