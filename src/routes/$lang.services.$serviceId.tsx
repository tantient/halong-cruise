import { createFileRoute } from "@tanstack/react-router";

import { ExperienceDetailPage } from "@/components/experiences/ExperienceDetailPage";
import {
  loadServiceBundle,
  notFoundHead,
  publicErrorComponents,
  serviceHead,
} from "@/lib/routes/public-pages";

/** Language-prefixed variant of `/services/$serviceId`. */
export const Route = createFileRoute("/$lang/services/$serviceId")({
  loader: async ({ context, location, params }) => ({
    bundle: await loadServiceBundle(context.queryClient, location.pathname, params.serviceId),
  }),
  head: ({ loaderData, params }) =>
    loaderData ? serviceHead(loaderData.bundle, params.serviceId) : notFoundHead,
  component: ServiceRoute,
  notFoundComponent: () => <PublicMessage text={publicErrorComponents.service} />,
  errorComponent: () => <PublicMessage text={publicErrorComponents.generic} />,
});

function ServiceRoute() {
  const { bundle } = Route.useLoaderData();
  const { serviceId } = Route.useParams();
  return <ExperienceDetailPage bundle={bundle} slug={serviceId} />;
}

function PublicMessage({ text }: { text: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">{text}</p>
    </main>
  );
}
