// ---------------------------------------------------------------------------
// RenameInput.tsx — Inline rename text input
// ---------------------------------------------------------------------------

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { useToastContext } from "@/src/context/ToastContext";
import { useClickOutside } from "@/src/hooks/useClickOutside";

interface RenameInputProps {
  itemId: string;
  currentName: string;
  onClose: () => void;
}

export function RenameInput({ itemId, currentName, onClose }: RenameInputProps) {
  const { renameItem } = useWorkspaceContext();
  const { showToast } = useToastContext();
  const [name, setName] = useState(currentName);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus and select all text on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  // Close on click outside
  useClickOutside(containerRef, onClose);

  const handleSubmit = useCallback(() => {
    if (name.trim() === currentName) {
      onClose();
      return;
    }

    const result = renameItem(itemId, name);
    if (result) {
      setError(result);
      return;
    }

    showToast("Item renamed successfully", "success");
    onClose();
  }, [name, currentName, itemId, renameItem, showToast, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [handleSubmit, onClose]
  );

  return (
    <div ref={containerRef} className="flex-1 min-w-0">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError(null);
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleSubmit}
        className={`
          w-full px-2 py-1 rounded text-sm
          border bg-white text-text-primary
          focus:outline-none focus:ring-2 transition-all duration-150
          ${error
            ? "border-danger focus:ring-danger/20"
            : "border-primary focus:ring-primary/20"
          }
        `}
      />
      {error && (
        <p className="text-[11px] text-danger mt-0.5 animate-slide-down">{error}</p>
      )}
    </div>
  );
}
