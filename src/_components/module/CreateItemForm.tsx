// ---------------------------------------------------------------------------
// CreateItemForm.tsx — Inline form to create new folder/file
// ---------------------------------------------------------------------------

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { useToastContext } from "@/src/context/ToastContext";
import { FolderIcon, FileTextIcon, CloseIcon } from "@/src/_components/ui/icons/Icons";

interface CreateItemFormProps {
  type: "folder" | "file";
  onClose: () => void;
}

export function CreateItemForm({ type, onClose }: CreateItemFormProps) {
  const { selectedFolderId, createItem } = useWorkspaceContext();
  const { showToast } = useToastContext();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const result = createItem(name, type, selectedFolderId);
      if (result) {
        // result is an error string
        setError(result);
        return;
      }

      showToast(
        `${type === "folder" ? "Folder" : "File"} created successfully`,
        "success"
      );
      onClose();
    },
    [name, type, selectedFolderId, createItem, showToast, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-slide-down bg-white border border-border rounded-lg p-3 mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2 mb-2">
        {type === "folder" ? (
          <FolderIcon size={18} color="#4c35ae" />
        ) : (
          <FileTextIcon size={18} color="#3b82f6" />
        )}
        <span className="text-sm font-medium text-text-primary">
          New {type === "folder" ? "Folder" : "File"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={type === "folder" ? "Folder name" : "filename.txt"}
          className="
            flex-1 px-3 py-2 rounded-md text-sm
            border border-border bg-white text-text-primary
            placeholder:text-text-muted
            outline-none focus:border-primary/40
            transition-colors duration-150
          "
        />

        <button
          type="submit"
          className="
            px-4 py-2 rounded-md text-sm font-medium
            bg-primary text-white
            hover:bg-primary-hover active:scale-[0.97]
            transition-all duration-150
          "
        >
          Create
        </button>

        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-md text-text-muted hover:bg-surface-hover transition-colors"
          aria-label="Cancel"
        >
          <CloseIcon size={14} />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-2 text-xs text-danger animate-slide-down">{error}</p>
      )}
    </form>
  );
}
