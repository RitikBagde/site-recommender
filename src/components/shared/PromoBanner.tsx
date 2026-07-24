"use client";

import { useState } from "react";
import { X } from "lucide-react";

const TICKER_TEXT =
  "Check your resume ATS score, generate a QR code, or compress images with FlexoTools  •  ";
const CTA_LABEL = "Try FlexoTools Now";
const SEPARATOR = "  •  ";

function TickerSlot() {
  return (
    <span className="flex shrink-0 items-center gap-0 px-4">
      <span>{TICKER_TEXT}</span>
      <span className="inline-flex items-center gap-1 rounded bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neutral-900 shadow-sm">
        {CTA_LABEL}
      </span>
      <span>{SEPARATOR}</span>
    </span>
  );
}

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <a
      href="https://flexotools.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex h-9 w-full items-center overflow-hidden bg-gradient-to-r from-orange-600 via-rose-500 to-amber-500 text-[11px] font-semibold uppercase tracking-wider text-white"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        <TickerSlot />
        <TickerSlot />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsVisible(false);
        }}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 flex items-center justify-center rounded bg-gradient-to-r from-orange-600 via-rose-500 to-amber-500 px-2 py-1"
        aria-label="Dismiss banner"
      >
        <span className="flex size-5 items-center justify-center rounded bg-white/20">
          <X className="size-3" />
        </span>
      </button>
    </a>
  );
}
