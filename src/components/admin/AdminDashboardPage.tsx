import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { StatusBadge } from "@/components/admin/admin-ui";
import { listShipsAdmin } from "@/lib/cms/ships.functions";

export function AdminDashboardPage() {
  const fetchShips = useServerFn(listShipsAdmin);
  const query = useQuery({ queryKey: ["cms", "ships"], queryFn: () => fetchShips() });

  if (query.isPending) return <p className="text-sm text-muted-foreground">Đang tải…</p>;
  if (query.isError)
    return <p className="text-sm text-destructive">{(query.error as Error).message}</p>;

  const { ships, counts } = query.data!;
  const cards = [
    { label: "Tổng số tàu", value: counts.total },
    { label: "Live", value: counts.live },
    { label: "Staging", value: counts.staging },
    { label: "Draft", value: counts.draft },
    { label: "Disabled", value: counts.disabled },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold">Tổng quan</h1>
        <p className="mt-1 text-sm text-muted-foreground">Toàn bộ đội tàu trong hệ thống.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-lg border border-border bg-card">
        <header className="flex items-center justify-between border-b border-border px-5 py-3">
          <h2 className="text-sm font-semibold">Tàu</h2>
          <Link to="/admin/ships" className="text-xs text-primary">
            Quản lý
          </Link>
        </header>
        <ul className="divide-y divide-border">
          {ships.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
              <Link to="/admin/ships/$shipId" params={{ shipId: s.id }} className="font-medium hover:underline">
                {s.displayName ?? s.name}
              </Link>
              <StatusBadge status={s.status} />
              <span className="text-xs text-muted-foreground">{s.primaryDomain ?? "chưa có tên miền"}</span>
            </li>
          ))}
          {ships.length === 0 ? (
            <li className="px-5 py-6 text-sm text-muted-foreground">Chưa có tàu nào.</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
