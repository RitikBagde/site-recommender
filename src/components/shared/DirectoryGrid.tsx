"use client";

import { PlatformCard } from "@/components/shared/PlatformCard";
import { cn } from "@/lib/utils";
import type { MediaCategory, PlatformListing } from "@/types";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { BadgeDollarSign, BookOpen, Film, Smartphone, Sparkles, Trophy, Tv } from "lucide-react";
import type { ElementType } from "react";

interface DirectoryGridProps {
  listings: PlatformListing[];
  pinnedIds?: string[];
  onTogglePin?: (listingId: string) => void;
  groupByCategory?: boolean;
  className?: string;
}

const layoutTransition = {
  type: "spring" as const,
  stiffness: 350,
  damping: 30,
  mass: 0.8,
};

const categoryMeta: Array<{
  id: MediaCategory;
  label: string;
  description: string;
  icon: ElementType;
}> = [
  {
    id: "anime",
    label: "Anime",
    description: "Anime streaming and aggregators",
    icon: Sparkles,
  },
  {
    id: "manga",
    label: "Manga",
    description: "Manga libraries, readers, and chapter drops",
    icon: BookOpen,
  },
  {
    id: "live-sports",
    label: "Live TV & Sports",
    description: "Live broadcasts, sports channels, and event streams",
    icon: Trophy,
  },
  {
    id: "movies",
    label: "Movies & Shows",
    description: "On-demand films, series, and cinematic bundles",
    icon: Film,
  },
  {
    id: "tv-shows",
    label: "TV Shows",
    description: "Episodic series and premium streaming collections",
    icon: Tv,
  },
  {
    id: "apps",
    label: "Apps",
    description: "Media apps, viewers, and organization tools",
    icon: Smartphone,
  },
  {
    id: "paid",
    label: "Paid",
    description: "Subscription-only services and premium access",
    icon: BadgeDollarSign,
  },
];

function buildCategorySections(listings: PlatformListing[]) {
  const sections = categoryMeta.map((meta) => ({
    ...meta,
    items: [] as PlatformListing[],
  }));

  listings.forEach((listing) => {
    const sectionId = listing.paymentModel === "subscription" ? "paid" : listing.category;
    const section = sections.find((item) => item.id === sectionId);
    if (section) {
      section.items.push(listing);
    }
  });

  return sections.filter((section) => section.items.length > 0);
}

export function DirectoryGrid({
  listings,
  pinnedIds = [],
  onTogglePin,
  groupByCategory = false,
  className,
}: DirectoryGridProps) {
  if (listings.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-48 items-center justify-center rounded-card border border-dashed border-brand-border bg-brand-surface/40 p-8 text-center",
          className,
        )}
      >
        <p className="text-sm text-muted">No platforms match the current view.</p>
      </div>
    );
  }

  if (groupByCategory) {
    const sections = buildCategorySections(listings);

    return (
      <div className={cn("space-y-6", className)}>
        {sections.map((section) => {
          const Icon = section.icon;

          return (
            <section key={section.id} className="space-y-3">
              <div className="flex items-center justify-between rounded-card border border-brand-border bg-brand-surface/70 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border bg-brand-bg/70">
                    <Icon className="h-4 w-4 text-brand-glow" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{section.label}</p>
                    <p className="text-xs text-muted">{section.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-pill border border-brand-border bg-brand-bg/60 px-2.5 py-1 text-xs font-medium text-primary">
                    {section.label} {section.items.length}
                  </span>
                  <span className="hidden text-xs text-muted sm:block">
                    {section.description}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                {section.items.map((listing) => (
                  <PlatformCard
                    key={listing.id}
                    listing={listing}
                    isPinned={pinnedIds.includes(listing.id)}
                    onTogglePin={onTogglePin}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <LayoutGroup>
      <motion.div
        layout
        className={cn(
          "t-resize grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7",
          className,
        )}
      >
        <AnimatePresence mode="popLayout">
          {listings.map((listing) => (
            <motion.div
              key={listing.id}
              layout
              initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
              transition={layoutTransition}
              className="h-full"
            >
              <PlatformCard
                listing={listing}
                isPinned={pinnedIds.includes(listing.id)}
                onTogglePin={onTogglePin}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
