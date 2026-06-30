"use client";

import { quickActions } from "@/lib/ai-assistant/quick-actions";

type QuickActionChipsProps = {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export default function QuickActionChips({ onSelect, disabled }: QuickActionChipsProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto border-t border-outline-variant/40 bg-surface-container-lowest/80 px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="group"
      aria-label="Quick questions"
    >
      {quickActions.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(action.prompt)}
          className="flex-shrink-0 whitespace-nowrap rounded-full border border-secondary/30 bg-secondary-container/30 px-3.5 py-1.5 text-[12px] font-medium text-on-secondary-container transition-colors hover:bg-secondary-container/60 disabled:opacity-50"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
