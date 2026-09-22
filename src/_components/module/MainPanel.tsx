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
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white min-w-0">
        <FileEditor
          key={activeFileId}
          isCollapsed={isCollapsed}
          onToggleCollapse={onToggleCollapse}
        />
      </main>
    );
  }

  // Default: folder view with breadcrumb + item list
  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-white min-w-0">
      {/* Header — toggle + breadcrumb */}
      <div className="flex items-center h-[52px] px-3 sm:px-6 shrink-0 border-b border-border bg-surface-secondary">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Collapse/Expand toggle — active on desktop and mobile */}
          <button
            onClick={onToggleCollapse}
            className="
              flex shrink-0 p-1.5 rounded-md
              text-text-muted hover:text-text-primary
              hover:bg-surface-hover transition-colors
            "
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <SidebarToggleRightIcon size={20} />
            ) : (
              <SidebarToggleLeftIcon size={20} />
            )}
          </button>

          {/* Breadcrumb with horizontal scroll safety */}
          <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar py-1">
            <Breadcrumb />
          </div>
        </div>
      </div>

      {/* Content — scrollable vertically and horizontally so content never breaks */}
      <div className="flex-1 overflow-y-auto overflow-x-auto px-4 py-4 sm:px-6">
        <div className="min-w-[280px]">
          <ItemList onCreateFolder={onCreateFolder} />
        </div>
      </div>
    </main>
  );
}
