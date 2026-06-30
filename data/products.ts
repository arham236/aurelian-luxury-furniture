export type ProductColor = {
  name: string;
  /** Hex swatch value used for the selectable color dot. */
  hex: string;
};

export type ProductDimensions = {
  width: string;
  height: string;
  depth: string;
};

export type ProductSpecifications = {
  material: string;
  finish: string;
  collection: string;
  style: string;
  sku: string;
};

export type Product = {
  id: string;
  /** URL-safe slug for /products/[slug]. Defaults to `id` (already kebab-case) when omitted. */
  slug?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  aspect: "square" | "portrait" | "tall";
  tag?: string;
  /** Full gallery for the product detail page. Falls back to [image] when omitted. */
  images?: string[];
  dimensions?: ProductDimensions;
  materials?: string[];
  colors?: ProductColor[];
  sizes?: string[];
  features?: string[];
  warranty?: string;
  care?: string[];
  delivery?: string;
  specifications?: ProductSpecifications;
};

export const featuredProducts: Product[] = [
  {
    id: "aurelian-lounge-sofa",
    slug: "aurelian-lounge-sofa",
    name: "The Aurelian Lounge Sofa",
    description:
      "A linen-upholstered three-seat sofa with classic nailhead trim, paired here with a reclaimed-wood coffee table for an heirloom living room feel.",
    price: 4200,
    category: "Living",
    image: "/images/living-room-2.jpg",
    aspect: "square",
    images: [
      "/images/living-room-2.jpg",
      "/images/living-room-1.jpg",
      "/images/accent-chair.jpg",
    ],
    dimensions: { width: '84"', height: '32"', depth: '38"' },
    materials: ["Solid Oak Frame", "Premium Linen Upholstery", "Brass Nailhead Trim"],
    colors: [
      { name: "Natural Linen", hex: "#E5DFD3" },
      { name: "Dove Grey", hex: "#B9B5AC" },
      { name: "Charcoal", hex: "#3A3835" },
    ],
    sizes: ["2 Seater", "3 Seater", "L Shape"],
    features: [
      "Solid Oak Frame",
      "Premium Linen Upholstery",
      "Hand-Applied Nailhead Trim",
      "Handcrafted",
    ],
    warranty: "Lifetime structural warranty on the frame; 5-year warranty on upholstery and cushioning.",
    care: [
      "Vacuum upholstery weekly with a soft brush attachment.",
      "Blot spills immediately with a clean, dry cloth.",
      "Professionally clean fabric every 12–18 months.",
      "Keep out of direct, prolonged sunlight to prevent fading.",
    ],
    delivery:
      "White glove delivery and assembly included. Estimated delivery in 6–8 weeks, with placement and packaging removal handled by our in-home team.",
    specifications: {
      material: "Solid Oak / Linen",
      finish: "Natural Linen",
      collection: "Atelier Living",
      style: "Classic Heirloom",
      sku: "AUR-SOF-001",
    },
  },
  {
    id: "sculptural-accent-chair",
    slug: "sculptural-accent-chair",
    name: "Sculptural Accent Chair",
    description:
      "A cocoon-shaped bouclé lounge chair with a sculptural, fluid silhouette — the centerpiece of any reading corner or quiet nook.",
    price: 1850,
    category: "Living",
    image: "/images/accent-chair.jpg",
    aspect: "portrait",
    images: [
      "/images/accent-chair.jpg",
      "/images/reading-nook.jpg",
      "/images/living-room-1.jpg",
    ],
    dimensions: { width: '38"', height: '30"', depth: '34"' },
    materials: ["Molded Birch Frame", "Italian Bouclé Fabric", "Walnut Accent Table"],
    colors: [
      { name: "Ivory Bouclé", hex: "#EDE7DC" },
      { name: "Oat", hex: "#D9CBB5" },
      { name: "Stone", hex: "#C2BCAE" },
    ],
    sizes: ["Standard", "Wide"],
    features: [
      "Sculptural Molded Frame",
      "Premium Bouclé Fabric",
      "Walnut Side Table Included",
      "Handcrafted",
    ],
    warranty: "3-year warranty on frame and foam structure; 2-year warranty on fabric.",
    care: [
      "Brush bouclé fabric gently in the direction of the weave.",
      "Spot clean with a mild, water-based upholstery cleaner.",
      "Rotate cushions monthly to maintain even wear.",
      "Avoid direct heat sources to preserve fabric texture.",
    ],
    delivery:
      "White glove delivery and assembly included. Estimated delivery in 4–6 weeks.",
    specifications: {
      material: "Bouclé / Birch",
      finish: "Ivory Bouclé",
      collection: "Atelier Living",
      style: "Sculptural Modern",
      sku: "AUR-CHR-002",
    },
  },
  {
    id: "platform-bed-frame",
    slug: "platform-bed-frame",
    name: "Minimalist Platform Bed",
    description:
      "A channel-tufted upholstered platform bed in soft neutral linen, framed by fluted oak nightstands and warm brass sconces.",
    price: 3100,
    category: "Bedroom",
    image: "/images/platform-bed.jpg",
    aspect: "square",
    images: [
      "/images/platform-bed.jpg",
      "/images/master-bedroom.jpg",
      "/images/bedroom-neutral.jpg",
    ],
    dimensions: { width: '76"', height: '42"', depth: '86"' },
    materials: ["Solid Oak Frame", "Channel-Tufted Linen Upholstery", "Brass Hardware"],
    colors: [
      { name: "Soft Linen", hex: "#E3DCCE" },
      { name: "Greige", hex: "#C9C2B4" },
      { name: "Espresso", hex: "#4A3F35" },
    ],
    sizes: ["Queen", "King", "California King"],
    features: [
      "Channel-Tufted Headboard",
      "Solid Oak Frame",
      "Low-Profile Silhouette",
      "Handcrafted",
    ],
    warranty: "Lifetime structural warranty on the frame; 5-year warranty on upholstery.",
    care: [
      "Vacuum the upholstered headboard weekly.",
      "Blot any spills immediately; avoid soaking the fabric.",
      "Tighten frame fittings every 6 months.",
      "Use a mattress protector to preserve frame upholstery.",
    ],
    delivery:
      "White glove delivery and full assembly included. Estimated delivery in 6–8 weeks.",
    specifications: {
      material: "Solid Oak / Linen",
      finish: "Soft Linen",
      collection: "Atelier Bedroom",
      style: "Minimalist Modern",
      sku: "AUR-BED-003",
    },
  },
  {
    id: "calacatta-dining-table",
    slug: "calacatta-dining-table",
    name: "Calacatta Dining Table",
    description:
      "An oval marble-top dining table on a fluted brass pedestal base, photographed at dusk against a glittering city skyline.",
    price: 6500,
    category: "Dining",
    image: "/images/dining-table.jpg",
    aspect: "portrait",
    images: ["/images/dining-table.jpg", "/images/dining-room.jpg"],
    dimensions: { width: '94"', height: '30"', depth: '42"' },
    materials: ["Calacatta Marble Top", "Fluted Brass Pedestal Base"],
    colors: [
      { name: "Calacatta White", hex: "#EDEAE3" },
      { name: "Brass Base", hex: "#A9802F" },
    ],
    sizes: ["6-Seat", "8-Seat", "10-Seat"],
    features: [
      "Italian Marble",
      "Fluted Brass Pedestal Base",
      "Hand-Polished Edges",
      "Handcrafted",
    ],
    warranty: "Lifetime warranty on the brass base; 2-year warranty on the marble top against structural defects.",
    care: [
      "Seal marble top annually to prevent staining.",
      "Wipe spills immediately, especially acidic liquids like wine or citrus.",
      "Use coasters and placemats to protect the marble surface.",
      "Polish brass base with a dry, soft cloth.",
    ],
    delivery:
      "White glove delivery and assembly included. Estimated delivery in 8–10 weeks due to natural stone sourcing.",
    specifications: {
      material: "Calacatta Marble / Brass",
      finish: "Polished Marble",
      collection: "Atelier Dining",
      style: "Modern Italian",
      sku: "AUR-DIN-004",
    },
  },
];

export const newArrivals: Product[] = [
  {
    id: "solstice-reading-lounge",
    slug: "solstice-reading-lounge",
    name: "Solstice Reading Lounge",
    description:
      "An oversized round lounge chair styled for slow mornings — deep cushioning, a herringbone throw, and a rattan side table within reach.",
    price: 2400,
    category: "Living",
    image: "/images/reading-nook.jpg",
    aspect: "tall",
    tag: "LIVING",
    images: [
      "/images/reading-nook.jpg",
      "/images/accent-chair.jpg",
      "/images/living-room-2.jpg",
    ],
    dimensions: { width: '52"', height: '34"', depth: '52"' },
    materials: ["Kiln-Dried Hardwood Frame", "Premium Boucle & Linen Blend", "Rattan Side Table"],
    colors: [
      { name: "Oatmeal", hex: "#DCD2C0" },
      { name: "Sage", hex: "#9CA083" },
      { name: "Clay", hex: "#B9836A" },
    ],
    sizes: ["Standard", "Wide"],
    features: [
      "Oversized Cocoon Silhouette",
      "Premium Fabric Blend",
      "Hand-Tied Spring Suspension",
      "Handcrafted",
    ],
    warranty: "3-year warranty on frame and cushioning.",
    care: [
      "Fluff and rotate cushions weekly to maintain shape.",
      "Spot clean fabric with a mild upholstery cleaner.",
      "Keep rattan accents away from prolonged direct sunlight.",
      "Vacuum upholstery with a soft brush attachment.",
    ],
    delivery: "White glove delivery and assembly included. Estimated delivery in 4–6 weeks.",
    specifications: {
      material: "Boucle / Hardwood",
      finish: "Oatmeal",
      collection: "Atelier Living",
      style: "Relaxed Modern",
      sku: "AUR-LNG-005",
    },
  },
  {
    id: "velvet-king-bed",
    slug: "velvet-king-bed",
    name: "Velvet King Bed",
    description:
      "A channel-tufted velvet-look king bed beneath a crystal chandelier, flanked by black-lacquer and brass nightstands.",
    price: 5200,
    category: "Bedroom",
    image: "/images/luxury-bedroom-1.jpg",
    aspect: "portrait",
    images: [
      "/images/luxury-bedroom-1.jpg",
      "/images/master-bedroom.jpg",
      "/images/bedroom-neutral.jpg",
    ],
    dimensions: { width: '80"', height: '50"', depth: '88"' },
    materials: ["Solid Hardwood Frame", "Velvet-Look Performance Fabric", "Brass Hardware"],
    colors: [
      { name: "Taupe Velvet", hex: "#B7A99A" },
      { name: "Midnight", hex: "#23211F" },
      { name: "Champagne", hex: "#D8C6A1" },
    ],
    sizes: ["Queen", "King", "California King"],
    features: [
      "Channel-Tufted Headboard",
      "Premium Performance Velvet",
      "Solid Hardwood Frame",
      "Handcrafted",
    ],
    warranty: "Lifetime structural warranty on the frame; 5-year warranty on upholstery.",
    care: [
      "Brush velvet-look fabric gently with a soft-bristle brush.",
      "Blot spills immediately; never rub the fabric.",
      "Avoid placing in direct, prolonged sunlight to prevent fading.",
      "Tighten frame fittings every 6 months.",
    ],
    delivery: "White glove delivery and full assembly included. Estimated delivery in 6–8 weeks.",
    specifications: {
      material: "Velvet-Look Fabric / Hardwood",
      finish: "Taupe Velvet",
      collection: "Atelier Bedroom",
      style: "Opulent Modern",
      sku: "AUR-BED-006",
    },
  },
  {
    id: "lumina-console-table",
    slug: "lumina-console-table",
    name: "Lumina Console Table",
    description:
      "A fluted console table beneath a backlit, freeform mirror — the ideal entryway statement, finished with a velvet pouf.",
    price: 1650,
    category: "Living",
    image: "/images/luxury-mirror.jpg",
    aspect: "portrait",
    images: ["/images/luxury-mirror.jpg", "/images/living-room-1.jpg"],
    dimensions: { width: '48"', height: '32"', depth: '16"' },
    materials: ["Fluted Oak Veneer", "Marble Top", "Integrated LED Backlighting"],
    colors: [
      { name: "Natural Oak", hex: "#C9A876" },
      { name: "Smoked Oak", hex: "#6B5642" },
      { name: "Ivory Marble", hex: "#EDE8DE" },
    ],
    sizes: ["Standard", "Console + Mirror Set"],
    features: [
      "Fluted Oak Detailing",
      "Marble Top",
      "Integrated Ambient Lighting",
      "Handcrafted",
    ],
    warranty: "3-year warranty on construction and finish; 1-year warranty on integrated lighting.",
    care: [
      "Dust fluted detailing weekly with a soft, dry cloth.",
      "Wipe the marble top with a damp cloth and mild soap.",
      "Avoid abrasive cleaners on the oak veneer.",
      "Unplug lighting before cleaning near electrical components.",
    ],
    delivery: "White glove delivery and assembly included. Estimated delivery in 4–6 weeks.",
    specifications: {
      material: "Oak Veneer / Marble",
      finish: "Natural Oak",
      collection: "Atelier Living",
      style: "Sculptural Entryway",
      sku: "AUR-CNS-007",
    },
  },
  {
    id: "designer-nightstand-collection",
    slug: "designer-nightstand-collection",
    name: "Designer Nightstand Collection",
    description:
      "Fluted oak nightstands with brass hardware, shown bedside with linen-shade lamps for a warm, tailored finish.",
    price: 980,
    category: "Bedroom",
    image: "/images/platform-bed.jpg",
    aspect: "square",
    tag: "BEDROOM",
    images: [
      "/images/platform-bed.jpg",
      "/images/bedroom-neutral.jpg",
      "/images/master-bedroom.jpg",
    ],
    dimensions: { width: '24"', height: '26"', depth: '18"' },
    materials: ["Fluted Solid Oak", "Brass Hardware", "Soft-Close Drawer Glides"],
    colors: [
      { name: "Natural Oak", hex: "#C9A876" },
      { name: "Walnut", hex: "#5C4632" },
      { name: "White Oak", hex: "#DFD3BC" },
    ],
    sizes: ["Single Nightstand", "Pair Set"],
    features: [
      "Fluted Solid Oak Construction",
      "Soft-Close Drawer Glides",
      "Brass Hardware",
      "Handcrafted",
    ],
    warranty: "5-year warranty on construction and hardware.",
    care: [
      "Dust regularly with a soft, dry cloth.",
      "Use coasters under drinks to protect the oak finish.",
      "Avoid prolonged exposure to direct sunlight.",
      "Polish brass hardware periodically with a dry cloth.",
    ],
    delivery: "White glove delivery and assembly included. Estimated delivery in 3–5 weeks.",
    specifications: {
      material: "Solid Oak / Brass",
      finish: "Natural Oak",
      collection: "Atelier Bedroom",
      style: "Minimalist Modern",
      sku: "AUR-NST-008",
    },
  },
];

export type Category = {
  id: string;
  label: string;
  title: string;
  description?: string;
  image: string;
  span: "lg" | "md" | "sm";
};

export const categories: Category[] = [
  {
    id: "beds",
    label: "Bedroom",
    title: "Beds & Frames",
    image: "/images/master-bedroom.jpg",
    span: "lg",
  },
  {
    id: "sofas",
    label: "Living",
    title: "Sofas & Sectionals",
    image: "/images/living-room-1.jpg",
    span: "md",
  },
  {
    id: "dining",
    label: "Dining Room",
    title: "Dining Sets",
    image: "/images/dining-room.jpg",
    span: "md",
  },
  {
    id: "chairs",
    label: "Accent & Lounge",
    title: "Chairs",
    image: "/images/accent-chair.jpg",
    span: "sm",
  },
  {
    id: "console",
    label: "Console Tables",
    title: "Entryway",
    image: "/images/luxury-mirror.jpg",
    span: "sm",
  },
];

/** Every product across Featured Collection and New Arrivals, in one place for lookups. */
export const allProducts: Product[] = [...featuredProducts, ...newArrivals];

/** Resolves a product's URL slug, falling back to its id when no explicit slug is set. */
export function getProductSlug(product: Product): string {
  return product.slug ?? product.id;
}

/** Looks up a single product by its URL slug. Returns undefined when no match is found. */
export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((product) => getProductSlug(product) === slug);
}

/**
 * Returns up to `limit` other products to show as "Related Products" —
 * prioritizing same-category matches, then filling any remaining slots with
 * other products so the section is never sparse.
 */
export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const others = allProducts.filter((p) => p.id !== product.id);
  const sameCategory = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Margot Sinclair",
    role: "Interior Architect, London",
    quote:
      "Every piece feels considered down to the millimeter. Aurelian doesn't just furnish a room — it completes the architecture of it.",
    rating: 5,
    avatar: "/images/avatar-1.svg",
  },
  {
    id: "t2",
    name: "Julian Cross",
    role: "Homeowner, Aspen",
    quote:
      "The white glove delivery alone was worth it. But it's the craftsmanship that keeps me coming back for every new room.",
    rating: 5,
    avatar: "/images/avatar-2.svg",
  },
  {
    id: "t3",
    name: "Elena Whitfield",
    role: "Creative Director, Milan",
    quote:
      "Quiet, confident, timeless. I have never had a piece of furniture stop a dinner party conversation the way the Calacatta table does.",
    rating: 5,
    avatar: "/images/avatar-3.svg",
  },
];

export const valueProps = [
  {
    icon: "diamond",
    title: "Premium Quality",
    description:
      "Materials sourced globally for uncompromising durability and aesthetic perfection.",
  },
  {
    icon: "truck",
    title: "White Glove Delivery",
    description:
      "Expert placement and assembly in your home, removing all packaging materials.",
  },
  {
    icon: "shield",
    title: "Lifetime Warranty",
    description:
      "We stand behind the craftsmanship of every piece with a comprehensive guarantee.",
  },
  {
    icon: "leaf",
    title: "Sustainable Practice",
    description:
      "Committed to ethical sourcing and environmentally responsible manufacturing.",
  },
];
