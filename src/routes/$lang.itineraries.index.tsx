import { createFileRoute } from "@tanstack/react-router";

import { ItinerariesPage } from "@/components/itineraries/ItinerariesPage";
import { itinerariesHead, loadItinerariesBundle, notFoundHead, publicErrorComponents } from "@/lib/routes/public-pages";

/** Language-prefixed variant of `/itineraries`. */
export const Route = createFileRoute("/$lang/itineraries/")({
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
