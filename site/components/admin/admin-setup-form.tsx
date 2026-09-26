"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminSetupForm({ mode = "setup" }: { mode?: "setup" | "reset" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("password_confirmation") ?? "");
    const isRecovery = mode === "reset";

    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const code = new URLSearchParams(window.location.search).get("code");
    const sessionResult = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.getSession();
    const invalidLinkMessage = isRecovery
      ? "This reset link is invalid or has expired. Request a new reset link."
      : "This invitation link is invalid or has expired. Request a new invitation.";

    if ("error" in sessionResult && sessionResult.error) {
      setError(invalidLinkMessage);
      setSaving(false);
      return;
    }
    if (!sessionResult.data.session) {
      setError(invalidLinkMessage);
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    router.replace(isRecovery ? "/admin/login?reset=success" : "/admin");
  }

  return (
    <form onSubmit={submit}>
      <h1>{mode === "reset" ? "Choose a new password" : "Create your admin password"}</h1>
      <p>Choose the password you will use to publish and manage articles.</p>
      {error ? <div className="admin-error" role="alert">{error}</div> : null}
      <label>
        New password
        <input name="password" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      <label>
        Confirm password
        <input name="password_confirmation" type="password" autoComplete="new-password" minLength={8} required />
      </label>
      <button type="submit" className="admin-primary" disabled={saving}>
        {saving ? "Saving…" : mode === "reset" ? "Save new password" : "Create admin password"}
      </button>
    </form>
  );
}
