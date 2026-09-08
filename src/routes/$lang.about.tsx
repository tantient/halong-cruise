import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/components/about/AboutPage";
import { pageHead, loadPageBundle, notFoundHead, publicErrorComponents } from "@/lib/routes/public-pages";

/** Language-prefixed variant of `/about`. */
export const Route = createFileRoute("/$lang/about")({
  loader: async ({ context, location }) => ({
    bundle: await loadPageBundle(context.queryClient, location.pathname, "about"),
  }),
  head: ({ loaderData }) => (loaderData ? pageHead(loaderData.bundle, "/about") : notFoundHead),
  component: () => <AboutPage bundle={Route.useLoaderData().bundle} />,
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
