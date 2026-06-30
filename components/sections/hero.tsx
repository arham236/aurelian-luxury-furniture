"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Button from "@/components/ui/button";
import HeroSceneLoader from "@/components/three/hero-scene-loader";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.8], [0.6, 0.1]);

  return (
    <header
      id="top"
      ref={sectionRef}
      className="relative flex h-screen min-h-[800px] w-full flex-col overflow-hidden bg-surface-container-low pt-20 md:pt-0"
    >
      <motion.div
        style={{ opacity: sceneOpacity }}
        className="absolute inset-x-0 bottom-0 h-[42%] min-h-[280px] md:h-[68%]"
      >
        <HeroSceneLoader />
      </motion.div>

      {/* Soft top fade so the 3D piece's container edge blends with the page background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, var(--color-surface-container-low) 0%, transparent 16%)",
        }}
      />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 mx-auto flex w-full max-w-[800px] flex-col items-center px-margin-mobile pt-24 text-center md:px-margin-desktop md:pt-32"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 text-label-caps text-secondary"
        >
          The 2026 Atelier Collection
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 text-headline-xl leading-tight text-primary drop-shadow-sm"
        >
          The Art of Living
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 max-w-[500px] text-body-lg text-on-surface-variant"
        >
          Curated luxury furniture for modern sanctuaries.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
        >
          <Button href="#shop" size="lg">
            Shop Now
          </Button>
          <Button href="#collections" variant="secondary" size="lg">
            Explore Collection
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-on-surface-variant md:flex"
      >
        <span className="text-label-caps">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-on-surface-variant to-transparent" />
      </motion.div>
    </header>
  );
}
