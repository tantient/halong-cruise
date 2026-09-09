import { createFileRoute } from "@tanstack/react-router";

import { ExperiencesPage } from "@/components/experiences/ExperiencesPage";
import {
  experiencesHead,
  loadExperiencesArea,
  notFoundHead,
  publicErrorComponents,
} from "@/lib/routes/public-pages";

/** Experiences landing under a language prefix (`/vi/experiences`). */
export const Route = createFileRoute("/$lang/experiences/")({
  loader: ({ context, location }) => loadExperiencesArea(context.queryClient, location.pathname),
  head: ({ loaderData }) => (loaderData ? experiencesHead(loaderData) : notFoundHead),
  component: ExperiencesRoute,
  notFoundComponent: () => <PublicMessage text={publicErrorComponents.domain} />,
  errorComponent: () => <PublicMessage text={publicErrorComponents.generic} />,
});

function ExperiencesRoute() {
  const { bundle, pageBundle } = Route.useLoaderData();
  return <ExperiencesPage bundle={bundle} pageBundle={pageBundle} />;
}

function PublicMessage({ text }: { text: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8 text-center">
      <p className="text-muted-foreground">{text}</p>
    </main>
  );
}
