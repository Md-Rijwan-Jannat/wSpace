// ---------------------------------------------------------------------------
// TreeNode.tsx — Recursive tree node for sidebar
// ---------------------------------------------------------------------------

"use client";

import { useState, useCallback } from "react";
import type { TreeNodeData } from "@/src/types/workspace";
import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { ChevronIcon, FolderIcon, FolderOpenIcon } from "@/src/_components/ui/icons/Icons";
import { resolveFileIcon } from "@/src/lib/icon-resolver";

interface TreeNodeProps {
  node: TreeNodeData;
  depth: number;
}

export function TreeNode({ node, depth }: TreeNodeProps) {
  const { selectedFolderId, activeFileId, navigateToFolder, openFile } =
    useWorkspaceContext();

  const [isExpanded, setIsExpanded] = useState(depth === 0);

  const isFolder = node.item.type === "folder";
  const hasChildren = node.children.length > 0;
  const isSelected =
    (isFolder && node.item.id === selectedFolderId) ||
    (!isFolder && node.item.id === activeFileId);

  const handleClick = useCallback(() => {
    if (isFolder) {
      navigateToFolder(node.item.id);
      setIsExpanded(true);
    } else {
      // Navigate to parent folder and open file
      navigateToFolder(node.item.parentId);
      openFile(node.item.id);
    }
  }, [isFolder, node.item.id, node.item.parentId, navigateToFolder, openFile]);

  const handleChevronClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
    },
    []
  );

  // Resolve icon for files
  const fileIcon = !isFolder ? resolveFileIcon(node.item.name) : null;

  return (
    <div>
      {/* Node row */}
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center gap-1.5 py-[6px] pr-3 text-left text-[13px]
          rounded-md cursor-pointer group transition-all duration-150
          ${isSelected
            ? "bg-primary-light text-primary font-medium border-l-[3px] border-primary"
            : "text-text-primary hover:bg-surface-hover border-l-[3px] border-transparent"
          }
        `}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        title={node.item.name}
      >
        {/* Chevron (folders only) */}
        {isFolder ? (
          <span
            onClick={handleChevronClick}
            className={`
              shrink-0 flex items-center justify-center w-4 h-4
              transition-transform duration-200
              ${isExpanded ? "rotate-90" : "rotate-0"}
            `}
          >
            {hasChildren && (
              <ChevronIcon size={12} color={isSelected ? "#4c35ae" : "#94a3b8"} />
            )}
          </span>
        ) : (
          <span className="shrink-0 w-4 h-4" />
        )}

        {/* Icon */}
        <span className="shrink-0 flex items-center">
          {isFolder ? (
            isExpanded ? (
              <FolderOpenIcon size={16} />
            ) : (
              <FolderIcon size={16} />
            )
          ) : (
            fileIcon && <fileIcon.component size={16} color={fileIcon.color} />
          )}
        </span>

        {/* Name */}
        <span className="truncate">{node.item.name}</span>
      </button>

      {/* Children (expanded folders only) */}
      {isFolder && isExpanded && hasChildren && (
        <div className="animate-expand">
          {node.children.map((child) => (
            <TreeNode key={child.item.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
