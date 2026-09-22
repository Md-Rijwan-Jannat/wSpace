// ---------------------------------------------------------------------------
// WorkspaceExplorer.tsx — Top-level shell: sidebar + main panel
// ---------------------------------------------------------------------------

"use client";

import { useState, useCallback, useMemo } from "react";
import { WorkspaceProvider } from "@/src/context/WorkspaceContext";
import { ToastProvider } from "@/src/context/ToastContext";
import { Sidebar } from "./Sidebar";
import { MainPanel } from "./MainPanel";
import { SearchOverlay } from "./SearchOverlay";
import { CreateItemDialog } from "./CreateItemDialog";
import { useKeyboard } from "@/src/hooks/useKeyboard";

function WorkspaceShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(min-width: 1024px)").matches;
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDialogType, setCreateDialogType] = useState<"folder" | "file">("folder");

  const handleSearchOpen = useCallback(() => {
    setSearchOpen(true);
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchOpen(false);
  }, []);

  const handleCreateFolder = useCallback(() => {
    setCreateDialogType("folder");
    setCreateDialogOpen(true);
  }, []);

  const handleCreateFile = useCallback(() => {
    setCreateDialogType("file");
    setCreateDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setCreateDialogOpen(false);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  // Global keyboard shortcuts
  const shortcuts = useMemo(
    () => ({
      "mod+k": () => setSearchOpen((prev) => !prev),
      "mod+n": () => {
        setCreateDialogType("folder");
        setCreateDialogOpen(true);
      },
    }),
    []
  );
  useKeyboard(shortcuts);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onSearchOpen={handleSearchOpen}
        onCreateFolder={handleCreateFolder}
        onCreateFile={handleCreateFile}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main panel */}
        <MainPanel
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          onCreateFolder={handleCreateFolder}
        />
      </div>

      {/* Search overlay (command palette) */}
      <SearchOverlay isOpen={searchOpen} onClose={handleSearchClose} />

      {/* Create item dialog modal */}
      <CreateItemDialog
        isOpen={createDialogOpen}
        onClose={handleCloseDialog}
        initialType={createDialogType}
      />
    </div>
  );
}

/**
 * WorkspaceExplorer — Top-level component wrapped in providers.
 * This is what page.tsx renders.
 */
export function WorkspaceExplorer() {
  return (
    <WorkspaceProvider>
      <ToastProvider>
        <WorkspaceShell />
      </ToastProvider>
    </WorkspaceProvider>
  );
}
