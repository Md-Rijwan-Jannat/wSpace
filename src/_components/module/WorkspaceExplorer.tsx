// ---------------------------------------------------------------------------
// WorkspaceExplorer.tsx — Top-level shell: sidebar + main panel
// ---------------------------------------------------------------------------

"use client";

import { useState, useCallback, useMemo } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const handleMobileToggle = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  const handleMobileClose = useCallback(() => {
    setMobileOpen(false);
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
      {/* Desktop sidebar — always in layout, toggles collapsed */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onSearchOpen={handleSearchOpen}
          onCreateFolder={handleCreateFolder}
          onCreateFile={handleCreateFile}
        />
      </div>

      {/* Mobile sidebar — overlay, hidden by default */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 animate-fade-in"
            onClick={handleMobileClose}
          />
          {/* Sidebar panel */}
          <div className="relative z-10">
            <Sidebar
              isCollapsed={false}
              onSearchOpen={handleSearchOpen}
              onCreateFolder={handleCreateFolder}
              onCreateFile={handleCreateFile}
            />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <MainPanel
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          onMobileToggle={handleMobileToggle}
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
