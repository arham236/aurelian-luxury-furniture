"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-screen loading veil shown only on the very first visit in a session.
 * Animates the wordmark in, then wipes away to reveal the page. Skipped on
 * subsequent in-session navigations and instantly resolved for users who
 * prefer reduced motion. Locks body scroll for the brief duration it's
 * visible so the page can't be scrolled underneath it before the reveal.
 */
export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const alreadyLoaded = sessionStorage.getItem("aurelian-loaded");
    if (alreadyLoaded || prefersReducedMotion) {
      setIsVisible(false);
      setShouldRender(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = "";
      sessionStorage.setItem("aurelian-loaded", "1");
    }, 1900);

    return () => {
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <AnimatePresence onExitComplete={() => setShouldRender(false)}>
      {isVisible && (
        <motion.div
          className="pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="absolute inset-0 origin-bottom bg-primary"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 1, 0] }}
            transition={{
              duration: 1.8,
              times: [0, 0.35, 0.75, 1],
              ease: [0.83, 0, 0.17, 1],
            }}
            style={{ transformOrigin: "bottom" }}
          />
          <motion.span
            className="relative z-10 text-headline-lg-mobile tracking-[0.08em] text-on-primary md:text-headline-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: [0, 1, 1, 0], y: 0 }}
            transition={{
              duration: 1.8,
              times: [0, 0.3, 0.75, 1],
              ease: "easeInOut",
            }}
          >
            AURELIAN
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
