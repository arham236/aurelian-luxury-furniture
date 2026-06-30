import type { Metadata, Viewport } from "next";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/500-italic.css";
import "@fontsource/playfair-display/600-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import SmoothScrollProvider from "@/components/layout/smooth-scroll-provider";
import { CartProvider } from "@/contexts/cart-context";
import LoadingScreen from "@/components/layout/loading-screen";
import ScrollProgress from "@/components/layout/scroll-progress";
import MouseGlow from "@/components/layout/mouse-glow";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CartDrawer from "@/components/cart/cart-drawer";
import CartToastStack from "@/components/cart/cart-toast";
import AiAssistantLoader from "@/components/ai-assistant/ai-assistant-loader";

const SITE_URL = "https://aurelian-living.example.com";
const SITE_TITLE = "AURELIAN — The Art of Living | Luxury Furniture";
const SITE_DESCRIPTION =
  "Curated luxury furniture for modern sanctuaries. Discover the Aurelian collection — architectural precision meets residential warmth, crafted for spaces that breathe elegance.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | AURELIAN",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "luxury furniture",
    "designer furniture",
    "modern interiors",
    "Italian marble dining table",
    "luxury sofa",
    "bouclé sofa",
    "quiet luxury",
    "Aurelian Living",
  ],
  authors: [{ name: "Aurelian Living" }],
  creator: "Aurelian Living",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Aurelian Living",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/master-bedroom.jpg",
        width: 736,
        height: 1104,
        alt: "Aurelian Living — The Art of Living",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/master-bedroom.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf9f9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <SmoothScrollProvider>
            <LoadingScreen />
            <ScrollProgress />
            <MouseGlow />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <CartToastStack />
            <AiAssistantLoader />
          </SmoothScrollProvider>
        </CartProvider>
      </body>
    </html>
  );
}
