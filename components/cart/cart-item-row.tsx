"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/lib/cart-types";
import { useCart } from "@/contexts/cart-context";
import CartQuantityStepper from "@/components/cart/cart-quantity-stepper";

type CartItemRowProps = {
  item: CartItem;
};

export default function CartItemRow({ item }: CartItemRowProps) {
  const { increaseQuantity, decreaseQuantity, removeFromCart, closeDrawer } = useCart();
  const subtotal = item.price * item.quantity;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex gap-4 border-b border-outline-variant/40 pb-5"
    >
      <Link
        href={`/products/${item.slug}`}
        onClick={closeDrawer}
        className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-[14px] bg-surface-container"
      >
        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
      </Link>

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.slug}`}
            onClick={closeDrawer}
            className="text-sm font-medium text-primary transition-colors hover:text-secondary"
          >
            {item.name}
          </Link>
          <button
            type="button"
            onClick={() => removeFromCart(item.lineId)}
            aria-label={`Remove ${item.name} from cart`}
            className="flex-shrink-0 text-on-surface-variant transition-colors hover:text-primary"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {(item.color || item.size) && (
          <p className="text-xs text-on-surface-variant">
            {[item.color, item.size].filter(Boolean).join(" · ")}
          </p>
        )}

        <p className="text-xs text-on-surface-variant">{formatPrice(item.price)} each</p>

        <div className="mt-auto flex items-center justify-between pt-1">
          <CartQuantityStepper
            quantity={item.quantity}
            onIncrease={() => increaseQuantity(item.lineId)}
            onDecrease={() => decreaseQuantity(item.lineId)}
            itemName={item.name}
          />
          <motion.span
            key={subtotal}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="text-sm font-semibold text-primary"
          >
            {formatPrice(subtotal)}
          </motion.span>
        </div>
      </div>
    </motion.li>
  );
}
