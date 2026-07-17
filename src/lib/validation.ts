import type {
  MediaCategory,
  ReportLinkPayload,
  SuggestionPayload,
} from "@/types";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const URL_PATTERN =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

export function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value.startsWith("http") ? value : `https://${value}`);
    return Boolean(parsed.hostname);
  } catch {
    return URL_PATTERN.test(value);
  }
}

export function normalizeUrl(value: string): string {
  return value.startsWith("http") ? value : `https://${value}`;
}

export function validateSuggestion(
  values: SuggestionPayload,
): FieldErrors<SuggestionPayload> {
  const errors: FieldErrors<SuggestionPayload> = {};

  if (!values.platformName.trim()) {
    errors.platformName = "Platform name is required.";
  } else if (values.platformName.trim().length < 2) {
    errors.platformName = "Platform name must be at least 2 characters.";
  }

  if (!values.url.trim()) {
    errors.url = "URL is required.";
  } else if (!isValidUrl(values.url.trim())) {
    errors.url = "Enter a valid URL.";
  }

  const categories: MediaCategory[] = [
    "movies",
    "tv-shows",
    "anime",
    "manga",
    "live-sports",
    "apps",
  ];

  if (!categories.includes(values.category)) {
    errors.category = "Select a valid category.";
  }

  if (values.notes && values.notes.length > 500) {
    errors.notes = "Notes must be 500 characters or fewer.";
  }

  return errors;
}

export function validateReportLink(
  values: ReportLinkPayload,
): FieldErrors<ReportLinkPayload> {
  const errors: FieldErrors<ReportLinkPayload> = {};

  if (!values.platformName.trim() && !values.url.trim()) {
    errors.platformName = "Provide a platform name or URL.";
    errors.url = "Provide a platform name or URL.";
  }

  if (values.url.trim() && !isValidUrl(values.url.trim())) {
    errors.url = "Enter a valid URL.";
  }

  if (!values.description.trim()) {
    errors.description = "Describe the issue.";
  } else if (values.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters.";
  } else if (values.description.length > 1000) {
    errors.description = "Description must be 1000 characters or fewer.";
  }

  return errors;
}

export function hasErrors<T>(errors: FieldErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
