"use client";

import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const LOGO_INTRO_MS = 4500;

interface StatBannerProps {
  totalPlatforms: number;
  totalCategories: number;
  totalRegions: number;
  className?: string;
}

export function StatBanner({
  totalPlatforms,
  totalCategories,
  totalRegions,
  className,
}: StatBannerProps) {
  const [showVideo, setShowVideo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(false), LOGO_INTRO_MS);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: "Platforms", value: totalPlatforms },
    { label: "Categories", value: totalCategories },
    { label: "Regions", value: totalRegions },
  ];

  return (
    <section
      className={cn(
        "border-b border-brand-border bg-brand-surface/60",
        className,
      )}
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6 lg:py-3">
        <div className="flex items-center gap-4">
          <div className="group relative flex size-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-border transition-colors hover:border-brand-glow">
            <video
              src="/assets/logo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-300",
                showVideo
                  ? "visible opacity-100"
                  : "invisible opacity-0 group-hover:visible group-hover:opacity-100",
              )}
            />
            <img
              src="/assets/logo-img.png"
              alt="WhereWatch"
              className={cn(
                "relative size-full object-cover transition-opacity duration-300",
                showVideo
                  ? "invisible opacity-0"
                  : "visible opacity-100 group-hover:invisible group-hover:opacity-0",
              )}
            />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              WhereWatch Directory
            </p>
            <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
              Discover Platforms
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-pill border border-brand-border bg-brand-bg px-3 py-1.5 shadow-glow-sm"
            >
              <span className="font-mono text-xs text-muted">{stat.label}</span>
              <span className="ml-2 font-mono text-sm font-semibold text-brand-glow">
                <AnimatedNumber value={stat.value} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
