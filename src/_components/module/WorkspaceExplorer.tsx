// ---------------------------------------------------------------------------
// WorkspaceExplorer.tsx — Top-level shell: sidebar + main panel
// ---------------------------------------------------------------------------

"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { WorkspaceManagerProvider, useWorkspaceManagerContext } from "@/src/context/WorkspaceManagerContext";
import { WorkspaceProvider } from "@/src/context/WorkspaceContext";
import { ToastProvider } from "@/src/context/ToastContext";
import { getStorageKeyForWorkspace } from "@/src/lib/workspace-manager-utils";
import { Sidebar } from "./Sidebar";
import { MainPanel } from "./MainPanel";
import { SearchOverlay } from "./SearchOverlay";
import { CreateItemDialog } from "./CreateItemDialog";
import { useKeyboard } from "@/src/hooks/useKeyboard";

function WorkspaceShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createDialogType, setCreateDialogType] = useState<"folder" | "file">("folder");

  // On mobile (< 1024px), automatically collapse sidebar by default
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const handler = (e: MediaQueryListEvent) => {
      setSidebarCollapsed(e.matches);
    };

    // Defer initial check to next tick to avoid synchronous setState cascade
    const timer = setTimeout(() => {
      if (mediaQuery.matches) {
        setSidebarCollapsed(true);
      }
    }, 0);

    mediaQuery.addEventListener("change", handler);
    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

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
    <div className="flex h-screen w-full overflow-x-auto overflow-y-hidden bg-surface">
      {/* Sidebar — always in layout, collapsed on mobile, expandable on demand */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        onSearchOpen={handleSearchOpen}
        onCreateFolder={handleCreateFolder}
        onCreateFile={handleCreateFile}
      />

      {/* Main area — min-w-[320px] ensures content never breaks or crushes when sidebar expands */}
      <div className="flex-1 flex flex-col min-w-[320px] h-full overflow-hidden">
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

function WorkspaceContent() {
  const { activeWorkspaceId } = useWorkspaceManagerContext();
  const storageKey = getStorageKeyForWorkspace(activeWorkspaceId);

  return (
    <WorkspaceProvider key={activeWorkspaceId} storageKey={storageKey}>
      <WorkspaceShell />
    </WorkspaceProvider>
  );
}

/**
 * WorkspaceExplorer — Top-level component wrapped in providers.
 * This is what page.tsx renders.
 */
export function WorkspaceExplorer() {
  return (
    <WorkspaceManagerProvider>
      <ToastProvider>
        <WorkspaceContent />
      </ToastProvider>
    </WorkspaceManagerProvider>
  );
}
