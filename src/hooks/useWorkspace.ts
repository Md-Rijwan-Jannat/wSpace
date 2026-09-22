// ---------------------------------------------------------------------------
// useWorkspace.ts — Core workspace CRUD + state management
// ---------------------------------------------------------------------------

"use client";

import { useReducer, useCallback, useMemo, useEffect, useRef, useState } from "react";
import type {
  WorkspaceItem,
  WorkspaceState,
  WorkspaceAction,
  TreeNodeData,
} from "@/src/types/workspace";
import {
  generateId,
  getChildren,
  buildTree,
  getPathToRoot,
  getAllDescendants,
  validateName,
  getReadablePath,
  countDescendants,
} from "@/src/lib/workspace-utils";
import {
  LEGACY_STORAGE_KEY,
  WORKSPACE_DATA_PREFIX,
  getSeedWorkspaceData,
  getSeedData,
} from "@/src/lib/constants";

// ---- Reducer ---------------------------------------------------------------

function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction
): WorkspaceState {
  switch (action.type) {
    case "LOAD":
      return action.payload;

    case "CREATE": {
      return { ...state, [action.payload.id]: action.payload };
    }

    case "RENAME": {
      const item = state[action.payload.id];
      if (!item) return state;
      return {
        ...state,
        [action.payload.id]: {
          ...item,
          name: action.payload.newName.trim(),
          updatedAt: Date.now(),
        },
      };
    }

    case "DELETE": {
      const next = { ...state };
      for (const id of action.payload.ids) {
        delete next[id];
      }
      return next;
    }

    case "UPDATE_CONTENT": {
      const item = state[action.payload.id];
      if (!item) return state;
      return {
        ...state,
        [action.payload.id]: {
          ...item,
          content: action.payload.content,
          updatedAt: Date.now(),
        },
      };
    }

    default:
      return state;
  }
}

// ---- Hook ------------------------------------------------------------------

export interface UseWorkspaceReturn {
  items: WorkspaceState;
  selectedFolderId: string | null;
  activeFileId: string | null;

  // Actions
  createItem: (
    name: string,
    type: "folder" | "file",
    parentId: string | null
  ) => string | null; // returns error or null
  renameItem: (id: string, newName: string) => string | null;
  deleteItem: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  navigateToFolder: (folderId: string | null) => void;
  openFile: (fileId: string) => void;
  closeFile: () => void;

  // Computed
  currentChildren: WorkspaceItem[];
  breadcrumbPath: WorkspaceItem[];
  treeData: TreeNodeData[];
  getItemById: (id: string) => WorkspaceItem | undefined;
  getDescendantCount: (folderId: string) => number;
  getItemPath: (itemId: string) => string;
}

export function useWorkspace(storageKey?: string): UseWorkspaceReturn {
  const resolvedKey = storageKey || LEGACY_STORAGE_KEY;
  const wsId = resolvedKey.replace(WORKSPACE_DATA_PREFIX, "");

  const [items, dispatch] = useReducer(workspaceReducer, wsId, (id) => {
    return id.startsWith("seed-ws-") ? getSeedWorkspaceData(id) : getSeedData();
  });
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const isLoadedRef = useRef(false);

  // Sync state from localStorage after mount (safe against SSR hydration mismatch)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(resolvedKey);
      if (stored !== null) {
        const parsed = JSON.parse(stored) as WorkspaceState;
        if (parsed && typeof parsed === "object") {
          dispatch({ type: "LOAD", payload: parsed });
        }
      }
    } catch (err) {
      console.warn("[useWorkspace] Failed to load from localStorage", err);
    }
    isLoadedRef.current = true;
  }, [resolvedKey]);

  // Persist to localStorage immediately on any state change after initial load
  useEffect(() => {
    if (!isLoadedRef.current) return;
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(resolvedKey, JSON.stringify(items));
    } catch {
      console.warn("[useWorkspace] Failed to persist to localStorage");
    }
  }, [items, resolvedKey]);

  // ---- Actions ------------------------------------------------------------

  const createItem = useCallback(
    (
      name: string,
      type: "folder" | "file",
      parentId: string | null
    ): string | null => {
      const error = validateName(name, parentId, items);
      if (error) return error;

      const now = Date.now();
      const newItem: WorkspaceItem = {
        id: generateId(),
        name: name.trim(),
        type,
        parentId,
        content: type === "file" ? "" : undefined,
        createdAt: now,
        updatedAt: now,
      };

      dispatch({ type: "CREATE", payload: newItem });
      return null;
    },
    [items]
  );

  const renameItem = useCallback(
    (id: string, newName: string): string | null => {
      const item = items[id];
      if (!item) return "Item not found";

      const error = validateName(newName, item.parentId, items, id);
      if (error) return error;

      dispatch({ type: "RENAME", payload: { id, newName: newName.trim() } });
      return null;
    },
    [items]
  );

  const deleteItem = useCallback(
    (id: string) => {
      const descendants = getAllDescendants(items, id);
      const idsToDelete = [id, ...descendants];

      // If the deleted item is the selected folder, navigate to parent
      if (selectedFolderId && idsToDelete.includes(selectedFolderId)) {
        const deletedItem = items[id];
        setSelectedFolderId(deletedItem?.parentId ?? null);
      }

      // If the deleted item is the active file, close the editor
      if (activeFileId && idsToDelete.includes(activeFileId)) {
        setActiveFileId(null);
      }

      dispatch({ type: "DELETE", payload: { ids: idsToDelete } });
    },
    [items, selectedFolderId, activeFileId]
  );

  const updateFileContent = useCallback((id: string, content: string) => {
    dispatch({ type: "UPDATE_CONTENT", payload: { id, content } });
  }, []);

  const navigateToFolder = useCallback((folderId: string | null) => {
    setSelectedFolderId(folderId);
    setActiveFileId(null); // Close any open file when navigating
  }, []);

  const openFile = useCallback((fileId: string) => {
    setActiveFileId(fileId);
  }, []);

  const closeFile = useCallback(() => {
    setActiveFileId(null);
  }, []);

  // ---- Computed values (memoised) -----------------------------------------

  const currentChildren = useMemo(
    () => getChildren(items, selectedFolderId),
    [items, selectedFolderId]
  );

  const breadcrumbPath = useMemo(
    () => getPathToRoot(items, selectedFolderId),
    [items, selectedFolderId]
  );

  const treeData = useMemo(() => buildTree(items), [items]);

  const getItemById = useCallback(
    (id: string) => items[id],
    [items]
  );

  const getDescendantCount = useCallback(
    (folderId: string) => countDescendants(items, folderId),
    [items]
  );

  const getItemPath = useCallback(
    (itemId: string) => getReadablePath(items, itemId),
    [items]
  );

  return {
    items,
    selectedFolderId,
    activeFileId,
    createItem,
    renameItem,
    deleteItem,
    updateFileContent,
    navigateToFolder,
    openFile,
    closeFile,
    currentChildren,
    breadcrumbPath,
    treeData,
    getItemById,
    getDescendantCount,
    getItemPath,
  };
}
