import { createFileRoute } from "@tanstack/react-router";

import { GuidePage, GUIDE_PATH, GUIDE_SLUG } from "@/components/guide/GuidePage";
import { pageHead, loadPageBundle, notFoundHead, publicErrorComponents } from "@/lib/routes/public-pages";

/** Language-prefixed variant of `/ha-long-bay-guide`. */
export const Route = createFileRoute("/$lang/ha-long-bay-guide")({
  loader: async ({ context, location }) => ({
    bundle: await loadPageBundle(context.queryClient, location.pathname, GUIDE_SLUG),
  }),
  head: ({ loaderData }) => (loaderData ? pageHead(loaderData.bundle, GUIDE_PATH) : notFoundHead),
  component: () => <GuidePage bundle={Route.useLoaderData().bundle} />,
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
