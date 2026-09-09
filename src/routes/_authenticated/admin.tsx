import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { AdminShell } from "@/components/admin/AdminShell";
import { checkAdminAccess } from "@/lib/cms/ships.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Quản trị nền tảng" },
      { name: "description", content: "Khu vực quản trị nội bộ của nền tảng du thuyền." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

/**
 * The `_authenticated` layout already guarantees a signed-in user; this layer
 * additionally requires the `admin` role. The check is server-side (`has_role`)
 * — hiding menu items client-side is never the security boundary, and every
 * CMS server function re-checks the role independently.
 */
function AdminLayout() {
  const check = useServerFn(checkAdminAccess);
  const access = useQuery({
    queryKey: ["cms", "access"],
    queryFn: () => check(),
    retry: false,
  });

  if (access.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Đang kiểm tra quyền truy cập…
      </div>
    );
  }

  if (access.isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-lg font-semibold">Không có quyền truy cập</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Tài khoản này chưa được cấp quyền quản trị. Hãy liên hệ người quản lý nền tảng.
        </p>
        <Link to="/admin/login" className="text-sm text-primary hover:underline">
          Đăng nhập bằng tài khoản khác
        </Link>
      </div>
    );
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
