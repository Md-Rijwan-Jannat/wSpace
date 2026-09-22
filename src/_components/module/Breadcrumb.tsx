// ---------------------------------------------------------------------------
// Breadcrumb.tsx — Clickable path breadcrumb bar
// ---------------------------------------------------------------------------

"use client";

import { useWorkspaceContext } from "@/src/context/WorkspaceContext";
import { useWorkspaceManagerContext } from "@/src/context/WorkspaceManagerContext";
import { ChevronIcon } from "@/src/_components/ui/icons/Icons";

export function Breadcrumb() {
  const { breadcrumbPath, navigateToFolder } = useWorkspaceContext();
  const { activeWorkspace } = useWorkspaceManagerContext();

  return (
    <nav className="flex items-center gap-1 text-[13px] min-h-[20px] flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar py-0.5">
      {/* Root / Workspace */}
      <button
        suppressHydrationWarning
        onClick={() => navigateToFolder(null)}
        className="
          flex items-center gap-1.5 px-1.5 py-0.5 rounded
          text-text-secondary hover:text-primary hover:bg-primary-subtle
          transition-colors duration-150 group
        "
        title={`Root (${activeWorkspace?.name || "Workspace"})`}
      >
        <span
          suppressHydrationWarning
          className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform group-hover:scale-125"
          style={{
            backgroundColor: activeWorkspace?.color || "#4c35ae",
            boxShadow: `0 0 5px ${activeWorkspace?.color || "#4c35ae"}80`,
          }}
        />
        <span className="relative font-medium text-text-primary" suppressHydrationWarning>
          {activeWorkspace?.name || "Workspace"}
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
