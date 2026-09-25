"use client";

import { useRef } from "react";

import { deletePost } from "@/app/admin/actions";

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => dialogRef.current?.showModal()}>Delete</button>
      <dialog ref={dialogRef} className="delete-dialog">
        <div className="delete-dialog-body">
          <h2>Delete this article?</h2>
          <p>“{title}” will be permanently removed.</p>
          <div className="delete-dialog-actions">
            <form method="dialog">
            <button type="submit">Cancel</button>
            </form>
            <form action={deletePost.bind(null, id)}>
              <button type="submit" className="delete-confirm">Delete article</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
