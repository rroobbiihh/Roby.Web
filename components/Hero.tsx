"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useSyncExternalStore } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const HeroCanvas = dynamic(() => import("@/components/webgl/HeroCanvas"), {
  ssr: false,
});

// WebGL support never changes within a session — probe once, cache the result.
let webglSupport: boolean | undefined;

function getWebglSnapshot(): boolean {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = !!(
        canvas.getContext("webgl2") || canvas.getContext("webgl")
      );
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const emptySubscribe = () => () => {};

export default function Hero() {
  const scope = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const webglOk = useSyncExternalStore(
    emptySubscribe,
    getWebglSnapshot,
    () => false
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to("[data-hero-line] > span", {
          y: 0,
          duration: 1.15,
          stagger: 0.12,
          delay: 0.25,
        })
          .to(
            "[data-hero-meta]",
            { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
            "-=0.6"
          )
          .to("[data-hero-scroll]", { opacity: 1, duration: 0.8 }, "-=0.4");
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-hero-line] > span", { y: 0 });
        gsap.set("[data-hero-meta], [data-hero-scroll]", {
          opacity: 1,
          y: 0,
        });
      });
    },
    { scope }
  );

  const showCanvas = webglOk && !reducedMotion;

  return (
    <section
      ref={scope}
      className="relative flex min-h-svh flex-col justify-end overflow-hidden hero-gradient"
    >
      {showCanvas && <HeroCanvas />}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-40 md:pb-32">
        <p
          data-hero-meta
          className="mb-6 translate-y-4 text-sm uppercase tracking-[0.3em] text-muted opacity-0"
        >
          Video Editor — Manila / Remote
        </p>

        <h1 className="font-display text-[13vw] font-extrabold leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
          <span data-hero-line className="reveal-line">
            <span>Roby</span>
          </span>
          <span data-hero-line className="reveal-line">
            <span>
              De&nbsp;Vera<span className="text-accent">.</span>
            </span>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p
            data-hero-meta
            className="max-w-md translate-y-4 text-lg leading-relaxed text-muted opacity-0"
          >
            Cutting films, campaigns and music videos with rhythm, restraint
            and an obsession for the frame that matters.
          </p>
          <div
            data-hero-meta
            className="flex translate-y-4 items-center gap-6 opacity-0"
          >
            <Link
              href="/portfolio"
              className="border border-line px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
            >
              View Work
            </Link>
            <Link
              href="/contact"
              className="text-sm uppercase tracking-widest text-muted underline-offset-8 transition-colors hover:text-accent hover:underline"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>

      <div
        data-hero-scroll
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 opacity-0"
        aria-hidden="true"
      >
        <div className="h-12 w-px animate-pulse bg-gradient-to-b from-transparent via-muted to-transparent" />
      </div>
    </section>
  );
}
