import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VideoEmbed from "@/components/VideoEmbed";
import { getAdjacentProjects, getProject, projects } from "@/data/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: `${project.title} — Roby De Vera`,
      description: project.description,
      images: [{ url: project.thumbnail }],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <article className="mx-auto max-w-6xl px-6 pb-24 pt-36 md:pb-36 md:pt-44">
      <Link
        href="/portfolio"
        className="text-sm uppercase tracking-widest text-muted transition-colors hover:text-accent"
      >
        ← All work
      </Link>

      <header className="mb-12 mt-8 md:mb-16">
        <p className="text-sm uppercase tracking-[0.3em] text-muted">
          {project.client} — {project.year}
        </p>
        <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight md:text-7xl">
          {project.title}
          <span className="text-accent">.</span>
        </h1>
      </header>

      <VideoEmbed project={project} />

      <div className="mt-12 grid grid-cols-1 gap-12 md:mt-16 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-sm uppercase tracking-widest text-muted">
            About this project
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed">
            {project.description}
          </p>
        </div>

        <dl className="flex flex-col gap-8">
          <div>
            <dt className="text-sm uppercase tracking-widest text-muted">
              Role
            </dt>
            <dd className="mt-2">{project.role}</dd>
          </div>
          <div>
            <dt className="text-sm uppercase tracking-widest text-muted">
              Tools
            </dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="border border-line px-3 py-1 text-sm text-muted"
                >
                  {tool}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>

      <nav className="mt-20 flex items-center justify-between border-t border-line pt-10 md:mt-28">
        {prev ? (
          <Link
            href={`/portfolio/${prev.id}`}
            className="group max-w-[45%] text-left"
          >
            <span className="text-xs uppercase tracking-widest text-muted">
              ← Previous
            </span>
            <span className="mt-1 block truncate font-display font-bold transition-colors group-hover:text-accent">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/portfolio/${next.id}`}
            className="group max-w-[45%] text-right"
          >
            <span className="text-xs uppercase tracking-widest text-muted">
              Next →
            </span>
            <span className="mt-1 block truncate font-display font-bold transition-colors group-hover:text-accent">
              {next.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
