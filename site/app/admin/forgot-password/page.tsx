import type { Metadata } from "next";
import Link from "next/link";
import { AdminPasswordResetForm } from "@/components/admin/admin-password-reset-form";

export const metadata: Metadata = {
  title: "Reset admin password | AWORLDTIME.COM",
  robots: { index: false, follow: false },
};

export default function AdminForgotPasswordPage() {
  return (
    <main className="admin-login">
      <Link href="/" className="admin-brand">AWORLDTIME.COM</Link>
      <AdminPasswordResetForm />
    </main>
  );
}
