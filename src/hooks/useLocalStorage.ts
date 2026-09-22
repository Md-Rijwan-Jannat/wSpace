// ---------------------------------------------------------------------------
// useLocalStorage.ts — Generic localStorage sync hook with debounce
// ---------------------------------------------------------------------------

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DEBOUNCE_MS } from "@/src/lib/constants";

/**
 * Read a value from localStorage (SSR-safe).
 * Returns the parsed value or undefined if not found / corrupted.
 */
function readFromStorage<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    const stored = window.localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored) as T;
    }
  } catch {
    console.warn(`[useLocalStorage] Failed to parse key "${key}", using default`);
  }

  return undefined;
}

/**
 * A generic hook that syncs React state with localStorage.
 * - SSR-safe (uses lazy initialiser to read from localStorage)
 * - Debounced writes to prevent thrashing during rapid mutations
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Lazy initialisation — reads from localStorage on first render only
  const [state, setState] = useState<T>(() => {
    const stored = readFromStorage<T>(key);
    return stored !== undefined ? stored : defaultValue;
  });

  const isInitialised = useRef(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced write to localStorage on state changes
  useEffect(() => {
    if (!isInitialised.current) {
      isInitialised.current = true;
      return;
    }
    if (typeof window === "undefined") return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        console.warn(`[useLocalStorage] Failed to write key "${key}"`);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, state]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState(value);
    },
    []
  );

  return [state, setValue];
}
