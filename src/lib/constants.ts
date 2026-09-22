// ---------------------------------------------------------------------------
// constants.ts — App-wide constants and seed data
// ---------------------------------------------------------------------------

import type { WorkspaceState } from "@/src/types/workspace";

/** localStorage key for persisting workspace data */
export const STORAGE_KEY = "wspace-workspace-data";

/** Debounce delay for localStorage writes (ms) */
export const DEBOUNCE_MS = 300;

/** Debounce delay for search input (ms) */
export const SEARCH_DEBOUNCE_MS = 250;

/**
 * Default seed workspace data for first-time users.
 * Gives the app a "lived-in" feel instead of an empty state.
 */
export function getSeedData(): WorkspaceState {
  const now = Date.now();

  return {
    "folder-projects": {
      id: "folder-projects",
      name: "Projects",
      type: "folder",
      parentId: null,
      createdAt: now,
      updatedAt: now,
    },
    "folder-webbly": {
      id: "folder-webbly",
      name: "Webbly",
      type: "folder",
      parentId: "folder-projects",
      createdAt: now,
      updatedAt: now,
    },
    "file-notes": {
      id: "file-notes",
      name: "notes.txt",
      type: "file",
      parentId: "folder-webbly",
      content:
        "Meeting notes from today:\n- Discussed new workspace explorer design\n- Agreed on purple color theme\n- Next sprint starts Monday",
      createdAt: now,
      updatedAt: now,
    },
    "file-tasks": {
      id: "file-tasks",
      name: "tasks.txt",
      type: "file",
      parentId: "folder-webbly",
      content:
        "TODO:\n[x] Set up project structure\n[x] Design component architecture\n[ ] Implement sidebar tree view\n[ ] Build file editor\n[ ] Add search functionality",
      createdAt: now,
      updatedAt: now,
    },
    "folder-personal": {
      id: "folder-personal",
      name: "Personal",
      type: "folder",
      parentId: "folder-projects",
      createdAt: now,
      updatedAt: now,
    },
    "folder-documents": {
      id: "folder-documents",
      name: "Documents",
      type: "folder",
      parentId: null,
      createdAt: now,
      updatedAt: now,
    },
    "file-readme": {
      id: "file-readme",
      name: "README.txt",
      type: "file",
      parentId: null,
      content:
        "Welcome to wSpace!\n\nThis is your personal workspace explorer.\nYou can create folders, text files, and organise your work.\n\nTip: Use Ctrl+K (or Cmd+K) to search across all your files.",
      createdAt: now,
      updatedAt: now,
    },
  };
}
