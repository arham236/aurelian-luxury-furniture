"use client";

import { useEffect, useRef } from "react";

/**
 * A soft, warm radial-gradient glow that trails the cursor across the whole
 * page. Purely decorative — sits in a fixed layer above content but below
 * the navbar/UI, with pointer-events disabled so it never blocks clicks.
 * Uses direct DOM mutation (not React state) to stay at 60fps without
 * triggering re-renders, and is skipped entirely for touch-only devices
 * and users who prefer reduced motion.
 */
export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouchOnly = window.matchMedia("(hover: none)").matches;
    if (prefersReducedMotion || isTouchOnly) return;

    const el = glowRef.current;
    if (!el) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafId: number;

    function handleMove(e: PointerEvent) {
      targetX = e.clientX;
      targetY = e.clientY;
    }

    function tick() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      el!.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", handleMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
    >
      <div
        ref={glowRef}
        className="absolute -left-[300px] -top-[300px] h-[600px] w-[600px] rounded-full opacity-[0.35] mix-blend-multiply will-change-transform"
        style={{
          background:
            "radial-gradient(circle, var(--color-secondary-fixed) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
