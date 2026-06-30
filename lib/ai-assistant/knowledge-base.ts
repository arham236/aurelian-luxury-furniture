import { allProducts, type Product } from "@/data/products";
import { formatPrice } from "@/lib/utils";

/**
 * Builds a compact, structured knowledge base string from the live product
 * catalog. This is the single source of truth fed to both the OpenAI-backed
 * assistant (as system context) and the local rule-based fallback assistant,
 * so the AI can never "know" about a product that isn't actually in
 * data/products.ts.
 */
export function buildCatalogKnowledge(): string {
  return allProducts.map((p) => formatProductForKnowledge(p)).join("\n\n");
}

export function formatProductForKnowledge(p: Product): string {
  const lines: string[] = [];
  lines.push(`PRODUCT: ${p.name}`);
  lines.push(`Price: ${formatPrice(p.price)}`);
  lines.push(`Category: ${p.category}`);
  if (p.specifications?.collection) lines.push(`Collection: ${p.specifications.collection}`);
  if (p.specifications?.style) lines.push(`Style: ${p.specifications.style}`);
  lines.push(`Description: ${p.description}`);
  if (p.materials?.length) lines.push(`Materials: ${p.materials.join(", ")}`);
  if (p.colors?.length) lines.push(`Available colors: ${p.colors.map((c) => c.name).join(", ")}`);
  if (p.sizes?.length) lines.push(`Available sizes: ${p.sizes.join(", ")}`);
  if (p.dimensions)
    lines.push(
      `Dimensions: W ${p.dimensions.width} x H ${p.dimensions.height} x D ${p.dimensions.depth}`
    );
  if (p.features?.length) lines.push(`Features: ${p.features.join(", ")}`);
  if (p.warranty) lines.push(`Warranty: ${p.warranty}`);
  if (p.delivery) lines.push(`Delivery: ${p.delivery}`);
  if (p.care?.length) lines.push(`Care instructions: ${p.care.join(" ")}`);
  if (p.specifications?.sku) lines.push(`SKU: ${p.specifications.sku}`);
  return lines.join("\n");
}

/** Normalizes text for loose matching: lowercase, strip punctuation. */
function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Finds products whose name (or a close partial of it) is mentioned in the
 * given text. Used so the assistant can recognize "tell me about the
 * Aurelian Lounge Sofa" or just "lounge sofa".
 */
export function findMentionedProducts(text: string): Product[] {
  const normalizedText = normalize(text);
  const matches = allProducts.filter((p) => {
    const normalizedName = normalize(p.name);
    if (normalizedText.includes(normalizedName)) return true;
    // Try matching on the distinctive part of the name (drop "the", "a")
    const significantWords = normalizedName
      .split(" ")
      .filter((w) => !["the", "a", "an"].includes(w));
    if (significantWords.length >= 2) {
      const phrase = significantWords.join(" ");
      if (normalizedText.includes(phrase)) return true;
    }
    return false;
  });
  return matches;
}

/** Returns products belonging to a given category label (case-insensitive, partial match). */
export function findProductsByCategory(categoryQuery: string): Product[] {
  const normalizedQuery = normalize(categoryQuery);
  return allProducts.filter((p) => normalize(p.category).includes(normalizedQuery));
}

export type { Product };
export { allProducts };
