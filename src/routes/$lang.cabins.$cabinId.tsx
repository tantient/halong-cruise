import { createFileRoute } from "@tanstack/react-router";

import { CabinDetailPage } from "@/components/cabins/CabinDetailPage";
import { cabinHead, loadCabinBundle, notFoundHead, publicErrorComponents, redirectLegacyCabinSlug } from "@/lib/routes/public-pages";

export const Route = createFileRoute("/$lang/cabins/$cabinId")({
  loader: async ({ context, location, params }) => {
    redirectLegacyCabinSlug(location.pathname, params.cabinId);
    return { bundle: await loadCabinBundle(context.queryClient, location.pathname, params.cabinId) };
  },
  head: ({ loaderData, params }) =>
    loaderData ? cabinHead(loaderData.bundle, params.cabinId) : notFoundHead,
  component: CabinDetailRoute,
  notFoundComponent: () => <PublicMessage text={publicErrorComponents.cabin} />,
  errorComponent: () => <PublicMessage text={publicErrorComponents.generic} />,
});

function CabinDetailRoute() {
  const { bundle } = Route.useLoaderData();
  const { cabinId } = Route.useParams();
  return <CabinDetailPage bundle={bundle} slug={cabinId} />;
}

function PublicMessage({ text }: { text: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">{text}</p>
    </main>
  );
}
