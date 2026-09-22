// ---------------------------------------------------------------------------
// icon-resolver.ts — Maps file extensions to icon components + colors
// ---------------------------------------------------------------------------

import {
  FileTextIcon,
  FileGenericIcon,
} from "@/src/_components/ui/icons/Icons";
import type { ComponentType } from "react";

interface IconMapping {
  component: ComponentType<{ size?: number; color?: string; className?: string }>;
  color: string;
}

const ICON_MAP: Record<string, IconMapping> = {
  ".txt":  { component: FileTextIcon,    color: "#3b82f6" },  // Blue
  ".md":   { component: FileTextIcon,    color: "#06b6d4" },  // Cyan
  ".json": { component: FileGenericIcon, color: "#f59e0b" },  // Amber
  ".log":  { component: FileGenericIcon, color: "#8b5cf6" },  // Violet
  ".csv":  { component: FileGenericIcon, color: "#10b981" },  // Emerald
  ".xml":  { component: FileGenericIcon, color: "#f97316" },  // Orange
  ".html": { component: FileTextIcon,    color: "#ef4444" },  // Red
  ".css":  { component: FileTextIcon,    color: "#3b82f6" },  // Blue
  ".js":   { component: FileGenericIcon, color: "#eab308" },  // Yellow
  ".ts":   { component: FileGenericIcon, color: "#3b82f6" },  // Blue
};

const DEFAULT_ICON: IconMapping = {
  component: FileGenericIcon,
  color: "#64748b", // Slate
};

/**
 * Get the icon component and color for a given filename.
 */
export function resolveFileIcon(filename: string): IconMapping {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1 || dotIndex === 0) return DEFAULT_ICON;

  const ext = filename.slice(dotIndex).toLowerCase();
  return ICON_MAP[ext] ?? DEFAULT_ICON;
}
