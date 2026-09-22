// ---------------------------------------------------------------------------
// FileEditor.tsx — Text file editor with save and dirty state
// ---------------------------------------------------------------------------

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { useToastContext } from "@/src/context/ToastContext";
import { Modal } from "@/src/_components/ui/shared/Modal";
import { ArrowLeftIcon, SaveIcon } from "@/src/_components/ui/icons/Icons";
import { resolveFileIcon } from "@/src/lib/icon-resolver";

export function FileEditor() {
  const { activeFileId, items, updateFileContent, closeFile } =
    useWorkspaceContext();
  const { showToast } = useToastContext();

  const file = activeFileId ? items[activeFileId] : null;
  const initialContent = file?.content ?? "";

  // State initialised from file — component is keyed by activeFileId
  // so it remounts when the file changes (no setState-in-effect needed)
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDirty = content !== savedContent;

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSave = useCallback(() => {
    if (!activeFileId) return;
    updateFileContent(activeFileId, content);
    setSavedContent(content);
    showToast("File saved successfully", "success");

    // Show "Saved ✓" briefly
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }, [activeFileId, content, updateFileContent, showToast]);

  const handleBack = useCallback(() => {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      closeFile();
    }
  }, [isDirty, closeFile]);

  const handleSaveAndLeave = useCallback(() => {
    if (activeFileId) {
      updateFileContent(activeFileId, content);
    }
    setShowUnsavedModal(false);
    closeFile();
  }, [activeFileId, content, updateFileContent, closeFile]);

  const handleDiscard = useCallback(() => {
    setShowUnsavedModal(false);
    closeFile();
  }, [closeFile]);

  // Keyboard shortcut: Ctrl/Cmd + S to save
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  if (!file) return null;

  const fileIcon = resolveFileIcon(file.name);

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface shrink-0">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="
              p-1.5 rounded-md
              hover:bg-surface-hover transition-colors
            "
            title="Back to folder"
            aria-label="Back to folder"
          >
            <ArrowLeftIcon size={18} />
          </button>

          {/* File icon + name */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <fileIcon.component size={18} color={fileIcon.color} />
            <span className="text-sm font-medium text-text-primary truncate">
              {file.name}
            </span>

            {/* Dirty indicator */}
            {isDirty && (
              <span
                className="w-2 h-2 rounded-full bg-warning shrink-0"
                title="Unsaved changes"
              />
            )}
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!isDirty && !justSaved}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium
              transition-all duration-150 active:scale-[0.97]
              ${justSaved
                ? "bg-success-light text-[#065f46] border border-[#a7f3d0]"
                : isDirty
                  ? "bg-primary text-white hover:bg-primary-hover shadow-[0_1px_3px_rgba(76,53,174,0.3)]"
                  : "bg-surface-secondary text-text-muted border border-border cursor-not-allowed"
              }
            `}
          >
            <SaveIcon
              size={14}
              color={justSaved ? "#10b981" : isDirty ? "white" : "#94a3b8"}
            />
            {justSaved ? "Saved ✓" : "Save"}
          </button>
        </div>

        {/* Textarea editor */}
        <div className="flex-1 p-4 bg-white">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start typing..."
            className="
              w-full h-full resize-none p-4 rounded-lg
              border border-border-light bg-surface-secondary
              text-sm text-text-primary leading-relaxed
              font-mono placeholder:text-text-muted
              focus:outline-none focus:border-primary/30 focus:shadow-[inset_0_1px_4px_rgba(0,0,0,0.04)]
              transition-all duration-150
            "
            spellCheck={false}
          />
        </div>

        {/* Footer bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-surface-secondary text-[11px] text-text-muted shrink-0">
          <span>
            {content.split("\n").length} lines · {content.length} characters
          </span>
          <span className="font-mono">
            <kbd>⌘S</kbd> save
          </span>
        </div>
      </div>

      {/* Unsaved changes modal */}
      <Modal
        isOpen={showUnsavedModal}
        onClose={() => setShowUnsavedModal(false)}
      >
        <div className="p-6">
          <h3 className="text-base font-semibold text-text-primary mb-2">
            Unsaved Changes
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            You have unsaved changes in{" "}
            <strong className="text-text-primary">{file.name}</strong>. What
            would you like to do?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowUnsavedModal(false)}
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                text-text-secondary hover:bg-surface-hover
                transition-colors
              "
            >
              Cancel
            </button>
            <button
              onClick={handleDiscard}
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                text-danger hover:bg-danger-light
                transition-colors
              "
            >
              Discard
            </button>
            <button
              onClick={handleSaveAndLeave}
              className="
                px-4 py-2 rounded-lg text-sm font-medium
                bg-primary text-white hover:bg-primary-hover
                active:scale-[0.97] transition-all duration-150
              "
            >
              Save & Leave
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
