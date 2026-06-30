"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProductSlug } from "@/data/products";
import { findCoupon } from "@/lib/coupons";
import type {
  AddToCartInput,
  AppliedCoupon,
  CartItem,
  CartTotals,
} from "@/lib/cart-types";

const CART_STORAGE_KEY = "aurelian-cart-items";
const COUPON_STORAGE_KEY = "aurelian-cart-coupon";

const FREE_SHIPPING_THRESHOLD = 3000;
const STANDARD_SHIPPING = 150;
const TAX_RATE = 0.0; // Placeholder — no tax engine in this phase.

/** Builds the stable identity for a cart line from product + color + size. */
function buildLineId(productId: string, color?: string, size?: string) {
  return [productId, color ?? "", size ?? ""].join("::");
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage unavailable (e.g. private browsing) — cart simply won't persist.
  }
}

export type CartToast = {
  id: string;
  itemName: string;
};

type CartContextValue = {
  items: CartItem[];
  isHydrated: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addToCart: (input: AddToCartInput) => void;
  removeFromCart: (lineId: string) => void;
  increaseQuantity: (lineId: string) => void;
  decreaseQuantity: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  coupon: AppliedCoupon | null;
  couponError: string | null;
  couponSuccess: string | null;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  totals: CartTotals;
  toasts: CartToast[];
  dismissToast: (id: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [toasts, setToasts] = useState<CartToast[]>([]);

  // Hydrate from localStorage once, after mount, so SSR/client markup
  // always matches on first paint (no hydration mismatch warnings).
  useEffect(() => {
    setItems(readJson<CartItem[]>(CART_STORAGE_KEY, []));
    setCoupon(readJson<AppliedCoupon | null>(COUPON_STORAGE_KEY, null));
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    writeJson(CART_STORAGE_KEY, items);
  }, [items, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    writeJson(COUPON_STORAGE_KEY, coupon);
  }, [coupon, isHydrated]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((v) => !v), []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback((itemName: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, itemName }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const addToCart = useCallback(
    ({ product, quantity = 1, color, size }: AddToCartInput) => {
      const lineId = buildLineId(product.id, color, size);

      setItems((prev) => {
        const existing = prev.find((item) => item.lineId === lineId);
        if (existing) {
          return prev.map((item) =>
            item.lineId === lineId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        const newItem: CartItem = {
          lineId,
          productId: product.id,
          slug: getProductSlug(product),
          name: product.name,
          image: product.image,
          price: product.price,
          category: product.category,
          color,
          size,
          quantity,
        };
        return [...prev, newItem];
      });

      pushToast(product.name);
    },
    [pushToast]
  );

  const removeFromCart = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((item) => item.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.lineId !== lineId);
      }
      return prev.map((item) =>
        item.lineId === lineId ? { ...item, quantity } : item
      );
    });
  }, []);

  const increaseQuantity = useCallback((lineId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.lineId === lineId
          ? { ...item, quantity: Math.min(99, item.quantity + 1) }
          : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((lineId: string) => {
    setItems((prev) =>
      prev.flatMap((item) => {
        if (item.lineId !== lineId) return [item];
        const nextQuantity = item.quantity - 1;
        if (nextQuantity <= 0) return [];
        return [{ ...item, quantity: nextQuantity }];
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
  }, []);

  const applyCoupon = useCallback((code: string) => {
    const found = findCoupon(code);
    if (!found) {
      setCouponError("Invalid voucher code.");
      setCouponSuccess(null);
      return;
    }
    setCoupon(found);
    setCouponError(null);
    setCouponSuccess("Voucher Applied Successfully.");
  }, []);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponError(null);
    setCouponSuccess(null);
  }, []);

  const totals = useMemo<CartTotals>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const discount = coupon ? Math.round(subtotal * (coupon.percentOff / 100)) : 0;
    const qualifiesForFreeShipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD || coupon?.freeShipping === true;
    const shipping = qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * TAX_RATE);
    const total = Math.max(0, taxableAmount + shipping + tax);

    return { subtotal, discount, shipping, tax, total, itemCount };
  }, [items, coupon]);

  const value: CartContextValue = {
    items,
    isHydrated,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    coupon,
    couponError,
    couponSuccess,
    applyCoupon,
    removeCoupon,
    totals,
    toasts,
    dismissToast,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
