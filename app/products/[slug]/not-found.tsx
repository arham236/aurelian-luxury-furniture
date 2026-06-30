import Link from "next/link";
import Button from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-center px-margin-mobile py-40 text-center md:px-margin-desktop">
      <span className="text-label-caps text-secondary">404</span>
      <h1 className="mt-4 text-headline-lg-mobile text-primary md:text-headline-lg">
        Product Not Found
      </h1>
      <p className="mt-4 text-body-md text-on-surface-variant">
        The piece you&rsquo;re looking for may have been retired from the
        collection or the link is no longer valid.
      </p>
      <Button href="/" size="lg" className="mt-8">
        Return Home
      </Button>
      <Link
        href="/#shop"
        className="mt-4 text-label-caps text-secondary underline underline-offset-4"
      >
        Browse the Collection
      </Link>
    </div>
  );
}
