"use client";

import { FeedbackSheet } from "@/components/feedback/FeedbackSheet";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  hasErrors,
  normalizeUrl,
  validateSuggestion,
  type FieldErrors,
} from "@/lib/validation";
import type { MediaCategory, SuggestionPayload } from "@/types";
import { useState } from "react";

interface SuggestionFormProps {
  open: boolean;
  onClose: () => void;
}

const categoryOptions: { value: MediaCategory; label: string }[] = [
  { value: "movies", label: "Movies" },
  { value: "tv-shows", label: "TV Shows" },
  { value: "anime", label: "Anime" },
  { value: "manga", label: "Manga" },
  { value: "live-sports", label: "Live Sports" },
  { value: "apps", label: "Apps" },
];

const initialValues: SuggestionPayload = {
  platformName: "",
  url: "",
  category: "movies",
  notes: "",
};

export function SuggestionForm({ open, onClose }: SuggestionFormProps) {
  const [values, setValues] = useState<SuggestionPayload>(initialValues);
  const [errors, setErrors] = useState<FieldErrors<SuggestionPayload>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nextErrors = validateSuggestion(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "suggestion",
          payload: {
            ...values,
            url: normalizeUrl(values.url.trim()),
            platformName: values.platformName.trim(),
            notes: values.notes?.trim() || undefined,
          },
          submittedAt: new Date().toISOString(),
        }),
      });

      const result = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok && response.status !== 202) {
        throw new Error(result.message || "Submission failed.");
      }

      setStatus("success");
      setMessage(result.message);
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Unable to submit suggestion.",
      );
    }
  }

  function handleClose() {
    setStatus("idle");
    setMessage("");
    onClose();
  }

  return (
    <FeedbackSheet
      open={open}
      onClose={handleClose}
      title="Suggest a Platform"
      description="Recommend a legitimate streaming or media platform for the directory."
    >
      {status === "success" ? (
        <div className="space-y-4">
          <p className="text-sm text-primary">{message}</p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Field
            label="Platform name"
            name="platformName"
            value={values.platformName}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                platformName: event.target.value,
              }))
            }
            placeholder="e.g. Crunchyroll"
            error={errors.platformName}
          />

          <Field
            label="Website URL"
            name="url"
            value={values.url}
            onChange={(event) =>
              setValues((current) => ({ ...current, url: event.target.value }))
            }
            placeholder="https://example.com"
            error={errors.url}
          />

          <div>
            <label
              htmlFor="suggestion-category"
              className="mb-2 block text-xs font-medium text-muted"
            >
              Category
            </label>
            <select
              id="suggestion-category"
              value={values.category}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  category: event.target.value as MediaCategory,
                }))
              }
              className="h-10 w-full rounded-lg border border-brand-border bg-brand-surface px-3 text-sm text-primary outline-none focus:border-glow"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-brand-purple" role="alert">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="suggestion-notes"
              className="mb-2 block text-xs font-medium text-muted"
            >
              Notes (optional)
            </label>
            <Textarea
              id="suggestion-notes"
              value={values.notes ?? ""}
              onChange={(event) =>
                setValues((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder="Why should this platform be listed?"
              error={errors.notes}
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-brand-purple" role="alert">
              {message}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="accent" disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting..." : "Submit suggestion"}
            </Button>
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </FeedbackSheet>
  );
}
