// ---------------------------------------------------------------------------
// WorkspaceItem — flat data model for the workspace explorer
// ---------------------------------------------------------------------------

export type ItemType = "folder" | "file";

export interface WorkspaceItem {
  id: string;
  name: string;
  type: ItemType;
  parentId: string | null; // null = root-level item
  content?: string; // only for type: "file"
  createdAt: number; // Date.now()
  updatedAt: number; // Date.now()
}

/** Flat map — O(1) lookups by ID */
export type WorkspaceState = Record<string, WorkspaceItem>;

/** Tree node used for rendering the sidebar tree view */
export interface TreeNodeData {
  item: WorkspaceItem;
  children: TreeNodeData[];
}

/** All actions the workspace reducer can handle */
export type WorkspaceAction =
  | { type: "LOAD"; payload: WorkspaceState }
  | { type: "CREATE"; payload: WorkspaceItem }
  | { type: "RENAME"; payload: { id: string; newName: string } }
  | { type: "DELETE"; payload: { ids: string[] } }
  | { type: "UPDATE_CONTENT"; payload: { id: string; content: string } };

/** Search result returned by useSearch */
export interface SearchResult {
  id: string;
  name: string;
  type: ItemType;
  path: string; // human-readable path e.g. "Projects / Webbly"
}

/** Toast notification */
export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// ── Multi-Workspace Types ──────────────────────────────────────

/** Metadata for each workspace (stored in a central registry) */
export interface WorkspaceMeta {
  id: string;
  name: string;
  emoji?: string;
  color: string;
  createdAt: number;
  updatedAt: number;
  itemCount: number;
}

/** Registry stored in localStorage */
export interface WorkspaceRegistry {
  workspaces: WorkspaceMeta[];
  activeWorkspaceId: string;
}
