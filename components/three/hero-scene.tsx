"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { ContactShadows, PresentationControls } from "@react-three/drei";
import LuxurySofa from "@/components/three/luxury-sofa";
import { useMousePosition } from "@/hooks/use-mouse-position";

/**
 * Keeps the sofa fully framed regardless of the canvas container's aspect
 * ratio (the hero canvas is short+wide on desktop, short+narrow on mobile).
 * Pulls the camera back along Z when the viewport is narrow/short so the
 * ~3-unit-wide piece never clips off the edges.
 */
function ResponsiveCamera() {
  const { camera, size } = useThree();

  useFrame(() => {
    const aspect = size.width / size.height;
    // Reference: at aspect 1.8 (typical desktop hero strip), z=6.5 frames
    // the piece comfortably. Narrower aspects need more distance.
    const targetZ = aspect >= 1.8 ? 6.5 : 6.5 + (1.8 - aspect) * 3.2;
    camera.position.z += (Math.min(targetZ, 13) - camera.position.z) * 0.1;
    camera.updateProjectionMatrix();
  });

  return null;
}

function SceneContent() {
  const mousePosition = useMousePosition();
  const mouseRef = useRef({ x: 0, y: 0 });

  if (typeof window !== "undefined" && mousePosition) {
    mouseRef.current.x = mousePosition.x / window.innerWidth - 0.5;
    mouseRef.current.y = mousePosition.y / window.innerHeight - 0.5;
  }

  return (
    <>
      {/* Hand-authored three-point studio lighting (no external HDRI
          dependency, keeping the scene fully self-contained / offline-safe) */}
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 8, 6]} intensity={1.5} />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#fff6e8" />
      <spotLight position={[-4, 5, 4]} intensity={0.5} angle={0.5} penumbra={1} />
      <pointLight position={[0, 2, -3]} intensity={0.25} color="#e9c176" />

      <ResponsiveCamera />
      <LuxurySofa mouse={mouseRef.current} />

      <ContactShadows
        position={[0, -0.95, 0]}
        opacity={0.4}
        scale={9}
        blur={2.2}
        far={2}
      />
    </>
  );
}

/**
 * Immersive 3D showcase, rendered inside a container that occupies only the
 * lower portion of the hero viewport (see Hero.tsx) so it never competes
 * with the headline copy above it. The sofa gently floats and tracks the
 * cursor for an "alive" showroom feel; PresentationControls additionally
 * lets visitors deliberately drag/rotate the piece.
 *
 * Performance notes:
 * - frameloop pauses entirely once the canvas scrolls out of view (an
 *   IntersectionObserver flips `active`), so the GPU does zero work for
 *   this scene anywhere past the hero section.
 * - dpr is capped at 2 to avoid wasting fill-rate on very high-density
 *   displays for a scene this size.
 * - shadows render once via ContactShadows' baked plane rather than a
 *   live shadow map per light, keeping draw calls minimal.
 */
export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [isLowPower, setIsLowPower] = useState(false);
  const [isTouchPrimary, setIsTouchPrimary] = useState(false);

  useEffect(() => {
    // Heuristic: devices with few logical cores are typically lower-end
    // mobile/tablet hardware. Cap DPR and skip MSAA there to keep the
    // fragment-shader cost low instead of rendering at full 2x density.
    const cores = navigator.hardwareConcurrency ?? 4;
    setIsLowPower(cores <= 4);

    // Touch-primary devices (no hover capability) should be able to swipe
    // straight through the hero to scroll the page. Drag-to-rotate via
    // PresentationControls would otherwise capture that gesture and rotate
    // the sofa instead of scrolling — disable it there; the idle
    // float/cursor-follow animation still runs for everyone regardless.
    setIsTouchPrimary(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0.5, 6.5], fov: 34 }}
        dpr={isLowPower ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: !isLowPower,
          alpha: true,
          powerPreference: "high-performance",
        }}
        frameloop={active ? "always" : "never"}
        className="!touch-auto"
      >
        <Suspense fallback={null}>
          <PresentationControls
            enabled={!isTouchPrimary}
            global
            cursor={false}
            snap
            speed={1.2}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[-0.1, 0.15]}
            azimuth={[-0.4, 0.4]}
          >
            <SceneContent />
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>
  );
}
