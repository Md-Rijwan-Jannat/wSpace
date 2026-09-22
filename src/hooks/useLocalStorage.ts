// ---------------------------------------------------------------------------
// useLocalStorage.ts — Generic localStorage sync hook with debounce
// ---------------------------------------------------------------------------

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { DEBOUNCE_MS } from "@/src/lib/constants";

/**
 * A generic hook that syncs React state with localStorage.
 * - SSR-safe (reads from localStorage only after mount)
 * - Debounced writes to prevent thrashing during rapid mutations
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(defaultValue);
  const isInitialised = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage on mount (SSR-safe)
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as T;
        setState(parsed);
      }
    } catch {
      // Corrupted data — fall back to default
      console.warn(`[useLocalStorage] Failed to parse key "${key}", using default`);
    }

    isInitialised.current = true;
  }, [key]);

  // Debounced write to localStorage on state changes
  useEffect(() => {
    if (!isInitialised.current) return;
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
