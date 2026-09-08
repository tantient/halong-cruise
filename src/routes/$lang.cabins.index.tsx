import { createFileRoute } from "@tanstack/react-router";

import { CabinsPage } from "@/components/cabins/CabinsPage";
import { cabinsHead, loadCabinsBundle, notFoundHead, publicErrorComponents } from "@/lib/routes/public-pages";

export const Route = createFileRoute("/$lang/cabins/")({
  loader: async ({ context, location }) => ({
    bundle: await loadCabinsBundle(context.queryClient, location.pathname),
  }),
  head: ({ loaderData }) => (loaderData ? cabinsHead(loaderData.bundle) : notFoundHead),
  component: () => <CabinsPage bundle={Route.useLoaderData().bundle} />,
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
