// ---------------------------------------------------------------------------
// useKeyboard.ts — Global keyboard shortcut handler
// ---------------------------------------------------------------------------

"use client";

import { useEffect } from "react";

interface ShortcutMap {
  [key: string]: () => void;
}

/**
 * Register global keyboard shortcuts.
 * Keys should use the format: "mod+k" (mod = Ctrl on Win/Linux, Cmd on Mac)
 * Other formats: "escape", "enter", "delete", "mod+n", "mod+s"
 */
export function useKeyboard(shortcuts: ShortcutMap): void {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isMod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();

      // Build the shortcut string
      let shortcutKey = "";
      if (isMod) shortcutKey += "mod+";
      if (event.shiftKey) shortcutKey += "shift+";
      shortcutKey += key;

      // Check if this shortcut is registered
      const handler = shortcuts[shortcutKey];
      if (handler) {
        event.preventDefault();
        event.stopPropagation();
        handler();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}
