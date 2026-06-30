import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import Categories from "@/components/sections/categories";
import FeaturedCollection from "@/components/sections/featured-collection";
import NewArrivals from "@/components/sections/new-arrivals";
import WhyChooseUs from "@/components/sections/why-choose-us";
import Testimonials from "@/components/sections/testimonials";
import Newsletter from "@/components/sections/newsletter";

export const metadata: Metadata = {
  title: "The Art of Living",
  description:
    "Curated luxury furniture for modern sanctuaries — sofas, dining, bedroom, and accent pieces crafted from the finest materials.",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedCollection />
      <NewArrivals />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </>
  );
}
