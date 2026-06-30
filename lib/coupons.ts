import type { AppliedCoupon, CouponCode } from "@/lib/cart-types";

/**
 * Demo coupon catalog. In a real storefront this would be a server-side
 * lookup; here it's a fixed table per the brief's demo codes so the cart
 * system works fully client-side with no backend.
 */
const COUPON_CATALOG: Record<CouponCode, AppliedCoupon> = {
  WELCOME10: { code: "WELCOME10", percentOff: 10, freeShipping: false, label: "10% off your order" },
  AURELIAN15: { code: "AURELIAN15", percentOff: 15, freeShipping: false, label: "15% off your order" },
  VIP25: { code: "VIP25", percentOff: 25, freeShipping: false, label: "25% off your order" },
  FREEDELIVERY: { code: "FREEDELIVERY", percentOff: 0, freeShipping: true, label: "Free shipping" },
};

/**
 * Looks up a voucher code (case-insensitive, trimmed). Returns the matching
 * coupon or null when the code doesn't exist in the demo catalog.
 */
export function findCoupon(rawCode: string): AppliedCoupon | null {
  const normalized = rawCode.trim().toUpperCase();
  if (!normalized) return null;
  return (COUPON_CATALOG as Record<string, AppliedCoupon>)[normalized] ?? null;
}
