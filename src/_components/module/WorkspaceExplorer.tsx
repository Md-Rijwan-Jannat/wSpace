// ---------------------------------------------------------------------------
// WorkspaceExplorer.tsx — Top-level shell: sidebar + main panel
// ---------------------------------------------------------------------------

"use client";

import { useState, useCallback, useMemo } from "react";
import { WorkspaceProvider, useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { ToastProvider } from "@/src/context/ToastContext";
import { Sidebar } from "./Sidebar";
import { MainPanel } from "./MainPanel";
import { SearchOverlay } from "./SearchOverlay";
import { useKeyboard } from "@/src/hooks/useKeyboard";
import { MenuIcon } from "@/src/_components/ui/icons/Icons";

function WorkspaceShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { navigateToFolder } = useWorkspaceContext();

  const handleSearchOpen = useCallback(() => {
    setSearchOpen(true);
    setSidebarOpen(false);
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchOpen(false);
  }, []);

  // Global keyboard shortcuts
  const shortcuts = useMemo(
    () => ({
      "mod+k": () => setSearchOpen((prev) => !prev),
    }),
    []
  );
  useKeyboard(shortcuts);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSearchOpen={handleSearchOpen}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-surface">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md hover:bg-surface-hover transition-colors"
            aria-label="Open sidebar"
          >
            <MenuIcon size={22} />
          </button>
          <button
            onClick={() => navigateToFolder(null)}
            className="text-[15px] font-bold text-text-primary tracking-tight"
          >
            wSpace
          </button>
        </div>

        {/* Main panel */}
        <MainPanel />
      </div>

      {/* Search overlay (command palette) */}
      <SearchOverlay isOpen={searchOpen} onClose={handleSearchClose} />
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
