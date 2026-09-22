// ---------------------------------------------------------------------------
// WorkspaceContext.tsx — React Context wrapping useWorkspace
// ---------------------------------------------------------------------------

"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useWorkspace, type UseWorkspaceReturn } from "@/src/hooks/useWorkspace";

const WorkspaceContext = createContext<UseWorkspaceReturn | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const workspace = useWorkspace();

  return (
    <WorkspaceContext.Provider value={workspace}>
      {children}
    </WorkspaceContext.Provider>
  );
}

/**
 * Access the workspace context.
 * Must be used within a WorkspaceProvider.
 */
export function useWorkspaceContext(): UseWorkspaceReturn {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspaceContext must be used within a WorkspaceProvider");
  }
  return context;
}
