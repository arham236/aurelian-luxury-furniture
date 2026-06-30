"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "aurelian-recently-viewed";
const MAX_ITEMS = 6;

function readStoredSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Tracks which product slugs the visitor has viewed, most-recent first,
 * persisted to localStorage so the "Recently Viewed" rail survives
 * navigation and page reloads within the same browser. Gracefully
 * degrades to an empty list when localStorage is unavailable (e.g. private
 * browsing in some browsers) rather than throwing.
 */
export function useRecentlyViewed(currentSlug?: string) {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(readStoredSlugs());
  }, []);

  useEffect(() => {
    if (!currentSlug) return;
    setSlugs((prev) => {
      const next = [currentSlug, ...prev.filter((s) => s !== currentSlug)].slice(
        0,
        MAX_ITEMS
      );
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage unavailable — recently-viewed simply won't persist.
      }
      return next;
    });
  }, [currentSlug]);

  const otherSlugs = useCallback(
    (excludeSlug?: string) => slugs.filter((s) => s !== excludeSlug),
    [slugs]
  );

  return { slugs, otherSlugs };
}
