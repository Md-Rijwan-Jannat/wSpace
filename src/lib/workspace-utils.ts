// ---------------------------------------------------------------------------
// workspace-utils.ts — Pure helper functions for workspace state manipulation
// ---------------------------------------------------------------------------

import type {
  WorkspaceItem,
  WorkspaceState,
  TreeNodeData,
} from "@/src/types/workspace";

/** Generate a unique ID using the browser crypto API */
export function generateId(): string {
  return crypto.randomUUID();
}

/** Get the file extension from a name (lowercase, including dot) */
export function getFileExtension(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex === 0) return "";
  return name.slice(dotIndex).toLowerCase();
}

/**
 * Get sorted children of a parent.
 * Sort order: folders first, then files, alphabetical within each group.
 */
export function getChildren(
  state: WorkspaceState,
  parentId: string | null
): WorkspaceItem[] {
  const children = Object.values(state).filter(
    (item) => item.parentId === parentId
  );

  return children.sort((a, b) => {
    // Folders come first
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1;
    }
    // Alphabetical within same type
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

/**
 * Build a nested tree structure from the flat state map.
 * Returns root-level nodes (items where parentId is null).
 */
export function buildTree(state: WorkspaceState): TreeNodeData[] {
  const itemMap = new Map<string | "root", TreeNodeData[]>();

  // Initialize all nodes
  for (const item of Object.values(state)) {
    const key = item.parentId ?? "root";
    if (!itemMap.has(key)) {
      itemMap.set(key, []);
    }
  }

  // Create tree nodes
  const nodeMap = new Map<string, TreeNodeData>();
  for (const item of Object.values(state)) {
    nodeMap.set(item.id, { item, children: [] });
  }

  // Wire up parent → children relationships
  for (const item of Object.values(state)) {
    const node = nodeMap.get(item.id)!;
    const parentKey = item.parentId ?? "root";
    if (!itemMap.has(parentKey)) {
      itemMap.set(parentKey, []);
    }
    itemMap.get(parentKey)!.push(node);
  }

  // Assign children to each node
  for (const [id, node] of nodeMap) {
    const childNodes = itemMap.get(id) ?? [];
    node.children = sortTreeNodes(childNodes);
  }

  // Return root level, sorted
  const roots = itemMap.get("root") ?? [];
  return sortTreeNodes(roots);
}

/** Sort tree nodes: folders first, then files, alphabetical */
function sortTreeNodes(nodes: TreeNodeData[]): TreeNodeData[] {
  return [...nodes].sort((a, b) => {
    if (a.item.type !== b.item.type) {
      return a.item.type === "folder" ? -1 : 1;
    }
    return a.item.name.localeCompare(b.item.name, undefined, {
      sensitivity: "base",
    });
  });
}

/**
 * Get the path from an item to the root.
 * Returns an array ordered from root → item (for breadcrumb rendering).
 */
export function getPathToRoot(
  state: WorkspaceState,
  itemId: string | null
): WorkspaceItem[] {
  if (!itemId) return [];

  const path: WorkspaceItem[] = [];
  let currentId: string | null = itemId;

  while (currentId) {
    const item: WorkspaceItem | undefined = state[currentId];
    if (!item) break;
    path.unshift(item);
    currentId = item.parentId;
  }

  return path;
}

/**
 * Get all descendant IDs of a folder (recursive).
 * Used for cascade delete.
 */
export function getAllDescendants(
  state: WorkspaceState,
  folderId: string
): string[] {
  const descendants: string[] = [];
  const stack = [folderId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    const children = Object.values(state).filter(
      (item) => item.parentId === currentId
    );
    for (const child of children) {
      descendants.push(child.id);
      if (child.type === "folder") {
        stack.push(child.id);
      }
    }
  }

  return descendants;
}

/**
 * Validate a name for creation or rename.
 * Returns an error message string, or null if valid.
 */
export function validateName(
  name: string,
  parentId: string | null,
  state: WorkspaceState,
  excludeId?: string
): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Name cannot be empty";
  }

  // Check for duplicate names within the same parent
  const siblings = Object.values(state).filter(
    (item) => item.parentId === parentId && item.id !== excludeId
  );

  const duplicate = siblings.find(
    (item) => item.name.toLowerCase() === trimmed.toLowerCase()
  );

  if (duplicate) {
    return "An item with this name already exists in this folder";
  }

  return null;
}

/**
 * Get human-readable path string for an item.
 * e.g. "Projects / Webbly"
 */
export function getReadablePath(
  state: WorkspaceState,
  itemId: string
): string {
  const path = getPathToRoot(state, itemId);
  // Exclude the item itself, show only ancestors
  const ancestors = path.slice(0, -1);
  if (ancestors.length === 0) return "Workspace";
  return ancestors.map((item) => item.name).join(" / ");
}

/**
 * Count all descendants of a folder.
 */
export function countDescendants(
  state: WorkspaceState,
  folderId: string
): number {
  return getAllDescendants(state, folderId).length;
}
