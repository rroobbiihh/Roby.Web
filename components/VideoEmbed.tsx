import type { Project } from "@/data/projects";

function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  );
  return match?.[1] ?? null;
}

function vimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\w+)/);
  return match?.[1] ?? null;
}

export default function VideoEmbed({ project }: { project: Project }) {
  const { type, videoUrl, title, thumbnail } = project;

  if (type === "youtube") {
    const id = youtubeId(videoUrl);
    if (!id) return <EmbedFallback message="Invalid YouTube URL" />;
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-surface">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  if (type === "vimeo") {
    const id = vimeoId(videoUrl);
    if (!id) return <EmbedFallback message="Invalid Vimeo URL" />;
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-surface">
        <iframe
          src={`https://player.vimeo.com/video/${id}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <video
      controls
      playsInline
      preload="metadata"
      poster={thumbnail}
      className="aspect-video w-full bg-surface object-cover"
    >
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

function EmbedFallback({ message }: { message: string }) {
  return (
    <div className="flex aspect-video w-full items-center justify-center bg-surface text-sm text-muted">
      {message}
    </div>
  );
}
