"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, X, Check, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/cart-context";

/** Voucher code input with apply/remove actions and inline validation feedback. */
export default function VoucherForm() {
  const { coupon, couponError, couponSuccess, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!couponSuccess) return;
    setShowSuccess(true);
    const timer = window.setTimeout(() => setShowSuccess(false), 3000);
    return () => window.clearTimeout(timer);
  }, [couponSuccess]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    applyCoupon(code);
    setCode("");
  }

  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-label-caps text-on-surface-variant">
        <Tag size={13} strokeWidth={1.5} /> Voucher Code
      </p>

      {coupon ? (
        <div className="flex items-center justify-between rounded-[14px] border border-secondary/40 bg-secondary-container/30 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-primary">{coupon.code}</p>
            <p className="text-xs text-on-surface-variant">{coupon.label}</p>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            className="flex items-center gap-1 text-xs text-on-surface-variant transition-colors hover:text-primary"
            aria-label="Remove voucher"
          >
            <X size={14} strokeWidth={1.5} /> Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
            aria-label="Voucher code"
            className="flex-1 rounded-full border border-outline-variant bg-transparent px-4 py-2.5 text-sm text-primary placeholder:text-on-surface-variant/50 focus:border-secondary focus:outline-none"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-label-caps text-on-primary transition-opacity hover:opacity-90"
          >
            Apply
          </button>
        </form>
      )}

      <AnimatePresence mode="wait">
        {couponError && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center gap-1.5 text-xs text-error"
          >
            <AlertCircle size={13} strokeWidth={1.5} /> {couponError}
          </motion.p>
        )}
        {showSuccess && couponSuccess && (
          <motion.p
            key="success"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center gap-1.5 text-xs text-secondary"
          >
            <Check size={13} strokeWidth={1.5} /> {couponSuccess}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
