// ---------------------------------------------------------------------------
// useSearch.ts — Workspace-wide recursive search
// ---------------------------------------------------------------------------

"use client";

import { useState, useMemo, useCallback } from "react";
import type { WorkspaceState, SearchResult } from "@/src/types/workspace";
import { getReadablePath } from "@/src/lib/workspace-utils";

export interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  clearSearch: () => void;
}

export function useSearch(items: WorkspaceState): UseSearchReturn {
  const [query, setQuery] = useState("");

  const isSearching = query.trim().length > 0;

  const results = useMemo<SearchResult[]>(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const allItems = Object.values(items);
    const matches: SearchResult[] = [];

    for (const item of allItems) {
      if (item.name.toLowerCase().includes(trimmed)) {
        matches.push({
          id: item.id,
          name: item.name,
          type: item.type,
          path: getReadablePath(items, item.id),
        });
      }
    }

    // Sort: folders first, then alphabetical
    matches.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    return matches;
  }, [query, items]);

  const clearSearch = useCallback(() => {
    setQuery("");
  }, []);

  return { query, setQuery, results, isSearching, clearSearch };
}
