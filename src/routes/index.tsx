import { createFileRoute, notFound } from "@tanstack/react-router";

import { LandingPage } from "@/components/landing/LandingPage";
import { buildSeo, publicQueries } from "@/lib/platform";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    const bundle = await context.queryClient.ensureQueryData(publicQueries.homepageBundle("/"));
    if (!bundle) throw notFound();
    return { bundle };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { ship, language, languages } = loaderData.bundle;
    const home = languages[language.language]?.homepage;
    const firstSlide = home?.hero[0]?.url ?? null;
    const seo = buildSeo(ship, language.language, { path: "/", image: firstSlide, type: "website" });
    return {
      meta: seo.meta,
      links: [
        ...seo.links,
        ...(firstSlide ? [{ rel: "preload", as: "image", href: firstSlide, fetchPriority: "high" }] : []),
      ],
    };
  },
  component: HomeRoute,
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

function HomeRoute() {
  const { bundle } = Route.useLoaderData();
  return <LandingPage bundle={bundle} />;
}
