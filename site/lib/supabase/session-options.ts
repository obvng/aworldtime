import type { CookieOptionsWithName } from "@supabase/ssr";

export const ADMIN_SESSION_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;

export const SUPABASE_SESSION_COOKIE_OPTIONS: CookieOptionsWithName = {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
};
