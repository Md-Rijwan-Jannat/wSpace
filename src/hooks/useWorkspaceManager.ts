// ---------------------------------------------------------------------------
// useWorkspaceManager.ts — Multi-workspace management hook
// ---------------------------------------------------------------------------

import { useState, useEffect, useCallback, useMemo } from "react";
import type { WorkspaceMeta, WorkspaceRegistry } from "@/src/types/workspace";
import {
  loadRegistry,
  saveRegistry,
  createWorkspaceMeta,
  validateWorkspaceName,
  deleteWorkspaceData,
  getStorageKeyForWorkspace,
  getWorkspaceItemCount,
} from "@/src/lib/workspace-manager-utils";
import {
  DEFAULT_WORKSPACE_EMOJI,
  DEFAULT_WORKSPACE_COLOR,
} from "@/src/lib/constants";

export interface UseWorkspaceManagerReturn {
  isLoaded: boolean;
  registry: WorkspaceRegistry;
  workspaces: WorkspaceMeta[];
  activeWorkspace: WorkspaceMeta | undefined;
  activeWorkspaceId: string;
  createWorkspace: (
    name: string,
    color?: string,
    emoji?: string
  ) => { success: boolean; error?: string; workspace?: WorkspaceMeta };
  switchWorkspace: (workspaceId: string) => void;
  renameWorkspace: (id: string, newName: string) => { success: boolean; error?: string };
  updateWorkspaceAppearance: (
    id: string,
    color: string,
    emoji?: string
  ) => { success: boolean; error?: string };
  deleteWorkspace: (id: string) => { success: boolean; error?: string };
  refreshItemCounts: () => void;
}

export function useWorkspaceManager(): UseWorkspaceManagerReturn {
  const [registry, setRegistry] = useState<WorkspaceRegistry>(() => {
    return loadRegistry();
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load / sync on mount
  useEffect(() => {
    const loaded = loadRegistry();
    setRegistry(loaded);
    setIsLoaded(true);
  }, []);

  const activeWorkspace = useMemo(() => {
    return (
      registry.workspaces.find((ws) => ws.id === registry.activeWorkspaceId) ||
      registry.workspaces[0]
    );
  }, [registry]);

  const refreshItemCounts = useCallback(() => {
    setRegistry((prev) => {
      const updatedWorkspaces = prev.workspaces.map((ws) => ({
        ...ws,
        itemCount: getWorkspaceItemCount(ws.id),
      }));
      const next = { ...prev, workspaces: updatedWorkspaces };
      saveRegistry(next);
      return next;
    });
  }, []);

  const createWorkspace = useCallback(
    (
      name: string,
      colorOrEmoji = DEFAULT_WORKSPACE_COLOR,
      optionalColor?: string
    ) => {
      const error = validateWorkspaceName(name, registry.workspaces);
      if (error) {
        return { success: false, error };
      }

      let finalColor = DEFAULT_WORKSPACE_COLOR;
      let finalEmoji: string | undefined = undefined;

      if (colorOrEmoji.startsWith("#") || colorOrEmoji.startsWith("rgb")) {
        finalColor = colorOrEmoji;
        finalEmoji = optionalColor;
      } else {
        finalEmoji = colorOrEmoji;
        finalColor = optionalColor || DEFAULT_WORKSPACE_COLOR;
      }

      const newMeta = createWorkspaceMeta(name, finalColor, 0, finalEmoji);

      // Pre-initialize empty workspace data
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            getStorageKeyForWorkspace(newMeta.id),
            JSON.stringify({})
          );
        } catch (err) {
          console.warn("[createWorkspace] Failed to initialize storage", err);
        }
      }

      setRegistry((prev) => {
        const next: WorkspaceRegistry = {
          workspaces: [...prev.workspaces, newMeta],
          activeWorkspaceId: newMeta.id,
        };
        saveRegistry(next);
        return next;
      });

      return { success: true, workspace: newMeta };
    },
    [registry.workspaces]
  );

  const switchWorkspace = useCallback((workspaceId: string) => {
    setRegistry((prev) => {
      if (prev.activeWorkspaceId === workspaceId) return prev;
      const target = prev.workspaces.find((ws) => ws.id === workspaceId);
      if (!target) return prev;

      const next: WorkspaceRegistry = {
        ...prev,
        activeWorkspaceId: workspaceId,
        // Update item count for the workspace we're switching to
        workspaces: prev.workspaces.map((ws) =>
          ws.id === workspaceId ? { ...ws, itemCount: getWorkspaceItemCount(ws.id) } : ws
        ),
      };
      saveRegistry(next);
      return next;
    });
  }, []);

  const renameWorkspace = useCallback(
    (id: string, newName: string) => {
      const error = validateWorkspaceName(newName, registry.workspaces, id);
      if (error) {
        return { success: false, error };
      }

      setRegistry((prev) => {
        const nextWorkspaces = prev.workspaces.map((ws) =>
          ws.id === id ? { ...ws, name: newName.trim(), updatedAt: Date.now() } : ws
        );
        const next = { ...prev, workspaces: nextWorkspaces };
        saveRegistry(next);
        return next;
      });

      return { success: true };
    },
    [registry.workspaces]
  );

  const updateWorkspaceAppearance = useCallback(
    (id: string, color: string, emoji?: string) => {
      setRegistry((prev) => {
        const nextWorkspaces = prev.workspaces.map((ws) =>
          ws.id === id ? { ...ws, color, ...(emoji ? { emoji } : {}), updatedAt: Date.now() } : ws
        );
        const next = { ...prev, workspaces: nextWorkspaces };
        saveRegistry(next);
        return next;
      });

      return { success: true };
    },
    []
  );

  const deleteWorkspace = useCallback((id: string) => {
    let result: { success: boolean; error?: string } = { success: false };

    setRegistry((prev) => {
      if (prev.workspaces.length <= 1) {
        result = { success: false, error: "You cannot delete your only workspace." };
        return prev;
      }

      const remaining = prev.workspaces.filter((ws) => ws.id !== id);
      if (remaining.length === prev.workspaces.length) {
        result = { success: false, error: "Workspace not found." };
        return prev;
      }

      deleteWorkspaceData(id);

      const nextActiveId =
        prev.activeWorkspaceId === id ? remaining[0].id : prev.activeWorkspaceId;

      const next: WorkspaceRegistry = {
        workspaces: remaining,
        activeWorkspaceId: nextActiveId,
      };

      saveRegistry(next);
      result = { success: true };
      return next;
    });

    return result;
  }, []);

  return {
    isLoaded,
    registry,
    workspaces: registry.workspaces,
    activeWorkspace,
    activeWorkspaceId: registry.activeWorkspaceId,
    createWorkspace,
    switchWorkspace,
    renameWorkspace,
    updateWorkspaceAppearance,
    deleteWorkspace,
    refreshItemCounts,
  };
}
