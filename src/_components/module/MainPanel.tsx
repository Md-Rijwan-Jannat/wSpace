// ---------------------------------------------------------------------------
// MainPanel.tsx — Right panel: breadcrumb, toolbar, content area
// ---------------------------------------------------------------------------

"use client";

import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { Breadcrumb } from "./Breadcrumb";
import { ItemList } from "./ItemList";
import { FileEditor } from "./FileEditor";
import {
  SidebarToggleLeftIcon,
  SidebarToggleRightIcon,
  MenuIcon,
} from "@/src/_components/ui/icons/Icons";

interface MainPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onMobileToggle: () => void;
  onCreateFolder: () => void;
}

export function MainPanel({ isCollapsed, onToggleCollapse, onMobileToggle, onCreateFolder }: MainPanelProps) {
  const { activeFileId } = useWorkspaceContext();

  // If a file is open, show the editor full-screen in the panel
  if (activeFileId) {
    return (
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        <FileEditor key={activeFileId} />
      </main>
    );
  }

  // Default: folder view with breadcrumb + item list
  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Header — toggle + breadcrumb */}
      <div className="flex items-center h-[52px] px-4 sm:px-6 shrink-0 border-b border-border bg-surface-secondary">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger — visible on mobile only */}
          <button
            onClick={onMobileToggle}
            className="
              lg:hidden shrink-0 p-1.5 rounded-md
              text-text-muted hover:text-text-primary
              hover:bg-surface-hover transition-colors
            "
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={20} />
          </button>

          {/* Desktop collapse toggle — hidden on mobile */}
          <button
            onClick={onToggleCollapse}
            className="
              hidden lg:flex shrink-0 p-1.5 rounded-md
              text-text-muted hover:text-text-primary
              hover:bg-surface-hover transition-colors
            "
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <SidebarToggleRightIcon size={22} />
            ) : (
              <SidebarToggleLeftIcon size={22} />
            )}
          </button>

          {/* Breadcrumb */}
          <div className="flex-1 min-w-0">
            <Breadcrumb />
          </div>
        </div>
      </div>

      {/* Content — scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <ItemList onCreateFolder={onCreateFolder} />
      </div>
    </main>
  );
}
