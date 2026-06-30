import type { Product } from "@/data/products";

/**
 * A single line item in the cart. Deliberately denormalized (carries its
 * own name/price/image snapshot rather than just a product id) so that if
 * catalog data ever changes later, items already in a visitor's cart keep
 * showing what they actually added — standard e-commerce practice.
 */
export type CartItem = {
  /** Stable identity for this exact line (product + color + size combo). */
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  category: string;
  color?: string;
  size?: string;
  quantity: number;
};

export type AddToCartInput = {
  product: Product;
  quantity?: number;
  color?: string;
  size?: string;
};

export type CouponCode = "WELCOME10" | "AURELIAN15" | "VIP25" | "FREEDELIVERY";

export type AppliedCoupon = {
  code: CouponCode;
  /** Percentage discount on the subtotal, 0–100. Zero for shipping-only coupons. */
  percentOff: number;
  /** Whether this coupon waives the shipping fee. */
  freeShipping: boolean;
  label: string;
};

export type CartTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
};
