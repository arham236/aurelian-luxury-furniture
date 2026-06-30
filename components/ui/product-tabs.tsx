"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";

type ProductTabsProps = {
  product: Product;
};

type TabId = "specifications" | "dimensions" | "delivery" | "warranty" | "care";

const TAB_LABELS: Record<TabId, string> = {
  specifications: "Specifications",
  dimensions: "Dimensions",
  delivery: "Delivery",
  warranty: "Warranty",
  care: "Care",
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-outline-variant/40 py-3 last:border-b-0">
      <span className="text-sm text-on-surface-variant">{label}</span>
      <span className="text-sm font-medium text-primary">{value}</span>
    </div>
  );
}

/** Tabbed panel switching between specs, dimensions, delivery, warranty, and care content. */
export default function ProductTabs({ product }: ProductTabsProps) {
  const availableTabs = (
    [
      product.specifications && "specifications",
      product.dimensions && "dimensions",
      product.delivery && "delivery",
      product.warranty && "warranty",
      product.care && "care",
    ].filter(Boolean) as TabId[]
  );

  const [activeTab, setActiveTab] = useState<TabId | undefined>(availableTabs[0]);

  if (availableTabs.length === 0) return null;

  return (
    <div className="rounded-[24px] border border-white/20 bg-surface-container-lowest shadow-level-2">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto border-b border-outline-variant/40 px-4 pt-4 md:px-6">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            aria-pressed={activeTab === tab}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-label-caps transition-colors duration-300",
              activeTab === tab
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {activeTab === "specifications" && product.specifications && (
          <div>
            <SpecRow label="Material" value={product.specifications.material} />
            <SpecRow label="Finish" value={product.specifications.finish} />
            <SpecRow label="Collection" value={product.specifications.collection} />
            <SpecRow label="Style" value={product.specifications.style} />
            <SpecRow label="SKU" value={product.specifications.sku} />
          </div>
        )}

        {activeTab === "dimensions" && product.dimensions && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-headline-lg-mobile text-primary">
                {product.dimensions.width}
              </p>
              <p className="mt-1 text-label-caps text-on-surface-variant">Width</p>
            </div>
            <div>
              <p className="text-headline-lg-mobile text-primary">
                {product.dimensions.height}
              </p>
              <p className="mt-1 text-label-caps text-on-surface-variant">Height</p>
            </div>
            <div>
              <p className="text-headline-lg-mobile text-primary">
                {product.dimensions.depth}
              </p>
              <p className="mt-1 text-label-caps text-on-surface-variant">Depth</p>
            </div>
          </div>
        )}

        {activeTab === "delivery" && product.delivery && (
          <p className="text-body-md text-on-surface-variant">{product.delivery}</p>
        )}

        {activeTab === "warranty" && product.warranty && (
          <p className="text-body-md text-on-surface-variant">{product.warranty}</p>
        )}

        {activeTab === "care" && product.care && (
          <ul className="flex flex-col gap-3">
            {product.care.map((line) => (
              <li key={line} className="flex gap-3 text-sm text-on-surface-variant">
                <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-secondary" />
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
