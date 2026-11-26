"use client";

import { useEffect, useId } from "react";
import { Button } from "./Button";

export function Modal({ open, title, children, onClose }) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby={titleId} className="glass w-full max-w-3xl rounded-2xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-xl font-semibold text-white">{title}</h2>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
        {children}
      </div>
    </div>
  );
}
