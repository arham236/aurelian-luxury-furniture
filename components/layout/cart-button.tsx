"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

type CartButtonProps = {
  size?: number;
  className?: string;
};

/**
 * The navbar's cart trigger: a bag icon with an animated live-count badge.
 * Used identically in the desktop nav, mobile nav, and mobile menu so the
 * badge behavior never drifts between the three placements.
 */
export default function CartButton({ size = 20, className }: CartButtonProps) {
  const { totals, toggleDrawer } = useCart();

  return (
    <button
      type="button"
      onClick={toggleDrawer}
      aria-label={`Open cart, ${totals.itemCount} item${totals.itemCount === 1 ? "" : "s"}`}
      className={className ?? "relative transition-opacity hover:opacity-70"}
    >
      <ShoppingBag size={size} strokeWidth={1.5} />
      <AnimatePresence>
        {totals.itemCount > 0 && (
          <motion.span
            key={totals.itemCount}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 24 }}
            className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-semibold leading-none text-on-secondary"
          >
            {totals.itemCount > 99 ? "99+" : totals.itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
