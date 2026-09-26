"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { createRecoveryClient } from "@/lib/supabase/client";

const REQUEST_MESSAGE = "If that email belongs to the admin account, a six-digit code is on its way.";
const REQUEST_ERROR = "We could not send the reset code. Wait a moment and try again.";
const CODE_ERROR = "That code is invalid or has expired. Request a new code and try again.";

type Step = "email" | "code" | "done";

export function AdminPasswordResetForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const supabaseRef = useRef<ReturnType<typeof createRecoveryClient> | null>(null);

  function getSupabase() {
    supabaseRef.current ??= createRecoveryClient();
    return supabaseRef.current;
  }

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setBusy(true);

    const form = new FormData(event.currentTarget);
    const submittedEmail = String(form.get("email") ?? "").trim().toLowerCase();
    const { error: resetError } = await getSupabase().auth.resetPasswordForEmail(submittedEmail);

    if (resetError) setError(REQUEST_ERROR);
    else {
      setEmail(submittedEmail);
      setMessage(REQUEST_MESSAGE);
      setStep("code");
    }
    setBusy(false);
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const form = new FormData(event.currentTarget);
    const token = String(form.get("code") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("password_confirmation") ?? "");

    if (!/^\d{6}$/.test(token)) {
      setError("Enter the six-digit code from the email.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    const supabase = getSupabase();
    const { data, error: verificationError } = await supabase.auth.verifyOtp({ email, token, type: "recovery" });
    if (verificationError || !data.session) {
      setError(CODE_ERROR);
      setBusy(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("We could not update the password. Request a new code and try again.");
      setBusy(false);
      return;
    }

    await supabase.auth.signOut();
    setMessage("Your password has been updated. Sign in with your new password.");
    setStep("done");
    setBusy(false);
  }

  if (step === "done") {
    return (
      <div>
        <h1>Password updated</h1>
        <div className="admin-success" role="status">{message}</div>
        <Link href="/admin/login" className="admin-primary admin-login-link">Sign in</Link>
      </div>
    );
  }

  if (step === "code") {
    return (
      <form onSubmit={changePassword}>
        <h1>Enter your reset code</h1>
        <p>We sent a six-digit code to {email}. It expires shortly and can only be used once.</p>
        {message ? <div className="admin-success" role="status">{message}</div> : null}
        {error ? <div className="admin-error" role="alert">{error}</div> : null}
        <label>
          Six-digit code
          <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required />
        </label>
        <label>
          New password
          <input name="password" type="password" autoComplete="new-password" minLength={8} required />
        </label>
        <label>
          Confirm password
          <input name="password_confirmation" type="password" autoComplete="new-password" minLength={8} required />
        </label>
        <button type="submit" className="admin-primary" disabled={busy}>
          {busy ? "Saving…" : "Save new password"}
        </button>
        <button type="button" className="admin-login-link" onClick={() => { setStep("email"); setError(""); setMessage(""); }}>
          Request a new code
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={requestCode}>
      <h1>Reset your admin password</h1>
      <p>Enter the email attached to your admin account. We will send you a six-digit reset code.</p>
      {error ? <div className="admin-error" role="alert">{error}</div> : null}
      <label>
        Admin email
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <button type="submit" className="admin-primary" disabled={busy}>
        {busy ? "Sending…" : "Send reset code"}
      </button>
      <Link href="/admin/login" className="admin-login-link">Back to sign in</Link>
    </form>
  );
}
