import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  showSearchIcon?: boolean;
  kbdHint?: string;
}

export function Input({
  className,
  showSearchIcon = false,
  kbdHint,
  ...props
}: InputProps) {
  return (
    <div className="relative flex items-center">
      {showSearchIcon && (
        <Search
          className="pointer-events-none absolute left-3 h-4 w-4 text-muted"
          strokeWidth={1.5}
        />
      )}
      <input
        className={cn(
          "h-10 w-full rounded-lg border border-brand-border bg-brand-surface text-sm text-primary placeholder:text-muted outline-none transition-colors focus:border-glow",
          showSearchIcon ? "pl-9 pr-3" : "px-3",
          kbdHint && "pr-14",
          className,
        )}
        {...props}
      />
      {kbdHint && (
        <kbd className="pointer-events-none absolute right-3 hidden rounded border border-brand-border bg-brand-bg px-1.5 py-0.5 font-mono text-[10px] text-muted sm:inline-block">
          {kbdHint}
        </kbd>
      )}
    </div>
  );
}
