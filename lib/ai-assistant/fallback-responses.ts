const FALLBACK_RESPONSES = [
  "I'm not completely sure what you mean — could you tell me a little more?",
  "I can definitely help with that. Could you explain a bit more about what you're looking for?",
  "Could you give me a little more detail so I can recommend the best furniture for you?",
  "I want to make sure I point you in the right direction — could you say a bit more about what you need?",
  "Happy to help! Could you tell me more — is this about a specific piece, a room you're styling, or something else?",
];

/**
 * Picks a fallback line. Uses a simple hash of the input plus how many
 * fallback replies have already been sent this conversation, so the same
 * message won't always produce the same line and a multi-turn fallback
 * loop doesn't repeat itself.
 */
export function pickFallbackResponse(seed: string, fallbackCountSoFar: number): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const index = (hash + fallbackCountSoFar) % FALLBACK_RESPONSES.length;
  return FALLBACK_RESPONSES[index];
}

/**
 * Counts how many of the recent assistant turns in history were fallback
 * responses, so pickFallbackResponse can rotate rather than repeat across a
 * conversation. This is a cheap exact-match check against the known pool —
 * no extra state needs to be stored since the full history is already sent
 * with every request.
 */
export function countRecentFallbacks(history: { role: "user" | "assistant"; content: string }[]): number {
  return history.filter((m) => m.role === "assistant" && FALLBACK_RESPONSES.includes(m.content)).length;
}
