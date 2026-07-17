import { cn } from "@/lib/utils";

interface PlatformCardSkeletonProps {
  className?: string;
}

export function PlatformCardSkeleton({ className }: PlatformCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-card border border-brand-border bg-brand-surface p-4",
        className,
      )}
    >
      <div className="mb-3 flex items-start gap-3">
        <div className="h-8 w-8 shrink-0 rounded-md border border-brand-border t-skel-shimmer" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded-md t-skel-shimmer" />
          <div className="h-3 w-1/2 rounded-md t-skel-shimmer" />
        </div>
      </div>
      <div className="mb-4 space-y-2">
        <div className="h-3 w-full rounded-md t-skel-shimmer" />
        <div className="h-3 w-5/6 rounded-md t-skel-shimmer" />
      </div>
      <div className="mt-auto flex gap-2">
        <div className="h-5 w-20 rounded-pill t-skel-shimmer" />
        <div className="h-5 w-24 rounded-pill t-skel-shimmer" />
      </div>
    </div>
  );
}