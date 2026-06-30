# Aurelian — Luxury Furniture Experience

A production-ready, Apple-level luxury furniture website built with Next.js 15, featuring an immersive 3D hero, scroll-driven storytelling, and a fully responsive quiet-luxury design system.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8) ![React Three Fiber](https://img.shields.io/badge/React%20Three%20Fiber-9-orange)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (CSS-first `@theme` design tokens) |
| 3D | React Three Fiber + drei |
| Scroll animation | GSAP + ScrollTrigger |
| UI animation | Framer Motion |
| Smooth scroll | Lenis (bridged to GSAP's ScrollTrigger) |
| Icons | lucide-react |
| Fonts | Playfair Display (display) + Inter (body), self-hosted via `@fontsource` |

No backend, database, or CMS is included — product, category, and testimonial content lives in `data/products.ts` as static, fully-typed data so it's trivial to wire up to a real API or CMS later.

> **Fonts:** this project uses [`@fontsource`](https://fontsource.org/) packages instead of `next/font/google`. Both produce the same self-hosted, zero-runtime-request result, but `@fontsource` ships the font files as regular npm dependencies, so `npm run build` never needs to reach `fonts.googleapis.com` — useful in CI runners, offline builds, or restricted-network environments.

---

## Getting Started

**Requirements:** Node.js 18.18+ (Node 20 LTS recommended), npm 9+.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open http://localhost:3000
```

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the production build (run `build` first) |
| `npm run lint` | Run ESLint (flat config, Next.js + TypeScript rules) |

---

## Project Structure

```
aurelian/
├── app/
│   ├── layout.tsx          # Root layout: fonts, metadata, providers, navbar/footer shell
│   ├── page.tsx             # Homepage — composes all sections
│   ├── globals.css          # Tailwind v4 @theme design tokens (color, type, spacing, radius)
│   ├── robots.ts            # Dynamic robots.txt
│   ├── sitemap.ts           # Dynamic sitemap.xml
│   └── products/[slug]/
│       ├── page.tsx          # Product detail page (statically generated for every product)
│       └── not-found.tsx     # Custom 404 for invalid product slugs
│
├── components/
│   ├── layout/
│   │   ├── navbar.tsx                  # Floating glassmorphism nav, mobile menu, hide-on-scroll
│   │   ├── footer.tsx                  # Site footer
│   │   ├── loading-screen.tsx          # First-visit branded loading veil
│   │   ├── scroll-progress.tsx         # Fixed top scroll-progress bar
│   │   ├── mouse-glow.tsx              # Cursor-follow ambient light effect
│   │   └── smooth-scroll-provider.tsx  # Lenis instance + context, bridged to GSAP ScrollTrigger
│   │
│   ├── sections/
│   │   ├── hero.tsx                  # Fullscreen hero: headline + 3D showcase
│   │   ├── categories.tsx            # Bento-grid category navigation
│   │   ├── featured-collection.tsx   # Staggered luxury product grid
│   │   ├── new-arrivals.tsx          # Asymmetric "lookbook" grid
│   │   ├── why-choose-us.tsx         # Value propositions (quality, delivery, warranty, sustainability)
│   │   ├── testimonials.tsx          # Customer testimonials
│   │   └── newsletter.tsx            # Email signup
│   │
│   ├── three/
│   │   ├── hero-scene-loader.tsx   # Client-only dynamic import wrapper (code-splits three.js)
│   │   ├── hero-scene.tsx          # Canvas, lighting, responsive camera, perf safeguards
│   │   └── luxury-sofa.tsx         # Procedural sofa model (primitives, no external 3D assets)
│   │
│   └── ui/
│       ├── button.tsx               # Primary/secondary/text button variants
│       ├── product-card.tsx         # Reusable luxury product card (links to its PDP)
│       ├── reveal.tsx               # GSAP ScrollTrigger reveal-on-scroll wrapper
│       ├── product-gallery.tsx      # Large image + clickable thumbnail strip
│       ├── product-info.tsx         # Name/price/description/selectors/CTAs column
│       ├── color-selector.tsx       # Selectable color swatches
│       ├── size-selector.tsx        # Selectable size/configuration pills
│       ├── quantity-selector.tsx    # (–) qty (+) stepper (Product Detail Page)
│       ├── product-tabs.tsx         # Specifications / Dimensions / Delivery / Warranty / Care
│       ├── related-products.tsx     # "You May Also Like" — reuses ProductCard
│       ├── recently-viewed.tsx      # localStorage-backed "Recently Viewed" rail
│       └── record-recently-viewed.tsx  # Invisible client component that logs a PDP view
│
├── contexts/
│   └── cart-context.tsx   # Global cart state: items, coupon, totals, toasts, drawer open/close —
│                            # persisted to localStorage, exposed via the useCart() hook
│
├── components/cart/
│   ├── cart-drawer.tsx           # Right-side sliding drawer (focus trap, ESC/outside-click close)
│   ├── cart-item-row.tsx         # Single line item: image, name, color/size, stepper, subtotal
│   ├── cart-quantity-stepper.tsx # Compact (–) qty (+) stepper sized for drawer rows
│   ├── voucher-form.tsx          # Voucher code input + apply/remove + validation messaging
│   ├── billing-summary.tsx       # Subtotal / discount / shipping / tax / grand total
│   └── cart-toast.tsx            # "Added to cart" toast stack (View Cart / Continue Shopping)
│
├── data/
│   └── products.ts   # Typed static data: products (+ slug/images/colors/sizes/specs/etc.),
│                      # categories, testimonials, value props, and lookup helpers
│                      # (getProductBySlug, getRelatedProducts, allProducts)
│
├── hooks/
│   ├── use-mouse-position.ts      # Pointer tracking for the mouse-glow effect
│   ├── use-scroll-progress.ts     # Lenis-aware scroll progress (0–1)
│   └── use-recently-viewed.ts     # localStorage-persisted view history
│
├── lib/
│   ├── gsap.ts          # GSAP/ScrollTrigger registration + Lenis bridge
│   ├── utils.ts         # `cn()` class merge helper, price formatting
│   ├── cart-types.ts    # CartItem / AppliedCoupon / CartTotals type definitions
│   └── coupons.ts       # Demo voucher catalog + lookup (WELCOME10, AURELIAN15, VIP25, FREEDELIVERY)
│
└── public/
    ├── favicon.svg
    └── images/   # Real product/category photography (.jpg) + SVG testimonial avatars
```

### Product Detail Pages

Every product card in Featured Collection, New Arrivals, Related Products, and Recently
Viewed links to `/products/[slug]`, statically generated at build time via
`generateStaticParams` in `app/products/[slug]/page.tsx`. Add a new product by adding an
entry to `featuredProducts` or `newArrivals` in `data/products.ts` — the route, related
products, and recently-viewed tracking all work automatically with no further wiring.

### Shopping Cart

The cart is implemented as a single `CartProvider` (in `contexts/cart-context.tsx`) mounted
in the root layout, so `useCart()` is available anywhere in the app. It owns:

- **Items** — add/remove/increase/decrease/update/clear, each keyed by product + color + size
  so the same product in two different colors becomes two separate, independently-quantity-
  adjustable line items, while the same product/color/size combo simply increments quantity.
- **Coupons** — a small demo catalog in `lib/coupons.ts` (`WELCOME10`, `AURELIAN15`, `VIP25`,
  `FREEDELIVERY`). Swap this for a real API call when connecting to commerce infrastructure.
- **Totals** — subtotal, discount, shipping (free above $3,000 or with `FREEDELIVERY`), tax
  (placeholder, currently $0), and grand total, all derived via `useMemo` so every mutation
  recalculates instantly with no manual math anywhere in the UI.
- **Persistence** — items and the applied coupon are both written to `localStorage` on every
  change and rehydrated on mount, so a page refresh never loses the visitor's cart.
- **Toasts** — every `addToCart()` call queues a toast (auto-dismisses after 3s) with
  "View Cart" / "Continue Shopping" actions.

The drawer itself (`components/cart/cart-drawer.tsx`) is portaled to `document.body`, traps
focus while open, restores focus to the trigger on close, and closes on `Escape` or an
outside click.

---

## Design System

All design tokens (color, typography, spacing, radius, shadows) are defined once in `app/globals.css` using Tailwind v4's CSS-first `@theme` syntax — there is no separate `tailwind.config.js`. Update a token there and it propagates everywhere automatically (e.g. `--color-primary` powers `bg-primary`, `text-primary`, `border-primary`, etc.).

Key tokens:
- **Color** — a quiet-luxury neutral palette (`surface`, `on-surface`, `primary` = near-black, `secondary` = warm gold) following a Material-3-style role system.
- **Type** — `Playfair Display` for display/headline text, `Inter` for body text, exposed as `text-headline-xl`, `text-headline-lg`, `text-display-md`, `text-body-lg/md`, `text-label-caps` utility classes.
- **Radius / shadow** — `shadow-level-2` / `shadow-level-3` and `rounded-[24px]`-style values used consistently across cards, buttons, and inputs.

## Product Imagery

`public/images/` contains real product/lifestyle photography (`.jpg`) used across the Categories, Featured Collection, and New Arrivals sections, served through `next/image` with `fill` + `sizes` for responsive, lazy-loaded, automatically WebP/AVIF-negotiated delivery. Testimonial avatars remain lightweight generated SVGs (no real headshots were available) — swap these in `public/images/avatar-*.svg` or update the `avatar` field in `data/products.ts` when real customer photos are available.

To swap any product/category photo:
1. Drop the new file into `public/images/` and update the matching `image` field in `data/products.ts`.
2. Or point `image` fields directly at a CDN/remote URL — if doing so, add that domain to `images.remotePatterns` in `next.config.ts` so `next/image` can optimize it.

## 3D Scene Notes

The hero sofa is built entirely from primitive Three.js geometry (rounded boxes + cylinders) — no external `.glb`/`.gltf` assets to host or load. It's optimized to:
- Pause its render loop entirely via `IntersectionObserver` once scrolled out of view
- Cap device pixel ratio and disable MSAA on lower-core-count devices
- Disable drag-to-rotate on touch-primary devices so mobile visitors can scroll the page normally over the canvas (idle float/cursor-follow animation still plays for everyone)

---

## Deploying to Vercel

This project is zero-config on [Vercel](https://vercel.com) (the team behind Next.js).

### Option A — Git integration (recommended)
1. Push this project to a GitHub/GitLab/Bitbucket repository (see below).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset auto-detects as **Next.js** — leave build command (`next build`) and output settings as default.
4. Click **Deploy**. Every subsequent push to `main` redeploys automatically; pull requests get their own preview URLs.

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel        # first deploy — follow the prompts to link/create a project
vercel --prod # promote to production
```

No environment variables are required for the current build (no API keys, no database). If you later connect a CMS or backend, add the variables in **Project Settings → Environment Variables** on Vercel before deploying.

---

## Preparing for GitHub

```bash
git init
git add .
git commit -m "Initial commit: Aurelian luxury furniture site"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

`node_modules`, `.next`, and other build artifacts are already excluded via `.gitignore`.

---

## Browser Support

Targets the latest two versions of evergreen browsers (Chrome, Firefox, Safari, Edge) on both desktop and mobile. The 3D hero and scroll animations degrade gracefully:
- `prefers-reduced-motion` disables Lenis smooth scroll, GSAP reveals, and the mouse-glow effect.
- WebGL failures are caught by a `<Suspense>` boundary so a missing/blocked WebGL context never breaks the rest of the page.
