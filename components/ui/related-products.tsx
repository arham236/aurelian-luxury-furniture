import Reveal from "@/components/ui/reveal";
import ProductCard from "@/components/ui/product-card";
import type { Product } from "@/data/products";

type RelatedProductsProps = {
  products: Product[];
  title?: string;
};

/** Reuses the existing ProductCard grid pattern to surface related products on the PDP. */
export default function RelatedProducts({
  products,
  title = "You May Also Like",
}: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-outline-variant/40 py-20 md:py-28">
      <Reveal className="mb-12 text-center">
        <h2 className="text-headline-lg-mobile text-primary md:text-headline-lg">
          {title}
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.id} variant="fade-up" delay={i * 0.08}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
