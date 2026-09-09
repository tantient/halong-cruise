import { createFileRoute } from "@tanstack/react-router";

import { ItinerariesPage } from "@/components/itineraries/ItinerariesPage";
import { itinerariesHead, loadItinerariesBundle, notFoundHead, publicErrorComponents } from "@/lib/routes/public-pages";

/** Itineraries in the ship default language (no URL prefix). */
export const Route = createFileRoute("/itineraries")({
  loader: async ({ context, location }) => ({
    bundle: await loadItinerariesBundle(context.queryClient, location.pathname),
  }),
  head: ({ loaderData }) => (loaderData ? itinerariesHead(loaderData.bundle) : notFoundHead),
  component: () => <ItinerariesPage bundle={Route.useLoaderData().bundle} />,
  notFoundComponent: () => <PublicMessage text={publicErrorComponents.domain} />,
  errorComponent: () => <PublicMessage text={publicErrorComponents.generic} />,
});

function PublicMessage({ text }: { text: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">{text}</p>
    </main>
  );
}
