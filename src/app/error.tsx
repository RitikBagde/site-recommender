"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[WhereWatch] Runtime error boundary:", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-brand-bg p-8">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-brand-border bg-brand-surface shadow-glow-sm">
          <AlertTriangle className="h-5 w-5 text-brand-purple" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-primary">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted">
          The directory hit an unexpected rendering error. Your local bookmarks and
          filters are safe — try reloading this view.
        </p>
        {error.message && (
          <p className="mt-4 rounded-lg border border-brand-border bg-brand-surface px-3 py-2 font-mono text-xs text-muted">
            {error.message}
          </p>
        )}
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted">Ref: {error.digest}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="accent" onClick={() => reset()}>
          <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
          Try again
        </Button>
        <Link href="/">
          <Button variant="default">
            <Home className="h-4 w-4" strokeWidth={1.5} />
            Back to directory
          </Button>
        </Link>
      </div>
    </main>
  );
}
