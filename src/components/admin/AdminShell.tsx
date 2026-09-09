import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const NAV: { label: string; to?: string; soon?: boolean }[] = [
  { label: "Tổng quan", to: "/admin" },
  { label: "Tàu / Website", to: "/admin/ships" },
  { label: "Hồ sơ ứng tuyển", to: "/admin/applications" },
  { label: "Phòng nghỉ", soon: true },
  { label: "Hải trình", soon: true },
  { label: "Dịch vụ", soon: true },
  { label: "Ưu đãi", soon: true },
  { label: "Trang nội dung", soon: true },
  { label: "Thư viện ảnh", soon: true },
  { label: "Tuyển dụng", soon: true },
  { label: "Khách hỏi giá", soon: true },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-muted/30 text-foreground">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="border-b border-border px-5 py-5">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Cruise Platform</p>
          <p className="mt-1 text-sm font-semibold">Quản trị</p>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {NAV.map((item) =>
            item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to))
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                aria-disabled
                className="flex cursor-not-allowed items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground/50"
              >
                {item.label}
                <span className="text-[10px] uppercase tracking-wider">sắp có</span>
              </span>
            ),
          )}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 md:px-6">
          <div className="flex items-center gap-3 md:hidden">
            <Link to="/admin" className="text-sm font-semibold">
              Quản trị
            </Link>
            <Link to="/admin/ships" className="text-sm text-muted-foreground">
              Tàu
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{email ?? "…"}</span>
            <Button variant="outline" size="sm" onClick={() => void signOut()}>
              Đăng xuất
            </Button>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
