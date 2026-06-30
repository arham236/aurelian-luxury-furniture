"use client";

import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

/**
 * Invisible tracker: records `slug` into the visitor's recently-viewed
 * history as soon as this product page mounts. Split out from
 * <RecentlyViewed> itself so the page can record the *current* product
 * while still rendering the rail of *other* products separately.
 */
export default function RecordRecentlyViewed({ slug }: { slug: string }) {
  useRecentlyViewed(slug);
  return null;
}
