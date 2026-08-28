import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { pageSeo } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AUTH_SEO = pageSeo({
  title: "Đăng nhập quản trị | Chronos Cruise",
  description: "Khu vực đăng nhập dành cho quản trị viên Chronos Cruise để quản lý hồ sơ ứng tuyển.",
  path: "/auth",
});

export const Route = createFileRoute("/auth")({
  head: () => ({
    ...AUTH_SEO,
    meta: [...AUTH_SEO.meta, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AuthPage,
});


function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/applications", replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin/applications` },
        });
        if (error) throw error;
        toast.success("Đã tạo tài khoản. Kiểm tra email nếu cần xác nhận.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin/applications", replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-chronos-ivory px-6 py-16">
      <div className="w-full max-w-md border border-chronos-ink/10 bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-2xl tracking-[0.02em] text-chronos-ink">Quản trị Chronos</h1>
        <p className="mb-8 text-sm text-chronos-stone/80">
          {mode === "signin" ? "Đăng nhập để xem hồ sơ ứng tuyển." : "Tạo tài khoản quản trị."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="field-underline border-chronos-ink/20 text-chronos-ink focus:border-chronos-gold"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-[0.24em] text-chronos-stone/70">
              Mật khẩu
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="field-underline border-chronos-ink/20 text-chronos-ink focus:border-chronos-gold"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-none bg-chronos-gold text-xs font-semibold uppercase tracking-[0.2em] text-chronos-ink hover:bg-chronos-gold/90"
          >
            {mode === "signin" ? "Đăng nhập" : "Đăng ký"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-center text-xs uppercase tracking-[0.18em] text-chronos-stone/70 hover:text-chronos-ink"
        >
          {mode === "signin" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
        </button>
      </div>
    </main>
  );
}
