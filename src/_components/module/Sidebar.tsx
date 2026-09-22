// ---------------------------------------------------------------------------
// Sidebar.tsx — Left panel with logo, search, create actions, and tree view
// ---------------------------------------------------------------------------

"use client";

import Image from "next/image";
import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { TreeNode } from "./TreeNode";
import {
  SearchIcon,
  CloseIcon,
  FolderPlusIcon,
  FilePlusIcon,
} from "@/src/_components/ui/icons/Icons";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchOpen: () => void;
  onCreateFolder: () => void;
  onCreateFile: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  onSearchOpen,
  onCreateFolder,
  onCreateFile,
}: SidebarProps) {
  const { treeData, navigateToFolder, breadcrumbPath } =
    useWorkspaceContext();

  // Current location label for bottom bar
  const locationLabel =
    breadcrumbPath.length > 0
      ? breadcrumbPath[breadcrumbPath.length - 1].name
      : "Workspace";

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
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
          <button
            onClick={() => navigateToFolder(null)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <Image
              src="/images/wSpace.png"
              alt="wSpace logo"
              width={32}
              height={32}
              className="rounded-md"
              priority
            />
            <span className="text-[18px] font-bold text-text-primary tracking-tight">
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

        {/* Action bar — Search + Create icons */}
        <div className="flex items-center gap-1.5 px-3 py-2.5">
          {/* Search trigger — takes most space */}
          <button
            onClick={onSearchOpen}
            className="
              flex-1 flex items-center gap-2 px-2.5 py-[7px] rounded-md
              bg-surface text-text-muted text-[12px]
              border border-border hover:border-primary/30
              transition-colors duration-150
            "
          >
            <SearchIcon size={14} color="#94a3b8" />
            <span>Search...</span>
            <kbd className="ml-auto text-[9px] font-mono text-text-muted bg-surface-secondary px-1 py-[1px] rounded border border-border-light">
              ⌘K
            </kbd>
          </button>

          {/* New Folder — icon button */}
          <button
            onClick={onCreateFolder}
            className="
              shrink-0 p-[7px] rounded-md
              border border-border bg-surface
              hover:bg-primary-subtle hover:border-primary/30
              active:scale-[0.93]
              transition-all duration-150
              group
            "
            title="New Folder"
            aria-label="New Folder"
          >
            <FolderPlusIcon
              size={16}
              color="#4c35ae"
              className="group-hover:scale-110 transition-transform duration-150"
            />
          </button>

          {/* New File — icon button */}
          <button
            onClick={onCreateFile}
            className="
              shrink-0 p-[7px] rounded-md
              border border-border bg-surface
              hover:bg-[#eff6ff] hover:border-[#3b82f6]/30
              active:scale-[0.93]
              transition-all duration-150
              group
            "
            title="New File"
            aria-label="New File"
          >
            <FilePlusIcon
              size={16}
              color="#3b82f6"
              className="group-hover:scale-110 transition-transform duration-150"
            />
          </button>
        </div>

        {/* Explorer label */}
        <div className="px-4 pt-1 pb-1.5">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Explorer
          </span>
        </div>

        {/* Tree view */}
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {treeData.length > 0 ? (
            treeData.map((node) => (
              <TreeNode key={node.item.id} node={node} depth={0} />
            ))
          ) : (
            <div className="flex flex-col items-center py-8 px-4">
              <p className="text-xs text-text-muted text-center mb-3">
                No items yet
              </p>
              <button
                onClick={onCreateFolder}
                className="
                  text-xs text-primary font-medium
                  hover:underline transition-all
                "
              >
                + Create your first folder
              </button>
            </div>
          )}
        </nav>

        {/* Bottom status bar */}
        <div className="px-4 py-2.5 border-t border-border bg-surface-secondary">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted truncate max-w-[140px]">
              📍 {locationLabel}
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              ⌘K · ⌘N
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
