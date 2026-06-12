import projectsJson from "@/data/projects.json";

export type ProjectType = "youtube" | "vimeo" | "self-hosted";

export interface Project {
  /** Used as the URL slug: /portfolio/[id] */
  id: string;
  title: string;
  year: string;
  client: string;
  /** Path under /public (or remote URL) for the grid thumbnail */
  thumbnail: string;
  /**
   * Optional short, muted MP4 that plays on hover in the grid.
   * Leave undefined to fall back to a still-image hover effect.
   */
  previewUrl?: string;
  /**
   * - youtube:      any watch/share URL, e.g. https://www.youtube.com/watch?v=XXXX
   * - vimeo:        e.g. https://vimeo.com/123456789
   * - self-hosted:  path under /public, e.g. /videos/my-cut.mp4
   */
  videoUrl: string;
  type: ProjectType;
  /** Display runtime, mm:ss — shown on clip badges and the project page */
  duration: string;
  role: string;
  tools: string[];
  description: string;
  /** Featured projects appear on the home page (first 4 recommended) */
  featured?: boolean;
}

// Content lives in projects.json so the /studio portal can edit it.
export const projects = projectsJson as unknown as Project[];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getAdjacentProjects(id: string): {
  prev: Project | undefined;
  next: Project | undefined;
} {
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: projects[index - 1],
    next: projects[index + 1],
  };
}
