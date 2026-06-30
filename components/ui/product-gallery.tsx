"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  productName: string;
};

/**
 * Large product image with a thumbnail strip beneath it. Clicking a
 * thumbnail swaps the main image with a soft crossfade. Falls back
 * gracefully to a single image when only one is provided (no thumbnail
 * strip rendered in that case).
 */
export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-[24px] border border-white/20 bg-surface-container shadow-level-2 md:aspect-[4/5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage}
              alt={`${productName} — view ${activeIndex + 1}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, index) => (
            <button
              key={src + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${productName}`}
              aria-pressed={index === activeIndex}
              className={cn(
                "relative aspect-square w-20 flex-shrink-0 overflow-hidden rounded-[16px] border-2 transition-colors duration-300 md:w-24",
                index === activeIndex
                  ? "border-secondary"
                  : "border-white/20 hover:border-outline"
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
