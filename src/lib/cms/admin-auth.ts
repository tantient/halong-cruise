/**
 * Admin authorisation for CMS server functions.
 *
 * Every CMS mutation/read goes through `requireAdmin`: the request must carry a
 * valid Supabase session (validated by `requireSupabaseAuth`) AND the user must
 * hold the `admin` role in `user_roles`. The role is read server-side with the
 * security-definer `has_role` function; the client never sends a role.
 *
 * Row Level Security on every table is the second, independent line of defence.
 */

import { createMiddleware } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error("Forbidden: could not verify admin role");
    if (data !== true) throw new Error("Forbidden: admin role required");
    return next({ context });
  });
