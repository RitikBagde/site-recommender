"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CategoryFilter, CategoryOption } from "@/types";
import { Compass, X } from "lucide-react";
import { useEffect, useState } from "react";

interface JumpBottomSheetProps {
  categories: CategoryOption[];
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  className?: string;
}

export function JumpBottomSheet({
  categories,
  activeCategory,
  onCategoryChange,
  className,
}: JumpBottomSheetProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className={cn("lg:hidden", className)}>
      <Button
        variant="accent"
        size="icon"
        aria-label="Jump to category"
        onClick={() => setOpen(true)}
        className="fixed right-4 bottom-6 z-40 rounded-full shadow-glow-md"
      >
        <Compass className="h-5 w-5" strokeWidth={1.5} />
      </Button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close category navigation"
            className="fixed inset-0 z-40 bg-brand-bg/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border border-brand-border bg-brand-surface p-4 shadow-glow-md">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  Quick Navigation
                </p>
                <h3 className="text-xl font-bold text-primary">Jump to Category</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                type="button"
                onClick={() => {
                  onCategoryChange("all");
                  setOpen(false);
                }}
                className={cn(
                  "rounded-lg border px-3 py-3 text-left text-sm font-medium transition-colors",
                  activeCategory === "all"
                    ? "border-brand-glow bg-brand-glow/10 text-primary"
                    : "border-brand-border bg-brand-bg text-muted hover:text-primary",
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
                    onClick={() => {
                      onCategoryChange(category.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "rounded-lg border px-3 py-3 text-left text-sm font-medium transition-colors",
                      isActive
                        ? "border-brand-glow bg-brand-glow/10 text-primary"
                        : "border-brand-border bg-brand-bg text-muted hover:text-primary",
                    )}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
