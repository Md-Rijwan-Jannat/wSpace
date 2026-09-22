// ---------------------------------------------------------------------------
// ItemList.tsx — List of items in the currently selected folder
// ---------------------------------------------------------------------------

"use client";

import { useState, useCallback } from "react";
import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { ItemCard } from "./ItemCard";
import { CreateItemForm } from "./CreateItemForm";
import { EmptyState } from "./EmptyState";
import { FolderIcon, FileTextIcon } from "@/src/_components/ui/icons/Icons";

export function ItemList() {
  const { currentChildren, selectedFolderId } = useWorkspaceContext();
  const [createType, setCreateType] = useState<"folder" | "file" | null>(null);

  const handleNewFolder = useCallback(() => {
    setCreateType((prev) => (prev === "folder" ? null : "folder"));
  }, []);

  const handleNewFile = useCallback(() => {
    setCreateType((prev) => (prev === "file" ? null : "file"));
  }, []);

  const isEmpty = currentChildren.length === 0 && createType === null;

  return (
    <div className="flex-1">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleNewFolder}
          className={`
            inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
            transition-all duration-150 active:scale-[0.97]
            ${createType === "folder"
              ? "bg-primary text-white shadow-[0_1px_3px_rgba(76,53,174,0.3)]"
              : "bg-surface-secondary text-text-primary border border-border hover:border-primary/30 hover:bg-primary-subtle"
            }
          `}
        >
          <FolderIcon size={15} color={createType === "folder" ? "white" : "#4c35ae"} />
          New Folder
        </button>

        <button
          onClick={handleNewFile}
          className={`
            inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
            transition-all duration-150 active:scale-[0.97]
            ${createType === "file"
              ? "bg-primary text-white shadow-[0_1px_3px_rgba(76,53,174,0.3)]"
              : "bg-surface-secondary text-text-primary border border-border hover:border-primary/30 hover:bg-primary-subtle"
            }
          `}
        >
          <FileTextIcon size={15} color={createType === "file" ? "white" : "#3b82f6"} />
          New File
        </button>
      </div>

      {/* Create form (animated slide-down) */}
      {createType && (
        <CreateItemForm
          type={createType}
          onClose={() => setCreateType(null)}
        />
      )}

      {/* Item list or empty state */}
      {isEmpty ? (
        <EmptyState
          title={selectedFolderId ? "This folder is empty" : "Welcome to wSpace"}
          description={
            selectedFolderId
              ? "Start organising by creating a new folder or file."
              : "Create your first folder or file to get started."
          }
          actionLabel="Create New"
          onAction={handleNewFolder}
        />
      ) : (
        <div className="space-y-1">
          {currentChildren.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
