// ---------------------------------------------------------------------------
// CreateWorkspaceDialog.tsx — Modal dialog to create a new workspace
// ---------------------------------------------------------------------------

"use client";

import { useState, useEffect, useRef } from "react";
import { useWorkspaceManagerContext } from "@/src/context/WorkspaceManagerContext";
import { useToastContext } from "@/src/context/ToastContext";
import {
  WORKSPACE_COLOR_OPTIONS,
  DEFAULT_WORKSPACE_COLOR,
} from "@/src/lib/constants";
import { CloseIcon, CheckIcon } from "@/src/_components/ui/icons/Icons";

interface CreateWorkspaceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateWorkspaceDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateWorkspaceDialogProps) {
  const { createWorkspace } = useWorkspaceManagerContext();
  const { showToast } = useToastContext();

  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(DEFAULT_WORKSPACE_COLOR);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state and focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setSelectedColor(DEFAULT_WORKSPACE_COLOR);
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter a workspace name");
      inputRef.current?.focus();
      return;
    }

    const res = createWorkspace(trimmed, selectedColor);
    if (!res.success) {
      setError(res.error || "Failed to create workspace");
      inputRef.current?.focus();
      return;
    }

    showToast(`Workspace "${trimmed}" created!`, "success");
    onClose();
    if (onSuccess) onSuccess();
  };

  const initialLetter = (name.trim().charAt(0) || "W").toUpperCase();
  const activeColorObj = WORKSPACE_COLOR_OPTIONS.find((c) => c.value === selectedColor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Backdrop click area */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-workspace-title"
        className="
          relative w-full max-w-md bg-surface rounded-xl shadow-2xl border border-border
          overflow-hidden animate-in zoom-in-95 duration-200 z-10
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-secondary/50">
          <div className="flex items-center gap-3">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md transition-all duration-200"
              style={{
                backgroundColor: selectedColor,
                boxShadow: `0 3px 10px ${selectedColor}45`,
              }}
            >
              {initialLetter}
            </span>
            <div>
              <h2
                id="create-workspace-title"
                className="text-[16px] font-semibold text-text-primary leading-none"
              >
                Create New Workspace
              </h2>
              <p className="text-[12px] text-text-secondary mt-1">
                Each workspace has its own independent folders and files.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-hover transition-colors"
            title="Close"
            aria-label="Close"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Workspace Name */}
          <div>
            <label className="block text-[13px] font-medium text-text-primary mb-1.5">
              Workspace Name <span className="text-danger">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Work, Personal, Client Project..."
              maxLength={32}
              className={`
                w-full px-3.5 py-2.5 text-[14px] bg-surface rounded-lg border
                transition-all outline-none text-text-primary placeholder:text-text-muted
                ${
                  error
                    ? "border-danger focus:ring-2 focus:ring-danger/20"
                    : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
                }
              `}
            />
            {error && (
              <p className="mt-1.5 text-[12px] text-danger font-medium flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          {/* Theme Color Picker — Awesomely shown colored circles */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[13px] font-medium text-text-primary">
                Workspace Color
              </label>
              <span className="text-[11px] font-medium text-text-muted">
                {activeColorObj?.label || "Custom"}
              </span>
            </div>
            <div className="p-3 bg-surface-secondary/70 rounded-xl border border-border-light">
              <div className="flex flex-wrap items-center gap-2.5 justify-between">
                {WORKSPACE_COLOR_OPTIONS.map((col) => {
                  const isSelected = selectedColor === col.value;
                  return (
                    <button
                      key={col.value}
                      type="button"
                      onClick={() => setSelectedColor(col.value)}
                      title={col.label}
                      className={`
                        relative w-8 h-8 rounded-full flex items-center justify-center
                        transition-all duration-150 active:scale-95
                        ${
                          isSelected
                            ? "scale-110 ring-2 ring-offset-2 ring-offset-surface ring-primary shadow-sm"
                            : "hover:scale-105 hover:shadow-xs opacity-90 hover:opacity-100"
                        }
                      `}
                      style={{
                        backgroundColor: col.value,
                        boxShadow: isSelected ? `0 2px 8px ${col.value}50` : undefined,
                      }}
                    >
                      {isSelected && (
                        <span className="text-white drop-shadow-xs flex items-center justify-center">
                          <CheckIcon size={14} color="#ffffff" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="pt-1">
            <label className="block text-[11px] font-medium text-text-muted uppercase tracking-wider mb-1.5">
              Preview
            </label>
            <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-border bg-surface transition-all shadow-xs">
              <span
                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-xs transition-all"
                style={{
                  backgroundColor: selectedColor,
                  boxShadow: `0 2px 8px ${selectedColor}40`,
                }}
              >
                {initialLetter}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold text-text-primary truncate">
                  {name.trim() || "Workspace Name"}
                </p>
                <p className="text-[11px] text-text-secondary">0 items</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2 text-[13px] font-medium text-text-secondary rounded-lg
                hover:bg-surface-hover hover:text-text-primary transition-colors
              "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="
                px-4 py-2 text-[13px] font-medium text-white bg-primary rounded-lg
                hover:bg-primary-hover active:scale-97 shadow-sm transition-all
              "
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
