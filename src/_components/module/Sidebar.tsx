// ---------------------------------------------------------------------------
// Sidebar.tsx — Left panel with logo, search trigger, and tree view
// ---------------------------------------------------------------------------

"use client";

import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { TreeNode } from "./TreeNode";
import { WorkspaceIcon, SearchIcon, CloseIcon } from "@/src/_components/ui/icons/Icons";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
}

export function Sidebar({ isOpen, onClose, onSearchOpen }: SidebarProps) {
  const { treeData, navigateToFolder } = useWorkspaceContext();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed lg:relative z-40 top-0 left-0 h-full
          w-[280px] bg-surface-secondary border-r border-border
          flex flex-col shrink-0
          transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <button
            onClick={() => navigateToFolder(null)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <WorkspaceIcon size={22} />
            <span className="text-[15px] font-bold text-text-primary tracking-tight">
              wSpace
            </span>
          </button>

          {/* Close button (mobile only) */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md hover:bg-surface-hover transition-colors"
            aria-label="Close sidebar"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Search trigger */}
        <div className="px-3 py-3">
          <button
            onClick={onSearchOpen}
            className="
              w-full flex items-center gap-2.5 px-3 py-2 rounded-lg
              bg-surface text-text-muted text-[13px]
              border border-border hover:border-primary/30
              transition-colors duration-150
            "
          >
            <SearchIcon size={15} color="#94a3b8" />
            <span>Search files...</span>
            <kbd className="ml-auto text-[10px] font-mono text-text-muted bg-surface-secondary px-1.5 py-0.5 rounded border border-border-light">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Tree view */}
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {treeData.length > 0 ? (
            treeData.map((node) => (
              <TreeNode key={node.item.id} node={node} depth={0} />
            ))
          ) : (
            <p className="text-xs text-text-muted text-center py-8 px-4">
              No items yet. Create your first folder or file.
            </p>
          )}
        </nav>

        {/* Bottom hint */}
        <div className="px-4 py-3 border-t border-border">
          <p className="text-[11px] text-text-muted text-center">
            <kbd className="font-mono">⌘K</kbd> search · <kbd className="font-mono">⌘N</kbd> new
          </p>
        </div>
      </aside>
    </>
  );
}
