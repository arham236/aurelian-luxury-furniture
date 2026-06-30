"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

let registered = false;

export function ensureGsapRegistered() {
  if (registered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Bridges Lenis's virtual scroll with GSAP's ScrollTrigger so animations
 * pinned/triggered by scroll position stay perfectly in sync with the
 * smooth-scroll easing instead of the raw native scroll event.
 */
export function bridgeLenisToScrollTrigger(lenis: Lenis | null) {
  ensureGsapRegistered();
  if (!lenis) return () => {};

  lenis.on("scroll", ScrollTrigger.update);

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tickerCallback);
  };
}

export { gsap, ScrollTrigger };
