import { createClient, hasSupabaseConfig } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export class AdminAuthError extends Error {
  constructor(public status: 401 | 403, message: string) {
    super(message);
    this.name = "AdminAuthError";
  }
}

export async function requireAdmin() {
  if (!hasSupabaseConfig()) throw new AdminAuthError(401, "Supabase is not connected.");

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) throw new AdminAuthError(401, "Sign in to continue.");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
  if (profile?.role !== "admin") throw new AdminAuthError(403, "Administrator access is required.");

  return { supabase, userId };
}

export function adminAuthResponse(error: unknown) {
  if (error instanceof AdminAuthError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  throw error;
}

export async function requireAdminPage() {
  try {
    return await requireAdmin();
  } catch (error) {
    if (error instanceof AdminAuthError) redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
    throw error;
  }
}
