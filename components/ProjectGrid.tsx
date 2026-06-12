"use client";

import { useRef } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/data/projects";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          gsap.from(card, {
            y: 56,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          });
        });
      });
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20"
    >
      {projects.map((project, i) => (
        <div key={project.id} className={i % 2 === 1 ? "md:mt-16" : ""}>
          <ProjectCard project={project} index={i} priority={i < 2} />
        </div>
      ))}
    </div>
  );
}
