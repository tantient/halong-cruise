import { createFileRoute } from "@tanstack/react-router";

import { OffersPage } from "@/components/offers/OffersPage";
import { offersHead, loadOffersBundle, notFoundHead, publicErrorComponents } from "@/lib/routes/public-pages";

/** Language-prefixed variant of `/offers`. */
export const Route = createFileRoute("/$lang/offers")({
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
