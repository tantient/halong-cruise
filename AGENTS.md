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

- Public GET pages without a query string are edge-cached as rendered HTML in `src/server.ts` (60s TTL; `/admin`, `/auth`, `/api`, `/dev` bypassed) — SSR costs seconds of DB work per cold worker, and browser HTML caching must stay disabled for stale-tab protection, so the edge cache is the only freshness/fast-response mechanism.

- Contact maps render the saved Google place as an iframe, preserving its feature ID and actual place coordinates rather than drawing a separate branded marker; this keeps Google's place name and pin consistent with the directions link.
