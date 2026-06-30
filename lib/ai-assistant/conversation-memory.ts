import { allProducts, findMentionedProducts, type Product } from "@/lib/ai-assistant/knowledge-base";

export type ChatHistoryMessage = { role: "user" | "assistant"; content: string };

export type ConversationTopic = {
  /** The most recently discussed product, if any. */
  product: Product | null;
  /** The most recently discussed room/category, if any ("Living", "Bedroom", "Dining"). */
  category: string | null;
  /** Name-matching keywords for a more specific remembered furniture type, e.g. ["sofa", "lounge"]. */
  nameKeywords: string[] | null;
};

const CATEGORY_WORDS: { category: string; terms: string[]; nameKeywords: string[] }[] = [
  { category: "Living", terms: ["sofa", "couch", "sectional"], nameKeywords: ["sofa", "lounge"] },
  { category: "Living", terms: ["chair"], nameKeywords: ["chair"] },
  { category: "Living", terms: ["living room", "living space", "lounge"], nameKeywords: [] },
  { category: "Bedroom", terms: ["bedroom", "bed", "mattress"], nameKeywords: ["bed"] },
  { category: "Bedroom", terms: ["nightstand"], nameKeywords: ["nightstand"] },
  { category: "Dining", terms: ["dining room", "dining table", "dining set", "dining"], nameKeywords: ["table"] },
];

/**
 * Scans recent conversation history (most recent first) to infer what the
 * user is currently talking about, so a short follow-up like "what colors
 * are available?" after "I need a sofa" still resolves to the sofa rather
 * than falling back to a generic answer.
 *
 * Looks at both user and assistant turns: a product the assistant just
 * recommended is just as much "the topic" as one the user named directly.
 */
export function inferConversationTopic(history: ChatHistoryMessage[]): ConversationTopic {
  const recent = [...history].reverse().slice(0, 8);

  for (const message of recent) {
    const mentioned = findMentionedProducts(message.content);
    if (mentioned.length === 1) {
      return { product: mentioned[0], category: mentioned[0].category, nameKeywords: null };
    }
  }

  for (const message of recent) {
    const text = message.content.toLowerCase();
    for (const { category, terms, nameKeywords } of CATEGORY_WORDS) {
      if (terms.some((t) => text.includes(t))) {
        return { product: null, category, nameKeywords: nameKeywords.length > 0 ? nameKeywords : null };
      }
    }
  }

  return { product: null, category: null, nameKeywords: null };
}

/** Finds a product purely by exact id, used when resolving a remembered topic. */
export function findProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}
