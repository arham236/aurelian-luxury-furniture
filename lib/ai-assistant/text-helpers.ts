/**
 * Lowercases and strips punctuation that would otherwise block substring
 * matches (e.g. "what's up?" → "whats up", "delivery?" → "delivery").
 * Keeps spaces and word characters only.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True if the normalized text contains any of the given terms as a substring. */
export function includesAny(text: string, terms: string[]): boolean {
  return terms.some((t) => text.includes(t));
}

/** True if the normalized text contains every one of the given terms. */
export function includesAll(text: string, terms: string[]): boolean {
  return terms.every((t) => text.includes(t));
}

/**
 * True if the text matches one of the given whole-word/phrase patterns,
 * using word boundaries so short terms like "hi" don't match inside
 * unrelated words (e.g. "history", "behind").
 */
export function matchesWord(text: string, words: string[]): boolean {
  return words.some((w) => new RegExp(`\\b${w}\\b`).test(text));
}

/**
 * Pakistani cities the assistant recognizes for delivery questions, so
 * "do you deliver to Lahore" gets a direct, specific answer rather than the
 * generic delivery overview.
 */
export const PAKISTAN_CITIES = [
  "lahore",
  "karachi",
  "islamabad",
  "multan",
  "rawalpindi",
  "faisalabad",
  "peshawar",
  "quetta",
  "sialkot",
  "gujranwala",
];
