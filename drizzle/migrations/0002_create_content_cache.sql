-- Shared cross-instance cache for public read bundles.
-- Read/written ONLY by server code with the service role (RLS-bypassing);
-- no anon/authenticated policies on purpose.
create table public.content_cache (
  cache_key text primary key,
  value jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index content_cache_expires_idx on public.content_cache (expires_at);

grant all on public.content_cache to service_role;

alter table public.content_cache enable row level security;

-- No anon/authenticated policies: the table is app-internal infrastructure.
-- Service role bypasses RLS and has full grants from the statement above.