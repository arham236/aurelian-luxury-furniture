"use client";

import { useScrollProgress } from "@/hooks/use-scroll-progress";

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-[2px] w-full bg-transparent"
      aria-hidden
    >
      <div
        className="h-full bg-secondary"
        style={{
          width: `${progress * 100}%`,
          transition: "width 80ms linear",
        }}
      />
    </div>
  );
}
