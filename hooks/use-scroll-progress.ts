"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/components/layout/smooth-scroll-provider";

/** Returns scroll progress as a 0–1 value, updated on every Lenis scroll tick. */
export function useScrollProgress() {
  const { lenis } = useLenis();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function updateNative() {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(1, window.scrollY / docHeight) : 0);
    }

    if (lenis) {
      const handleScroll = () => setProgress(lenis.progress);
      lenis.on("scroll", handleScroll);
      handleScroll();
      return () => {
        lenis.off("scroll", handleScroll);
      };
    }

    window.addEventListener("scroll", updateNative, { passive: true });
    updateNative();
    return () => window.removeEventListener("scroll", updateNative);
  }, [lenis]);

  return progress;
}

