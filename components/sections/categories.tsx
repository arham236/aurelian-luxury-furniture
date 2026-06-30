import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import { categories } from "@/data/products";

const spanClass: Record<string, string> = {
  lg: "md:col-span-8",
  md: "md:col-span-4",
  sm: "md:col-span-3",
};

export default function Categories() {
  const [beds, sofas, dining, chairs, office] = categories;

  return (
    <section
      id="collections"
      className="mx-auto max-w-[1440px] px-margin-mobile py-32 md:px-margin-desktop"
    >
      <Reveal className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
        <div>
          <h2 className="mb-4 text-headline-lg text-primary">Curated Spaces</h2>
          <p className="max-w-md text-on-surface-variant">
            Discover pieces designed to elevate every corner of your home,
            blending architectural precision with organic warmth.
          </p>
        </div>
        <Link
          href="#shop"
          className="inline-flex items-center gap-2 border-b border-primary pb-1 text-label-caps text-primary transition-colors hover:border-secondary hover:text-secondary"
        >
          View All Categories <ArrowRight size={16} />
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12 md:auto-rows-[400px] auto-rows-[300px]">
        <Reveal as="div" variant="scale" className={spanClass.lg}>
          <ImageCategoryCard category={beds} />
        </Reveal>
        <Reveal as="div" variant="scale" delay={0.1} className={spanClass.md}>
          <ImageCategoryCard category={sofas} />
        </Reveal>
        <Reveal as="div" variant="scale" delay={0.05} className={spanClass.md}>
          <ImageCategoryCard category={dining} />
        </Reveal>
        <Reveal as="div" variant="fade-up" className={spanClass.sm}>
          <ImageCategoryCard category={chairs} />
        </Reveal>
        <Reveal as="div" variant="fade-up" delay={0.1} className={spanClass.sm}>
          <ImageCategoryCard category={office} />
        </Reveal>
      </div>
    </section>
  );
}

function ImageCategoryCard({
  category,
}: {
  category: (typeof categories)[number];
}) {
  return (
    <Link
      href="#shop"
      className="group relative isolate block h-full overflow-hidden rounded-[32px] border border-white/20 bg-surface-container-high shadow-level-2"
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/45 to-transparent transition-opacity group-hover:opacity-80" />
      <Image
        src={category.image}
        alt={category.title}
        fill
        sizes="(max-width: 768px) 100vw, 60vw"
        className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute bottom-8 left-8 z-20">
        <span className="mb-3 inline-block rounded-full bg-surface-bright/80 px-4 py-2 text-label-caps text-primary backdrop-blur">
          {category.label}
        </span>
        <h3 className="text-display-md text-white">{category.title}</h3>
      </div>
    </Link>
  );
}
