import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider, themeInitScript } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { ServiceNavProvider } from "@/lib/i18n/service-nav-context";
import { publicQueries, SiteProvider, type ShipContext } from "@/lib/platform";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // Tenant language config (default + enabled languages) for the language
  // switcher and link building. Resolved from the request host on the server.
  loader: async ({ context, location }) => {
    const [site, serviceNav] = await Promise.all([
      context.queryClient.ensureQueryData(publicQueries.siteContext(location.pathname)).catch(() => null),
      context.queryClient.ensureQueryData(publicQueries.serviceNav(location.pathname)).catch(() => null),
    ]);
    return {
      // Resolved tenant, shared with header/footer through SiteProvider.
      site,
      // Header service menu of the resolved ship (all enabled languages).
      serviceNav,
      // Serialized with the route match, so server and client agree during hydration.
      languageConfig: site
        ? { defaultLanguage: site.ship.defaultLanguage, enabledLanguages: site.ship.enabledLanguages }
        : null,
    };
  },
  // Tenant-neutral document head. Brand title/description/JSON-LD come from
  // the resolved ship, so no ship name is hardcoded here.
  head: ({ loaderData }) => {
    const site = (loaderData?.site?.ship ?? null) as ShipContext | null;
    const siteName = site?.seo.siteName ?? site?.ship.displayName ?? "";
    const title = site?.seo.defaultTitle ?? siteName;
    const description = site?.seo.defaultDescription ?? site?.ship.tagline ?? "";
    const themeColor = site?.branding.primaryColor ?? "#8b7355";
    const locale = site ? site.defaultLanguage.replace("-", "_") : undefined;

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        ...(title ? [{ title }] : []),
        ...(description ? [{ name: "description", content: description }] : []),
        ...(siteName
          ? [
              { name: "author", content: siteName },
              { property: "og:site_name", content: siteName },
            ]
          : []),
        { name: "theme-color", content: themeColor },
        ...(locale ? [{ property: "og:locale", content: locale }] : []),
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(site?.seo.twitterHandle ? [{ name: "twitter:site", content: site.seo.twitterHandle }] : []),
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap",
        },
        { rel: "icon", href: site?.branding.favicon ?? "/favicon.png", type: "image/png" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
      scripts: site
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": site.seo.schemaType,
                name: site.seo.schemaName ?? siteName,
                url: site.origin,
                ...(site.branding.logoLight ? { logo: site.branding.logoLight } : {}),
                ...(description ? { description } : {}),
              }),
            },
          ]
        : [],
    };
  },

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const loaderData = Route.useLoaderData();
  const languageConfig = loaderData?.languageConfig ?? null;
  const serviceNav = loaderData?.serviceNav ?? null;
  const site = (loaderData?.site?.ship ?? null) as ShipContext | null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider config={languageConfig}>
          <ServiceNavProvider nav={serviceNav}>
            <SiteProvider site={site}>
            {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
            <Outlet />
            <Toaster position="top-center" richColors />
            </SiteProvider>
          </ServiceNavProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
