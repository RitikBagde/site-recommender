"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/shared/ThemeProvider";
import type { CategoryFilter, CategoryOption, RegionOption } from "@/types";
import {
  Home,
  Info,
  Search,
  ChevronDown,
  Globe2,
  Shield,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface MobileHeaderProps {
  categories: CategoryOption[];
  regions: RegionOption[];
  activeCategory: CategoryFilter;
  activeRegion: string;
  searchQuery: string;
  onCategoryChange: (category: CategoryFilter) => void;
  onRegionChange: (region: string) => void;
  onSearchChange: (query: string) => void;
  onHomeClick: () => void;
  className?: string;
}

export function MobileHeader({
  categories,
  regions,
  activeCategory,
  activeRegion,
  searchQuery,
  onCategoryChange,
  onRegionChange,
  onSearchChange,
  onHomeClick,
  className,
}: MobileHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [regionOpen, setRegionOpen] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  const cycleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const ThemeIcon = theme === "dark" ? Moon : Sun;
  const themeLabel = theme === "dark" ? "Dark theme" : "Light theme";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        setRegionOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentRegionLabel = activeRegion === "ALL"
    ? "All regions"
    : regions.find((r) => r.code === activeRegion)?.label ?? activeRegion;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-brand-border bg-brand-bg/95 backdrop-blur-sm lg:hidden",
        className,
      )}
    >
      <div className="space-y-3 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              WhereWatch
            </p>
            <h2 className="text-xl font-bold tracking-tight text-primary">
              Discover Platforms
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={cycleTheme} className="rounded-lg border border-brand-border bg-brand-surface p-2 text-muted transition-colors hover:text-brand-glow" aria-label={themeLabel} title={themeLabel}>
              <ThemeIcon className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button type="button" onClick={onHomeClick} className="rounded-lg border border-brand-border bg-brand-surface p-2 text-muted transition-colors hover:text-brand-glow" aria-label="Go home">
              <Home className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <Link href="/about" className="rounded-lg border border-brand-border bg-brand-surface p-2 text-muted transition-colors hover:text-brand-glow" aria-label="About this directory">
              <Info className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <Link href="/dmca" className="rounded-lg border border-brand-border bg-brand-surface p-2 text-muted transition-colors hover:text-brand-glow" aria-label="DMCA Policy" title="DMCA Policy — Copyright Takedown Requests">
              <Shield className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-brand-border bg-brand-surface p-2">
          <div className="flex items-center gap-2">
            <Search className="ml-1 h-4 w-4 text-muted" strokeWidth={1.5} />
            <Input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search platforms..."
              aria-label="Search platforms"
              className="h-9 border-0 bg-transparent"
            />
          </div>
          <div ref={regionRef} className="relative block">
            <button
              type="button"
              onClick={() => setRegionOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-brand-border bg-brand-bg px-4 py-2.5 text-sm text-muted transition-colors hover:border-brand-glow"
            >
              <span className="flex items-center gap-2.5">
                <Globe2 className="size-4 text-muted" strokeWidth={1.5} />
                <span className="font-medium text-primary">{currentRegionLabel}</span>
              </span>
              <ChevronDown className={cn("size-4 transition-transform", regionOpen && "rotate-180")} strokeWidth={1.5} />
            </button>

            {regionOpen && (
              <div className="absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-xl border border-brand-border bg-brand-surface shadow-lg">
                <button
                  type="button"
                  onClick={() => { onRegionChange("ALL"); setRegionOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors",
                    activeRegion === "ALL"
                      ? "bg-brand-glow/10 text-primary"
                      : "text-muted hover:bg-brand-bg hover:text-primary",
                  )}
                >
                  <span>🌐</span>
                  <span>All regions</span>
                </button>
                {regions.map((region) => (
                  <button
                    key={region.code}
                    type="button"
                    onClick={() => { onRegionChange(region.code); setRegionOpen(false); }}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors",
                      activeRegion === region.code
                        ? "bg-brand-glow/10 text-primary"
                        : "text-muted hover:bg-brand-bg hover:text-primary",
                    )}
                  >
                    <span>{region.flag ?? "🌐"}</span>
                    <span>{region.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2">
            <button
              type="button"
              onClick={() => onCategoryChange("all")}
              className={cn(
                "rounded-pill border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                activeCategory === "all"
                  ? "border-brand-glow bg-brand-glow/10 text-primary"
                  : "border-brand-border bg-brand-surface text-muted hover:text-primary",
              )}
            >
              All
            </button>

            {categories.map((category) => {
              const isActive = activeCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange(category.id)}
                  className={cn(
                    "rounded-pill border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                    isActive
                      ? "border-brand-glow bg-brand-glow/10 text-primary"
                      : "border-brand-border bg-brand-surface text-muted hover:text-primary",
                  )}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
