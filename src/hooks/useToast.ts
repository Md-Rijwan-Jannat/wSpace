// ---------------------------------------------------------------------------
// useToast.ts — Toast notification state management
// ---------------------------------------------------------------------------

"use client";

import { useState, useCallback, useRef } from "react";
import type { Toast, ToastType } from "@/src/types/workspace";

export interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = `toast-${++counterRef.current}-${Date.now()}`;
    const toast: Toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}
