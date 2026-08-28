import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";
import { pageSeo } from "@/lib/seo";
import heroAsset from "@/assets/chronos-hero.webp";
import slide1 from "@/assets/chronos-slide-1.webp";

const TITLE = "Chronos Cruise | Sắp ra mắt - Du thuyền 6 sao Hạ Long - Lan Hạ";
const DESC =
  "Chronos Cruise sắp ra mắt. Đăng ký để là người đầu tiên nhận thông tin về trải nghiệm du thuyền 6 sao tại vịnh Hạ Long và Lan Hạ.";

export const Route = createFileRoute("/")({
  head: () => {
    const seo = pageSeo({ title: TITLE, description: DESC, path: "/", image: heroAsset });
    return {
      ...seo,
      links: [
        ...seo.links,
        { rel: "preload", as: "image", href: slide1, fetchPriority: "high" },
      ],
    };
  },
  component: LandingPage,
});

