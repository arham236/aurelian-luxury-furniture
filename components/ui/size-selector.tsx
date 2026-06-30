"use client";

import { cn } from "@/lib/utils";

type SizeSelectorProps = {
  sizes: string[];
  selected: string;
  onSelect: (size: string) => void;
};

/** Pill-style selectable size options (e.g. "2 Seater", "3 Seater", "L Shape"). */
export default function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div>
      <p className="mb-3 text-label-caps text-on-surface-variant">Size</p>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => {
          const isActive = size === selected;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelect(size)}
              aria-pressed={isActive}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm transition-all duration-300",
                isActive
                  ? "border-primary bg-primary text-on-primary"
                  : "border-outline-variant text-on-surface hover:border-primary"
              )}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
