"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gem, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { renderMarkdown } from "@/lib/ai-assistant/render-markdown";
import type { ChatMessage } from "@/hooks/use-assistant-chat";

function formatTimestamp(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

type ChatMessageBubbleProps = {
  message: ChatMessage;
  onSuggestionClick?: () => void;
};

export default function ChatMessageBubble({ message, onSuggestionClick }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn("flex w-full gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        aria-hidden="true"
        className={cn(
          "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-primary text-on-primary" : "bg-secondary-container text-on-secondary-container"
        )}
      >
        {isUser ? <User size={15} strokeWidth={1.5} /> : <Gem size={15} strokeWidth={1.5} />}
      </div>

      <div className={cn("flex max-w-[82%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-[18px] px-4 py-2.5 text-body-md text-[14px] leading-relaxed",
            isUser
              ? "rounded-tr-[6px] bg-primary text-on-primary"
              : "rounded-tl-[6px] bg-surface-container-low text-on-surface"
          )}
        >
          {renderMarkdown(message.content)}
        </div>

        {!isUser && message.suggestions && message.suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-0.5">
            {message.suggestions.map((suggestion) => (
              <Link
                key={suggestion.productSlug}
                href={`/products/${suggestion.productSlug}`}
                onClick={onSuggestionClick}
                className="rounded-full border border-secondary/40 bg-secondary-container/40 px-3 py-1 text-[12px] text-on-secondary-container transition-colors hover:bg-secondary-container/70"
              >
                {suggestion.label}
              </Link>
            ))}
          </div>
        )}

        <span className="px-1 text-[11px] text-on-surface-variant/70">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </motion.li>
  );
}
