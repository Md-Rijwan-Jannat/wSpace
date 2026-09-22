// ---------------------------------------------------------------------------
// ItemList.tsx — Clean list of items in the currently selected folder
// ---------------------------------------------------------------------------

"use client";

import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { ItemCard } from "./ItemCard";
import { EmptyState } from "./EmptyState";

interface ItemListProps {
  onCreateFolder: () => void;
}

export function ItemList({ onCreateFolder }: ItemListProps) {
  const { currentChildren, selectedFolderId } = useWorkspaceContext();

  const isEmpty = currentChildren.length === 0;

  // Separate folders and files for display
  const folders = currentChildren.filter((item) => item.type === "folder");
  const files = currentChildren.filter((item) => item.type === "file");

  if (isEmpty) {
    return (
      <EmptyState
        title={selectedFolderId ? "This folder is empty" : "Welcome to wSpace"}
        description={
          selectedFolderId
            ? "Start organising by creating a new folder or file."
            : "Create your first folder or file to get started."
        }
        actionLabel="Create New"
        onAction={onCreateFolder}
      />
    );
  }

  return (
    <div className="flex-1">
      {/* Folders section */}
      {folders.length > 0 && (
        <div className="mb-4">
          <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
            Folders
            <span className="ml-1.5 text-text-muted/60 font-normal normal-case tracking-normal">
              ({folders.length})
            </span>
          </h4>
          <div className="space-y-0.5">
            {folders.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Files section */}
      {files.length > 0 && (
        <div>
          <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2 px-1">
            Files
            <span className="ml-1.5 text-text-muted/60 font-normal normal-case tracking-normal">
              ({files.length})
            </span>
          </h4>
          <div className="space-y-0.5">
            {files.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
