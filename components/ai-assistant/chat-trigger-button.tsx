"use client";

import { motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

type ChatTriggerButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function ChatTriggerButton({ isOpen, onClick }: ChatTriggerButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={isOpen ? "Close AI Interior Consultant chat" : "Open AI Interior Consultant chat"}
      aria-expanded={isOpen}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-[96] flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-level-3 transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(119,90,25,0.45)]"
    >
      {!isOpen && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 rounded-full bg-secondary/60"
          style={{ animation: "assistant-pulse 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
        />
      )}
      <motion.span
        key={isOpen ? "close" : "open"}
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-center"
      >
        {isOpen ? (
          <X size={24} strokeWidth={1.75} />
        ) : (
          <MessageCircle size={24} strokeWidth={1.75} aria-hidden="true" />
        )}
      </motion.span>
    </motion.button>
  );
}
