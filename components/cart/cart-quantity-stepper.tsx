"use client";

import { Minus, Plus } from "lucide-react";

type CartQuantityStepperProps = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  /** Product name, used to build unique per-row aria-labels (e.g. "Increase quantity of Aurelian Lounge Sofa"). */
  itemName?: string;
};

/**
 * A compact (–) qty (+) stepper sized for cart drawer rows. Visually
 * related to the PDP's <QuantitySelector> (same icons, same pill shape)
 * but smaller and label-less to fit a dense line-item layout. Labels are
 * scoped to the specific item so multiple rows (and the PDP's own
 * quantity selector, when both are present) never share an identical
 * aria-label.
 */
export default function CartQuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  itemName,
}: CartQuantityStepperProps) {
  const decreaseLabel = itemName ? `Decrease quantity of ${itemName}` : "Decrease quantity";
  const increaseLabel = itemName ? `Increase quantity of ${itemName}` : "Increase quantity";

  return (
    <div className="inline-flex items-center rounded-full border border-outline-variant">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label={decreaseLabel}
        className="flex h-8 w-8 items-center justify-center text-primary transition-opacity hover:opacity-60 disabled:opacity-30"
      >
        <Minus size={13} strokeWidth={2} />
      </button>
      <span className="w-7 text-center text-sm text-primary" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label={increaseLabel}
        className="flex h-8 w-8 items-center justify-center text-primary transition-opacity hover:opacity-60 disabled:opacity-30"
      >
        <Plus size={13} strokeWidth={2} />
      </button>
    </div>
  );
}
