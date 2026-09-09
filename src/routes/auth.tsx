import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy sign-in path. The platform admin sign-in now lives at /admin/login,
 * which is also where the protected `_authenticated` layout sends visitors.
 */
export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/login", replace: true });
  },
});
