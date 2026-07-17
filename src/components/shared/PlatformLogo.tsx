"use client";

import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import type { MediaCategory } from "@/types";

const folderMap: Record<MediaCategory, string> = {
  movies: "movies_shows",
  "tv-shows": "movies_shows",
  anime: "anime",
  manga: "manga",
  "live-sports": "livetv",
  apps: "apps",
  paid: "paid_apps",
};

interface PlatformLogoProps {
  platformId: string;
  platformName: string;
  category: MediaCategory;
  className?: string;
}

export function PlatformLogo({
  platformId,
  platformName,
  category,
  className,
}: PlatformLogoProps) {
  const [hasError, setHasError] = useState(false);
  const folder = useMemo(() => folderMap[category], [category]);
  const fallbackLabel = platformName.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex h-full w-full shrink-0 items-center justify-center overflow-hidden rounded-md border border-brand-border bg-brand-bg",
        className,
      )}
    >
      {!hasError ? (
        <img
          src={`/assets/logos/${folder}/${platformId}.png`}
          alt={platformName}
          className="h-full w-full object-contain"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-xs font-semibold text-brand-glow">
          {fallbackLabel}
        </span>
      )}
    </div>
  );
}