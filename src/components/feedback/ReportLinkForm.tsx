"use client";

import { FeedbackSheet } from "@/components/feedback/FeedbackSheet";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import {
  hasErrors,
  normalizeUrl,
  validateReportLink,
  type FieldErrors,
} from "@/lib/validation";
import type { ReportLinkPayload } from "@/types";
import { useState } from "react";

interface ReportLinkFormProps {
  open: boolean;
  onClose: () => void;
  defaultPlatformName?: string;
  defaultUrl?: string;
}

const issueOptions: ReportLinkPayload["issueType"][] = [
  "broken-link",
  "wrong-region",
  "outdated-info",
  "other",
];

const issueLabels: Record<ReportLinkPayload["issueType"], string> = {
  "broken-link": "Broken link",
  "wrong-region": "Wrong region availability",
  "outdated-info": "Outdated information",
  other: "Other issue",
};

const initialValues: ReportLinkPayload = {
  platformName: "",
  url: "",
  issueType: "broken-link",
  description: "",
};

export function ReportLinkForm({
  open,
  onClose,
  defaultPlatformName = "",
  defaultUrl = "",
}: ReportLinkFormProps) {
  const [values, setValues] = useState<ReportLinkPayload>({
    ...initialValues,
    platformName: defaultPlatformName,
    url: defaultUrl,
  });
  const [errors, setErrors] = useState<FieldErrors<ReportLinkPayload>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nextErrors = validateReportLink(values);
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
          type: "report",
          payload: {
            ...values,
            platformName: values.platformName.trim(),
            url: values.url.trim() ? normalizeUrl(values.url.trim()) : "",
            description: values.description.trim(),
          },
          submittedAt: new Date().toISOString(),
        }),
      });

      const result = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok && response.status !== 202) {
        if (response.status === 422 && "errors" in result) {
          setErrors(result.errors as FieldErrors<ReportLinkPayload>);
        }
        throw new Error(result.message || "Submission failed.");
      }

      setStatus("success");
      setMessage(result.message);
      setValues(initialValues);
      setErrors({});
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit report.");
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
      title="Report a Link Issue"
      description="Flag broken links, outdated listings, or incorrect regional availability."
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
            placeholder="e.g. Netflix"
            error={errors.platformName}
          />

          <Field
            label="Listing URL"
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
              htmlFor="report-issue-type"
              className="mb-2 block text-xs font-medium text-muted"
            >
              Issue type
            </label>
            <select
              id="report-issue-type"
              value={values.issueType}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  issueType: event.target.value as ReportLinkPayload["issueType"],
                }))
              }
              className="h-10 w-full rounded-lg border border-brand-border bg-brand-surface px-3 text-sm text-primary outline-none focus:border-glow"
            >
              {issueOptions.map((option) => (
                <option key={option} value={option}>
                  {issueLabels[option]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="report-description"
              className="mb-2 block text-xs font-medium text-muted"
            >
              Description
            </label>
            <Textarea
              id="report-description"
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Describe what is wrong with this listing..."
              error={errors.description}
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-brand-purple" role="alert">
              {message}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="accent" disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting..." : "Submit report"}
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
