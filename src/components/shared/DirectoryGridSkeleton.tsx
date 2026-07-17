"use client";

import { PlatformCardSkeleton } from "@/components/shared/PlatformCardSkeleton";
import { cn } from "@/lib/utils";

interface DirectoryGridSkeletonProps {
  count?: number;
  className?: string;
}

export function DirectoryGridSkeleton({
  count = 10,
  className,
}: DirectoryGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <PlatformCardSkeleton key={index} />
      ))}
    </div>
  );
}
