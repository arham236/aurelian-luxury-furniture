"use client";

import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";

function SummaryRow({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={emphasize ? "text-body-md text-primary" : "text-sm text-on-surface-variant"}
      >
        {label}
      </span>
      <motion.span
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className={emphasize ? "text-headline-lg-mobile text-[22px] text-primary" : "text-sm font-medium text-primary"}
      >
        {value}
      </motion.span>
    </div>
  );
}

/** Professional billing breakdown: subtotal, discount, shipping, tax, grand total. */
export default function BillingSummary() {
  const { totals, coupon } = useCart();

  return (
    <div className="flex flex-col gap-3 border-t border-outline-variant/40 pt-5">
      <SummaryRow label="Subtotal" value={formatPrice(totals.subtotal)} />
      {totals.discount > 0 && (
        <SummaryRow
          label={coupon ? `Discount (${coupon.code})` : "Discount"}
          value={`−${formatPrice(totals.discount)}`}
        />
      )}
      <SummaryRow
        label="Shipping"
        value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
      />
      <SummaryRow label="Tax" value={formatPrice(totals.tax)} />
      <div className="mt-2 flex items-center justify-between border-t border-outline-variant/40 pt-4">
        <span className="text-label-caps text-on-surface-variant">Grand Total</span>
        <motion.span
          key={totals.total}
          initial={{ opacity: 0.4, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-headline-lg-mobile text-[24px] text-primary"
        >
          {formatPrice(totals.total)}
        </motion.span>
      </div>
    </div>
  );
}
