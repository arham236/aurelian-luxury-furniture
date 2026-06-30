import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allProducts,
  getProductBySlug,
  getProductSlug,
  getRelatedProducts,
} from "@/data/products";
import ProductGallery from "@/components/ui/product-gallery";
import ProductInfo from "@/components/ui/product-info";
import ProductTabs from "@/components/ui/product-tabs";
import RelatedProducts from "@/components/ui/related-products";
import RecentlyViewed from "@/components/ui/recently-viewed";
import RecordRecentlyViewed from "@/components/ui/record-recently-viewed";

type ProductPageParams = {
  params: Promise<{ slug: string }>;
};

/** Pre-renders every known product page at build time as static content. */
export function generateStaticParams() {
  return allProducts.map((product) => ({ slug: getProductSlug(product) }));
}

export async function generateMetadata({
  params,
}: ProductPageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageParams) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const related = getRelatedProducts(product, 4);

  return (
    <div className="mx-auto max-w-[1440px] px-margin-mobile pt-32 pb-20 md:px-margin-desktop md:pt-40">
      <RecordRecentlyViewed slug={getProductSlug(product)} />

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
        <ProductGallery images={images} productName={product.name} />
        <ProductInfo product={product} />
      </div>

      <div className="mt-16 md:mt-24">
        <ProductTabs product={product} />
      </div>

      <RelatedProducts products={related} />
      <RecentlyViewed currentSlug={getProductSlug(product)} />
    </div>
  );
}
