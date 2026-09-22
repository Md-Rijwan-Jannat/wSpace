// ---------------------------------------------------------------------------
// WorkspaceCard.tsx — Clean, professional workspace item in switcher
// ---------------------------------------------------------------------------

"use client";

import { useState, useRef, useEffect } from "react";
import type { WorkspaceMeta } from "@/src/types/workspace";
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  SaveIcon,
  CloseIcon,
} from "@/src/_components/ui/icons/Icons";

interface WorkspaceCardProps {
  workspace: WorkspaceMeta;
  isActive: boolean;
  canDelete: boolean;
  onSelect: () => void;
  onRename: (newName: string) => boolean;
  onRequestDelete: () => void;
}

export function WorkspaceCard({
  workspace,
  isActive,
  canDelete,
  onSelect,
  onRename,
  onRequestDelete,
}: WorkspaceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(workspace.name);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevEditingRef = useRef(isEditing);

  useEffect(() => {
    if (isEditing && !prevEditingRef.current) {
      setEditName(workspace.name);
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
    prevEditingRef.current = isEditing;
  }, [isEditing, workspace.name]);

  const handleSaveRename = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const trimmed = editName.trim();
    if (!trimmed) {
      setError("Name cannot be empty");
      return;
    }
    if (trimmed === workspace.name) {
      setIsEditing(false);
      return;
    }

    const success = onRename(trimmed);
    if (success) {
      setIsEditing(false);
    } else {
      setError("Name already in use");
    }
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditName(workspace.name);
    setError(null);
  };

  const initialLetter = (workspace.name.charAt(0) || "W").toUpperCase();

  return (
    <div
      onClick={() => {
        if (!isEditing) onSelect();
      }}
      className={`
        group relative flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer
        transition-colors duration-150
        ${
          isActive
            ? "bg-[#f1f3f5] text-text-primary"
            : "hover:bg-[#f8f9fa] text-text-secondary hover:text-text-primary"
        }
      `}
    >
      {/* Left: Color Circle + Name / Rename Input */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-1.5">
        <span
          className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-white font-semibold text-[10px] shadow-2xs"
          style={{ backgroundColor: workspace.color }}
        >
          {initialLetter}
        </span>

        {isEditing ? (
          <form
            onSubmit={handleSaveRename}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex flex-col min-w-0"
          >
            <div className="flex items-center gap-1">
              <input
                ref={inputRef}
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.stopPropagation();
                    setIsEditing(false);
                  }
                }}
                maxLength={32}
                className="w-full px-1.5 py-0.5 text-[12.5px] font-medium bg-surface border border-primary/50 rounded outline-none text-text-primary"
              />
              <button
                type="button"
                onClick={handleSaveRename}
                className="p-1 text-text-muted hover:text-success rounded transition-colors"
                title="Save"
              >
                <SaveIcon size={13} color="#10b981" />
              </button>
              <button
                type="button"
                onClick={handleCancelRename}
                className="p-1 text-text-muted hover:text-text-primary rounded transition-colors"
                title="Cancel"
              >
                <CloseIcon size={13} />
              </button>
            </div>
            {error && (
              <span className="text-[10px] text-danger font-medium mt-0.5">{error}</span>
            )}
          </form>
        ) : (
          <div className="min-w-0 flex-1 flex items-baseline justify-between gap-1.5">
            <span
              className={`text-[13px] truncate ${
                isActive ? "font-semibold text-text-primary" : "font-normal text-text-primary"
              }`}
            >
              {workspace.name}
            </span>
            <span className="text-[11px] text-text-muted shrink-0 tabular-nums">
              {workspace.itemCount}
            </span>
          </div>
        )}
      </div>

      {/* Right: Actions & Active Checkmark */}
      {!isEditing && (
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Action buttons (visible on hover) */}
          <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-black/5 transition-colors"
              title="Rename workspace"
              aria-label="Rename workspace"
            >
              <PencilIcon size={12} color="currentColor" />
            </button>

            {canDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestDelete();
                }}
                className="p-1 rounded text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                title="Delete workspace"
                aria-label="Delete workspace"
              >
                <TrashIcon size={12} color="currentColor" />
              </button>
            )}
          </div>

          {/* Active checkmark */}
          {isActive ? (
            <div className="w-4 h-4 flex items-center justify-center text-primary shrink-0 ml-1">
              <CheckIcon size={13} color="#4c35ae" />
            </div>
          ) : (
            <div className="w-4 h-4 shrink-0 ml-1" />
          )}
        </div>
      )}
    </div>
  );
}
