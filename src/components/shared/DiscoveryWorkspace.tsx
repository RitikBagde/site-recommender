"use client";

import { ControlConsole } from "@/components/desktop/ControlConsole";
import { FeedbackLauncher } from "@/components/feedback/FeedbackLauncher";
import { JumpBottomSheet } from "@/components/mobile/JumpBottomSheet";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { DirectoryGrid } from "@/components/shared/DirectoryGrid";
import { DirectoryGridSkeleton } from "@/components/shared/DirectoryGridSkeleton";
import { HeroBanner } from "@/components/shared/HeroBanner";
import { StatBanner } from "@/components/shared/StatBanner";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  countByCategory,
  countUniquePlatforms,
  filterListings,
  getCategoryLabel,
} from "@/lib/listings";
import { cn } from "@/lib/utils";
import type { CategoryFilter, DataSourceMeta, ListingDatasource, PlatformListing } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface DiscoveryWorkspaceProps {
  data: ListingDatasource;
  dataMeta?: DataSourceMeta;
}

const BOOKMARKS_KEY = "wherewatch:bookmarks";

function parseCategory(value: string | null): CategoryFilter {
  const valid: CategoryFilter[] = [
    "all",
    "movies",
    "tv-shows",
    "anime",
    "manga",
    "live-sports",
    "apps",
    "paid",
  ];

  if (value && valid.includes(value as CategoryFilter)) {
    return value as CategoryFilter;
  }

  return "all";
}

function parseRegion(value: string | null, allowed: string[]) {
  if (value && (allowed.includes(value) || value === "GLOBAL")) {
    return value === "GLOBAL" ? "ALL" : value;
  }

  return "ALL";
}

function getListingSearchFields(listing: PlatformListing): string[] {
  const domain = new URL(listing.url).hostname.replace(/^www\./, "");

  return [
    listing.name,
    listing.description ?? "",
    domain,
    listing.category,
    listing.paymentModel,
    ...listing.region,
  ];
}

export function DiscoveryWorkspace({ data, dataMeta }: DiscoveryWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const regionOptions = useMemo(() => data.regions.map((region) => region.code), [data.regions]);

  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(() =>
    parseCategory(searchParams.get("category")),
  );
  const [activeRegion, setActiveRegion] = useState(() => parseRegion(searchParams.get("region"), regionOptions));
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
  const [aboutOpen, setAboutOpen] = useState(false);
  const [bookmarks, setBookmarks, bookmarksHydrated] = useLocalStorage<string[]>(BOOKMARKS_KEY, []);

  const categoryCounts = useMemo(() => countByCategory(data.listings), [data.listings]);
  const uniquePlatformCount = useMemo(() => countUniquePlatforms(data.listings), [data.listings]);

  const regionFilteredListings = useMemo(
    () =>
      filterListings(data.listings, {
        category: activeCategory,
        region: activeRegion,
      }),
    [activeCategory, activeRegion, data.listings],
  );

  const visibleListings = useFuzzySearch(regionFilteredListings, searchQuery, getListingSearchFields);

  const sortedListings = useMemo(() => {
    if (bookmarks.length === 0) return visibleListings;

    return [...visibleListings].sort((left, right) => {
      const leftPinned = bookmarks.includes(left.id);
      const rightPinned = bookmarks.includes(right.id);

      if (leftPinned === rightPinned) return 0;
      return leftPinned ? -1 : 1;
    });
  }, [bookmarks, visibleListings]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const nextRegion = parseRegion(searchParams.get("region"), regionOptions);
    setActiveRegion(nextRegion);
  }, [regionOptions, searchParams]);

  useEffect(() => {
    if (!mounted || !bookmarksHydrated) return;

    const timer = window.setTimeout(() => setRevealed(true), 480);
    return () => window.clearTimeout(timer);
  }, [bookmarksHydrated, mounted]);

  const syncUrl = useCallback(
    (category: CategoryFilter, region: string, query: string) => {
      const params = new URLSearchParams();

      if (category !== "all") {
        params.set("category", category);
      }

      if (region !== "ALL") {
        params.set("region", region);
      }

      if (query.trim()) {
        params.set("q", query.trim());
      }

      const next = params.toString();
      router.replace(next ? `?${next}` : "/", { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    if (!mounted) return;
    syncUrl(activeCategory, activeRegion, searchQuery);
  }, [activeCategory, activeRegion, mounted, searchQuery, syncUrl]);

  const handleCategoryChange = useCallback((category: CategoryFilter) => {
    setActiveCategory(category);
  }, []);

  const handleRegionChange = useCallback((region: string) => {
    setActiveRegion(region);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleHomeClick = useCallback(() => {
    setActiveCategory("all");
    setActiveRegion("ALL");
    setSearchQuery("");
    setAboutOpen(false);
  }, []);

  const handleAboutClick = useCallback(() => {
    setAboutOpen((current) => !current);
  }, []);

  const handleTogglePin = useCallback(
    (listingId: string) => {
      setBookmarks((current) =>
        current.includes(listingId)
          ? current.filter((id) => id !== listingId)
          : [...current, listingId],
      );
    },
    [setBookmarks],
  );

  const activeCategoryLabel = getCategoryLabel(activeCategory, data.categories);
  const activeRegionLabel =
    activeRegion === "ALL"
      ? "All regions"
      : data.regions.find((region) => region.code === activeRegion)?.label ?? activeRegion;

  return (
    <div className="min-h-screen bg-brand-bg">
      <StatBanner
        totalPlatforms={uniquePlatformCount}
        totalCategories={data.categories.length}
        totalRegions={data.regions.length}
        className="hidden lg:block"
      />

      <HeroBanner />

      <div className="mx-auto flex max-w-[1600px]">
        <ControlConsole
          categories={data.categories}
          regions={data.regions}
          activeCategory={activeCategory}
          activeRegion={activeRegion}
          categoryCounts={categoryCounts}
          uniquePlatformCount={uniquePlatformCount}
          searchQuery={searchQuery}
          onCategoryChange={handleCategoryChange}
          onRegionChange={handleRegionChange}
          onSearchChange={handleSearchChange}
          onHomeClick={handleHomeClick}
          onAboutClick={handleAboutClick}
        />

        <div className="min-w-0 flex-1">
          <MobileHeader
            categories={data.categories}
            regions={data.regions}
            activeCategory={activeCategory}
            activeRegion={activeRegion}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onRegionChange={handleRegionChange}
            onSearchChange={handleSearchChange}
            onHomeClick={handleHomeClick}
            onAboutClick={handleAboutClick}
          />

          <main id="streaming-directory" className="space-y-6 px-4 py-4 pb-24 lg:px-6 lg:py-6 lg:pb-6">
            <div className="hidden lg:block">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Active View</p>
              <h2 className="text-2xl font-bold text-primary">{activeCategoryLabel}</h2>
              <p className="mt-1 text-sm text-muted">
                {sortedListings.length} listing{sortedListings.length === 1 ? "" : "s"} in {activeRegionLabel}
                {bookmarks.length > 0 && (
                  <span className="ml-2 font-mono text-xs text-brand-purple">· {bookmarks.length} pinned</span>
                )}
                {dataMeta?.fallbackUsed && (
                  <span className="ml-2 font-mono text-xs text-muted">· offline cache</span>
                )}
              </p>
            </div>

            <AnimatePresence>
              {aboutOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
                  onClick={() => setAboutOpen(false)}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    className="w-full max-w-xl rounded-card border border-brand-border bg-brand-surface p-5 shadow-card-glow"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-muted">About this directory</p>
                        <h3 className="mt-1 text-xl font-semibold text-primary">Discover streaming and reading services</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAboutOpen(false)}
                        className="rounded-full border border-brand-border bg-brand-bg px-2.5 py-1 text-sm text-muted"
                      >
                        Close
                      </button>
                    </div>
                    <p className="mt-4 leading-7 text-muted">
                      WhereWatch helps you explore streaming, reading, and media platforms across regions. The workspace keeps search, filtering, and bookmarks in sync so you can jump straight to the most relevant options without friction.
                    </p>
                    <div className="mt-5 rounded-lg border border-brand-border/70 bg-brand-bg/70 p-3 text-sm text-muted">
                      <p className="font-medium text-primary">Privacy-first support</p>
                      <p className="mt-1 leading-6">
                        Support is routed through an anonymous Monero-facing endpoint so no personal banking information or trackable payment handles are exposed.
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={cn("t-skel", revealed && "is-revealed")}>
              <div className="t-skel-skeleton is-pulsing">
                <DirectoryGridSkeleton count={10} />
              </div>
              <div className="t-skel-content">
                <DirectoryGrid
                  listings={sortedListings}
                  pinnedIds={bookmarks}
                  onTogglePin={handleTogglePin}
                  groupByCategory={activeCategory === "all"}
                />
              </div>
            </div>
          </main>
        </div>
      </div>

      <JumpBottomSheet
        categories={data.categories}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <FeedbackLauncher />
    </div>
  );
}
