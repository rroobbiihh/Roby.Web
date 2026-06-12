"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { content } from "@/lib/content";

const capabilities = content.capabilities;

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
      {capabilities.map(({ track, title, body }) => (
        <div key={title} data-capability>
          <span className="inline-block border border-line px-2 py-0.5 text-xs uppercase tracking-[0.2em] text-accent">
            {track}
          </span>
          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">
            {title}
            <span className="text-accent">.</span>
          </h3>
          <p className="mt-4 leading-relaxed text-muted">{body}</p>
        </div>
      ))}
    </div>
  );
}
