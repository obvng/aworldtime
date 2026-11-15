import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_SESSION_COOKIE_OPTIONS } from "@/lib/supabase/session-options";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase public environment variables are missing.");
  return createBrowserClient(url, key, { cookieOptions: SUPABASE_SESSION_COOKIE_OPTIONS });
}

export function createRecoveryClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase public environment variables are missing.");
  return createBrowserClient(url, key, { auth: { flowType: "implicit" }, cookieOptions: SUPABASE_SESSION_COOKIE_OPTIONS, isSingleton: false });
}
