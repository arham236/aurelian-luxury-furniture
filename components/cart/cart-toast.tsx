"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import Button from "@/components/ui/button";

/**
 * Floating toast stack shown whenever an item is added to the cart.
 * Auto-dismisses after 3 seconds (handled centrally in CartProvider);
 * this component is purely presentational and portals to document.body
 * so it always renders above page content regardless of where it's
 * triggered from.
 */
export default function CartToastStack() {
  const { toasts, dismissToast, openDrawer } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-24 z-[110] flex flex-col items-center gap-3 px-4 md:items-end md:px-6"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full max-w-sm flex-col gap-3 rounded-[20px] border border-white/20 bg-surface-container-lowest p-4 shadow-level-3"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-secondary" />
              <p className="flex-1 text-sm text-primary">
                <span className="font-medium">{toast.itemName}</span> added to cart
              </p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Dismiss notification"
                className="flex-shrink-0 text-on-surface-variant transition-colors hover:text-primary"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
            <div className="flex gap-2 pl-8">
              <Button
                size="md"
                onClick={() => {
                  openDrawer();
                  dismissToast(toast.id);
                }}
                className="flex-1 justify-center !px-4 !py-2 text-xs"
              >
                View Cart
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => dismissToast(toast.id)}
                className="flex-1 justify-center !px-4 !py-2 text-xs"
              >
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}
