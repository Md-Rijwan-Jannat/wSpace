// ---------------------------------------------------------------------------
// Icon components — Colorful inline SVGs for workspace explorer
// ---------------------------------------------------------------------------

import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

// ---- Folder (Closed) — Primary Purple -------------------------------------

export function FolderIcon({ size = 20, color = "#4c35ae", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M2 6C2 4.89543 2.89543 4 4 4H9L11 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z"
        fill={color}
        opacity={0.2}
      />
      <path
        d="M2 6C2 4.89543 2.89543 4 4 4H9L11 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// ---- Folder Plus — Create Folder Icon -------------------------------------

export function FolderPlusIcon({ size = 20, color = "#4c35ae", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M2 6C2 4.89543 2.89543 4 4 4H9L11 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z"
        fill={color}
        opacity={0.15}
      />
      <path
        d="M2 6C2 4.89543 2.89543 4 4 4H9L11 6H20C21.1046 6 22 6.89543 22 8V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Plus design */}
      <line x1="12" y1="10" x2="12" y2="16" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1="9" y1="13" x2="15" y2="13" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

// ---- File Plus — Create File Icon -----------------------------------------

export function FilePlusIcon({ size = 20, color = "#3b82f6", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
        fill={color}
        opacity={0.12}
      />
      <path
        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* Plus design */}
      <line x1="12" y1="11.5" x2="12" y2="17.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <line x1="9" y1="14.5" x2="15" y2="14.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

// ---- Folder (Open) — Lighter Purple ---------------------------------------

export function FolderOpenIcon({ size = 20, color = "#6d5cc5", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M2 6C2 4.89543 2.89543 4 4 4H9L11 6H20C21.1046 6 22 6.89543 22 8V9H6L2 18V6Z"
        fill={color}
        opacity={0.2}
      />
      <path
        d="M4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6H11L9 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 14L6 9H22L18 14H2Z"
        fill={color}
        opacity={0.15}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---- File Text — Blue -----------------------------------------------------

export function FileTextIcon({ size = 20, color = "#3b82f6", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
        fill={color}
        opacity={0.12}
      />
      <path
        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <line x1="8" y1="17" x2="13" y2="17" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

// ---- File Generic — Slate -------------------------------------------------

export function FileGenericIcon({ size = 20, color = "#64748b", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
        fill={color}
        opacity={0.12}
      />
      <path
        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Chevron — Rotatable --------------------------------------------------

export function ChevronIcon({
  size = 16,
  color = "#94a3b8",
  className,
  ...props
}: IconProps & { color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M9 6L15 12L9 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---- Search ---------------------------------------------------------------

export function SearchIcon({ size = 20, color = "#94a3b8", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="11" cy="11" r="7" stroke={color} strokeWidth={1.5} />
      <path d="M16.5 16.5L21 21" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

// ---- Plus -----------------------------------------------------------------

export function PlusIcon({ size = 20, color = "#4c35ae", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.5} fill={color} opacity={0.1} />
      <path d="M12 8V16M8 12H16" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

// ---- Pencil (Rename) — Amber ----------------------------------------------

export function PencilIcon({ size = 16, color = "#f59e0b", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M16.474 5.408l2.118 2.118m-.756-3.982L12.109 9.27a2.118 2.118 0 00-.58 1.082L11 13l2.648-.53a2.118 2.118 0 001.082-.58l5.727-5.727a1.853 1.853 0 10-2.621-2.621z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 15v3a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h3"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---- Trash (Delete) — Red -------------------------------------------------

export function TrashIcon({ size = 16, color = "#ef4444", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 6H5H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11V17" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <path d="M14 11V17" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

// ---- Close (X) ------------------------------------------------------------

export function CloseIcon({ size = 16, color = "#64748b", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18 6L6 18M6 6L18 18" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Save -----------------------------------------------------------------

export function SaveIcon({ size = 16, color = "#10b981", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M20 6L9 17L4 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Arrow Left (Back) ----------------------------------------------------

export function ArrowLeftIcon({ size = 20, color = "#64748b", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Workspace / Home icon ------------------------------------------------

export function WorkspaceIcon({ size = 18, color = "#4c35ae", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        fill={color}
        opacity={0.12}
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 22V12H15V22" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Menu (Hamburger) — Mobile toggle -------------------------------------

export function MenuIcon({ size = 24, color = "#1a1a2e", ...props }: IconProps & { color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 12H21M3 6H21M3 18H21" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---- Empty Folder Illustration --------------------------------------------

export function EmptyFolderIllustration({ size = 120, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Base folder */}
      <rect x="15" y="35" width="90" height="60" rx="6" fill="#ede9f9" stroke="#4c35ae" strokeWidth="1.5" />
      {/* Folder tab */}
      <path d="M15 41C15 37.6863 17.6863 35 21 35H40L46 29H54L60 35H99C102.314 35 105 37.6863 105 41V35H15V41Z" fill="#4c35ae" opacity="0.15" />
      {/* Dashed content lines */}
      <line x1="35" y1="60" x2="85" y2="60" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
      <line x1="35" y1="70" x2="75" y2="70" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
      <line x1="35" y1="80" x2="65" y2="80" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
      {/* Plus circle */}
      <circle cx="95" cy="85" r="14" fill="#4c35ae" opacity="0.9" />
      <path d="M95 79V91M89 85H101" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
