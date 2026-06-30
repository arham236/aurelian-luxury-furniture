import {
  allProducts,
  findMentionedProducts,
  findProductsByCategory,
  type Product,
} from "@/lib/ai-assistant/knowledge-base";
import { formatPrice } from "@/lib/utils";
import { getProductSlug } from "@/data/products";
import { findCoupon } from "@/lib/coupons";
import { normalizeText, includesAny, matchesWord, PAKISTAN_CITIES } from "@/lib/ai-assistant/text-helpers";
import { inferConversationTopic, type ChatHistoryMessage } from "@/lib/ai-assistant/conversation-memory";
import { pickFallbackResponse } from "@/lib/ai-assistant/fallback-responses";

export type AssistantSuggestion = {
  label: string;
  productSlug: string;
};

export type LocalAssistantResult = {
  reply: string;
  suggestions: AssistantSuggestion[];
};

function productLine(p: Product): string {
  return `**${p.name}** — ${formatPrice(p.price)}`;
}

function toSuggestions(products: Product[]): AssistantSuggestion[] {
  return products.slice(0, 4).map((p) => ({
    label: p.name,
    productSlug: getProductSlug(p),
  }));
}

/**
 * Summarizes a single product using its real catalog data — name, price,
 * materials, colors, sizes, dimensions, warranty, delivery, care.
 */
function summarizeProduct(p: Product): string {
  const parts: string[] = [];
  parts.push(`**${p.name}** — ${formatPrice(p.price)}\n\n${p.description}`);

  const facts: string[] = [];
  if (p.materials?.length) facts.push(`- **Materials:** ${p.materials.join(", ")}`);
  if (p.colors?.length) facts.push(`- **Colors:** ${p.colors.map((c) => c.name).join(", ")}`);
  if (p.sizes?.length) facts.push(`- **Sizes:** ${p.sizes.join(", ")}`);
  if (p.dimensions)
    facts.push(
      `- **Dimensions:** ${p.dimensions.width} W × ${p.dimensions.height} H × ${p.dimensions.depth} D`
    );
  if (p.specifications?.collection) facts.push(`- **Collection:** ${p.specifications.collection}`);
  if (p.warranty) facts.push(`- **Warranty:** ${p.warranty}`);
  if (p.delivery) facts.push(`- **Delivery:** ${p.delivery}`);

  if (facts.length) parts.push(facts.join("\n"));

  return parts.join("\n\n");
}

function pickRoomRecommendations(room: "living" | "bedroom" | "dining"): Product[] {
  const map: Record<typeof room, string> = {
    living: "Living",
    bedroom: "Bedroom",
    dining: "Dining",
  };
  return findProductsByCategory(map[room]);
}

/**
 * Core local intelligence: a layered set of intent detectors, ordered from
 * most specific to most general, each grounded in the real product catalog.
 * This is intentionally rule-based rather than a single keyword switch, so
 * conversational variety ("I have a small apartment", "is velvet hard to
 * maintain") all route to a relevant, data-backed answer.
 */
export function getLocalAssistantReply(
  userMessage: string,
  history: ChatHistoryMessage[] = [],
  fallbackCountSoFar = 0
): LocalAssistantResult {
  const raw = userMessage.trim();
  const text = normalizeText(raw);

  // 1. Direct product lookups — "tell me about the Aurelian Lounge Sofa"
  // When the message specifically asks about stock/availability or
  // dimensions and also names a product, answer that focused question
  // directly here rather than giving the full product summary (or letting
  // the message fall through to compete with unrelated branches further
  // down, like the dining/material browse intents).
  const isAvailabilityQuestion = includesAny(text, [
    "in stock",
    "out of stock",
    "is this available",
    "is it available",
    "availability",
  ]);
  const isDimensionQuestion = includesAny(text, [
    "dimensions",
    "what size",
    "how big",
    "how large",
    "width",
    "height",
    "depth",
  ]);
  const mentioned = findMentionedProducts(raw);

  if (mentioned.length === 1 && isAvailabilityQuestion) {
    const p = mentioned[0];
    return {
      reply: `**${p.name}** is currently available to order, with delivery in line with our usual timelines — most pieces ship within a few weeks depending on the configuration you choose. Would you like help picking a size or color?`,
      suggestions: toSuggestions([p]),
    };
  }
  if (mentioned.length === 1 && isDimensionQuestion && mentioned[0].dimensions) {
    const p = mentioned[0];
    return {
      reply: `**${p.name}** measures ${p.dimensions!.width} wide × ${p.dimensions!.height} tall × ${p.dimensions!.depth} deep.${
        p.sizes?.length ? ` It's also available in these size options: ${p.sizes.join(", ")}.` : ""
      }`,
      suggestions: toSuggestions([p]),
    };
  }

  if (mentioned.length === 1) {
    return {
      reply: summarizeProduct(mentioned[0]),
      suggestions: toSuggestions(mentioned),
    };
  }
  if (mentioned.length > 1) {
    return {
      reply:
        `We carry a few pieces that match that — here's a quick look:\n\n` +
        mentioned.map((p) => `- ${productLine(p)}`).join("\n"),
      suggestions: toSuggestions(mentioned),
    };
  }

  // 1b. Memory-aware follow-up — "what colors are available?" after "I need a sofa"
  // resolves against the product most recently discussed, rather than falling
  // back to a generic answer just because this message doesn't name it again.
  if (
    includesAny(text, [
      "what colors",
      "what colours",
      "color options",
      "colour options",
      "what sizes",
      "size options",
      "what materials",
      "is it made of",
    ])
  ) {
    const topic = inferConversationTopic(history);
    if (topic.product) {
      const p = topic.product;
      const parts: string[] = [`For the **${p.name}**:`];
      if (includesAny(text, ["color", "colour"]) && p.colors?.length) {
        parts.push(`**Colors:** ${p.colors.map((c) => c.name).join(", ")}`);
      }
      if (includesAny(text, ["size"]) && p.sizes?.length) {
        parts.push(`**Sizes:** ${p.sizes.join(", ")}`);
      }
      if (includesAny(text, ["material", "made of"]) && p.materials?.length) {
        parts.push(`**Materials:** ${p.materials.join(", ")}`);
      }
      if (parts.length === 1) {
        // Asked about something that product doesn't have data for.
        parts.push("That detail isn't listed for this piece — happy to check anything else about it.");
      }
      return { reply: parts.join("\n\n"), suggestions: toSuggestions([p]) };
    }
    if (topic.category) {
      // No single product was named yet (e.g. "I need a sofa" rather than a
      // specific product), but we know the category — and often a more
      // specific furniture type — so narrow to that rather than showing
      // every product in the room.
      const categoryPicks = findProductsByCategory(topic.category);
      const picks = topic.nameKeywords
        ? categoryPicks.filter((p) =>
            topic.nameKeywords!.some((kw) => p.name.toLowerCase().includes(kw))
          )
        : categoryPicks;
      const finalPicks = picks.length > 0 ? picks : categoryPicks;
      if (finalPicks.length > 0) {
        const lines = finalPicks.map((p) => {
          const details: string[] = [];
          if (includesAny(text, ["color", "colour"]) && p.colors?.length) {
            details.push(`Colors: ${p.colors.map((c) => c.name).join(", ")}`);
          }
          if (includesAny(text, ["size"]) && p.sizes?.length) {
            details.push(`Sizes: ${p.sizes.join(", ")}`);
          }
          if (includesAny(text, ["material", "made of"]) && p.materials?.length) {
            details.push(`Materials: ${p.materials.join(", ")}`);
          }
          return `- **${p.name}** — ${details.join(" · ") || "details available on request"}`;
        });
        return {
          reply: `Here's what's available:\n\n${lines.join("\n")}`,
          suggestions: toSuggestions(finalPicks),
        };
      }
    }
  }

  // 2. Greeting
  if (
    matchesWord(text, ["hi", "hello", "hey", "yo", "hiya", "howdy"]) ||
    includesAny(text, [
      "good morning",
      "good afternoon",
      "good evening",
      "whats up",
      "what is up",
      "sup",
    ])
  ) {
    return {
      reply:
        "Hello! Welcome to Aurelian. I'm your AI Interior Consultant — I can help you choose furniture, recommend pieces for a room or style, answer questions on materials, delivery, or warranty, or just chat about ideas for your space. What are you working on?",
      suggestions: [],
    };
  }

  // 2b. Small talk — identity and capability questions
  if (includesAny(text, ["who are you", "what are you"])) {
    return {
      reply:
        "I'm the AI Interior Consultant for Aurelian — think of me as a furniture sales consultant who's always available. I know our full catalog inside and out, so I can recommend pieces, compare materials, walk you through sizing, or answer questions on delivery and warranty. What can I help you find?",
      suggestions: [],
    };
  }

  if (includesAny(text, ["how are you", "how r u", "how you doing", "how's it going", "hows it going"])) {
    return {
      reply:
        "I'm doing well, thank you for asking! Ready to help you find something beautiful for your home — what are you working on?",
      suggestions: [],
    };
  }

  if (includesAny(text, ["what can you do", "what do you do", "what can you help"])) {
    return {
      reply:
        "I'd be happy to help! I can assist with:\n\n- Furniture recommendations\n- Interior styling ideas\n- Living room, bedroom, or dining furniture\n- Materials, colors, and sizing\n- Delivery, payment, and warranty questions\n- Returns and order support\n\nWhat would you like to start with?",
      suggestions: [],
    };
  }

  if (includesAny(text, ["nice to meet you", "pleasure to meet you", "good to meet you"])) {
    return {
      reply: "Likewise — it's lovely to meet you! What brings you to Aurelian today?",
      suggestions: [],
    };
  }

  if (matchesWord(text, ["bye", "goodbye"]) || includesAny(text, ["see you", "see ya", "have a good day", "take care"])) {
    return {
      reply: "Thank you for stopping by Aurelian — wishing you all the best with your space!",
      suggestions: [],
    };
  }


  // 3. Warranty
  if (includesAny(text, ["warranty", "guarantee"])) {
    return {
      reply:
        "Every Aurelian piece is backed by a warranty — most frames carry a **lifetime structural warranty**, with upholstery, cushioning, and finishes typically covered for **2–5 years** depending on the piece. Marble tops and integrated lighting have their own coverage terms. Tell me which piece you're considering and I'll share its exact warranty.",
      suggestions: [],
    };
  }

  // 4. Returns
  if (includesAny(text, ["return", "refund", "exchange", "cancel order"])) {
    return {
      reply:
        "We want you to love your piece. Aurelian offers a **30-day return window** from delivery for items in original, unused condition — white glove pickup is arranged for any return so you never have to handle moving it yourself. Custom and made-to-order pieces are handled case-by-case, so reach out to our concierge team if that applies to your order.",
      suggestions: [],
    };
  }

  // 5. Delivery / shipping — including city-specific recognition
  const mentionedCity = PAKISTAN_CITIES.find((city) => matchesWord(text, [city]));
  const isDeliveryQuestion =
    (includesAny(text, [
      "deliver",
      "shipping",
      "ship",
      "international",
      "lead time",
      "how long",
      "when will my order",
      "when will it arrive",
      "delivery charges",
      "delivery time",
      "delivery cost",
    ]) &&
      !includesAny(text, ["cash on delivery"])) ||
    Boolean(mentionedCity);

  if (isDeliveryQuestion) {
    const cityLine = mentionedCity
      ? `Yes — we deliver to ${mentionedCity.charAt(0).toUpperCase() + mentionedCity.slice(1)} and across Pakistan. `
      : "Yes! We deliver across Pakistan, with international delivery available on select pieces. ";
    return {
      reply:
        cityLine +
        "Here's how it breaks down:\n\n" +
        "**Standard Delivery:** 5–10 business days\n" +
        "**White Glove Delivery:** 7–14 business days (includes in-home placement, assembly, and packaging removal)\n\n" +
        "Exact timing depends on your city and the product's availability — natural stone and made-to-order upholstery can take a little longer. Let me know which piece you're interested in and I can give you a more precise estimate.",
      suggestions: [],
    };
  }

  // 6. Material comparisons — walnut vs oak, velvet maintenance, etc.
  if (
    includesAny(text, ["walnut", "oak"]) &&
    includesAny(text, ["difference", "vs", "versus", "compare", "better"])
  ) {
    return {
      reply:
        "Great question. **Oak** is lighter in tone, has a pronounced grain, and is exceptionally durable — it's the frame material behind pieces like the Aurelian Lounge Sofa and the Minimalist Platform Bed. **Walnut** is darker and richer with a finer, more uniform grain, giving a warmer, more formal look — you'll see it as a finish option on our nightstands. Both are solid hardwoods built to last generations; the choice really comes down to whether you want your room to feel airy and light (oak) or deep and moody (walnut).",
      suggestions: [],
    };
  }

  if (includesAny(text, ["velvet"]) && includesAny(text, ["maintain", "care", "clean", "hard"])) {
    const picks = allProducts.filter((p) =>
      p.materials?.some((m) => m.toLowerCase().includes("velvet"))
    );
    return {
      reply:
        "Velvet (and our velvet-look performance fabric) is easier to live with than people expect. Brush it gently in the direction of the weave to keep it looking plush, blot — never rub — any spills immediately, and keep it out of direct, prolonged sunlight so the color stays rich. Our performance velvet on pieces like the Velvet King Bed is also treated to resist everyday wear, so it's a very livable choice even with a busy household.",
      suggestions: toSuggestions(picks),
    };
  }

  if (includesAny(text, ["bouclé", "boucle"]) && includesAny(text, ["maintain", "care", "clean"])) {
    const picks = allProducts.filter((p) =>
      p.materials?.some((m) => m.toLowerCase().includes("bouclé") || m.toLowerCase().includes("boucle"))
    );
    return {
      reply:
        "Bouclé is wonderfully tactile and quite forgiving day-to-day. Brush it gently with a soft-bristle brush, spot clean with a mild water-based upholstery cleaner, and rotate cushions monthly so wear stays even. Keep it away from direct heat sources, which can affect the texture of the loops.",
      suggestions: toSuggestions(picks),
    };
  }

  if (includesAny(text, ["marble"]) && includesAny(text, ["maintain", "care", "clean", "stain"])) {
    const picks = allProducts.filter((p) => p.materials?.some((m) => m.toLowerCase().includes("marble")));
    return {
      reply:
        "Marble is a showstopper, but it does want a little care. Seal the surface annually, wipe up spills immediately (especially acidic things like wine or citrus, which can etch the stone), and always use coasters or placemats. With that light routine, a marble top like the one on our Calacatta Dining Table will look stunning for decades.",
      suggestions: toSuggestions(picks),
    };
  }

  // 6b. General material questions — wood, leather, fabric, metal, marble (browse by material)
  const materialQuery = [
    { terms: ["wood", "oak", "walnut"], label: "wood" },
    { terms: ["leather"], label: "leather" },
    { terms: ["fabric", "linen", "bouclé", "boucle"], label: "fabric" },
    { terms: ["metal", "brass", "steel"], label: "metal" },
    { terms: ["marble"], label: "marble" },
    { terms: ["velvet"], label: "velvet" },
  ].find(({ terms }) => includesAny(text, terms));
  if (materialQuery && includesAny(text, ["material", "made of", "made from", materialQuery.label])) {
    const picks = allProducts.filter((p) =>
      p.materials?.some((m) => m.toLowerCase().includes(materialQuery.label))
    );
    if (picks.length > 0) {
      return {
        reply:
          `Here's what we have featuring ${materialQuery.label}:\n\n` +
          picks.map((p) => `- ${productLine(p)}`).join("\n"),
        suggestions: toSuggestions(picks),
      };
    }
  }

  // 7. Small space / apartment
  if (includesAny(text, ["small apartment", "small space", "compact", "tiny", "studio"])) {
    const picks = allProducts.filter((p) =>
      ["sculptural-accent-chair", "lumina-console-table", "designer-nightstand-collection"].includes(p.id)
    );
    return {
      reply:
        "For a smaller footprint, I'd lean toward pieces that are sculptural rather than bulky — they read as intentional, not just space-filling. The Sculptural Accent Chair gives you a strong design statement without eating up floor space, and a console table like the Lumina works beautifully in a tight entryway while doubling as storage. If it's a bedroom, our nightstands come in a single option so you're not forced into a pair.\n\nWant me to tailor this further — is it mainly a living area or a bedroom you're working with?",
      suggestions: toSuggestions(picks),
    };
  }

  // 8. Family-friendly sofa
  if (
    includesAny(text, ["family", "kids", "children", "durable", "pets", "dog", "cat"]) &&
    includesAny(text, ["sofa", "couch", "seating"])
  ) {
    const sofa = allProducts.find((p) => p.id === "aurelian-lounge-sofa");
    return {
      reply:
        "For a household with family (or pets) in the mix, I'd recommend **The Aurelian Lounge Sofa**. Its linen upholstery and solid oak frame are built for everyday life, the deep three-seat silhouette suits movie nights and lounging alike, and it's available in Natural Linen, Dove Grey, or Charcoal — Charcoal especially is forgiving with daily wear. It also comes in a 2-Seater, 3-Seater, or full L-Shape if you need more room to spread out.",
      suggestions: sofa ? toSuggestions([sofa]) : [],
    };
  }

  // 9. Dining table seating capacity — "fits 6 people"
  const seatMatch = text.match(/(\d+)\s*(?:-|\s)?\s*(?:seat|people|person|guests)/);
  if (seatMatch || (includesAny(text, ["dining table", "dining set"]) && includesAny(text, ["fit", "seat"]))) {
    const table = allProducts.find((p) => p.id === "calacatta-dining-table");
    const seatCount = seatMatch ? seatMatch[1] : null;
    return {
      reply: table
        ? `Our **Calacatta Dining Table** is the one to look at — it's offered in **6-Seat, 8-Seat, and 10-Seat** sizing on the same fluted brass pedestal base, so${
            seatCount ? ` the size for ${seatCount} would be a great fit` : " you can match it to your room"
          }. The oval Calacatta marble top keeps it feeling sculptural rather than just a big slab of table, at ${table.dimensions?.width} wide in its base configuration.`
        : "Let me know how many seats you need and I can point you to the right configuration.",
      suggestions: table ? toSuggestions([table]) : [],
    };
  }

  // 10. Color matching — "what color matches white walls"
  if (
    includesAny(text, ["white wall", "match", "color goes", "colour goes", "which color", "which colour"]) &&
    !includesAny(text, ["warranty"])
  ) {
    return {
      reply:
        "Against white walls, you have a lot of freedom — our neutral tones (Natural Linen, Soft Linen, Ivory Bouclé, Natural Oak) keep things bright and airy, while a deeper tone like Charcoal, Espresso, or Midnight creates a deliberate contrast that reads as quietly dramatic rather than busy. If you want one statement piece, pick the darker tone for that item and keep everything else around it neutral.\n\nWhat room are you decorating? I can suggest specific pieces and colorways.",
      suggestions: [],
    };
  }

  // 10b. Browse by a specific color/finish — "grey furniture", "wood finish", "dark colors"
  const colorBrowse = [
    { terms: ["grey furniture", "gray furniture", "grey color", "gray color"], match: ["grey", "gray", "dove"] },
    { terms: ["white furniture", "ivory furniture"], match: ["white", "ivory", "natural"] },
    { terms: ["black furniture", "charcoal furniture"], match: ["black", "charcoal", "midnight", "espresso"] },
    { terms: ["wood finish", "wooden finish", "natural oak", "oak finish"], match: ["oak", "walnut", "wood"] },
    { terms: ["dark colors", "dark colours", "dark furniture", "dark tones"], match: ["charcoal", "midnight", "espresso", "black", "smoked"] },
    { terms: ["light colors", "light colours", "light furniture", "light tones"], match: ["natural", "ivory", "white", "linen"] },
  ].find(({ terms }) => includesAny(text, terms));
  if (colorBrowse) {
    const picks = allProducts.filter((p) =>
      p.colors?.some((c) => colorBrowse.match.some((m) => c.name.toLowerCase().includes(m)))
    );
    if (picks.length > 0) {
      return {
        reply:
          "Here are pieces available in that tone:\n\n" +
          picks.map((p) => `- ${productLine(p)}`).join("\n"),
        suggestions: toSuggestions(picks),
      };
    }
  }

  // 11. Style-based recommendation — "I like modern style"
  if (includesAny(text, ["modern", "contemporary"]) && includesAny(text, ["style", "like", "prefer", "recommend", "home"])) {
    const picks = allProducts
      .filter((p) => p.specifications?.style?.toLowerCase().includes("modern"))
      .slice(0, 4);
    return {
      reply:
        "For a modern home, I'd point you toward pieces with clean lines and a sculptural quality rather than ornate detailing:\n\n" +
        picks.map((p) => `- ${productLine(p)}`).join("\n") +
        "\n\nThese pair well together if you want a cohesive look across rooms.",
      suggestions: toSuggestions(picks),
    };
  }

  // 12. Luxury bedroom — multi-item recommendation
  if (
    includesAny(text, ["bedroom"]) &&
    includesAny(text, ["luxury", "furnish", "decorate", "recommend", "need furniture", "set up"])
  ) {
    const bed = allProducts.find((p) => p.category === "Bedroom" && p.price > 3000);
    const nightstand = allProducts.find((p) => p.id === "designer-nightstand-collection");
    const mirror = allProducts.find((p) => p.id === "lumina-console-table");
    const picks = [bed, nightstand, mirror].filter((p): p is Product => Boolean(p));
    return {
      reply:
        "For a true luxury bedroom, I'd build the room around three anchors:\n\n" +
        picks.map((p) => `- ${productLine(p)}`).join("\n") +
        "\n\nStart with the bed as the focal point, flank it with the nightstands for symmetry and warm task lighting, then use the console with its backlit mirror near the entry or dressing area to tie the room together.",
      suggestions: toSuggestions(picks),
    };
  }

  // 13. Room-based browsing via quick actions ("Living Room", "Bedroom", "Dining")
  if (/^living room$/.test(text) || (includesAny(text, ["living room", "living space"]) && !includesAny(text, ["bedroom", "dining"]))) {
    const picks = pickRoomRecommendations("living");
    return {
      reply:
        "Here's what we have for the living room — from sofas built for everyday life to sculptural accent pieces and entryway consoles:\n\n" +
        picks.map((p) => `- ${productLine(p)}`).join("\n"),
      suggestions: toSuggestions(picks),
    };
  }
  if (/^bedroom$/.test(text) || (includesAny(text, ["bedroom"]) && !includesAny(text, ["living", "dining"]))) {
    const picks = pickRoomRecommendations("bedroom");
    return {
      reply:
        "Our bedroom collection centers on quiet, tailored comfort:\n\n" +
        picks.map((p) => `- ${productLine(p)}`).join("\n"),
      suggestions: toSuggestions(picks),
    };
  }
  if (/^dining$/.test(text) || includesAny(text, ["dining room", "dining table", "dining set"])) {
    const picks = pickRoomRecommendations("dining");
    return {
      reply:
        "For dining, our signature piece is:\n\n" +
        picks.map((p) => `- ${productLine(p)}`).join("\n") +
        "\n\nWant details on dimensions, seating capacity, or materials?",
      suggestions: toSuggestions(picks),
    };
  }

  // 13b. Location / showroom
  if (
    includesAny(text, ["where are you located", "showroom", "office", "address", "where is your store", "where can i visit", "your location", "physical store"])
  ) {
    return {
      reply:
        "Aurelian is an online luxury furniture brand with nationwide delivery across Pakistan. Our flagship showroom is located in Lahore, where you're welcome to see select pieces in person — in the meantime, I'm happy to walk you through any product here in chat, including materials, dimensions, and colorways.",
      suggestions: [],
    };
  }

  // 13c. General help / support request
  if (
    matchesWord(text, ["help", "support"]) &&
    !includesAny(text, ["warranty", "deliver", "return", "refund", "payment", "material"])
  ) {
    return {
      reply:
        "I'd be happy to help!\n\nI can help you with:\n\n- Furniture recommendations\n- Interior design ideas\n- Bedroom furniture\n- Living room furniture\n- Dining furniture\n- Materials and colors\n- Product sizes\n- Delivery\n- Warranty\n- Returns\n\nWhat would you like to explore?",
      suggestions: [],
    };
  }

  // 13d. Mirror recommendation
  if (includesAny(text, ["mirror"])) {
    const mirrorProduct = allProducts.find((p) => p.id === "lumina-console-table");
    return {
      reply: mirrorProduct
        ? `Our signature mirror piece is the **${mirrorProduct.name}** — ${formatPrice(
            mirrorProduct.price
          )}. It pairs a fluted console table with a backlit, freeform mirror, available as a standalone console or the full Console + Mirror Set. It's a stunning entryway statement and works beautifully in a foyer or dressing area.`
        : "Let me check our mirror options for you.",
      suggestions: mirrorProduct ? toSuggestions([mirrorProduct]) : [],
    };
  }

  // 13e. Furniture-type recommendation — "I need a sofa" / "I need a bed"
  const furnitureTypeRequest = [
    { terms: ["i need a sofa", "i want a sofa", "need a sofa", "looking for a sofa"], category: "Living", noun: "sofa", nameKeywords: ["sofa", "lounge"] },
    { terms: ["i need a bed", "i want a bed", "need a bed", "looking for a bed"], category: "Bedroom", noun: "bed", nameKeywords: ["bed"] },
    { terms: ["i need a table", "i want a table", "need a dining table", "looking for a table"], category: "Dining", noun: "table", nameKeywords: ["table"] },
    { terms: ["i need a chair", "i want a chair", "looking for a chair"], category: "Living", noun: "chair", nameKeywords: ["chair"] },
  ].find(({ terms }) => includesAny(text, terms));
  if (furnitureTypeRequest) {
    const nameMatches = allProducts.filter((p) =>
      furnitureTypeRequest.nameKeywords.some((kw) => p.name.toLowerCase().includes(kw))
    );
    const finalPicks =
      nameMatches.length > 0 ? nameMatches : findProductsByCategory(furnitureTypeRequest.category);
    return {
      reply:
        `Here's what I'd suggest for a ${furnitureTypeRequest.noun}:\n\n` +
        finalPicks.map((p) => `- ${productLine(p)}`).join("\n") +
        "\n\nWant more detail on any of these — materials, colors, or sizing?",
      suggestions: toSuggestions(finalPicks),
    };
  }

  // 13f. Budget-based recommendation — "under $1000", "around $5000"
  const budgetMatch = text.match(/(?:under|below|less than|around|about|up to)\s*\$?\s*(\d{3,6})/);
  if (budgetMatch) {
    const budget = parseInt(budgetMatch[1], 10);
    const isApprox = /around|about/.test(text);
    const withinBudget = isApprox
      ? allProducts.filter((p) => Math.abs(p.price - budget) <= budget * 0.25)
      : allProducts.filter((p) => p.price <= budget);
    const sorted = [...withinBudget].sort((a, b) => b.price - a.price).slice(0, 4);
    return {
      reply:
        sorted.length > 0
          ? `Here's what fits ${isApprox ? `around ${formatPrice(budget)}` : `under ${formatPrice(budget)}`}:\n\n` +
            sorted.map((p) => `- ${productLine(p)}`).join("\n")
          : `I don't have pieces ${isApprox ? "around" : "under"} ${formatPrice(
              budget
            )} at the moment — our most accessible piece is ${productLine(
              [...allProducts].sort((a, b) => a.price - b.price)[0]
            )}.`,
      suggestions: toSuggestions(sorted.length > 0 ? sorted : [[...allProducts].sort((a, b) => a.price - b.price)[0]]),
    };
  }

  // 13g. Payment methods
  if (
    matchesWord(text, ["cod", "visa", "mastercard"]) ||
    includesAny(text, [
      "cash on delivery",
      "credit card",
      "debit card",
      "installment",
      "installments",
      "payment method",
      "how can i pay",
      "how do i pay",
      "payment option",
    ])
  ) {
    return {
      reply:
        "We accept several payment options:\n\n- Cash on Delivery (COD)\n- Credit card (Visa, Mastercard)\n- Debit card\n- Installment plans on select high-value pieces\n\nLet me know if you'd like details on installment eligibility for a specific item.",
      suggestions: [],
    };
  }

  // 13h. Coupons / discounts — reference the real demo voucher catalog
  if (includesAny(text, ["discount", "voucher", "coupon", "promo code", "promo"])) {
    const demoCodes = ["WELCOME10", "AURELIAN15", "VIP25", "FREEDELIVERY"]
      .map((code) => findCoupon(code))
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
    return {
      reply:
        demoCodes.length > 0
          ? "We do have a few active offers you can apply at checkout:\n\n" +
            demoCodes.map((c) => `- **${c.code}** — ${c.label}`).join("\n") +
            "\n\nJust enter the code in the voucher field in your cart."
          : "I don't see any active promo codes right now, but keep an eye on your cart — eligible offers will show up in the voucher field at checkout.",
      suggestions: [],
    };
  }

  // 13i. AI Room Recommendation — honest about current scope, no invented feature
  if (
    includesAny(text, [
      "decorate my room",
      "upload my room",
      "upload a photo",
      "room photo",
      "ai recommend furniture",
      "ai room",
      "scan my room",
      "photo of my room",
    ])
  ) {
    return {
      reply:
        "That's a great idea, and not something we offer just yet — there's no photo-upload room scanning here at the moment. What I can do right now is recommend furniture based on how you describe your space: tell me the room, its rough size, your style (modern, classic, minimalist), and any colors you're working with, and I'll put together a tailored set of suggestions from our catalog.",
      suggestions: [],
    };
  }

  // 13j. Product availability / stock
  if (includesAny(text, ["in stock", "out of stock", "is this available", "is it available", "availability"])) {
    const topicForStock = inferConversationTopic(history);
    const productInQuestion = topicForStock.product ?? mentioned[0];
    return {
      reply: productInQuestion
        ? `**${productInQuestion.name}** is currently available to order, with delivery in line with the timelines I mentioned earlier — most pieces ship within a few weeks depending on the configuration you choose. Would you like help picking a size or color?`
        : "Our full catalog is available to order. Let me know which piece you're asking about and I can confirm details for that specific item.",
      suggestions: productInQuestion ? toSuggestions([productInQuestion]) : [],
    };
  }

  // 13k. Product dimensions — including memory of the last-discussed product
  if (includesAny(text, ["dimensions", "size", "width", "height", "depth", "how big", "how large"])) {
    const topicForDimensions = inferConversationTopic(history);
    const productForDimensions = topicForDimensions.product ?? mentioned[0];
    if (productForDimensions?.dimensions) {
      return {
        reply: `**${productForDimensions.name}** measures ${productForDimensions.dimensions.width} wide × ${productForDimensions.dimensions.height} tall × ${productForDimensions.dimensions.depth} deep.${
          productForDimensions.sizes?.length
            ? ` It's also available in these size options: ${productForDimensions.sizes.join(", ")}.`
            : ""
        }`,
        suggestions: toSuggestions([productForDimensions]),
      };
    }
  }


  if (/^recommendations?$/.test(text) || (includesAny(text, ["recommend", "suggest"]) && text.length < 60)) {
    const picks = [
      allProducts.find((p) => p.id === "aurelian-lounge-sofa"),
      allProducts.find((p) => p.id === "platform-bed-frame"),
      allProducts.find((p) => p.id === "calacatta-dining-table"),
    ].filter((p): p is Product => Boolean(p));
    return {
      reply:
        "Here are a few of our most-loved pieces across the collection:\n\n" +
        picks.map((p) => `- ${productLine(p)}`).join("\n") +
        "\n\nTell me a bit about the room you're styling and I can narrow this down further.",
      suggestions: toSuggestions(picks),
    };
  }

  // 15. Sofa / seating general question
  if (includesAny(text, ["sofa", "couch", "loveseat", "sectional"])) {
    const picks = allProducts.filter((p) => p.category === "Living" && p.materials);
    return {
      reply:
        "For seating, our two standout pieces are the **Aurelian Lounge Sofa** — a classic three-seat silhouette in linen with nailhead trim, available as a 2-Seater, 3-Seater, or full L-Shape — and the **Sculptural Accent Chair**, a cocoon-shaped bouclé chair that works beautifully as a complement or a statement piece on its own.",
      suggestions: toSuggestions(picks.slice(0, 2)),
    };
  }

  // 16. Price / budget questions
  if (includesAny(text, ["price", "cost", "budget", "expensive", "cheap", "affordable"])) {
    const cheapest = [...allProducts].sort((a, b) => a.price - b.price).slice(0, 3);
    return {
      reply:
        "Our pieces range from " +
        formatPrice(Math.min(...allProducts.map((p) => p.price))) +
        " for accent furniture up to " +
        formatPrice(Math.max(...allProducts.map((p) => p.price))) +
        " for statement pieces like our marble dining table. If you'd like to stay toward the accessible end, I'd start with:\n\n" +
        cheapest.map((p) => `- ${productLine(p)}`).join("\n"),
      suggestions: toSuggestions(cheapest),
    };
  }

  // 17. Thanks / closing
  if (includesAny(text, ["thank", "thanks", "appreciate"])) {
    return {
      reply:
        "You're very welcome! If anything else comes to mind — sizing, styling, delivery timing — I'm right here.",
      suggestions: [],
    };
  }

  // 18. Fallback — try to ground in something from history, else rotate through varied prompts
  const topic = inferConversationTopic(history);
  const lastAssistant = [...history].reverse().find((m) => m.role === "assistant");
  if (lastAssistant && includesAny(text, ["yes", "sure", "please", "okay", "ok"])) {
    if (topic.product) {
      return {
        reply: `Great — would you like more detail on the **${topic.product.name}**, such as colors, sizing, or delivery?`,
        suggestions: toSuggestions([topic.product]),
      };
    }
    return {
      reply:
        "Wonderful — could you tell me a little more, like the room it's for or a style you're drawn to? That'll help me point you to the right piece.",
      suggestions: [],
    };
  }

  return {
    reply: pickFallbackResponse(raw, fallbackCountSoFar),
    suggestions: [],
  };
}
