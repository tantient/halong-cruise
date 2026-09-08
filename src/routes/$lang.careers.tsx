import { createFileRoute } from "@tanstack/react-router";

import { CareersPage } from "@/components/careers/CareersPage";
import { careersHead, loadCareersBundle, notFoundHead, publicErrorComponents } from "@/lib/routes/public-pages";

/** Language-prefixed variant of `/careers`. */
export const Route = createFileRoute("/$lang/careers")({
  loader: async ({ context, location }) => ({
    bundle: await loadCareersBundle(context.queryClient, location.pathname),
  }),
  head: ({ loaderData }) => (loaderData ? careersHead(loaderData.bundle) : notFoundHead),
  component: () => <CareersPage bundle={Route.useLoaderData().bundle} />,
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
