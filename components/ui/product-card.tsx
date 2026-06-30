"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { getProductSlug, type Product } from "@/data/products";
import { useCart } from "@/contexts/cart-context";

const aspectClass: Record<Product["aspect"], string> = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  tall: "aspect-[3/4]",
};

type ProductCardProps = {
  product: Product;
  className?: string;
  /** Offsets the card vertically to create the brief's "staggered grid" lookbook feel. */
  offset?: "none" | "sm" | "md" | "lg";
};

const offsetClass: Record<NonNullable<ProductCardProps["offset"]>, string> = {
  none: "",
  sm: "lg:mt-8",
  md: "lg:mt-12",
  lg: "lg:mt-24",
};

export default function ProductCard({
  product,
  className,
  offset = "none",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const href = `/products/${getProductSlug(product)}`;

  function handleAddToCart() {
    addToCart({
      product,
      color: product.colors?.[0]?.name,
      size: product.sizes?.[0],
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-[24px] border border-white/20 bg-surface-container-lowest p-4 shadow-level-2 transition-all duration-300 hover:border-secondary hover:shadow-level-3",
        offsetClass[offset],
        className
      )}
    >
      <Link href={href} className="contents">
        <div
          className={cn(
            "relative isolate mb-6 w-full overflow-hidden rounded-[24px] bg-surface-container",
            aspectClass[product.aspect]
          )}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.tag && (
            <span className="absolute left-4 top-4 rounded-full bg-surface/80 px-3 py-1 text-label-caps text-primary backdrop-blur">
              {product.tag}
            </span>
          )}
        </div>
      </Link>

      <button
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => setWishlisted((v) => !v)}
        className="absolute right-7 top-7 z-10 rounded-full bg-surface/80 p-2 text-on-surface backdrop-blur transition-colors hover:text-secondary"
      >
        <Heart
          size={18}
          strokeWidth={1.5}
          fill={wishlisted ? "currentColor" : "none"}
          className={wishlisted ? "text-secondary" : ""}
        />
      </button>

      <div className="flex flex-grow flex-col">
        <Link href={href}>
          <h3 className="mb-2 text-display-md text-[20px] text-primary transition-colors hover:text-secondary">
            {product.name}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 text-sm text-on-surface-variant">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="font-semibold text-primary">
            {formatPrice(product.price)}
          </span>
          <Link
            href={href}
            className="border-b border-primary pb-0.5 text-label-caps text-primary transition-colors hover:border-secondary hover:text-secondary"
          >
            View Product
          </Link>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          className={cn(
            "mt-3 flex w-full items-center justify-center gap-1.5 rounded-[24px] border py-2.5 text-label-caps transition-colors",
            justAdded
              ? "border-secondary bg-secondary text-on-secondary"
              : "border-primary text-primary hover:bg-primary hover:text-on-primary"
          )}
        >
          {justAdded ? (
            <>
              <Check size={14} strokeWidth={2} /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag size={14} strokeWidth={1.5} /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
