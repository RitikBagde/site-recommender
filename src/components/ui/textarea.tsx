import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <div>
      <textarea
        className={cn(
          "min-h-24 w-full resize-y rounded-lg border border-brand-border bg-brand-surface px-3 py-2 text-sm text-primary placeholder:text-muted outline-none transition-colors focus:border-glow",
          error && "t-shake border-brand-purple",
          className,
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-brand-purple" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
