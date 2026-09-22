// ---------------------------------------------------------------------------
// TreeNode.tsx — Recursive tree node with connecting lines
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
  isCollapsed?: boolean;
  isLast?: boolean;
  parentLines?: boolean[];
}

export function TreeNode({
  node,
  depth,
  isCollapsed = false,
  isLast = true,
  parentLines = [],
}: TreeNodeProps) {
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
      setIsExpanded((prev) => !prev);
    } else {
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

  const fileIcon = !isFolder ? resolveFileIcon(node.item.name) : null;

  // Tree line width per depth level
  const lineIndent = 20;

  return (
    <div>
      {/* Node row */}
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center gap-0 text-left text-[13px]
          cursor-pointer select-none group relative
          transition-colors duration-100 mt-[1px]
          ${isCollapsed ? "justify-center py-[5px] px-2" : "py-[5px] pr-3"}
          ${isSelected
            ? "bg-[#ede9fe] text-[#4c35ae] font-medium"
            : "text-text-primary hover:bg-surface-hover"
          }
        `}
        style={isCollapsed ? {} : { paddingLeft: `${depth * lineIndent + 8}px` }}
        title={isCollapsed ? node.item.name : undefined}
      >
        {/* Tree lines (expanded mode only) */}
        {!isCollapsed && depth > 0 && (
          <span className="absolute top-0 bottom-0 pointer-events-none" style={{ left: 0 }}>
            {parentLines.map((hasLine, i) => (
              <span
                key={i}
                className="absolute top-0 bottom-0 w-px bg-border-light"
                style={{ left: `${i * lineIndent + lineIndent / 2 + 8}px` }}
              />
            ))}
            {/* Horizontal connector line */}
            <span
              className="absolute top-[14px] h-px bg-border-light"
              style={{
                left: `${(depth - 1) * lineIndent + lineIndent / 2 + 8}px`,
                width: `${lineIndent / 2}px`,
              }}
            />
          </span>
        )}

        {/* Chevron (folders only) */}
        {!isCollapsed && (
          <span
            onClick={handleChevronClick}
            className={`
              shrink-0 flex items-center justify-center w-4 h-4 mr-0.5
              transition-transform duration-150
              ${isExpanded ? "rotate-90" : "rotate-0"}
              ${!hasChildren && isFolder ? "invisible" : ""}
            `}
          >
            <ChevronIcon
              size={11}
              color={isSelected ? "#4c35ae" : "#94a3b8"}
            />
          </span>
        )}

        {/* Icon */}
        <span className="shrink-0 flex items-center mr-1.5">
          {isFolder ? (
            isExpanded ? (
              <FolderOpenIcon size={15} />
            ) : (
              <FolderIcon size={15} />
            )
          ) : (
            fileIcon && <fileIcon.component size={14} color={fileIcon.color} />
          )}
        </span>

        {/* Name */}
        {!isCollapsed && (
          <span className="truncate select-none">{node.item.name}</span>
        )}
      </button>

      {/* Children */}
      {isFolder && isExpanded && hasChildren && !isCollapsed && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              key={child.item.id}
              node={child}
              depth={depth + 1}
              isCollapsed={isCollapsed}
              isLast={index === node.children.length - 1}
              parentLines={[...parentLines, !isLast]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
