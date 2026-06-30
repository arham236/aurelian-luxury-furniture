"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "aurelian-ai-assistant-history";
const MAX_STORED_MESSAGES = 40;

export type ChatRole = "user" | "assistant";

export type ChatSuggestion = {
  label: string;
  productSlug: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
  suggestions?: ChatSuggestion[];
};

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readStoredMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMessage =>
        typeof m === "object" &&
        m !== null &&
        typeof m.id === "string" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        typeof m.timestamp === "number"
    );
  } catch {
    return [];
  }
}

function persistMessages(messages: ChatMessage[]) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages.slice(-MAX_STORED_MESSAGES))
    );
  } catch {
    // localStorage unavailable — chat simply won't persist across reloads.
  }
}

/**
 * Manages the AI assistant's conversation: message list (persisted to
 * localStorage so it survives navigation/reload, same pattern as
 * useRecentlyViewed), sending new messages to /api/assistant, and a
 * typing/loading indicator. Network and parsing failures degrade to a
 * friendly inline error message rather than throwing.
 */
export function useAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMessages(readStoredMessages());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    persistMessages(messages);
  }, [messages, isHydrated]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    let historyForRequest: ChatMessage[] = [];
    setMessages((prev) => {
      historyForRequest = prev;
      return [...prev, userMessage];
    });
    setIsTyping(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: historyForRequest.slice(-12).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Assistant request failed with status ${response.status}`);
      }

      const data: { reply?: string; suggestions?: ChatSuggestion[] } = await response.json();

      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content:
          typeof data.reply === "string" && data.reply.trim().length > 0
            ? data.reply
            : "I'm sorry, I didn't quite catch that — could you tell me a bit more?",
        timestamp: Date.now(),
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("[assistant] Failed to get a reply:", error);
      const errorMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content:
          "I'm having trouble connecting right now. Please try again in a moment, or reach out to our concierge team directly.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    messages,
    isTyping,
    isHydrated,
    sendMessage,
    clearChat,
  };
}
