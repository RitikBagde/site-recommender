"use client";

import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { useCategoryTracker } from "@/hooks/useCategoryTracker";
import { cn } from "@/lib/utils";
import { useTheme, type Theme } from "@/components/shared/ThemeProvider";
import type { CategoryFilter, CategoryOption, MediaCategory, RegionOption } from "@/types";
import {
  BadgeDollarSign,
  BookOpen,
  Film,
  Globe2,
  Home,
  LayoutGrid,
  Smartphone,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Trophy,
  Tv,
  Info,
  Shield,
} from "lucide-react";
import Link from "next/link";
import type { ElementType } from "react";

const categoryIcons: Record<MediaCategory, ElementType> = {
  movies: Film,
  "tv-shows": Tv,
  anime: Sparkles,
  manga: BookOpen,
  "live-sports": Trophy,
  apps: Smartphone,
  paid: BadgeDollarSign,
};

interface ControlConsoleProps {
  categories: CategoryOption[];
  regions: RegionOption[];
  activeCategory: CategoryFilter;
  activeRegion: string;
  categoryCounts: Record<MediaCategory, number>;
  uniquePlatformCount: number;
  searchQuery: string;
  onCategoryChange: (category: CategoryFilter) => void;
  onRegionChange: (region: string) => void;
  onSearchChange: (query: string) => void;
  onHomeClick: () => void;
  className?: string;
}

export function ControlConsole({
  categories,
  regions,
  activeCategory,
  activeRegion,
  categoryCounts,
  uniquePlatformCount,
  searchQuery,
  onCategoryChange,
  onRegionChange,
  onSearchChange,
  onHomeClick,
  className,
}: ControlConsoleProps) {
  const { theme, setTheme } = useTheme();
  const { navRef, pillRef, registerItem } = useCategoryTracker<HTMLButtonElement>(
    activeCategory,
  );

  const themeOptions: { value: Theme; label: string; icon: ElementType }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen w-console shrink-0 flex-col border-r border-brand-border bg-brand-surface lg:flex",
        className,
      )}
    >
      <div className="border-b border-brand-border p-4">
        <div className="mb-1 flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-brand-glow" strokeWidth={1.5} />
          <span className="text-sm font-semibold text-primary">WhereWatch</span>
        </div>
        <p className="text-xs text-muted">Control Console</p>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onHomeClick}
            className="flex h-10 items-center justify-center rounded-lg border border-brand-border bg-brand-bg px-3 text-muted transition-colors hover:text-brand-glow"
            aria-label="Go home"
          >
            <Home className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <Link
            href="/about"
            className="flex h-10 items-center justify-center rounded-lg border border-brand-border bg-brand-bg px-3 text-muted transition-colors hover:text-brand-glow"
            aria-label="About this directory"
          >
            <Info className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link
            href="/dmca"
            className="flex h-10 items-center justify-center rounded-lg border border-brand-border bg-brand-bg px-3 text-muted transition-colors hover:text-brand-glow"
            aria-label="DMCA Policy"
            title="DMCA Policy — Copyright Takedown Requests"
          >
            <Shield className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>

        <div>
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
            Search
          </span>
          <Input
            showSearchIcon
            kbdHint="⌘K"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search platforms..."
            aria-label="Search platforms"
          />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onRegionChange("ALL")}
            className={cn(
              "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
              activeRegion === "ALL"
                ? "border-brand-glow bg-brand-glow/10 text-primary"
                : "border-brand-border bg-brand-bg text-muted hover:text-primary",
            )}
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true">🌐</span>
              All regions
            </span>
            <span className="font-mono text-xs text-muted">ALL</span>
          </button>
          <Dropdown
            label="Region"
            options={regions.map((region) => ({
              value: region.code,
              label: `${region.flag ?? "🌐"} ${region.label}`,
            }))}
            value={activeRegion}
            onChange={onRegionChange}
          />
        </div>

        <div>
          <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
            Theme
          </span>
          <div className="flex gap-1 rounded-lg border border-brand-border bg-brand-bg p-1">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs transition-colors",
                  theme === value
                    ? "bg-brand-surface text-primary shadow-sm"
                    : "text-muted hover:text-primary",
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <nav aria-label="Categories">
          <span className="mb-3 block text-xs font-medium uppercase tracking-wide text-muted">
            Categories
          </span>
          <ul ref={navRef} className="t-tracker relative flex flex-col gap-1 pl-1">
            <span
              ref={pillRef}
              className="t-tracker-pill"
              aria-hidden="true"
            />

            <li>
              <button
                ref={(element) => registerItem("all", element)}
                type="button"
                onClick={() => onCategoryChange("all")}
                aria-selected={activeCategory === "all"}
                className={cn(
                  "relative z-10 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  activeCategory === "all"
                    ? "bg-brand-bg/80 font-medium text-primary"
                    : "text-muted hover:bg-brand-bg hover:text-primary",
                )}
              >
                <span className="flex items-center gap-2.5">
                  <LayoutGrid
                    className={cn(
                      "h-4 w-4",
                      activeCategory === "all" ? "text-brand-glow" : "text-muted",
                    )}
                    strokeWidth={1.5}
                  />
                  All
                </span>
                <span className="font-mono text-xs text-muted">
                  {uniquePlatformCount}
                </span>
              </button>
            </li>

            {categories.map((category) => {
              const Icon = categoryIcons[category.id];
              const isActive = activeCategory === category.id;

              return (
                <li key={category.id}>
                  <button
                    ref={(element) => registerItem(category.id, element)}
                    type="button"
                    onClick={() => onCategoryChange(category.id)}
                    aria-selected={isActive}
                    className={cn(
                      "relative z-10 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      isActive
                        ? "bg-brand-bg/80 font-medium text-primary"
                        : "text-muted hover:bg-brand-bg hover:text-primary",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isActive ? "text-brand-glow" : "text-muted",
                        )}
                        strokeWidth={1.5}
                      />
                      {category.label}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {categoryCounts[category.id]}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
