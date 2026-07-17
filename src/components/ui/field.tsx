import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Field({ label, error, className, id, ...props }: FieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 block text-xs font-medium text-muted">
        {label}
      </label>
      <input
        id={fieldId}
        className={cn(
          "h-10 w-full rounded-lg border border-brand-border bg-brand-surface px-3 text-sm text-primary placeholder:text-muted outline-none transition-colors focus:border-glow",
          error && "t-shake border-brand-purple",
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${fieldId}-error`} className="mt-1 text-xs text-brand-purple" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
