import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/admin-ui";
import { listShipsAdmin } from "@/lib/cms/ships.functions";

export function ShipsListPage() {
  const fetchShips = useServerFn(listShipsAdmin);
  const query = useQuery({ queryKey: ["cms", "ships"], queryFn: () => fetchShips() });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Tàu / Website</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Mỗi tàu là một website riêng với tên miền và thương hiệu riêng.
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/ships/new">Tạo tàu mới</Link>
        </Button>
      </div>

      {query.isPending ? <p className="text-sm text-muted-foreground">Đang tải…</p> : null}
      {query.isError ? (
        <p className="text-sm text-destructive">{(query.error as Error).message}</p>
      ) : null}

      {query.data ? (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Mẫu</th>
                <th className="px-4 py-3">Ngôn ngữ</th>
                <th className="px-4 py-3">Tên miền chính</th>
                <th className="px-4 py-3">Thứ tự</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {query.data.ships.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-3 font-medium">{s.displayName ?? s.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.slug}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.layout}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {s.defaultLanguage}
                    {s.enabledLanguages.length > 1
                      ? ` · ${s.enabledLanguages.filter((l) => l !== s.defaultLanguage).join(", ")}`
                      : ""}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.primaryDomain ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/admin/ships/$shipId" params={{ shipId: s.id }}>
                          Sửa
                        </Link>
                      </Button>
                      {s.primaryDomain ? (
                        <Button asChild variant="ghost" size="sm">
                          <a href={`https://${s.primaryDomain}`} target="_blank" rel="noreferrer">
                            Mở site
                          </a>
                        </Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {query.data.ships.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                    Chưa có tàu nào.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
