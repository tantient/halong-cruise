import { createFileRoute, notFound } from "@tanstack/react-router";

import { CabinsPage } from "@/components/cabins/CabinsPage";
import { buildSeo, publicQueries } from "@/lib/platform";

export const Route = createFileRoute("/cabins/")({
  loader: async ({ context, location }) => {
    const bundle = await context.queryClient.ensureQueryData(publicQueries.cabinsBundle(location.pathname));
    if (!bundle) throw notFound();
    return { bundle };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { ship, language, languages } = loaderData.bundle;
    const data = languages[language.language] ?? languages[ship.defaultLanguage];
    const page = data?.page ?? null;
    const cover = data?.cabins[0]?.media.cover?.url ?? null;
    const seo = buildSeo(ship, language.language, {
      path: "/cabins",
      title: page?.title ?? null,
      seoTitle: page?.seoTitle ?? null,
      description: page?.intro ?? null,
      seoDescription: page?.seoDescription ?? null,
      image: cover,
      type: "website",
    });
    return { meta: seo.meta, links: seo.links };
  },
  component: CabinsRoute,
  notFoundComponent: () => (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">This site is not configured for this domain.</p>
    </main>
  ),
  errorComponent: () => (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">Something went wrong loading this page. Please try again.</p>
    </main>
  ),
});

function CabinsRoute() {
  const { bundle } = Route.useLoaderData();
  return <CabinsPage bundle={bundle} />;
}
