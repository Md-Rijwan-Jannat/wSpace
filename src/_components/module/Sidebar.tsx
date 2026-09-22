// ---------------------------------------------------------------------------
// Sidebar.tsx — Left panel with logo, search, create actions, and tree view
// ---------------------------------------------------------------------------

"use client";

import Image from "next/image";
import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { TreeNode } from "./TreeNode";
import {
  SearchIcon,
  FolderPlusIcon,
  FilePlusIcon,
} from "@/src/_components/ui/icons/Icons";

interface SidebarProps {
  isCollapsed: boolean;
  onSearchOpen: () => void;
  onCreateFolder: () => void;
  onCreateFile: () => void;
}

export function Sidebar({
  isCollapsed,
  onSearchOpen,
  onCreateFolder,
  onCreateFile,
}: SidebarProps) {
  const { treeData, navigateToFolder, breadcrumbPath } = useWorkspaceContext();

  const locationLabel =
    breadcrumbPath.length > 0
      ? breadcrumbPath[breadcrumbPath.length - 1].name
      : "Workspace";

  return (
    <aside
      className={`
        relative h-full bg-surface-secondary border-r border-border
        flex flex-col shrink-0
        transition-all duration-300 ease-out
        ${isCollapsed ? "w-[60px]" : "w-[272px]"}
      `}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div
        className={`
          flex items-center h-[52px] shrink-0
          border-b border-border
          ${isCollapsed ? "justify-center px-2" : "px-3.5"}
        `}
      >
        {/* Logo + text */}
        <button
          onClick={() => navigateToFolder(null)}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity min-w-0"
          title="Go to workspace root"
        >
          <Image
            src="/images/wSpace.png"
            alt="wSpace logo"
            width={32}
            height={32}
            className="rounded-md shrink-0"
            priority
          />
          {!isCollapsed && (
            <span className="text-[17px] font-bold text-text-primary tracking-tight truncate">
              wSpace
            </span>
          )}
        </button>
      </div>

      {/* ── Action bar ─────────────────────────────────────────── */}
      {isCollapsed ? (
        /* Collapsed: vertical icon stack */
        <div className="flex flex-col items-center gap-1 py-3 px-2 border-b border-border">
          <button
            onClick={onSearchOpen}
            className="
              w-9 h-9 flex items-center justify-center rounded-md
              text-text-muted hover:text-primary hover:bg-primary-subtle
              transition-colors duration-150
            "
            title="Search (⌘K)"
            aria-label="Search"
          >
            <SearchIcon size={16} color="currentColor" />
          </button>
          <button
            onClick={onCreateFolder}
            className="
              w-9 h-9 flex items-center justify-center rounded-md
              text-text-muted hover:text-primary hover:bg-primary-subtle
              active:scale-90 transition-all duration-150
            "
            title="New Folder"
            aria-label="New Folder"
          >
            <FolderPlusIcon size={16} color="currentColor" />
          </button>
          <button
            onClick={onCreateFile}
            className="
              w-9 h-9 flex items-center justify-center rounded-md
              text-text-muted hover:text-[#3b82f6] hover:bg-[#eff6ff]
              active:scale-90 transition-all duration-150
            "
            title="New File"
            aria-label="New File"
          >
            <FilePlusIcon size={16} color="currentColor" />
          </button>
        </div>
      ) : (
        /* Expanded: search bar + icon buttons in one row */
        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-border">
          <button
            onClick={onSearchOpen}
            className="
              flex-1 flex items-center gap-2 px-2.5 py-[7px] rounded-md
              bg-surface text-text-muted text-[12px]
              border border-border hover:border-primary/30
              transition-colors duration-150
            "
          >
            <SearchIcon size={13} color="#94a3b8" />
            <span>Search...</span>
            <kbd className="ml-auto text-[9px] font-mono text-text-muted bg-surface-secondary px-1 py-[1px] rounded border border-border-light">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onCreateFolder}
            className="
              shrink-0 w-[30px] h-[30px] flex items-center justify-center rounded-md
              border border-border bg-surface
              hover:bg-primary-subtle hover:border-primary/30
              active:scale-90 transition-all duration-150 group
            "
            title="New Folder"
            aria-label="New Folder"
          >
            <FolderPlusIcon
              size={14}
              color="#4c35ae"
              className="group-hover:scale-110 transition-transform duration-150"
            />
          </button>

          <button
            onClick={onCreateFile}
            className="
              shrink-0 w-[30px] h-[30px] flex items-center justify-center rounded-md
              border border-border bg-surface
              hover:bg-[#eff6ff] hover:border-[#3b82f6]/30
              active:scale-90 transition-all duration-150 group
            "
            title="New File"
            aria-label="New File"
          >
            <FilePlusIcon
              size={14}
              color="#3b82f6"
              className="group-hover:scale-110 transition-transform duration-150"
            />
          </button>
        </div>
      )}

      {/* ── Explorer label (expanded only) ──────────────────────── */}
      {!isCollapsed && (
        <div className="px-4 pt-2.5 pb-1">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Explorer
          </span>
        </div>
      )}

      {/* ── Tree view ───────────────────────────────────────────── */}
      <nav className={`flex-1 overflow-y-auto pb-4 ${isCollapsed ? "px-1.5 pt-2" : "px-2"}`}>
        {treeData.length > 0 ? (
          treeData.map((node) => (
            <TreeNode key={node.item.id} node={node} depth={0} isCollapsed={isCollapsed} />
          ))
        ) : (
          <div className={`flex flex-col items-center py-6 ${isCollapsed ? "px-1" : "px-3"}`}>
            {!isCollapsed ? (
              <>
                <p className="text-xs text-text-muted text-center mb-2">No items yet</p>
                <button
                  onClick={onCreateFolder}
                  className="text-xs text-primary font-medium hover:underline transition-all"
                >
                  + Create your first folder
                </button>
              </>
            ) : (
              <button
                onClick={onCreateFolder}
                className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-primary-subtle transition-colors"
                title="Create folder"
                aria-label="Create folder"
              >
                <FolderPlusIcon size={16} color="#4c35ae" />
              </button>
            )}
          </div>
        )}
      </nav>

      {/* ── Bottom bar (expanded only) ─────────────────────────── */}
      {!isCollapsed && (
        <div className="px-4 py-2.5 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-text-muted truncate max-w-[140px]">
              📍 {locationLabel}
            </span>
            <span className="text-[10px] text-text-muted font-mono">
              ⌘K · ⌘N
            </span>
          </div>
        </div>
      )}
    </aside>
  );
}
