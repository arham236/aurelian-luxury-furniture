"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gem } from "lucide-react";
import { useAssistantChat } from "@/hooks/use-assistant-chat";
import ChatMessageBubble from "@/components/ai-assistant/chat-message-bubble";
import TypingIndicator from "@/components/ai-assistant/typing-indicator";
import ChatEmptyState from "@/components/ai-assistant/chat-empty-state";
import ChatInput from "@/components/ai-assistant/chat-input";
import QuickActionChips from "@/components/ai-assistant/quick-action-chips";

type ChatWindowProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * The AI Interior Consultant chat panel. Mounted via portal to document.body
 * so it always overlays page content regardless of where the trigger button
 * lives, mirroring the CartDrawer's dialog pattern: focus trap, ESC to
 * close, click-outside (via the overlay) to close, and focus restoration.
 */
export default function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const { messages, isTyping, sendMessage } = useAssistantChat();
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ESC closes the chat window.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus management: remember trigger, move focus in on open, restore on close.
  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      window.setTimeout(() => panelRef.current?.focus(), 50);
    } else {
      previouslyFocused.current?.focus();
    }
  }, [isOpen]);

  // Simple focus trap: keep Tab/Shift+Tab cycling within the panel.
  useEffect(() => {
    if (!isOpen) return;
    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], textarea, input, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Auto-scroll to the latest message whenever the conversation changes.
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="assistant-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[95] bg-black/30 backdrop-blur-sm md:bg-black/20"
            aria-hidden="true"
          />

          <motion.div
            key="assistant-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="AI Interior Consultant chat"
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass fixed bottom-0 right-0 z-[96] flex h-[100dvh] w-full flex-col shadow-level-3 outline-none sm:bottom-6 sm:right-6 sm:h-[640px] sm:max-h-[85vh] sm:w-[400px] sm:rounded-[28px]"
          >
            <header className="flex items-center justify-between gap-3 border-b border-outline-variant/40 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                  <Gem size={18} strokeWidth={1.5} aria-hidden="true" />
                </div>
                <div>
                  <h2 className="font-display text-[16px] font-medium leading-tight text-on-surface">
                    AI Interior Consultant
                  </h2>
                  <p className="text-[12px] text-on-surface-variant">Always here to help</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close chat"
                className="flex-shrink-0 rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex flex-1 flex-col overflow-y-auto px-4 py-4"
              role="log"
              aria-live="polite"
              aria-label="Conversation with the AI Interior Consultant"
            >
              {messages.length === 0 ? (
                <ChatEmptyState />
              ) : (
                <ul className="flex flex-1 flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {messages.map((message) => (
                      <ChatMessageBubble key={message.id} message={message} />
                    ))}
                  </AnimatePresence>
                  {isTyping && <TypingIndicator />}
                </ul>
              )}
            </div>

            <QuickActionChips onSelect={sendMessage} disabled={isTyping} />
            <ChatInput onSend={sendMessage} disabled={isTyping} />
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
