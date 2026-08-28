import { createFileRoute, notFound } from "@tanstack/react-router";

import { pageSeo } from "@/lib/seo";
import { ServicePage } from "@/components/services/ServicePage";
import { getService, serviceImages } from "@/components/services/services-data";

export const Route = createFileRoute("/services/$serviceId")({
  loader: ({ params }) => {
    const service = getService(params.serviceId);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Không tìm thấy dịch vụ | Chronos Cruise" }, { name: "robots", content: "noindex" }] };
    }
    const { service } = loaderData;
    const hero = serviceImages(service)[0];
    return pageSeo({
      title: `${service.nameEn} | Chronos Cruise`,
      description: service.introEn.slice(0, 155),
      path: `/services/${params.serviceId}`,
      image: hero?.src,
    });
  },
  component: ServiceRoute,
});

function ServiceRoute() {
  const { service } = Route.useLoaderData();
  return <ServicePage service={service} />;
}
