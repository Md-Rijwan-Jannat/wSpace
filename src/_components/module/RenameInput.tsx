// ---------------------------------------------------------------------------
// RenameInput.tsx — Inline rename text input
// ---------------------------------------------------------------------------

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { useToastContext } from "@/src/context/ToastContext";
import { useClickOutside } from "@/src/hooks/useClickOutside";
import { SaveIcon } from "@/src/_components/ui/icons/Icons";

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
      <div className="flex items-center gap-1">
        {/* Text input */}
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
            flex-1 min-w-0 h-6 px-2 rounded text-[13px]
            border bg-white text-text-primary
            outline-none transition-colors duration-150
            ${error
              ? "border-danger/60 focus:border-danger"
              : "border-primary/40 focus:border-primary/50"
            }
          `}
        />
         {/* Save checkmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSubmit();
          }}
          title="Save rename"
          aria-label="Save rename"
          className="
            shrink-0 flex items-center justify-center
            w-6 h-6 rounded
            bg-primary text-white
            hover:bg-primary-hover
            active:scale-95
            transition-all duration-150
          "
        >
          <SaveIcon size={12} color="white" />
        </button>
      </div>
      {error && (
        <p className="text-[11px] text-danger mt-0.5 animate-slide-down">{error}</p>
      )}
    </div>
  );
}
