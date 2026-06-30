"use client";

import { useMemo } from "react";
import Reveal from "@/components/ui/reveal";
import ProductCard from "@/components/ui/product-card";
import { allProducts, getProductSlug } from "@/data/products";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

type RecentlyViewedProps = {
  /** Slug of the product currently being viewed, excluded from its own "recently viewed" rail. */
  currentSlug: string;
};

/**
 * Shows the visitor's recently viewed products (most recent first, current
 * product excluded), backed by localStorage via useRecentlyViewed. Renders
 * nothing until there's at least one other product to show, so it never
 * leaves an awkward empty section on a visitor's first-ever product view.
 */
export default function RecentlyViewed({ currentSlug }: RecentlyViewedProps) {
  const { otherSlugs } = useRecentlyViewed(currentSlug);
  const slugs = otherSlugs(currentSlug);

  const products = useMemo(
    () =>
      slugs
        .map((slug) => allProducts.find((p) => getProductSlug(p) === slug))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .slice(0, 4),
    [slugs]
  );

  if (products.length === 0) return null;

  return (
    <section className="border-t border-outline-variant/40 py-20 md:py-28">
      <Reveal className="mb-12 text-center">
        <h2 className="text-headline-lg-mobile text-primary md:text-headline-lg">
          Recently Viewed
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.id} variant="fade-up" delay={i * 0.08}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
