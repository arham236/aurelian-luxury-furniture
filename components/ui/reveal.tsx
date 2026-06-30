"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ensureGsapRegistered } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Animation style. "fade-up" works for most blocks; "fade" for images/cards. */
  variant?: "fade-up" | "fade" | "scale";
  delay?: number;
  /** Stagger reveal of direct children instead of animating the wrapper as one block. */
  stagger?: boolean;
  as?: "div" | "section";
};

/**
 * Wraps content in a GSAP ScrollTrigger-driven reveal: elements animate in
 * once as they cross into the viewport, then stay put (no replay on
 * scroll-back, which keeps the "editorial reveal" feeling premium rather
 * than gimmicky). Respects prefers-reduced-motion globally via CSS, and
 * additionally skips the animated-out initial state for that case so
 * content is never stuck invisible.
 */
export default function Reveal({
  children,
  className,
  variant = "fade-up",
  delay = 0,
  stagger = false,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | HTMLElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const targets = stagger ? Array.from(el.children) : el;

    const fromVars =
      variant === "fade-up"
        ? { opacity: 0, y: 40 }
        : variant === "scale"
        ? { opacity: 0, scale: 0.94 }
        : { opacity: 0 };

    gsap.set(targets, fromVars);

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      delay,
      ease: "power3.out",
      stagger: stagger ? 0.12 : 0,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [variant, delay, stagger]);

  if (as === "section") {
    return (
      <section ref={ref as React.RefObject<HTMLElement>} className={className}>
        {children}
      </section>
    );
  }

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
}
