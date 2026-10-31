<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Do not cache rendered HTML in `src/server.ts` via the Workers Cache API — it took the production site down with 500s; browser HTML caching also stays disabled for stale-tab protection.

- Public read caching is two-layer in `src/lib/platform/cache.server.ts`: per-instance memory (60s) plus a shared `public.content_cache` table row (fresh 60s, then served stale while a background refresh recomputes — low traffic otherwise always misses). Service-role only, best-effort with silent fallback. Never cache rendered HTML; data-level JSON bundles only.

- Contact maps render the saved Google place as an iframe, preserving its feature ID and actual place coordinates rather than drawing a separate branded marker; this keeps Google's place name and pin consistent with the directions link.

- Public typography uses the global Tailwind type scale in `src/styles.css`: body copy is at least 17px mobile / 18px desktop, labels/buttons/captions at least 14px, uppercase tracking capped at 0.12em, and uppercase tracking stays restrained for readability across mobile and desktop.

- The public site is light-only: `src/components/theme-provider.tsx` always resolves the theme to light (clears any stored dark preference), and the theme toggle is removed from the public header. Public pages hardcode light surfaces (`bg-chronos-ivory`), so applying the `.dark` token remap leaves light-on-light text — never re-enable dark mode on public routes.
