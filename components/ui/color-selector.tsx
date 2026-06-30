"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductColor } from "@/data/products";

type ColorSelectorProps = {
  colors: ProductColor[];
  selected: string;
  onSelect: (colorName: string) => void;
};

/** Beautiful selectable color swatches: a ring of color with a checkmark on the active selection. */
export default function ColorSelector({ colors, selected, onSelect }: ColorSelectorProps) {
  const activeColor = colors.find((c) => c.name === selected);

  return (
    <div>
      <p className="mb-3 text-label-caps text-on-surface-variant">
        Color{activeColor ? ` — ${activeColor.name}` : ""}
      </p>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isActive = color.name === selected;
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onSelect(color.name)}
              aria-label={color.name}
              aria-pressed={isActive}
              title={color.name}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                isActive
                  ? "border-secondary shadow-level-2"
                  : "border-transparent hover:border-outline-variant"
              )}
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10"
                style={{ backgroundColor: color.hex }}
              >
                {isActive && (
                  <Check
                    size={14}
                    strokeWidth={2.5}
                    className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] mix-blend-difference"
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
