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
  role: string;
  tools: string[];
  description: string;
  /** Featured projects appear on the home page (first 4 recommended) */
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "neon-districts",
    title: "Neon Districts",
    year: "2025",
    client: "Aperture Apparel",
    thumbnail: "/thumbs/project-01.svg",
    videoUrl: "https://www.youtube.com/watch?v=PLACEHOLDER01",
    type: "youtube",
    role: "Lead Editor & Colorist",
    tools: ["Premiere Pro", "DaVinci Resolve", "After Effects"],
    description:
      "A nocturnal brand film cut to a half-time beat — neon storefronts, rain-slick streets and 120fps inserts. Edited for rhythm first: every cut lands on or deliberately around the downbeat.",
    featured: true,
  },
  {
    id: "salt-and-smoke",
    title: "Salt & Smoke",
    year: "2025",
    client: "Independent",
    thumbnail: "/thumbs/project-02.svg",
    videoUrl: "https://vimeo.com/76979871",
    type: "vimeo",
    role: "Editor",
    tools: ["Premiere Pro", "DaVinci Resolve"],
    description:
      "A 12-minute documentary short following a third-generation smokehouse. Built from 14 hours of vérité footage — the edit leans on long takes and ambient sound beds to let the place breathe.",
    featured: true,
  },
  {
    id: "afterglow-mv",
    title: "Afterglow",
    year: "2024",
    client: "Vela (Music Video)",
    thumbnail: "/thumbs/project-03.svg",
    videoUrl: "https://www.youtube.com/watch?v=PLACEHOLDER03",
    type: "youtube",
    role: "Editor & VFX",
    tools: ["Premiere Pro", "After Effects"],
    description:
      "Music video cut around a single continuous dolly move, intercut with 8mm scans. Speed-ramped transitions hide the seams; grain and gate-weave matched in After Effects.",
    featured: true,
  },
  {
    id: "form-and-function",
    title: "Form & Function",
    year: "2024",
    client: "Kessler Studio",
    thumbnail: "/thumbs/project-04.svg",
    videoUrl: "/videos/form-and-function.mp4",
    type: "self-hosted",
    role: "Editor & Sound Design",
    tools: ["Premiere Pro", "Audition"],
    description:
      "Product launch film for a furniture studio. Macro textures cut against full-room reveals — sound design carries the transitions: every material has its own foley signature.",
    featured: true,
  },
  {
    id: "north-of-nowhere",
    title: "North of Nowhere",
    year: "2024",
    client: "Wander Co.",
    thumbnail: "/thumbs/project-05.svg",
    videoUrl: "https://vimeo.com/PLACEHOLDER05",
    type: "vimeo",
    role: "Editor & Colorist",
    tools: ["DaVinci Resolve"],
    description:
      "Travel film shot across the Lofoten Islands. Edited and graded entirely in Resolve — a cold, desaturated palette that cracks open into warmth for the final act.",
  },
  {
    id: "thread-count",
    title: "Thread Count",
    year: "2024",
    client: "MUSE Magazine",
    thumbnail: "/thumbs/project-06.svg",
    videoUrl: "https://www.youtube.com/watch?v=PLACEHOLDER06",
    type: "youtube",
    role: "Editor",
    tools: ["Premiere Pro", "After Effects"],
    description:
      "Fashion editorial cut to feel like a flip-book: hard cuts on pose changes, typography slammed between frames, zero dissolves. 45 seconds, 90 cuts.",
  },
  {
    id: "the-long-table",
    title: "The Long Table",
    year: "2023",
    client: "Harvest & Co.",
    thumbnail: "/thumbs/project-07.svg",
    videoUrl: "/videos/the-long-table.mp4",
    type: "self-hosted",
    role: "Editor",
    tools: ["Premiere Pro", "DaVinci Resolve"],
    description:
      "Event recap for a 200-guest open-air dinner. A golden-hour piece assembled overnight for next-morning delivery — proof that fast and considered aren't opposites.",
  },
  {
    id: "static-bloom",
    title: "Static Bloom",
    year: "2023",
    client: "Short Film",
    thumbnail: "/thumbs/project-08.svg",
    videoUrl: "https://vimeo.com/PLACEHOLDER08",
    type: "vimeo",
    role: "Editor & Colorist",
    tools: ["Premiere Pro", "DaVinci Resolve"],
    description:
      "A 9-minute short about a radio operator who hears tomorrow's broadcast. The edit plays with repetition and off-by-one-frame echoes to keep the audience slightly out of sync.",
  },
  {
    id: "process-series",
    title: "Process — Studio Series",
    year: "2023",
    client: "Roby De Vera (YouTube)",
    thumbnail: "/thumbs/project-09.svg",
    videoUrl: "https://www.youtube.com/watch?v=PLACEHOLDER09",
    type: "youtube",
    role: "Director & Editor",
    tools: ["Premiere Pro", "After Effects", "Audition"],
    description:
      "Ongoing YouTube series breaking down editing decisions in real projects — timeline anatomy, sound-led cuts, and why some frames need to die.",
  },
  {
    id: "showreel-2025",
    title: "Showreel 2025",
    year: "2025",
    client: "Roby De Vera",
    thumbnail: "/thumbs/project-10.svg",
    videoUrl: "/videos/showreel-2025.mp4",
    type: "self-hosted",
    role: "Editor",
    tools: ["Premiere Pro", "After Effects", "DaVinci Resolve"],
    description:
      "Sixty seconds of selected work from the last two years, recut to a single track. Watch with sound on.",
  },
];

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
