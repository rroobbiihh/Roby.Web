"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

const capabilities = [
  {
    title: "Editing",
    body: "Narrative, commercial and music video editing — structure, pacing and rhythm that serve the story, not the timeline.",
  },
  {
    title: "Color",
    body: "Grades built in DaVinci Resolve, from clean broadcast-safe looks to heavy filmic treatments that hold up on every screen.",
  },
  {
    title: "Motion & Sound",
    body: "Title design, speed ramps and seamless VFX in After Effects, with sound design that makes every cut land harder.",
  },
];

export default function Capabilities() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-capability]", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 80%",
            once: true,
          },
        });
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="grid grid-cols-1 gap-12 md:grid-cols-3">
      {capabilities.map(({ title, body }, i) => (
        <div key={title} data-capability>
          <p className="text-sm text-muted">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-3 font-display text-2xl font-bold tracking-tight">
            {title}
            <span className="text-accent">.</span>
          </h3>
          <p className="mt-4 leading-relaxed text-muted">{body}</p>
        </div>
      ))}
    </div>
  );
}
