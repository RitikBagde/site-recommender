"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-brand-bg font-sans text-primary antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
          <AlertTriangle className="h-8 w-8 text-brand-purple" strokeWidth={1.5} />
          <h1 className="text-xl font-bold">Application error</h1>
          <p className="max-w-md text-center text-sm text-muted">
            {error.message || "A critical error prevented WhereWatch from loading."}
          </p>
          <Button variant="accent" onClick={() => reset()}>
            Reload application
          </Button>
        </main>
      </body>
    </html>
  );
}
