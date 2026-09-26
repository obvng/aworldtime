import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Admin sign in | AWORLDTIME.COM", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string; reset?: string }> }) {
  const { error, reset } = await searchParams;
  return <main className="admin-login"><Link href="/" className="admin-brand">AWORLDTIME.COM</Link><form action={signIn}><h1>Blog admin</h1><p>Sign in to write, schedule, and optimize articles.</p>{reset === "success" ? <div className="admin-success" role="status">Your password has been updated. Sign in with your new password.</div> : null}{error ? <div className="admin-error" role="alert">{error}</div> : null}<label>Email<input name="email" type="email" autoComplete="email" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><Link href="/admin/forgot-password" className="admin-forgot-link">Forgot password?</Link><button type="submit" className="admin-primary">Sign in</button></form></main>;
}
