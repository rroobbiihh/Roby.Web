import Link from "next/link";
import Hero from "@/components/Hero";
import ProjectGrid from "@/components/ProjectGrid";
import About from "@/components/About";
import Capabilities from "@/components/Capabilities";
import RulerMarquee from "@/components/editor/RulerMarquee";
import { featuredProjects } from "@/data/projects";

export default function Home() {
  return (
    <>
      <Hero />

      <RulerMarquee />

      <section className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        <div className="mb-14 flex items-end justify-between gap-6 md:mb-20">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted">
              Seq 01 — Selects
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-6xl">
              Selected Work<span className="text-accent">.</span>
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="shrink-0 text-sm uppercase tracking-widest text-muted underline-offset-8 transition-colors hover:text-accent hover:underline"
          >
            All work →
          </Link>
        </div>
        <ProjectGrid projects={featuredProjects} />
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Seq 02 — Source
          </p>
          <h2 className="mb-14 mt-3 font-display text-4xl font-bold tracking-tight md:mb-20 md:text-6xl">
            About<span className="text-accent">.</span>
          </h2>
          <About />
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Seq 03 — Tracks
          </p>
          <h2 className="mb-14 mt-3 font-display text-4xl font-bold tracking-tight md:mb-20 md:text-6xl">
            What I do<span className="text-accent">.</span>
          </h2>
          <Capabilities />
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-36">
          <p className="text-sm uppercase tracking-[0.3em] text-muted">
            Seq 04 — Export · Currently booking
          </p>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Have a story that needs cutting
            <span className="text-accent">?</span>
          </h2>
          <Link
            href="/contact"
            className="mt-10 inline-block border border-line px-10 py-4 text-sm uppercase tracking-widest transition-colors hover:border-accent hover:text-accent"
          >
            Start a project
          </Link>
        </div>
      </section>
    </>
  );
}
