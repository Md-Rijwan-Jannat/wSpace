// ---------------------------------------------------------------------------
// MainPanel.tsx — Right panel: breadcrumb, toolbar, content area
// ---------------------------------------------------------------------------

"use client";

import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { Breadcrumb } from "./Breadcrumb";
import { ItemList } from "./ItemList";
import { FileEditor } from "./FileEditor";
import {
  FolderPlusIcon,
  FilePlusIcon,
} from "@/src/_components/ui/icons/Icons";

interface MainPanelProps {
  onCreateFolder: () => void;
  onCreateFile: () => void;
}

export function MainPanel({ onCreateFolder, onCreateFile }: MainPanelProps) {
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
      {/* Header — breadcrumb + actions */}
      <div className="px-6 pt-4 pb-3 border-b border-border bg-surface shrink-0">
        <div className="flex items-center justify-between gap-4">
          {/* Left: breadcrumb */}
          <div className="flex-1 min-w-0">
            <Breadcrumb />
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onCreateFolder}
              className="
                inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium
                text-text-secondary bg-surface-secondary border border-border
                hover:bg-primary-subtle hover:border-primary/30 hover:text-primary
                active:scale-[0.97] transition-all duration-150
              "
            >
              <FolderPlusIcon size={14} color="currentColor" />
              <span className="hidden sm:inline">New Folder</span>
            </button>

            <button
              onClick={onCreateFile}
              className="
                inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium
                text-text-secondary bg-surface-secondary border border-border
                hover:bg-[#eff6ff] hover:border-[#3b82f6]/30 hover:text-[#3b82f6]
                active:scale-[0.97] transition-all duration-150
              "
            >
              <FilePlusIcon size={14} color="currentColor" />
              <span className="hidden sm:inline">New File</span>
            </button>
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
