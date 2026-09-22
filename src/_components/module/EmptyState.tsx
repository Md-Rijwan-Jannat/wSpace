// ---------------------------------------------------------------------------
// EmptyState.tsx — Beautiful empty state with illustration
// ---------------------------------------------------------------------------

import Image from "next/image";
import { PlusIcon } from "@/src/_components/ui/icons/Icons";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <Image
        src="/images/file-create.png"
        alt="Empty state illustration"
        width={180}
        height={180}
        className="mb-2 opacity-90 w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] lg:w-[180px] lg:h-[180px]"
        priority
      />

      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>

      <p className="text-sm text-text-secondary max-w-sm mb-6">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="
            inline-flex items-center gap-2 px-4 py-2 rounded-md
            bg-primary text-white text-sm font-medium
            hover:bg-primary-hover active:scale-[0.97]
            transition-all duration-150
            shadow-[0_1px_3px_rgba(76,53,174,0.3)]
          "
        >
          <PlusIcon size={16} color="white" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
