"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import Button from "@/components/ui/button";
import CartItemRow from "@/components/cart/cart-item-row";
import VoucherForm from "@/components/cart/voucher-form";
import BillingSummary from "@/components/cart/billing-summary";

/**
 * Right-side sliding cart drawer. Mounted once near the root via a portal
 * so it always overlays everything regardless of where it's triggered
 * from. Handles its own focus trap, ESC-to-close, click-outside-to-close,
 * and restores focus to the trigger element on close.
 */
export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, clearCart, totals, isHydrated } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC closes the drawer.
  useEffect(() => {
    if (!isDrawerOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Focus management: remember what was focused before opening, move focus
  // into the drawer on open, restore focus to the trigger on close.
  useEffect(() => {
    if (isDrawerOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      window.setTimeout(() => panelRef.current?.focus(), 50);
    } else {
      previouslyFocused.current?.focus();
    }
  }, [isDrawerOpen]);

  // Simple focus trap: keep Tab/Shift+Tab cycling within the drawer panel.
  useEffect(() => {
    if (!isDrawerOpen) return;
    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [isDrawerOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            key="cart-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-[440px] flex-col bg-surface-container-lowest shadow-level-3 outline-none"
          >
            <div className="flex items-center justify-between border-b border-outline-variant/40 px-6 py-5">
              <h2 className="flex items-center gap-2 text-display-md text-[20px] text-primary">
                <ShoppingBag size={20} strokeWidth={1.5} />
                Your Cart
                {totals.itemCount > 0 && (
                  <span className="text-sm font-normal text-on-surface-variant">
                    ({totals.itemCount})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart"
                className="rounded-full p-2 text-primary transition-colors hover:bg-surface-container"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {!isHydrated || items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <ShoppingBag size={40} strokeWidth={1} className="text-on-surface-variant/50" />
                <p className="text-body-md text-on-surface-variant">
                  Your cart is empty. Discover a piece that speaks to you.
                </p>
                <Button href="/#shop" onClick={closeDrawer} size="md">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <ul className="flex flex-col gap-5">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <CartItemRow key={item.lineId} item={item} />
                      ))}
                    </AnimatePresence>
                  </ul>

                  <div className="mt-6">
                    <VoucherForm />
                  </div>

                  <div className="mt-6">
                    <BillingSummary />
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-outline-variant/40 px-6 py-5">
                  <Button size="lg" className="w-full justify-center">
                    Checkout
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      href="/#shop"
                      onClick={closeDrawer}
                      variant="secondary"
                      size="md"
                      className="flex-1 justify-center"
                    >
                      Continue Shopping
                    </Button>
                    <button
                      type="button"
                      onClick={clearCart}
                      aria-label="Clear cart"
                      className="flex items-center justify-center gap-1.5 rounded-[24px] border border-outline-variant px-4 text-xs text-on-surface-variant transition-colors hover:border-error hover:text-error"
                    >
                      <Trash2 size={14} strokeWidth={1.5} /> Clear
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
