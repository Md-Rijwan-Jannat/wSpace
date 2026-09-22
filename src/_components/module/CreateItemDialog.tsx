// ---------------------------------------------------------------------------
// CreateItemDialog.tsx — Compact, elegant dialog for creating folders/files
// ---------------------------------------------------------------------------

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { useToastContext } from "@/src/context/ToastContext";
import { Modal } from "@/src/_components/ui/shared/Modal";
import {
  FolderPlusIcon,
  FilePlusIcon,
  CloseIcon,
} from "@/src/_components/ui/icons/Icons";

interface CreateItemDialogContentProps {
  itemType: "folder" | "file";
  onClose: () => void;
}

function CreateItemDialogContent({
  itemType,
  onClose,
}: CreateItemDialogContentProps) {
  const { selectedFolderId, createItem, breadcrumbPath } =
    useWorkspaceContext();
  const { showToast } = useToastContext();

  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, []);

  // Build current location label
  const locationLabel =
    breadcrumbPath.length > 0
      ? breadcrumbPath[breadcrumbPath.length - 1].name
      : "Workspace";

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const result = createItem(name, itemType, selectedFolderId);
      if (result) {
        setError(result);
        inputRef.current?.focus();
        return;
      }

      showToast(
        `${itemType === "folder" ? "Folder" : "File"} "${name.trim()}" created`,
        "success"
      );
      onClose();
    },
    [name, itemType, selectedFolderId, createItem, showToast, onClose]
  );

  const isFolder = itemType === "folder";

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-lg">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-5 pb-1">
        <div>
          <h3 className="text-[16px] font-semibold text-text-primary flex items-center gap-2">
            {isFolder ? (
              <FolderPlusIcon size={18} color="#4c35ae" />
            ) : (
              <FilePlusIcon size={18} color="#3b82f6" />
            )}
            <span>{isFolder ? "New Folder" : "New File"}</span>
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Create a new {itemType} in{" "}
            <span className="text-text-secondary font-medium">{locationLabel}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          aria-label="Close dialog"
        >
          <CloseIcon size={16} />
        </button>
      </div>

      {/* Name input */}
      <div className="px-6 py-4">
        <label className="block text-xs font-medium text-text-secondary mb-1.5">
          {isFolder ? "Folder name" : "File name"}
        </label>
        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            {isFolder ? (
              <FolderPlusIcon size={16} color="#4c35ae" />
            ) : (
              <FilePlusIcon size={16} color="#3b82f6" />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            placeholder={
              isFolder ? "e.g. Documents, Projects..." : "e.g. notes.txt, data.json..."
            }
            className={`
              w-full pl-10 pr-3.5 py-2 rounded-md text-sm
              border bg-white text-text-primary
              placeholder:text-text-muted
              focus:outline-none focus:ring-2 transition-all duration-150
              ${error
                ? "border-danger focus:ring-danger/20"
                : "border-border focus:border-primary focus:ring-primary/20"
              }
            `}
            autoComplete="off"
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="mt-2 text-xs text-danger flex items-center gap-1.5 animate-slide-down">
            <span className="inline-flex w-3.5 h-3.5 rounded-full bg-danger/10 text-danger text-[10px] font-bold items-center justify-center">
              !
            </span>
            {error}
          </p>
        )}
      </div>

      {/* Clean Footer actions — seamless white background */}
      <div className="flex items-center justify-end gap-2.5 px-6 pb-5 pt-1 bg-white">
        <button
          type="button"
          onClick={onClose}
          className="
            px-3.5 py-1.5 rounded-md text-[13px] font-medium
            text-text-secondary hover:bg-surface-hover
            transition-colors duration-150
          "
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!name.trim()}
          className={`
            px-4 py-1.5 rounded-md text-[13px] font-medium
            transition-all duration-150 active:scale-[0.97]
            ${name.trim()
              ? isFolder
                ? "bg-primary text-white hover:bg-primary-hover shadow-[0_1px_3px_rgba(76,53,174,0.3)]"
                : "bg-[#3b82f6] text-white hover:bg-[#2563eb] shadow-[0_1px_3px_rgba(59,130,246,0.3)]"
              : "bg-border-light text-text-muted cursor-not-allowed"
            }
          `}
        >
          Create {isFolder ? "Folder" : "File"}
        </button>
      </div>
    </form>
  );
}

interface CreateItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "folder" | "file";
  itemType?: "folder" | "file";
}

export function CreateItemDialog({
  isOpen,
  onClose,
  initialType = "folder",
  itemType,
}: CreateItemDialogProps) {
  const resolvedType = itemType ?? initialType;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {isOpen ? (
        <CreateItemDialogContent
          itemType={resolvedType}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  );
}
