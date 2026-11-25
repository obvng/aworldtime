"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { savePageSeoOverride, type SavePageSeoState } from "@/app/admin/actions";

const initialState: SavePageSeoState = { status: "idle" };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button className="admin-primary" type="submit" disabled={pending} aria-disabled={pending}>
      {pending ? "Saving to database…" : "Save SEO settings"}
    </button>
  );
}

export function AdminPageSeoForm({ path, title, description, countryText }: { path: string; title: string; description: string; countryText?: string | null }) {
  const [state, formAction] = useActionState(savePageSeoOverride, initialState);

  return (
    <form action={formAction} className="admin-seo-form">
      <input type="hidden" name="path" value={path} />
      <label>SEO title<input name="seo_title" required minLength={10} maxLength={70} defaultValue={title} /></label>
      <label>Meta description<textarea name="meta_description" required minLength={50} maxLength={170} defaultValue={description} rows={5} /></label>
      {path.startsWith("/time-in/") ? (
        <label>Unique country page text<textarea name="country_text" minLength={40} maxLength={5000} defaultValue={countryText ?? ""} rows={9} placeholder="Add facts, context or travel notes that are specific to this country." /></label>
      ) : null}
      <SaveButton />
      {state.status === "success" ? <div className="admin-success" role="status">Saved to the database. Reloading this page will keep these exact values.</div> : null}
      {state.status === "error" ? <div className="admin-error" role="alert">{state.message}</div> : null}
    </form>
  );
}
