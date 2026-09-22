// ---------------------------------------------------------------------------
// ItemCard.tsx — File and folder card for the main panel item list
// ---------------------------------------------------------------------------

"use client";

import { useState, useCallback } from "react";
import type { WorkspaceItem } from "@/src/types/workspace";
import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { useToastContext } from "@/src/context/ToastContext";
import { Modal } from "@/src/_components/ui/shared/Modal";
import { RenameInput } from "./RenameInput";
import {
  FolderIcon,
  PencilIcon,
  TrashIcon,
} from "@/src/_components/ui/icons/Icons";
import { resolveFileIcon } from "@/src/lib/icon-resolver";

interface ItemCardProps {
  item: WorkspaceItem;
}

export function ItemCard({ item }: ItemCardProps) {
  const { navigateToFolder, openFile, deleteItem, getDescendantCount } =
    useWorkspaceContext();
  const { showToast } = useToastContext();

  const [isRenaming, setIsRenaming] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isFolder = item.type === "folder";
  const descendantCount = isFolder ? getDescendantCount(item.id) : 0;

  const handleClick = useCallback(() => {
    if (isRenaming) return;
    if (isFolder) {
      navigateToFolder(item.id);
    } else {
      openFile(item.id);
    }
  }, [isFolder, item.id, navigateToFolder, openFile, isRenaming]);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsRenaming(true);
    },
    []
  );

  const handleDelete = useCallback(() => {
    deleteItem(item.id);
    showToast(
      `${isFolder ? "Folder" : "File"} deleted successfully`,
      "success"
    );
    setShowDeleteModal(false);
  }, [item.id, isFolder, deleteItem, showToast]);

  // Resolve icon
  const fileIcon = !isFolder ? resolveFileIcon(item.name) : null;

  // Format date
  const dateStr = new Date(item.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <div
        onClick={handleClick}
        className="
          group flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer select-none
          border border-transparent
          hover:bg-surface-hover hover:border-border-light
          hover:shadow-[0_1px_4px_rgba(0,0,0,0.06)]
          transition-all duration-150
        "
      >
        {/* Icon */}
        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-surface-secondary">
          {isFolder ? (
            <FolderIcon size={18} color="#4c35ae" />
          ) : (
            fileIcon && <fileIcon.component size={18} color={fileIcon.color} />
          )}
        </span>

        {/* Name (or rename input) */}
        {isRenaming ? (
          <RenameInput
            itemId={item.id}
            currentName={item.name}
            onClose={() => setIsRenaming(false)}
          />
        ) : (
          <div className="flex-1 min-w-0" onDoubleClick={handleDoubleClick}>
            <p className="text-sm font-medium text-text-primary truncate leading-tight">
              {item.name}
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              {isFolder
                ? `${descendantCount} item${descendantCount !== 1 ? "s" : ""}`
                : dateStr}
            </p>
          </div>
        )}

        {/* Action buttons — hidden on mobile, visible on hover for desktop */}
        {!isRenaming && (
          <div className="flex shrink-0 items-center gap-1 ml-auto sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              title="Rename"
              aria-label="Rename"
              className="
                flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium
                text-amber-600 bg-amber-50 border border-amber-200
                hover:bg-amber-100 hover:border-amber-300
                transition-colors duration-150
              "
            >
              <PencilIcon size={11} color="#d97706" />
              <span>Rename</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              title="Delete"
              aria-label="Delete"
              className="
                flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium
                text-red-500 bg-red-50 border border-red-200
                hover:bg-red-100 hover:border-red-300
                transition-colors duration-150
              "
            >
              <TrashIcon size={11} color="#ef4444" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-md bg-red-50 flex items-center justify-center shrink-0">
              <TrashIcon size={17} color="#ef4444" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary leading-tight">
                Delete {isFolder ? "Folder" : "File"}
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Body */}
          <p className="text-sm text-text-secondary mb-5">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-text-primary">&rdquo;{item.name}&#34;</span>
            {isFolder && descendantCount > 0
              ? ` and all its ${descendantCount} item${descendantCount !== 1 ? "s" : ""}?`
              : "?"}
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="
                px-3.5 py-1.5 rounded-md text-sm font-medium
                text-text-secondary bg-surface-secondary
                hover:bg-surface-hover border border-border
                transition-colors duration-150
              "
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="
                px-4 py-1.5 rounded-md text-sm font-medium
                bg-red-500 text-white
                hover:bg-red-600 active:scale-[0.97]
                transition-all duration-150
              "
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
