import { createFileRoute } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";
import { homepageHead, loadHomepageBundle, notFoundHead, publicErrorComponents } from "@/lib/routes/public-pages";

export const Route = createFileRoute("/$lang/")({
  loader: async ({ context, location }) => ({
    bundle: await loadHomepageBundle(context.queryClient, location.pathname),
  }),
  head: ({ loaderData }) => (loaderData ? homepageHead(loaderData.bundle) : notFoundHead),
  component: () => <LandingPage bundle={Route.useLoaderData().bundle} />,
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
