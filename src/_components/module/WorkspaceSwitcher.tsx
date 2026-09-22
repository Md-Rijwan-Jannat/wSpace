// ---------------------------------------------------------------------------
// WorkspaceSwitcher.tsx — Dropdown/popover to switch, create, and manage workspaces
// ---------------------------------------------------------------------------

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useWorkspaceManagerContext } from "@/src/context/WorkspaceManagerContext";
import { useToastContext } from "@/src/context/ToastContext";
import type { WorkspaceMeta } from "@/src/types/workspace";
import { WorkspaceCard } from "./WorkspaceCard";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";
import {
  ChevronIcon,
  PlusIcon,
  TrashIcon,
} from "@/src/_components/ui/icons/Icons";

interface WorkspaceSwitcherProps {
  isCollapsed: boolean;
}

export function WorkspaceSwitcher({ isCollapsed }: WorkspaceSwitcherProps) {
  const {
    workspaces,
    activeWorkspace,
    activeWorkspaceId,
    switchWorkspace,
    renameWorkspace,
    deleteWorkspace,
    refreshItemCounts,
  } = useWorkspaceManagerContext();
  const { showToast } = useToastContext();

  const [isOpen, setIsOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<WorkspaceMeta | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Refresh item counts when dropdown opens
  useEffect(() => {
    if (isOpen) {
      refreshItemCounts();
    }
  }, [isOpen, refreshItemCounts]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectWorkspace = (id: string) => {
    if (id !== activeWorkspaceId) {
      switchWorkspace(id);
    }
    setIsOpen(false);
  };

  const handleRename = useCallback(
    (id: string, newName: string) => {
      const res = renameWorkspace(id, newName);
      if (res.success) {
        showToast("Workspace renamed", "success");
        return true;
      } else {
        showToast(res.error || "Failed to rename", "error");
        return false;
      }
    },
    [renameWorkspace, showToast]
  );

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    const targetName = deleteTarget.name;
    const res = deleteWorkspace(deleteTarget.id);
    if (res.success) {
      showToast(`Workspace "${targetName}" deleted`, "success");
      setDeleteTarget(null);
    } else {
      showToast(res.error || "Cannot delete workspace", "error");
    }
  };

  const currentWorkspace = activeWorkspace || workspaces[0];
  const initialLetter = (currentWorkspace?.name.charAt(0) || "W").toUpperCase();

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Trigger Button ────────────────────────────────────────── */}
      {isCollapsed ? (
        <div className="flex justify-center py-2 px-2 border-b border-border">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            title={`Current workspace: ${currentWorkspace?.name || "Workspace"} (Click to switch)`}
            aria-label="Switch workspace"
            className="
              relative w-9 h-9 rounded-full flex items-center justify-center text-white
              font-bold text-sm shadow-sm transition-all duration-150 hover:scale-108 active:scale-95
            "
            style={{
              backgroundColor: currentWorkspace?.color || "#4c35ae",
              boxShadow: `0 2px 8px ${currentWorkspace?.color || "#4c35ae"}45`,
            }}
          >
            {initialLetter}
          </button>
        </div>
      ) : (
        <div className="px-3 py-2 border-b border-border">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="
              w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg
              bg-surface hover:bg-surface-hover/80 border border-border hover:border-border/80
              transition-all duration-150 group text-left shadow-xs
            "
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-xs transition-transform group-hover:scale-105"
                style={{
                  backgroundColor: currentWorkspace?.color || "#4c35ae",
                  boxShadow: `0 2px 6px ${currentWorkspace?.color || "#4c35ae"}35`,
                }}
              >
                {initialLetter}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-text-primary truncate leading-tight">
                  {currentWorkspace?.name || "My Workspace"}
                </p>
                <p className="text-[11px] text-text-muted leading-tight">
                  {currentWorkspace?.itemCount ?? 0} {currentWorkspace?.itemCount === 1 ? "item" : "items"}
                </p>
              </div>
            </div>

            <span className="text-text-muted group-hover:text-text-primary">
              <ChevronIcon
                size={14}
                className={`transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
              />
            </span>
          </button>
        </div>
      )}

      {/* ── Dropdown / Popover ─────────────────────────────────────── */}
      {isOpen && (
        <div
          className={`
            absolute z-50 bg-surface rounded-xl shadow-xl border border-border
            p-1.5 animate-in fade-in zoom-in-95 duration-150
            ${
              isCollapsed
                ? "left-[64px] top-2 w-[260px]"
                : "left-3 right-3 top-full mt-1 max-w-[calc(100%-24px)]"
            }
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-1.5 pb-2 border-b border-border-light">
            <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Workspaces
            </span>
            <span className="text-[11px] font-medium text-text-muted bg-surface-secondary px-1.5 py-0.5 rounded">
              {workspaces.length}
            </span>
          </div>

          {/* Workspaces list */}
          <div className="my-1 max-h-[220px] overflow-y-auto space-y-0.5">
            {workspaces.map((ws) => (
              <WorkspaceCard
                key={ws.id}
                workspace={ws}
                isActive={ws.id === activeWorkspaceId}
                canDelete={workspaces.length > 1}
                onSelect={() => handleSelectWorkspace(ws.id)}
                onRename={(newName) => handleRename(ws.id, newName)}
                onRequestDelete={() => setDeleteTarget(ws)}
              />
            ))}
          </div>

          {/* New Workspace Button */}
          <div className="pt-1 border-t border-border-light">
            <button
              onClick={() => {
                setIsOpen(false);
                setCreateDialogOpen(true);
              }}
              className="
                w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                text-[12.5px] font-medium text-primary bg-primary-subtle/60
                hover:bg-primary-subtle border border-primary/20
                hover:border-primary/40 active:scale-98 transition-all
              "
            >
              <PlusIcon size={14} color="#4c35ae" />
              <span>New Workspace</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Create Workspace Modal ────────────────────────────────── */}
      <CreateWorkspaceDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />

      {/* ── Delete Confirmation Dialog ────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setDeleteTarget(null)}
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-workspace-title"
            className="
              relative w-full max-w-sm bg-surface rounded-xl shadow-2xl border border-border
              p-5 space-y-4 animate-in zoom-in-95 duration-150 z-10
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-base shadow-sm"
                style={{
                  backgroundColor: deleteTarget.color,
                  boxShadow: `0 3px 10px ${deleteTarget.color}40`,
                }}
              >
                {(deleteTarget.name.charAt(0) || "W").toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  id="delete-workspace-title"
                  className="text-[15px] font-semibold text-text-primary leading-tight"
                >
                  Delete &ldquo;{deleteTarget.name}&rdquo;?
                </h3>
                <p className="text-[12.5px] text-text-secondary mt-1">
                  This will permanently delete this workspace and all its{" "}
                  <strong>{deleteTarget.itemCount} items</strong>. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="
                  px-3.5 py-1.5 text-[13px] font-medium text-text-secondary rounded-lg
                  hover:bg-surface-hover transition-colors
                "
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="
                  flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium text-white
                  bg-danger hover:bg-danger/90 rounded-lg active:scale-97 shadow-xs transition-all
                "
              >
                <TrashIcon size={14} color="#ffffff" />
                <span>Delete Workspace</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
