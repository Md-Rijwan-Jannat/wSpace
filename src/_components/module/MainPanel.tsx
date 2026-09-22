// ---------------------------------------------------------------------------
// MainPanel.tsx — Right panel: breadcrumb, content area
// ---------------------------------------------------------------------------

"use client";

import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { Breadcrumb } from "./Breadcrumb";
import { ItemList } from "./ItemList";
import { FileEditor } from "./FileEditor";

export function MainPanel() {
  const { activeFileId } = useWorkspaceContext();

  // If a file is open, show the editor full-screen in the panel
  if (activeFileId) {
    return (
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        <FileEditor />
      </main>
    );
  }

  // Default: folder view with breadcrumb + item list
  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      {/* Header with breadcrumb */}
      <div className="px-6 pt-5 pb-3 border-b border-border bg-surface shrink-0">
        <Breadcrumb />
      </div>

      {/* Content — scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <ItemList />
      </div>
    </main>
  );
}
