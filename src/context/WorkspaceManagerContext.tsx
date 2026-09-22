// ---------------------------------------------------------------------------
// WorkspaceManagerContext.tsx — Context provider for multi-workspace management
// ---------------------------------------------------------------------------

"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  useWorkspaceManager,
  type UseWorkspaceManagerReturn,
} from "@/src/hooks/useWorkspaceManager";

const WorkspaceManagerContext = createContext<UseWorkspaceManagerReturn | null>(null);

export function WorkspaceManagerProvider({ children }: { children: ReactNode }) {
  const manager = useWorkspaceManager();

  return (
    <WorkspaceManagerContext.Provider value={manager}>
      {children}
    </WorkspaceManagerContext.Provider>
  );
}

/**
 * Hook to access multi-workspace manager state and operations.
 */
export function useWorkspaceManagerContext(): UseWorkspaceManagerReturn {
  const context = useContext(WorkspaceManagerContext);
  if (!context) {
    throw new Error(
      "useWorkspaceManagerContext must be used within a WorkspaceManagerProvider"
    );
  }
  return context;
}
