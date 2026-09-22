// ---------------------------------------------------------------------------
// SearchOverlay.tsx — Search input + results overlay
// ---------------------------------------------------------------------------

"use client";

import { useEffect, useRef, useCallback } from "react";
import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { useSearch } from "@/src/hooks/useSearch";
import {
  SearchIcon,
  CloseIcon,
  FolderIcon,
} from "@/src/_components/ui/icons/Icons";
import { resolveFileIcon } from "@/src/lib/icon-resolver";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const { items, navigateToFolder, openFile } = useWorkspaceContext();
  const { query, setQuery, results, isSearching, clearSearch } = useSearch(items);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow animation
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      clearSearch();
    }
  }, [isOpen, clearSearch]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleResultClick = useCallback(
    (result: (typeof results)[0]) => {
      if (result.type === "folder") {
        navigateToFolder(result.id);
      } else {
        // Navigate to parent folder, then open file
        const file = items[result.id];
        if (file) {
          navigateToFolder(file.parentId);
          openFile(result.id);
        }
      }
      onClose();
    },
    [items, navigateToFolder, openFile, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 animate-fade-in"
        onClick={onClose}
      />

      {/* Search panel */}
      <div className="relative z-10 w-full max-w-xl mx-auto mt-[15vh] animate-scale-in">
        <div className="bg-white rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden border border-border">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <SearchIcon size={18} color="#4c35ae" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files and folders..."
              className="
                flex-1 text-sm text-text-primary
                placeholder:text-text-muted
                bg-transparent outline-none
              "
              autoComplete="off"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded hover:bg-surface-hover transition-colors"
                aria-label="Clear search"
              >
                <CloseIcon size={14} />
              </button>
            )}
            <kbd className="text-[10px] font-mono text-text-muted bg-surface-secondary px-1.5 py-0.5 rounded border border-border-light">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto">
            {isSearching && results.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-text-muted">
                  No results found for &ldquo;
                  <span className="text-text-primary font-medium">{query}</span>
                  &rdquo;
                </p>
              </div>
            ) : (
              results.map((result) => {
                const isFolder = result.type === "folder";
                const fileIcon = !isFolder
                  ? resolveFileIcon(result.name)
                  : null;

                return (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="
                      w-full flex items-center gap-3 px-4 py-2.5
                      hover:bg-primary-subtle
                      transition-colors duration-100
                      text-left
                    "
                  >
                    {/* Icon */}
                    <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-md bg-surface-secondary">
                      {isFolder ? (
                        <FolderIcon size={15} color="#4c35ae" />
                      ) : (
                        fileIcon && (
                          <fileIcon.component
                            size={15}
                            color={fileIcon.color}
                          />
                        )
                      )}
                    </span>

                    {/* Name + path */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {result.name}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">
                        {result.path}
                      </p>
                    </div>

                    {/* Type badge */}
                    <span
                      className={`
                      shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded
                      ${isFolder
                          ? "bg-primary-light text-primary"
                          : "bg-[#dbeafe] text-[#1d4ed8]"
                        }
                    `}
                    >
                      {isFolder ? "Folder" : "File"}
                    </span>
                  </button>
                );
              })
            )}

            {!isSearching && (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-text-muted">
                  Type to search across all files and folders
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
