"use client";

import { ReportLinkForm } from "@/components/feedback/ReportLinkForm";
import { SuggestionForm } from "@/components/feedback/SuggestionForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flag, MessageSquarePlus } from "lucide-react";
import { useState } from "react";

interface FeedbackLauncherProps {
  className?: string;
}

export function FeedbackLauncher({ className }: FeedbackLauncherProps) {
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "fixed bottom-6 left-4 z-40 flex flex-col gap-2 lg:left-auto lg:right-20",
          className,
        )}
      >
        <Button
          variant="default"
          size="sm"
          onClick={() => setSuggestionOpen(true)}
          className="shadow-glow-sm"
        >
          <MessageSquarePlus className="h-4 w-4" strokeWidth={1.5} />
          Suggest
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setReportOpen(true)}
          className="border border-brand-border bg-brand-surface/95 shadow-glow-sm backdrop-blur-sm"
        >
          <Flag className="h-4 w-4" strokeWidth={1.5} />
          Report link
        </Button>
      </div>

      <SuggestionForm open={suggestionOpen} onClose={() => setSuggestionOpen(false)} />
      <ReportLinkForm open={reportOpen} onClose={() => setReportOpen(false)} />
    </>
  );
}
