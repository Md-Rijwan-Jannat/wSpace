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
          flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer
          border border-transparent
          hover:bg-surface-hover hover:border-border-light
          hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)]
          hover:-translate-y-[1px]
          transition-all duration-150 group
        "
      >
        {/* Icon */}
        <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-surface-secondary">
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
            <p className="text-sm font-medium text-text-primary truncate">
              {item.name}
            </p>
            <p className="text-[11px] text-text-muted mt-0.5">
              {isFolder
                ? `${descendantCount} item${descendantCount !== 1 ? "s" : ""}`
                : dateStr}
            </p>
          </div>
        )}

        {/* Action buttons (visible on hover) */}
        {!isRenaming && (
          <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
              }}
              className="p-1.5 rounded-md hover:bg-[#fef3c7] transition-colors"
              title="Rename"
              aria-label="Rename"
            >
              <PencilIcon size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="p-1.5 rounded-md hover:bg-danger-light transition-colors"
              title="Delete"
              aria-label="Delete"
            >
              <TrashIcon size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-danger-light flex items-center justify-center">
              <TrashIcon size={20} color="#ef4444" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                Delete {isFolder ? "Folder" : "File"}
              </h3>
              <p className="text-sm text-text-secondary mt-0.5">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <p className="text-sm text-text-secondary mb-6">
            Are you sure you want to delete{" "}
            <strong className="text-text-primary">{item.name}</strong>
            {isFolder && descendantCount > 0
              ? ` and all its ${descendantCount} item${descendantCount !== 1 ? "s" : ""}?`
              : "?"}
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                text-text-secondary hover:bg-surface-hover
                transition-colors duration-150
              "
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                bg-danger text-white
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
