"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/data/projects";

export default function ProjectCard({
  project,
  index,
  priority = false,
}: {
  project: Project;
  index: number;
  priority?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);

  const playPreview = () => {
    video.current?.play().catch(() => {});
  };

  const stopPreview = () => {
    const el = video.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
  };

  return (
    <Link
      href={`/portfolio/${project.id}`}
      data-card
      className="group block"
      onMouseEnter={project.previewUrl ? playPreview : undefined}
      onMouseLeave={project.previewUrl ? stopPreview : undefined}
      onFocus={project.previewUrl ? playPreview : undefined}
      onBlur={project.previewUrl ? stopPreview : undefined}
    >
      <div className="relative aspect-video overflow-hidden bg-surface">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {project.previewUrl && (
          <video
            ref={video}
            src={project.previewUrl}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute bottom-4 right-4 text-xs uppercase tracking-widest text-ink opacity-0 transition-all duration-500 group-hover:opacity-100">
          Watch <span className="text-accent">→</span>
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl font-bold tracking-tight transition-colors group-hover:text-accent md:text-2xl">
          <span className="mr-3 text-sm font-normal text-muted">
            {String(index + 1).padStart(2, "0")}
          </span>
          {project.title}
        </h3>
        <span className="shrink-0 text-sm text-muted">{project.year}</span>
      </div>
      <p className="mt-1 text-sm text-muted">{project.role}</p>
    </Link>
  );
}
