// ---------------------------------------------------------------------------
// Breadcrumb.tsx — Clickable path breadcrumb bar
// ---------------------------------------------------------------------------

"use client";

import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { WorkspaceIcon, ChevronIcon } from "@/src/_components/ui/icons/Icons";

export function Breadcrumb() {
  const { breadcrumbPath, navigateToFolder } = useWorkspaceContext();

  return (
    <nav className="flex items-center gap-1 text-[13px] min-h-[20px] flex-wrap">
      {/* Root / Workspace */}
      <button
        onClick={() => navigateToFolder(null)}
        className="
          flex items-center gap-1.5 px-1.5 py-0.5 rounded
          text-text-secondary hover:text-primary hover:bg-primary-subtle
          transition-colors duration-150 group
        "
      >
        <WorkspaceIcon size={14} color="currentColor" />
        <span className="relative">
          Workspace
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-150" />
        </span>
      </button>

      {/* Path segments */}
      {breadcrumbPath.map((item, index) => {
        const isLast = index === breadcrumbPath.length - 1;

        return (
          <span key={item.id} className="flex items-center gap-1">
            <ChevronIcon size={10} color="#94a3b8" />

            {isLast ? (
              <span className="px-1.5 py-0.5 text-text-primary font-medium">
                {item.name}
              </span>
            ) : (
              <button
                onClick={() => navigateToFolder(item.id)}
                className="
                  px-1.5 py-0.5 rounded
                  text-text-secondary hover:text-primary hover:bg-primary-subtle
                  transition-colors duration-150 group relative
                "
              >
                <span className="relative">
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-150" />
                </span>
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
