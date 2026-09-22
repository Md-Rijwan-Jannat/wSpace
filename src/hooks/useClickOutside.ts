// ---------------------------------------------------------------------------
// useClickOutside.ts — Detect clicks outside a referenced element
// ---------------------------------------------------------------------------

"use client";

import { useEffect, type RefObject } from "react";

/**
 * Calls `callback` when a click occurs outside the element referenced by `ref`.
 * Used for closing rename inputs, dropdown menus, search overlays, etc.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  callback: () => void
): void {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}
