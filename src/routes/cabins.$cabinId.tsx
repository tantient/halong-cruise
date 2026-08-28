import { createFileRoute, notFound } from "@tanstack/react-router";

import { pageSeo } from "@/lib/seo";
import { CabinDetailPage } from "@/components/cabins/CabinDetailPage";
import { cabinTypes } from "@/components/cabins/cabins-data";

export const Route = createFileRoute("/cabins/$cabinId")({
  loader: ({ params }) => {
    const cabin = cabinTypes.find((c: { id: string }) => c.id === params.cabinId);
    if (!cabin) throw notFound();
    return { cabin };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Không tìm thấy phòng | Chronos Cruise" }, { name: "robots", content: "noindex" }] };
    }
    const { cabin } = loaderData;
    return pageSeo({
      title: `${cabin.nameEn} | Chronos Cruise`,
      description: cabin.descEn.slice(0, 155),
      path: `/cabins/${params.cabinId}`,
      image: cabin.hero,
    });
  },
  component: CabinDetailRoute,
});

function CabinDetailRoute() {
  const { cabin } = Route.useLoaderData();
  return <CabinDetailPage cabin={cabin} />;
}
