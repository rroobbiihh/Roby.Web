"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * Re-mounts on every route change, giving each page a short
 * fade-and-rise entrance. Reduced-motion users get an instant swap.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          scope.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
      });
    },
    { scope }
  );

  return <div ref={scope}>{children}</div>;
}
