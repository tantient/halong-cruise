import { createFileRoute } from "@tanstack/react-router";

import { TheShipPage } from "@/components/ship/TheShipPage";
import { loadShipArea, notFoundHead, publicErrorComponents, shipHead } from "@/lib/routes/public-pages";

/** The Ship in the ship's default language (no URL prefix). */
export const Route = createFileRoute("/the-ship")({
  loader: ({ context, location }) => loadShipArea(context.queryClient, location.pathname),
  head: ({ loaderData }) => (loaderData ? shipHead(loaderData) : notFoundHead),
  component: ShipRoute,
  notFoundComponent: () => <PublicMessage text={publicErrorComponents.domain} />,
  errorComponent: () => <PublicMessage text={publicErrorComponents.generic} />,
});

function ShipRoute() {
  const { bundle, pageBundle } = Route.useLoaderData();
  return <TheShipPage bundle={bundle} pageBundle={pageBundle} />;
}

function PublicMessage({ text }: { text: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">{text}</p>
    </main>
  );
}
