import { createFileRoute, notFound } from "@tanstack/react-router";

import { CabinDetailPage } from "@/components/cabins/CabinDetailPage";
import { buildSeo, publicQueries } from "@/lib/platform";

export const Route = createFileRoute("/cabins/$cabinId")({
  loader: async ({ context, location, params }) => {
    const bundle = await context.queryClient.ensureQueryData(
      publicQueries.cabinBundle(location.pathname, params.cabinId),
    );
    // Unknown slug, unpublished cabin or a cabin of another ship → 404,
    // never a fallback to a different cabin.
    if (!bundle) throw notFound();
    return { bundle };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Cabin not found" }, { name: "robots", content: "noindex" }] };
    }
    const { ship, language, languages } = loaderData.bundle;
    const data = languages[language.language] ?? languages[ship.defaultLanguage];
    const cabin = data?.cabin;
    const cover = cabin?.media.cover?.url ?? cabin?.media.all[0]?.url ?? null;
    const seo = buildSeo(ship, language.language, {
      path: `/cabins/${params.cabinId}`,
      title: cabin?.name ?? null,
      description: cabin?.summary ?? cabin?.description ?? null,
      image: cover,
      type: "product",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: CabinDetailRoute,
  notFoundComponent: () => (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">This cabin is not available.</p>
    </main>
  ),
  errorComponent: () => (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">Something went wrong loading this page. Please try again.</p>
    </main>
  ),
});

function CabinDetailRoute() {
  const { bundle } = Route.useLoaderData();
  const { cabinId } = Route.useParams();
  return <CabinDetailPage bundle={bundle} slug={cabinId} />;
}
