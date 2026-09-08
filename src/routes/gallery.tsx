import { createFileRoute } from "@tanstack/react-router";

import { GalleryPage } from "@/components/gallery/GalleryPage";
import { galleryHead, loadGalleryBundle, notFoundHead, publicErrorComponents } from "@/lib/routes/public-pages";

/** Gallery page in the ship default language (no URL prefix). */
export const Route = createFileRoute("/gallery")({
  loader: async ({ context, location }) => ({
    bundle: await loadGalleryBundle(context.queryClient, location.pathname),
  }),
  head: ({ loaderData }) => (loaderData ? galleryHead(loaderData.bundle) : notFoundHead),
  component: () => <GalleryPage bundle={Route.useLoaderData().bundle} />,
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
