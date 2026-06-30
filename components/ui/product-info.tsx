"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/data/products";
import { useCart } from "@/contexts/cart-context";
import ColorSelector from "@/components/ui/color-selector";
import SizeSelector from "@/components/ui/size-selector";
import QuantitySelector from "@/components/ui/quantity-selector";
import Button from "@/components/ui/button";

type ProductInfoProps = {
  product: Product;
};

/**
 * The primary product information column: category, name, price,
 * description, color/size/quantity selectors, feature list, and the
 * Add to Cart / Wishlist / Buy Now actions. Color/size/quantity selection
 * state lives here and is passed straight through to the cart context on
 * Add to Cart, so the exact configuration the visitor chose is what ends
 * up in their cart.
 */
export default function ProductInfo({ product }: ProductInfoProps) {
  const { addToCart, openDrawer } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name ?? "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  function handleAddToCart() {
    addToCart({
      product,
      quantity,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    });
    setAddedToCart(true);
    window.setTimeout(() => setAddedToCart(false), 2200);
  }

  function handleBuyNow() {
    addToCart({
      product,
      quantity,
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    });
    openDrawer();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-label-caps text-secondary">{product.category}</span>
        <h1 className="mt-3 text-headline-lg-mobile text-primary md:text-headline-lg">
          {product.name}
        </h1>
        <p className="mt-4 text-headline-lg-mobile text-[28px] text-primary md:text-[32px]">
          {formatPrice(product.price)}
        </p>
      </div>

      <p className="text-body-md text-on-surface-variant">{product.description}</p>

      {product.features && product.features.length > 0 && (
        <div>
          <p className="mb-3 text-label-caps text-on-surface-variant">
            Product Features
          </p>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-on-surface"
              >
                <Check size={14} strokeWidth={2.5} className="flex-shrink-0 text-secondary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {product.colors && product.colors.length > 0 && (
        <ColorSelector
          colors={product.colors}
          selected={selectedColor}
          onSelect={setSelectedColor}
        />
      )}

      {product.sizes && product.sizes.length > 0 && (
        <SizeSelector
          sizes={product.sizes}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />
      )}

      <QuantitySelector quantity={quantity} onChange={setQuantity} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={handleAddToCart}
          size="lg"
          className="flex-1 justify-center"
        >
          {addedToCart ? (
            <>
              <Check size={18} strokeWidth={2} /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag size={18} strokeWidth={1.5} /> Add to Cart
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => setWishlisted((v) => !v)}
          aria-pressed={wishlisted}
          className="justify-center sm:w-auto sm:px-6"
        >
          <Heart
            size={18}
            strokeWidth={1.5}
            fill={wishlisted ? "currentColor" : "none"}
            className={wishlisted ? "text-secondary" : ""}
          />
          <span className="sm:hidden">
            {wishlisted ? "Wishlisted" : "Add to Wishlist"}
          </span>
        </Button>
      </div>

      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={handleBuyNow}
        className="w-full justify-center border-secondary text-secondary hover:bg-secondary hover:text-on-secondary"
      >
        Buy Now
      </Button>
    </div>
  );
}
