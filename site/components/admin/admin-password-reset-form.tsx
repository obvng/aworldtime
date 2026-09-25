"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const REQUEST_MESSAGE = "If that email belongs to the admin account, a reset link is on its way.";
const ERROR_MESSAGE = "We could not send the reset email. Wait a moment and try again.";

export function AdminPasswordResetForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSending(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const redirectTo = `${window.location.origin}/admin/setup?mode=reset`;
    const { error: resetError } = await createClient().auth.resetPasswordForEmail(email, { redirectTo });

    if (resetError) setError(ERROR_MESSAGE);
    else setMessage(REQUEST_MESSAGE);
    setSending(false);
  }

  return (
    <form onSubmit={submit}>
      <h1>Reset your admin password</h1>
      <p>Enter the email attached to your admin account. We will send you a secure reset link.</p>
      {message ? <div className="admin-success" role="status">{message}</div> : null}
      {error ? <div className="admin-error" role="alert">{error}</div> : null}
      <label>
        Admin email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <button type="submit" className="admin-primary" disabled={sending}>
        {sending ? "Sending…" : "Send reset link"}
      </button>
      <Link href="/admin/login" className="admin-login-link">Back to sign in</Link>
    </form>
  );
}
