import { createFileRoute } from "@tanstack/react-router";

import { OffersPage } from "@/components/offers/OffersPage";
import { loadOffersBundle, notFoundHead, offersHead, publicErrorComponents } from "@/lib/routes/public-pages";

/** Offers in the ship default language (no URL prefix). */
export const Route = createFileRoute("/offers")({
  loader: async ({ context, location }) => ({
    bundle: await loadOffersBundle(context.queryClient, location.pathname),
  }),
  head: ({ loaderData }) => (loaderData ? offersHead(loaderData.bundle) : notFoundHead),
  component: () => <OffersPage bundle={Route.useLoaderData().bundle} />,
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
