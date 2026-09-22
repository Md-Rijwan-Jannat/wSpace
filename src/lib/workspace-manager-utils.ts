// ---------------------------------------------------------------------------
// workspace-manager-utils.ts — Pure helper functions for multi-workspace management
// ---------------------------------------------------------------------------

import type { WorkspaceMeta, WorkspaceRegistry, WorkspaceState } from "@/src/types/workspace";
import {
  WORKSPACE_REGISTRY_KEY,
  WORKSPACE_DATA_PREFIX,
  LEGACY_STORAGE_KEY,
  DEFAULT_WORKSPACE_NAME,
  DEFAULT_WORKSPACE_EMOJI,
  DEFAULT_WORKSPACE_COLOR,
  getSeedData,
} from "@/src/lib/constants";

/**
 * Generate a unique workspace ID.
 */
export function generateWorkspaceId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "ws-" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Returns the localStorage key for a workspace's file/folder data.
 */
export function getStorageKeyForWorkspace(workspaceId: string): string {
  return `${WORKSPACE_DATA_PREFIX}${workspaceId}`;
}

/**
 * Create a new WorkspaceMeta object.
 */
export function createWorkspaceMeta(
  name: string,
  color = DEFAULT_WORKSPACE_COLOR,
  initialItemCount = 0,
  emoji?: string
): WorkspaceMeta {
  const now = Date.now();
  return {
    id: generateWorkspaceId(),
    name: name.trim(),
    color,
    emoji,
    createdAt: now,
    updatedAt: now,
    itemCount: initialItemCount,
  };
}

/**
 * Validate workspace name:
 * - Must not be empty
 * - Trim whitespace
 * - Must be unique among existing workspaces (case-insensitive)
 */
export function validateWorkspaceName(
  name: string,
  existingWorkspaces: WorkspaceMeta[],
  excludeId?: string
): string | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return "Workspace name cannot be empty.";
  }
  if (trimmed.length > 32) {
    return "Workspace name cannot exceed 32 characters.";
  }

  const isDuplicate = existingWorkspaces.some(
    (ws) => ws.id !== excludeId && ws.name.toLowerCase() === trimmed.toLowerCase()
  );

  if (isDuplicate) {
    return `A workspace named "${trimmed}" already exists.`;
  }

  return null;
}

/**
 * Calculates how many items (files + folders) are inside a workspace's data in localStorage.
 */
export function getWorkspaceItemCount(workspaceId: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(getStorageKeyForWorkspace(workspaceId));
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as WorkspaceState;
    return Object.keys(parsed).length;
  } catch {
    return 0;
  }
}

/**
 * Deletes a workspace's data key from localStorage.
 */
export function deleteWorkspaceData(workspaceId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(getStorageKeyForWorkspace(workspaceId));
  } catch (err) {
    console.warn("[deleteWorkspaceData] Failed to remove workspace data", err);
  }
}

/**
 * Saves the registry to localStorage.
 */
export function saveRegistry(registry: WorkspaceRegistry): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(WORKSPACE_REGISTRY_KEY, JSON.stringify(registry));
  } catch (err) {
    console.warn("[saveRegistry] Failed to save registry to localStorage", err);
  }
}

/**
 * Loads the registry from localStorage.
 * If none exists, handles migration from legacy single-workspace or initializes default.
 */
export function loadRegistry(): WorkspaceRegistry {
  if (typeof window === "undefined") {
    const defaultMeta = createWorkspaceMeta(DEFAULT_WORKSPACE_NAME, DEFAULT_WORKSPACE_COLOR, 0);
    return {
      workspaces: [defaultMeta],
      activeWorkspaceId: defaultMeta.id,
    };
  }

  try {
    const stored = window.localStorage.getItem(WORKSPACE_REGISTRY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as WorkspaceRegistry;
      if (parsed && Array.isArray(parsed.workspaces) && parsed.workspaces.length > 0) {
        // Ensure activeWorkspaceId is valid
        const activeExists = parsed.workspaces.some((ws) => ws.id === parsed.activeWorkspaceId);
        if (!activeExists) {
          parsed.activeWorkspaceId = parsed.workspaces[0].id;
        }
        // Update item counts dynamically
        parsed.workspaces = parsed.workspaces.map((ws) => ({
          ...ws,
          itemCount: getWorkspaceItemCount(ws.id),
        }));
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[loadRegistry] Failed to parse registry from localStorage", err);
  }

  // Check for legacy migration
  let initialData: WorkspaceState | null = null;
  try {
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      initialData = JSON.parse(legacy) as WorkspaceState;
    }
  } catch {
    // Ignore error
  }

  if (!initialData) {
    initialData = getSeedData();
  }

  const initialCount = Object.keys(initialData).length;
  const initialMeta = createWorkspaceMeta(
    DEFAULT_WORKSPACE_NAME,
    DEFAULT_WORKSPACE_COLOR,
    initialCount
  );

  // Store workspace data under new key
  try {
    window.localStorage.setItem(
      getStorageKeyForWorkspace(initialMeta.id),
      JSON.stringify(initialData)
    );
  } catch (err) {
    console.warn("[loadRegistry] Failed to seed initial workspace data", err);
  }

  const newRegistry: WorkspaceRegistry = {
    workspaces: [initialMeta],
    activeWorkspaceId: initialMeta.id,
  };

  saveRegistry(newRegistry);
  return newRegistry;
}
