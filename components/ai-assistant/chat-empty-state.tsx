"use client";

import { motion } from "framer-motion";
import { Gem } from "lucide-react";

export default function ChatEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
        <Gem size={24} strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-[20px] font-medium text-on-surface">
          Welcome to Aurelian.
        </h3>
        <p className="mx-auto max-w-[280px] text-body-md text-[14px] leading-relaxed text-on-surface-variant">
          I&apos;m your AI Interior Consultant. Ask me anything about our furniture, styling
          ideas, delivery, warranties, or choosing the perfect luxury pieces.
        </p>
      </div>
    </motion.div>
  );
}
