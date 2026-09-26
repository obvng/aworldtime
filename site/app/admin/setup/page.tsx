import type { Metadata } from "next";
import Link from "next/link";
import { AdminSetupForm } from "@/components/admin/admin-setup-form";

export const metadata: Metadata = {
  title: "Set up blog admin | AWORLDTIME.COM",
  robots: { index: false, follow: false },
};

export default async function AdminSetupPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  return (
    <main className="admin-login">
      <Link href="/" className="admin-brand">AWORLDTIME.COM</Link>
      <AdminSetupForm mode={mode === "reset" ? "reset" : "setup"} />
    </main>
  );
}
