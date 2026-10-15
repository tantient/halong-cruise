import { createFileRoute } from "@tanstack/react-router";

import { GuidePage } from "@/components/guide/GuidePage";
import { pageHead, loadPageBundle, notFoundHead, publicErrorComponents } from "@/lib/routes/public-pages";

/** Ha Long Bay travel guide in the ship default language. */
export const Route = createFileRoute("/du-thuyen-ha-long")({
  loader: async ({ context, location }) => ({
    bundle: await loadPageBundle(context.queryClient, location.pathname, "du-thuyen-ha-long"),
  }),
  head: ({ loaderData }) => (loaderData ? pageHead(loaderData.bundle, "/du-thuyen-ha-long") : notFoundHead),
  component: () => <GuidePage slug="du-thuyen-ha-long" path="/du-thuyen-ha-long" bundle={Route.useLoaderData().bundle} />,
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
