"use client";

import { useEffect, useState } from "react";

type Point = { x: number; y: number };

/** Tracks pointer position in viewport px. Returns null until first move (avoids SSR/initial flash). */
export function useMousePosition() {
  const [position, setPosition] = useState<Point | null>(null);

  useEffect(() => {
    function handleMove(e: PointerEvent) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return position;
}
