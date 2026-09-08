import { Outlet, createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { normalizeLanguage } from "@/lib/i18n/languages";
import { publicQueries } from "@/lib/platform";

/**
 * Language-prefixed layout: `/vi/...`, `/ko/...`, `/zh-CN/...`.
 *
 * Tenant-first: the ship is resolved from the request host on the server; this
 * route only decides whether the requested language prefix may be served.
 *  - prefix that is not a platform language → 404 (so `/foo` is never a page);
 *  - language the ship did not enable → 404, never a silent English fallback;
 *  - the ship's default language (e.g. `/en/...`) → redirect to the unprefixed
 *    canonical URL.
 */
export const Route = createFileRoute("/$lang")({
  beforeLoad: async ({ context, params, location }) => {
    if (!normalizeLanguage(params.lang)) throw notFound();
    const site = await context.queryClient.ensureQueryData(
      publicQueries.siteContext(location.pathname),
    );
    if (!site) throw notFound();
    const { language } = site;
    if (!language.isPublic) throw notFound();
    if (!language.isCanonical) {
      throw redirect({ href: `${language.canonicalPath}${location.searchStr ?? ""}` });
    }
    return { site };
  },
  component: () => <Outlet />,
});
