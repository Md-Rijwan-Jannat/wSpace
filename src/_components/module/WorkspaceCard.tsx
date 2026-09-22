// ---------------------------------------------------------------------------
// WorkspaceCard.tsx — Workspace item in the switcher dropdown
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

  useEffect(() => {
    if (isEditing) {
      setEditName(workspace.name);
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
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

  return (
    <div
      onClick={() => {
        if (!isEditing) onSelect();
      }}
      className={`
        group relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
        transition-all duration-150 border
        ${
          isActive
            ? "bg-primary-subtle/80 border-primary/30 shadow-xs"
            : "hover:bg-surface-hover/80 border-transparent hover:border-border-light"
        }
      `}
      style={
        isActive
          ? {
              borderLeftWidth: "3px",
              borderLeftColor: workspace.color,
            }
          : undefined
      }
    >
      {/* Left: Emoji + Name & Count / Rename Input */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
        <span
          className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-xs transition-transform group-hover:scale-105"
          style={{
            backgroundColor: workspace.color,
            boxShadow: `0 2px 6px ${workspace.color}40`,
          }}
        >
          {(workspace.name.charAt(0) || "W").toUpperCase()}
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
                className="w-full px-2 py-0.5 text-[13px] font-medium bg-surface border border-primary rounded outline-none text-text-primary"
              />
              <button
                type="button"
                onClick={handleSaveRename}
                className="p-1 text-success hover:bg-success-light rounded transition-colors"
                title="Save"
              >
                <SaveIcon size={14} color="#10b981" />
              </button>
              <button
                type="button"
                onClick={handleCancelRename}
                className="p-1 text-text-muted hover:bg-surface-hover rounded transition-colors"
                title="Cancel"
              >
                <CloseIcon size={14} />
              </button>
            </div>
            {error && (
              <span className="text-[10px] text-danger font-medium mt-0.5">{error}</span>
            )}
          </form>
        ) : (
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p
                className={`text-[13px] truncate ${
                  isActive
                    ? "font-semibold text-text-primary"
                    : "font-medium text-text-primary group-hover:text-primary transition-colors"
                }`}
              >
                {workspace.name}
              </p>
            </div>
            <p className="text-[11px] text-text-secondary leading-tight">
              {workspace.itemCount} {workspace.itemCount === 1 ? "item" : "items"}
            </p>
          </div>
        )}
      </div>

      {/* Right: Active Checkmark & Actions */}
      {!isEditing && (
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Action buttons (visible on hover) */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1 rounded text-text-muted hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title="Rename workspace"
              aria-label="Rename workspace"
            >
              <PencilIcon size={13} color="currentColor" />
            </button>

            {canDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestDelete();
                }}
                className="p-1 rounded text-text-muted hover:text-danger hover:bg-danger-light transition-colors"
                title="Delete workspace"
                aria-label="Delete workspace"
              >
                <TrashIcon size={13} color="currentColor" />
              </button>
            )}
          </div>

          {/* Active indicator */}
          {isActive && (
            <div className="w-4 h-4 rounded-full flex items-center justify-center text-primary group-hover:hidden transition-transform">
              <CheckIcon size={14} color={workspace.color || "#4c35ae"} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
