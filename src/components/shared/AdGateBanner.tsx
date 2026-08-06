"use client";

import { Megaphone } from "lucide-react";
import { useEffect, useState } from "react";

const SESSION_KEY = "wherewatch:adunlocked";

export function AdGateBanner() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(SESSION_KEY)) setDismissed(true);
  }, []);

  if (!mounted || dismissed) return null;

  const handleClick = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage blocked — still dismiss in-memory.
    }
    setDismissed(true);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 pointer-events-none">
      <button
        type="button"
        onClick={handleClick}
        className="pointer-events-auto flex w-full max-w-md cursor-pointer items-center gap-3 rounded-xl border border-brand-border bg-brand-surface/95 p-3 text-left shadow-glow-md backdrop-blur-sm transition-colors hover:border-brand-glow sm:max-w-lg sm:p-4"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-glow/10">
          <Megaphone className="size-4 text-brand-glow" />
        </span>

        <span className="flex flex-1 flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
            Ads are running to keep WhereWatch free
          </span>
          <span className="text-[11px] leading-snug text-muted">
            Tap once to continue — it opens a sponsored page. Come back and you&apos;re in.
          </span>
        </span>

        <span className="shrink-0 rounded-lg bg-brand-glow px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white">
          Continue
        </span>
      </button>
    </div>
  );
}
