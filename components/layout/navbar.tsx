"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/layout/smooth-scroll-provider";
import CartButton from "@/components/layout/cart-button";

const NAV_LINKS = [
  { label: "Collections", href: "#collections" },
  { label: "Living", href: "#shop" },
  { label: "Bedroom", href: "#shop" },
  { label: "Dining", href: "#shop" },
  { label: "Atelier", href: "#standard" },
];

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lenis } = useLenis();
  const router = useRouter();

  useEffect(() => {
    let lastScroll = 0;

    function handleScroll(scrollY: number) {
      setScrolled(scrollY > 8);
      if (scrollY <= 80) {
        setHidden(false);
      } else if (scrollY > lastScroll) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScroll = scrollY;
    }

    if (lenis) {
      const onScroll = () => handleScroll(window.scrollY);
      lenis.on("scroll", onScroll);
      return () => lenis.off("scroll", onScroll);
    }

    const onNativeScroll = () => handleScroll(window.scrollY);
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    return () => window.removeEventListener("scroll", onNativeScroll);
  }, [lenis]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);

    if (!target) {
      // The section isn't on this page (e.g. we're on a product detail
      // page) — navigate home and let the browser/Next.js handle landing
      // on that hash once the homepage's sections exist in the DOM.
      router.push(`/${href}`);
      return;
    }

    if (lenis) {
      lenis.scrollTo(target as HTMLElement, { offset: -24, duration: 1.4 });
    } else {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      {/* Desktop nav */}
      <motion.nav
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed left-1/2 top-4 z-50 hidden w-[calc(100%-48px)] max-w-[1440px] -translate-x-1/2 items-center justify-between rounded-full border border-white/20 px-10 py-4 transition-shadow duration-300 md:flex",
          scrolled ? "glass shadow-level-2" : "bg-transparent"
        )}
      >
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, "#top")}
          className="text-headline-lg tracking-tight text-primary"
        >
          AURELIAN
        </a>
        <div className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-label-caps text-on-surface-variant/70 transition-all duration-300 hover:text-primary hover:opacity-80"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-6 text-primary">
          <button aria-label="Search" className="transition-opacity hover:opacity-70">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button aria-label="Wishlist" className="transition-opacity hover:opacity-70">
            <Heart size={20} strokeWidth={1.5} />
          </button>
          <CartButton />
        </div>
      </motion.nav>

      {/* Mobile nav */}
      <nav
        className={cn(
          "fixed left-1/2 top-4 z-50 flex w-[calc(100%-32px)] -translate-x-1/2 items-center justify-between rounded-full border border-white/20 px-6 py-3.5 transition-all duration-300 md:hidden",
          scrolled || menuOpen ? "glass shadow-level-2" : "bg-surface/60"
        )}
      >
        <a
          href="#top"
          onClick={(e) => handleNavClick(e, "#top")}
          className="text-headline-lg-mobile text-[20px] tracking-tight text-primary"
        >
          AURELIAN
        </a>
        <div className="flex items-center gap-4">
          <CartButton size={22} />
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="text-primary"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl md:hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-full flex-col items-center justify-center gap-8 px-margin-mobile"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.4 }}
                  className="text-headline-lg-mobile text-primary"
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="mt-8 flex items-center gap-8 text-primary">
                <button aria-label="Search"><Search size={22} strokeWidth={1.5} /></button>
                <button aria-label="Wishlist"><Heart size={22} strokeWidth={1.5} /></button>
                <CartButton size={22} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
