// ---------------------------------------------------------------------------
// ToastContext.tsx — Toast notification Context provider
// ---------------------------------------------------------------------------

"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useToast, type UseToastReturn } from "@/src/hooks/useToast";

const ToastContext = createContext<UseToastReturn | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container — renders at top-right of viewport */}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.dismissToast} />
    </ToastContext.Provider>
  );
}

/**
 * Access the toast context.
 * Must be used within a ToastProvider.
 */
export function useToastContext(): UseToastReturn {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}

// ---- Toast Container (renders floating toast stack) -----------------------

import type { Toast } from "@/src/types/workspace";

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto flex items-center gap-3 rounded-md px-3.5 py-2.5 shadow-md
            text-sm font-medium animate-slide-in-right min-w-[280px] max-w-[400px]
            ${toast.type === "success" ? "bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]" : ""}
            ${toast.type === "error" ? "bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]" : ""}
            ${toast.type === "info" ? "bg-[#ede9f9] text-[#4c35ae] border border-[#c4b5fd]" : ""}
          `}
        >
          {/* Icon */}
          <span className="shrink-0 text-base">
            {toast.type === "success" && "✓"}
            {toast.type === "error" && "✕"}
            {toast.type === "info" && "ℹ"}
          </span>

          <span className="flex-1">{toast.message}</span>

          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 ml-2 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
