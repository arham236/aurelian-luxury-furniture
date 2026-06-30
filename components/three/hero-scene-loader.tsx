"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-2 w-2 animate-pulse rounded-full bg-secondary/40" />
    </div>
  ),
});

/**
 * Client-only entry point for the 3D hero. Three.js / R3F / drei are
 * relatively heavy, so this is dynamically imported (code-split out of the
 * main bundle) and never server-rendered, since WebGL requires a browser.
 */
export default function HeroSceneLoader() {
  return <HeroScene />;
}
