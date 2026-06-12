"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import AccentText from "@/components/AccentText";
import { content } from "@/lib/content";

const { bio, subBio, facts } = content.about;

export default function About() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-about-bio]", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 80%",
            once: true,
          },
        });
        gsap.from("[data-about-fact]", {
          x: -24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 75%",
            once: true,
          },
        });
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-16">
      <div data-about-bio className="md:col-span-3">
        <p className="text-2xl font-medium leading-snug md:text-3xl">
          <AccentText text={bio} />
        </p>
        <p className="mt-6 max-w-xl leading-relaxed text-muted">{subBio}</p>
      </div>

      {/* Clip-properties style metadata panel */}
      <dl className="flex flex-col self-center border-t border-line md:col-span-2">
        {facts.map(({ label, value }) => (
          <div
            key={label}
            data-about-fact
            className="flex items-baseline justify-between gap-6 border-b border-line py-4"
          >
            <dt className="text-xs uppercase tracking-[0.25em] text-muted">
              {label}
            </dt>
            <dd className="text-right font-display font-bold tabular-nums">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
