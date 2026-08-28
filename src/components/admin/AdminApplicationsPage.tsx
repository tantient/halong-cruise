"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { jobPositions } from "@/components/careers/careers-data";

const STATUSES = ["new", "contacted", "hired", "rejected"] as const;
const STATUS_LABEL: Record<string, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  hired: "Đã tuyển",
  rejected: "Từ chối",
};

function positionLabel(id: string) {
  return jobPositions.find((job) => job.id === id)?.titleVi ?? id;
}

export function AdminApplicationsPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const rolesQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (error) throw error;
      return Boolean(data);
    },
  });

  const applicationsQuery = useQuery({
    queryKey: ["job-applications"],
    enabled: rolesQuery.data === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("id, full_name, contact, position_id, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("job_applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["job-applications"] });
      toast.success("Đã cập nhật trạng thái");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <main className="min-h-screen bg-chronos-ivory px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow mb-2 text-chronos-gold">QUẢN TRỊ</p>
            <h1 className="text-3xl tracking-[0.02em] text-chronos-ink">Hồ sơ ứng tuyển</h1>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="rounded-none text-xs uppercase tracking-[0.18em]"
          >
            Đăng xuất
          </Button>
        </div>

        {rolesQuery.isLoading && <p className="text-chronos-stone/80">Đang kiểm tra quyền…</p>}

        {rolesQuery.data === false && (
          <p className="border border-chronos-ink/10 bg-card p-6 text-sm text-chronos-stone/85">
            Tài khoản của bạn chưa có quyền quản trị. Hãy yêu cầu cấp quyền admin để xem danh sách hồ
            sơ.
          </p>
        )}

        {rolesQuery.data === true && (
          <div className="overflow-x-auto border border-chronos-ink/10 bg-card">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-chronos-ink/10 text-xs uppercase tracking-[0.2em] text-chronos-stone/70">
                <tr>
                  <th className="px-5 py-4">Họ tên</th>
                  <th className="px-5 py-4">Liên hệ</th>
                  <th className="px-5 py-4">Vị trí</th>
                  <th className="px-5 py-4">Ngày gửi</th>
                  <th className="px-5 py-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {applicationsQuery.isLoading && (
                  <tr>
                    <td className="px-5 py-6 text-chronos-stone/70" colSpan={5}>
                      Đang tải…
                    </td>
                  </tr>
                )}
                {applicationsQuery.data?.length === 0 && (
                  <tr>
                    <td className="px-5 py-6 text-chronos-stone/70" colSpan={5}>
                      Chưa có hồ sơ nào.
                    </td>
                  </tr>
                )}
                {applicationsQuery.data?.map((row) => (
                  <tr key={row.id} className="border-b border-chronos-ink/5 last:border-0">
                    <td className="px-5 py-4 text-chronos-ink">{row.full_name}</td>
                    <td className="px-5 py-4 text-chronos-stone/85">{row.contact}</td>
                    <td className="px-5 py-4 text-chronos-stone/85">{positionLabel(row.position_id)}</td>
                    <td className="px-5 py-4 text-chronos-stone/70">
                      {new Date(row.created_at).toLocaleString("vi-VN")}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={row.status}
                        onChange={(e) => updateStatus.mutate({ id: row.id, status: e.target.value })}
                        className="border border-chronos-ink/20 bg-transparent px-2 py-1 text-xs text-chronos-ink focus:border-chronos-gold focus:outline-none"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {applicationsQuery.error && (
          <p className="mt-4 text-sm text-destructive">{(applicationsQuery.error as Error).message}</p>
        )}
      </div>
    </main>
  );
}
