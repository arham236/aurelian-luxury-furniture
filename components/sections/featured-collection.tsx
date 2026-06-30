import Reveal from "@/components/ui/reveal";
import ProductCard from "@/components/ui/product-card";
import Button from "@/components/ui/button";
import { featuredProducts } from "@/data/products";

const offsets: Array<"none" | "sm" | "md" | "lg"> = ["lg", "none", "none", "sm"];

export default function FeaturedCollection() {
  return (
    <section id="shop" className="bg-surface-container-low py-32">
      <div className="mx-auto max-w-[1440px] px-margin-mobile md:px-margin-desktop">
        <Reveal className="mb-16 text-center">
          <h2 className="mb-4 text-headline-lg text-primary">
            Featured Collection
          </h2>
          <p className="mx-auto max-w-xl text-on-surface-variant">
            Our most celebrated designs, characterized by uncompromising
            quality and timeless silhouettes.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-gutter sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product, i) => (
            <Reveal key={product.id} variant="fade-up" delay={i * 0.08}>
              <ProductCard product={product} offset={offsets[i] ?? "none"} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 text-center">
          <Button href="#new-arrivals" variant="secondary" size="lg">
            View Complete Collection
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
