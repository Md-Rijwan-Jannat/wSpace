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
} from "@/src/_components/ui/icons/Icons";

interface MainPanelProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCreateFolder: () => void;
}

export function MainPanel({ isCollapsed, onToggleCollapse, onCreateFolder }: MainPanelProps) {
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
      <div className="flex items-center h-[52px] px-6 shrink-0 border-b border-border bg-surface-secondary">
        <div className="flex items-center gap-3">
          {/* Sidebar toggle */}
          <button
            onClick={onToggleCollapse}
            className="
              shrink-0 p-1.5 rounded-md
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
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <ItemList onCreateFolder={onCreateFolder} />
      </div>
    </main>
  );
}
