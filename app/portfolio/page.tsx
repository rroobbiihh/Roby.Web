import type { Metadata } from "next";
import ProjectGrid from "@/components/ProjectGrid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected video editing work by Roby De Vera — brand films, documentaries, music videos and more.",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-36 md:pb-36 md:pt-44">
      <div className="mb-14 md:mb-24">
        <p className="text-sm uppercase tracking-[0.3em] text-muted">
          {projects.length} projects
        </p>
        <h1 className="mt-4 font-display text-6xl font-extrabold tracking-tight md:text-8xl">
          Work<span className="text-accent">.</span>
        </h1>
      </div>
      <ProjectGrid projects={projects} />
    </div>
  );
}
