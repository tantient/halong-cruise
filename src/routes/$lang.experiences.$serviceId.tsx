import { createFileRoute } from "@tanstack/react-router";

import { ExperienceDetailPage } from "@/components/experiences/ExperienceDetailPage";
import {
  loadServiceBundle,
  notFoundHead,
  publicErrorComponents,
  serviceHead,
} from "@/lib/routes/public-pages";

/** Language-prefixed experience category (`/vi/experiences/dining`). */
export const Route = createFileRoute("/$lang/experiences/$serviceId")({
  loader: async ({ context, location, params }) => ({
    bundle: await loadServiceBundle(context.queryClient, location.pathname, params.serviceId),
  }),
  head: ({ loaderData, params }) =>
    loaderData ? serviceHead(loaderData.bundle, params.serviceId) : notFoundHead,
  component: ExperienceCategoryRoute,
  notFoundComponent: () => <PublicMessage text={publicErrorComponents.service} />,
  errorComponent: () => <PublicMessage text={publicErrorComponents.generic} />,
});

function ExperienceCategoryRoute() {
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
