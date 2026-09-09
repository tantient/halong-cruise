import { createFileRoute } from "@tanstack/react-router";

import { ItineraryDetailPage } from "@/components/itineraries/ItineraryDetailPage";
import {
  itineraryHead,
  loadItineraryBundle,
  notFoundHead,
  publicErrorComponents,
} from "@/lib/routes/public-pages";

/** Language-prefixed variant of `/itineraries/$voyageId`. */
export const Route = createFileRoute("/$lang/itineraries/$voyageId")({
  loader: async ({ context, location, params }) => ({
    bundle: await loadItineraryBundle(context.queryClient, location.pathname, params.voyageId),
  }),
  head: ({ loaderData, params }) =>
    loaderData ? itineraryHead(loaderData.bundle, params.voyageId) : notFoundHead,
  component: VoyageRoute,
  notFoundComponent: () => <PublicMessage text={publicErrorComponents.itinerary} />,
  errorComponent: () => <PublicMessage text={publicErrorComponents.generic} />,
});

function VoyageRoute() {
  const { bundle } = Route.useLoaderData();
  const { voyageId } = Route.useParams();
  return <ItineraryDetailPage bundle={bundle} slug={voyageId} />;
}

function PublicMessage({ text }: { text: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">{text}</p>
    </main>
  );
}
