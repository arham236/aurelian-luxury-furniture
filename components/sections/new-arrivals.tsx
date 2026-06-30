"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import Reveal from "@/components/ui/reveal";
import { newArrivals, getProductSlug } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";

export default function NewArrivals() {
  const { addToCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  return (
    <section
      id="new-arrivals"
      className="bg-[#F9F7F2] px-margin-mobile py-24 md:px-margin-desktop md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="mb-10 flex items-end justify-between md:mb-16">
          <h2 className="text-display-md text-primary md:text-headline-lg">
            New Arrivals
          </h2>
          <Link
            href="#shop"
            className="text-label-caps text-secondary underline underline-offset-4"
          >
            View All
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-gutter">
          {newArrivals.map((product, i) => {
            const justAdded = addedId === product.id;
            return (
              <Reveal key={product.id} variant="fade-up" delay={i * 0.06}>
                <Link href={`/products/${getProductSlug(product)}`} className="group block">
                  <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-white/20 bg-surface shadow-level-2">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 flex flex-col gap-2 md:right-4 md:top-4">
                      <button
                        aria-label="Add to wishlist"
                        onClick={(e) => e.preventDefault()}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-white md:h-10 md:w-10"
                      >
                        <Heart size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        aria-label={`Add ${product.name} to cart`}
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart({
                            product,
                            color: product.colors?.[0]?.name,
                            size: product.sizes?.[0],
                          });
                          setAddedId(product.id);
                          window.setTimeout(() => setAddedId(null), 1800);
                        }}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition-colors md:h-10 md:w-10",
                          justAdded
                            ? "bg-secondary text-on-secondary"
                            : "bg-white/80 text-primary hover:bg-white"
                        )}
                      >
                        {justAdded ? (
                          <Check size={16} strokeWidth={2} />
                        ) : (
                          <ShoppingBag size={16} strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {product.tag && (
                      <span className="text-label-caps text-on-surface-variant">
                        {product.tag}
                      </span>
                    )}
                    <h3 className="truncate text-body-lg text-primary">
                      {product.name}
                    </h3>
                    <p className="text-body-md text-secondary">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
