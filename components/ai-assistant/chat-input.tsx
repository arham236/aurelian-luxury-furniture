"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [value]);

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-outline-variant/40 bg-surface-container-lowest/80 px-4 py-3">
      <div className="flex-1 rounded-[18px] border border-transparent px-3 py-1.5 transition-colors focus-within:border-secondary">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Ask about furniture, styling, delivery…"
          aria-label="Message the AI Interior Consultant"
          disabled={disabled}
          className="w-full resize-none bg-transparent text-body-md text-[14px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none disabled:opacity-60"
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || value.trim().length === 0}
        aria-label="Send message"
        className={cn(
          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200",
          value.trim().length > 0 && !disabled
            ? "bg-secondary text-on-secondary hover:scale-105"
            : "bg-surface-container text-on-surface-variant/50"
        )}
      >
        <Send size={16} strokeWidth={1.75} />
      </button>
    </div>
  );
}
