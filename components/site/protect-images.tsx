"use client";

import { useEffect } from "react";

/**
 * Light friction against casual image saving: blocks the context menu and drag
 * on protected media. Not a security control — a determined user can still get
 * the bytes — but it stops right-click "Save image as" and drag-to-desktop.
 */
export function ProtectImages() {
  useEffect(() => {
    const stop = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      if (t.tagName === "IMG" || t.closest("[data-protected]")) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", stop);
    document.addEventListener("dragstart", stop);
    return () => {
      document.removeEventListener("contextmenu", stop);
      document.removeEventListener("dragstart", stop);
    };
  }, []);

  return null;
}
