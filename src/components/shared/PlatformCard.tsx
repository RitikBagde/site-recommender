"use client";

import { PlatformLogo } from "@/components/shared/PlatformLogo";
import { useCardTilt } from "@/hooks/useCardTilt";
import { cn } from "@/lib/utils";
import type { PlatformListing } from "@/types";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, ExternalLink, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface PlatformCardProps {
  listing: PlatformListing;
  isPinned?: boolean;
  onTogglePin?: (listingId: string) => void;
  className?: string;
}

const paymentLabels: Record<PlatformListing["paymentModel"], string> = {
  free: "Free",
  subscription: "Subscription",
  "ad-supported": "Ad-supported",
  rental: "Rental",
};

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

export function PlatformCard({
  listing,
  isPinned = false,
  onTogglePin,
  className,
}: PlatformCardProps) {
  const { tiltRef, cardRef } = useCardTilt<HTMLDivElement>();
  const [copied, setCopied] = useState(false);
  const domain = getDomain(listing.url);

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      await navigator.clipboard.writeText(listing.url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div ref={tiltRef} className={cn("t-tilt h-full", className)}>
      <div
        ref={cardRef}
        className="t-tilt-card group relative flex h-[138px] flex-col overflow-hidden rounded-card border border-brand-border/40 bg-brand-surface/50 shadow-card-glow/5"
      >
        <div className="t-tilt-glare" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-brand-glow/3 via-brand-purple/2 to-transparent" />

        <div className="absolute right-2 top-2 z-20 flex items-center gap-1 opacity-0 transition-all duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          {onTogglePin && (
            <motion.button
              type="button"
              aria-label={isPinned ? "Unpin platform" : "Pin platform"}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onTogglePin(listing.id);
              }}
              whileTap={{ scale: 0.85 }}
              animate={{
                scale: isPinned ? 1.1 : 1,
                rotate: isPinned ? 0 : -12,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 18,
              }}
              className={cn(
                "rounded-full border border-brand-border/70 bg-brand-bg/80 p-1.5 shadow-sm backdrop-blur-sm",
                isPinned ? "text-brand-purple" : "text-muted hover:text-brand-purple",
              )}
            >
              <Star className="h-3.5 w-3.5" strokeWidth={1.5} fill={isPinned ? "currentColor" : "none"} />
            </motion.button>
          )}

          <a
            href={listing.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="rounded-full border border-brand-border/70 bg-brand-bg/80 p-1.5 text-muted transition-colors hover:text-brand-glow"
            aria-label={`Open ${listing.name}`}
          >
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </a>
        </div>

        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 flex h-full flex-col p-2.5"
        >
          <div className="relative mb-2 flex h-[72px] items-center justify-center overflow-hidden rounded-xl border border-brand-border/70 bg-gradient-to-br from-brand-bg/80 via-brand-surface/80 to-brand-purple/3">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.05),transparent_58%)]" />
            <PlatformLogo
              platformId={listing.id}
              platformName={listing.name}
              category={listing.category}
              className="relative h-full w-full rounded-lg border-0 bg-transparent p-1"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-brand-glow">
              <span className="truncate">{domain}</span>
              <ExternalLink className="h-3 w-3 shrink-0" strokeWidth={1.5} />
            </div>
            {listing.description && (
              <p className="line-clamp-1 text-[10px] leading-tight text-muted">
                {listing.description}
              </p>
            )}

            <div className="mt-auto flex items-center justify-between gap-2">
              <span className="rounded-full border border-brand-purple/20 bg-brand-purple/10 px-2 py-0.5 text-[9px] font-medium text-primary">
                {paymentLabels[listing.paymentModel]}
              </span>
              <span className="font-mono text-[9px] text-muted">
                {listing.region.slice(0, 1).join(" · ")}
                {listing.region.length > 1 && ` +${listing.region.length - 1}`}
              </span>
            </div>
          </div>
        </a>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="absolute bottom-2 right-2 z-20 rounded-full border border-brand-border/70 bg-brand-bg/85 p-1.5 text-muted opacity-0 transition-all duration-200 hover:text-brand-glow group-hover:opacity-100 group-focus-within:opacity-100"
          aria-label="Copy link"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-brand-glow" strokeWidth={1.5} />
          ) : (
            <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
          )}
        </motion.button>
      </div>
    </div>
  );
}
