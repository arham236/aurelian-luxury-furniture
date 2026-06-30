"use client";

import { Minus, Plus } from "lucide-react";

type QuantitySelectorProps = {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
};

/** A simple (–) 1 (+) quantity stepper, clamped between min and max. */
export default function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 9,
}: QuantitySelectorProps) {
  function decrement() {
    onChange(Math.max(min, quantity - 1));
  }

  function increment() {
    onChange(Math.min(max, quantity + 1));
  }

  return (
    <div>
      <p className="mb-3 text-label-caps text-on-surface-variant">Quantity</p>
      <div className="inline-flex items-center rounded-full border border-outline-variant">
        <button
          type="button"
          onClick={decrement}
          disabled={quantity <= min}
          aria-label="Decrease quantity"
          className="flex h-11 w-11 items-center justify-center text-primary transition-opacity hover:opacity-60 disabled:opacity-30"
        >
          <Minus size={16} strokeWidth={2} />
        </button>
        <span
          className="w-10 text-center text-body-md text-primary"
          aria-live="polite"
        >
          {quantity}
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={quantity >= max}
          aria-label="Increase quantity"
          className="flex h-11 w-11 items-center justify-center text-primary transition-opacity hover:opacity-60 disabled:opacity-30"
        >
          <Plus size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
