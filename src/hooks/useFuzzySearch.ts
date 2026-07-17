"use client";

import { useMemo } from "react";

type SearchableFields<T> = (item: T) => string[];

function scoreField(field: string, query: string): number {
  const normalizedField = field.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (normalizedField === normalizedQuery) return 100;
  if (normalizedField.startsWith(normalizedQuery)) return 80;
  if (normalizedField.includes(normalizedQuery)) return 60;

  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (queryTokens.length === 0) return 0;

  const matchedTokens = queryTokens.filter((token) =>
    normalizedField.includes(token),
  ).length;

  return matchedTokens > 0 ? (matchedTokens / queryTokens.length) * 40 : 0;
}

function scoreItem<T>(item: T, query: string, getFields: SearchableFields<T>): number {
  const fields = getFields(item);
  return Math.max(...fields.map((field) => scoreField(field, query)), 0);
}

export function useFuzzySearch<T>(
  items: T[],
  query: string,
  getFields: SearchableFields<T>,
): T[] {
  return useMemo(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return items;

    return items
      .map((item) => ({
        item,
        score: scoreItem(item, trimmedQuery, getFields),
      }))
      .filter((result) => result.score > 0)
      .sort((left, right) => right.score - left.score)
      .map((result) => result.item);
  }, [getFields, items, query]);
}
