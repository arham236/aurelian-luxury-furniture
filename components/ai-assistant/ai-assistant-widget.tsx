"use client";

import { useEffect, useState } from "react";
import ChatTriggerButton from "@/components/ai-assistant/chat-trigger-button";
import ChatWindow from "@/components/ai-assistant/chat-window";

/**
 * Root mount point for the AI Interior Consultant assistant: a floating
 * trigger button plus its chat panel. Owns the open/close state and locks
 * body scroll while the panel is open, mirroring the pattern used by the
 * cart drawer (see contexts/cart-context.tsx).
 */
export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <ChatTriggerButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
      <ChatWindow isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
