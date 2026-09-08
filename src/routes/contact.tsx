import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/components/contact/ContactPage";
import { pageHead, loadPageBundle, notFoundHead, publicErrorComponents } from "@/lib/routes/public-pages";

/** Contact page in the ship default language (no URL prefix). */
export const Route = createFileRoute("/contact")({
  loader: async ({ context, location }) => ({
    bundle: await loadPageBundle(context.queryClient, location.pathname, "contact"),
  }),
  head: ({ loaderData }) => (loaderData ? pageHead(loaderData.bundle, "/contact") : notFoundHead),
  component: () => <ContactPage bundle={Route.useLoaderData().bundle} />,
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
