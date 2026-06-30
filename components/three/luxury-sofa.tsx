"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Cylinder } from "@react-three/drei";
import * as THREE from "three";

type LuxurySofaProps = {
  mouse: { x: number; y: number };
};

/**
 * Stylized luxury sofa silhouette built entirely from primitive geometry
 * (rounded boxes + cylinders), in the spirit of the original Stitch concept
 * but with soft-rounded edges, bouclé-like fabric shading, and a brushed
 * walnut leg material for a more premium finish than flat box geometry.
 *
 * Performance: ~9 RoundedBox meshes at smoothness=4 (~1.5k triangles each)
 * plus 4 low-poly cylinder legs keeps this comfortably under 20k triangles
 * total — trivial for any device that can run WebGL, including mobile.
 * Materials are memoized so they aren't reallocated on every re-render.
 */
export default function LuxurySofa({ mouse }: LuxurySofaProps) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();

    // Gentle ambient float + idle rotation, biased toward a near-frontal
    // 3/4 view so the seat cushions and arms stay legible at all times.
    group.current.position.y = Math.sin(t * 0.5) * 0.05;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      0.18 + mouse.x * 0.25,
      0.04
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      mouse.y * 0.08,
      0.04
    );
  });

  const fabricMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#eae7e2", roughness: 0.85, metalness: 0 }),
    []
  );
  const walnutMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3c2a1d", roughness: 0.4, metalness: 0.05 }),
    []
  );
  const pillowMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#c89a4f", roughness: 0.7 }),
    []
  );

  return (
    <group ref={group} position={[0, -0.3, 0]} scale={1}>
      {/* Seat base */}
      <RoundedBox
        args={[3, 0.5, 1.5]}
        radius={0.12}
        smoothness={4}
        position={[0, 0, 0]}
        material={fabricMaterial}
      />

      {/* Backrest */}
      <RoundedBox
        args={[3, 1.15, 0.4]}
        radius={0.14}
        smoothness={4}
        position={[0, 0.6, -0.55]}
        material={fabricMaterial}
      />

      {/* Seat cushions (3 across, subtle seams) */}
      {[-0.95, 0, 0.95].map((x) => (
        <RoundedBox
          key={x}
          args={[0.88, 0.22, 1.3]}
          radius={0.1}
          smoothness={4}
          position={[x, 0.32, 0.05]}
          material={fabricMaterial}
        />
      ))}

      {/* Arms */}
      <RoundedBox
        args={[0.42, 0.78, 1.5]}
        radius={0.16}
        smoothness={4}
        position={[-1.32, 0.36, 0]}
        material={fabricMaterial}
      />
      <RoundedBox
        args={[0.42, 0.78, 1.5]}
        radius={0.16}
        smoothness={4}
        position={[1.32, 0.36, 0]}
        material={fabricMaterial}
      />

      {/* Legs */}
      {[
        [-1.25, -0.42, 0.55],
        [1.25, -0.42, 0.55],
        [-1.25, -0.42, -0.55],
        [1.25, -0.42, -0.55],
      ].map(([x, y, z]) => (
        <Cylinder
          key={`${x}-${z}`}
          args={[0.045, 0.06, 0.32, 8]}
          position={[x, y, z]}
          material={walnutMaterial}
        />
      ))}

      {/* Decorative throw pillow */}
      <RoundedBox
        args={[0.45, 0.45, 0.18]}
        radius={0.08}
        smoothness={4}
        position={[-0.85, 0.55, 0.4]}
        rotation={[0.1, 0.3, 0.1]}
        material={pillowMaterial}
      />
    </group>
  );
}
