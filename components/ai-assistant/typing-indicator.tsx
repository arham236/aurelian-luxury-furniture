"use client";

import { motion } from "framer-motion";
import { Gem } from "lucide-react";

export default function TypingIndicator() {
  return (
    <li className="flex w-full items-center gap-2.5" aria-live="polite" aria-label="AI Interior Consultant is typing">
      <div
        aria-hidden="true"
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container"
      >
        <Gem size={15} strokeWidth={1.5} />
      </div>
      <div className="flex items-center gap-1.5 rounded-[18px] rounded-tl-[6px] bg-surface-container-low px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-on-surface-variant/60"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{
              duration: 1.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </li>
  );
}
